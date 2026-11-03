/**
 * Firebase Storage Service
 * Handles uploading files, calculating metadata, generating download URLs,
 * with bounded timeout limits, path sanitization, and resilient fallback.
 */
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';
import { MediaType } from '../types';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

export function detectMediaType(mimeType: string, fileName: string): MediaType {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('pano') || lowerName.includes('360')) {
    return 'panorama';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return 'pdf';
  }
  if (lowerName.endsWith('.glb') || lowerName.endsWith('.gltf') || lowerName.endsWith('.obj')) {
    return '3d_model';
  }
  return 'document';
}

/**
 * Sanitize folder and file names to prevent invalid storage paths or traversal
 */
export function sanitizeStoragePath(folder: string = 'media', fileName: string): string {
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^\/+|\/+$/g, '') || 'media';
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  return `${cleanFolder}/${timestamp}_${cleanName}`;
}

/**
 * Convert file to base64 Data URL for robust offline/storage-unreachable fallback
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a media file to Firebase Storage.
 * Configured with strict timeout prevention and graceful inline fallback if Cloud Storage
 * encounters network retry-limit-exceeded or unprovisioned bucket responses.
 */
export async function uploadMediaFile(
  file: File,
  folder: string = 'media',
  onProgress?: UploadProgressCallback
): Promise<{
  downloadUrl: string;
  storagePath: string;
  size: number;
  mimeType: string;
  type: MediaType;
  fileName: string;
  isInlineFallback?: boolean;
}> {
  if (!file) {
    throw new Error('Chưa có tệp tin nào được chọn.');
  }

  const storagePath = sanitizeStoragePath(folder, file.name);
  const detectedType = detectMediaType(file.type, file.name);
  const storageRef = ref(storage, storagePath);

  // Maximum time (ms) to allow Firebase Storage upload before timing out to fallback
  const UPLOAD_TIMEOUT_MS = 6000;

  try {
    // 1. Attempt upload to real Firebase Storage with bounded timeout
    const uploadResult = await new Promise<{ downloadUrl: string; storagePath: string }>(
      (resolve, reject) => {
        let isSettled = false;
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type || 'application/octet-stream',
        });

        // Set safety timer to cancel upload if network hangs or retries infinitely
        const timeoutTimer = setTimeout(() => {
          if (!isSettled) {
            isSettled = true;
            try {
              uploadTask.cancel();
            } catch {
              // ignore
            }
            reject(
              new Error('Firebase Storage timeout: operation exceeded connection limit')
            );
          }
        }, UPLOAD_TIMEOUT_MS);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (onProgress && snapshot.totalBytes > 0) {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              onProgress(progress);
            }
          },
          (error) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeoutTimer);
              reject(error);
            }
          },
          async () => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeoutTimer);
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({ downloadUrl, storagePath });
              } catch (err) {
                reject(err);
              }
            }
          }
        );
      }
    );

    return {
      downloadUrl: uploadResult.downloadUrl,
      storagePath: uploadResult.storagePath,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      type: detectedType,
      fileName: file.name,
      isInlineFallback: false,
    };
  } catch (storageErr: any) {
    console.warn(
      `[StorageService] Cloud Storage upload failed or timed out (${storageErr?.code || storageErr?.message || storageErr}). Switching to high-res inline Data URL fallback.`
    );

    // 2. Seamless Inline Data URL Fallback
    // Allows administrators to upload, preview, and save images immediately without blocking the application.
    try {
      if (onProgress) {
        onProgress(50);
      }
      const dataUrl = await fileToDataUrl(file);
      if (onProgress) {
        onProgress(100);
      }

      return {
        downloadUrl: dataUrl,
        storagePath: `inline/${storagePath}`,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        type: detectedType,
        fileName: file.name,
        isInlineFallback: true,
      };
    } catch (fallbackErr: any) {
      console.error('[StorageService] Fallback reading failed:', fallbackErr);
      throw new Error(
        `Không thể tải tệp tin lên: ${storageErr?.message || 'Lỗi kết nối Firebase Storage'}`
      );
    }
  }
}

/**
 * Delete a media file from Firebase Storage
 */
export async function deleteMediaFile(storagePath: string): Promise<void> {
  // If stored as inline fallback, no cloud deletion required
  if (!storagePath || storagePath.startsWith('inline/') || storagePath.startsWith('data:')) {
    return;
  }

  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn(`Could not delete storage file at ${storagePath}:`, err);
  }
}
