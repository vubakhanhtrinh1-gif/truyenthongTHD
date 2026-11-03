/**
 * Development Room (Khu 2: Quá Trình Phát Triển 1974–2026) Configuration
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 */

export interface DevelopmentZone {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  scenePosition: [number, number, number];
  bounds: {
    minZ: number;
    maxZ: number;
    minX: number;
    maxX: number;
  };
}

export interface DevelopmentRoomConfig {
  roomId: 'development';
  titleVi: string;
  titleEn: string;
  periodLabel: string;
  schoolNameVi: string;
  schoolNameEn: string;
  taglineVi: string;
  taglineEn: string;
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
  zones: DevelopmentZone[];
}

export const developmentRoomConfig: DevelopmentRoomConfig = {
  roomId: 'development',
  titleVi: 'PHÒNG PHÁT TRIỂN • HÀNH TRÌNH TỪ TRUYỀN THỐNG ĐẾN TƯƠNG LAI',
  titleEn: 'HALL OF DEVELOPMENT • FROM HERITAGE TO FUTURE HORIZONS',
  periodLabel: '1974 – 2026',
  schoolNameVi: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  schoolNameEn: 'TRAN HUNG DAO A HIGH SCHOOL',
  taglineVi: 'Giữ vững truyền thống — Đổi mới để vươn xa.',
  taglineEn: 'Upholding Tradition — Innovating for Tomorrow.',
  dimensions: {
    width: 16,
    length: 36,
    height: 5.6,
  },
  camera: {
    fov: 52,
    initialPosition: [0, 1.6, 15.2],
    initialLookAt: [0, 1.6, 8.0],
    height: 1.6,
    moveSpeed: 4.8,
    collisionPadding: 0.6,
  },
  zones: [
    {
      id: 'dev_zone_entry',
      code: 'ENTRY',
      nameVi: 'Cổng Khởi Đầu & Định Vị Phát Triển',
      nameEn: 'Orientation & Gateway',
      subtitleVi: 'Khởi động hành trình chuyển mình hơn nửa thế kỷ',
      subtitleEn: 'Embarking on half a century of institutional transformation',
      scenePosition: [0, 0, 14.0],
      bounds: { minZ: 11.5, maxZ: 17.5, minX: -7.5, maxX: 7.5 },
    },
    {
      id: 'dev_zone_master_timeline',
      code: 'CENTER',
      nameVi: 'Trục Thời Gian Điêu Khắc (Master Timeline)',
      nameEn: 'Central Master Timeline',
      subtitleVi: 'Biểu tượng điêu khắc 3 thời kỳ phát triển',
      subtitleEn: 'Sculptural installation connecting the three development eras',
      scenePosition: [0, 0, 6.0],
      bounds: { minZ: 2.0, maxZ: 11.5, minX: -7.5, maxX: 7.5 },
    },
    {
      id: 'dev_zone_era1',
      code: 'ERA 1',
      nameVi: 'Thời Kỳ 1: Ổn Định & Khẳng Định Vị Thế (1974–1997)',
      nameEn: 'Era One: Consolidating Identity (1974–1997)',
      subtitleVi: 'Ổn định tại Lộc Vượng, mang tên Trần Hưng Đạo & Huân chương Lao động',
      subtitleEn: 'Postwar stabilization, school naming, and state recognitions',
      scenePosition: [-5.0, 0, -2.0],
      bounds: { minZ: -6.0, maxZ: 2.0, minX: -7.5, maxX: 0.0 },
    },
    {
      id: 'dev_zone_era2',
      code: 'ERA 2',
      nameVi: 'Thời Kỳ 2: Bứt Phá & Trưởng Thành (1997–2016)',
      nameEn: 'Era Two: Breakthrough and Growth (1997–2016)',
      subtitleVi: 'Top 37 toàn quốc, Chuẩn Quốc gia & Huân chương Độc lập',
      subtitleEn: 'National ranking, standard school, and independence medal',
      scenePosition: [5.0, 0, -2.0],
      bounds: { minZ: -6.0, maxZ: 2.0, minX: 0.0, maxX: 7.5 },
    },
    {
      id: 'dev_zone_era3',
      code: 'ERA 3',
      nameVi: 'Thời Kỳ 3: Kiến Tạo Tương Lai & Đổi Mới Số (2016–2026)',
      nameEn: 'Era Three: Creating the Future (2016–2026)',
      subtitleVi: 'Tòa nhà 4 tầng 33 phòng, Chuyển đổi số, Cờ Chính phủ & 60 Năm',
      subtitleEn: 'Digital management, modern campus, and 60th diamond jubilee',
      scenePosition: [0, 0, -11.0],
      bounds: { minZ: -17.5, maxZ: -6.0, minX: -7.5, maxX: 7.5 },
    },
  ],
};
