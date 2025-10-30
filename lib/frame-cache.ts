/**
 * Frame caching system for video rendering performance
 */

export interface CachedFrame {
  timestamp: number;
  dataUrl: string;
  canvas?: HTMLCanvasElement;
}

/**
 * Frame cache with LRU eviction
 */
export class FrameCache {
  private cache = new Map<string, CachedFrame>();
  private accessOrder: string[] = [];
  private maxSize: number;
  private maxMemoryMB: number;
  private currentMemoryMB: number = 0;

  constructor(maxSize: number = 50, maxMemoryMB: number = 100) {
    this.maxSize = maxSize;
    this.maxMemoryMB = maxMemoryMB;
  }

  /**
   * Generate cache key from timestamp and quality
   */
  private generateKey(timestamp: number, quality: string = 'standard'): string {
    return `${timestamp.toFixed(3)}_${quality}`;
  }

  /**
   * Estimate memory usage of a frame (rough approximation)
   */
  private estimateFrameSize(dataUrl: string): number {
    // Base64 string size + overhead
    const bytes = (dataUrl.length * 3) / 4;
    return bytes / (1024 * 1024); // Convert to MB
  }

  /**
   * Get cached frame
   */
  get(timestamp: number, quality?: string): CachedFrame | undefined {
    const key = this.generateKey(timestamp, quality);
    const frame = this.cache.get(key);

    if (frame) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter((k) => k !== key);
      this.accessOrder.push(key);
    }

    return frame;
  }

  /**
   * Set cached frame
   */
  set(
    timestamp: number,
    frame: CachedFrame,
    quality?: string
  ): void {
    const key = this.generateKey(timestamp, quality);

    // Remove if already exists
    if (this.cache.has(key)) {
      this.delete(key);
    }

    const frameSize = this.estimateFrameSize(frame.dataUrl);

    // Evict old frames if necessary
    while (
      (this.cache.size >= this.maxSize ||
        this.currentMemoryMB + frameSize > this.maxMemoryMB) &&
      this.accessOrder.length > 0
    ) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.delete(oldestKey);
      }
    }

    // Add new frame
    this.cache.set(key, frame);
    this.accessOrder.push(key);
    this.currentMemoryMB += frameSize;
  }

  /**
   * Delete frame from cache
   */
  private delete(key: string): void {
    const frame = this.cache.get(key);
    if (frame) {
      const size = this.estimateFrameSize(frame.dataUrl);
      this.currentMemoryMB -= size;

      // Clean up canvas if exists
      if (frame.canvas) {
        frame.canvas.width = 0;
        frame.canvas.height = 0;
      }

      this.cache.delete(key);
    }
  }

  /**
   * Clear all cached frames
   */
  clear(): void {
    this.cache.forEach((frame) => {
      if (frame.canvas) {
        frame.canvas.width = 0;
        frame.canvas.height = 0;
      }
    });

    this.cache.clear();
    this.accessOrder = [];
    this.currentMemoryMB = 0;
  }

  /**
   * Preload frames in range
   */
  async preload(
    startTime: number,
    endTime: number,
    step: number,
    renderFn: (timestamp: number) => Promise<CachedFrame>
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    for (let t = startTime; t <= endTime; t += step) {
      // Skip if already cached
      if (this.get(t)) {
        continue;
      }

      const promise = renderFn(t).then((frame) => {
        this.set(t, frame);
      });

      promises.push(promise);
    }

    await Promise.all(promises);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    memoryMB: number;
    maxMemoryMB: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryMB: this.currentMemoryMB,
      maxMemoryMB: this.maxMemoryMB,
    };
  }

  /**
   * Check if frame is cached
   */
  has(timestamp: number, quality?: string): boolean {
    const key = this.generateKey(timestamp, quality);
    return this.cache.has(key);
  }
}

/**
 * Global frame cache instance
 */
export const globalFrameCache = new FrameCache();

/**
 * Canvas pool for reusing canvas elements
 */
export class CanvasPool {
  private pool: HTMLCanvasElement[] = [];
  private maxPoolSize: number;

  constructor(maxPoolSize: number = 10) {
    this.maxPoolSize = maxPoolSize;
  }

  /**
   * Acquire canvas from pool or create new one
   */
  acquire(width: number, height: number): HTMLCanvasElement {
    let canvas = this.pool.pop();

    if (!canvas) {
      canvas = document.createElement('canvas');
    }

    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  /**
   * Release canvas back to pool
   */
  release(canvas: HTMLCanvasElement): void {
    if (this.pool.length < this.maxPoolSize) {
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      this.pool.push(canvas);
    } else {
      // Dispose canvas
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  /**
   * Clear pool
   */
  clear(): void {
    this.pool.forEach((canvas) => {
      canvas.width = 0;
      canvas.height = 0;
    });
    this.pool = [];
  }
}

/**
 * Global canvas pool instance
 */
export const globalCanvasPool = new CanvasPool();
