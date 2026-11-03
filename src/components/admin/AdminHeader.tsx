import React from 'react';
import { Menu, LogOut, ShieldCheck, Database, KeyRound, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminSection } from './AdminSidebar';

interface Props {
  currentSection: AdminSection;
  onOpenMobileMenu: () => void;
  onSelectSection: (section: AdminSection) => void;
  onBackToPublic?: () => void;
}

const SECTION_TITLES: Record<AdminSection, string> = {
  overview: 'Tổng quan hệ thống',
  content_manager: 'Quản lý & Sửa nội dung trực tiếp (Editorial CMS)',
  branding: 'Nhận diện trường & Biểu trưng chính thức',
  settings: 'Cài đặt chung di sản',
  rooms: 'Sảnh chào & Khu vực triển lãm',
  history: 'Lịch sử hình thành (1966–)',
  timeline: 'Dòng thời gian Orbital Timeline (1966–2026)',
  development: 'Quá trình phát triển & Cơ sở vật chất',
  artifacts: 'Kho hiện vật & Di vật lịch sử',
  achievements: 'Bảng vàng thành tích & Giải thưởng',
  people: 'Thế hệ lãnh đạo, thầy cô & Cựu học sinh',
  memories: 'Ký ức & Tri ân',
  news: 'Tin tức & Hoạt động 60 năm',
  hotspots: 'Điểm tương tác Hotspot',
  resources: 'Kho tài nguyên số & Podcast',
  sources: 'Nguồn tư liệu đối chiếu & Thẩm định',
  licenses: 'Bản quyền & Công bố AI',
  credits: 'Credits & Ban chỉ đạo',
  admins: 'Phân quyền & Quản trị viên',
};

export const AdminHeader: React.FC<Props> = ({
  currentSection,
  onOpenMobileMenu,
  onSelectSection,
  onBackToPublic,
}) => {
  const { user, adminProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 sm:px-8">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-zinc-400 hover:text-zinc-100 lg:hidden rounded-lg hover:bg-zinc-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              CMS V1.0
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-sm font-semibold text-zinc-100">
              {SECTION_TITLES[currentSection] || currentSection}
            </span>
          </div>
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onBackToPublic && (
          <button
            onClick={onBackToPublic}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/40 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Xem trang công chúng</span>
          </button>
        )}
        {/* Firestore Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cloud Firestore</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
            {user?.email ? user.email[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-zinc-200 truncate max-w-[150px]">
              {adminProfile?.displayName || user?.email || 'Quản trị viên'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>ROLE: ADMIN</span>
            </div>
          </div>
        </div>

        {/* Change password shortcut */}
        <button
          onClick={() => onSelectSection('admins')}
          className="p-2 text-zinc-400 hover:text-cyan-400 rounded-lg hover:bg-zinc-900 transition-colors"
          title="Đổi mật khẩu / Quản trị viên"
        >
          <KeyRound className="w-4 h-4" />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-950 transition-colors"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
