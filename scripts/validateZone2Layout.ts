/**
 * Automated Zone 2 3D Spatial Layout & Collision Validator
 * Tests all exhibition panels in Zone 2 (Development Room) for:
 * 1. Zero panel-to-panel overlaps.
 * 2. Zero structural column occlusions (adequate margin from columns).
 * 3. Bounding volume and vertical height constraints.
 */

import {
  validateDevelopmentLayout,
  PanelPlacement,
  DEVELOPMENT_COLUMNS,
} from '../src/scenes/development/layout/developmentLayoutValidator';

// Exact panels declared and placed in buildDevelopmentRoomArchitecture()
const ZONE_2_PANELS: PanelPlacement[] = [
  // West Wall Panels (Bên Trái: Lịch sử 1975–2026 & Lịch sử Ban Giám Hiệu)
  { id: 'era1_banner', name: 'Lịch sử 1975–2026 Header Banner', wall: 'west', centerZ: 11.25, centerY: 2.5, width: 3.2, height: 1.6 },
  { id: 'development_1974_stabilization', name: 'Mốc 1974-1982: Ổn định cơ sở & Đổi tên trường', wall: 'west', centerZ: 6.75, centerY: 2.3, width: 3.2, height: 1.5 },
  { id: 'development_1992_visit', name: 'Mốc 1986-1996: Đổi Mới & Bác Giáp về thăm', wall: 'west', centerZ: 2.25, centerY: 2.3, width: 3.4, height: 1.6 },
  { id: 'development_2006_anniversary', name: 'Mốc 2000-2016: Chuẩn QG, Huân chương Độc lập & 50 năm', wall: 'west', centerZ: -2.25, centerY: 2.3, width: 3.4, height: 1.6 },
  { id: 'development_2021_anniversary', name: 'Mốc 2016-2026: THPT A Trần Hưng Đạo & Hướng tới 60 năm', wall: 'west', centerZ: -6.75, centerY: 2.3, width: 3.4, height: 1.6 },
  { id: 'development_leadership_gallery', name: 'Lịch sử BGH: Danh Bộ 9 Thế Hệ Hiệu Trưởng', wall: 'west', centerZ: -11.25, centerY: 2.3, width: 3.6, height: 2.2 },
  { id: 'development_leadership_history', name: 'Lịch sử BGH: Đội Ngũ Cán Bộ Quản Lý & Cống Hiến', wall: 'west', centerZ: -15.75, centerY: 2.3, width: 3.4, height: 1.6 },

  // East Wall Panels (Bên Phải: Điểm nổi bật trường ngày nay & Trung tâm khen thưởng)
  { id: 'development_school_statistics', name: 'Trường Ngày Nay: Bảng Quy Mô & Tăng Trưởng', wall: 'east', centerZ: 11.25, centerY: 2.3, width: 3.6, height: 1.8 },
  { id: 'development_growth_overview', name: 'Trường Ngày Nay: Đội Ngũ Nhà Giáo & Chất Lượng Đào Tạo', wall: 'east', centerZ: 6.75, centerY: 2.3, width: 3.4, height: 1.6 },
  { id: 'development_award_three_labor_orders', name: 'Trung tâm bên phải: Ba Huân chương Lao động & Hình ảnh', wall: 'east', centerZ: 2.25, centerY: 2.3, width: 3.4, height: 2.0 },
  { id: 'development_award_government_ministry_province', name: 'Trung tâm ở giữa: Các phần thưởng lớn Tỉnh, Bộ GD&ĐT, Chính phủ', wall: 'east', centerZ: -2.25, centerY: 2.3, width: 3.4, height: 2.0 },
  { id: 'development_award_prime_minister', name: 'Trung tâm bên trái: Bằng khen Thủ tướng Chính phủ', wall: 'east', centerZ: -6.75, centerY: 2.3, width: 3.4, height: 2.0 },
  { id: 'development_digital_management', name: 'Trường Ngày Nay: Chuyển Đổi Số & Quản Trị Giáo Dục 4.0', wall: 'east', centerZ: -11.25, centerY: 2.3, width: 3.6, height: 1.8 },
  { id: 'development_current_organization', name: 'Trường Ngày Nay: Ban Giám Hiệu & Cơ Cấu Sư Phạm Hiện Nay', wall: 'east', centerZ: -15.75, centerY: 2.3, width: 3.5, height: 1.7 },

  // North Wall Apex & 3 End Wall Picture Frames (Khu Vực Cuối Phòng: 60 Năm & 3 Khung Ảnh CMD)
  { id: 'development_2026_anniversary', name: 'Đại Lễ Kỷ Niệm 60 Năm Thành Lập Trường', wall: 'north', centerZ: -17.4, centerX: 0, centerY: 3.3, width: 5.2, height: 1.4 },
  { id: 'development_end_wall_photo_1', name: 'Khung Ảnh Cuối Phòng 1 (Tải từ CMD)', wall: 'north', centerZ: -17.4, centerX: -2.2, centerY: 1.65, width: 1.85, height: 1.3 },
  { id: 'development_end_wall_photo_2', name: 'Khung Ảnh Cuối Phòng 2 (Tải từ CMD)', wall: 'north', centerZ: -17.4, centerX: 0.0, centerY: 1.65, width: 1.85, height: 1.3 },
  { id: 'development_end_wall_photo_3', name: 'Khung Ảnh Cuối Phòng 3 (Tải từ CMD)', wall: 'north', centerZ: -17.4, centerX: 2.2, centerY: 1.65, width: 1.85, height: 1.3 },
];

console.log('='.repeat(78));
console.log('  ZONE 2 (DEVELOPMENT ROOM) 3D SPATIAL LAYOUT & OCCLUSION VALIDATOR');
console.log('='.repeat(78));

const result = validateDevelopmentLayout(ZONE_2_PANELS, DEVELOPMENT_COLUMNS, 5.6);

if (result.passed) {
  console.log('✅ ZONE 2 3D LAYOUT VALIDATION PASSED (100% SUCCESS)');
  console.log(`- Verified exhibition panels : ${result.totalPanels}`);
  console.log(`- Verified structural columns: ${result.totalColumns}`);
  console.log(`- Panel-to-panel overlaps    : 0 (Zero overlaps detected)`);
  console.log(`- Structural column occlusions: 0 (All panels placed within unobstructed bays)`);
  console.log(`- Visual clearance margin    : >= 0.45m horizontal spacing to neighboring columns`);
  console.log('='.repeat(78));
  process.exit(0);
} else {
  console.error(`❌ ZONE 2 LAYOUT VALIDATION FAILED:\n`);
  result.panelCollisions.forEach((c) => console.error(`  [Overlap] ${c}`));
  result.columnOcclusions.forEach((c) => console.error(`  [Column Occlusion] ${c}`));
  result.boundsViolations.forEach((b) => console.error(`  [Bounds] ${b}`));
  console.error('\n' + '='.repeat(78));
  process.exit(1);
}
