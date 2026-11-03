import React from 'react';
import {
  ContentRegistryItem,
  StoredEditorialContent,
} from '../../../types/contentRegistry';
import {
  FileText,
  Paperclip,
  ShieldCheck,
  Globe2,
  Clock,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

interface Props {
  items: ContentRegistryItem[];
  storedDataMap: Map<string, StoredEditorialContent>;
  onEditItem: (item: ContentRegistryItem) => void;
}

export const ContentTileGrid: React.FC<Props> = ({
  items,
  storedDataMap,
  onEditItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
        <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto" />
        <h3 className="text-sm font-semibold text-zinc-300">
          Không tìm thấy mục nội dung nào phù hợp
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Hãy thử đổi bộ lọc phân khu, danh mục hoặc từ khóa tìm kiếm để hiển thị các bản ghi di sản.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const stored = storedDataMap.get(item.contentId);
        const hasDbRecord = Boolean(stored);

        // Verification & Publication status from Firestore or fallback
        const verificationStatus =
          stored?.verificationStatus || item.verificationStatus;
        const isPublished =
          stored?.isPublished !== undefined ? stored.isPublished : item.isPublished;
        const attachmentCount =
          stored?.attachments?.length || item.defaultAttachments?.length || 0;

        return (
          <div
            key={item.contentId}
            className="group p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            {/* Top Row: Room & Category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 truncate">
                  {item.roomNameVi}
                </span>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isPublished ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                      <Globe2 className="w-2.5 h-2.5" /> Công khai
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Nháp
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Stable Content ID */}
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-200 transition-colors line-clamp-2 mb-1 font-serif">
                {item.displayName}
              </h3>

              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 mb-3">
                <span>Mã định danh:</span>
                <span className="text-zinc-400 font-semibold">{item.contentId}</span>
              </div>

              {/* Description / Public rendering anchor */}
              <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                {item.publicViewDescription}
              </p>
            </div>

            {/* Bottom Row: Capabilities & Actions */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                {/* Capability Badges */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-cyan-900/40"
                    title="Lớp 1: Chỉnh sửa văn bản"
                  >
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>{item.fields.length} trường</span>
                  </span>

                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-purple-300 border border-purple-900/40"
                    title="Lớp 2: Quản lý tệp đính kèm"
                  >
                    <Paperclip className="w-3 h-3 text-purple-400" />
                    <span>{attachmentCount} tệp</span>
                  </span>
                </div>

                {/* Verification Badge */}
                {verificationStatus === 'verified' ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Chuẩn
                  </span>
                ) : verificationStatus === 'needs_review' ? (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" /> Cần duyệt
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">Chưa xác minh</span>
                )}
              </div>

              {/* Database sync status & Edit Button */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] font-mono text-zinc-500">
                  {hasDbRecord ? (
                    <span className="text-cyan-400/90">✓ Firestore lưu trữ</span>
                  ) : (
                    <span>Mặc định gốc</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => onEditItem(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 hover:border-cyan-500 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa nội dung</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
