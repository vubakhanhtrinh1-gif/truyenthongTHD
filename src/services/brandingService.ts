/**
 * School Branding Management Service
 * Provides real-time synchronization of the official school logo across CMD Admin,
 * Main Hall Lobby, Entrance Gate, Public Website, and 3D scenes.
 */
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { SchoolBranding } from '../types';

const BRANDING_DOC_PATH = 'site_settings/branding';
const CACHE_KEY = 'cosmic_school_branding';
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max

/**
 * Validate an uploaded logo file
 */
export function validateLogoFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Chưa chọn tệp tin nào.' };
  }

  const fileName = file.name.toLowerCase();
  const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!hasAllowedExt) {
    return {
      valid: false,
      error: 'Định dạng tệp không hợp lệ. Vui lòng chọn tệp PNG, JPEG/JPG hoặc WebP.',
    };
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Loại tệp MIME (${file.type}) không được hỗ trợ. Vui lòng tải ảnh PNG, JPG hoặc WebP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Dung lượng tệp quá lớn (${sizeMb} MB). Giới hạn tối đa cho phép là 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Measure image dimensions asynchronously
 */
export function measureImageDimensions(fileOrUrl: File | string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(url);
      }
    };

    img.src = url;
  });
}

/**
 * Convert file to base64 Data URL for robust offline/storage-independent fallback
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
 * Read cached branding from localStorage
 */
export function getCachedBranding(): SchoolBranding | null {
  try {
    const item = localStorage.getItem(CACHE_KEY);
    return item ? (JSON.parse(item) as SchoolBranding) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch current branding from Firestore
 */
export async function getSchoolBranding(): Promise<SchoolBranding | null> {
  try {
    const docRef = doc(db, 'site_settings', 'branding');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return getCachedBranding();
    }
    const data = { id: snap.id, ...snap.data() } as SchoolBranding;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
    return data;
  } catch (err) {
    console.warn('Could not fetch branding from Firestore, using cache', err);
    return getCachedBranding();
  }
}

/**
 * Subscribe to real-time branding changes
 */
export function subscribeSchoolBranding(
  callback: (branding: SchoolBranding | null) => void
): () => void {
  const docRef = doc(db, 'site_settings', 'branding');
  
  // Immediately provide cached value to avoid flash
  const cached = getCachedBranding();
  if (cached) {
    callback(cached);
  }

  const unsubscribe = onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as SchoolBranding;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
        callback(data);
      } else {
        localStorage.removeItem(CACHE_KEY);
        callback(null);
      }
    },
    (error) => {
      console.warn('Real-time branding snapshot error:', error);
      callback(getCachedBranding());
    }
  );

  return unsubscribe;
}

/**
 * Upload and save official school logo
 */
export async function uploadAndSaveSchoolLogo(
  file: File,
  uploadedBy?: string,
  onProgress?: (percent: number) => void
): Promise<SchoolBranding> {
  const validation = validateLogoFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const dimensions = await measureImageDimensions(file);
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `branding/${timestamp}_${cleanName}`;
  let downloadUrl = '';

  try {
    // 1. Try Firebase Storage upload
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/png',
    });

    downloadUrl = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(pct);
          }
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  } catch (storageErr) {
    console.warn('Firebase Storage upload failed or restricted, using base64 fallback:', storageErr);
    // 2. Fallback to inline Data URL so branding never breaks
    downloadUrl = await fileToDataUrl(file);
  }

  const brandingData: SchoolBranding = {
    id: 'branding',
    logoUrl: downloadUrl,
    storagePath: storagePath.startsWith('branding/') ? storagePath : undefined,
    fileName: file.name,
    fileSize: file.size,
    dimensions,
    mimeType: file.type || 'image/png',
    updatedAt: new Date().toISOString(),
    uploadedBy: uploadedBy || 'Administrator',
  };

  // 3. Save to Firestore
  try {
    const docRef = doc(db, 'site_settings', 'branding');
    await setDoc(docRef, brandingData, { merge: true });
  } catch (firestoreErr) {
    console.warn('Firestore write warning:', firestoreErr);
  }

  // 4. Update local cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(brandingData));
  } catch {
    // ignore
  }

  return brandingData;
}

/**
 * Remove saved school logo
 */
export async function deleteSchoolLogo(): Promise<void> {
  const current = getCachedBranding();
  if (current?.storagePath) {
    try {
      const storageRef = ref(storage, current.storagePath);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Could not delete storage object:', err);
    }
  }

  try {
    const docRef = doc(db, 'site_settings', 'branding');
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete Firestore branding document:', err);
  }

  localStorage.removeItem(CACHE_KEY);
}

/**
 * React hook for consuming school branding across components
 */
export function useSchoolBranding() {
  const [branding, setBranding] = useState<SchoolBranding | null>(getCachedBranding());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeSchoolBranding((data) => {
      if (isMounted) {
        setBranding(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const saveLogo = async (file: File, userIdentifier?: string, onProgress?: (pct: number) => void) => {
    try {
      setError(null);
      const updated = await uploadAndSaveSchoolLogo(file, userIdentifier, onProgress);
      setBranding(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu logo.');
      throw err;
    }
  };

  const removeLogo = async () => {
    try {
      setError(null);
      await deleteSchoolLogo();
      setBranding(null);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa logo.');
      throw err;
    }
  };

  return {
    branding,
    loading,
    error,
    saveLogo,
    removeLogo,
  };
}
