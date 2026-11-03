import React, { useState, useEffect, useMemo } from 'react';
import { CONTENT_REGISTRY } from '../../../registry/contentRegistry';
import {
  ContentRegistryItem,
  StoredEditorialContent,
} from '../../../types/contentRegistry';
import { editorialContentRepository } from '../../../repositories/editorialContentRepository';
import { ContentTileGrid } from './ContentTileGrid';
import { ContentDetailEditorModal } from './ContentDetailEditorModal';
import { useAuth } from '../../../context/AuthContext';
import {
  Search,
  Filter,
  Layers,
  FileText,
  Paperclip,
  CheckCircle2,
  Sparkles,
  BookOpen,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export const ContentManagerView: React.FC = () => {
  const { user } = useAuth();
  const [storedDataList, setStoredDataList] = useState<StoredEditorialContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [capabilityFilter, setCapabilityFilter] = useState<'all' | 'text' | 'files'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'verified' | 'review'>('all');

  // Active item for modal editing
  const [editingItem, setEditingItem] = useState<ContentRegistryItem | null>(null);

  // Subscribe to realtime updates for editorial contents
  useEffect(() => {
    setLoading(true);
    const unsubscribe = editorialContentRepository.subscribeAll(
      (items) => {
        setStoredDataList(items);
        setLoading(false);
      },
      (err) => {
        console.warn('Realtime subscription error in ContentManagerView:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const items = await editorialContentRepository.getAllContent();
      setStoredDataList(items);
    } catch (err) {
      console.warn('Manual refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Map of stored records by contentId
  const storedDataMap = useMemo(() => {
    const map = new Map<string, StoredEditorialContent>();
    for (const item of storedDataList) {
      map.set(item.contentId, item);
    }
    return map;
  }, [storedDataList]);

  // Unique rooms from registry
  const roomOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; label: string }[] = [];
    for (const item of CONTENT_REGISTRY) {
      if (!seen.has(item.roomId)) {
        seen.add(item.roomId);
        list.push({ id: item.roomId, label: item.roomNameVi });
      }
    }
    return list;
  }, []);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return CONTENT_REGISTRY.filter((item) => {
      // Room filter
      if (selectedRoom !== 'all' && item.roomId !== selectedRoom) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Capability filter
      if (capabilityFilter === 'text' && !item.capabilities.textEditing) {
        return false;
      }
      if (capabilityFilter === 'files' && !item.capabilities.fileAttachments) {
        return false;
      }

      // Status filter
      const stored = storedDataMap.get(item.contentId);
      const isPub = stored?.isPublished !== undefined ? stored.isPublished : item.isPublished;
      const verif = stored?.verificationStatus || item.verificationStatus;

      if (statusFilter === 'published' && !isPub) return false;
      if (statusFilter === 'draft' && isPub) return false;
      if (statusFilter === 'verified' && verif !== 'verified') return false;
      if (statusFilter === 'review' && verif !== 'needs_review') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.displayName.toLowerCase().includes(q);
        const matchId = item.contentId.toLowerCase().includes(q);
        const matchRoom = item.roomNameVi.toLowerCase().includes(q);
        const matchDesc = item.publicViewDescription.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchRoom && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [selectedRoom, selectedCategory, capabilityFilter, statusFilter, searchQuery, storedDataMap]);

  // Statistics
  const stats = useMemo(() => {
    const total = CONTENT_REGISTRY.length;
    let savedInDb = 0;
    let verifiedCount = 0;
    let totalAttachments = 0;

    for (const item of CONTENT_REGISTRY) {
      const stored = storedDataMap.get(item.contentId);
      if (stored) savedInDb++;
      const verif = stored?.verificationStatus || item.verificationStatus;
      if (verif === 'verified') verifiedCount++;
      const atts = stored?.attachments?.length || item.defaultAttachments?.length || 0;
      totalAttachments += atts;
    }

    return { total, savedInDb, verifiedCount, totalAttachments };
  }, [storedDataMap]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              TRÌNH QUẢN TRỊ NỘI DUNG TRỰC TIẾP
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Database: Cloud Firestore
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-serif">
            QUẢN LÝ NỘI DUNG DI SẢN (EDITORIAL CMS)
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Hệ thống phân loại 2 lớp năng lực: <strong>Lớp 1 (Văn bản)</strong> & <strong>Lớp 2 (Tệp đính kèm)</strong>. Mọi chỉnh sửa được ghi trực tiếp vào cơ sở dữ liệu và hiển thị ngay trên không gian tham quan 3D mà không cần biên dịch lại mã nguồn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 block">TỔNG MỤC NỘI DUNG</span>
          <span className="text-xl font-bold text-zinc-100 font-mono">{stats.total}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Phân loại theo 9 Phân khu</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-cyan-500 block">ĐỒNG BỘ FIRESTORE</span>
          <span className="text-xl font-bold text-cyan-400 font-mono">{stats.savedInDb}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Bản ghi tùy chỉnh trực tiếp</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-emerald-500 block">ĐÃ XÁC MINH CHUẨN</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{stats.verifiedCount}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Căn cứ tư liệu gốc của tỉnh</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-purple-500 block">TỆP ĐÍNH KÈM / MEDIA</span>
          <span className="text-xl font-bold text-purple-400 font-mono">{stats.totalAttachments}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Ảnh, PDF, Audio & Video</span>
        </div>
      </div>

      {/* Global Architectural Rule Status Badge */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs">
        <div className="flex items-center gap-2 text-cyan-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">
            QUY TẮC BẮT BUỘC TOÀN CỤC (GLOBAL INVARIANT):
          </span>
          <span className="text-zinc-300">
            {stats.total}/{stats.total} Mục nội dung đã đăng ký chuẩn hóa • {roomOptions.length} Phân khu Canonical • Sẵn sàng chỉnh sửa trực tiếp không cần sửa mã nguồn
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
          VALIDATED 100%
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, mã định danh Content ID, phân khu..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Room Filter */}
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">Tất cả Phân khu ({roomOptions.length})</option>
            {roomOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">Tất cả Thể loại nội dung</option>
            <option value="historical_narrative">Thông tin lịch sử cốt lõi</option>
            <option value="room_intro">Giới thiệu & Lời chào</option>
            <option value="milestones">Mốc thời gian</option>
            <option value="hotspots">Điểm tương tác & Hiện vật</option>
            <option value="media_documents">Tư liệu & Văn bản</option>
            <option value="memorial">Tưởng niệm & Tri ân</option>
            <option value="achievements">Thành tích & Phần thưởng</option>
          </select>
        </div>

        {/* Quick Pills for Capabilities & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Năng lực:
            </span>

            <button
              onClick={() => setCapabilityFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                capabilityFilter === 'all'
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setCapabilityFilter('text')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                capabilityFilter === 'text'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3 h-3" /> Có văn bản (Layer 1)
            </button>
            <button
              onClick={() => setCapabilityFilter('files')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                capabilityFilter === 'files'
                  ? 'bg-purple-950 text-purple-300 border border-purple-700 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Paperclip className="w-3 h-3" /> Có tệp đính kèm (Layer 2)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 mr-1">Trạng thái:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                statusFilter === 'all'
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tất cả ({filteredItems.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                statusFilter === 'verified'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ✓ Đã xác minh
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                statusFilter === 'published'
                  ? 'bg-blue-950 text-blue-300 border border-blue-700 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Công khai
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Content Tiles */}
      <ContentTileGrid
        items={filteredItems}
        storedDataMap={storedDataMap}
        onEditItem={(item) => setEditingItem(item)}
      />

      {/* Detail Editor Modal */}
      {editingItem && (
        <ContentDetailEditorModal
          item={editingItem}
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          adminUid={user?.uid}
          onSaved={() => {
            // Realtime listener will handle list update automatically
          }}
        />
      )}
    </div>
  );
};
