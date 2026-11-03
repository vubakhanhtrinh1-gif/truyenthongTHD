import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  itemDescription?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<Props> = ({
  isOpen,
  title,
  itemDescription,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-red-500/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-red-950/20">
          <div className="flex items-center gap-2.5 text-red-400">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-zinc-100">Xác nhận xóa dữ liệu</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-zinc-300">
            Bạn có chắc chắn muốn xóa bản ghi{' '}
            <span className="font-semibold text-red-400">{title}</span>?
          </p>
          {itemDescription && (
            <p className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono break-all">
              {itemDescription}
            </p>
          )}
          <p className="text-xs text-zinc-500 italic">
            Lưu ý: Thao tác này sẽ xóa vĩnh viễn dữ liệu khỏi Firestore và không thể khôi phục.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-950 border-t border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-red-900/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
