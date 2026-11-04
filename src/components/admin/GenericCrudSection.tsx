import React, { useEffect, useState, useCallback } from 'react';
import { BaseRepository } from '../../repositories/baseRepository';
import { VerificationStatus } from '../../types';
import { ContentTable, ColumnDef } from './ContentTable';
import { ContentFormModal, FormFieldDef } from './ContentFormModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface Props<T extends { id: string; displayOrder?: number; isPublished?: boolean; verificationStatus?: VerificationStatus }> {
  repository: BaseRepository<T>;
  title: string;
  description?: string;
  createButtonLabel?: string;
  columns: ColumnDef<T>[];
  fields: FormFieldDef[];
  searchFilter: (item: T, term: string) => boolean;
  defaultValues?: Partial<T>;
  customIdGenerator?: (data: any) => string;
}

export function GenericCrudSection<
  T extends { id: string; displayOrder?: number; isPublished?: boolean; verificationStatus?: VerificationStatus }
>({
  repository,
  title,
  description,
  createButtonLabel = 'Thêm mới',
  columns,
  fields,
  searchFilter,
  defaultValues = {},
  customIdGenerator,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await repository.getAll({
        orderByField: 'displayOrder',
        orderDirection: 'asc',
      });
      setItems(data);
    } catch (e) {
      console.warn(`Could not load data for ${title}:`, e);
    } finally {
      setLoading(false);
    }
  }, [repository, title]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create or Update
  const handleSave = async (formData: Record<string, any>) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        await repository.update(editingItem.id, formData as Partial<T>);
      } else {
        const customId = customIdGenerator ? customIdGenerator(formData) : undefined;
        await repository.create(formData as Omit<T, 'id' | 'createdAt' | 'updatedAt'>, customId);
      }
      await loadData();
      setIsFormOpen(false);
      setEditingItem(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await repository.delete(deletingItem.id);
      // Optimistic update
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
      setIsDeleteOpen(false);
      setDeletingItem(null);
      await loadData();
    } catch (err: any) {
      console.error('Lỗi khi xóa tài liệu:', err);
      setDeleteError(
        err.message || 'Không thể xóa tài liệu này khỏi cơ sở dữ liệu. Vui lòng kiểm tra quyền quản trị.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (id: string, current: boolean) => {
    await repository.togglePublish(id, current);
    await loadData();
  };

  // Update Verification
  const handleUpdateVerification = async (id: string, status: VerificationStatus) => {
    await repository.updateVerification(id, status);
    await loadData();
  };

  // Reordering
  const handleMoveUp = async (item: T) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex <= 0) return;
    const prevItem = items[currentIndex - 1];

    const currentOrder = item.displayOrder ?? currentIndex + 1;
    const prevOrder = prevItem.displayOrder ?? currentIndex;

    await repository.updateOrder(item.id, prevOrder);
    await repository.updateOrder(prevItem.id, currentOrder);
    await loadData();
  };

  const handleMoveDown = async (item: T) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex < 0 || currentIndex >= items.length - 1) return;
    const nextItem = items[currentIndex + 1];

    const currentOrder = item.displayOrder ?? currentIndex + 1;
    const nextOrder = nextItem.displayOrder ?? currentIndex + 2;

    await repository.updateOrder(item.id, nextOrder);
    await repository.updateOrder(nextItem.id, currentOrder);
    await loadData();
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500">Đang tải dữ liệu từ Firestore...</div>
      ) : (
        <ContentTable<T>
          title={title}
          description={description}
          items={items}
          columns={columns}
          onCreateNew={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          onEdit={(item) => {
            setEditingItem(item);
            setIsFormOpen(true);
          }}
          onDelete={(item) => {
            setDeletingItem(item);
            setDeleteError(null);
            setIsDeleteOpen(true);
          }}
          onTogglePublish={handleTogglePublish}
          onUpdateVerification={handleUpdateVerification}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          searchFilter={searchFilter}
          createButtonLabel={createButtonLabel}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <ContentFormModal
          isOpen={isFormOpen}
          title={editingItem ? `Chỉnh sửa: ${title}` : `${createButtonLabel}: ${title}`}
          subtitle="Heritage Core Data Layer"
          fields={fields}
          initialData={editingItem || defaultValues}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && deletingItem && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          title={(deletingItem as any).titleVi || (deletingItem as any).name || (deletingItem as any).nameVi || deletingItem.id}
          itemDescription={`Mã định danh ID: ${deletingItem.id}`}
          errorMessage={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsDeleteOpen(false);
            setDeletingItem(null);
            setDeleteError(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
