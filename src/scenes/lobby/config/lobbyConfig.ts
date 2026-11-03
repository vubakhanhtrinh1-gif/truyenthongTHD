/**
 * Main Hall (Sảnh Chính / Grand Lobby) Configuration
 * ROYAL MODERN HERITAGE • DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 */

export interface GatewayInfo {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  position: [number, number, number];
  rotationY: number;
  doorWidth: number;
  doorHeight: number;
}

export interface LobbyConfig {
  roomCode: 'lobby';
  titleVi: string;
  titleEn: string;
  schoolNameVi: string;
  schoolNameEn: string;
  taglineVi: string;
  taglineEn: string;
  welcomeMessageVi: string;
  welcomeMessageEn: string;
  colors: {
    midnight: string;
    deepNavy: string;
    heritageGold: string;
    heritageGoldGlow: string;
    lacquerRed: string;
    ivory: string;
    graphite: string;
    ambientLight: string;
  };
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  camera: {
    fov: number;
    initialPosition: [number, number, number];
    initialLookAt: [number, number, number];
    height: number;
    moveSpeed: number;
    collisionPadding: number;
  };
  gateways: GatewayInfo[];
  audioGreeting: {
    enabled: boolean;
    audioUrl: string | null;
    transcriptVi: string;
    transcriptEn: string;
  };
}

export const lobbyConfig: LobbyConfig = {
  roomCode: 'lobby',
  titleVi: 'SẢNH CHÍNH DI SẢN • DẤU ẤN 60 NĂM',
  titleEn: 'GRAND HERITAGE LOBBY • 60-YEAR MILESTONE',
  schoolNameVi: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  schoolNameEn: 'TRAN HUNG DAO HIGH SCHOOL',
  taglineVi: '60 năm – một điểm tựa, một quỹ đạo tương lai.',
  taglineEn: '60 years – one anchor, an orbit for the future.',
  welcomeMessageVi: 'CHÀO MỪNG BẠN TRỞ VỀ',
  welcomeMessageEn: 'WELCOME HOME',
  colors: {
    midnight: '#2A2018',
    deepNavy: '#1E2538',
    heritageGold: '#D4AF37',
    heritageGoldGlow: '#FFE599',
    lacquerRed: '#8B2029',
    ivory: '#F8F4EB',
    graphite: '#4A3B2E',
    ambientLight: '#FFF6E8',
  },
  dimensions: {
    width: 34,
    length: 50,
    height: 9.5,
  },
  camera: {
    fov: 60,
    initialPosition: [0, 1.7, 18],
    initialLookAt: [0, 2.2, 0],
    height: 1.7,
    moveSpeed: 4.8,
    collisionPadding: 1.8,
  },
  gateways: [
    {
      id: 'history',
      code: 'KHU 1',
      nameVi: 'LỊCH SỬ HÌNH THÀNH',
      nameEn: 'FOUNDING HISTORY',
      subtitleVi: 'Cội nguồn & năm tháng sơ tán (1966–1975)',
      subtitleEn: 'Origins & Evacuation Era (1966–1975)',
      position: [-16, 0, 4],
      rotationY: Math.PI / 2,
      doorWidth: 4.5,
      doorHeight: 5.2,
    },
    {
      id: 'timeline',
      code: 'ORBITAL',
      nameVi: 'DÒNG THỜI GIAN (1966–2026)',
      nameEn: 'ORBITAL TIMELINE (1966–2026)',
      subtitleVi: 'Biên niên sử 6 thập kỷ trường tồn',
      subtitleEn: 'Six Decades of Living Chronicle',
      position: [-16, 0, -8],
      rotationY: Math.PI / 2,
      doorWidth: 4.5,
      doorHeight: 5.2,
    },
    {
      id: 'development',
      code: 'KHU 2',
      nameVi: 'QUÁ TRÌNH PHÁT TRIỂN',
      nameEn: 'CAMPUS & DEVELOPMENT',
      subtitleVi: 'Chuyển mình, mở rộng & hiện đại hóa',
      subtitleEn: 'Evolution, Scale & Modern Campus',
      position: [16, 0, 4],
      rotationY: -Math.PI / 2,
      doorWidth: 4.5,
      doorHeight: 5.2,
    },
    {
      id: 'achievements',
      code: 'KHU 3',
      nameVi: 'BẢNG VÀNG THÀNH TÍCH',
      nameEn: 'HALL OF ACHIEVEMENTS',
      subtitleVi: 'Huân chương Lao động, Bằng khen Thủ tướng & thành tích 2025–2026',
      subtitleEn: 'Labour Medals, Prime Minister Commendation & 2025-2026 Honors',
      position: [16, 0, -8],
      rotationY: -Math.PI / 2,
      doorWidth: 4.5,
      doorHeight: 5.2,
    },
    {
      id: 'memory',
      code: 'KHU 4',
      nameVi: 'KÝ ỨC & TRI ÂN',
      nameEn: 'MEMORIES & GRATITUDE',
      subtitleVi: 'Những thế hệ người thầy & học trò',
      subtitleEn: 'Generations of Mentors & Alumni',
      position: [0, 0, -24],
      rotationY: 0,
      doorWidth: 4.8,
      doorHeight: 5.2,
    },
  ],
  audioGreeting: {
    enabled: true,
    audioUrl: null, // Ready for official school welcome audio recording
    transcriptVi:
      'Chào mừng quý vị đại biểu, các thế hệ thầy cô giáo, cựu học sinh và các em học sinh trở về với Sảnh chính Di sản số 60 năm Trường THPT A Trần Hưng Đạo.',
    transcriptEn:
      'Welcome to the 60th Anniversary Digital Heritage Main Hall of Tran Hung Dao High School.',
  },
};
