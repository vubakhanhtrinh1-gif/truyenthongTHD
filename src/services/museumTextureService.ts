/**
 * Universal Museum Texture & Image Rendering Service
 * Provides high-performance in-memory image caching, aspect-ratio preservation (object-fit: contain),
 * and live canvas texture updates for 3D museum walls across all canonical rooms.
 */

import * as THREE from 'three';

// Global shared image cache to avoid re-fetching images across room switches
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Retrieve cached image if loaded, or start asynchronous fetch with crossOrigin enabled
 */
export function loadAndCacheImage(
  url: string,
  onLoaded?: (img: HTMLImageElement) => void
): HTMLImageElement | null {
  if (!url) return null;

  const existing = imageCache.get(url);
  if (existing) {
    if (existing.complete && existing.naturalWidth > 0) {
      if (onLoaded) onLoaded(existing);
      return existing;
    }
    // If still in flight, attach callback
    if (onLoaded) {
      const prevOnload = existing.onload;
      existing.onload = (e) => {
        if (typeof prevOnload === 'function') prevOnload.call(existing, e);
        onLoaded(existing);
      };
    }
    return null;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    imageCache.set(url, img);
    if (onLoaded) onLoaded(img);
  };
  img.onerror = (e) => {
    console.warn(`[MuseumTextureService] Failed to load image asset: ${url}`, e);
  };
  img.src = url;
  imageCache.set(url, img);
  return null;
}

/**
 * Check if image is already cached and ready
 */
export function getCachedImage(url?: string): HTMLImageElement | null {
  if (!url) return null;
  const img = imageCache.get(url);
  if (img && img.complete && img.naturalWidth > 0) {
    return img;
  }
  return null;
}

/**
 * Draw an image onto a 2D canvas context with strict object-fit: contain
 * Guarantees zero distortion, stretching, squashing, or clipping of historical artifacts.
 */
export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  borderRadius: number = 0
): { drawX: number; drawY: number; drawW: number; drawH: number } {
  const naturalW =
    img instanceof HTMLImageElement
      ? img.naturalWidth
      : img instanceof HTMLCanvasElement
      ? img.width
      : boxW;
  const naturalH =
    img instanceof HTMLImageElement
      ? img.naturalHeight
      : img instanceof HTMLCanvasElement
      ? img.height
      : boxH;

  if (naturalW <= 0 || naturalH <= 0) {
    return { drawX: boxX, drawY: boxY, drawW: boxW, drawH: boxH };
  }

  const scale = Math.min(boxW / naturalW, boxH / naturalH);
  const drawW = Math.round(naturalW * scale);
  const drawH = Math.round(naturalH * scale);
  const drawX = Math.round(boxX + (boxW - drawW) / 2);
  const drawY = Math.round(boxY + (boxH - drawH) / 2);

  ctx.save();
  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, borderRadius);
    ctx.clip();
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();

  return { drawX, drawY, drawW, drawH };
}

/**
 * Draw an image onto a 2D canvas context with object-fit: cover (for full-bleed portraits or decorative paintings)
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  borderRadius: number = 0
): { drawX: number; drawY: number; drawW: number; drawH: number } {
  const naturalW =
    img instanceof HTMLImageElement
      ? img.naturalWidth
      : img instanceof HTMLCanvasElement
      ? img.width
      : boxW;
  const naturalH =
    img instanceof HTMLImageElement
      ? img.naturalHeight
      : img instanceof HTMLCanvasElement
      ? img.height
      : boxH;

  if (naturalW <= 0 || naturalH <= 0) {
    return { drawX: boxX, drawY: boxY, drawW: boxW, drawH: boxH };
  }

  const scale = Math.max(boxW / naturalW, boxH / naturalH);
  const drawW = Math.round(naturalW * scale);
  const drawH = Math.round(naturalH * scale);
  const drawX = Math.round(boxX + (boxW - drawW) / 2);
  const drawY = Math.round(boxY + (boxH - drawH) / 2);

  ctx.save();
  ctx.beginPath();
  if (borderRadius > 0) {
    ctx.roundRect(boxX, boxY, boxW, boxH, borderRadius);
  } else {
    ctx.rect(boxX, boxY, boxW, boxH);
  }
  ctx.clip();

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();

  return { drawX, drawY, drawW, drawH };
}

/**
 * Convenience helper to wrap text cleanly inside an HTML5 canvas
 */
export function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 5
): number {
  if (!text) return startY;
  const words = text.split(' ');
  let line = '';
  let curY = startY;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines - 1) {
        // truncate remaining
        const remaining = words.slice(n).join(' ');
        ctx.fillText(remaining.length > 30 ? remaining.substring(0, 27) + '...' : remaining, x, curY);
        return curY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineHeight;
}

/**
 * Safely trigger texture update on CanvasTexture
 */
export function markTextureNeedsUpdate(texture?: THREE.Texture | null): void {
  if (!texture) return;
  texture.needsUpdate = true;
}
