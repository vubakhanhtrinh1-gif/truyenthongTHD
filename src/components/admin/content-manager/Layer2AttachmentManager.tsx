import React, { useState, useRef } from 'react';
import { FileAttachment } from '../../../types/contentRegistry';
import { uploadMediaFile } from '../../../services/storageService';
import {
  UploadCloud,
  FileText,
  Music,
  Video,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  FileCode,
} from 'lucide-react';

interface Props {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  allowedTypes?: ('image' | 'audio' | 'video' | 'pdf' | 'document' | '3d_model')[];
  adminUid?: string;
  disabled?: boolean;
}

export const Layer2AttachmentManager: React.FC<Props> = ({
  attachments,
  onChange,
  allowedTypes = ['image', 'pdf', 'audio', 'video', 'document'],
  adminUid,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError(null);
    setSuccessMsg(null);

    // Validate size (max 35MB)
    const MAX_SIZE = 35 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('Tệp vượt quá giới hạn 35MB. Vui lòng nén tệp trước khi tải lên.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadMediaFile(file, 'attachments', (pct) => {
        setUploadProgress(pct);
      });

      const newAttachment: FileAttachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fileName: res.fileName,
        originalName: file.name,
        downloadUrl: res.downloadUrl,
        storagePath: res.storagePath,
        mimeType: res.mimeType,
        size: res.size,
        type: res.type as any,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        source: 'Kho lưu trữ tư liệu số THPT A Trần Hưng Đạo',
        uploadedAt: new Date().toISOString(),
        ...(adminUid ? { uploadedBy: adminUid } : {}),
      };

      onChange([...attachments, newAttachment]);
      setSuccessMsg(
        res.isInlineFallback
          ? `Đã tải lên tệp "${file.name}" thành công (lưu trữ sẵn sàng hiển thị).`
          : `Đã tải lên tệp "${file.name}" thành công lên hệ thống lưu trữ.`
      );
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(
        err.message || 'Tải tệp lên thất bại. Vui lòng kiểm tra quyền truy cập lưu trữ.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    setSuccessMsg('Đã xóa tệp đính kèm khỏi danh sách. Hãy nhấn "Lưu thay đổi" bên dưới để đồng bộ cơ sở dữ liệu.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleUpdateMeta = (id: string, updates: Partial<FileAttachment>) => {
    onChange(
      attachments.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <FileCode className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200">
        <strong className="block font-semibold mb-1 text-purple-100">
          📎 LỚP 2: QUẢN LÝ TỆP ĐÍNH KÈM & MEDIA (ATTACHMENT LAYER)
        </strong>
        Tải lên tài liệu gốc, ảnh kỷ yếu, bản ghi âm phỏng vấn hoặc video lưu trữ. Tệp được lưu an toàn trên Firebase Storage và tạo liên kết trực tiếp vào bản ghi di sản.
      </div>

      {/* Upload Drop Zone */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border-2 border-dashed border-zinc-700 hover:border-cyan-500/60 transition-all text-center space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          disabled={disabled || uploading}
          onChange={handleFileSelect}
          className="hidden"
          accept={
            allowedTypes.includes('image')
              ? 'image/*,application/pdf,audio/*,video/*'
              : undefined
          }
        />

        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-cyan-400">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? `Đang tải lên (${uploadProgress}%)...` : '+ Chọn tệp tải lên Firebase Storage'}
          </button>
          <p className="text-[11px] text-zinc-400 mt-2">
            Hỗ trợ JPG, PNG, WebP, PDF, MP3, WAV, MP4 (Tối đa 35MB/tệp)
          </p>
        </div>

        {uploading && (
          <div className="w-full max-w-xs mx-auto space-y-1">
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-2 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-cyan-300">{uploadProgress}% hoàn tất</span>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Attachments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Danh sách tệp đính kèm ({attachments.length}):</span>
        </div>

        {attachments.length === 0 ? (
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-center text-xs text-zinc-500">
            Chưa có tệp đính kèm nào. Hãy chọn tệp bên trên để tải lên.
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row gap-3.5 items-start justify-between"
              >
                {/* Preview Thumbnail / Player */}
                <div className="w-full sm:w-28 flex-shrink-0">
                  {att.type === 'image' ? (
                    <div className="relative group rounded-lg overflow-hidden border border-zinc-700 bg-black aspect-video flex items-center justify-center">
                      <img
                        src={att.downloadUrl}
                        alt={att.caption || att.fileName}
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={att.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Mở ảnh
                      </a>
                    </div>
                  ) : att.type === 'audio' ? (
                    <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/60 text-center">
                      <Music className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <audio controls className="w-full h-6 mt-1 scale-90">
                        <source src={att.downloadUrl} type={att.mimeType} />
                      </audio>
                    </div>
                  ) : att.type === 'video' ? (
                    <video
                      controls
                      src={att.downloadUrl}
                      className="w-full rounded-lg aspect-video object-cover bg-black"
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-center flex flex-col items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-400 mb-1" />
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {att.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    {renderIcon(att.type)}
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {att.fileName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {formatFileSize(att.size)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">
                        Chú thích (Caption):
                      </label>
                      <input
                        type="text"
                        disabled={disabled}
                        value={att.caption || ''}
                        onChange={(e) => handleUpdateMeta(att.id, { caption: e.target.value })}
                        placeholder="Nhập chú thích..."
                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">
                        Nguồn tư liệu (Source):
                      </label>
                      <input
                        type="text"
                        disabled={disabled}
                        value={att.source || ''}
                        onChange={(e) => handleUpdateMeta(att.id, { source: e.target.value })}
                        placeholder="Nguồn tư liệu..."
                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500">
                    <span>
                      Đăng tải: {new Date(att.uploadedAt).toLocaleString('vi-VN')}
                    </span>
                    <a
                      href={att.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Xem tệp gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Delete Button with Inline Confirmation */}
                {deleteConfirmId === att.id ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleRemove(att.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-md cursor-pointer transition-colors"
                    >
                      Xóa ngay
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] cursor-pointer transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setDeleteConfirmId(att.id)}
                    title="Xóa tệp đính kèm này"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
