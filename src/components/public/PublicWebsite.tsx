import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Calendar,
  Award,
  BookOpen,
  Users,
  HeartHandshake,
  ShieldCheck,
  FileCheck2,
  Globe2,
  Compass,
  ExternalLink,
  Flame,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';
import { useSchoolBranding } from '../../services/brandingService';
import {
  roomRepository,
  artifactRepository,
  timelineRepository,
  historyRepository,
  developmentRepository,
  achievementRepository,
  peopleRepository,
  memoryRepository,
  sourceRepository,
  licenseRepository,
  siteSettingsRepository,
} from '../../repositories';
import {
  Room,
  Artifact,
  TimelineEvent,
  HistoryPeriod,
  DevelopmentMilestone,
  Achievement,
  Person,
  Memory,
  Source,
  License,
  SiteSettings,
} from '../../types';
import { CmdLoginModal } from '../auth/CmdLoginModal';
import { VerificationStatusBadge } from '../admin/VerificationStatusBadge';

type PublicTab =
  | 'lobby'
  | 'rooms'
  | 'timeline'
  | 'artifacts'
  | 'history'
  | 'development'
  | 'achievements'
  | 'people'
  | 'memories'
  | 'sources';

interface Props {
  onOpenAdmin: () => void;
}

export const PublicWebsite: React.FC<Props> = ({ onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<PublicTab>('lobby');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const { branding } = useSchoolBranding();

  // Settings & Data states
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [historyPeriods, setHistoryPeriods] = useState<HistoryPeriod[]>([]);
  const [milestones, setMilestones] = useState<DevelopmentMilestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected modal items for detailed reading
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    async function loadPublicData() {
      try {
        const [
          sett,
          rList,
          tList,
          aList,
          hList,
          mList,
          achList,
          pList,
          memList,
          sList,
          lList,
        ] = await Promise.all([
          siteSettingsRepository.getSettings(),
          roomRepository.getAll({ publishedOnly: true, orderByField: 'displayOrder', orderDirection: 'asc' }),
          timelineRepository.getAll({ publishedOnly: true, orderByField: 'year', orderDirection: 'asc' }),
          artifactRepository.getAll({ publishedOnly: true, orderByField: 'displayOrder', orderDirection: 'asc' }),
          historyRepository.getAll({ publishedOnly: true, orderByField: 'yearStart', orderDirection: 'asc' }),
          developmentRepository.getAll({ publishedOnly: true, orderByField: 'yearStart', orderDirection: 'asc' }),
          achievementRepository.getAll({ publishedOnly: true, orderByField: 'year', orderDirection: 'desc' }),
          peopleRepository.getAll({ publishedOnly: true, orderByField: 'displayOrder', orderDirection: 'asc' }),
          memoryRepository.getAll({ publishedOnly: true, orderByField: 'displayOrder', orderDirection: 'asc' }),
          sourceRepository.getAll(),
          licenseRepository.getAll(),
        ]);

        setSettings(sett);
        setRooms(rList);
        setTimelineEvents(tList);
        setArtifacts(aList);
        setHistoryPeriods(hList);
        setMilestones(mList);
        setAchievements(achList);
        setPeople(pList);
        setMemories(memList);
        setSources(sList);
        setLicenses(lList);
      } catch (err) {
        console.warn('Could not load public data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPublicData();
  }, []);

  const sourcesMap = new Map(sources.map((s) => [s.id, s]));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('lobby')}>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-cyan-800/60 p-1 flex items-center justify-center shadow-lg shadow-cyan-950 flex-shrink-0">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Huy Hiệu THPT A Trần Hưng Đạo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              ) : (
                <Sparkles className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-zinc-100">
                COSMIC HERITAGE
              </div>
              <div className="text-[10px] sm:text-xs text-cyan-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                THPT A TRẦN HƯNG ĐẠO • 60 NĂM
              </div>
            </div>
          </div>

          {/* Language Toggle & Public Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => setLang('vi')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'vi' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'en' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-zinc-900 overflow-x-auto flex gap-1 py-1.5 scrollbar-none text-xs">
          {[
            { id: 'lobby', label: lang === 'vi' ? 'Sảnh đón tiếp' : 'Welcome Lobby', icon: Compass },
            { id: 'rooms', label: lang === 'vi' ? '9 Phân khu' : '9 Exhibition Rooms', icon: Sparkles },
            { id: 'timeline', label: lang === 'vi' ? 'Dòng thời gian 1966–2026' : 'Timeline 1966–2026', icon: Calendar },
            { id: 'artifacts', label: lang === 'vi' ? 'Kho hiện vật' : 'Artifacts', icon: Award },
            { id: 'history', label: lang === 'vi' ? 'Lịch sử hình thành' : 'History Periods', icon: BookOpen },
            { id: 'development', label: lang === 'vi' ? 'Phát triển' : 'Development', icon: TrendingUp },
            { id: 'achievements', label: lang === 'vi' ? 'Thành tích' : 'Achievements', icon: Flame },
            { id: 'people', label: lang === 'vi' ? 'Nhân vật & Thế hệ' : 'People & Generations', icon: Users },
            { id: 'memories', label: lang === 'vi' ? 'Ký ức & Tri ân' : 'Memories', icon: HeartHandshake },
            { id: 'sources', label: lang === 'vi' ? 'Nguồn tư liệu & AI' : 'Sources & AI Transparency', icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PublicTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-cyan-300 border border-cyan-800/60 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="py-24 text-center text-xs text-zinc-500 font-mono">
            Đang tải dữ liệu di sản số từ Cloud Firestore...
          </div>
        ) : (
          <>
            {/* TAB: LOBBY */}
            {activeTab === 'lobby' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 border border-zinc-800 p-8 sm:p-12 text-center space-y-4">
                  {/* Authentic School Emblem */}
                  <div className="flex justify-center pb-2">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900/90 border border-cyan-800/60 p-2 shadow-2xl backdrop-blur-md">
                      <img
                        src="/school_emblem.png"
                        alt="Biểu trưng chính thức Trường THPT A Trần Hưng Đạo"
                        className="w-full h-full object-contain filter drop-shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DI SẢN GIỮA VŨ TRỤ • 1966 – 2026</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100 uppercase">
                    {settings?.projectTitle || 'COSMIC HERITAGE – DẤU ẤN 60 NĂM'}
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-cyan-400">
                    {settings?.schoolName || 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO'}
                  </p>
                  <p className="text-sm italic text-zinc-400 max-w-2xl mx-auto">
                    &quot;{settings?.tagline || '60 năm – một điểm tựa, một quỹ đạo tương lai.'}&quot;
                  </p>

                  <div className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2">
                    {lang === 'vi'
                      ? settings?.welcomeMessageVi ||
                        'Chào mừng bạn đến với Cổng Di Sản Số 60 năm Trường THPT A Trần Hưng Đạo. Mỗi thế hệ thầy cô, học trò, mỗi kỷ vật và mốc son lịch sử là một vì sao kết nối trên quỹ đạo tự hào.'
                      : settings?.welcomeMessageEn ||
                        'Welcome to the 60th Anniversary Digital Heritage Portal of Tran Hung Dao High School. Every generation, relic, and milestone is an orbital star in our collective memory.'}
                  </div>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('rooms')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-950 cursor-pointer"
                    >
                      <span>Khám phá 9 Phân khu Triển lãm</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Xem Dòng thời gian 1966–2026</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: 9 CANONICAL ROOMS */}
            {activeTab === 'rooms' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-cyan-400" />
                    <span>9 Phân Khu Không Gian Triển Lãm (Canonical Exhibition Rooms)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cấu trúc định danh cố định (Permanent Room IDs) kết nối trực tiếp với không gian
                    3D/360 tương lai.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                          {room.id.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          Thứ tự #{room.displayOrder}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-zinc-100">
                          {lang === 'vi' ? room.nameVi : room.nameEn || room.nameVi}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {lang === 'vi' ? room.descriptionVi : room.descriptionEn || room.descriptionVi}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Slug: /{room.slug}</span>
                        <span className="text-emerald-400 font-medium">Đã sẵn sàng kết nối</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TIMELINE 1966–2026 */}
            {activeTab === 'timeline' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>Dòng Thời Gian Lịch Sử 1966 – 2026 (Orbital Timeline)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Biên niên sử số hóa 60 năm trường THPT A Trần Hưng Đạo với các mốc son đã được
                    thẩm định.
                  </p>
                </div>

                {timelineEvents.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có sự kiện nào được xuất bản. Quản trị viên cập nhật mốc lịch sử qua CMS.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timelineEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-start gap-4"
                      >
                        <div className="sm:w-28 flex-shrink-0">
                          <span className="text-lg font-black font-mono text-cyan-400">
                            {evt.year}
                          </span>
                          {evt.date && (
                            <span className="block text-[11px] text-zinc-400 font-mono">
                              {evt.date}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-sm text-zinc-100">
                              {lang === 'vi' ? evt.titleVi : evt.titleEn || evt.titleVi}
                            </h3>
                            <VerificationStatusBadge
                              status={evt.verificationStatus || 'unverified'}
                            />
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {lang === 'vi' ? evt.descriptionVi : evt.descriptionEn || evt.descriptionVi}
                          </p>

                          {/* Sources citation tag */}
                          {evt.sourceIds && evt.sourceIds.length > 0 && (
                            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500">
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Nguồn đối chiếu:</span>
                              {evt.sourceIds.map((sId) => {
                                const src = sourcesMap.get(sId);
                                return (
                                  <span
                                    key={sId}
                                    className="px-1.5 py-0.2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-400"
                                  >
                                    {src ? src.referenceCode || src.title : sId}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ARTIFACTS GALLERY */}
            {activeTab === 'artifacts' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span>Kho Hiện Vật & Kỷ Vật Lịch Sử (Artifacts Collection)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Huân chương, bằng khen, cờ thi đua và các hiện vật lịch sử có thực của nhà trường.
                  </p>
                </div>

                {artifacts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có hiện vật công khai. Đang chờ hội đồng nhà trường thẩm định và xuất bản.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {artifacts.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArtifact(art)}
                        className="group rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/50 overflow-hidden transition-all cursor-pointer flex flex-col"
                      >
                        <div className="aspect-video bg-zinc-950 border-b border-zinc-800 relative flex items-center justify-center overflow-hidden">
                          {art.imageGallery && art.imageGallery[0] ? (
                            <img
                              src={art.imageGallery[0]}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-zinc-700" />
                          )}
                          <div className="absolute top-2 right-2">
                            <VerificationStatusBadge
                              status={art.verificationStatus || 'unverified'}
                            />
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                              {art.type} {art.year ? `• Niên đại ${art.year}` : ''}
                            </div>
                            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-cyan-300 transition-colors">
                              {lang === 'vi' ? art.titleVi : art.titleEn || art.titleVi}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                              {lang === 'vi' ? art.descriptionVi : art.descriptionEn || art.descriptionVi}
                            </p>
                          </div>

                          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-800/80">
                            <span>Chi tiết hiện vật</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>Lịch Sử Hình Thành (1966 – Nay)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cội nguồn truyền thống qua các giai đoạn lịch sử lớn của nhà trường.
                  </p>
                </div>

                {historyPeriods.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có giai đoạn lịch sử được xuất bản.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {historyPeriods.map((h) => (
                      <div
                        key={h.id}
                        className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/50 text-indigo-300 font-mono font-bold text-xs">
                            {h.yearStart} – {h.yearEnd || 'Nay'}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-zinc-100">
                            {lang === 'vi' ? h.titleVi : h.titleEn || h.titleVi}
                          </h3>
                        </div>

                        {h.subtitleVi && (
                          <p className="text-xs font-semibold text-cyan-400">{h.subtitleVi}</p>
                        )}

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {lang === 'vi' ? h.descriptionVi : h.descriptionEn || h.descriptionVi}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: DEVELOPMENT */}
            {activeTab === 'development' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span>Quá Trình Phát Triển & Cơ Sở Vật Chất</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Các mốc chuyển mình, mở rộng quy mô và hiện đại hóa trường lớp.
                  </p>
                </div>

                {milestones.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có dữ liệu phát triển công khai.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {milestones.map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2"
                      >
                        <div className="text-xs font-mono font-bold text-cyan-400">
                          {m.period || m.yearStart}
                        </div>
                        <h3 className="font-bold text-sm text-zinc-100">{m.titleVi}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{m.descriptionVi}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Bảng Vàng Thành Tích & Tự Hào</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Huân chương cao quý, thành tích thi đua và giải thưởng học sinh giỏi các thời kỳ.
                  </p>
                </div>

                {achievements.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có thành tích công khai.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-amber-400">Năm {ach.year}</span>
                          <span className="text-[10px] text-zinc-400 uppercase font-mono">
                            {ach.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-zinc-100">{ach.titleVi}</h3>
                        <p className="text-xs text-zinc-400 line-clamp-3">{ach.descriptionVi}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PEOPLE */}
            {activeTab === 'people' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>Thế Hệ Lãnh Đạo, Nhà Giáo & Cựu Học Sinh</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Những người thầy, người cô và cựu học sinh đã cống hiến cho truyền thống 60 năm.
                  </p>
                </div>

                {people.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có danh sách nhân vật công khai.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {people.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-cyan-400 text-sm">{p.name[0]}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-zinc-100">{p.name}</h3>
                            <div className="text-xs text-cyan-400">{p.roleVi}</div>
                            {p.period && (
                              <div className="text-[11px] text-zinc-400 font-mono">{p.period}</div>
                            )}
                          </div>
                        </div>

                        {p.shortBioVi && (
                          <p className="text-xs text-zinc-400 leading-relaxed">{p.shortBioVi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MEMORIES */}
            {activeTab === 'memories' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-indigo-400" />
                    <span>Ký Ức & Tri Ân 60 Năm</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Những dòng hồi ức và lời tri ân thiêng liêng hướng về mái trường mến yêu.
                  </p>
                </div>

                {memories.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Chưa có bài viết ký ức nào được xuất bản.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {memories.map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <h3 className="font-bold text-sm text-zinc-100">{m.titleVi}</h3>
                          <span className="text-zinc-400 font-mono">
                            {m.author} {m.generation ? `(${m.generation})` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                          {m.contentVi}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SOURCES & AI DISCLOSURE */}
            {activeTab === 'sources' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Sources section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-emerald-400" />
                      <span>Danh Mục Nguồn Tư Liệu Đối Chiếu (Authoritative Citations)</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Căn cứ tài liệu gốc, văn bản lưu trữ và kỷ yếu được sử dụng để thẩm định di sản.
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                    {sources.map((s) => (
                      <div key={s.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-zinc-100">
                            <span className="font-mono text-cyan-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                              {s.referenceCode || 'TL-THD'}
                            </span>
                            <span>{s.title}</span>
                          </div>
                          <div className="text-zinc-400">
                            Cơ quan: {s.organization || 'Trường THPT A Trần Hưng Đạo'} • Loại: {s.type}
                          </div>
                          {s.description && (
                            <p className="text-[11px] text-zinc-500">{s.description}</p>
                          )}
                        </div>

                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 p-1 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Disclosure section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Minh Bạch Bản Quyền & Công Bố AI (License & AI Disclosure)</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Đảm bảo đạo đức số: Công khai minh bạch mọi tư liệu có sự hỗ trợ của công nghệ AI.
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                    {licenses.map((lic) => (
                      <div key={lic.id} className="p-4 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-zinc-100">
                          <span>{lic.assetName}</span>
                          {lic.aiGenerated && (
                            <span className="text-[10px] font-mono px-2 py-0.2 bg-purple-950 text-purple-300 border border-purple-700/50 rounded-full">
                              AI: {lic.aiTool || 'GenAI'}
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-400">
                          Bản quyền: {lic.licenseType} • Tác giả: {lic.creator}
                        </div>
                        {lic.aiDisclosure && (
                          <p className="text-[11px] text-purple-300/80 italic">
                            &quot;{lic.aiDisclosure}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {selectedArtifact.type} {selectedArtifact.year ? `• ${selectedArtifact.year}` : ''}
                </span>
                <h3 className="text-lg font-bold text-zinc-100">
                  {lang === 'vi' ? selectedArtifact.titleVi : selectedArtifact.titleEn || selectedArtifact.titleVi}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArtifact(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded bg-zinc-800"
              >
                Đóng
              </button>
            </div>

            {selectedArtifact.imageGallery && selectedArtifact.imageGallery[0] && (
              <div className="aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800">
                <img
                  src={selectedArtifact.imageGallery[0]}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                {lang === 'vi'
                  ? selectedArtifact.descriptionVi
                  : selectedArtifact.descriptionEn || selectedArtifact.descriptionVi}
              </p>
              {selectedArtifact.storyVi && (
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="font-bold text-cyan-400 block">Câu chuyện lịch sử gắn liền:</span>
                  <p className="italic text-zinc-400">{selectedArtifact.storyVi}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Public Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/90 text-xs text-zinc-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-semibold text-zinc-300">
              {settings?.schoolName || 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966 – 2026)'}
            </div>
            <div className="text-[11px] text-zinc-500">
              {settings?.contactInformation || 'Bảo tồn & Lan tỏa giá trị di sản số 60 năm thành lập trường.'}
            </div>
          </div>

          {/* Discreet CMD Entry */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 font-mono">
              COSMIC HERITAGE • DI SẢN GIỮA VŨ TRỤ
            </span>
            {/* Exactly as requested: Discreet CMD entry */}
            <button
              onClick={() => setCmdModalOpen(true)}
              className="text-[11px] font-mono text-zinc-600 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
              title="CMD"
            >
              [ CMD ]
            </button>
          </div>
        </div>
      </footer>

      {/* Password-Only CMD Modal */}
      <CmdLoginModal
        isOpen={cmdModalOpen}
        onClose={() => setCmdModalOpen(false)}
        onSuccess={() => {
          onOpenAdmin();
        }}
      />
    </div>
  );
};
