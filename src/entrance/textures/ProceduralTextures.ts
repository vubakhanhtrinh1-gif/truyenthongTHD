import * as THREE from 'three';
import { entranceConfig } from '../config/entranceConfig';

/**
 * Generate procedural high-fidelity textures using HTML5 Canvas
 * Ensures crisp resolution without loading external large image files
 */

// 1. Dark Walnut Wood Texture
export function createDarkWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base dark wood gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#120d09');
  grad.addColorStop(0.5, '#1d140e');
  grad.addColorStop(1, '#150f0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Wood grain fiber lines
  ctx.fillStyle = 'rgba(255, 200, 150, 0.035)';
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 1024;
    const h = 1 + Math.random() * 2.5;
    ctx.fillRect(0, y, 1024, h);
  }

  // Darker grain bands
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 1024;
    const h = 4 + Math.random() * 16;
    ctx.fillRect(0, y, 1024, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Brushed Heritage Gold Texture
export function createBrushedGoldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich aged brass background
  ctx.fillStyle = '#9e7939';
  ctx.fillRect(0, 0, 512, 512);

  // Fine brushed horizontal streaks
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 512;
    const brightness = Math.random();
    ctx.fillStyle = brightness > 0.5 ? 'rgba(255, 235, 175, 0.08)' : 'rgba(50, 35, 10, 0.1)';
    ctx.fillRect(0, y, 512, 1 + Math.random() * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Dark Polished Stone Floor Texture
export function createStoneFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep graphite base
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle stone flecks
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const rad = 0.5 + Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(199, 161, 90, 0.025)';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tile seams
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.strokeRect(512, 0, 512, 512);
  ctx.strokeRect(0, 512, 512, 512);
  ctx.strokeRect(512, 512, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// 4. Gold Inlay Approach Path Texture
export function createInlayPathTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark floor underlay
  ctx.fillStyle = '#080a10';
  ctx.fillRect(0, 0, 512, 1024);

  // Center approach axis line (Heritage Gold)
  const goldGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  goldGrad.addColorStop(0, '#c7a15a');
  goldGrad.addColorStop(0.5, '#ffd988');
  goldGrad.addColorStop(1, '#c7a15a');

  // Double side guide lines
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(96, 0);
  ctx.lineTo(96, 1024);
  ctx.moveTo(416, 0);
  ctx.lineTo(416, 1024);
  ctx.stroke();

  // Subtle center dotted line
  ctx.setLineDash([12, 20]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(199, 161, 90, 0.5)';
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 1024);
  ctx.stroke();
  ctx.setLineDash([]);

  // Constellation / milestone points along path
  for (let y = 128; y < 1024; y += 256) {
    ctx.fillStyle = '#ffd988';
    ctx.beginPath();
    ctx.arc(256, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Diamond marker
    ctx.strokeStyle = 'rgba(199, 161, 90, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(256, y - 10);
    ctx.lineTo(266, y);
    ctx.lineTo(256, y + 10);
    ctx.lineTo(246, y);
    ctx.closePath();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  return texture;
}

// 5. Architectural Header Inscription Plaque (Plaque on the Gate)
export function createGateHeaderSignageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Background: Deep Lacquer Red with dark vignette
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#3a0c10');
  bgGrad.addColorStop(0.5, '#561318');
  bgGrad.addColorStop(1, '#2c080b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 512);

  // Outer Gold Border with corner insets
  ctx.strokeStyle = '#c7a15a';
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, 2000, 464);

  ctx.strokeStyle = 'rgba(255, 235, 175, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1976, 440);

  // Top School Name
  ctx.fillStyle = '#fff4db';
  ctx.textAlign = 'center';
  ctx.font = '600 52px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.letterSpacing = '12px';
  ctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO'.normalize('NFC'), 1024, 150);

  // Main Project Title: COSMIC HERITAGE – DẤU ẤN 60 NĂM
  ctx.fillStyle = '#ffd988';
  ctx.font = 'bold 92px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.letterSpacing = '14px';
  ctx.shadowColor = 'rgba(255, 215, 120, 0.4)';
  ctx.shadowBlur = 16;
  ctx.fillText('COSMIC HERITAGE • 60 NĂM'.normalize('NFC'), 1024, 275);
  ctx.shadowBlur = 0;

  // Years & Tagline
  ctx.fillStyle = '#d4bc88';
  ctx.font = 'italic 500 40px "Be Vietnam Pro", "Noto Serif", serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('1966 – 2026 • 60 năm – một điểm tựa, một quỹ đạo tương lai.'.normalize('NFC'), 1024, 385);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 6. Threshold Floating Luminous Concept Text (ENTER THE MEMORY)
export function createThresholdSignageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 512);

  // Concept Pill Outline
  ctx.strokeStyle = 'rgba(199, 161, 90, 0.7)';
  ctx.lineWidth = 3;
  ctx.strokeRect(128, 48, 768, 80);

  // [01 CỔNG VÀO] ENTER THE MEMORY
  ctx.fillStyle = '#ffd988';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px "Be Vietnam Pro", monospace';
  ctx.letterSpacing = '6px';
  ctx.fillText('[01 CỔNG VÀO] ENTER THE MEMORY'.normalize('NFC'), 512, 102);

  // Welcome phrase
  ctx.fillStyle = '#fff4db';
  ctx.font = '500 48px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('CHÀO MỪNG BẠN TRỞ VỀ'.normalize('NFC'), 512, 240);

  // Subtext
  ctx.fillStyle = 'rgba(212, 188, 136, 0.9)';
  ctx.font = 'italic 34px "Be Vietnam Pro", "Noto Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('Mỗi con người, mỗi kỷ vật là một vì sao trong miền ký ức'.normalize('NFC'), 512, 320);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 7. Architectural Side Wall Motif Texture in Warm Ivory (#F0E7D6)
export function createWallReliefTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Warm ivory architectural wall stone base (#F0E7D6)
  ctx.fillStyle = '#F0E7D6';
  ctx.fillRect(0, 0, 1024, 2048);

  // Subtle vertical stone relief fluting lines
  ctx.fillStyle = 'rgba(215, 205, 188, 0.45)';
  for (let x = 64; x < 1024; x += 64) {
    ctx.fillRect(x, 0, 6, 2048);
  }

  // Restrained heritage gold (#CBA45B) vertical division trims
  ctx.fillStyle = '#CBA45B';
  ctx.fillRect(32, 0, 4, 2048);
  ctx.fillRect(992, 0, 4, 2048);

  // Archival decorative frames in restrained heritage gold (#CBA45B)
  ctx.strokeStyle = 'rgba(203, 164, 91, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(96, 256, 832, 600);
  ctx.strokeRect(96, 1024, 832, 600);

  // Subtle star emblem in center of frames
  ctx.fillStyle = 'rgba(203, 164, 91, 0.65)';
  ctx.beginPath();
  ctx.arc(512, 556, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(512, 1324, 12, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 8. Mystical Ground Fog / Smoke Puff Texture
export function createMysticalFogPuffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // Soft radial gradient core
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 240);
  grad.addColorStop(0, 'rgba(235, 215, 175, 0.45)');
  grad.addColorStop(0.35, 'rgba(180, 195, 225, 0.25)');
  grad.addColorStop(0.7, 'rgba(100, 120, 160, 0.08)');
  grad.addColorStop(1, 'rgba(11, 16, 32, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Secondary soft drifting sub-puffs
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const dist = 70 + Math.random() * 60;
    const px = 256 + Math.cos(angle) * dist;
    const py = 256 + Math.sin(angle) * dist;
    const pr = 80 + Math.random() * 60;

    const subGrad = ctx.createRadialGradient(px, py, 5, px, py, pr);
    subGrad.addColorStop(0, 'rgba(240, 225, 190, 0.2)');
    subGrad.addColorStop(0.6, 'rgba(140, 160, 200, 0.08)');
    subGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = subGrad;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

