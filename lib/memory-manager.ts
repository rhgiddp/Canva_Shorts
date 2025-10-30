/**
 * Memory management utilities
 */

/**
 * Cleanup manager for tracking and cleaning up resources
 */
export class CleanupManager {
  private cleanupFunctions: Array<() => void> = [];

  /**
   * Register a cleanup function
   */
  register(fn: () => void): void {
    this.cleanupFunctions.push(fn);
  }

  /**
   * Execute all cleanup functions
   */
  cleanup(): void {
    this.cleanupFunctions.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    this.cleanupFunctions = [];
  }

  /**
   * Get number of registered cleanup functions
   */
  size(): number {
    return this.cleanupFunctions.length;
  }
}

/**
 * Blob URL manager with automatic cleanup
 */
export class BlobURLManager {
  private urls: Set<string> = new Set();
  private urlToBlob: Map<string, Blob> = new Map();

  /**
   * Create blob URL and track it
   */
  create(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    this.urlToBlob.set(url, blob);
    return url;
  }

  /**
   * Revoke specific blob URL
   */
  revoke(url: string): void {
    if (this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
      this.urlToBlob.delete(url);
    }
  }

  /**
   * Revoke all blob URLs
   */
  revokeAll(): void {
    this.urls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.urls.clear();
    this.urlToBlob.clear();
  }

  /**
   * Get blob from URL
   */
  getBlob(url: string): Blob | undefined {
    return this.urlToBlob.get(url);
  }

  /**
   * Check if URL is managed
   */
  has(url: string): boolean {
    return this.urls.has(url);
  }

  /**
   * Get number of tracked URLs
   */
  size(): number {
    return this.urls.size;
  }
}

/**
 * Fabric.js canvas cleanup utilities
 */
export function disposeFabricCanvas(canvas: any): void {
  if (!canvas) return;

  try {
    // Dispose all objects
    canvas.getObjects().forEach((obj: any) => {
      canvas.remove(obj);
      if (obj.dispose) {
        obj.dispose();
      }
    });

    // Clear canvas
    canvas.clear();

    // Dispose canvas
    if (canvas.dispose) {
      canvas.dispose();
    }
  } catch (error) {
    console.error('Error disposing Fabric canvas:', error);
  }
}

/**
 * Video element cleanup
 */
export function disposeVideoElement(video: HTMLVideoElement): void {
  try {
    // Pause and reset
    video.pause();
    video.removeAttribute('src');
    video.load();

    // Remove all event listeners by cloning
    const clone = video.cloneNode(false) as HTMLVideoElement;
    video.parentNode?.replaceChild(clone, video);
  } catch (error) {
    console.error('Error disposing video element:', error);
  }
}

/**
 * Canvas element cleanup
 */
export function disposeCanvasElement(canvas: HTMLCanvasElement): void {
  try {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Reset dimensions to free memory
    canvas.width = 0;
    canvas.height = 0;
  } catch (error) {
    console.error('Error disposing canvas element:', error);
  }
}

/**
 * Audio element cleanup
 */
export function disposeAudioElement(audio: HTMLAudioElement): void {
  try {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    // Remove all event listeners by cloning
    const clone = audio.cloneNode(false) as HTMLAudioElement;
    audio.parentNode?.replaceChild(clone, audio);
  } catch (error) {
    console.error('Error disposing audio element:', error);
  }
}

/**
 * Image element cleanup
 */
export function disposeImageElement(img: HTMLImageElement): void {
  try {
    img.removeAttribute('src');
    img.srcset = '';

    // Remove all event listeners by cloning
    const clone = img.cloneNode(false) as HTMLImageElement;
    img.parentNode?.replaceChild(clone, img);
  } catch (error) {
    console.error('Error disposing image element:', error);
  }
}

/**
 * FFmpeg instance cleanup
 */
export async function disposeFFmpeg(ffmpeg: any): Promise<void> {
  try {
    // Check if FFmpeg is loaded
    if (!ffmpeg || !ffmpeg.loaded) {
      return;
    }

    // Clean up file system
    const files = await ffmpeg.listDir('/');
    for (const file of files) {
      if (file.isDir) continue;
      try {
        await ffmpeg.deleteFile(file.name);
      } catch (error) {
        console.warn(`Failed to delete file ${file.name}:`, error);
      }
    }

    // Terminate FFmpeg
    if (ffmpeg.terminate) {
      await ffmpeg.terminate();
    }
  } catch (error) {
    console.error('Error disposing FFmpeg:', error);
  }
}

/**
 * Memory monitor for debugging
 */
export class MemoryMonitor {
  private interval: NodeJS.Timeout | null = null;

  /**
   * Start monitoring memory usage
   */
  start(intervalMs: number = 5000): void {
    if (this.interval) {
      return;
    }

    this.log();

    this.interval = setInterval(() => {
      this.log();
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Log memory usage
   */
  private log(): void {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return;
    }

    const memory = (performance as any).memory;

    console.log('[Memory Monitor]', {
      used: this.formatBytes(memory.usedJSHeapSize),
      total: this.formatBytes(memory.totalJSHeapSize),
      limit: this.formatBytes(memory.jsHeapSizeLimit),
      percentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%',
    });
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * Global blob URL manager
 */
export const globalBlobManager = new BlobURLManager();

/**
 * Global memory monitor
 */
export const globalMemoryMonitor = new MemoryMonitor();

/**
 * React hook for cleanup management
 */
export function useCleanup() {
  const manager = new CleanupManager();

  return {
    register: (fn: () => void) => manager.register(fn),
    cleanup: () => manager.cleanup(),
  };
}
