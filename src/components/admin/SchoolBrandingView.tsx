import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Info,
  Eye,
  Sun,
  Moon,
  FileCheck,
  Check,
  X,
} from 'lucide-react';
import {
  useSchoolBranding,
  validateLogoFile,
  measureImageDimensions,
} from '../../services/brandingService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigateToPublicLobby?: () => void;
}

export const SchoolBrandingView: React.FC<Props> = ({ onNavigateToPublicLobby }) => {
  const { branding, loading, error: serviceError, saveLogo, removeLogo } = useSchoolBranding();
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected file preview state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState<{ width: number; height: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Upload status state
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preview background theme toggle ('dark' or 'checker')
  const [previewBgTheme, setPreviewBgTheme] = useState<'dark' | 'checker' | 'light'>('dark');

  // Deletion modal state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection from computer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset errors and notifications
    setValidationError(null);
    setSuccessMessage(null);

    // Validate
    const check = validateLogoFile(file);
    if (!check.valid) {
      setValidationError(check.error || 'Tệp không hợp lệ.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Generate local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);

    // Measure natural dimensions
    const dims = await measureImageDimensions(file);
    setPreviewDimensions(dims);
  };

  const handleTriggerPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelPreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPreviewDimensions(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Perform save and upload
  const handleSaveAndApply = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);
    setValidationError(null);

    try {
      await saveLogo(selectedFile, user?.email || 'Quản trị viên CMD', (pct) => {
        setUploadProgress(pct);
      });

      setSuccessMessage('Cập nhật logo chính thức thành công! Toàn bộ sảnh chính và không gian di sản đã được đồng bộ.');
      handleCancelPreview();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setValidationError(err.message || 'Không thể lưu logo. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Perform deletion
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await removeLogo();
      setConfirmDeleteOpen(false);
      setSuccessMessage('Đã gỡ bỏ logo chính thức. Hệ thống sẽ sử dụng biểu tượng mặc định tinh tế.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setValidationError(err.message || 'Không thể xóa logo.');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDateTime = (isoString?: string): string => {
    if (!isoString) return 'Chưa ghi nhận';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Section */}
      <div className="pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HỆ THỐNG NHẬN DIỆN THƯƠNG HIỆU</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
          <ImageIcon className="w-6 h-6 text-cyan-400" />
          <span>NHẬN DIỆN TRƯỜNG</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Quản lý biểu trưng chính thức và hình ảnh nhận diện của trường.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-xs text-emerald-200 flex items-start gap-3 shadow-lg shadow-emerald-950/40 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold text-emerald-300">Thao tác thành công</div>
            <div>{successMessage}</div>
          </div>
        </div>
      )}

      {(validationError || serviceError) && (
        <div className="p-4 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-200 flex items-start gap-3 shadow-lg shadow-red-950/40 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold text-red-300">Thông báo lỗi</div>
            <div>{validationError || serviceError}</div>
          </div>
        </div>
      )}

      {/* Main Feature Box */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>Logo chính thức Trường THPT A Trần Hưng Đạo</span>
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tải lên logo chính thức để tự động cập nhật biểu trưng hiển thị tại sảnh chính. Bạn có thể thay đổi logo trong tương lai mà không cần chỉnh sửa mã nguồn.
          </p>
        </div>

        {/* 1. STAGE: PREVIEW OF NEW FILE BEFORE UPLOAD */}
        {selectedFile && previewUrl && (
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-cyan-500/40 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  Xem trước logo đã chọn (Chưa lưu)
                </span>
              </div>

              {/* Background Theme Switcher for Transparency Check */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    previewBgTheme === 'dark'
                      ? 'bg-zinc-800 text-cyan-300 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Nền tối vũ trụ (mô phỏng bảo tàng)"
                >
                  <Moon className="w-3 h-3" />
                  <span>Nền tối</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('checker')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    previewBgTheme === 'checker'
                      ? 'bg-zinc-800 text-cyan-300 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Nền lưới kiểm tra trong suốt (PNG)"
                >
                  <Eye className="w-3 h-3" />
                  <span>Lưới caro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('light')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    previewBgTheme === 'light'
                      ? 'bg-zinc-800 text-cyan-300 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Nền sáng"
                >
                  <Sun className="w-3 h-3" />
                  <span>Nền sáng</span>
                </button>
              </div>
            </div>

            {/* Visual Preview Box */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-2xl border flex items-center justify-center p-4 transition-all shadow-inner ${
                  previewBgTheme === 'dark'
                    ? 'bg-[#0A0E1A] border-cyan-500/30'
                    : previewBgTheme === 'checker'
                    ? 'bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] bg-zinc-900 border-zinc-700'
                    : 'bg-zinc-100 border-zinc-300'
                }`}
              >
                <img
                  src={previewUrl}
                  alt="Xem trước logo"
                  className="max-w-full max-h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Metadata Details */}
              <div className="flex-1 space-y-3 w-full text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Tên tệp:</span>
                    <span className="text-zinc-200 font-mono font-medium truncate block" title={selectedFile.name}>
                      {selectedFile.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Dung lượng:</span>
                    <span className="text-zinc-200 font-mono font-medium">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Kích thước ảnh:</span>
                    <span className="text-cyan-400 font-mono font-semibold">
                      {previewDimensions ? `${previewDimensions.width} × ${previewDimensions.height} px` : 'Đang đo...'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Định dạng MIME:</span>
                    <span className="text-zinc-300 font-mono">
                      {selectedFile.type || 'image/png'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>
                    Ảnh hiển thị sắc nét, tương thích hoàn toàn với nền tối của sảnh chính 3D và giao diện công chúng.
                  </span>
                </div>

                {uploading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-cyan-300">
                      <span>Đang tải lên và đồng bộ cơ sở dữ liệu...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${Math.max(uploadProgress, 15)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleSaveAndApply}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ĐANG LƯU...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>LƯU VÀ ÁP DỤNG</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleTriggerPicker}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>CHỌN TỆP KHÁC</span>
                  </button>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleCancelPreview}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>HỦY</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STAGE: CURRENT SAVED LOGO SHOWCASE */}
        {!selectedFile && branding?.logoUrl && (
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Logo chính thức đang hoạt động
                </span>
              </div>

              {/* Background Theme Switcher */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('dark')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] ${
                    previewBgTheme === 'dark' ? 'bg-zinc-800 text-cyan-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  Tối
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('checker')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] ${
                    previewBgTheme === 'checker' ? 'bg-zinc-800 text-cyan-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  Lưới
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('light')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] ${
                    previewBgTheme === 'light' ? 'bg-zinc-800 text-cyan-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  Sáng
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Logo Card */}
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border flex items-center justify-center p-4 transition-all shadow-xl ${
                  previewBgTheme === 'dark'
                    ? 'bg-[#0A0E1A] border-[#D4AF62]/40 shadow-cyan-950/20'
                    : previewBgTheme === 'checker'
                    ? 'bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] bg-zinc-900 border-zinc-700'
                    : 'bg-zinc-100 border-zinc-300'
                }`}
              >
                <img
                  src={branding.logoUrl}
                  alt="Biểu trưng Trường THPT A Trần Hưng Đạo"
                  className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Info & Operations */}
              <div className="flex-1 space-y-3 w-full text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Tên tệp gốc:</span>
                    <span className="text-zinc-200 font-mono font-medium truncate block" title={branding.fileName}>
                      {branding.fileName || 'school_logo'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Dung lượng:</span>
                    <span className="text-zinc-200 font-mono font-medium">
                      {branding.fileSize ? formatFileSize(branding.fileSize) : 'Chuẩn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Kích thước:</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {branding.dimensions ? `${branding.dimensions.width} × ${branding.dimensions.height} px` : 'Chuẩn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Thời gian cập nhật:</span>
                    <span className="text-zinc-300 font-mono text-[11px]">
                      {formatDateTime(branding.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã kết nối trực tiếp với Sảnh chính (Main Hall Scene) và Cổng chào không gian số.</span>
                </div>

                {/* Operations */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleTriggerPicker}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>THAY ĐỔI LOGO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-xs font-medium transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>XÓA LOGO</span>
                  </button>

                  {onNavigateToPublicLobby && (
                    <button
                      type="button"
                      onClick={onNavigateToPublicLobby}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#D4AF62]" />
                      <span>XEM TRÊN SẢNH CHÍNH</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. STAGE: EMPTY STATE (NO LOGO SAVED AND NO PREVIEW) */}
        {!selectedFile && !branding?.logoUrl && !loading && (
          <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900/90 border border-zinc-700/60 mx-auto flex items-center justify-center text-zinc-400 shadow-inner">
              <ImageIcon className="w-8 h-8 text-zinc-500" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-bold text-zinc-200">
                Chưa có logo chính thức
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Chọn tệp logo từ máy tính, xem trước và tải lên để sử dụng tại sảnh chính.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTriggerPicker}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-950/60 transition-all cursor-pointer group"
              >
                <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>CHỌN LOGO TỪ MÁY TÍNH</span>
              </button>
            </div>

            <div className="text-[11px] text-zinc-500 font-mono">
              Hỗ trợ: PNG (khuyên dùng cho logo trong suốt), JPEG/JPG, WebP • Tối đa 10 MB
            </div>
          </div>
        )}

        {/* Guidelines / Documentation Footer */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2 text-xs text-zinc-400">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Tiêu chuẩn kỹ thuật đề xuất:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400 pl-1">
            <li>Nên sử dụng tệp ảnh nền trong suốt (PNG hoặc WebP) để hòa hợp với kiến trúc 3D.</li>
            <li>Độ phân giải khuyến nghị tối thiểu 512 × 512 px để hiển thị sắc nét trên màn hình Retina / 4K.</li>
            <li>Sau khi tải lên thành công, biểu trưng sẽ tự động cập nhật ngay lập tức tại Sảnh chính (Main Hall), Cổng trường và thanh điều hướng công chúng.</li>
          </ul>
        </div>
      </div>

      {/* CONFIRMATION DELETION MODAL */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-100">
                Xác nhận gỡ bỏ logo chính thức?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sau khi gỡ bỏ, giao diện sảnh chính sẽ chuyển sang sử dụng biểu tượng mặc định cho đến khi bạn tải lên tệp logo mới.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-950 cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang gỡ...</span>
                  </>
                ) : (
                  <span>Xác nhận gỡ bỏ</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
