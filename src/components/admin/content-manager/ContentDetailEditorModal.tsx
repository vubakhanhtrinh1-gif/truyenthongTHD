import React, { useState, useEffect } from 'react';
import {
  ContentRegistryItem,
  StoredEditorialContent,
  FileAttachment,
} from '../../../types/contentRegistry';
import { editorialContentRepository } from '../../../repositories/editorialContentRepository';
import { Layer1TextEditor } from './Layer1TextEditor';
import { Layer2AttachmentManager } from './Layer2AttachmentManager';
import {
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  FileText,
  Paperclip,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

interface Props {
  item: ContentRegistryItem;
  isOpen: boolean;
  onClose: () => void;
  adminUid?: string;
  onSaved?: () => void;
}

export const ContentDetailEditorModal: React.FC<Props> = ({
  item,
  isOpen,
  onClose,
  adminUid,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'files' | 'meta'>('text');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [textValues, setTextValues] = useState<Record<string, any>>({});
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<
    'verified' | 'unverified' | 'needs_review'
  >('unverified');
  const [isPublished, setIsPublished] = useState(true);
  const [editorialNotes, setEditorialNotes] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Load current stored values from Firestore
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    async function loadData() {
      try {
        const stored = await editorialContentRepository.getContent(item.contentId);
        if (!isMounted) return;

        if (stored) {
          // Merge defaults with stored values
          setTextValues({ ...item.defaultTextValues, ...(stored.textValues || {}) });
          setAttachments(stored.attachments || item.defaultAttachments || []);
          setVerificationStatus(stored.verificationStatus || item.verificationStatus);
          setIsPublished(stored.isPublished !== undefined ? stored.isPublished : item.isPublished);
          setEditorialNotes(stored.notes || '');
        } else {
          // Fallback to item defaults
          setTextValues({ ...item.defaultTextValues });
          setAttachments(item.defaultAttachments || []);
          setVerificationStatus(item.verificationStatus);
          setIsPublished(item.isPublished);
          setEditorialNotes('');
        }
        setIsDirty(false);
      } catch (err: any) {
        console.warn('Error loading editorial content:', err);
        // Fallback to defaults
        setTextValues({ ...item.defaultTextValues });
        setAttachments(item.defaultAttachments || []);
        setVerificationStatus(item.verificationStatus);
        setIsPublished(item.isPublished);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleTextChange = (key: string, val: any) => {
    setTextValues((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleAttachmentsChange = (newAtts: FileAttachment[]) => {
    setAttachments(newAtts);
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: Partial<StoredEditorialContent> = {
        contentId: item.contentId,
        roomId: item.roomId,
        displayNameVi: item.displayName,
        category: item.category,
        textValues,
        attachments,
        verificationStatus,
        isPublished,
      };

      if (item.sceneObjectId) {
        payload.sceneObjectId = item.sceneObjectId;
      }
      if (editorialNotes && editorialNotes.trim()) {
        payload.notes = editorialNotes.trim();
      }

      await editorialContentRepository.saveContent(item.contentId, payload, adminUid);

      setIsDirty(false);
      setSuccessMsg('Đã lưu nội dung thành công vào cơ sở dữ liệu Cloud Firestore.');
      if (onSaved) onSaved();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMsg(
        err.message || 'Lưu nội dung thất bại. Vui lòng kiểm tra quyền hạn Quản trị viên.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {item.roomNameVi}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                ID: {item.contentId}
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 font-serif">
              {item.displayName}
            </h2>
            <p className="text-[11px] text-zinc-400">{item.publicViewDescription}</p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'text'
                ? 'bg-zinc-950 text-cyan-400 border-t-2 border-cyan-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lớp 1: Văn bản ({item.fields.length} trường)</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'files'
                ? 'bg-zinc-950 text-purple-400 border-t-2 border-purple-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            <span>Lớp 2: Tệp & Media ({attachments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'meta'
                ? 'bg-zinc-950 text-amber-400 border-t-2 border-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Thẩm định & Xuất bản</span>
          </button>
        </div>

        {/* Status / Alert Message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 text-xs space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span>Đang tải dữ liệu từ Cloud Firestore...</span>
            </div>
          ) : (
            <>
              {activeTab === 'text' && (
                <Layer1TextEditor
                  fields={item.fields}
                  values={textValues}
                  onChange={handleTextChange}
                  disabled={saving}
                />
              )}

              {activeTab === 'files' && (
                <Layer2AttachmentManager
                  attachments={attachments}
                  onChange={handleAttachmentsChange}
                  allowedTypes={item.allowedFileTypes}
                  adminUid={adminUid}
                  disabled={saving}
                />
              )}

              {activeTab === 'meta' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200">
                    <strong className="block font-semibold mb-1 text-amber-100">
                      🛡️ THẨM ĐỊNH LỊCH SỬ & QUY CHẾ XUẤT BẢN
                    </strong>
                    Tuân thủ quy tắc bất di bất dịch của dự án: Chỉ đánh dấu "Đã xác minh" khi có đầy đủ hồ sơ, kỷ yếu hoặc văn thư lưu trữ của nhà trường/tỉnh.
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <label className="block text-xs font-semibold text-zinc-200">
                      Trạng thái thẩm định tư liệu (Verification Status):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationStatus('verified');
                          setIsDirty(true);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          verificationStatus === 'verified'
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="block text-xs">✓ Đã xác minh</span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          Đã đối chiếu với kỷ yếu / tư liệu tỉnh
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVerificationStatus('needs_review');
                          setIsDirty(true);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          verificationStatus === 'needs_review'
                            ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="block text-xs">⚠️ Cần kiểm tra lại</span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          Có dấu [cần xác nhận] hoặc chưa đủ chứng cứ
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVerificationStatus('unverified');
                          setIsDirty(true);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          verificationStatus === 'unverified'
                            ? 'bg-zinc-900 border-zinc-500 text-zinc-200 font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="block text-xs">Chưa xác minh</span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          Nội dung mới khởi tạo
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <label className="block text-xs font-semibold text-zinc-200">
                      Quyền hiển thị công chúng (Public Visibility):
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => {
                          setIsPublished(e.target.checked);
                          setIsDirty(true);
                        }}
                        className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-zinc-950 border-zinc-700"
                      />
                      <div>
                        <span className="text-xs font-semibold text-zinc-200 block">
                          Xuất bản công khai (Publicly Visible)
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Nếu bỏ chọn, khách tham quan 3D sẽ không thấy nội dung này (chỉ quản trị viên xem được).
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <label className="block text-xs font-semibold text-zinc-200">
                      Ghi chú nội bộ ban biên tập (Editorial Notes):
                    </label>
                    <textarea
                      value={editorialNotes}
                      onChange={(e) => {
                        setEditorialNotes(e.target.value);
                        setIsDirty(true);
                      }}
                      rows={3}
                      placeholder="Ghi chú người thẩm định, ngày duyệt hoặc lưu ý bổ sung..."
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {isDirty ? (
              <span className="text-amber-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Có thay đổi chưa lưu
              </span>
            ) : (
              <span className="text-zinc-500 font-mono">Đã đồng bộ với Firestore</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu trực tiếp vào Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi trực tiếp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
