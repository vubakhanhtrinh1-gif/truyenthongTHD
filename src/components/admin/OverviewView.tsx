import React, { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  Compass,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminSection } from './AdminSidebar';
import {
  artifactRepository,
  timelineRepository,
  historyRepository,
  sourceRepository,
  licenseRepository,
  roomRepository,
  peopleRepository,
  siteSettingsRepository,
} from '../../repositories';
import { seedInitialFoundationData } from '../../data/initialSeedData';

interface Props {
  onNavigate: (section: AdminSection) => void;
}

export const OverviewView: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    artifactsCount: 0,
    timelineCount: 0,
    historyCount: 0,
    sourcesCount: 0,
    licensesCount: 0,
    roomsCount: 0,
    peopleCount: 0,
    verifiedCount: 0,
    unverifiedCount: 0,
    loading: true,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const fetchStats = async () => {
    try {
      const [artifacts, timeline, history, sources, licenses, rooms, people] =
        await Promise.all([
          artifactRepository.getAll(),
          timelineRepository.getAll(),
          historyRepository.getAll(),
          sourceRepository.getAll(),
          licenseRepository.getAll(),
          roomRepository.getAll(),
          peopleRepository.getAll(),
        ]);

      let verified = 0;
      let unverified = 0;

      [...artifacts, ...timeline, ...history, ...sources].forEach((item: any) => {
        if (item.verificationStatus === 'verified') verified++;
        else if (item.verificationStatus === 'unverified') unverified++;
      });

      setStats({
        artifactsCount: artifacts.length,
        timelineCount: timeline.length,
        historyCount: history.length,
        sourcesCount: sources.length,
        licensesCount: licenses.length,
        roomsCount: rooms.length,
        peopleCount: people.length,
        verifiedCount: verified,
        unverifiedCount: unverified,
        loading: false,
      });
    } catch (e) {
      console.warn('Could not fetch all stats:', e);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedCanonical = async () => {
    setSeeding(true);
    try {
      await seedInitialFoundationData();
      setSeedSuccess(true);
      await fetchStats();
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error('Seed failed:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-16 w-60 h-60 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NỀN TẢNG QUẢN TRỊ DỮ LIỆU DI SẢN • GIAI ĐOẠN 1</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
            COSMIC HERITAGE – DẤU ẤN 60 NĂM
          </h1>
          <p className="text-sm font-semibold text-cyan-400">
            TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966 – 2026)
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            &quot;60 năm – một điểm tựa, một quỹ đạo tương lai.&quot; Hệ thống quản trị nội dung (CMS)
            bảo tồn dữ liệu lịch sử xác thực, phân tách tuyệt đối giữa{' '}
            <strong className="text-zinc-200">Lõi Di sản (Heritage Core)</strong> và trải nghiệm
            trưng bày vũ trụ tương lai.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('content_manager')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-950 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Quản lý & Sửa nội dung trực tiếp</span>
            </button>

            <button
              onClick={() => onNavigate('branding')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900/60 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Nhận diện trường & Logo</span>
            </button>

            <button
              onClick={handleSeedCanonical}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>
                {seeding
                  ? 'Đang khởi tạo 9 phòng...'
                  : stats.roomsCount === 0
                  ? 'Khởi tạo 9 Phòng Triển lãm & Cài đặt Chuẩn'
                  : 'Kiểm tra & Đồng bộ 9 Phòng Chuẩn'}
              </span>
            </button>

            {seedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Đã khởi tạo thành công 9 phòng triển lãm và cấu hình mặc định!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Core Principle Badge */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-zinc-200 uppercase tracking-wide">
              Nguyên tắc Bất biến:
            </span>{' '}
            <span className="text-zinc-400">
              HERITAGE CORE = IMMUTABLE • Dữ liệu lịch sử cần thẩm định đối chiếu theo tài liệu gốc
              của nhà trường, không tạo dữ liệu hư cấu.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-[11px] text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
          <span>Tư liệu chuẩn: {stats.verifiedCount}</span>
          <span>•</span>
          <span className="text-amber-400">Chờ thẩm định: {stats.unverifiedCount}</span>
        </div>
      </div>

      {/* Statistical Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('artifacts')}
          className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-800/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Hiện vật lịch sử</span>
            <Award className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">
            {stats.artifactsCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Huân huy chương, ảnh, kỷ vật</p>
        </div>

        <div
          onClick={() => onNavigate('timeline')}
          className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-800/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Timeline 1966–2026</span>
            <Calendar className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">
            {stats.timelineCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Mốc sự kiện trên quỹ đạo 60 năm</p>
        </div>

        <div
          onClick={() => onNavigate('sources')}
          className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-800/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Nguồn tư liệu</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">
            {stats.sourcesCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Hồ sơ đối chiếu & thẩm định</p>
        </div>

        <div
          onClick={() => onNavigate('licenses')}
          className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-800/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Bản quyền & AI</span>
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">
            {stats.licensesCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Minh bạch tài sản & công cụ AI</p>
        </div>
      </div>

      {/* Exhibition Sections Status (9 Canonical Rooms) */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Cấu trúc 9 Khu vực Không gian Triển lãm (Canonical Rooms)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Định danh ổn định (Permanent IDs) phục vụ kết nối trực tiếp với giao diện 3D/360 tương lai.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rooms')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
          >
            <span>Quản lý các phòng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'gate', name: '01. GATE', label: 'Cổng Vũ Trụ Di Sản', slug: 'gate' },
            { id: 'lobby', name: '02. LOBBY', label: 'Sảnh Chào & Giới Thiệu', slug: 'lobby' },
            { id: 'history', name: '03. HISTORY', label: 'Lịch Sử Hình Thành', slug: 'history' },
            { id: 'timeline', name: '04. TIMELINE', label: 'Dòng Thời Gian (1966–2026)', slug: 'timeline' },
            { id: 'development', name: '05. DEVELOPMENT', label: 'Quá Trình Phát Triển', slug: 'development' },
            { id: 'achievements', name: '06. ACHIEVEMENTS', label: 'Thành Tích & Tự Hào', slug: 'achievements' },
            { id: 'memory', name: '07. MEMORY', label: 'Ký Ức & Tri Ân', slug: 'memory' },
            { id: 'ending', name: '08. ENDING', label: 'Điểm Tựa Tương Lai', slug: 'ending' },
          ].map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  {r.name}
                </span>
                <span className="text-xs text-zinc-200 font-medium">{r.label}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                id: {r.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('artifacts')}
          className="p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 text-left transition-all"
        >
          <Award className="w-5 h-5 text-cyan-400 mb-2" />
          <h4 className="text-xs font-bold text-zinc-100">Hiện vật (Reference CRUD)</h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            Quản lý hiện vật, huân huy chương, ảnh tư liệu, gán nguồn và xác minh.
          </p>
        </button>

        <button
          onClick={() => onNavigate('sources')}
          className="p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 text-left transition-all"
        >
          <FileCheck2 className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-zinc-100">Đăng ký Nguồn tư liệu</h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            Thiết lập danh mục tài liệu gốc, văn bản lưu trữ, hồ sơ kiểm chứng.
          </p>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 text-left transition-all"
        >
          <Layers className="w-5 h-5 text-indigo-400 mb-2" />
          <h4 className="text-xs font-bold text-zinc-100">Cài đặt & Bàn giao Trường</h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            Tùy chỉnh thông tin liên hệ, tiêu đề di sản, quản lý tài khoản quản trị.
          </p>
        </button>
      </div>
    </div>
  );
};
