import * as THREE from 'three';
import {
  GratitudeEssayData,
  EntranceIntroData,
  TeacherItem,
  MomentItem,
} from '../config/memoryContentData';

/**
 * Procedural Canvas Texture Generator for Gratitude & Memories Room
 * Faithful to Reference Architecture (image_bcc828e9.png):
 * - Light natural oak wood floor planks with subtle grain
 * - Warm honey-oak / natural wood for slat ceiling & horizontal display bands
 * - Honed warm light-gray / beige limestone/sandstone wall panels with architectural shadow reveal joints
 * - Neutral woven linen / oatmeal area rug
 * - Restrained dark graphite / charcoal section header plaques with crisp white typography
 * - Framed gallery photograph displays with dark slim frames & captions
 * - Grand central dedication essay plaque for Wall 3
 */

// Helper to wrap text with custom line height and optional max lines
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 999
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines) return currentY;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

// 1. Honed Warm Light-Gray / Beige Stone Wall with Horizontal Reveal Joints
export function createHonedStoneWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base warm light-gray / beige stone (#DED8CE to #E6E1D8)
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#E3DFD7');
  grad.addColorStop(0.35, '#DFDAD1');
  grad.addColorStop(0.7, '#D9D3C9');
  grad.addColorStop(1, '#DDD7CE');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro stone speckle noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Architectural horizontal shadow reveal joints (like the large stone panels in the photo)
  const jointYs = [0, 256, 512, 768, 1024];
  jointYs.forEach((y) => {
    // Soft dark shadow groove
    ctx.strokeStyle = 'rgba(70, 65, 58, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Subtle bottom highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(1024, y + 2);
    ctx.stroke();
  });

  // Vertical staggered panel joints (sparse)
  const vJoints = [
    { x: 512, y1: 0, y2: 256 },
    { x: 340, y1: 256, y2: 512 },
    { x: 780, y1: 256, y2: 512 },
    { x: 512, y1: 512, y2: 768 },
    { x: 260, y1: 768, y2: 1024 },
    { x: 720, y1: 768, y2: 1024 },
  ];
  vJoints.forEach((j) => {
    ctx.strokeStyle = 'rgba(80, 75, 68, 0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(j.x, j.y1);
    ctx.lineTo(j.x, j.y2);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

// 2. Light Natural Oak Timber Floor Planks
export function createOakWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base warm oak timber color
  ctx.fillStyle = '#D6BC98';
  ctx.fillRect(0, 0, 1024, 1024);

  // Planks running vertically (along the room's length)
  const plankWidth = 128; // 8 planks per repeat
  for (let x = 0; x < 1024; x += plankWidth) {
    // Subtle plank color variance
    const plankTone = Math.sin(x * 0.05) * 12;
    const r = Math.round(214 + plankTone + (Math.random() - 0.5) * 6);
    const g = Math.round(188 + plankTone * 0.9 + (Math.random() - 0.5) * 6);
    const b = Math.round(152 + plankTone * 0.8 + (Math.random() - 0.5) * 6);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, 0, plankWidth, 1024);

    // Subtle longitudinal wood grain lines
    ctx.strokeStyle = `rgba(160, 130, 95, 0.2)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const gx = x + 10 + i * 16 + (Math.random() - 0.5) * 4;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.bezierCurveTo(
        gx + Math.sin(i) * 6,
        340,
        gx - Math.cos(i) * 6,
        680,
        gx,
        1024
      );
      ctx.stroke();
    }

    // Plank seam / bevel groove
    ctx.strokeStyle = 'rgba(75, 55, 35, 0.38)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    // Subtle highlight on right bevel of plank
    ctx.strokeStyle = 'rgba(255, 245, 230, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 2, 0);
    ctx.lineTo(x + 2, 1024);
    ctx.stroke();

    // Staggered butt joints across length
    const buttY = ((x * 37) % 800) + 120;
    ctx.strokeStyle = 'rgba(75, 55, 35, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, buttY);
    ctx.lineTo(x + plankWidth, buttY);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 6);
  return texture;
}

// 3. Medium-Brown Honey Oak for Horizontal Display Band & Ceiling Woodwork
export function createHoneyWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm medium-brown honey teak base (#B5824E to #A26E3A)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#BC8A55');
  grad.addColorStop(0.5, '#AF7B46');
  grad.addColorStop(1, '#9E6A36');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Horizontal wood grain streaks
  for (let y = 0; y < 512; y += 4) {
    const alpha = 0.08 + Math.random() * 0.12;
    const tone = Math.random() > 0.5 ? 'rgba(70, 40, 15, ' : 'rgba(235, 185, 130, ';
    ctx.strokeStyle = tone + alpha + ')';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      340,
      y + (Math.random() - 0.5) * 6,
      680,
      y + (Math.random() - 0.5) * 6,
      1024,
      y
    );
    ctx.stroke();
  }

  // Soft wood panel seams
  for (let y = 128; y < 512; y += 128) {
    ctx.strokeStyle = 'rgba(50, 25, 10, 0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

// 4. Neutral Oatmeal / Linen Area Rug Texture (from reference image)
export function createNeutralRugTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base woven oatmeal tone (#E2DDD5)
  ctx.fillStyle = '#E3DDD4';
  ctx.fillRect(0, 0, 512, 512);

  // Cross-hatch fabric weave
  ctx.fillStyle = 'rgba(195, 185, 172, 0.35)';
  for (let x = 0; x < 512; x += 4) {
    ctx.fillRect(x, 0, 2, 512);
  }
  ctx.fillStyle = 'rgba(180, 170, 155, 0.3)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 2);
  }

  // Subtle clean woven border
  ctx.strokeStyle = 'rgba(160, 150, 135, 0.5)';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 504);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// 5. WALL 1: Dark Graphite Section Header Plaque ("NHỮNG NGƯỜI LÁI ĐÒ")
// Inspired by the "Path of Challenge" dark vertical block in the reference image
// Shared image cache to prevent redundant re-fetching and memory leaks
const memoryImageCache = new Map<string, HTMLImageElement>();

// 5. WALL 1: Dark Graphite Section Header Plaque ("NHỮNG NGƯỜI LÁI ĐÒ")
export function drawWall1SectionHeaderCanvas(
  canvas: HTMLCanvasElement,
  title: string,
  subtitle: string
): void {
  const ctx = canvas.getContext('2d')!;

  // Dark graphite / anodized charcoal background (#23262B)
  const bg = ctx.createLinearGradient(0, 0, 0, 1000);
  bg.addColorStop(0, '#272B32');
  bg.addColorStop(0.5, '#1E2126');
  bg.addColorStop(1, '#181A1E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1000);

  // Subtle beveled inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 768, 968);

  // Modern angled accent line (reference feature)
  ctx.strokeStyle = '#D4AF37'; // Heritage champagne gold accent
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 120);
  ctx.lineTo(260, 120);
  ctx.lineTo(340, 80);
  ctx.stroke();

  // Section index
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('01 // VÁCH TẢ', 80, 170);

  // Main Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Noto Serif", Georgia, serif';
  wrapText(ctx, title || 'NHỮNG NGƯỜI LÁI ĐÒ', 80, 240, 640, 56, 2);

  // Subtitle in Korean/Vietnamese modern dual style
  ctx.fillStyle = '#C8CCD2';
  ctx.font = '500 24px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, subtitle || 'Tôn vinh các thế hệ cán bộ giáo viên, người thầy khai sáng', 80, 360, 640, 36, 3);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 480);
  ctx.lineTo(720, 480);
  ctx.stroke();

  // Curatorial narrative description
  ctx.fillStyle = '#A4ACB8';
  ctx.font = '400 20px "Be Vietnam Pro", sans-serif';
  const narrative =
    'Không gian vinh danh các thế hệ thầy cô giáo, cán bộ quản lý và hội đồng sư phạm nhà trường qua 60 năm xây dựng và phát triển. Mỗi chân dung là một tấm gương cống hiến thầm lặng, dẫn dắt bao thế hệ học sinh cập bến tri thức.';
  wrapText(ctx, narrative, 80, 540, 640, 34, 6);

  // Museum catalog mark at bottom
  ctx.fillStyle = '#7C8492';
  ctx.font = 'bold 15px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • 1966–2026', 80, 890);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText('« Nhấp vào từng khung ảnh để xem tư liệu chi tiết »', 80, 930);
}

export function createWall1SectionHeaderTexture(
  title: string,
  subtitle: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  drawWall1SectionHeaderCanvas(canvas, title, subtitle);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function updateWall1SectionHeaderTexture(
  texture: THREE.CanvasTexture,
  title: string,
  subtitle: string
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;
  drawWall1SectionHeaderCanvas(canvas, title, subtitle);
  texture.needsUpdate = true;
}

// 6. WALL 2: Dark Graphite Section Header Plaque ("NHỮNG KHOẢNH KHẮC KHÔNG QUÊN")
export function drawWall2SectionHeaderCanvas(
  canvas: HTMLCanvasElement,
  title: string,
  subtitle: string
): void {
  const ctx = canvas.getContext('2d')!;

  // Dark graphite background
  const bg = ctx.createLinearGradient(0, 0, 0, 1000);
  bg.addColorStop(0, '#272B32');
  bg.addColorStop(0.5, '#1E2126');
  bg.addColorStop(1, '#181A1E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1000);

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 768, 968);

  // Modern angled accent line
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 120);
  ctx.lineTo(260, 120);
  ctx.lineTo(340, 80);
  ctx.stroke();

  // Section index
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('02 // VÁCH HỮU', 80, 170);

  // Main Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Noto Serif", Georgia, serif';
  wrapText(ctx, title || 'NHỮNG KHOẢNH KHẮC KHÔNG QUÊN', 80, 240, 640, 56, 2);

  // Subtitle
  ctx.fillStyle = '#C8CCD2';
  ctx.font = '500 24px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, subtitle || 'Ký ức thầy trò, hình ảnh lớp học và những kỷ niệm sâu sắc', 80, 360, 640, 36, 3);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 480);
  ctx.lineTo(720, 480);
  ctx.stroke();

  // Curatorial narrative description
  ctx.fillStyle = '#A4ACB8';
  ctx.font = '400 20px "Be Vietnam Pro", sans-serif';
  const narrative =
    'Lưu giữ những khoảnh khắc quý báu về tình cảm thầy trò, những lớp học hầm hào sơ tán thời chiến, giờ sinh hoạt chào cờ, tiết học thực nghiệm và những nụ cười rạng rỡ của thanh xuân dưới mái trường thân yêu.';
  wrapText(ctx, narrative, 80, 540, 640, 34, 6);

  // Museum catalog mark at bottom
  ctx.fillStyle = '#7C8492';
  ctx.font = 'bold 15px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • KÝ ỨC THẦY TRÒ', 80, 890);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText('« Nhấp vào từng khung ảnh để xem câu chuyện kỷ niệm »', 80, 930);
}

export function createWall2SectionHeaderTexture(
  title: string,
  subtitle: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  drawWall2SectionHeaderCanvas(canvas, title, subtitle);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function updateWall2SectionHeaderTexture(
  texture: THREE.CanvasTexture,
  title: string,
  subtitle: string
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;
  drawWall2SectionHeaderCanvas(canvas, title, subtitle);
  texture.needsUpdate = true;
}

// 7. Teacher Frame Display Texture (Mounted on Wood Band)
export function drawTeacherFrameCanvas(
  canvas: HTMLCanvasElement,
  teacher: TeacherItem,
  customImage?: HTMLImageElement | HTMLCanvasElement | null
): void {
  const ctx = canvas.getContext('2d')!;

  // Dark matte passe-partout / frame interior (#1C1E23)
  ctx.fillStyle = '#1B1D22';
  ctx.fillRect(0, 0, 720, 540);

  // Slim border
  ctx.strokeStyle = '#32363E';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 712, 532);

  // Inner Photo Matte (#F4EFE6 warm gallery card)
  const photoX = 24;
  const photoY = 24;
  const photoW = 672;
  const photoH = 350;

  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const img = customImage;
  const hasImg =
    img &&
    ((img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0) ||
      (img instanceof HTMLCanvasElement && img.width > 0));

  if (hasImg) {
    // Preserve frame architecture: composite photograph inside inner card with cover aspect ratio
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    const imgW = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
    const imgH = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

    const scale = Math.max(photoW / imgW, photoH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = photoX + (photoW - drawW) / 2;
    const drawY = photoY + (photoH - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    // Subtle photo vignette / inner frame
    ctx.strokeStyle = 'rgba(120, 100, 80, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(34, 34, 652, 330);

    // Portrait silhouette icon (warm sepia / charcoal)
    ctx.fillStyle = 'rgba(70, 55, 45, 0.15)';
    ctx.beginPath();
    ctx.arc(360, 160, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(360, 340, 120, Math.PI, 0);
    ctx.fill();
  }

  // Border around photo area
  ctx.strokeStyle = 'rgba(120, 100, 80, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Year Badge in photo corner
  ctx.fillStyle = '#1E232B';
  ctx.beginPath();
  ctx.roundRect(46, 46, 170, 32, 6);
  ctx.fill();
  ctx.fillStyle = '#E5C778';
  ctx.font = 'bold 16px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(teacher.period || '1966–2026', 131, 68);

  // Metadata Lower Bar (Crisp typography matching reference)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Noto Serif", Georgia, serif';
  wrapText(ctx, teacher.title, 32, 420, 656, 28, 2);

  if (teacher.role) {
    ctx.fillStyle = '#D4AF37';
    ctx.font = '500 16px "Be Vietnam Pro", sans-serif';
    ctx.fillText(teacher.role, 32, 485);
  }

  // Click prompt
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8B93A0';
  ctx.font = 'bold 14px "Be Vietnam Pro", monospace';
  ctx.fillText('CHI TIẾT ↗', 688, 485);
}

export function createTeacherFrameTexture(teacher: TeacherItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 540;

  let cachedImg: HTMLImageElement | null = null;
  if (teacher.customUrl) {
    const existing = memoryImageCache.get(teacher.customUrl);
    if (existing && existing.complete && existing.naturalWidth > 0) {
      cachedImg = existing;
    }
  }

  drawTeacherFrameCanvas(canvas, teacher, cachedImg);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (teacher.customUrl && !cachedImg) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      memoryImageCache.set(teacher.customUrl!, img);
      drawTeacherFrameCanvas(canvas, teacher, img);
      texture.needsUpdate = true;
    };
    img.src = teacher.customUrl;
  }

  return texture;
}

export function updateTeacherFrameTexture(
  texture: THREE.CanvasTexture,
  teacher: TeacherItem
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;

  let cachedImg: HTMLImageElement | null = null;
  if (teacher.customUrl) {
    const existing = memoryImageCache.get(teacher.customUrl);
    if (existing && existing.complete && existing.naturalWidth > 0) {
      cachedImg = existing;
    }
  }

  drawTeacherFrameCanvas(canvas, teacher, cachedImg);
  texture.needsUpdate = true;

  if (teacher.customUrl && !cachedImg) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      memoryImageCache.set(teacher.customUrl!, img);
      drawTeacherFrameCanvas(canvas, teacher, img);
      texture.needsUpdate = true;
    };
    img.src = teacher.customUrl;
  }
}

// 8. Moment Frame Display Texture (Mounted on Wood Band)
export function drawMomentFrameCanvas(
  canvas: HTMLCanvasElement,
  moment: MomentItem,
  customImage?: HTMLImageElement | HTMLCanvasElement | null
): void {
  const ctx = canvas.getContext('2d')!;

  // Dark matte interior
  ctx.fillStyle = '#1B1D22';
  ctx.fillRect(0, 0, 720, 540);

  // Slim border
  ctx.strokeStyle = '#32363E';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 712, 532);

  // Inner Photo Area (#F4EFE6)
  const photoX = 24;
  const photoY = 24;
  const photoW = 672;
  const photoH = 350;

  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const img = customImage;
  const hasImg =
    img &&
    ((img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0) ||
      (img instanceof HTMLCanvasElement && img.width > 0));

  if (hasImg) {
    // Preserve frame architecture: composite photograph inside inner card with cover aspect ratio
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    const imgW = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
    const imgH = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

    const scale = Math.max(photoW / imgW, photoH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = photoX + (photoW - drawW) / 2;
    const drawY = photoY + (photoH - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    ctx.strokeStyle = 'rgba(120, 100, 80, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(34, 34, 652, 330);

    // Camera / Memory icon placeholder
    ctx.fillStyle = 'rgba(70, 55, 45, 0.18)';
    ctx.beginPath();
    ctx.roundRect(280, 140, 160, 110, 14);
    ctx.fill();

    ctx.fillStyle = 'rgba(244, 239, 230, 0.9)';
    ctx.beginPath();
    ctx.arc(360, 195, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  // Border around photo area
  ctx.strokeStyle = 'rgba(120, 100, 80, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // School Year badge
  ctx.fillStyle = '#1E232B';
  ctx.beginPath();
  ctx.roundRect(46, 46, 170, 32, 6);
  ctx.fill();
  ctx.fillStyle = '#E5C778';
  ctx.font = 'bold 16px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(moment.schoolYear || 'Ký ức', 131, 68);

  // Metadata Lower Bar
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Noto Serif", Georgia, serif';
  wrapText(ctx, moment.title, 32, 420, 656, 28, 2);

  ctx.fillStyle = '#C2C8D2';
  ctx.font = '400 15px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, moment.caption, 32, 482, 540, 20, 1);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#8B93A0';
  ctx.font = 'bold 14px "Be Vietnam Pro", monospace';
  ctx.fillText('XEM ẢNH ↗', 688, 485);
}

export function createMomentFrameTexture(moment: MomentItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 540;

  let cachedImg: HTMLImageElement | null = null;
  if (moment.customUrl) {
    const existing = memoryImageCache.get(moment.customUrl);
    if (existing && existing.complete && existing.naturalWidth > 0) {
      cachedImg = existing;
    }
  }

  drawMomentFrameCanvas(canvas, moment, cachedImg);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (moment.customUrl && !cachedImg) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      memoryImageCache.set(moment.customUrl!, img);
      drawMomentFrameCanvas(canvas, moment, img);
      texture.needsUpdate = true;
    };
    img.src = moment.customUrl;
  }

  return texture;
}

export function updateMomentFrameTexture(
  texture: THREE.CanvasTexture,
  moment: MomentItem
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;

  let cachedImg: HTMLImageElement | null = null;
  if (moment.customUrl) {
    const existing = memoryImageCache.get(moment.customUrl);
    if (existing && existing.complete && existing.naturalWidth > 0) {
      cachedImg = existing;
    }
  }

  drawMomentFrameCanvas(canvas, moment, cachedImg);
  texture.needsUpdate = true;

  if (moment.customUrl && !cachedImg) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      memoryImageCache.set(moment.customUrl!, img);
      drawMomentFrameCanvas(canvas, moment, img);
      texture.needsUpdate = true;
    };
    img.src = moment.customUrl;
  }
}

// 9. WALL 3: Grand Dedication Essay Plaque ("TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ")
export function drawDedicationEssayCanvas(
  canvas: HTMLCanvasElement,
  essay: GratitudeEssayData
): void {
  const ctx = canvas.getContext('2d')!;

  // Refined architectural warm ivory panel background with subtle gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 1440);
  bg.addColorStop(0, '#FAF7F0');
  bg.addColorStop(0.5, '#F5EFE4');
  bg.addColorStop(1, '#EDE4D4');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 1440);

  // Dark graphite & champagne gold architectural border
  ctx.strokeStyle = '#23262D';
  ctx.lineWidth = 14;
  ctx.strokeRect(28, 28, 1992, 1384);

  ctx.strokeStyle = '#C99E4B';
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 46, 1956, 1348);

  // Header decorative badge
  ctx.fillStyle = '#1D2128';
  ctx.beginPath();
  ctx.roundRect(624, 76, 800, 52, 10);
  ctx.fill();

  ctx.fillStyle = '#E5C778';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • 1966–2026', 1024, 108);

  // Title: "TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ"
  ctx.fillStyle = '#8B2121'; // Deep dignified lacquer crimson
  ctx.font = 'bold 64px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(essay.title || 'TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ', 1024, 215);

  // Subtitle
  ctx.fillStyle = '#55422E';
  ctx.font = '600 28px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(essay.subtitle || '', 1024, 275);

  // Champagne Gold Accent Divider
  ctx.strokeStyle = '#C99E4B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(380, 315);
  ctx.lineTo(1668, 315);
  ctx.stroke();

  // Essay Paragraphs (Refined Vietnamese Typography)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2A2E35';
  ctx.font = '400 24px "Be Vietnam Pro", sans-serif';

  let textY = 370;
  const maxWidth = 1680;
  const lineHeight = 38;

  if (essay.paragraphs && Array.isArray(essay.paragraphs)) {
    essay.paragraphs.forEach((p) => {
      textY = wrapText(ctx, p, 184, textY, maxWidth, lineHeight);
      textY += 12; // Gap between paragraphs
    });
  }

  // Closing & Signoff
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8B2121';
  ctx.font = 'bold italic 26px "Noto Serif", Georgia, serif';
  ctx.fillText(essay.closing || 'Trân trọng và biết ơn!', 1864, 1260);

  ctx.fillStyle = '#42372A';
  ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    essay.signoff || 'Tập thể các thế hệ học sinh Trường THPT A Trần Hưng Đạo',
    1864,
    1305
  );

  // Interactive reading hint
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8A6D3B';
  ctx.font = 'bold 18px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('✦ NHẤP ĐỂ MỞ TOÀN VĂN BÀI TRI ÂN ✦', 1024, 1370);
}

export function createDedicationEssayTexture(essay: GratitudeEssayData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1440;
  drawDedicationEssayCanvas(canvas, essay);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function updateDedicationEssayTexture(
  texture: THREE.CanvasTexture,
  essay: GratitudeEssayData
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;
  drawDedicationEssayCanvas(canvas, essay);
  texture.needsUpdate = true;
}

// 10. WALL 4: Dedicated Architectural Exit Sign Texture ("VỀ SẢNH CHÍNH")
// Ratio: exactly 4:1 (2048x512) for razor-sharp clarity, zero distortion, and authentic Vietnamese typography
export function drawExitPortalSignCanvas(
  canvas: HTMLCanvasElement,
  intro: EntranceIntroData
): void {
  const ctx = canvas.getContext('2d')!;

  // 1. Warm Architectural Honey Oak Veneer Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#B8824C');
  bgGrad.addColorStop(0.2, '#C4905A');
  bgGrad.addColorStop(0.5, '#B07B46');
  bgGrad.addColorStop(0.85, '#9C6835');
  bgGrad.addColorStop(1, '#8A5828');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 512);

  // Subtle natural wood grain streaks
  for (let y = 0; y < 512; y += 4) {
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.strokeStyle = `rgba(50, 25, 10, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      600,
      y + (Math.random() - 0.5) * 4,
      1400,
      y + (Math.random() - 0.5) * 4,
      2048,
      y
    );
    ctx.stroke();
  }

  // Soft perimeter vignette
  const vignette = ctx.createRadialGradient(1024, 256, 400, 1024, 256, 1100);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(25, 15, 5, 0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 2048, 512);

  // 2. Champagne-Gold Architectural Double Pinstripe Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 2012, 476);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, 1988, 452);

  // Decorative corner brackets & brass screw studs
  const corners = [
    { x: 30, y: 30 },
    { x: 2018, y: 30 },
    { x: 30, y: 482 },
    { x: 2018, y: 482 },
  ];
  corners.forEach((c) => {
    ctx.fillStyle = '#E5C778';
    ctx.beginPath();
    ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8C6826';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 3. Top Direction Badge ("✦ LỐI RA SẢNH CHÍNH ✦")
  ctx.fillStyle = '#1D2128';
  ctx.beginPath();
  ctx.roundRect(784, 42, 480, 46, 10);
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#F5D78A';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText('✦ LỐI RA SẢNH CHÍNH ✦', 1024, 72);

  // 4. Primary Heading ("VỀ SẢNH CHÍNH")
  ctx.textAlign = 'center';
  ctx.fillStyle = '#181410';
  ctx.font = 'bold 74px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('VỀ SẢNH CHÍNH', 1024, 185);

  // Subtle gold accent divider below main title
  ctx.strokeStyle = '#C99E4B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(420, 222);
  ctx.lineTo(1628, 222);
  ctx.stroke();

  // Diamond accent center
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(1024, 222, 5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Secondary Line: Room Title & School Identity
  ctx.fillStyle = '#946E28';
  ctx.font = 'bold 26px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '4px';
  const roomName = intro.roomTitleVi || 'PHÒNG TRI ÂN & KÝ ỨC';
  ctx.fillText(`${roomName} • TRƯỜNG THPT A TRẦN HƯNG ĐẠO`, 1024, 276);

  // 6. Educational Motto
  ctx.fillStyle = '#4A3B2A';
  ctx.font = 'italic 24px "Noto Serif", Georgia, serif';
  ctx.letterSpacing = '1px';
  const motto = intro.mottoVi || 'Tôn sư trọng đạo — Uống nước nhớ nguồn.';
  ctx.fillText(`“${motto}”`, 1024, 342);

  // 7. Interactive Visitor Guidance Prompt
  ctx.fillStyle = '#221D18';
  ctx.beginPath();
  ctx.roundRect(574, 400, 900, 46, 23);
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#EED285';
  ctx.font = 'bold 17px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('✦ NHẤP VÀO BIỂN HOẶC BƯỚC QUA CỬA ĐỂ TRỞ VỀ SẢNH CHÍNH ✦', 1024, 430);
}

export function createExitPortalSignTexture(intro: EntranceIntroData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  drawExitPortalSignCanvas(canvas, intro);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

export function updateExitPortalSignTexture(
  texture: THREE.CanvasTexture,
  intro: EntranceIntroData
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;
  drawExitPortalSignCanvas(canvas, intro);
  texture.needsUpdate = true;
}

// 11. WALL 4: Wall-Mounted Curatorial Introduction Plaque ("DẤU ẤN CỦA LÒNG BIẾT ƠN")
export function drawEntrancePlaqueCanvas(
  canvas: HTMLCanvasElement,
  intro: EntranceIntroData
): void {
  const ctx = canvas.getContext('2d')!;

  // Dark graphite background matching modern architectural portal & header plaques
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#272B32');
  bg.addColorStop(0.5, '#1E2126');
  bg.addColorStop(1, '#16181C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 1200);

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 1160, 1160);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1128, 1128);

  // Section Index & Tag
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('04 // LỜI TỰA & KHÔNG GIAN TRI ÂN', 90, 110);

  // Room Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px "Noto Serif", Georgia, serif';
  wrapText(ctx, intro.headingVi || 'DẤU ẤN CỦA LÒNG BIẾT ƠN', 90, 195, 1020, 64, 2);

  // Motto Box
  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.beginPath();
  ctx.roundRect(90, 280, 1020, 58, 12);
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#F0D68A';
  ctx.font = 'italic 24px "Noto Serif", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`“${intro.mottoVi || 'Tôn sư trọng đạo — Uống nước nhớ nguồn.'}”`, 600, 318);

  // Divider
  ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(90, 385);
  ctx.lineTo(1110, 385);
  ctx.stroke();

  // Curatorial Introduction Narrative
  ctx.fillStyle = '#D0D6E2';
  ctx.font = '400 28px "Be Vietnam Pro", sans-serif';
  wrapText(
    ctx,
    intro.introParagraph ||
      'Không gian trang trọng lưu giữ hình bóng những người lái đò thầm lặng, khắc ghi tình cảm tri ân sâu sắc của bao thế hệ học trò và gìn giữ những ký ức thanh xuân tươi đẹp nhất dưới mái trường THPT A Trần Hưng Đạo.',
    90,
    460,
    1020,
    48,
    8
  );

  // Additional curatorial guide
  ctx.fillStyle = '#9EACB8';
  ctx.font = '400 22px "Be Vietnam Pro", sans-serif';
  const guide =
    'Phòng triển lãm gồm 4 vách chuyên đề: Vách Tả (Những Người Lái Đò), Vách Hữu (Những Khoảnh Khắc Không Quên), Vách Chính (Văn Bia Tri Ân Người Khai Sáng) và Vách Tiễn (Lối Ra Sảnh Chính Di Sản).';
  wrapText(ctx, guide, 90, 820, 1020, 38, 4);

  // Museum Catalog Mark
  ctx.fillStyle = '#7C8492';
  ctx.font = 'bold 18px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO • 1966–2026', 90, 1070);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 18px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('✦ NHẤP VÀO VÒM CỬA ĐỂ TRỞ VỀ SẢNH CHÍNH ✦', 90, 1120);
}

export function createEntrancePlaqueTexture(intro: EntranceIntroData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  drawEntrancePlaqueCanvas(canvas, intro);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  return texture;
}

export function updateEntrancePlaqueTexture(
  texture: THREE.CanvasTexture,
  intro: EntranceIntroData
): void {
  const canvas = texture.image as HTMLCanvasElement;
  if (!canvas) return;
  drawEntrancePlaqueCanvas(canvas, intro);
  texture.needsUpdate = true;
}
