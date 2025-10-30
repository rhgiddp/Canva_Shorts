/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component with dynamic import
 */
export async function lazyLoadComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const loadedModule = await importFn();
  return loadedModule.default;
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => {
        const start = Date.now();
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1) as any;
      };

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => {
        clearTimeout(id);
      };

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(
      `[Performance] ${name} failed after ${(end - start).toFixed(2)}ms`,
      error
    );
    throw error;
  }
}

/**
 * Batch updates using requestAnimationFrame
 */
export class BatchUpdater {
  private pending: Map<string, () => void> = new Map();
  private scheduled = false;

  add(key: string, update: () => void) {
    this.pending.set(key, update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush() {
    this.scheduled = false;
    const updates = Array.from(this.pending.values());
    this.pending.clear();
    updates.forEach((update) => update());
  }
}

/**
 * Virtual scrolling helper
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVisibleRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { start: number; end: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 3 } = options;

  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleItems + overscan * 2);

  return {
    start,
    end,
    offsetY: start * itemHeight,
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
}

/**
 * Memory-efficient blob URL manager
 */
export class BlobURLManager {
  private urls: Set<string> = new Set();

  create(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    return url;
  }

  revoke(url: string) {
    if (this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
    }
  }

  revokeAll() {
    this.urls.forEach((url) => URL.revokeObjectURL(url));
    this.urls.clear();
  }
}
