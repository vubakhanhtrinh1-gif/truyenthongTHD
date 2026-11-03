import React from 'react';
import {
  LayoutDashboard,
  Settings,
  Compass,
  Layers,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Users,
  HeartHandshake,
  Newspaper,
  Radio,
  FolderArchive,
  FileCheck2,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Flame,
  Image as ImageIcon,
} from 'lucide-react';
import { useSchoolBranding } from '../../services/brandingService';

export type AdminSection =
  | 'overview'
  | 'content_manager'
  | 'branding'
  | 'settings'
  | 'rooms'
  | 'history'
  | 'timeline'
  | 'development'
  | 'artifacts'
  | 'achievements'
  | 'people'
  | 'memories'
  | 'news'
  | 'hotspots'
  | 'resources'
  | 'sources'
  | 'licenses'
  | 'credits'
  | 'admins';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  group: 'general' | 'heritage' | 'media' | 'governance';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard, group: 'general' },
  { id: 'content_manager', label: 'Quản lý nội dung', icon: Layers, group: 'general', badge: 'Trực tiếp' },
  { id: 'branding', label: 'Nhận diện trường', icon: ImageIcon, group: 'general', badge: 'Logo' },
  { id: 'settings', label: 'Cài đặt chung', icon: Settings, group: 'general' },
  { id: 'rooms', label: 'Sảnh chào & Khu vực', icon: Compass, group: 'general', badge: '9 Phòng' },

  { id: 'artifacts', label: 'Hiện vật lịch sử', icon: Award, group: 'heritage', badge: 'Chuẩn' },
  { id: 'history', label: 'Lịch sử hình thành', icon: BookOpen, group: 'heritage' },
  { id: 'timeline', label: 'Timeline 1966–2026', icon: Calendar, group: 'heritage' },
  { id: 'development', label: 'Quá trình phát triển', icon: TrendingUp, group: 'heritage' },
  { id: 'achievements', label: 'Thành tích', icon: Flame, group: 'heritage' },
  { id: 'people', label: 'Con người & Thế hệ', icon: Users, group: 'heritage' },
  { id: 'memories', label: 'Ký ức & Tri ân', icon: HeartHandshake, group: 'heritage' },
  { id: 'news', label: 'Tin tức & Sự kiện', icon: Newspaper, group: 'heritage' },

  { id: 'hotspots', label: 'Điểm tương tác (Hotspot)', icon: Radio, group: 'media' },
  { id: 'resources', label: 'Tài nguyên số', icon: FolderArchive, group: 'media' },
  { id: 'sources', label: 'Nguồn tư liệu', icon: FileCheck2, group: 'media' },
  { id: 'licenses', label: 'Bản quyền & AI', icon: ShieldAlert, group: 'media' },
  { id: 'credits', label: 'Credits & Lời cảm ơn', icon: Sparkles, group: 'media' },

  { id: 'admins', label: 'Quản trị viên & Phân quyền', icon: UserCheck, group: 'governance' },
];

interface Props {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<Props> = ({
  currentSection,
  onSelectSection,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { branding } = useSchoolBranding();

  const renderGroup = (
    title: string,
    group: 'general' | 'heritage' | 'media' | 'governance'
  ) => {
    const items = NAV_ITEMS.filter((i) => i.group === group);
    return (
      <div className="space-y-1">
        <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {title}
        </h4>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950 to-zinc-900 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm shadow-cyan-950'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-zinc-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="px-5 py-5 border-b border-zinc-800/80 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-800/60 p-1 flex items-center justify-center shadow-lg shadow-cyan-950 flex-shrink-0">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Huy hiệu Trường THPT A Trần Hưng Đạo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              ) : (
                <Sparkles className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider text-zinc-100 uppercase">
                COSMIC HERITAGE
              </h1>
              <p className="text-[10px] text-cyan-400 font-medium">THPT A TRẦN HƯNG ĐẠO</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800/70 font-mono">
            60 Năm • Dấu Ấn & Di Sản
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {renderGroup('Hệ thống & Cài đặt', 'general')}
          {renderGroup('Lõi Di sản (Heritage Core)', 'heritage')}
          {renderGroup('Tư liệu & Đa phương tiện', 'media')}
          {renderGroup('Bảo mật & Quản trị', 'governance')}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80 text-[11px] text-zinc-400 flex items-center justify-between">
          <span className="font-mono">Phase 1: Backend CMS</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trực tuyến
          </span>
        </div>
      </aside>
    </>
  );
};
