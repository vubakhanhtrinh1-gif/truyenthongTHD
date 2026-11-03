import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { VerificationStatus } from '../../types';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { PublishToggle } from './PublishToggle';
import { OrderControl } from './OrderControl';

export interface ColumnDef<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  width?: string;
  className?: string;
}

interface Props<T extends { id: string; displayOrder?: number; isPublished?: boolean; verificationStatus?: VerificationStatus }> {
  title: string;
  description?: string;
  items: T[];
  columns: ColumnDef<T>[];
  onCreateNew?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onTogglePublish?: (id: string, current: boolean) => void;
  onUpdateVerification?: (id: string, status: VerificationStatus) => void;
  onMoveUp?: (item: T) => void;
  onMoveDown?: (item: T) => void;
  searchPlaceholder?: string;
  searchFilter?: (item: T, term: string) => boolean;
  createButtonLabel?: string;
}

export function ContentTable<
  T extends { id: string; displayOrder?: number; isPublished?: boolean; verificationStatus?: VerificationStatus }
>({
  title,
  description,
  items,
  columns,
  onCreateNew,
  onEdit,
  onDelete,
  onTogglePublish,
  onUpdateVerification,
  onMoveUp,
  onMoveDown,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  searchFilter,
  createButtonLabel = 'Thêm bản ghi mới',
}: Props<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [verifyFilter, setVerifyFilter] = useState<'all' | VerificationStatus>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search term
      if (searchTerm.trim() && searchFilter) {
        if (!searchFilter(item, searchTerm.toLowerCase().trim())) {
          return false;
        }
      }

      // Publish filter
      if (publishFilter === 'published' && !item.isPublished) return false;
      if (publishFilter === 'draft' && item.isPublished) return false;

      // Verification filter
      if (verifyFilter !== 'all' && item.verificationStatus !== verifyFilter) {
        return false;
      }

      return true;
    });
  }, [items, searchTerm, publishFilter, verifyFilter, searchFilter]);

  const hasVerification = items.some((i) => i.verificationStatus !== undefined);
  const hasOrdering = items.some((i) => i.displayOrder !== undefined);
  const hasPublishing = items.some((i) => i.isPublished !== undefined);

  return (
    <div className="space-y-4">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-800/60">
              {filteredItems.length} / {items.length}
            </span>
          </h2>
          {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
        </div>

        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{createButtonLabel}</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-700/80 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {hasPublishing && (
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <span className="text-zinc-500 px-1 text-[11px]">Trạng thái:</span>
            <button
              onClick={() => setPublishFilter('all')}
              className={`px-2 py-0.5 rounded ${publishFilter === 'all' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPublishFilter('published')}
              className={`px-2 py-0.5 rounded ${publishFilter === 'published' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Công khai
            </button>
            <button
              onClick={() => setPublishFilter('draft')}
              className={`px-2 py-0.5 rounded ${publishFilter === 'draft' ? 'bg-zinc-800 text-zinc-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Nháp
            </button>
          </div>
        )}

        {hasVerification && (
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            <select
              value={verifyFilter}
              onChange={(e) => setVerifyFilter(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer py-0.5"
            >
              <option value="all" className="bg-zinc-900">
                Tất cả thẩm định
              </option>
              <option value="verified" className="bg-zinc-900 text-emerald-300">
                ✓ Đã xác minh
              </option>
              <option value="needs_review" className="bg-zinc-900 text-indigo-300">
                🔍 Cần kiểm tra
              </option>
              <option value="unverified" className="bg-zinc-900 text-amber-300">
                ⚠️ Chưa xác minh
              </option>
            </select>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase tracking-wider font-semibold">
              {hasOrdering && <th className="py-3 px-3 w-16 text-center">Thứ tự</th>}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 ${col.width ? `w-[${col.width}]` : ''} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {hasVerification && <th className="py-3 px-4 w-36">Thẩm định tư liệu</th>}
              {hasPublishing && <th className="py-3 px-4 w-28 text-center">Hiển thị</th>}
              <th className="py-3 px-4 w-28 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasOrdering ? 1 : 0) + (hasVerification ? 1 : 0) + (hasPublishing ? 1 : 0) + 1}
                  className="py-12 text-center text-zinc-500"
                >
                  Không tìm thấy bản ghi phù hợp. Nhấn &quot;{createButtonLabel}&quot; để khởi tạo.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-800/40 transition-colors group text-zinc-300"
                >
                  {hasOrdering && (
                    <td className="py-3 px-3 text-center">
                      <OrderControl
                        currentOrder={item.displayOrder || idx + 1}
                        onMoveUp={onMoveUp ? () => onMoveUp(item) : undefined}
                        onMoveDown={onMoveDown ? () => onMoveDown(item) : undefined}
                      />
                    </td>
                  )}

                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`py-3 px-4 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : (item[col.accessor as keyof T] as unknown as React.ReactNode) ?? (
                            <span className="text-zinc-600">—</span>
                          )}
                    </td>
                  ))}

                  {hasVerification && (
                    <td className="py-3 px-4">
                      {item.verificationStatus ? (
                        <VerificationStatusBadge
                          status={item.verificationStatus}
                          interactive={!!onUpdateVerification}
                          onChange={(newStatus) =>
                            onUpdateVerification && onUpdateVerification(item.id, newStatus)
                          }
                        />
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  )}

                  {hasPublishing && (
                    <td className="py-3 px-4 text-center">
                      {item.isPublished !== undefined && onTogglePublish && (
                        <PublishToggle
                          isPublished={item.isPublished}
                          onToggle={() => onTogglePublish(item.id, !!item.isPublished)}
                        />
                      )}
                    </td>
                  )}

                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-cyan-950/40 transition-colors"
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
