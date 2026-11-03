/**
 * Procedural Canvas Textures for Zone 2: Development Room (1974–2026)
 * Bright Luxury Heritage Aesthetic
 * Warm Ivory, Champagne Gold, Deep Navy, Antique Bronze, Natural Honey Oak
 */

import * as THREE from 'three';

/**
 * Refined Muted Warm Natural Oak Parquet Gallery Floor Texture
 * Balanced neutral tone — eliminates oversaturated orange/yellow tint.
 */
export function createDevelopmentFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base neutral warm French oak tone
  ctx.fillStyle = '#b09f8a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Parquet plank grid
  const plankW = 128;
  const plankH = 32;

  for (let y = 0; y < 1024; y += plankH) {
    const row = Math.floor(y / plankH);
    const offsetX = (row % 2) * (plankW / 2);

    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + offsetX;
      const lightness = 62 + Math.sin(px * 0.08 + y * 0.04) * 4;

      // Soft muted neutral oak (saturation only 15-18%)
      ctx.fillStyle = `hsl(35, 16%, ${lightness}%)`;
      ctx.fillRect(px, y, plankW - 2, plankH - 2);

      // Subtle fine wood grain lines
      ctx.strokeStyle = 'rgba(70, 55, 42, 0.08)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 3; g++) {
        const gy = y + 6 + g * 8;
        ctx.beginPath();
        ctx.moveTo(px, gy);
        ctx.lineTo(px + plankW - 2, gy);
        ctx.stroke();
      }

      // Plank subtle bevel edge
      ctx.strokeStyle = 'rgba(50, 40, 30, 0.18)';
      ctx.strokeRect(px, y, plankW - 2, plankH - 2);
    }
  }

  // Soft museum satin sheen
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, 'rgba(255, 245, 230, 0.10)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
  gradient.addColorStop(1, 'rgba(150, 130, 105, 0.10)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Clean Warm Ivory & Alabaster Exhibition Wall Texture
 * Crisp architectural surface without muddy brown speckles.
 */
export function createDevelopmentWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base clean warm ivory / alabaster
  ctx.fillStyle = '#eae3d7';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural micro-texture
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 1.5 + 0.5;
    const alpha = Math.random() * 0.03;
    ctx.fillStyle = `rgba(110, 100, 90, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Delicate champagne gold architectural panel moulding borders
  ctx.strokeStyle = 'rgba(184, 146, 75, 0.30)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 944, 944);
  ctx.strokeStyle = 'rgba(217, 189, 121, 0.20)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, 914, 914);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Coffered Ceiling Panel in Warm Champagne Bronze
 */
export function createDevelopmentCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark warm bronze base
  ctx.fillStyle = '#2d2924';
  ctx.fillRect(0, 0, 512, 512);

  // Recessed coffer inner panel
  ctx.fillStyle = '#3a342c';
  ctx.fillRect(32, 32, 448, 448);

  // Champagne gold beveled border
  ctx.strokeStyle = '#b8924b';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, 448, 448);

  ctx.strokeStyle = '#e6c87d';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 416, 416);

  // Center subtle rosette or diamond
  ctx.strokeStyle = 'rgba(217, 189, 121, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(256, 128);
  ctx.lineTo(384, 256);
  ctx.lineTo(256, 384);
  ctx.lineTo(128, 256);
  ctx.closePath();
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 12);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Central Master Timeline Emblem Texture (Engraved Bronze Dial with 3 Eras)
 */
export function createCentralTimelineEmblemTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Circular dial background
  const cx = 512;
  const cy = 512;

  // Signature Deep Obsidian Black & Imperial Gold disc gradient (identical to Room 1)
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 500);
  grad.addColorStop(0, '#261e12');
  grad.addColorStop(0.35, '#16120b');
  grad.addColorStop(0.7, '#0c0a07');
  grad.addColorStop(1, '#050403');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 500, 0, Math.PI * 2);
  ctx.fill();

  // Outer 24K metallic rings (identical to Room 1)
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 482, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 465, 0, Math.PI * 2);
  ctx.stroke();

  // Era 1 Ring Sector (1974 - 1997)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, 390, Math.PI * 0.75, Math.PI * 1.35);
  ctx.stroke();

  // Era 2 Ring Sector (1997 - 2016)
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, 390, Math.PI * 1.4, Math.PI * 1.95);
  ctx.stroke();

  // Era 3 Ring Sector (2016 - 2026)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, 390, 0, Math.PI * 0.65);
  ctx.stroke();

  // Typography
  ctx.fillStyle = '#f6ede0';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HÀNH TRÌNH PHÁT TRIỂN', cx, cy - 80);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText('1974 — 2026', cx, cy - 20);

  ctx.fillStyle = '#f6ede0';
  ctx.font = '22px sans-serif';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO', cx, cy + 40);

  ctx.fillStyle = '#c5b8a5';
  ctx.font = 'italic 18px serif';
  ctx.fillText('"Giữ vững truyền thống — Đổi mới để vươn xa"', cx, cy + 85);

  // Era labels on outer rim
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('THỜI KỲ 1 (1974–1997)', 230, 200);
  ctx.fillText('THỜI KỲ 2 (1997–2016)', 790, 200);
  ctx.fillText('THỜI KỲ 3 (2016–2026)', 512, 880);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Detailed Milestone Wall Plaque Texture
 * Standardized typography hierarchy, generous margins, no text overflowing borders.
 */
export function createMilestonePlaqueTexture(
  year: string,
  title: string,
  subtitle: string,
  categoryLabel: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Obsidian Bronze-Black Background (identical to Room 1)
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  bgGrad.addColorStop(0, '#15120c');
  bgGrad.addColorStop(1, '#090705');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 24K Gold gradient architectural border (identical to Room 1)
  const borderGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  borderGrad.addColorStop(0, '#ffd988');
  borderGrad.addColorStop(0.5, '#d4af37');
  borderGrad.addColorStop(1, '#b8860b');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 988, 476);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, 968, 456);

  const leftMargin = 56;
  const rightMargin = 968;
  const maxTextW = rightMargin - leftMargin;

  // 1. Category Tag (Pill) with Imperial Lacquer Red / Gold
  ctx.fillStyle = 'rgba(138, 27, 36, 0.35)';
  ctx.fillRect(leftMargin, 42, 220, 32);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(leftMargin, 42, 220, 32);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(categoryLabel.toUpperCase(), leftMargin + 110, 58);

  // 2. Year Highlight
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(year, leftMargin, 138);

  // 3. Title (Up to 2 lines)
  ctx.fillStyle = '#f5efe6';
  ctx.font = 'bold 28px serif';

  const titleWords = title.split(' ');
  let titleLine = '';
  let titleY = 184;
  let titleLinesCount = 0;

  for (let n = 0; n < titleWords.length; n++) {
    const testLine = titleLine + titleWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextW && n > 0) {
      ctx.fillText(titleLine.trim(), leftMargin, titleY);
      titleLine = titleWords[n] + ' ';
      titleY += 36;
      titleLinesCount++;
      if (titleLinesCount >= 2) break;
    } else {
      titleLine = testLine;
    }
  }
  if (titleLinesCount < 2 && titleLine.trim()) {
    ctx.fillText(titleLine.trim(), leftMargin, titleY);
    titleY += 36;
  }

  // 4. Subtitle / Summary (Controlled line height and clamp to 3 lines)
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '19px sans-serif';

  const subWords = subtitle.split(' ');
  let subLine = '';
  let subY = Math.max(titleY + 14, 255);
  let subLinesCount = 0;

  for (let n = 0; n < subWords.length; n++) {
    const testLine = subLine + subWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextW && n > 0) {
      ctx.fillText(subLine.trim(), leftMargin, subY);
      subLine = subWords[n] + ' ';
      subY += 28;
      subLinesCount++;
      if (subLinesCount >= 3) {
        if (n < subWords.length - 1) subLine += '...';
        break;
      }
    } else {
      subLine = testLine;
    }
  }
  if (subLinesCount < 3 && subLine.trim()) {
    ctx.fillText(subLine.trim(), leftMargin, subY);
  }

  // 5. Interactive hint (Safely pinned at bottom)
  ctx.fillStyle = '#d9bd79';
  ctx.font = 'italic 15px sans-serif';
  ctx.fillText('✦ NHẤP ĐỂ XEM HỒ SƠ TƯ LIỆU VÀ MINH CHỨNG LỊCH SỬ', leftMargin, 458);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Leadership Gallery Portrait/Plaque Texture
 */
export function createLeadershipPlaqueTexture(
  order: number,
  name: string,
  role: string,
  period: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Background deep obsidian black-bronze (identical to Room 1)
  ctx.fillStyle = '#110e0a';
  ctx.fillRect(0, 0, 512, 768);

  // Luxurious 24K gold frame
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(14, 14, 484, 740);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, 464, 720);

  // Inner silhouette/avatar placeholder frame
  ctx.fillStyle = '#18140e';
  ctx.fillRect(48, 64, 416, 420);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 64, 416, 420);

  // Stylized academic leader silhouette
  ctx.fillStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.beginPath();
  ctx.arc(256, 210, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 380, 140, 110, 0, Math.PI, 0);
  ctx.fill();

  // Order badge
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(256, 64, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#110e0a';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(order), 256, 64);

  // Leader Name
  ctx.fillStyle = '#f6ede0';
  ctx.font = 'bold 26px serif';
  ctx.fillText(name, 256, 532);

  // Role
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(role, 256, 574);

  // Period
  ctx.fillStyle = '#dcd4c5';
  ctx.font = '16px sans-serif';
  ctx.fillText(period, 256, 616);

  // Traditional footer
  ctx.fillStyle = '#b89f72';
  ctx.font = 'italic 14px serif';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO', 256, 686);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Educational Comparative Scale Chart Texture
 * Cleanly centered, uncrowded columns, accurate spacing.
 */
export function createComparativeScaleChartTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#120f0a';
  ctx.fillRect(0, 0, 1024, 512);

  // 24K Gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 996, 484);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, 976, 464);

  // Title
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  ctx.fillText('BẢNG TĂNG TRƯỞNG QUY MÔ TRƯỜNG LỚP QUA CÁC THỜI KỲ', 512, 64);

  // Column chart data
  const columns = [
    { year: '1974–1975', classes: 27, students: '1.100', staff: '65', height: 130 },
    { year: '2011', classes: 36, students: '1.600', staff: '102', height: 180 },
    { year: '2015–2016', classes: 33, students: '1.296', staff: '95', height: 165 },
    { year: '2024–2025', classes: 36, students: '1.620', staff: '88', height: 190 },
    { year: '2026', classes: 39, students: '1.750', staff: '89', height: 215 },
  ];

  const spacing = 175;
  const startX = (1024 - 4 * spacing) / 2; // Perfectly centered: 162px
  const baseY = 360;

  // Base line
  ctx.strokeStyle = '#b8924b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, baseY);
  ctx.lineTo(944, baseY);
  ctx.stroke();

  columns.forEach((col, idx) => {
    const x = startX + idx * spacing;
    const barW = 74;
    const barH = col.height;

    // Bar gradient (champagne to deep gold)
    const barGrad = ctx.createLinearGradient(x, baseY - barH, x, baseY);
    barGrad.addColorStop(0, '#ffd988');
    barGrad.addColorStop(1, '#a8853b');
    ctx.fillStyle = barGrad;
    ctx.fillRect(x - barW / 2, baseY - barH, barW, barH);

    // Outline
    ctx.strokeStyle = '#d9bd79';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - barW / 2, baseY - barH, barW, barH);

    // Class number on top of bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${col.classes} LỚP`, x, baseY - barH - 12);

    // Year label below baseline
    ctx.fillStyle = '#ffd988';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(col.year, x, baseY + 26);

    // Student count
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${col.students} HS`, x, baseY + 48);
    ctx.fillText(`${col.staff} CB-GV`, x, baseY + 68);
  });

  // Footer interactive prompt
  ctx.fillStyle = '#d9bd79';
  ctx.font = 'italic 14px sans-serif';
  ctx.fillText('✦ NHẤP ĐỂ XEM HỒ SƠ MINH CHỨNG THỐNG KÊ CHI TIẾT QUA 5 MỐC LỊCH SỬ', 512, 464);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Contemporary School Organization Plaque Texture
 */
export function createOrganizationalPlaqueTexture(
  title: string,
  principal: string,
  vicePrincipals: string[]
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Obsidian Bronze-Black Background (identical to Room 1)
  ctx.fillStyle = '#120f0a';
  ctx.fillRect(0, 0, 1024, 512);

  // 24K Gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 992, 480);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 968, 456);

  // Category Tag
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(48, 48, 280, 36);
  ctx.fillStyle = '#120f0a';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CƠ CẤU TỔ CHỨC HIỆN NAY', 188, 66);

  // Title
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 30px serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 48, 135);

  // Principal Box
  ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
  ctx.fillRect(48, 165, 928, 80);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 165, 928, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px serif';
  ctx.fillText(principal, 72, 212);

  // Vice Principals
  const vpY = 270;
  vicePrincipals.forEach((vp, idx) => {
    const boxW = 450;
    const boxX = 48 + idx * 478;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(boxX, vpY, boxW, 64);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.strokeRect(boxX, vpY, boxW, 64);

    ctx.fillStyle = '#f6ede0';
    ctx.font = '18px serif';
    ctx.fillText(vp, boxX + 20, vpY + 38);
  });

  // Department hint
  ctx.fillStyle = '#dcd4c5';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText('✦ 7 TỔ CHUYÊN MÔN: Ngữ văn • Ngoại ngữ • Toán-Tin • Lý-KT • Sử-Địa • Hóa-Sinh • Văn phòng', 48, 380);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'italic 15px sans-serif';
  ctx.fillText('✦ NHẤP ĐỂ XEM DANH SÁCH LÃNH ĐẠO CÁC TỔ CHUYÊN MÔN CHI TIẾT', 48, 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Memorial Pedestal Inscription Plaque for Hung Dao Dai Vuong Tran Quoc Tuan Statue
 */
export function createTranHungDaoPlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep patinated bronze plate background
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#2b1c11');
  grad.addColorStop(0.5, '#3d2919');
  grad.addColorStop(1, '#24160c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle bronze metal grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.05;
    ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Double gold border with ornate Tran-dynasty brackets
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 5;
  ctx.strokeRect(20, 20, 984, 472);

  ctx.strokeStyle = 'rgba(255, 230, 150, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 960, 448);

  // Corner decorative rivets
  const corners = [
    [26, 26], [998, 26], [26, 486], [998, 486]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd988';
    ctx.fill();
    ctx.strokeStyle = '#b8924b';
    ctx.stroke();
  });

  // Top emblem: Tran Dynasty Lotus Crest
  ctx.fillStyle = '#ffd988';
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ❖ ✦', 512, 70);

  // Honorific Title
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('QUỐC CÔNG TIẾT CHẾ', 512, 110);

  // General Name in Gilded Relief
  ctx.fillStyle = '#fff4d6';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.font = 'bold 36px "Times New Roman", Times, serif';
  ctx.fillText('HƯNG ĐẠO ĐẠI VƯƠNG TRẦN QUỐC TUẤN', 512, 160);
  ctx.shadowColor = 'transparent';

  // Birth - Passing Years
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('(1228 – 1300)', 512, 200);

  // Divider line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 225);
  ctx.lineTo(824, 225);
  ctx.stroke();

  // Statue Milestone Info
  ctx.fillStyle = '#e8d9c2';
  ctx.font = 'italic 19px serif';
  ctx.fillText('TƯỢNG ĐỒNG KHÁNH THÀNH NGÀY 28/08/2006 • KỶ NIỆM 40 NĂM THÀNH LẬP TRƯỜNG', 512, 265);

  // Immortal patriotic vow
  ctx.fillStyle = '#ffdf88';
  ctx.font = 'bold italic 22px serif';
  ctx.fillText('« Bệ hạ chém đầu tôi trước rồi hãy hàng! »', 512, 318);

  // Second strategic principle
  ctx.fillStyle = '#c7bca9';
  ctx.font = 'italic 18px serif';
  ctx.fillText('« Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước. »', 512, 362);

  // School Name Banner at Bottom
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(180, 400, 664, 45);
  ctx.strokeStyle = '#b8924b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(180, 400, 664, 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Times New Roman", Times, serif';
  ctx.fillText('TRƯỜNG TRUNG HỌC PHỔ THÔNG A TRẦN HƯNG ĐẠO', 512, 430);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for Hich Tuong Si Scroll in Tran Hung Dao's Right Hand
 */
export function createHichTuongSiScrollTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Aged silk parchment background
  ctx.fillStyle = '#ecdcb9';
  ctx.fillRect(0, 0, 512, 256);

  // Red lacquer borders
  ctx.fillStyle = '#8a1820';
  ctx.fillRect(0, 0, 512, 16);
  ctx.fillRect(0, 240, 512, 16);

  // Gold trim lines
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 20, 504, 216);

  // Title
  ctx.fillStyle = '#8a1820';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('HỊCH TƯỚNG SĨ', 256, 50);

  ctx.fillStyle = '#2b1b11';
  ctx.font = 'bold 13px serif';
  ctx.fillText('DỤ CHƯ TỲ TƯỚNG HỊCH VĂN (1285)', 256, 75);

  // Calligraphic text lines simulation
  ctx.fillStyle = '#3a2b1f';
  ctx.font = 'italic 12px serif';
  ctx.fillText('« Ta thường tới bữa quên ăn, nửa đêm vỗ gối,', 256, 115);
  ctx.fillText('ruột đau như cắt, nước mắt đầm đìa...', 256, 140);
  ctx.fillText('chỉ căm tức chưa xả thịt lột da quân thù! »', 256, 165);

  // Red seal mark (Dấu triện son đỏ thời Trần)
  ctx.fillStyle = 'rgba(180, 30, 30, 0.75)';
  ctx.fillRect(380, 150, 48, 48);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 1;
  ctx.strokeRect(380, 150, 48, 48);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px serif';
  ctx.fillText('QUỐC', 404, 168);
  ctx.fillText('CÔNG', 404, 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Authentic Central Framed Image Texture of Đức Thánh Trần
 * Directly loads the user's authentic uploaded image asset if available.
 * If not yet uploaded, renders a dignified, elegant dark bronze/navy framed placeholder
 * strictly without procedural statues, fake characters, or broken images.
 */
export function createDucThanhTranFrameTexture(customUrl?: string): THREE.Texture {
  if (customUrl) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      customUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Could not load Duc Thanh Tran image, using designed placeholder:', err);
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  // Designed Empty State: Dignified museum portrait mat with authentic inscriptions
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400; // Elegant vertical portrait proportion (approx 1:1.37)
  const ctx = canvas.getContext('2d')!;

  // Deep dark navy and obsidian gradient mat background
  const grad = ctx.createLinearGradient(0, 0, 0, 1400);
  grad.addColorStop(0, '#0c1220');
  grad.addColorStop(0.5, '#141c2e');
  grad.addColorStop(1, '#090d18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1400);

  // Fine metallic grain
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1400;
    const alpha = Math.random() * 0.04;
    ctx.fillStyle = `rgba(212, 175, 98, ${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Double golden inner border
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 952, 1328);

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, 920, 1296);

  // Ornate corner floral rivets
  const corners = [
    [44, 44], [980, 44], [44, 1356], [980, 1356]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD988';
    ctx.fill();
    ctx.strokeStyle = '#99732B';
    ctx.stroke();
  });

  // Top Crest & Dynasty Star
  ctx.fillStyle = '#D4AF62';
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('❖ ✦ ❖', 512, 180);

  // Main Heading: ĐỨC THÁNH TRẦN
  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 54px "Cinzel", "Times New Roman", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('ĐỨC THÁNH TRẦN', 512, 270);

  ctx.fillStyle = '#D4AF62';
  ctx.font = 'bold 30px "Times New Roman", serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('HƯNG ĐẠO ĐẠI VƯƠNG TRẦN QUỐC TUẤN', 512, 330);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = 'italic 24px monospace';
  ctx.fillText('(1228 — 1300)', 512, 380);

  // Subtle central placeholder frame box
  ctx.fillStyle = 'rgba(10, 15, 28, 0.85)';
  ctx.fillRect(160, 440, 704, 520);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(160, 440, 704, 520);

  // Portrait iconography
  ctx.fillStyle = 'rgba(212, 175, 98, 0.7)';
  ctx.font = '64px serif';
  ctx.fillText('⚜', 512, 640);

  ctx.fillStyle = '#F3ECDD';
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.fillText('ẢNH TƯ LIỆU CHÍNH THỨC', 512, 730);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 20px serif';
  ctx.fillText('Ảnh tư liệu chính thức sẽ được cập nhật', 512, 790);
  ctx.fillText('qua hệ thống quản trị CMD.', 512, 825);

  // Lower Section: Verified Physical Statue Specifications (as accurate textual note)
  ctx.fillStyle = 'rgba(20, 27, 48, 0.9)';
  ctx.fillRect(100, 1020, 824, 270);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(100, 1020, 824, 270);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 20px "Times New Roman", serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('THÔNG SỐ TƯỢNG ĐỒNG KHUÔN VIÊN TRƯỜNG', 512, 1065);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '19px "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText('• Tượng đồng nguyên khối • Chiều cao: 1,28 m • Trọng lượng: 212 kg', 140, 1115);
  ctx.fillText('• Đúc tại làng nghề Tống Xá, Ý Yên • Thiết kế: Họa sĩ Vương Duy Biên', 140, 1155);
  ctx.fillText('• Khánh thành trang trọng ngày 28/08/2006 dịp kỷ niệm 40 năm thành lập trường', 140, 1195);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'italic 18px serif';
  ctx.textAlign = 'center';
  ctx.fillText('« Bệ hạ chém đầu tôi trước rồi hãy hàng! »', 512, 1250);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for Important Medal Exhibition Card
 * If authentic photo is provided, loads the real photo.
 * If not, renders the designed placeholder empty state.
 */
export function createMedalCardTexture(
  titleVi: string,
  year: string | number,
  customUrl?: string
): THREE.Texture {
  if (customUrl) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      customUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      },
      undefined,
      (err) => console.warn('Could not load medal image:', err)
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Deep navy satin backing
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#162238');
  grad.addColorStop(1, '#0b1120');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 768);

  // Gold trim border
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 976, 720);

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, 952, 696);

  // Laurel / Medal icon
  ctx.fillStyle = '#D4AF62';
  ctx.font = '54px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎖️', 512, 160);

  // Year badge
  ctx.fillStyle = 'rgba(212, 175, 98, 0.2)';
  ctx.fillRect(412, 200, 200, 42);
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(412, 200, 200, 42);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(`NĂM ${year}`, 512, 228);

  // Medal Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
  ctx.fillText(titleVi.toUpperCase(), 512, 330);

  // Inner placeholder image box
  ctx.fillStyle = 'rgba(10, 15, 26, 0.7)';
  ctx.fillRect(200, 400, 624, 240);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(200, 400, 624, 240);

  ctx.fillStyle = '#D4AF62';
  ctx.font = 'bold 22px "Times New Roman", serif';
  ctx.fillText('CHƯA CÓ ẢNH HUÂN CHƯƠNG', 512, 490);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 18px serif';
  ctx.fillText('Hình ảnh tư liệu sẽ được bổ sung qua hệ thống quản trị CMD.', 512, 550);

  // Click note
  ctx.fillStyle = '#FFD988';
  ctx.font = '16px monospace';
  ctx.fillText('[ NHẤP ĐỂ XEM CHI TIẾT & Ý NGHĨA LỊCH SỬ ]', 512, 685);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Grand Canvas Texture for Central Monumental Pillar (3 Traditional Paintings)
 */
export function createCentralPillarPaintingTexture(
  order: number,
  titleVi: string,
  captionVi: string,
  customUrl?: string
): THREE.Texture {
  if (customUrl) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(customUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Rich Artistic Museum Canvas Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
  if (order === 1) {
    // Warm historical sepia / umber / torchlight
    bgGrad.addColorStop(0, '#1c150c');
    bgGrad.addColorStop(0.35, '#2e1f13');
    bgGrad.addColorStop(0.7, '#1b1610');
    bgGrad.addColorStop(1, '#0e0b08');
  } else if (order === 2) {
    // Heritage brick red / gold / vibrant era
    bgGrad.addColorStop(0, '#1a100d');
    bgGrad.addColorStop(0.35, '#2b1713');
    bgGrad.addColorStop(0.7, '#1d1511');
    bgGrad.addColorStop(1, '#0c0a09');
  } else {
    // Majestic royal sapphire / gold dawn / diamond future
    bgGrad.addColorStop(0, '#0d1624');
    bgGrad.addColorStop(0.35, '#132438');
    bgGrad.addColorStop(0.7, '#182633');
    bgGrad.addColorStop(1, '#080d14');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1440);

  // 2. Artistic Vignette & Classical Canvas Linen Texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 1440; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 3. Ornate Classical Gold Molding Inner Border
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 964, 1380);

  ctx.strokeStyle = 'rgba(255, 230, 160, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(44, 44, 936, 1352);

  ctx.strokeStyle = '#7A5B28';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, 920, 1336);

  // 4. Painting Artwork Illustration Centerpiece
  const artY = 90;
  const artH = 880;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(70, artY, 884, artH);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, artY, 884, artH);

  // Decorative Sacred Scene Silhouette for Duc Thanh Tran
  if (order === 1) {
    // Reverent Commander portrait motif
    ctx.fillStyle = '#D4AF62';
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️', 512, artY + 220);

    ctx.fillStyle = '#FFD988';
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
    ctx.fillText('HƯNG ĐẠO ĐẠI VƯƠNG TRẦN QUỐC TUẤN', 512, artY + 340);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 24px "Times New Roman", serif';
    ctx.fillText('Anh Hùng Dân Tộc • Quốc Công Tiết Chế', 512, artY + 400);

    ctx.fillStyle = '#C5A059';
    ctx.font = 'italic 20px serif';
    ctx.fillText('« Bệ hạ chém đầu tôi trước rồi hãy hàng! »', 512, artY + 520);
  } else if (order === 2) {
    // Dong A Spirit and Victory
    ctx.fillStyle = '#D4AF62';
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📜', 512, artY + 220);

    ctx.fillStyle = '#FFD988';
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
    ctx.fillText('HÀO KHÍ ĐÔNG A & HỊCH TƯỚNG SĨ', 512, artY + 340);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 24px "Times New Roman", serif';
    ctx.fillText('Ba Lần Đại Thắng Nguyên Mông Lừng Lẫy Non Sông', 512, artY + 400);

    ctx.fillStyle = '#C5A059';
    ctx.font = 'italic 20px serif';
    ctx.fillText('« Khoan thư sức dân để làm kế sâu rễ bền gốc »', 512, artY + 520);
  } else {
    // Enduring Inspiration for Teachers and Students
    ctx.fillStyle = '#D4AF62';
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️', 512, artY + 220);

    ctx.fillStyle = '#FFD988';
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
    ctx.fillText('ĐỨC THÁNH TRẦN TRONG TÂM THỨC NHÀ TRƯỜNG', 512, artY + 340);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 24px "Times New Roman", serif';
    ctx.fillText('Điểm Tựa Tinh Thần • Kim Chỉ Nam Rèn Đức Luyện Tài', 512, artY + 400);

    ctx.fillStyle = '#C5A059';
    ctx.font = 'italic 20px serif';
    ctx.fillText('« Tự hào ngôi trường mang tên vị Anh hùng Dân tộc vĩ đại »', 512, artY + 520);
  }

  // Placeholder Frame Note
  ctx.fillStyle = 'rgba(212, 175, 98, 0.15)';
  ctx.fillRect(160, artY + 600, 704, 180);
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, artY + 600, 704, 180);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KHUNG ẢNH ĐỨC THÁNH TRẦN • TẢI LÊN TỪ CMD', 512, artY + 665);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '18px serif';
  ctx.fillText('Người quản trị trực tiếp tải lên hình ảnh Đức Thánh Trần trong mục Quản Lý Nội Dung (CMD)', 512, artY + 715);

  // 5. Commemorative Plaque Beneath Painting (Ornate Gilded Plaque)
  const plaqueY = 1010;
  const plaqueH = 340;
  const plqGrad = ctx.createLinearGradient(0, plaqueY, 0, plaqueY + plaqueH);
  plqGrad.addColorStop(0, '#241a10');
  plqGrad.addColorStop(0.5, '#18120b');
  plqGrad.addColorStop(1, '#0e0b07');
  ctx.fillStyle = plqGrad;
  ctx.fillRect(70, plaqueY, 884, plaqueH);

  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, plaqueY, 884, plaqueH);
  ctx.strokeStyle = 'rgba(255, 217, 136, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(78, plaqueY + 8, 868, plaqueH - 16);

  // Order pill badge
  ctx.fillStyle = 'rgba(212, 175, 98, 0.25)';
  ctx.fillRect(342, plaqueY + 24, 340, 36);
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 1;
  ctx.strokeRect(342, plaqueY + 24, 340, 36);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`ẢNH ĐỨC THÁNH TRẦN • KHUNG ${order} / 3`, 512, plaqueY + 48);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Cinzel", "Times New Roman", serif';
  ctx.fillText(titleVi.toUpperCase(), 512, plaqueY + 115);

  // Caption (multi-line)
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '20px "Times New Roman", serif';
  ctx.fillText(captionVi, 512, plaqueY + 175);

  // Interactive Hint
  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN E ĐỂ XEM & TẢI ẢNH ĐỨC THÁNH TRẦN ]', 512, plaqueY + 295);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural National Honors & Awards Card Texture (for Right Center Triptych Gallery)
 */
export function createHonorsAwardCardTexture(
  awardType: 'prime_minister' | 'ministry_province' | 'labor_orders',
  titleVi: string,
  leadVi: string,
  captionVi: string,
  customUrl?: string
): THREE.Texture {
  if (customUrl) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(customUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Royal Certificate Background
  const grad = ctx.createLinearGradient(0, 0, 0, 1280);
  if (awardType === 'labor_orders') {
    grad.addColorStop(0, '#1c0e0e');
    grad.addColorStop(0.3, '#2a1212');
    grad.addColorStop(0.7, '#1b0e0e');
    grad.addColorStop(1, '#0c0707');
  } else if (awardType === 'prime_minister') {
    grad.addColorStop(0, '#1a140a');
    grad.addColorStop(0.3, '#261b0c');
    grad.addColorStop(0.7, '#1a1309');
    grad.addColorStop(1, '#0e0b06');
  } else {
    grad.addColorStop(0, '#0c1524');
    grad.addColorStop(0.3, '#122035');
    grad.addColorStop(0.7, '#101c2e');
    grad.addColorStop(1, '#080d16');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1280);

  // 2. Ornate Gilded Certificate Border
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 968, 1224);

  ctx.strokeStyle = 'rgba(255, 230, 160, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 944, 1200);

  // 3. Top Emblem / Ribbon Icon
  ctx.fillStyle = '#D4AF62';
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  const icon = awardType === 'labor_orders' ? '🏅' : awardType === 'prime_minister' ? '🎖️' : '🏆';
  ctx.fillText(icon, 512, 130);

  // Header Authority Label
  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 20px monospace';
  ctx.letterSpacing = '2px';
  const authLabel =
    awardType === 'labor_orders'
      ? 'CHỦ TỊCH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'
      : awardType === 'prime_minister'
      ? 'THỦ TƯỚNG CHÍNH PHỦ NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'
      : 'BỘ GIÁO DỤC VÀ ĐÀO TẠO • UBND TỈNH NAM ĐỊNH';
  ctx.fillText(authLabel, 512, 185);

  // Title of the distinction
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px "Cinzel", "Times New Roman", serif';
  ctx.fillText(titleVi.toUpperCase(), 512, 260);

  // Divider
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(312, 295);
  ctx.lineTo(712, 295);
  ctx.stroke();

  // 4. Archival Image Display Placeholder Box (Where user will add images in CMD)
  const imgBoxY = 320;
  const imgBoxH = 460;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(70, imgBoxY, 884, imgBoxH);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, imgBoxY, 884, imgBoxH);

  // Center watermark badge
  ctx.fillStyle = '#D4AF62';
  ctx.font = '56px serif';
  ctx.fillText('🖼️', 512, imgBoxY + 180);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.fillText('HÌNH ẢNH TƯ LIỆU THÊM QUA CMD ADMIN', 512, imgBoxY + 260);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 18px serif';
  ctx.fillText(captionVi, 512, imgBoxY + 310);

  ctx.fillStyle = 'rgba(212, 175, 98, 0.2)';
  ctx.fillRect(280, imgBoxY + 360, 464, 44);
  ctx.strokeStyle = '#D4AF62';
  ctx.lineWidth = 1;
  ctx.strokeRect(280, imgBoxY + 360, 464, 44);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('TÍCH HỢP CLOUD FIRESTORE & STORAGE', 512, imgBoxY + 388);

  // 5. Lead Narrative ("Lời Dẫn") Box
  const leadBoxY = 820;
  const leadBoxH = 360;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fillRect(70, leadBoxY, 884, leadBoxH);
  ctx.strokeStyle = 'rgba(212, 175, 98, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(70, leadBoxY, 884, leadBoxH);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LỜI DẪN DANH HIỆU:', 100, leadBoxY + 45);

  // Render multi-line lead text cleanly
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '22px "Times New Roman", serif';
  const words = leadVi.split(' ');
  let line = '';
  let lineY = leadBoxY + 95;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 810 && i > 0) {
      ctx.fillText(line, 100, lineY);
      line = words[i] + ' ';
      lineY += 38;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, lineY);

  // Interactive hint at bottom
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN E ĐỂ XEM HỒ SƠ DANH HIỆU & THÊM ẢNH ]', 512, 1225);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Archival Photo Canvas Texture for Far End Wall (3 Frames at the North Wall)
 * Designed for user to upload photos directly from CMD Admin.
 */
export function createEndWallPhotoTexture(
  order: number,
  titleVi: string,
  captionVi: string,
  customUrl?: string
): THREE.Texture {
  if (customUrl) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(customUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Museum Charcoal & Navy Base
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e293b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 768);

  // Subtle linen texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 768; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 2. Ornate 24K Heritage Gold Filigree Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, 976, 720);

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 952, 696);

  // Corner decorative marks
  const corners = [
    [48, 48],
    [976, 48],
    [48, 720],
    [976, 720],
  ];
  ctx.fillStyle = '#D4AF37';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Central Photo Display Area / Placeholder Box
  const boxX = 64;
  const boxY = 70;
  const boxW = 896;
  const boxH = 460;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Icon / Camera motif
  ctx.fillStyle = '#D4AF37';
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  ctx.fillText('📷', 512, boxY + 160);

  ctx.fillStyle = '#FFD988';
  ctx.font = 'bold 30px "Cinzel", "Times New Roman", serif';
  ctx.fillText(`KHUNG ẢNH TƯ LIỆU CUỐI PHÒNG ${order}`, 512, boxY + 235);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('[ BẠN TRỰC TIẾP TẢI ẢNH LÊN TỪ CMD ]', 512, boxY + 295);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'italic 16px "Times New Roman", serif';
  ctx.fillText('Vị trí lưu trữ đã sẵn sàng trong QUẢN LÝ NỘI DUNG (Phân khu 05)', 512, boxY + 345);

  // 4. Bottom Title & Information Plaque
  const plqY = 555;
  const plqH = 160;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fillRect(boxX, plqY, boxW, plqH);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, plqY, boxW, plqH);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleVi.toUpperCase(), 512, plqY + 50);

  ctx.fillStyle = '#FFD988';
  ctx.font = '16px "Times New Roman", serif';
  ctx.fillText(captionVi, 512, plqY + 95);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN PHÍM E ĐỂ XEM HỒ SƠ & TẢI ẢNH ]', 512, plqY + 135);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


