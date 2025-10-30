import { fabric } from 'fabric';
import { interpolateKeyframes } from './canvas';

/**
 * Frame cache for performance optimization
 */
class FrameCache {
  private cache: Map<string, ImageData> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 300) {
    this.maxSize = maxSize;
  }

  set(key: string, data: ImageData): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, data);
  }

  get(key: string): ImageData | undefined {
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

/**
 * Canvas-Video synchronization manager
 */
export class SyncManager {
  private fabricCanvas: fabric.Canvas;
  private videoCanvas: HTMLCanvasElement;
  private frameCache: FrameCache;
  private lastFrameTime: number = 0;
  private fps: number;

  constructor(
    fabricCanvas: fabric.Canvas,
    videoCanvas: HTMLCanvasElement,
    fps: number = 30
  ) {
    this.fabricCanvas = fabricCanvas;
    this.videoCanvas = videoCanvas;
    this.fps = fps;
    this.frameCache = new FrameCache();
  }

  /**
   * Render canvas overlay on video at specific time
   */
  renderFrame(currentTime: number, useCache: boolean = true): void {
    const frameKey = this.getFrameKey(currentTime);

    // Check cache
    if (useCache && this.frameCache.has(frameKey)) {
      const cachedData = this.frameCache.get(frameKey);
      if (cachedData) {
        const ctx = this.videoCanvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(cachedData, 0, 0);
        }
        return;
      }
    }

    // Update keyframe animations
    const objects = this.fabricCanvas.getObjects();
    objects.forEach((obj) => {
      interpolateKeyframes(obj, currentTime);
    });

    // Render fabric canvas
    this.fabricCanvas.renderAll();

    // Cache frame
    if (useCache) {
      const ctx = this.fabricCanvas.getContext();
      if (ctx) {
        const imageData = ctx.getImageData(
          0,
          0,
          this.fabricCanvas.width!,
          this.fabricCanvas.height!
        );
        this.frameCache.set(frameKey, imageData);
      }
    }

    this.lastFrameTime = currentTime;
  }

  /**
   * Sync rendering with requestAnimationFrame
   */
  syncWithRAF(
    currentTime: number,
    callback: () => void
  ): void {
    const frameTime = 1 / this.fps;
    const shouldRender = Math.abs(currentTime - this.lastFrameTime) >= frameTime;

    if (shouldRender) {
      this.renderFrame(currentTime);
      callback();
    }
  }

  /**
   * Clear frame cache
   */
  clearCache(): void {
    this.frameCache.clear();
  }

  /**
   * Generate frame key for caching
   */
  private getFrameKey(time: number): string {
    // Round to frame number
    const frameNumber = Math.floor(time * this.fps);
    return `frame_${frameNumber}`;
  }

  /**
   * Update FPS
   */
  setFPS(fps: number): void {
    this.fps = fps;
    this.clearCache(); // Clear cache when FPS changes
  }
}

/**
 * Composite video and canvas layers
 */
export function compositeLayersOnCanvas(
  outputCanvas: HTMLCanvasElement,
  videoElement: HTMLVideoElement,
  fabricCanvas: fabric.Canvas,
  currentTime: number
): void {
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return;

  // Clear output canvas
  ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  // Draw video frame
  if (videoElement.readyState >= 2) {
    ctx.drawImage(videoElement, 0, 0, outputCanvas.width, outputCanvas.height);
  }

  // Update fabric canvas animations
  const objects = fabricCanvas.getObjects();
  objects.forEach((obj) => {
    interpolateKeyframes(obj, currentTime);
  });
  fabricCanvas.renderAll();

  // Draw fabric canvas overlay
  const fabricElement = fabricCanvas.getElement();
  ctx.drawImage(fabricElement, 0, 0, outputCanvas.width, outputCanvas.height);
}

/**
 * Calculate interpolated frame time
 */
export function calculateFrameTime(
  timestamp: number,
  startTime: number,
  fps: number
): number {
  const elapsed = (timestamp - startTime) / 1000;
  return elapsed;
}

/**
 * Check if should render based on FPS
 */
export function shouldRenderFrame(
  currentTime: number,
  lastFrameTime: number,
  fps: number
): boolean {
  const frameTime = 1 / fps;
  return Math.abs(currentTime - lastFrameTime) >= frameTime;
}

/**
 * Pre-render frames for export
 */
export async function preRenderFrames(
  fabricCanvas: fabric.Canvas,
  startTime: number,
  endTime: number,
  fps: number,
  onProgress?: (progress: number) => void
): Promise<Map<number, ImageData>> {
  const frames = new Map<number, ImageData>();
  const totalFrames = Math.ceil((endTime - startTime) * fps);

  for (let i = 0; i < totalFrames; i++) {
    const time = startTime + i / fps;

    // Update animations
    const objects = fabricCanvas.getObjects();
    objects.forEach((obj) => {
      interpolateKeyframes(obj, time);
    });

    // Render canvas
    fabricCanvas.renderAll();

    // Capture frame
    const ctx = fabricCanvas.getContext();
    if (ctx) {
      const imageData = ctx.getImageData(
        0,
        0,
        fabricCanvas.width!,
        fabricCanvas.height!
      );
      frames.set(i, imageData);
    }

    // Report progress
    if (onProgress) {
      onProgress((i + 1) / totalFrames);
    }

    // Allow browser to breathe
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return frames;
}
