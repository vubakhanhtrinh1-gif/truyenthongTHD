import * as THREE from 'three';
import { TimelineMilestone } from '../config/timelineContentData';

/**
 * Procedural Canvas Texture Generator for Timeline Room
 * "DÒNG CHẢY 60 NĂM — 1966–2026"
 * Upgraded to Grand Ivory Marble Hall, Luminous Emerald River of Time,
 * and Museum-Grade White Stone / Brass Milestones
 */

// 1. Polished Crema Marfil Marble Floor Texture (#FAF6ED)
export function createTimelineFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm Crema Marfil polished base
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#FAF7EE');
  grad.addColorStop(0.35, '#F3EAD7');
  grad.addColorStop(0.7, '#EFE3CC');
  grad.addColorStop(1, '#F8F1E2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle organic warm gold / amber marble veins
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    let x = (i * 155 + 50) % 1024;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 1024) {
      x += Math.sin(y * 0.012 + i) * 28 + (Math.sin(y * 0.035) - 0.5) * 14;
      y += 35 + Math.random() * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Secondary delicate whisper veins
  ctx.strokeStyle = 'rgba(180, 145, 95, 0.12)';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    let y = (i * 200 + 80) % 1024;
    let x = 0;
    ctx.moveTo(x, y);
    while (x < 1024) {
      y += Math.cos(x * 0.014 + i) * 22;
      x += 40 + Math.random() * 45;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Refined tile joints with inlaid champagne gold strips
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'; // Champagne gold
  ctx.lineWidth = 2.0;
  for (let p = 256; p < 1024; p += 256) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1024, p);
    ctx.stroke();

    // Cross-tile rosette studs
    for (let q = 256; q < 1024; q += 256) {
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(p, q, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 10);
  return texture;
}

// 2. Warm Ivory Architectural Wall Texture (#FAF7F0)
export function createTimelineWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm ivory limestone base
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft architectural fluted panel reveals
  ctx.fillStyle = 'rgba(224, 212, 192, 0.45)';
  for (let x = 64; x < 1024; x += 64) {
    ctx.fillRect(x, 0, 3, 1024);
  }

  // Polished 24K Champagne-Gold upper cornice trim (#D4AF37)
  const goldGrad = ctx.createLinearGradient(0, 90, 0, 120);
  goldGrad.addColorStop(0, '#E5C158');
  goldGrad.addColorStop(0.5, '#F7E7A9');
  goldGrad.addColorStop(1, '#C89B2B');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 95, 1024, 14);

  // Lower dado rail trim
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 915, 1024, 12);

  // Classical wall molding frame
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.40)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(50, 145, 924, 740);

  ctx.strokeStyle = 'rgba(220, 205, 180, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(62, 157, 900, 716);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

// 3. Central "River of Time" (Dòng Sông Thời Gian) Spine Texture
// Luminous emerald / cyan waterflow with golden caustics and chronological graduations
export function createTimelineSpineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Deep Emerald / Cyan aquatic gradient
  const riverGrad = ctx.createLinearGradient(0, 0, 512, 0);
  riverGrad.addColorStop(0, '#062B34');    // Deep teal edge
  riverGrad.addColorStop(0.18, '#0C4B59'); // Rich emerald body
  riverGrad.addColorStop(0.5, '#146E7E');  // Vibrant cyan-turquoise center
  riverGrad.addColorStop(0.82, '#0C4B59');
  riverGrad.addColorStop(1, '#062B34');
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, 0, 512, 2048);

  // Subtle fluid wave ripples and golden water caustics
  for (let y = 0; y < 2048; y += 42) {
    const waveAmp = Math.sin(y * 0.02) * 22;
    ctx.strokeStyle = 'rgba(80, 225, 235, 0.16)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(25, y + waveAmp);
    ctx.bezierCurveTo(
      160, y - waveAmp * 1.2,
      350, y + waveAmp * 1.5,
      487, y - waveAmp * 0.8
    );
    ctx.stroke();

    // Shimmering golden reflection highlights on water surface
    if (y % 84 === 0) {
      ctx.strokeStyle = 'rgba(255, 228, 140, 0.24)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(120, y + waveAmp * 0.5);
      ctx.lineTo(392, y - waveAmp * 0.5);
      ctx.stroke();
    }
  }

  // Outer continuous 24K Gold Embankment Strips
  const goldBorderGrad = ctx.createLinearGradient(0, 0, 20, 0);
  goldBorderGrad.addColorStop(0, '#E5C158');
  goldBorderGrad.addColorStop(0.5, '#FFF2BD');
  goldBorderGrad.addColorStop(1, '#BA8B22');

  ctx.fillStyle = goldBorderGrad;
  ctx.fillRect(8, 0, 10, 2048);
  ctx.fillRect(494, 0, 10, 2048);

  // Central illuminated golden stream spine
  const spineGrad = ctx.createLinearGradient(235, 0, 277, 0);
  spineGrad.addColorStop(0, 'rgba(255, 230, 150, 0.1)');
  spineGrad.addColorStop(0.35, '#FFE28A');
  spineGrad.addColorStop(0.5, '#FFFFFF'); // Luminous white-gold core
  spineGrad.addColorStop(0.65, '#FFE28A');
  spineGrad.addColorStop(1, 'rgba(255, 230, 150, 0.1)');
  ctx.fillStyle = spineGrad;
  ctx.fillRect(246, 0, 20, 2048);

  // Chronological milestone nodes along the river
  for (let y = 32; y < 2048; y += 64) {
    const isMajor = (y / 64) % 4 === 0;

    // Golden cross-notches
    ctx.strokeStyle = isMajor ? 'rgba(255, 232, 145, 0.95)' : 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = isMajor ? 3.0 : 1.5;
    const len = isMajor ? 90 : 45;

    ctx.beginPath();
    ctx.moveTo(256 - len, y);
    ctx.lineTo(256 + len, y);
    ctx.stroke();

    if (isMajor) {
      // Golden water lotus / celestial diamond star node
      ctx.fillStyle = '#FFE28A';
      ctx.beginPath();
      ctx.arc(256, y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ripple ring
      ctx.strokeStyle = 'rgba(100, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(256, y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  return texture;
}

// 4. Milestone Marker Stand Display Plaque Texture
// Upgraded to museum-grade warm ivory parchment face with rich brass framing,
// high-contrast typography, monumental gold serif year, and clean layout
export function createMilestoneMarkerTexture(milestone: TimelineMilestone): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Elegant warm ivory parchment backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
  bgGrad.addColorStop(0, '#FCF9F2');
  bgGrad.addColorStop(0.5, '#F7F1E3');
  bgGrad.addColorStop(1, '#F2E9D4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 640);

  // Outer Polished Royal Brass Border (#D4AF37)
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 9;
  ctx.strokeRect(10, 10, 1004, 620);

  // Inner beveled gold pinstripe
  ctx.strokeStyle = 'rgba(186, 139, 34, 0.45)';
  ctx.lineWidth = 2.0;
  ctx.strokeRect(22, 22, 980, 596);

  // Corner ornamental flourishes
  [
    { x: 26, y: 26 },
    { x: 998, y: 26 },
    { x: 26, y: 614 },
    { x: 998, y: 614 },
  ].forEach((corner) => {
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Category Tag Badge in Royal Deep Sapphire Navy (#141E30)
  ctx.fillStyle = '#141E30';
  ctx.beginPath();
  ctx.roundRect(42, 38, 270, 46, 8);
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = '#FCE7A4';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(milestone.periodLabel.toUpperCase(), 177, 68);

  // Monumental Year in Rich Polished Gold Serif (#9A6E1E / #D4AF37)
  ctx.fillStyle = '#8F6616';
  ctx.font = 'bold 82px "Noto Serif", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(milestone.year), 42, 160);

  // Dual Accent Divider
  const divGrad = ctx.createLinearGradient(42, 0, 982, 0);
  divGrad.addColorStop(0, '#D4AF37');
  divGrad.addColorStop(0.5, '#E9CF7A');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0.2)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(42, 186, 940, 3.5);

  // Crisp High-Contrast Vietnamese Title
  ctx.fillStyle = '#1B212D';
  ctx.font = 'bold 36px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.textAlign = 'left';
  wrapText(ctx, milestone.titleVi, 42, 246, 935, 48, 2);

  // One Concise Sentence Summary in Dark Slate with comfortable leading
  ctx.fillStyle = '#3E4656';
  ctx.font = '500 24px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, milestone.summaryVi, 42, 372, 935, 38, 4);

  // Interactive Call-to-Action Banner at Bottom
  ctx.fillStyle = '#141E30';
  ctx.fillRect(36, 546, 952, 60);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(36, 546, 952, 60);

  ctx.fillStyle = '#FFE599';
  ctx.font = 'bold 21px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ NHẤP VÀO ĐỂ XEM HỒ SƠ TƯ LIỆU CHI TIẾT ✦', 512, 584);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 5. Grand 60th Anniversary Finale Monument Medallion Texture (North Wall)
export function createFinaleMedallionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Deep Royal Sapphire Navy Gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 768);
  bg.addColorStop(0, '#0F1726');
  bg.addColorStop(0.4, '#172338');
  bg.addColorStop(0.8, '#10192A');
  bg.addColorStop(1, '#0A101C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1536, 768);

  // Outer 24K Royal Brass Borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, 1504, 736);

  ctx.strokeStyle = 'rgba(255, 230, 150, 0.55)';
  ctx.lineWidth = 3.0;
  ctx.strokeRect(34, 34, 1468, 700);

  // Corner medallions
  [
    { x: 38, y: 38 },
    { x: 1498, y: 38 },
    { x: 38, y: 730 },
    { x: 1498, y: 730 },
  ].forEach((pos) => {
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // School Name Inscription
  ctx.fillStyle = '#E8D8BA';
  ctx.font = 'bold 32px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • NAM ĐỊNH', 768, 98);

  // Monumental 60 numeral with golden aura
  ctx.fillStyle = '#FFE594';
  ctx.font = 'bold 165px "Noto Serif", Georgia, serif';
  ctx.shadowColor = 'rgba(255, 225, 120, 0.75)';
  ctx.shadowBlur = 28;
  ctx.fillText('60 NĂM', 768, 270);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Noto Serif", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('MỘT ĐIỂM TỰA • MỘT QUỸ ĐẠO TƯƠNG LAI', 768, 360);

  // Chronology Span
  ctx.fillStyle = '#E5C158';
  ctx.font = 'bold 38px "Noto Serif", monospace';
  ctx.letterSpacing = '8px';
  ctx.fillText('1966 — 2026', 768, 432);

  // Gold separator
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(220, 480);
  ctx.lineTo(1316, 480);
  ctx.stroke();

  // Highlight achievements summary
  ctx.fillStyle = '#E0D4BE';
  ctx.font = '500 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Huân chương Lao động hạng Nhất, Nhì, Ba • Huân chương Độc lập hạng Ba', 768, 540);
  ctx.fillText('Cờ thi đua của Chính phủ • Trường Chuẩn Quốc gia • Hàng vạn thế hệ học sinh trưởng thành', 768, 586);

  // Sacred quote
  ctx.fillStyle = '#FFE28A';
  ctx.font = 'italic 23px "Noto Serif", serif';
  ctx.fillText('« Giữ vững truyền thống vẻ vang — Tự tin bước vào kỷ nguyên phát triển mới »', 768, 660);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 6. Return-to-Lobby Entrance Portal Plaque Texture (South Wall)
export function createTimelineEntrancePlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#141E30';
  ctx.fillRect(0, 0, 1024, 320);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 7;
  ctx.strokeRect(10, 10, 1004, 300);

  ctx.strokeStyle = 'rgba(255, 230, 150, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, 980, 276);

  ctx.fillStyle = '#FCE7A4';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CỔNG VÀO PHÂN KHU 3D', 512, 58);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px "Noto Serif", Georgia, serif';
  ctx.fillText('DÒNG CHẢY 60 NĂM (1966–2026)', 512, 138);

  ctx.fillStyle = '#E0D4BE';
  ctx.font = '500 22px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Biên niên sử 6 thập kỷ trường tồn • Nhấp vòm cửa để về Sảnh Chính', 512, 208);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 19px "Be Vietnam Pro", monospace';
  ctx.fillText('✦ NHẤP ĐỂ TRỞ VỀ SẢNH CHÍNH DI SẢN ✦', 512, 268);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Helper utility for crisp multi-line text wrapping
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, y);
        return;
      }
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
}
