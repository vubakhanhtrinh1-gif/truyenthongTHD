/**
 * Initial Architectural Metadata & Canonical Room Structures
 * Strict Rule: No fictional historical data, only stable architectural schemas & placeholders
 */
import { Room, SiteSettings } from '../types';
import { roomRepository, siteSettingsRepository } from '../repositories';

export const CANONICAL_ROOMS: Omit<Room, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'gate',
    nameVi: '01. Cổng Vũ Trụ Di Sản',
    nameEn: '01. Cosmic Heritage Gate',
    slug: 'gate',
    descriptionVi: 'Điểm khởi đầu hành trình không gian số 60 năm Trường THPT A Trần Hưng Đạo.',
    descriptionEn: 'The starting gateway into the 60-year digital journey of Tran Hung Dao High School.',
    displayOrder: 1,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'lobby',
    nameVi: '02. Sảnh Chào & Giới Thiệu',
    nameEn: '02. Welcome Lobby & Overview',
    slug: 'lobby',
    descriptionVi: 'Không gian tiền sảnh kết nối các quỹ đạo khám phá lịch sử, thành tựu và con người.',
    descriptionEn: 'The central rotunda connecting orbital paths of history, milestones, and people.',
    displayOrder: 2,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'history',
    nameVi: '03. Lịch Sử Hình Thành',
    nameEn: '03. Historical Foundation',
    slug: 'history',
    descriptionVi: 'Tư liệu về những năm tháng khởi dựng, bối cảnh lịch sử và cội nguồn truyền thống nhà trường.',
    descriptionEn: 'Authoritative archival records of foundational years and school tradition origin.',
    displayOrder: 3,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'timeline',
    nameVi: '04. Dòng Thời Gian 1966–2026',
    nameEn: '04. Orbital Timeline (1966–2026)',
    slug: 'timeline',
    descriptionVi: 'Biên niên sử số hóa 6 thập kỷ với các mốc son lịch sử được kiểm chứng.',
    descriptionEn: 'Digitalized six-decade chronicle featuring verified milestones along the orbital timeline.',
    displayOrder: 4,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'development',
    nameVi: '05. Quá Trình Phát Triển',
    nameEn: '05. Growth & Infrastructure Development',
    slug: 'development',
    descriptionVi: 'Hành trình đổi mới cơ sở vật chất, phong trào thi đua và các giai đoạn chuyển mình.',
    descriptionEn: 'Progression of infrastructure, pedagogical evolution, and school transformations.',
    displayOrder: 5,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'achievements',
    nameVi: '06. Thành Tích & Tự Hào',
    nameEn: '06. Hall of Achievements & Honors',
    slug: 'achievements',
    descriptionVi: 'Tập hợp các huân huy chương, bằng khen và thành tích xuất sắc của thầy và trò.',
    descriptionEn: 'Authoritative collection of medals, certificates, and student-teacher honors.',
    displayOrder: 6,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'memory',
    nameVi: '07. Ký Ức & Tri Ân',
    nameEn: '07. Living Memories & Gratitude',
    slug: 'memory',
    descriptionVi: 'Những câu chuyện, dòng hồi ức và tình cảm tri ân của các thế hệ cán bộ, giáo viên, cựu học sinh.',
    descriptionEn: 'Testimonials, alumni recollections, and words of gratitude across generations.',
    displayOrder: 7,
    status: 'planned',
    isPublished: true,
  },
  {
    id: 'ending',
    nameVi: '08. Điểm Tựa Tương Lai',
    nameEn: '08. Future Trajectory & Epilogue',
    slug: 'ending',
    descriptionVi: 'Thông điệp tiếp nối truyền thống, khát vọng vươn mình trong kỷ nguyên mới.',
    descriptionEn: 'Forward-looking message carrying school traditions into the new era.',
    displayOrder: 8,
    status: 'planned',
    isPublished: true,
  },
];

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, 'id' | 'updatedAt'> = {
  projectTitle: 'COSMIC HERITAGE – DẤU ẤN 60 NĂM',
  projectSubtitle: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966–2026)',
  tagline: '60 năm – một điểm tựa, một quỹ đạo tương lai.',
  schoolName: 'Trường THPT A Trần Hưng Đạo',
  defaultLanguage: 'vi',
  supportedLanguages: ['vi', 'en'],
  welcomeMessageVi: 'Chào mừng bạn đến với Không gian Di sản Số kỷ niệm 60 năm ngày thành lập Trường THPT A Trần Hưng Đạo.',
  welcomeMessageEn: 'Welcome to the Digital Heritage Space commemorating the 60th Anniversary of Tran Hung Dao High School.',
  contactInformation: 'Email: REPLACE_WITH_OFFICIAL_SCHOOL_EMAIL | Điện thoại: REPLACE_WITH_SCHOOL_PHONE',
  maintenanceMode: false,
};

/**
 * Initialize Default Foundation Data
 * Sets up 9 canonical exhibition rooms and default site settings without inventing fake facts.
 */
export async function seedInitialFoundationData(): Promise<void> {
  // 1. Seed or verify site settings
  const existingSettings = await siteSettingsRepository.getSettings();
  if (!existingSettings) {
    await siteSettingsRepository.updateSettings(DEFAULT_SITE_SETTINGS);
  }

  // 2. Seed canonical rooms
  const existingRooms = await roomRepository.getAll();
  const existingMap = new Map(existingRooms.map((r) => [r.id, r]));

  for (const room of CANONICAL_ROOMS) {
    if (!existingMap.has(room.id)) {
      await roomRepository.create(room, room.id);
    }
  }
}
