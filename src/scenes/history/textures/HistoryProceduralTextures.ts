import * as THREE from 'three';

/**
 * Procedural High-Fidelity Textures for History Room (Part 1: 1966–1975)
 * Pure HTML5 Canvas textures - zero external download delays
 */

// 1. History Room Luxurious Golden Parquet Floor Texture (with subtle 30% deep charcoal undertone)
export function createHistoryWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep honey-gold polished oak with 30% dark richness
  const bg = ctx.createLinearGradient(0, 0, 0, 1024);
  bg.addColorStop(0, '#9a7b45');
  bg.addColorStop(0.5, '#7e6231');
  bg.addColorStop(1, '#664d23');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Parquet plank lines with gold beveling
  const plankH = 128;
  for (let y = 0; y < 1024; y += plankH) {
    ctx.strokeStyle = 'rgba(140, 95, 35, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // 24K Gold divider inlay ribbon
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + 1);
    ctx.lineTo(1024, y + 1);
    ctx.stroke();

    // Staggered vertical plank joins
    const offset = (y / plankH) % 2 === 0 ? 0 : 256;
    for (let x = offset; x < 1024; x += 512) {
      ctx.strokeStyle = 'rgba(140, 95, 35, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + plankH);
      ctx.stroke();
    }
  }

  // Fine golden wood grain shimmer
  ctx.fillStyle = 'rgba(255, 240, 200, 0.08)';
  for (let i = 0; i < 900; i++) {
    const y = Math.random() * 1024;
    const h = 1 + Math.random() * 2;
    ctx.fillRect(0, y, 1024, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 10);
  return texture;
}

// 2. Imperial Museum Champagne Limestone & Gold Boiserie Wall Texture
export function createHistoryWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm champagne bronze gallery wall base (reduced glare, 30% deep museum contrast)
  const wallBg = ctx.createLinearGradient(0, 0, 0, 1024);
  wallBg.addColorStop(0, '#c4b59d');
  wallBg.addColorStop(0.7, '#b3a288');
  wallBg.addColorStop(1, '#9b8a70');
  ctx.fillStyle = wallBg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle natural limestone micro-texture
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 768;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(212, 175, 55, 0.03)' : 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Upper Classical Architectural Boiserie Molding (Gold Leaf Frames)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 64, 440, 640);
  ctx.strokeRect(536, 64, 440, 640);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(58, 74, 420, 620);
  ctx.strokeRect(546, 74, 420, 620);

  // Lower Warm Honey-Teak & Gold Wainscoting Base
  const wainscotBg = ctx.createLinearGradient(0, 768, 0, 1024);
  wainscotBg.addColorStop(0, '#e5d3b3');
  wainscotBg.addColorStop(0.5, '#dbc49f');
  wainscotBg.addColorStop(1, '#cfb58c');
  ctx.fillStyle = wainscotBg;
  ctx.fillRect(0, 768, 1024, 256);

  // Wainscoting Upper Gold Cornice Rail
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 768, 1024, 8);

  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 800, 960, 192);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 808, 944, 176);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. 1966 Circular Monument Medallion Texture (Signature Black & 24K Gold)
export function createFoundation1966MedallionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = 512;
  const cy = 512;

  // Signature Deep Obsidian Black & Imperial Gold disc gradient (Quả cầu / đĩa tròn đen vàng)
  const bg = ctx.createRadialGradient(cx, cy, 30, cx, cy, 500);
  bg.addColorStop(0, '#221b10');
  bg.addColorStop(0.35, '#15120c');
  bg.addColorStop(0.7, '#0b0a08');
  bg.addColorStop(1, '#050403');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.fill();

  // Concentric Embossed 24K Gold Rings
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 482, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 465, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.arc(cx, cy, 450, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 1966 Monumental Numeral
  ctx.fillStyle = '#ffd988';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 160px serif';
  ctx.shadowColor = 'rgba(255, 217, 136, 0.8)';
  ctx.shadowBlur = 24;
  ctx.fillText('1966', cx, cy - 40);
  ctx.shadowBlur = 0;

  // Subtitles
  ctx.fillStyle = '#f3ecdd';
  ctx.font = 'bold 36px serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('KHỞI NGUỒN LỊCH SỬ', cx, cy + 60);

  ctx.fillStyle = '#c7a15a';
  ctx.font = '500 24px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO', cx, cy + 115);

  ctx.fillStyle = '#d4bc88';
  ctx.font = 'italic 20px serif';
  ctx.fillText('“Năm tháng sơ tán & những ngọn đèn đầu tiên”', cx, cy + 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 4. 1975 Culmination Monument Texture
export function createEnd1975PlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Polished 24K Gold Relief Plaque Gradient
  const bg = ctx.createLinearGradient(0, 0, 1024, 512);
  bg.addColorStop(0, '#f9e4b7');
  bg.addColorStop(0.3, '#d4af37');
  bg.addColorStop(0.7, '#c69a26');
  bg.addColorStop(1, '#ebd097');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 512);

  // Triple Embossed Imperial Gold Border
  ctx.strokeStyle = '#8a6514';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 992, 480);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 972, 460);

  ctx.fillStyle = '#2c1508';
  ctx.textAlign = 'center';
  ctx.font = 'bold 115px serif';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
  ctx.shadowBlur = 12;
  ctx.fillText('1975', 512, 160);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#4a2610';
  ctx.font = 'bold 34px serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('MỐC SON HÒA BÌNH • KHÉP LẠI PHẦN 1', 512, 260);

  ctx.fillStyle = '#6d3c16';
  ctx.font = '600 20px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('10 NĂM ĐẦU TIÊN (1966 – 1975) LÀM ĐIỂM TỰA TƯƠNG LAI', 512, 330);

  ctx.fillStyle = '#7a451d';
  ctx.font = 'italic 19px serif';
  ctx.fillText('Tiến bước sang Giai đoạn Phát triển (Phần 2: 1975 – Nay) →', 512, 400);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 5. Zone Header Plaque Texture
export function createZoneHeaderTexture(
  titleVi: string,
  titleEn: string,
  code: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm amber gold plaque with gold leaf
  const bg = ctx.createLinearGradient(0, 0, 1024, 256);
  bg.addColorStop(0, '#e8dcbe');
  bg.addColorStop(0.5, '#dcceaa');
  bg.addColorStop(1, '#cbba91');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 1004, 236);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 20, 984, 216);

  // Code pill in imperial gold
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(432, 24, 160, 30);
  ctx.fillStyle = '#2c1508';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(code, 512, 45);

  // Main Title
  ctx.fillStyle = '#2c160c';
  ctx.font = 'bold 40px serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(titleVi, 512, 126);

  // Subtitle
  ctx.fillStyle = '#7a5127';
  ctx.font = 'italic 20px serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(titleEn, 512, 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 6. Archival Parchment Document Display Texture
export function createParchmentDocumentTexture(
  title: string,
  sub: string,
  fieldTag: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 724; // ~A4 ratio
  const ctx = canvas.getContext('2d')!;

  // Aged archival paper gradient
  const bg = ctx.createLinearGradient(0, 0, 512, 724);
  bg.addColorStop(0, '#f1e6cf');
  bg.addColorStop(0.5, '#eae0c5');
  bg.addColorStop(1, '#dfd2b2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 724);

  // Paper fiber & vintage vignette
  ctx.strokeStyle = 'rgba(120, 80, 40, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 472, 684);

  ctx.strokeStyle = 'rgba(120, 80, 40, 0.15)';
  ctx.strokeRect(28, 28, 456, 668);

  // Title
  ctx.fillStyle = '#2c1808';
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px serif';
  ctx.fillText(title, 256, 80);

  ctx.font = 'italic 14px serif';
  ctx.fillStyle = '#63421e';
  ctx.fillText(sub, 256, 115);

  // Red seal emblem stamp
  ctx.strokeStyle = 'rgba(160, 25, 25, 0.65)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(380, 560, 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(160, 25, 25, 0.7)';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('TRẦN HƯNG ĐẠO', 380, 555);
  ctx.fillText('1966', 380, 572);

  // Simulated vintage text lines
  ctx.strokeStyle = 'rgba(40, 25, 10, 0.35)';
  ctx.lineWidth = 1.5;
  for (let y = 160; y < 500; y += 22) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(472 - (y % 40), y);
    ctx.stroke();
  }

  // Database field tag at bottom
  ctx.fillStyle = '#7a5a3a';
  ctx.font = '11px monospace';
  ctx.fillText(fieldTag, 256, 670);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 7. Interactive Evacuation Map Surface Texture
export function createEvacuationMapPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  // Warm golden vintage canvas map background
  const bg = ctx.createLinearGradient(0, 0, 1024, 680);
  bg.addColorStop(0, '#fbf4e2');
  bg.addColorStop(0.5, '#f5e9ce');
  bg.addColorStop(1, '#ebdcb8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 680);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 992, 648);

  ctx.strokeStyle = 'rgba(180, 130, 45, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, 972, 628);

  ctx.fillStyle = '#2c1508';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px serif';
  ctx.fillText('SƠ ĐỒ ĐỊA BÀN SƠ TÁN & DẠY HỌC THỜI CHIẾN (1966–1975)', 512, 64);

  ctx.fillStyle = '#7a5223';
  ctx.font = 'italic 16px serif';
  ctx.fillText('{{DB: history | evacuation_map | image/png 3000x2000 | high}}', 512, 98);

  // Topographical golden grid lines
  ctx.strokeStyle = 'rgba(190, 140, 50, 0.18)';
  ctx.lineWidth = 1;
  for (let x = 60; x < 1024; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.lineTo(x, 620);
    ctx.stroke();
  }
  for (let y = 140; y < 640; y += 60) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(984, y);
    ctx.stroke();
  }

  // Simulated evacuation routes in royal cinnabar & gold
  ctx.strokeStyle = '#b8202b';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(250, 480);
  ctx.lineTo(420, 360);
  ctx.lineTo(620, 400);
  ctx.lineTo(780, 260);
  ctx.stroke();
  ctx.setLineDash([]);

  // Checkpoints
  const pins = [
    { x: 250, y: 480, name: 'Vị trí ban đầu (1966)' },
    { x: 420, y: 360, name: 'Điểm sơ tán A' },
    { x: 620, y: 400, name: 'Điểm sơ tán B' },
    { x: 780, y: 260, name: 'Trường lớp hầm hào (1972)' },
  ];

  pins.forEach((p) => {
    ctx.fillStyle = '#9e1b24';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffd988';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#3a1f0a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(p.name, p.x, p.y - 18);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 8. Martyrs and Military Enlistment Memorial Stele Texture (Section 1.5)
export function createMartyrsMemorialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Royal Imperial crimson lacquer background
  const bg = ctx.createLinearGradient(0, 0, 0, 768);
  bg.addColorStop(0, '#75131b');
  bg.addColorStop(0.5, '#5c0c13');
  bg.addColorStop(1, '#42080d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 768);

  // Embossed 24K Gold ornate border
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 988, 732);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 968, 712);

  // Red star crest with gold ring
  ctx.fillStyle = '#a6232b';
  ctx.beginPath();
  ctx.arc(512, 85, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffe29a';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 38px serif';
  ctx.textAlign = 'center';
  ctx.fillText('★', 512, 98);

  // Main Header
  ctx.fillStyle = '#ffe5a3';
  ctx.font = 'bold 28px serif';
  ctx.fillText('1.5 THẦY VÀ TRÒ LÊN ĐƯỜNG NHẬP NGŨ', 512, 160);

  ctx.font = 'italic 17px serif';
  ctx.fillStyle = '#fcecd2';
  ctx.fillText('Ghi nhớ công ơn những người con ưu tú đã hy sinh vì nền độc lập tự do của Tổ quốc', 512, 196);

  // Divider in gold leaf
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 220);
  ctx.lineTo(874, 220);
  ctx.stroke();

  // Martyrs list
  const martyrs = [
    'Trần Văn Long',
    'Bùi Quang Thành',
    'Trần Đình Phú',
    'Nguyễn Văn Bật',
    'Lương Xuân Ẩn',
    'Đỗ Văn Chới',
    'Ninh Văn Đức',
  ];

  ctx.textAlign = 'left';
  martyrs.forEach((name, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 140 : 560;
    const y = 280 + row * 65;

    // Golden star bullet
    ctx.fillStyle = '#ffd988';
    ctx.font = 'bold 20px serif';
    ctx.fillText('✦', x - 30, y);

    // Martyr name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px serif';
    ctx.fillText(`Liệt sĩ: ${name}`, x, y);
  });

  // Verification marker note
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'italic 16px serif';
  ctx.fillText('Danh sách trên [cần xác nhận]', 512, 600);

  ctx.font = '13px monospace';
  ctx.fillStyle = '#eed8b2';
  ctx.fillText('TRÍCH XUẤT TỪ: "TƯ LIỆU CHUẨN VỀ TRUYỀN THỐNG 60 NĂM TRƯỜNG THPT A TRẦN HƯNG ĐẠO"', 512, 650);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// ============================================================================
// 4 TEXT PANELS FOR 4 SIDES (4 BÊN) - TƯ LIỆU CHUẨN KHU 1 (1966-1975)
// LUXURIOUS GOLDEN EXHIBITION GALLERY STYLING (MÀU VÀNG TRIỂN LÃM SANG TRỌNG)
// ============================================================================

// SIDE 1: 1.1 Thông tin thành lập (Phía Trước / Nam)
export function createSide1FoundationTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm amber-gold museum parchment (calibrated with 30% darkness reduction for comfort)
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#f2e8d3');
  grad.addColorStop(0.4, '#e7d9be');
  grad.addColorStop(0.8, '#d8c5a4');
  grad.addColorStop(1, '#c5b08c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Triple Embossed 24K Gold Leaf Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 984);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, 964, 964);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, 948, 948);

  // Top Regal Gold Header Plaque
  const plaqueGrad = ctx.createLinearGradient(160, 48, 864, 48);
  plaqueGrad.addColorStop(0, '#d4af37');
  plaqueGrad.addColorStop(0.5, '#ffe29a');
  plaqueGrad.addColorStop(1, '#d4af37');
  ctx.fillStyle = plaqueGrad;
  ctx.fillRect(160, 48, 704, 40);
  ctx.strokeStyle = '#9c6f14';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, 48, 704, 40);

  ctx.fillStyle = '#2d1608';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BÊN 1 (PHÍA NAM) • KHU 1: LỊCH SỬ HÌNH THÀNH [id: history]', 512, 74);

  // Main Header in Imperial Mahogany Serif
  ctx.fillStyle = '#2c1508';
  ctx.font = 'bold 36px serif';
  ctx.fillText('1.1 THÔNG TIN THÀNH LẬP', 512, 135);

  ctx.fillStyle = '#6b411d';
  ctx.font = 'italic 18px serif';
  ctx.fillText('Trường Phổ thông cấp III Mỹ Lộc (1966) — Nay là THPT A Trần Hưng Đạo', 512, 170);

  // Table Data
  const rows = [
    { label: 'Thời điểm thành lập', val: 'Trung tuần tháng 6/1966, do tỉnh Nam Hà chủ trương thành lập' },
    { label: 'Khai giảng khóa đầu', val: 'Mùa thu năm 1966, tại đình Lang Xá' },
    { label: 'Nơi thành lập', val: 'Thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc' },
    { label: 'Quy mô ngày đầu', val: '3 tổ chuyên môn, 5 lớp, khoảng 200 học sinh\n(riêng quy mô ngày đầu, gần 200 học sinh)' },
    { label: 'Ban Giám hiệu đầu tiên', val: 'Hiệu trưởng: thầy Phạm Quốc Dũng\nPhó Hiệu trưởng: thầy Đặng Công Thành' },
    { label: 'Ổn định địa điểm', val: 'Tháng 10/1974, sau 5 lần di chuyển,\ntrên vùng đất mang dấu ấn Vương triều Trần' },
    { label: 'Tên trường giai đoạn này', val: 'Trường Phổ thông cấp III Mỹ Lộc (thường gọi Cấp III Mỹ Lộc)\n— theo mốc thành lập của tỉnh Nam Hà; tên tỉnh khi đó là Nam Hà' },
  ];

  let currentY = 220;
  rows.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    const rowH = idx === 3 || idx === 4 || idx === 5 || idx === 6 ? 94 : 64;

    // Card background in warm ivory/cream
    ctx.fillStyle = isEven ? '#ffffff' : '#fcf7ec';
    ctx.fillRect(60, currentY - 26, 904, rowH);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currentY - 26, 904, rowH);

    // Label Column in rich bronze mahogany
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#4c260e';
    ctx.fillText(r.label, 80, currentY + 12);

    // Value Column in crisp dark bronze
    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#1e140d';
    const lines = r.val.split('\n');
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, 350, currentY + 8 + lIdx * 30);
    });

    currentY += rowH + 10;
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a5128';
  ctx.font = 'italic 16px serif';
  ctx.fillText('Tư liệu chuẩn 60 năm truyền thống — Trích xuất nguyên văn hồ sơ gốc', 512, 975);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// SIDE 2: 1.2 Trường ra đời năm 1966 (Bên Trái / Tây)
export function createSide2Birth1966Texture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm amber-gold museum parchment (calibrated with 30% darkness reduction for comfort)
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#f2e8d3');
  grad.addColorStop(0.4, '#e7d9be');
  grad.addColorStop(0.8, '#d8c5a4');
  grad.addColorStop(1, '#c5b08c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Triple 24K Gold Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 984);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, 964, 964);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, 948, 948);

  // Top Plaque
  const plaqueGrad = ctx.createLinearGradient(160, 48, 864, 48);
  plaqueGrad.addColorStop(0, '#d4af37');
  plaqueGrad.addColorStop(0.5, '#ffe29a');
  plaqueGrad.addColorStop(1, '#d4af37');
  ctx.fillStyle = plaqueGrad;
  ctx.fillRect(160, 48, 704, 40);
  ctx.strokeStyle = '#9c6f14';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, 48, 704, 40);

  ctx.fillStyle = '#2d1608';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BÊN 2 (PHÍA TÂY) • KHU 1: LỊCH SỬ HÌNH THÀNH [id: history]', 512, 74);

  // Main Header
  ctx.fillStyle = '#2c1508';
  ctx.font = 'bold 36px serif';
  ctx.fillText('1.2 TRƯỜNG RA ĐỜI NĂM 1966', 512, 135);

  ctx.fillStyle = '#6b411d';
  ctx.font = 'italic 18px serif';
  ctx.fillText('Bối cảnh lịch sử, ý nghĩa mở trường và triết lý giáo dục kiên cường', 512, 170);

  // Paragraph 1 card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(60, 210, 904, 220);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 210, 904, 220);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#241710';
  ctx.font = '22px serif';
  const p1Lines = [
    'Trung tuần tháng 6 năm 1966, khi cuộc kháng chiến chống Mỹ bước vào',
    'giai đoạn ác liệt, tỉnh Nam Hà đã thành lập Trường Phổ thông',
    'cấp III Mỹ Lộc tại thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc. Mùa thu năm ấy,',
    'những lớp học đầu tiên mở cửa bên sân đình Lang Xá.',
    '',
    'Ngày ấy trường chỉ có 3 tổ chuyên môn, 5 lớp học với khoảng 200 học sinh.',
    'Ban Giám hiệu đầu tiên gồm Hiệu trưởng: thầy Phạm Quốc Dũng, và Phó Hiệu trưởng:',
    'thầy Đặng Công Thành.'
  ];
  p1Lines.forEach((l, idx) => ctx.fillText(l, 85, 248 + idx * 24));

  // Paragraph 2 card
  ctx.fillStyle = '#fdfcf9';
  ctx.fillRect(60, 460, 904, 270);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 460, 904, 270);

  ctx.fillStyle = '#241710';
  ctx.font = '22px serif';
  const p2Lines = [
    'Mở một trường cấp III giữa bom đạn mang ý nghĩa rõ ràng: tạo cơ hội học tập',
    'cho con em địa phương, giữ cho dòng chảy tri thức không đứt đoạn, và đào tạo',
    'những lớp thanh niên đủ tri thức, bản lĩnh để xây dựng quê hương sau chiến tranh.',
    '',
    'Ngày ấy không có bản tuyên ngôn nào viết thành văn.',
    'Triết lý của trường thể hiện qua việc làm:',
    '“Hoàn cảnh nào việc học cũng không được gián đoạn.”'
  ];
  p2Lines.forEach((l, idx) => {
    if (idx === 6) {
      ctx.fillStyle = '#8f2029';
      ctx.font = 'bold italic 25px serif';
    } else {
      ctx.fillStyle = '#241710';
      ctx.font = '22px serif';
    }
    ctx.fillText(l, 85, 505 + idx * 32);
  });

  // Callout Box in Imperial Gold
  const calloutGrad = ctx.createLinearGradient(60, 760, 964, 910);
  calloutGrad.addColorStop(0, '#fef6e2');
  calloutGrad.addColorStop(1, '#fdecc2');
  ctx.fillStyle = calloutGrad;
  ctx.fillRect(60, 760, 904, 150);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(60, 760, 904, 150);

  ctx.fillStyle = '#7a2028';
  ctx.font = 'bold 22px serif';
  ctx.fillText('✦ TRIẾT LÝ HÀNH ĐỘNG GIAI ĐOẠN 1966:', 85, 805);
  ctx.fillStyle = '#3a200e';
  ctx.font = 'italic 20px serif';
  ctx.fillText('Giữ vững ngọn đèn tri thức bên chiến hào — Tương lai của quê hương phụ thuộc', 85, 845);
  ctx.fillText('vào ý chí học tập của thế hệ hôm nay giữa muôn vàn thử thách bom đạn.', 85, 880);

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a5128';
  ctx.font = 'italic 16px serif';
  ctx.fillText('Tư liệu chuẩn 60 năm truyền thống — Trích xuất nguyên văn hồ sơ gốc', 512, 975);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// SIDE 3: 1.3 Dạy và học trong chiến tranh (Bên Phải / Đông)
export function createSide3WartimeTeachingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm amber-gold museum parchment (calibrated with 30% darkness reduction for comfort)
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#f2e8d3');
  grad.addColorStop(0.4, '#e7d9be');
  grad.addColorStop(0.8, '#d8c5a4');
  grad.addColorStop(1, '#c5b08c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Triple 24K Gold Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 984);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, 964, 964);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, 948, 948);

  // Top Plaque
  const plaqueGrad = ctx.createLinearGradient(160, 48, 864, 48);
  plaqueGrad.addColorStop(0, '#d4af37');
  plaqueGrad.addColorStop(0.5, '#ffe29a');
  plaqueGrad.addColorStop(1, '#d4af37');
  ctx.fillStyle = plaqueGrad;
  ctx.fillRect(160, 48, 704, 40);
  ctx.strokeStyle = '#9c6f14';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, 48, 704, 40);

  ctx.fillStyle = '#2d1608';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BÊN 3 (PHÍA ĐÔNG) • KHU 1: LỊCH SỬ HÌNH THÀNH [id: history]', 512, 74);

  // Main Header
  ctx.fillStyle = '#2c1508';
  ctx.font = 'bold 36px serif';
  ctx.fillText('1.3 DẠY VÀ HỌC TRONG CHIẾN TRANH', 512, 135);

  ctx.fillStyle = '#6b411d';
  ctx.font = 'italic 18px serif';
  ctx.fillText('Lớp học tranh tre, hào giao thông, hầm chữ A và lòng đùm bọc của nhân dân', 512, 170);

  // Intro paragraph
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(60, 205, 904, 140);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 205, 904, 140);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#241710';
  ctx.font = '22px serif';
  const introLines = [
    'Không lâu sau ngày thành lập, chiến tranh phá hoại miền Bắc ngày càng ác liệt.',
    'Để bảo đảm an toàn, trường chia thành ba khu học: Khu A ở sân đình Lang Xá,',
    'khu B ở cuối thôn, khu C dựng trên phần đất người dân cho mượn.'
  ];
  introLines.forEach((l, idx) => ctx.fillText(l, 85, 245 + idx * 30));

  // 6 Bullet points in elegant ivory cards
  const bullets = [
    'Phòng học là nhà tranh, vách nứa; quanh lớp có giao thông hào và hầm trú ẩn.',
    'Có lớp học dưới mái đình làng, có lớp mượn gian nhà dân, có lớp chỉ che mái lá.',
    'Còi báo động vang lên, thầy trò gấp sách xuống hầm tránh bom. Máy bay lùi xa, bảng đen được dựng lại và bài học tiếp tục.',
    'Bàn ghế chở bằng xe đạp, xe bò; bảng lớp tháo lắp nhiều lần theo từng điểm sơ tán.',
    'Thầy cô tỏa về từng xóm nhỏ để dạy học và quản lý học sinh.',
    'Người dân mở cửa nhà, nhường sân đình, dành mảnh đất của mình cho lớp học.'
  ];

  let bY = 375;
  bullets.forEach((b, idx) => {
    const bHeight = idx === 2 ? 85 : 70;
    ctx.fillStyle = idx % 2 === 0 ? '#fdfcf9' : '#ffffff';
    ctx.fillRect(60, bY - 20, 904, bHeight);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, bY - 20, 904, bHeight);

    // Bullet icon in gold
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 24px serif';
    ctx.fillText('✦', 82, bY + 14);

    ctx.fillStyle = '#22150e';
    ctx.font = '20px serif';
    if (idx === 2) {
      ctx.fillText('Còi báo động vang lên, thầy trò gấp sách xuống hầm tránh bom.', 115, bY + 12);
      ctx.fillText('Máy bay lùi xa, bảng đen được dựng lại và bài học tiếp tục.', 115, bY + 44);
    } else {
      ctx.fillText(b, 115, bY + 14);
    }

    bY += bHeight + 12;
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a5128';
  ctx.font = 'italic 16px serif';
  ctx.fillText('Tư liệu chuẩn 60 năm truyền thống — Trích xuất nguyên văn hồ sơ gốc', 512, 975);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// SIDE 4: 1.4 Năm lần di chuyển (Phía Sau / Bắc)
export function createSide4FiveRelocationsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm amber-gold museum parchment (calibrated with 30% darkness reduction for comfort)
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#f2e8d3');
  grad.addColorStop(0.4, '#e7d9be');
  grad.addColorStop(0.8, '#d8c5a4');
  grad.addColorStop(1, '#c5b08c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Triple 24K Gold Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 984);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, 964, 964);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, 948, 948);

  // Top Plaque
  const plaqueGrad = ctx.createLinearGradient(160, 48, 864, 48);
  plaqueGrad.addColorStop(0, '#d4af37');
  plaqueGrad.addColorStop(0.5, '#ffe29a');
  plaqueGrad.addColorStop(1, '#d4af37');
  ctx.fillStyle = plaqueGrad;
  ctx.fillRect(160, 48, 704, 40);
  ctx.strokeStyle = '#9c6f14';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, 48, 704, 40);

  ctx.fillStyle = '#2d1608';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BÊN 4 (PHÍA BẮC) • KHU 1: LỊCH SỬ HÌNH THÀNH [id: history]', 512, 74);

  // Main Header
  ctx.fillStyle = '#2c1508';
  ctx.font = 'bold 36px serif';
  ctx.fillText('1.4 NĂM LẦN DI CHUYỂN', 512, 135);

  ctx.fillStyle = '#6b411d';
  ctx.font = 'italic 18px serif';
  ctx.fillText('Hành trình sơ tán kiên cường và ổn định địa điểm trên đất vua Trần (1966–1974)', 512, 170);

  // Chronology steps
  const steps = [
    {
      num: '1',
      title: 'Năm học 1970–1971: Khu vực chùa Vĩnh Trường, xã Lộc Vượng',
      desc: 'Học trong hai tầng nhà đơn sơ do UBHC tỉnh Nam Hà xây dựng. Việc dạy và học tưởng đã ổn định.'
    },
    {
      num: '2',
      title: 'Tháng 4/1972: Sơ tán về thôn Bườn, xã Mỹ Hà',
      desc: 'Chiến tranh phá hoại lần hai bùng phát ác liệt. Trường tiếp tục dạy học trong hầm hào và nhà dân.'
    },
    {
      num: '3',
      title: 'Năm học 1972–1973: Phân tán nhỏ về từng xóm',
      desc: 'Máy bay B52 rải thảm. Lớp học chia nhỏ về xóm. Thầy cô đi bộ từ xóm này sang xóm khác để giảng bài.'
    },
    {
      num: '4',
      title: 'Đầu năm 1973: Trở lại địa điểm ở Mỹ Lộc',
      desc: 'Sau Hiệp định Paris, trường trở lại địa điểm ở Mỹ Lộc, vừa dựng lại phòng học vừa tiếp tục dạy.'
    },
    {
      num: '5',
      title: 'Tháng 10/1974: Ổn định tại số 75/203 đường Trần Thái Tông (nay 1A Tức Mạc)',
      desc: 'Xã Lộc Vượng (nay phường Lộc Vượng, TP Nam Định). Năm học 1974–1975 có 27 lớp — quy mô lớn nhất tỉnh! Tiếng hát át tiếng bom vang dội, nhận Bằng khen Bộ Văn hóa.'
    }
  ];

  let sY = 210;
  steps.forEach((s, idx) => {
    const isStep5 = idx === 4;
    ctx.fillStyle = isStep5 ? '#fff9ec' : '#ffffff';
    const boxH = isStep5 ? 130 : 96;
    ctx.fillRect(60, sY, 904, boxH);
    ctx.strokeStyle = isStep5 ? '#d4af37' : 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = isStep5 ? 2.5 : 1.5;
    ctx.strokeRect(60, sY, 904, boxH);

    // Number Badge in 24K Gold
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(75, sY + 16, 46, 46);
    ctx.fillStyle = '#2c1508';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.num, 98, sY + 48);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = isStep5 ? '#7a1f26' : '#3e2311';
    ctx.font = 'bold 21px serif';
    ctx.fillText(s.title, 135, sY + 36);

    // Desc
    ctx.fillStyle = '#22150e';
    ctx.font = '18px sans-serif';
    if (isStep5) {
      ctx.fillText('Xã Lộc Vượng (nay là phường Lộc Vượng, thành phố Nam Định).', 135, sY + 68);
      ctx.fillText('Năm học 1974–1975 có 27 lớp — trở thành một trong những trường lớn nhất tỉnh Nam Hà.', 135, sY + 94);
      ctx.fillText('Phong trào “Tiếng hát át tiếng bom” vang dội, được Bộ Văn hóa tặng bằng khen.', 135, sY + 118);
    } else {
      ctx.fillText(s.desc, 135, sY + 68);
    }

    sY += boxH + 16;
  });

  // Summary box in Gold
  const sumGrad = ctx.createLinearGradient(60, 810, 964, 925);
  sumGrad.addColorStop(0, '#fef8ea');
  sumGrad.addColorStop(1, '#fbeece');
  ctx.fillStyle = sumGrad;
  ctx.fillRect(60, 810, 904, 115);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 810, 904, 115);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#6d2027';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('TỔNG KẾT 5 LẦN DI CHUYỂN:', 80, 840);
  ctx.fillStyle = '#25170f';
  ctx.font = 'bold 17px serif';
  ctx.fillText('1. Lang Xá (1966) ➔ 2. Chùa Vĩnh Trường (1970–1971) ➔ 3. Thôn Bườn (4/1972)', 80, 872);
  ctx.fillText('➔ 4. Phân tán các xóm (1972–1973) ➔ 5. Về Mỹ Lộc (1973) rồi ổn định Lộc Vượng (10/1974)', 80, 902);

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a5128';
  ctx.font = 'italic 16px serif';
  ctx.fillText('Tư liệu chuẩn 60 năm truyền thống — Trích xuất nguyên văn hồ sơ gốc', 512, 975);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 12. Founding Pioneers Introduction Board (Bảng Giới Thiệu Ban Giám Hiệu Sáng Lập)
export function createFoundingIntroBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d')!;

  // Warm parchment antique background
  const bg = ctx.createLinearGradient(0, 0, 1024, 1280);
  bg.addColorStop(0, '#fbf6ec');
  bg.addColorStop(0.5, '#f4ece0');
  bg.addColorStop(1, '#eadeca');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1280);

  // Gilded double architectural border
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 968, 1224);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(44, 44, 936, 1192);

  ctx.strokeStyle = 'rgba(180, 140, 70, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(54, 54, 916, 1172);

  // Header ribbon
  const ribbonGrad = ctx.createLinearGradient(120, 90, 904, 175);
  ribbonGrad.addColorStop(0, '#8c262e');
  ribbonGrad.addColorStop(0.5, '#a8323c');
  ribbonGrad.addColorStop(1, '#8c262e');
  ctx.fillStyle = ribbonGrad;
  ctx.beginPath();
  ctx.roundRect(140, 85, 744, 88, 16);
  ctx.fill();
  ctx.strokeStyle = '#f5d061';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#fff6db';
  ctx.textAlign = 'center';
  ctx.font = 'bold 30px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('LỜI GIỚI THIỆU • BAN GIÁM HIỆU SÁNG LẬP', 512, 140);

  // Subtitle
  ctx.fillStyle = '#6e431f';
  ctx.font = 'bold 24px "Noto Serif", Georgia, serif';
  ctx.fillText('NHỮNG NGƯỜI ĐẶT NỀN MÓNG (1966 – 1975)', 512, 225);

  // Divider line with gold diamond
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 255);
  ctx.lineTo(804, 255);
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(512, 255, 6, 0, Math.PI * 2);
  ctx.fill();

  // Content Paragraphs
  const drawParagraph = (text: string, startY: number, lineH: number = 38): number => {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#26150b';
    ctx.font = '22px "Be Vietnam Pro", sans-serif';
    
    // Simple line-wrapping
    const words = text.split(' ');
    let line = '';
    let curY = startY;
    const maxWidth = 840;
    const marginX = 92;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, marginX, curY);
        line = words[n] + ' ';
        curY += lineH;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, marginX, curY);
    return curY + lineH + 16;
  };

  let nextY = 310;

  // Paragraph 1: Historic context
  nextY = drawParagraph(
    'Mùa thu năm 1966, giữa khói lửa ác liệt của chiến tranh phá hoại miền Bắc, Trường Cấp III Mỹ Lộc (tiền thân của THPT A Trần Hưng Đạo) được khai sinh tại thôn Lang Xá, xã Mỹ Tiến. Mái trường ban đầu nép mình bên sân đình cổ kính, với 5 lớp học tranh tre nứa và gần 200 học trò đầu tiên.',
    nextY
  );

  // Paragraph 2: Leadership role
  nextY = drawParagraph(
    'Hai vị thầy tiền bối trong Ban Giám hiệu đầu tiên — Thầy Hiệu trưởng và Thầy Phó Hiệu trưởng — cùng tập thể 3 tổ chuyên môn đã kiên cường bám trường bám lớp, vừa chỉ huy sơ tán, vừa đào hầm hào, thắp đèn dầu giảng dạy và lãnh đạo nhà trường vượt qua 5 lần di dời gian khổ.',
    nextY
  );

  // Paragraph 3: Heritage honor
  nextY = drawParagraph(
    'Công lao khai sơn phá thạch của các thầy là di sản vô giá, đặt nền móng vững chắc cho hành trình 60 năm trường tồn, vẻ vang và phát triển vượt bậc của Trường THPT A Trần Hưng Đạo hôm nay.',
    nextY
  );

  // Decorative Accent Box
  const boxY = Math.max(nextY + 10, 880);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.beginPath();
  ctx.roundRect(90, boxY, 844, 230, 16);
  ctx.fill();
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#8c262e';
  ctx.font = 'bold 22px "Noto Serif", Georgia, serif';
  ctx.fillText('✦ BAN GIÁM HIỆU TIỀN BỐI KHÓA I (1966 – 1975) ✦', 512, boxY + 45);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#26150b';
  ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
  ctx.fillText('1. Thầy Phạm Quốc Dũng', 120, boxY + 95);
  ctx.font = '18px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = '#5c3818';
  ctx.fillText('— Hiệu trưởng đầu tiên (từ tháng 6/1966)', 360, boxY + 95);

  ctx.fillStyle = '#26150b';
  ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
  ctx.fillText('2. Thầy Đặng Công Thành', 120, boxY + 145);
  ctx.font = '18px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = '#5c3818';
  ctx.fillText('— Phó Hiệu trưởng đầu tiên', 375, boxY + 145);

  ctx.fillStyle = '#7a4e21';
  ctx.font = 'italic 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Cùng 3 tổ chuyên môn tiên phong: Tự nhiên, Xã hội, Ngoại ngữ.', 120, boxY + 195);

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8c6030';
  ctx.font = 'italic 18px "Noto Serif", Georgia, serif';
  ctx.fillText('✦ Không gian Di sản số • 60 Năm Trường THPT A Trần Hưng Đạo ✦', 512, 1220);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 13. Mentor Portrait Canvas Texture (Chân Dung Thầy Tiền Bối với khung mạ vàng trang nghiêm)
export function createMentorPortraitTexture(
  role: string,
  name: string,
  note: string,
  portraitNumber: string = '01'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep lacquer royal navy background
  const bg = ctx.createLinearGradient(0, 0, 768, 1024);
  bg.addColorStop(0, '#161e30');
  bg.addColorStop(0.5, '#101624');
  bg.addColorStop(1, '#0b0f19');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 768, 1024);

  // Gilded ornate border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 728, 984);

  ctx.strokeStyle = 'rgba(255, 235, 175, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(34, 34, 700, 956);

  // Corner decorations
  const drawCorner = (x: number, y: number, dirX: number, dirY: number) => {
    ctx.strokeStyle = '#f5d061';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + dirY * 30);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dirX * 30, y);
    ctx.stroke();
  };
  drawCorner(44, 44, 1, 1);
  drawCorner(724, 44, -1, 1);
  drawCorner(44, 980, 1, -1);
  drawCorner(724, 980, -1, -1);

  // Top Badge: TRI ÂN TIỀN BỐI
  ctx.fillStyle = '#8c262e';
  ctx.beginPath();
  ctx.roundRect(160, 52, 448, 54, 12);
  ctx.fill();
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff6db';
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px "Noto Serif", Georgia, serif';
  ctx.fillText(`TRI ÂN TIỀN BỐI • VỊ THẦY SỐ ${portraitNumber}`, 384, 87);

  // Central Portrait Frame Box
  const photoBoxY = 135;
  const photoBoxW = 480;
  const photoBoxH = 480;
  const photoBoxX = (768 - photoBoxW) / 2;

  ctx.fillStyle = '#1c2438';
  ctx.beginPath();
  ctx.roundRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 18);
  ctx.fill();
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Classical oval cameo profile silhouette or academic seal
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(384, photoBoxY + 220, 160, 190, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle academic torch/laurel emblem in portrait center
  ctx.fillStyle = 'rgba(255, 235, 175, 0.25)';
  ctx.beginPath();
  ctx.arc(384, photoBoxY + 180, 75, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 64px serif';
  ctx.fillText('✦', 384, photoBoxY + 200);

  // Archival badge inside photo box
  ctx.fillStyle = 'rgba(10, 14, 22, 0.75)';
  ctx.beginPath();
  ctx.roundRect(photoBoxX + 40, photoBoxY + 390, photoBoxW - 80, 60, 10);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#ffe599';
  ctx.font = 'bold 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText('ẢNH CHÂN DUNG LƯU TRỮ', 384, photoBoxY + 418);
  ctx.fillStyle = '#c8d4e8';
  ctx.font = '13px "Be Vietnam Pro", sans-serif';
  ctx.fillText('(Cập nhật hình ảnh trực tiếp qua CMD Admin)', 384, photoBoxY + 438);

  // Role Banner
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 26px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(role.toUpperCase(), 384, 665);

  // Mentor Full Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Noto Serif", Georgia, serif';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(name, 384, 725);
  ctx.shadowBlur = 0;

  // Divider line
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 755);
  ctx.lineTo(628, 755);
  ctx.stroke();

  // Bio / Note (multi-line)
  ctx.fillStyle = '#e4d3b8';
  ctx.font = '20px "Be Vietnam Pro", sans-serif';
  
  const words = note.split(' ');
  let line = '';
  let curY = 800;
  const maxWidth = 640;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 384, curY);
      line = words[n] + ' ';
      curY += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 384, curY);

  // Bottom Notice
  ctx.fillStyle = '#a68550';
  ctx.font = 'italic 16px "Noto Serif", Georgia, serif';
  ctx.fillText('✦ Khóa I (1966) • 60 Năm Di Sản THPT A Trần Hưng Đạo ✦', 384, 960);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}


