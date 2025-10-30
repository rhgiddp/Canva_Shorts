/**
 * Video thumbnail generation utilities
 */

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  time?: number; // Time in seconds to capture
  quality?: number; // 0-1
}

const DEFAULT_OPTIONS: Required<ThumbnailOptions> = {
  width: 160,
  height: 90,
  time: 0,
  quality: 0.8,
};

/**
 * Generate thumbnail from video file
 */
export async function generateThumbnail(
  videoUrl: string,
  options: ThumbnailOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    video.addEventListener('loadedmetadata', () => {
      // Seek to specified time
      video.currentTime = Math.min(opts.time, video.duration);
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = opts.width;
        canvas.height = opts.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, opts.width, opts.height);

        // Convert to data URL
        const thumbnail = canvas.toDataURL('image/jpeg', opts.quality);

        // Cleanup
        video.src = '';
        video.load();

        resolve(thumbnail);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.src = videoUrl;
  });
}

/**
 * Generate multiple thumbnails at intervals
 */
export async function generateThumbnailStrip(
  videoUrl: string,
  count: number = 10,
  options: Omit<ThumbnailOptions, 'time'> = {}
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    const thumbnails: string[] = [];
    let currentIndex = 0;

    const opts = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    video.addEventListener('loadedmetadata', () => {
      const interval = video.duration / (count + 1);
      captureFrame(interval);
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = opts.width;
        canvas.height = opts.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, opts.width, opts.height);
        thumbnails.push(canvas.toDataURL('image/jpeg', opts.quality));

        currentIndex++;
        if (currentIndex < count) {
          const interval = video.duration / (count + 1);
          captureFrame(interval * (currentIndex + 1));
        } else {
          // Cleanup
          video.src = '';
          video.load();
          resolve(thumbnails);
        }
      } catch (error) {
        reject(error);
      }
    });

    function captureFrame(time: number) {
      video.currentTime = time;
    }

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.src = videoUrl;
  });
}

/**
 * Thumbnail cache manager
 */
export class ThumbnailCache {
  private cache = new Map<string, string>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, thumbnail: string): void {
    // Implement LRU cache
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, thumbnail);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global thumbnail cache instance
export const thumbnailCache = new ThumbnailCache();

/**
 * Generate thumbnail with caching
 */
export async function generateThumbnailCached(
  videoUrl: string,
  options: ThumbnailOptions = {}
): Promise<string> {
  const cacheKey = `${videoUrl}_${JSON.stringify(options)}`;

  // Check cache first
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate new thumbnail
  const thumbnail = await generateThumbnail(videoUrl, options);
  thumbnailCache.set(cacheKey, thumbnail);

  return thumbnail;
}
