import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, File, Loader2 } from 'lucide-react';
import { uploadMediaFile } from '../../services/storageService';
import { mediaRepository } from '../../repositories';
import { MediaType } from '../../types';

interface Props {
  folder?: string;
  onUploadComplete: (result: {
    downloadUrl: string;
    storagePath: string;
    type: MediaType;
    fileName: string;
    mediaAssetId?: string;
  }) => void;
  accept?: string;
  label?: string;
}

export const MediaUploader: React.FC<Props> = ({
  folder = 'media',
  onUploadComplete,
  accept = 'image/*,audio/*,video/*,application/pdf,.glb,.gltf',
  label = 'Tải tệp đa phương tiện lên Firebase Storage',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successFile, setSuccessFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccessFile(null);

    try {
      const result = await uploadMediaFile(file, folder, (p) => setProgress(p));

      // Record metadata in media_assets collection
      const mediaDoc = await mediaRepository.create({
        fileName: result.fileName,
        storagePath: result.storagePath,
        downloadUrl: result.downloadUrl,
        type: result.type,
        mimeType: result.mimeType,
        size: result.size,
        altTextVi: file.name,
        altTextEn: file.name,
        sourceIds: [],
        licenseIds: [],
        aiGenerated: false,
      });

      setSuccessFile(result.fileName);
      onUploadComplete({
        downloadUrl: result.downloadUrl,
        storagePath: result.storagePath,
        type: result.type,
        fileName: result.fileName,
        mediaAssetId: mediaDoc.id,
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Lỗi khi tải tệp lên Firebase Storage. Kiểm tra phân quyền Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          isUploading
            ? 'border-cyan-500/50 bg-cyan-950/20'
            : 'border-zinc-700 hover:border-cyan-500/60 bg-zinc-900/60 hover:bg-zinc-800/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept={accept}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs text-cyan-300">
                  <span>Đang tải lên...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-1.5 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          ) : successFile ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div className="text-xs text-emerald-300 font-medium truncate max-w-xs">
                Đã tải lên: {successFile}
              </div>
              <span className="text-[11px] text-zinc-400">Bấm để tải tệp khác</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400" />
              <div className="text-xs font-medium text-zinc-200">{label}</div>
              <p className="text-[11px] text-zinc-500">
                Kéo thả tệp vào đây hoặc bấm để chọn tệp (Ảnh, Âm thanh, Video, PDF, 3D GLB)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/40">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
