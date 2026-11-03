/**
 * History Room (Phòng Lịch Sử – Phần 1: Bắt Đầu Hình Thành 1966–1975) Configuration
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 */

export interface HistoryZone {
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

export interface HistoryRoomConfig {
  roomId: 'history';
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
  zones: HistoryZone[];
}

export const historyRoomConfig: HistoryRoomConfig = {
  roomId: 'history',
  titleVi: 'PHÒNG LỊCH SỬ • PHẦN 1: BẮT ĐẦU HÌNH THÀNH',
  titleEn: 'HALL OF HISTORY • PART 1: THE FOUNDATION ERA',
  periodLabel: '1966 – 1975',
  schoolNameVi: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  schoolNameEn: 'TRAN HUNG DAO HIGH SCHOOL',
  taglineVi: '60 năm – một điểm tựa, một quỹ đạo tương lai.',
  taglineEn: '60 years – one anchor, an orbit for the future.',
  dimensions: {
    width: 12,
    length: 30,
    height: 5.2,
  },
  camera: {
    fov: 55,
    initialPosition: [0, 1.65, 12],
    initialLookAt: [0, 1.8, 8],
    height: 1.65,
    moveSpeed: 4.2,
    collisionPadding: 1.0,
  },
  zones: [
    {
      id: 'entry',
      code: 'KHU 1.0',
      nameVi: 'NGƯỠNG BƯỚC VÀO',
      nameEn: 'TRANSITION PORTAL',
      subtitleVi: 'Chuyển tiếp từ Sảnh chính về quá khứ 1966',
      subtitleEn: 'Transition from Grand Lobby into 1966',
      scenePosition: [0, 0, 12],
      bounds: { minZ: 10.5, maxZ: 14, minX: -5.5, maxX: 5.5 },
    },
    {
      id: 'foundation_1966',
      code: 'KHU 1.1',
      nameVi: 'KHỞI NGUỒN 1966',
      nameEn: 'FOUNDING 1966',
      subtitleVi: 'Điểm tựa đầu tiên – Ngày thành lập trường',
      subtitleEn: 'The First Anchor – School Foundation Milestone',
      scenePosition: [0, 0, 8.5],
      bounds: { minZ: 6.5, maxZ: 10.5, minX: -3.5, maxX: 3.5 },
    },
    {
      id: 'context_1966',
      code: 'KHU 1.2',
      nameVi: 'BỐI CẢNH RA ĐỜI',
      nameEn: 'HISTORICAL CONTEXT',
      subtitleVi: 'Tài liệu, văn bản & bối cảnh lịch sử sơ tán',
      subtitleEn: 'Official Documents & Evacuation Context',
      scenePosition: [-4.2, 0, 4.5],
      bounds: { minZ: 2.5, maxZ: 6.5, minX: -5.5, maxX: -1.5 },
    },
    {
      id: 'wartime',
      code: 'KHU 1.3',
      nameVi: 'NHỮNG NĂM THỜI CHIẾN',
      nameEn: 'WARTIME MEMORY CORRIDOR',
      subtitleVi: 'Lớp học dưới hầm hào & Bản đồ sơ tán',
      subtitleEn: 'Trench Classrooms & Evacuation Map',
      scenePosition: [4.2, 0, 0],
      bounds: { minZ: -2.5, maxZ: 2.5, minX: 1.5, maxX: 5.5 },
    },
    {
      id: 'founding_people',
      code: 'KHU 1.4',
      nameVi: 'NHỮNG NGƯỜI ĐẶT NỀN MÓNG',
      nameEn: 'FOUNDING PIONEERS',
      subtitleVi: 'Tri ân các thế hệ thầy cô giáo tiên phong (1966–1975)',
      subtitleEn: 'Honoring the First Generation Mentors (1966–1975)',
      scenePosition: [-4.2, 0, -4.5],
      bounds: { minZ: -6.5, maxZ: -2.5, minX: -5.5, maxX: -1.5 },
    },
    {
      id: 'artifacts',
      code: 'KHU 1.5',
      nameVi: 'HIỆN VẬT & TÀI LIỆU GỐC',
      nameEn: 'ARTIFACTS & ORIGINAL ARCHIVES',
      subtitleVi: 'Chứng tích lưu giữ: giáo án xưa, đèn dầu, kỷ vật sơ tán',
      subtitleEn: 'Preserved Relics: Ancient Lesson Plans, Oil Lamps, Artifacts',
      scenePosition: [0, 0, -7.5],
      bounds: { minZ: -9.5, maxZ: -5.5, minX: -2.5, maxX: 2.5 },
    },
    {
      id: 'early_generations',
      code: 'KHU 1.6',
      nameVi: 'CÁC THẾ HỆ ĐẦU TIÊN',
      nameEn: 'EARLY GENERATIONS & TRACES',
      subtitleVi: 'Dấu ấn học sinh các khóa 1966–1975 & Bút tích lưu niệm',
      subtitleEn: 'Traces of the First Cohorts & Archival Class Memories',
      scenePosition: [4.2, 0, -10],
      bounds: { minZ: -11.5, maxZ: -8.5, minX: 1.5, maxX: 5.5 },
    },
    {
      id: 'end_1975',
      code: 'KHU 1.7',
      nameVi: 'MỐC KẾT 1975',
      nameEn: 'CULMINATION 1975',
      subtitleVi: 'Khép lại 10 năm đầu tiên – Đất nước hòa bình thống nhất',
      subtitleEn: 'Closing of the First Decade – National Reunification',
      scenePosition: [0, 0, -12],
      bounds: { minZ: -13.5, maxZ: -10.5, minX: -3.5, maxX: 3.5 },
    },
    {
      id: 'exit_development',
      code: 'KHU 1.8',
      nameVi: 'CỬA KẾT NỐI SANG PHẦN 2',
      nameEn: 'PORTAL TO DEVELOPMENT (PART 2)',
      subtitleVi: 'Kết nối sang Giai đoạn Phát triển (1975 – Nay)',
      subtitleEn: 'Gateway to Development Era (1975 – Present)',
      scenePosition: [0, 0, -14],
      bounds: { minZ: -15, maxZ: -13, minX: -3.5, maxX: 3.5 },
    },
  ],
};
