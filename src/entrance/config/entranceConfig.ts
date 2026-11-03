/**
 * Entrance Experience Configuration
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 */

export interface EntranceConfig {
  projectTitle: string;
  projectSubtitle: string;
  schoolName: string;
  tagline: string;
  anniversaryLabel: string;
  entranceLabel: string;
  primaryCtaText: string;
  welcomeSubtext: string;
  colors: {
    midnight: string;
    deepNavy: string;
    heritageGold: string;
    heritageGoldGlow: string;
    lacquerRed: string;
    ivory: string;
    graphite: string;
  };
  camera: {
    fov: number;
    initialPosition: [number, number, number];
    lookAt: [number, number, number];
    forwardTargetZ: number;
  };
  timings: {
    revealDuration: number;
    enterTransitionDuration: number;
  };
  assetSlots: {
    logoPlaceholderUrl: string | null;
    schoolEmblemUrl: string | null;
  };
}

export const entranceConfig: EntranceConfig = {
  projectTitle: 'COSMIC HERITAGE',
  projectSubtitle: 'DẤU ẤN 60 NĂM',
  schoolName: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  tagline: '60 năm – một điểm tựa, một quỹ đạo tương lai.',
  anniversaryLabel: '1966 – 2026',
  entranceLabel: 'ENTER THE MEMORY',
  primaryCtaText: 'BẮT ĐẦU THAM QUAN',
  welcomeSubtext: 'CHÀO MỪNG BẠN TRỞ VỀ KHÔNG GIAN KÝ ỨC',
  colors: {
    midnight: '#0B1020',
    deepNavy: '#141B30',
    heritageGold: '#C7A15A',
    heritageGoldGlow: '#E5C175',
    lacquerRed: '#7A2029',
    ivory: '#F3ECDD',
    graphite: '#252525',
  },
  camera: {
    fov: 48,
    initialPosition: [0, 1.6, 9.5],
    lookAt: [0, 2.2, 0],
    forwardTargetZ: -2.5,
  },
  timings: {
    revealDuration: 6.0,
    enterTransitionDuration: 2.8,
  },
  assetSlots: {
    logoPlaceholderUrl: null, // Reserved slot for official high-res emblem
    schoolEmblemUrl: null,
  },
};
