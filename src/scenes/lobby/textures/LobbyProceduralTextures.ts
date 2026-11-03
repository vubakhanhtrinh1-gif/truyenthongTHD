import * as THREE from 'three';
import { GatewayInfo } from '../config/lobbyConfig';

/**
 * Procedural Texture Generator for the Royal Modern Heritage Main Hall
 * 60th Anniversary Celebration — Trường THPT A Trần Hưng Đạo
 * Creates crisp, high-resolution architectural textures with warm ivory, champagne gold, and refined bronze.
 */

// 1. Warm Cream-Ivory Crema Marfil Stone Floor with Golden Veining & Inlaid Seams
export function createLobbyMarbleFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm cream-ivory base (#F6F1E7 to #EFE7D8)
  const bg = ctx.createLinearGradient(0, 0, 1024, 1024);
  bg.addColorStop(0, '#F8F4EC');
  bg.addColorStop(0.35, '#F3ECE0');
  bg.addColorStop(0.7, '#EFE6D6');
  bg.addColorStop(1, '#F6F1E6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft warm limestone natural striations
  ctx.strokeStyle = 'rgba(215, 195, 168, 0.28)';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    let x = (i * 120 + 40) % 1024;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 1024) {
      x += Math.sin(y * 0.008 + i) * 32 + (Math.random() - 0.5) * 16;
      y += 28 + Math.random() * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Polished champagne-gold micro-veins (#D4AF37)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.26)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    let x = (i * 170 + 80) % 1024;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 1024) {
      x += Math.cos(y * 0.011 + i) * 24 + (Math.random() - 0.5) * 12;
      y += 35 + Math.random() * 45;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Large elegant architectural tile grid (256x256 px tiles = 4x4)
  // Subtle shadow seam
  ctx.strokeStyle = 'rgba(180, 155, 125, 0.35)';
  ctx.lineWidth = 3.0;
  for (let i = 256; i < 1024; i += 256) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Polished champagne-gold inlay seam
  ctx.strokeStyle = 'rgba(218, 185, 95, 0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 256; i < 1024; i += 256) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Small corner diamond brass inlays at tile intersections
  ctx.fillStyle = '#D4AF37';
  for (let ix = 256; ix < 1024; ix += 256) {
    for (let iy = 256; iy < 1024; iy += 256) {
      ctx.beginPath();
      ctx.moveTo(ix, iy - 6);
      ctx.lineTo(ix + 6, iy);
      ctx.lineTo(ix, iy + 6);
      ctx.lineTo(ix - 6, iy);
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 9);
  return texture;
}

// 2. Ceremonial Central Walkway: Refined Warm Ivory Stone Walkway with Champagne Gold Inlay Borders
export function createLobbyAxisPathTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm honed limestone base (#F4ECE1 to #EDE4D5)
  const bg = ctx.createLinearGradient(0, 0, 512, 0);
  bg.addColorStop(0, '#ECE4D4');
  bg.addColorStop(0.12, '#F4EDE0');
  bg.addColorStop(0.5, '#F7F1E7');
  bg.addColorStop(0.88, '#F4EDE0');
  bg.addColorStop(1, '#ECE4D4');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 1024);

  // Subtle natural limestone texture striations
  ctx.strokeStyle = 'rgba(215, 198, 172, 0.22)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    let x = (i * 80 + 30) % 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 1024) {
      x += Math.sin(y * 0.012 + i) * 16 + (Math.random() - 0.5) * 8;
      y += 35 + Math.random() * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Refined architectural joints every 256px along the longitudinal path
  ctx.strokeStyle = 'rgba(188, 168, 142, 0.28)';
  ctx.lineWidth = 2.0;
  for (let y = 256; y < 1024; y += 256) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(472, y);
    ctx.stroke();
  }

  // Outer continuous champagne-gold pinstripe border (#D4AF37)
  const goldGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  goldGrad.addColorStop(0, '#D4AF37');
  goldGrad.addColorStop(0.5, '#EED888');
  goldGrad.addColorStop(1, '#D4AF37');

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 0, 440, 1024);

  // Inner subtle secondary gold accent pinstripe
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 0, 408, 1024);

  // Subdued centerline guiding seam with subtle dash
  ctx.setLineDash([20, 24]);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.40)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 1024);
  ctx.stroke();
  ctx.setLineDash([]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// 3. Coffered High Ceiling Texture: Warm Alabaster Ivory with Layered Gilded Relief Moldings
export function createCofferedCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm luminous alabaster/ivory base (#FAF6EF)
  ctx.fillStyle = '#FAF6EF';
  ctx.fillRect(0, 0, 512, 512);

  // Outer coffer frame in warm cream stone (#EDE5D6)
  ctx.fillStyle = '#EFE7DA';
  ctx.fillRect(12, 12, 488, 488);

  // Stepped recessed coffer shadow
  const cofferShadow = ctx.createLinearGradient(20, 20, 492, 492);
  cofferShadow.addColorStop(0, 'rgba(160, 135, 105, 0.28)');
  cofferShadow.addColorStop(0.3, 'rgba(235, 225, 210, 0.12)');
  cofferShadow.addColorStop(1, 'rgba(130, 105, 80, 0.32)');
  ctx.fillStyle = cofferShadow;
  ctx.fillRect(24, 24, 464, 464);

  // Recessed center field: Warm Ivory Alabaster (#F8F4EC)
  ctx.fillStyle = '#F8F4EC';
  ctx.fillRect(44, 44, 424, 424);

  // Polished champagne-gold outer relief molding (#D4AF37)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 472, 472);

  // Inner gilded fillet molding
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 428, 428);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 9);
  return texture;
}

// 4. Architectural Wall Stone Texture: Honed French Limestone with Fluted Pilaster Relief & Gilded Trim
export function createLobbyWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Warm honed cream limestone base (#F5EFE6)
  const wallGrad = ctx.createLinearGradient(0, 0, 1024, 2048);
  wallGrad.addColorStop(0, '#FAF6EE');
  wallGrad.addColorStop(0.5, '#F4EEE4');
  wallGrad.addColorStop(1, '#EFE7DA');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, 1024, 2048);

  // Vertical classical architectural pilaster fluting lines
  ctx.fillStyle = 'rgba(200, 180, 155, 0.35)';
  for (let x = 64; x < 1024; x += 64) {
    ctx.fillRect(x, 180, 8, 1740);
  }

  // Refined champagne-gold vertical panel margins (#D4AF37)
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(28, 160, 4, 1780);
  ctx.fillRect(992, 160, 4, 1780);

  // Upper frieze molding strip (at y = 140)
  ctx.fillStyle = '#C5A059';
  ctx.fillRect(0, 140, 1024, 18);
  ctx.fillStyle = '#FFE28A';
  ctx.fillRect(0, 158, 1024, 4);

  // Lower socle / baseboard line (at y = 1940)
  ctx.fillStyle = '#9C7A44';
  ctx.fillRect(0, 1940, 1024, 12);
  ctx.fillStyle = '#C5A059';
  ctx.fillRect(0, 1952, 1024, 6);

  // Classical framed commemorative niches with champagne-gold boiserie frames
  const drawWallPanel = (yTop: number, h: number) => {
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 4;
    ctx.strokeRect(96, yTop, 832, h);

    ctx.strokeStyle = 'rgba(180, 155, 125, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(108, yTop + 12, 808, h - 24);

    ctx.fillStyle = 'rgba(255, 250, 240, 0.45)';
    ctx.fillRect(110, yTop + 14, 804, h - 28);
  };

  drawWallPanel(240, 680);
  drawWallPanel(1060, 780);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 5. Ceremonial Welcome Inscription on Rear Wall (Clearly legible, dignified, high contrast)
export function createWelcomeCeremonialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 2048, 512);

  // Dignified warm mocha-bronze cartouche plaque backing (#221914)
  ctx.fillStyle = 'rgba(32, 23, 17, 0.94)';
  ctx.beginPath();
  ctx.roundRect(40, 24, 1968, 464, 28);
  ctx.fill();

  // Heavy brushed champagne-gold outer frame (#D4AF37)
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 7;
  ctx.stroke();

  // Inner refined golden border fillet
  ctx.strokeStyle = 'rgba(255, 232, 160, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(56, 40, 1936, 432);

  // Header: 1966 – 2026 • 60 NĂM DI SẢN & TỰ HÀO
  ctx.fillStyle = '#FFD988';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('✦  1966 – 2026 • 60 NĂM DI SẢN & TỰ HÀO  ✦', 1024, 115);

  // Main Title: TRƯỜNG THPT A TRẦN HƯNG ĐẠO
  ctx.fillStyle = '#FFF8EB';
  ctx.font = 'bold 78px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.letterSpacing = '10px';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
  ctx.shadowBlur = 18;
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO', 1024, 225);
  ctx.shadowBlur = 0;

  // Subtitle: SẢNH CHÍNH DI SẢN • KHÔNG GIAN HỘI TỤ 60 NĂM
  ctx.fillStyle = '#FFE599';
  ctx.font = '600 40px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('SẢNH CHÍNH DI SẢN • KHÔNG GIAN HỘI TỤ 60 NĂM', 1024, 320);

  // Tagline: 60 năm – một điểm tựa, một quỹ đạo tương lai.
  ctx.fillStyle = '#E8D4B4';
  ctx.font = 'italic 30px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('“60 năm – một điểm tựa, một quỹ đạo tương lai”', 1024, 405);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 6. Spatial Museum Map Texture (Ergonomic Reading Head Kiosk)
export function createSpatialMuseumMapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm deep royal navy & bronze background
  const bg = ctx.createLinearGradient(0, 0, 1024, 1024);
  bg.addColorStop(0, '#101726');
  bg.addColorStop(0.5, '#162035');
  bg.addColorStop(1, '#0C111C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Champagne-gold frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 968, 968);

  ctx.strokeStyle = 'rgba(255, 235, 175, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 940, 940);

  // Header Title
  ctx.fillStyle = '#FFE599';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px "Noto Serif", "Be Vietnam Pro", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('SƠ ĐỒ KHÔNG GIAN BẢO TÀNG SỐ'.normalize('NFC'), 512, 95);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('ROYAL HERITAGE ROTUNDA • 60 YEARS'.normalize('NFC'), 512, 135);

  // Outer orbital circle for museum layout
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([10, 14]);
  ctx.beginPath();
  ctx.arc(512, 540, 360, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central Lobby Node
  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.beginPath();
  ctx.arc(512, 540, 105, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFE599';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Noto Serif", serif';
  ctx.fillText('SẢNH CHÍNH'.normalize('NFC'), 512, 528);
  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 15px "Be Vietnam Pro", monospace';
  ctx.fillText('[BẠN ĐANG Ở ĐÂY]'.normalize('NFC'), 512, 560);

  // 5 Exhibition Rooms
  const rooms = [
    { name: 'KHU 1: LỊCH SỬ', sub: '1966–1975', x: 230, y: 380 },
    { name: 'DÒNG THỜI GIAN', sub: '1966–2026', x: 230, y: 700 },
    { name: 'KHU 2: PHÁT TRIỂN', sub: '1974–2026', x: 790, y: 380 },
    { name: 'KHU 3: THÀNH TÍCH', sub: 'Huân chương & Bằng khen', x: 790, y: 700 },
    { name: 'KHU 4: KÝ ỨC & TRI ÂN', sub: 'Thầy cô & Học trò', x: 512, y: 220 },
  ];

  rooms.forEach((r) => {
    // Connector line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(512, 540);
    ctx.lineTo(r.x, r.y);
    ctx.stroke();

    // Node Box
    ctx.fillStyle = '#18243C';
    ctx.beginPath();
    ctx.roundRect(r.x - 100, r.y - 36, 200, 72, 12);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFF5E0';
    ctx.font = 'bold 16px "Noto Serif", serif';
    ctx.fillText(r.name.normalize('NFC'), r.x, r.y - 4);
    ctx.fillStyle = '#FFD988';
    ctx.font = '12px "Be Vietnam Pro", sans-serif';
    ctx.fillText(r.sub.normalize('NFC'), r.x, r.y + 18);
  });

  // Entrance indicator at bottom
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.roundRect(420, 905, 184, 40, 8);
  ctx.fill();
  ctx.fillStyle = '#0F1522';
  ctx.font = 'bold 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText('CỔNG VÀO (ENTRANCE)'.normalize('NFC'), 512, 930);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 7. Gateway Header Plaque Texture with Zone Badges & Drop Shadow
export function createGatewayPlaqueTexture(
  gateway: GatewayInfo,
  lang: 'vi' | 'en' = 'vi'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  const zoneColors: Record<string, { bg: string; text: string; border: string }> = {
    history: { bg: '#8B1E22', text: '#FFF2F2', border: '#FCA5A5' },
    timeline: { bg: '#B45309', text: '#FFFAEB', border: '#FDE68A' },
    development: { bg: '#166534', text: '#F0FDF4', border: '#86EFAC' },
    achievements: { bg: '#C5A059', text: '#1A140B', border: '#FFF0C2' },
    memory: { bg: '#9F1239', text: '#FFF1F2', border: '#FECDD3' },
  };
  const zone = zoneColors[gateway.id] || { bg: '#B45309', text: '#FFFFFF', border: '#FFD988' };

  // Warm deep royal ivory-bronze gradient base
  const bg = ctx.createLinearGradient(0, 0, 0, 384);
  bg.addColorStop(0, '#261C16');
  bg.addColorStop(0.5, '#3A2B20');
  bg.addColorStop(1, '#201610');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1536, 384);

  // Outer polished gold border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 1504, 352);

  // Inner refined pinstripe
  ctx.strokeStyle = 'rgba(255, 235, 175, 0.65)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(28, 28, 1480, 328);

  // Gateway Code pill
  ctx.fillStyle = zone.bg;
  ctx.beginPath();
  ctx.roundRect(648, 34, 240, 46, 12);
  ctx.fill();
  ctx.strokeStyle = zone.border;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = zone.text;
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px "Be Vietnam Pro", monospace';
  ctx.fillText(gateway.code.normalize('NFC'), 768, 65);

  // Main Room Name (Noto Serif + Georgia with golden drop shadow)
  ctx.fillStyle = '#FFF6DE';
  ctx.font = 'bold 56px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.75)';
  ctx.shadowBlur = 16;
  ctx.fillText((lang === 'vi' ? gateway.nameVi : gateway.nameEn).normalize('NFC'), 768, 182);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = '#E8D4B5';
  ctx.font = 'italic 28px "Be Vietnam Pro", "Noto Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText((lang === 'vi' ? gateway.subtitleVi : gateway.subtitleEn).normalize('NFC'), 768, 275);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 8. Visitor Guide Console Texture (Floor Orientation Kiosk)
export function createVisitorGuidePlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 1024, 1024);
  bg.addColorStop(0, '#101726');
  bg.addColorStop(0.5, '#162035');
  bg.addColorStop(1, '#0C111C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Outer gold rim
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 968, 968);

  ctx.strokeStyle = 'rgba(255, 235, 175, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 940, 940);

  // Header Title
  ctx.fillStyle = '#FFE599';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px "Noto Serif", "Be Vietnam Pro", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('HƯỚNG DẪN THAM QUAN BẢO TÀNG SỐ'.normalize('NFC'), 512, 110);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('COSMIC HERITAGE • 60 NĂM THPT A TRẦN HƯNG ĐẠO'.normalize('NFC'), 512, 155);

  // Gold divider line
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 185);
  ctx.lineTo(904, 185);
  ctx.stroke();

  // 4 Instruction Feature Blocks
  const instructions = [
    {
      num: '01',
      title: 'DI CHUYỂN & QUAN SÁT',
      desc: 'Phím W A S D hoặc Mũi tên để bước đi. Nhấp và kéo chuột để quan sát không gian 360 độ.',
    },
    {
      num: '02',
      title: '5 PHÂN KHU DI SẢN',
      desc: 'Sảnh chính kết nối trực tiếp đến 5 phân khu triển lãm. Tiến vào các cổng vòm để chuyển phòng.',
    },
    {
      num: '03',
      title: 'TƯƠNG TÁC HIỆN VẬT',
      desc: 'Nhấp chuột vào tượng đài, quả cầu hố đen, tủ hiện vật, bảng lịch sử để xem hồ sơ tư liệu.',
    },
    {
      num: '04',
      title: 'HUY HIỆU & BIỂU TRƯNG',
      desc: 'Đài kỷ niệm trung tâm tôn vinh biểu trưng trường (Tháp Phổ Minh, Đuốc tri thức, 1966).',
    },
  ];

  instructions.forEach((item, idx) => {
    const yBase = 260 + idx * 160;

    ctx.fillStyle = 'rgba(24, 34, 56, 0.85)';
    ctx.beginPath();
    ctx.roundRect(80, yBase - 40, 864, 130, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Number badge
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(100, yBase - 25, 60, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#0B1020';
    ctx.font = 'bold 24px "Be Vietnam Pro", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(item.num, 130, yBase + 4);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFE599';
    ctx.font = 'bold 26px "Noto Serif", "Be Vietnam Pro", serif';
    ctx.fillText(item.title.normalize('NFC'), 180, yBase + 2);

    // Description
    ctx.fillStyle = '#F4EDE0';
    ctx.font = '20px "Be Vietnam Pro", sans-serif';
    ctx.fillText(item.desc.normalize('NFC'), 100, yBase + 55);
  });

  // Call to action button at bottom
  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.beginPath();
  ctx.roundRect(160, 890, 704, 60, 12);
  ctx.fill();
  ctx.strokeStyle = '#FFE599';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE599';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('✦ NHẤP VÀO ĐÂY ĐỂ MỞ HƯỚNG DẪN CHI TIẾT ✦', 512, 928);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Procedural Equirectangular Texture for the 60-Year Heritage Obsidian Sphere
 * Dimensions: 2048 x 1024 (2:1 standard spherical UV projection)
 * Features:
 * - Deep, mirror-like obsidian base with subtle bronze undertones & micro-depth
 * - 24 fine golden longitudinal meridians
 * - Concentric latitude parallels at 15° increments
 * - Commemorative equatorial golden frieze with 60-Year Heritage Inscriptions
 * - Dual sinusoidal ecliptic heritage orbital arcs (ecliptic angle 23.5°)
 * - Golden polar ray motifs
 */
export function createHeritageSphereTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep polished volcanic obsidian background with subtle warm bronze undertones
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  baseGrad.addColorStop(0, '#0E1118');
  baseGrad.addColorStop(0.25, '#131620');
  baseGrad.addColorStop(0.50, '#10131B');
  baseGrad.addColorStop(0.75, '#151722');
  baseGrad.addColorStop(1, '#0D1016');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Subtle organic obsidian flow swirls & micro-facet reflections (no noisy speckles)
  for (let i = 0; i < 7; i++) {
    const swirlGrad = ctx.createRadialGradient(
      300 + i * 260,
      512 + Math.sin(i * 1.2) * 180,
      30,
      300 + i * 260,
      512 + Math.sin(i * 1.2) * 180,
      420
    );
    swirlGrad.addColorStop(0, 'rgba(160, 120, 70, 0.045)');
    swirlGrad.addColorStop(0.45, 'rgba(212, 175, 55, 0.025)');
    swirlGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = swirlGrad;
    ctx.fillRect(0, 0, 2048, 1024);
  }

  // 3. 24 Fine Golden Longitudinal Meridian Lines (Longitudes 0° to 360°)
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.42)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 24; i++) {
    const x = (i / 24) * 2048;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    // Highlight 4 Cardinal Meridians (0°, 90°, 180°, 270°)
    if (i % 6 === 0) {
      ctx.strokeStyle = 'rgba(255, 230, 140, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.42)';
      ctx.lineWidth = 1.4;
    }
  }
  ctx.restore();

  // 4. Concentric Golden Latitude Parallels (15° increments from North to South Pole)
  // In equirectangular mapping: y = (0.5 - lat_deg / 180) * 1024
  const latitudes = [75, 60, 45, 30, 15, -15, -30, -45, -60, -75];
  ctx.save();
  latitudes.forEach((lat) => {
    const y = (0.5 - lat / 180) * 1024;
    const isMajor = Math.abs(lat) === 30 || Math.abs(lat) === 60;

    ctx.strokeStyle = isMajor ? 'rgba(255, 225, 130, 0.55)' : 'rgba(212, 175, 55, 0.32)';
    ctx.lineWidth = isMajor ? 1.6 : 1.0;
    if (!isMajor) {
      ctx.setLineDash([8, 8]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  });
  ctx.restore();

  // 5. Dual Sinusoidal Ecliptic Heritage Orbital Arcs (23.5° inclination)
  // Representing celestial continuity and the passage of 60 academic years
  ctx.save();
  const eclipticAmp = (23.5 / 180) * 1024; // ~133.7px
  ctx.strokeStyle = 'rgba(244, 213, 139, 0.55)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([12, 6, 3, 6]);

  // Ascending ecliptic
  ctx.beginPath();
  for (let x = 0; x <= 2048; x += 8) {
    const y = 512 - Math.sin((x / 2048) * Math.PI * 2) * eclipticAmp;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Descending ecliptic
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.beginPath();
  for (let x = 0; x <= 2048; x += 8) {
    const y = 512 + Math.sin((x / 2048) * Math.PI * 2) * eclipticAmp;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // 6. Commemorative Equatorial Frieze Band (y = 512, total height 52px)
  // Inlaid dark bronze-obsidian band with champagne-gold borders & relief typography
  ctx.save();
  const bandTop = 512 - 26;
  const bandHeight = 52;

  // Darkened polished inlay track
  ctx.fillStyle = 'rgba(15, 12, 9, 0.92)';
  ctx.fillRect(0, bandTop, 2048, bandHeight);

  // Outer primary gold borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, bandTop);
  ctx.lineTo(2048, bandTop);
  ctx.moveTo(0, bandTop + bandHeight);
  ctx.lineTo(2048, bandTop + bandHeight);
  ctx.stroke();

  // Inner hairline gold accents
  ctx.strokeStyle = 'rgba(255, 235, 160, 0.65)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(0, bandTop + 4);
  ctx.lineTo(2048, bandTop + 4);
  ctx.moveTo(0, bandTop + bandHeight - 4);
  ctx.lineTo(2048, bandTop + bandHeight - 4);
  ctx.stroke();

  // Inscribed Commemorative Text repeated symmetrically 2 times along equator
  const repeatStep = 1024;
  for (let r = 0; r < 2; r++) {
    const startX = r * repeatStep;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Gold metallic text gradient
    const textGrad = ctx.createLinearGradient(0, bandTop, 0, bandTop + bandHeight);
    textGrad.addColorStop(0, '#FFF4D0');
    textGrad.addColorStop(0.45, '#E5C365');
    textGrad.addColorStop(1, '#B8860B');

    ctx.fillStyle = textGrad;
    ctx.font = 'bold 15px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(
      '✦  1966  •  60 NĂM DI SẢN & TỰ HÀO  •  TRƯỜNG THPT A TRẦN HƯNG ĐẠO  •  2026  ✦',
      startX + 512,
      512
    );
  }
  ctx.restore();

  // 7. Golden Polar Caps & Radial Ray Medallions (North & South Poles)
  ctx.save();
  [0, 1024].forEach((poleY) => {
    const poleGrad = ctx.createRadialGradient(1024, poleY, 10, 1024, poleY, 160);
    poleGrad.addColorStop(0, 'rgba(255, 235, 160, 0.7)');
    poleGrad.addColorStop(0.35, 'rgba(212, 175, 55, 0.35)');
    poleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = poleGrad;
    ctx.fillRect(0, poleY === 0 ? 0 : 864, 2048, 160);
  });
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Procedural Texture for the Front-Facing Circular Gold Medallion Inscription Bezel
 * Dimensions: 1024 x 1024
 * Displays circular relief Vietnamese typography around the central authentic school emblem:
 * - Upper Arc: "TRƯỜNG THPT A TRẦN HƯNG ĐẠO"
 * - Lower Arc: "✦ 1966 – 2026 • 60 NĂM DI SẢN & PHÁT TRIỂN ✦"
 * - Double beaded coin-edge pearl rims in polished champagne gold
 */
export function createMedallionRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 512;
  const cy = 512;

  // Clear background
  ctx.clearRect(0, 0, 1024, 1024);

  // 1. Concentric Champagne-Gold Inscription Ring Base
  const ringGrad = ctx.createRadialGradient(cx, cy, 320, cx, cy, 490);
  ringGrad.addColorStop(0, '#181512');
  ringGrad.addColorStop(0.08, '#261F17');
  ringGrad.addColorStop(0.50, '#1E1812');
  ringGrad.addColorStop(0.92, '#261F17');
  ringGrad.addColorStop(1, '#181512');

  ctx.beginPath();
  ctx.arc(cx, cy, 490, 0, Math.PI * 2);
  ctx.arc(cx, cy, 320, 0, Math.PI * 2, true);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  // 2. Outer & Inner Polished Gold Borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 490, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded pearls on outer rim (64 beads)
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * 476;
    const by = cy + Math.sin(angle) * 476;
    ctx.beginPath();
    ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE599';
    ctx.fill();
  }

  // Beaded pearls on inner rim (48 beads)
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * 334;
    const by = cy + Math.sin(angle) * 334;
    ctx.beginPath();
    ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE599';
    ctx.fill();
  }

  // 3. Circular Typography Helper
  function drawCircularText(
    text: string,
    radius: number,
    startAngle: number,
    endAngle: number,
    inward: boolean = true
  ) {
    if (!ctx) return;
    const chars = text.split('');
    const totalAngle = endAngle - startAngle;
    const step = totalAngle / Math.max(chars.length - 1, 1);

    ctx.save();
    ctx.font = 'bold 36px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
    ctx.fillStyle = '#FFF2C6';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < chars.length; i++) {
      const angle = startAngle + i * step;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + (inward ? Math.PI / 2 : -Math.PI / 2));
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  // Upper Arc: "TRƯỜNG THPT A TRẦN HƯNG ĐẠO"
  drawCircularText(
    'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
    405,
    -Math.PI * 0.80,
    -Math.PI * 0.20,
    true
  );

  // Lower Arc: "✦ 1966 – 2026 • 60 NĂM DI SẢN ✦"
  drawCircularText(
    '✦ 1966 – 2026 • 60 NĂM DI SẢN ✦',
    405,
    Math.PI * 0.80,
    Math.PI * 0.20,
    false
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * High-Resolution 24K Museum Brass & Gold Texture for the Grand Saturn Accretion Disc
 * Inspired by the 'Lich Su' (History Room) 24K brass & luminous gold finish:
 * - Concentric circular lathe micro-grooves (phonograph effect)
 * - Radial anisotropic brushed metal highlights
 * - Cassini divisions & fine celestial ringlets
 * - Subtle gold-leaf metallic flecks and radiant warmth
 */
export function createSaturnAccretionDiscTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 512;
  const cy = 512;
  const rInner = 238;
  const rOuter = 506;

  // Clear background
  ctx.clearRect(0, 0, 1024, 1024);

  // 1. Base Concentric Radial Gradient in Rich 24K Gold & Museum Brass
  const baseGrad = ctx.createRadialGradient(cx, cy, rInner - 10, cx, cy, rOuter + 10);
  baseGrad.addColorStop(0.00, 'rgba(212, 175, 55, 0.0)');
  baseGrad.addColorStop(0.04, 'rgba(255, 232, 158, 0.95)'); // Inner photon bright crest
  baseGrad.addColorStop(0.12, 'rgba(235, 195, 75, 0.90)');  // Inner dense gold ring
  baseGrad.addColorStop(0.28, 'rgba(212, 175, 55, 0.95)');  // 24K Museum Brass
  baseGrad.addColorStop(0.44, 'rgba(180, 138, 35, 0.88)');  // Inner transition
  baseGrad.addColorStop(0.52, 'rgba(110, 80, 25, 0.35)');   // Cassini Division (darker gap)
  baseGrad.addColorStop(0.56, 'rgba(212, 175, 55, 0.88)');  // Outer primary ring start
  baseGrad.addColorStop(0.72, 'rgba(255, 225, 130, 0.92)'); // Outer bright brass band
  baseGrad.addColorStop(0.85, 'rgba(218, 165, 32, 0.85)');  // Golden sheen
  baseGrad.addColorStop(0.94, 'rgba(195, 145, 30, 0.70)');  // Outer feathering
  baseGrad.addColorStop(1.00, 'rgba(212, 175, 55, 0.0)');   // Smooth edge fade

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // Clip to ring zone for subsequent detail passes
  ctx.clip();

  // 2. Over 180 Fine Concentric Lathe Micro-Grooves (Phonograph / Planetary Ringlets)
  ctx.lineWidth = 1.2;
  for (let r = rInner; r <= rOuter; r += 1.4) {
    const norm = (r - rInner) / (rOuter - rInner);
    // Pseudorandom yet stable variation
    const noise = Math.sin(r * 4.3) * 0.5 + Math.cos(r * 9.7) * 0.5;
    const isBright = noise > 0.2;
    const isDark = noise < -0.3;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);

    if (isBright) {
      const alpha = 0.12 + Math.abs(noise) * 0.22;
      ctx.strokeStyle = `rgba(255, 245, 195, ${alpha.toFixed(3)})`;
      ctx.stroke();
    } else if (isDark) {
      const alpha = 0.15 + Math.abs(noise) * 0.25;
      ctx.strokeStyle = `rgba(120, 85, 20, ${alpha.toFixed(3)})`;
      ctx.stroke();
    } else if (r % 6 < 1.4) {
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
      ctx.stroke();
    }
  }

  // 3. Radial Anisotropic Brushed Metal Streaks (gives rotating metallic reflections)
  const numSlices = 72;
  for (let i = 0; i < numSlices; i++) {
    const angle = (i / numSlices) * Math.PI * 2;
    const nextAngle = ((i + 1) / numSlices) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;

    // Simulate 4 anisotropic specular lobes around circular brushed brass
    const specularFactor = Math.pow(Math.cos(midAngle * 2), 4);
    if (specularFactor > 0.05) {
      const streakGrad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
      const alpha = (specularFactor * 0.32).toFixed(3);
      streakGrad.addColorStop(0, `rgba(255, 248, 220, ${alpha})`);
      streakGrad.addColorStop(0.5, `rgba(255, 235, 170, ${(specularFactor * 0.24).toFixed(3)})`);
      streakGrad.addColorStop(1, `rgba(212, 175, 55, 0.05)`);

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.lineTo(cx + Math.cos(nextAngle) * rOuter, cy + Math.sin(nextAngle) * rOuter);
      ctx.lineTo(cx + Math.cos(nextAngle) * rInner, cy + Math.sin(nextAngle) * rInner);
      ctx.closePath();
      ctx.fillStyle = streakGrad;
      ctx.fill();
    }
  }

  // 4. Accent Ringlets & Golden Foil Micro-Flecks
  // Inner golden rim highlight
  ctx.beginPath();
  ctx.arc(cx, cy, rInner + 12, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 240, 180, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Cassini gap boundary rings
  ctx.beginPath();
  ctx.arc(cx, cy, rInner + (rOuter - rInner) * 0.51, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 225, 120, 0.65)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, rInner + (rOuter - rInner) * 0.54, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 235, 140, 0.70)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Outer golden rim highlight
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter - 8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 235, 150, 0.60)';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // 5. Subtle Gold Leaf Micro-Speckles
  for (let s = 0; s < 400; s++) {
    const theta = Math.random() * Math.PI * 2;
    const rad = rInner + 8 + Math.random() * (rOuter - rInner - 16);
    const px = cx + Math.cos(theta) * rad;
    const py = cy + Math.sin(theta) * rad;
    const pSize = 0.8 + Math.random() * 1.6;
    const alpha = 0.25 + Math.random() * 0.55;

    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.4 ? `rgba(255, 248, 200, ${alpha})` : `rgba(212, 175, 55, ${alpha})`;
    ctx.fill();
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}


