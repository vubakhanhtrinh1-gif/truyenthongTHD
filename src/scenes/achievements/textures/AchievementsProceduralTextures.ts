/**
 * High-Resolution Procedural Texture Generator for Zone 3: Achievements Room
 * Trường THPT A Trần Hưng Đạo (1966–2026)
 *
 * Implements:
 * 1. Highly legible, large-font 2D award frames with distinct visual hierarchy per section.
 * 2. Visual statistical infographics for 2025–2026 academic excellence with high-contrast metric cards.
 * 3. Grand rear "ĐÀI VINH DANH" display showcasing published achievements & uploaded images.
 * 4. Dedicated interactive plaque for "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG".
 * 5. Flush floor medallion texture replacing bulky platform.
 */

import * as THREE from 'three';
import {
  loadAndCacheImage,
  getCachedImage,
  drawImageContain,
  markTextureNeedsUpdate,
} from '../../../services/museumTextureService';
import {
  AwardItem,
  AcademicStatisticItem,
  CulturalArtisticItem,
  ExternalCompetitionsItem,
} from '../config/achievementsContentData';

/**
 * Procedural Coffered Ceiling Texture for Zone 3
 */
export function createAchievementsCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#120e0a';
  ctx.fillRect(0, 0, 512, 512);

  // Outer coffered border
  ctx.strokeStyle = '#22170e';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 498, 498);

  // Inner gold trim
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 452, 452);

  ctx.fillStyle = '#18120b';
  ctx.fillRect(34, 34, 444, 444);

  // Rosette center star
  ctx.fillStyle = '#d4af37';
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❖', 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Entry Orientation Plaque Texture for Zone 3
 */
export function createAchievementRoomIntroTexture(
  yearText: string,
  titleVi: string,
  descVi: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian bronze background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 600);
  bgGrad.addColorStop(0, '#14100c');
  bgGrad.addColorStop(0.5, '#1e1610');
  bgGrad.addColorStop(1, '#100c08');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 600);

  // 24K Gold double border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 1164, 564);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 1140, 540);

  // Category Tag
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(52, 46, 320, 40);
  ctx.fillStyle = '#100c08';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PHÂN KHU 3 • BẢNG VÀNG', 212, 66);

  // Year Badge
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(yearText, 1140, 66);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText(titleVi, 52, 150);

  // Divider
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(52, 175);
  ctx.lineTo(1148, 175);
  ctx.stroke();

  // Multi-line description (larger font for high legibility)
  ctx.fillStyle = '#f8fafc';
  ctx.font = '26px "Times New Roman", serif';
  const words = descVi.split(' ');
  let line = '';
  let y = 235;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 1080 && i > 0) {
      ctx.fillText(line, 52, y);
      line = words[i] + ' ';
      y += 44;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 52, y);

  // Footer prompt
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('✦ VÁCH A: DANH HIỆU & KHEN THƯỞNG  |  VÁCH B: THÀNH TỰU GIÁO DỤC 2025–2026 ✦', 600, 535);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Award Frame Canvas Texture for Wall A
 * Creates distinct color themes:
 * - labor_medals: Rich Crimson Accent
 * - prime_minister: Royal Navy & Gold Accent
 * - other: Heritage Indigo / Bronze Accent
 */
export function createAwardFrameTexture(award: AwardItem): THREE.Texture {
  if (award.customUrl) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(award.customUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1380;
  const ctx = canvas.getContext('2d')!;

  const isLabor = award.section === 'labor_medals';
  const isPrime = award.section === 'prime_minister';

  // 1. Velvet Background with Distinct Thematic Accent
  const grad = ctx.createLinearGradient(0, 0, 0, 1380);
  if (isLabor) {
    grad.addColorStop(0, '#2b1014');
    grad.addColorStop(0.35, '#3b161b');
    grad.addColorStop(0.7, '#220e11');
    grad.addColorStop(1, '#15090b');
  } else if (isPrime) {
    grad.addColorStop(0, '#101d36');
    grad.addColorStop(0.35, '#192b4f');
    grad.addColorStop(0.7, '#0f1a30');
    grad.addColorStop(1, '#09101f');
  } else {
    grad.addColorStop(0, '#111a28');
    grad.addColorStop(0.35, '#1b263b');
    grad.addColorStop(0.7, '#121c2c');
    grad.addColorStop(1, '#0a101b');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1380);

  // 2. Ornate 24K Heritage Gilded Outer & Inner Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, 976, 1332);

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(40, 40, 944, 1300);

  // Corner rosettes
  const corners = [
    [54, 54],
    [970, 54],
    [54, 1326],
    [970, 1326],
  ];
  ctx.fillStyle = '#d4af37';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Top Emblem / Badge Icon
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = '76px serif';
  const icon =
    award.badgeType === 'gold_medal'
      ? '🥇'
      : award.badgeType === 'silver_medal'
      ? '🥈'
      : award.badgeType === 'bronze_medal'
      ? '🥉'
      : award.badgeType === 'prime_minister'
      ? '🎖️'
      : award.badgeType === 'independence'
      ? '⭐'
      : award.badgeType === 'culture'
      ? '🎶'
      : award.badgeType === 'standard'
      ? '🏛️'
      : award.badgeType === 'phu_dong'
      ? '🏅'
      : '🚩';
  ctx.fillText(icon, 512, 130);

  // 4. Authority Label (Crisp, High Contrast)
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 24px monospace';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(award.authorityVi.toUpperCase(), 512, 185);

  // 5. Award Title in Majestic Large Gilded Serif (Extra Legible)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px "Cinzel", "Times New Roman", serif';
  ctx.fillText(award.titleVi.toUpperCase(), 512, 250);

  // Year Badge Pill (Prominent)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.fillRect(332, 280, 360, 48);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2;
  ctx.strokeRect(332, 280, 360, 48);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 26px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(`NĂM TRAO TẶNG: ${award.yearOrPeriod}`, 512, 304);
  ctx.textBaseline = 'alphabetic';

  // 6. Central Archival Image Placeholder Box
  const boxX = 56;
  const boxY = 355;
  const boxW = 912;
  const boxH = 490;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Dashed inner frame
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(255, 217, 136, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX + 18, boxY + 18, boxW - 36, boxH - 36);
  ctx.setLineDash([]);

  // Placeholder Icon
  ctx.fillStyle = '#d4af37';
  ctx.font = '84px serif';
  ctx.fillText('🖼️', 512, boxY + 175);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Cinzel", "Times New Roman", serif';
  ctx.fillText('KHUNG LƯU TRỮ HÌNH ẢNH DANH HIỆU', 512, boxY + 250);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('[ BẠN TRỰC TIẾP TẢI ẢNH LÊN TỪ CMD ]', 512, boxY + 310);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 18px "Times New Roman", serif';
  ctx.fillText('Hệ thống Cloud Storage đã kích hoạt sẵn sàng cho danh hiệu này', 512, boxY + 365);

  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.fillRect(256, boxY + 400, 512, 48);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(256, boxY + 400, 512, 48);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(`MÃ CMD: achievements.${award.id}`, 512, boxY + 424);
  ctx.textBaseline = 'alphabetic';

  // 7. Lead Narrative Box at Bottom (Larger Text)
  const leadBoxY = 875;
  const leadBoxH = 410;
  ctx.fillStyle = 'rgba(10, 16, 28, 0.85)';
  ctx.fillRect(boxX, leadBoxY, boxW, leadBoxH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, leadBoxY, boxW, leadBoxH);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Ý NGHĨA LỊCH SỬ & QUYẾT ĐỊNH:', boxX + 36, leadBoxY + 46);

  // Multi-line narrative (large 26px font)
  ctx.fillStyle = '#ffffff';
  ctx.font = '26px "Times New Roman", serif';
  const words = award.leadNarrativeVi.split(' ');
  let line = '';
  let lineY = leadBoxY + 95;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 840 && i > 0) {
      ctx.fillText(line, boxX + 36, lineY);
      line = words[i] + ' ';
      lineY += 40;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, boxX + 36, lineY);

  // Source / Legal Note
  if (award.sourceNoteVi) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillText(`Căn cứ tư liệu: ${award.sourceNoteVi}`, boxX + 36, leadBoxY + 365);
  }

  // Interactive hint
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN PHÍM E ĐỂ XEM HỒ SƠ & TẢI ẢNH ]', 512, 1325);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Academic Statistics Infographic Canvas Texture for Wall B
 * Distinct high-contrast themes for each statistical bay
 */
export function createAcademicStatisticTexture(stat: AcademicStatisticItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d')!;

  // Deep Navy Tech Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 0, 850);
  grad.addColorStop(0, '#0a1224');
  grad.addColorStop(0.5, '#12203d');
  grad.addColorStop(1, '#080d1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 850);

  // 24K Gold & Electric Cyan Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, 1160, 810);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(34, 34, 1132, 782);

  // Category Tag & Timeframe
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(52, 48, 320, 42);
  ctx.fillStyle = '#080d1a';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SỐ LIỆU ĐÃ KIỂM CHỨNG', 212, 69);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`✦ ${stat.timeframeVi.toUpperCase()} ✦`, 1140, 69);
  ctx.textBaseline = 'alphabetic';

  // Title in Large Gilded White
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText(stat.titleVi, 52, 142);

  // Divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(52, 162);
  ctx.lineTo(1148, 162);
  ctx.stroke();

  // Metrics Display Grid (Large Numbers)
  const metricsCount = stat.metrics.length;
  const isFour = metricsCount >= 4;
  const cardW = isFour ? 255 : 340;
  const cardH = 160;
  const startX = 52;
  const cardY = 185;
  const gap = isFour ? 25 : 38;

  stat.metrics.slice(0, 4).forEach((m, idx) => {
    const cx = startX + idx * (cardW + gap);

    // Card background
    ctx.fillStyle = m.highlight ? 'rgba(212, 175, 55, 0.22)' : 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(cx, cardY, cardW, cardH);
    ctx.strokeStyle = m.highlight ? '#ffd988' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = m.highlight ? 2.5 : 1.5;
    ctx.strokeRect(cx, cardY, cardW, cardH);

    // Metric Value (BIG number highlight)
    ctx.fillStyle = m.highlight ? '#ffd988' : '#38bdf8';
    ctx.font = 'bold 44px "Times New Roman", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.value, cx + cardW / 2, cardY + 65);

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(m.labelVi, cx + cardW / 2, cardY + 105);

    // Subtext
    if (m.subtextVi) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 14px sans-serif';
      ctx.fillText(m.subtextVi, cx + cardW / 2, cardY + 138);
    }
  });

  // Ranking Highlights Box
  const hlBoxY = 370;
  const hlBoxH = 240;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(52, hlBoxY, 1096, hlBoxH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, hlBoxY, 1096, hlBoxH);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('ĐIỂM NHẤN THÀNH TÍCH XÁC THỰC:', 80, hlBoxY + 40);

  stat.rankingHighlightsVi.slice(0, 4).forEach((item, idx) => {
    const itemY = hlBoxY + 84 + idx * 40;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('✦', 84, itemY);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px "Times New Roman", serif';
    ctx.fillText(item, 116, itemY);
  });

  // Source Note Box at Bottom
  const srcY = 635;
  const srcH = 125;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fillRect(52, srcY, 1096, srcH);
  ctx.strokeStyle = 'rgba(255, 217, 136, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, srcY, 1096, srcH);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('CĂN CỨ TƯ LIỆU:', 80, srcY + 36);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 18px "Times New Roman", serif';
  ctx.fillText(stat.sourceNoteVi, 80, srcY + 74);

  ctx.fillStyle = '#d4af37';
  ctx.font = '15px monospace';
  ctx.fillText('NGUỒN DỮ LIỆU CHÍNH THỨC • QUẢN LÝ QUA CMD ADMIN', 80, srcY + 106);

  // Interactive Hint
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN PHÍM E ĐỂ XEM BIỂU ĐỒ & BÁO CÁO TOÀN DIỆN ]', 600, 795);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Grand Rear Wall "ĐÀI VINH DANH" Texture (North Wall, Z = -15.9m)
 * Features 5 crowning milestones with dates, titles, and verification marks
 */
export function createDaiVinhDanhTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep Obsidian and Imperial Crimson Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#100c0a');
  grad.addColorStop(0.35, '#201214');
  grad.addColorStop(0.7, '#150a0d');
  grad.addColorStop(1, '#0c0708');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 24K Gold Triple Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, 2008, 984);

  ctx.strokeStyle = 'rgba(255, 217, 136, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1968, 944);

  // Top Crest & Title Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 24px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • 60 NĂM XÂY DỰNG VÀ TRƯỞNG THÀNH (1966–2026)', 1024, 85);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px "Cinzel", "Times New Roman", serif';
  ctx.fillText('ĐÀI VINH DANH • DANH HIỆU & THÀNH TỰU TIÊU BIỂU', 1024, 155);

  // Decorative Golden Divider with Laurel Star
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 185);
  ctx.lineTo(950, 185);
  ctx.moveTo(1098, 185);
  ctx.lineTo(1798, 185);
  ctx.stroke();

  ctx.fillStyle = '#ffd988';
  ctx.font = '36px serif';
  ctx.fillText('⭐', 1024, 195);

  // 5 Crowning Achievement Honor Bays
  const milestones = [
    {
      period: '1991 – 2000',
      title: 'TRỌN BỘ 3 HUÂN CHƯƠNG LAO ĐỘNG',
      subtitle: 'Hạng Ba (1991) • Hạng Nhì (1996) • Hạng Nhất (2000)',
      authority: 'Hội đồng Nhà nước & Chủ tịch nước',
      icon: '🥇',
      badge: 'CÔNG NHẬN CAO QUÝ',
    },
    {
      period: 'NĂM 2006',
      title: 'BẰNG KHEN THỦ TƯỚNG CHÍNH PHỦ',
      subtitle: 'Trao tặng dịp kỷ niệm 40 năm thành lập trường (1966–2006)',
      authority: 'Thủ tướng Chính phủ Nước CHXHCN Việt Nam',
      icon: '🎖️',
      badge: 'DẤU MỐC 40 NĂM',
    },
    {
      period: 'NĂM 2011',
      title: 'HUÂN CHƯƠNG ĐỘC LẬP HẠNG BA',
      subtitle: 'Phần thưởng cao quý ghi nhận đóng góp đặc biệt xuất sắc',
      authority: 'Chủ tịch nước CHXHCN Việt Nam',
      icon: '⭐',
      badge: 'HUÂN CHƯƠNG ĐỘC LẬP',
    },
    {
      period: '2025 – 2026',
      title: 'CỜ THI ĐUA CỦA CHÍNH PHỦ',
      subtitle: 'Đơn vị xuất sắc dẫn đầu phong trào thi đua dạy và học',
      authority: 'Chính phủ Nước CHXHCN Việt Nam',
      icon: '🚩',
      badge: 'DẪN ĐẦU THI ĐUA',
    },
    {
      period: '2025 – 2026',
      title: 'ĐỈNH CAO THÀNH TỰU HỌC THUẬT & STEM',
      subtitle: '39/39 giải HSG Tỉnh • Nhất KHKT 3 năm • Top 8/143 Tốt nghiệp',
      authority: 'Sở GD&ĐT & Bộ GD&ĐT',
      icon: '🏆',
      badge: 'CHẤT LƯỢNG HÀNG ĐẦU',
    },
  ];

  const colW = 360;
  const colH = 640;
  const colY = 225;
  const startX = 74;
  const gap = 25;

  milestones.forEach((m, idx) => {
    const cx = startX + idx * (colW + gap);

    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(cx, colY, colW, colH);
    ctx.strokeStyle = idx === 1 ? '#ffd988' : 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = idx === 1 ? 3 : 2;
    ctx.strokeRect(cx, colY, colW, colH);

    // Badge Pill
    ctx.fillStyle = idx === 1 ? '#d4af37' : 'rgba(212, 175, 55, 0.25)';
    ctx.fillRect(cx + 20, colY + 20, colW - 40, 36);
    ctx.fillStyle = idx === 1 ? '#000000' : '#ffd988';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.badge, cx + colW / 2, colY + 38);
    ctx.textBaseline = 'alphabetic';

    // Icon
    ctx.font = '64px serif';
    ctx.fillText(m.icon, cx + colW / 2, colY + 120);

    // Period
    ctx.fillStyle = '#ffd988';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(m.period, cx + colW / 2, colY + 165);

    // Title (multi-line)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Cinzel", "Times New Roman", serif';
    const words = m.title.split(' ');
    let line = '';
    let ty = colY + 215;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > colW - 40 && i > 0) {
        ctx.fillText(line, cx + colW / 2, ty);
        line = words[i] + ' ';
        ty += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, cx + colW / 2, ty);

    // Subtitle
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 16px "Times New Roman", serif';
    const subWords = m.subtitle.split(' ');
    let sline = '';
    let sty = ty + 35;
    for (let i = 0; i < subWords.length; i++) {
      const test = sline + subWords[i] + ' ';
      if (ctx.measureText(test).width > colW - 40 && i > 0) {
        ctx.fillText(sline, cx + colW / 2, sty);
        sline = subWords[i] + ' ';
        sty += 24;
      } else {
        sline = test;
      }
    }
    ctx.fillText(sline, cx + colW / 2, sty);

    // Central Image Upload Slot inside Card
    const imgSlotY = colY + 380;
    const imgSlotH = 170;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(cx + 20, imgSlotY, colW - 40, imgSlotH);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx + 20, imgSlotY, colW - 40, imgSlotH);

    ctx.fillStyle = '#ffd988';
    ctx.font = '36px serif';
    ctx.fillText('🖼️', cx + colW / 2, imgSlotY + 60);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 14px "Cinzel", serif';
    ctx.fillText('TƯ LIỆU ẢNH LƯU TRỮ', cx + colW / 2, imgSlotY + 100);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('Tải ảnh thực tế qua CMD Admin', cx + colW / 2, imgSlotY + 130);

    // Authority Tag at bottom
    ctx.fillStyle = '#ffd988';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Cấp trao tặng: ${m.authority}`, cx + colW / 2, colY + 595);
  });

  // Footer prompt
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('✦ NHẤP VÀO ĐÀI VINH DANH ĐỂ XEM HỒ SƠ TOÀN BỘ CÁC DANH HIỆU TIÊU BIỂU ✦', 1024, 935);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Dedicated 3D Plaque Texture for "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"
 */
export function createCataloguePlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Gilded Navy Background
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0c1626');
  grad.addColorStop(0.5, '#182b48');
  grad.addColorStop(1, '#091120');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // 24K Gold Frame
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, 992, 480);
  ctx.strokeStyle = 'rgba(255, 217, 136, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 968, 456);

  ctx.textAlign = 'center';

  // Badge
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(312, 42, 400, 36);
  ctx.fillStyle = '#091120';
  ctx.font = 'bold 16px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('HỆ THỐNG TRA CỨU DANH MỤC ĐIỆN TỬ', 512, 60);
  ctx.textBaseline = 'alphabetic';

  // Title (Prompt Requirement Label)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Cinzel", "Times New Roman", serif';
  ctx.fillText('XEM TOÀN BỘ HUÂN CHƯƠNG,', 512, 140);
  ctx.fillText('HUY CHƯƠNG VÀ KHEN THƯỞNG', 512, 185);

  // Subtitle
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '18px "Times New Roman", serif';
  ctx.fillText('Tra cứu toàn diện các danh hiệu của Đảng, Nhà nước, Bộ ngành và các thế hệ', 512, 235);
  ctx.fillText('Hỗ trợ tìm kiếm, lọc theo phân loại và xem ảnh tư liệu gốc độ phân giải cao', 512, 268);

  // Big Interactive Button Pill
  ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.fillRect(212, 320, 600, 64);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(212, 320, 600, 64);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 24px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('📖 NHẤP VÀO ĐÂY ĐỂ MỞ DANH MỤC', 512, 352);
  ctx.textBaseline = 'alphabetic';

  // CMD admin note
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px monospace';
  ctx.fillText('✦ Có thể mở rộng số lượng danh hiệu liên tục qua CMD Admin ✦', 512, 445);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Flush Floor Commemorative Medallion Texture (Embedded flat into floor at Y = 0.005)
 * Completely eliminates tripping obstruction!
 */
export function createCentralHonorDaisTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#140e0a';
  ctx.fillRect(0, 0, 1024, 1024);

  const centerX = 512;
  const centerY = 512;

  // Concentric Gold Rings
  [480, 440, 390, 310, 240, 160].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? '#d4af37' : '#ffd988';
    ctx.lineWidth = idx === 0 ? 12 : idx === 2 ? 6 : 3;
    ctx.stroke();
  });

  // Radiating rays
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * 160, centerY + Math.sin(angle) * 160);
    ctx.lineTo(centerX + Math.cos(angle) * 440, centerY + Math.sin(angle) * 440);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 12 Laurel Leaves around circle
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const lx = centerX + Math.cos(angle) * 350;
    const ly = centerY + Math.sin(angle) * 350;
    ctx.fillStyle = '#ffd988';
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌿', lx, ly);
  }

  // Center 60 Years Star
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#140e0a';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 136, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BẢNG VÀNG', centerX, centerY - 32);

  ctx.font = 'bold 42px monospace';
  ctx.fillText('60 NĂM', centerX, centerY + 18);

  ctx.font = 'bold 16px monospace';
  ctx.fillText('1966 – 2026', centerX, centerY + 62);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Exhibition Texture for "DẤU ẤN VĂN HÓA — VĂN NGHỆ" (Empty Wall Section A)
 * Wall B, Bay 5 (Z = -6.0m)
 */
export function createCulturalArtisticTexture(item: CulturalArtisticItem): THREE.Texture {
  if (item.customUrl) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(item.customUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d')!;

  // Deep Imperial Indigo/Wine Background
  const grad = ctx.createLinearGradient(0, 0, 0, 850);
  grad.addColorStop(0, '#1c101c');
  grad.addColorStop(0.4, '#28142a');
  grad.addColorStop(0.7, '#180d1a');
  grad.addColorStop(1, '#0c070d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 850);

  // 24K Gold & Magenta Heritage Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, 1160, 810);

  ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(34, 34, 1132, 782);

  // Category Tag
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(52, 48, 380, 42);
  ctx.fillStyle = '#0c070d';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VĂN HÓA • VĂN NGHỆ • PHONG TRÀO', 242, 69);

  // Timeframe Tag
  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('✦ 1974 – 2026 ✦', 1140, 69);
  ctx.textBaseline = 'alphabetic';

  // Title: "DẤU ẤN VĂN HÓA — VĂN NGHỆ"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText(item.titleVi, 52, 142);

  // Divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(52, 162);
  ctx.lineTo(1148, 162);
  ctx.stroke();

  // Primary Highlight Card: "Tiếng hát át tiếng bom" (1974-1975)
  const featY = 185;
  const featH = 200;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.16)';
  ctx.fillRect(52, featY, 1096, featH);
  ctx.strokeStyle = '#ffd988';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(52, featY, 1096, featH);

  // Left Icon & Badge
  ctx.fillStyle = '#ffd988';
  ctx.font = '54px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎶', 120, featY + 95);

  ctx.fillStyle = '#d4af37';
  ctx.fillRect(68, featY + 125, 104, 32);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('BẰNG KHEN', 120, featY + 141);
  ctx.textBaseline = 'alphabetic';

  // Card Content
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('MỐC SON LỊCH SỬ KHÁNG CHIẾN • NĂM HỌC 1974–1975', 195, featY + 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Cinzel", "Times New Roman", serif';
  ctx.fillText('PHONG TRÀO "TIẾNG HÁT ÁT TIẾNG BOM" — BỘ VĂN HÓA TẶNG BẰNG KHEN', 195, featY + 85);

  ctx.fillStyle = '#fce7f3';
  ctx.font = '22px "Times New Roman", serif';
  ctx.fillText(
    'Sự ghi nhận trang trọng của Bộ Văn hóa đối với tinh thần lạc quan cách mạng, lời ca tiếng hát vượt lên mưa bom bão đạn,',
    195,
    featY + 125
  );
  ctx.fillText(
    'thắp sáng ngọn lửa yêu nước và niềm tin tất thắng của thầy và trò Trường Cấp 3 Trần Hưng Đạo.',
    195,
    featY + 160
  );

  // Bottom Section: Left (Key Points) & Right (Photo Upload Placeholder)
  const botY = 410;
  const botH = 345;
  const leftW = 680;

  // Key Traditions List Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fillRect(52, botY, leftW, botH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, botY, leftW, botH);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('TRUYỀN THỐNG VĂN HÓA & PHONG TRÀO HỌC ĐƯỜNG:', 76, botY + 40);

  item.keyPointsVi.forEach((pt, pIdx) => {
    const py = botY + 85 + pIdx * 70;
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('✦', 76, py);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Times New Roman", serif';
    const words = pt.split(' ');
    let line = '';
    let curY = py;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > leftW - 70 && i > 0) {
        ctx.fillText(line, 102, curY);
        line = words[i] + ' ';
        curY += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 102, curY);
  });

  // Right Photo Placeholder Box (CMD Image Upload Slot)
  const rightX = 52 + leftW + 24;
  const rightW = 1096 - leftW - 24;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(rightX, botY, rightW, botH);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rightX, botY, rightW, botH);

  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(255, 217, 136, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rightX + 14, botY + 14, rightW - 28, botH - 28);
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = '54px serif';
  ctx.fillText('📷', rightX + rightW / 2, botY + 105);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Cinzel", "Times New Roman", serif';
  ctx.fillText('HÌNH ẢNH TƯ LIỆU VĂN NGHỆ', rightX + rightW / 2, botY + 165);

  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('[ BẠN TẢI ẢNH QUA CMD ]', rightX + rightW / 2, botY + 205);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 14px "Times New Roman", serif';
  ctx.fillText('Lưu trữ trên Firebase Storage', rightX + rightW / 2, botY + 240);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('Mã: achievements.cultural_artistic', rightX + rightW / 2, botY + 295);

  // Footer Prompt
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN PHÍM E ĐỂ XEM HỒ SƠ CHI TIẾT & TẢI ẢNH ]', 600, 795);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Exhibition Texture for "DẤU ẤN TẠI CÁC SÂN CHƠI LIÊN TRƯỜNG VÀ CẤP NGÀNH" (Empty Wall Section B)
 * Wall B, Bay 6 (Z = -10.0m)
 * Clean text-based layout, no image uploads required.
 */
export function createExternalCompetitionsTexture(item: ExternalCompetitionsItem): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d')!;

  // Deep Sapphire & Charcoal Tech Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 850);
  grad.addColorStop(0, '#0a1628');
  grad.addColorStop(0.4, '#13233c');
  grad.addColorStop(0.7, '#0c182b');
  grad.addColorStop(1, '#060d17');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 850);

  // 24K Gold & Cyan High-Precision Border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, 1160, 810);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(34, 34, 1132, 782);

  // Category Tag
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(52, 48, 420, 42);
  ctx.fillStyle = '#060d17';
  ctx.font = 'bold 17px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SÂN CHƠI MỞ RỘNG • CẤP NGÀNH & ĐẠI HỌC', 262, 69);

  // Timeframe Tag
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('✦ 2023 – 2026 ✦', 1140, 69);
  ctx.textBaseline = 'alphabetic';

  // Title: "DẤU ẤN TẠI CÁC SÂN CHƠI LIÊN TRƯỜNG VÀ CẤP NGÀNH"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText(item.titleVi, 52, 142);

  // Divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(52, 162);
  ctx.lineTo(1148, 162);
  ctx.stroke();

  // Clean Text-Based Competition Records Grid (4 Cards)
  const cardW = 536;
  const cardH = 265;
  const positions = [
    { x: 52, y: 185 },
    { x: 612, y: 185 },
    { x: 52, y: 470 },
    { x: 612, y: 470 },
  ];

  item.records.slice(0, 4).forEach((rec, idx) => {
    const pos = positions[idx];
    const isUpdating = rec.status === 'updating';

    // Card background
    ctx.fillStyle = isUpdating ? 'rgba(15, 23, 42, 0.65)' : 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(pos.x, pos.y, cardW, cardH);
    ctx.strokeStyle = isUpdating ? 'rgba(148, 163, 184, 0.35)' : 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = isUpdating ? 1.5 : 2;
    ctx.strokeRect(pos.x, pos.y, cardW, cardH);

    // Header Pill (Year & Organizer)
    ctx.fillStyle = isUpdating ? 'rgba(148, 163, 184, 0.15)' : 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(pos.x + 16, pos.y + 16, cardW - 32, 34);

    ctx.fillStyle = isUpdating ? '#94a3b8' : '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(rec.yearParticipated.toUpperCase(), pos.x + 28, pos.y + 33);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Đơn vị: ${rec.organizerVi}`, pos.x + cardW - 28, pos.y + 33);
    ctx.textBaseline = 'alphabetic';

    // Competition Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Cinzel", "Times New Roman", serif';
    const words = rec.programNameVi.split(' ');
    let line = '';
    let ty = pos.y + 82;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > cardW - 36 && i > 0) {
        ctx.fillText(line, pos.x + 20, ty);
        line = words[i] + ' ';
        ty += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, pos.x + 20, ty);

    // Award / Result Highlight
    const resY = pos.y + 155;
    ctx.fillStyle = isUpdating ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.22)';
    ctx.fillRect(pos.x + 16, resY, cardW - 32, 40);
    ctx.strokeStyle = isUpdating ? 'rgba(212, 175, 55, 0.3)' : '#ffd988';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pos.x + 16, resY, cardW - 32, 40);

    ctx.fillStyle = isUpdating ? '#ffd988' : '#ffd988';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`✦ KẾT QUẢ: ${rec.resultOrAwardVi.toUpperCase()} ✦`, pos.x + cardW / 2, resY + 20);
    ctx.textBaseline = 'alphabetic';

    // Short Description
    if (rec.shortDescriptionVi) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 16px "Times New Roman", serif';
      const descWords = rec.shortDescriptionVi.split(' ');
      let dLine = '';
      let dy = resY + 65;
      for (let i = 0; i < descWords.length; i++) {
        const test = dLine + descWords[i] + ' ';
        if (ctx.measureText(test).width > cardW - 36 && i > 0) {
          ctx.fillText(dLine, pos.x + 20, dy);
          dLine = descWords[i] + ' ';
          dy += 22;
        } else {
          dLine = test;
        }
      }
      ctx.fillText(dLine, pos.x + 20, dy);
    }
  });

  // Footer Prompt
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('[ NHẤP HOẶC NHẤN PHÍM E ĐỂ XEM HỒ SƠ CHI TIẾT & CẬP NHẬT QUA CMD ]', 600, 795);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

