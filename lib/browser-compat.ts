/**
 * Cross-browser compatibility utilities
 */

/**
 * Browser detection
 */
export const BrowserDetection = {
  isSafari: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    );
  },

  isChrome: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  },

  isFirefox: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /Firefox/.test(navigator.userAgent);
  },

  isMobile: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  supportsSharedArrayBuffer: (): boolean => {
    return typeof SharedArrayBuffer !== 'undefined';
  },

  supportsWebWorker: (): boolean => {
    return typeof Worker !== 'undefined';
  },

  supportsOffscreenCanvas: (): boolean => {
    return typeof OffscreenCanvas !== 'undefined';
  },

  supportsWebGL: (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  },

  supportsWebGL2: (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  },

  supportsVideoCodec: (codec: string): boolean => {
    const video = document.createElement('video');
    return video.canPlayType(codec) !== '';
  },
};

/**
 * FFmpeg compatibility layer for Safari
 */
export const FFmpegCompat = {
  /**
   * Check if FFmpeg is supported in current browser
   */
  isSupported: (): boolean => {
    // Safari has issues with SharedArrayBuffer
    if (BrowserDetection.isSafari()) {
      // Check if cross-origin isolated (required for SharedArrayBuffer)
      if (typeof crossOriginIsolated !== 'undefined' && !crossOriginIsolated) {
        return false;
      }
    }

    return BrowserDetection.supportsSharedArrayBuffer();
  },

  /**
   * Get FFmpeg loading options based on browser
   */
  getLoadOptions: (): any => {
    const options: any = {};

    if (BrowserDetection.isSafari()) {
      // Safari-specific options
      options.corePath = '/ffmpeg-core.js';
      options.wasmPath = '/ffmpeg-core.wasm';
    }

    return options;
  },

  /**
   * Show browser compatibility message
   */
  getCompatibilityMessage: (): string | null => {
    if (!FFmpegCompat.isSupported()) {
      if (BrowserDetection.isSafari()) {
        return 'Video export is not fully supported in Safari. Please use Chrome or Firefox for best experience.';
      }
      return 'Your browser does not support video export. Please update to a modern browser.';
    }
    return null;
  },
};

/**
 * Touch event compatibility
 */
export const TouchEventCompat = {
  /**
   * Get pointer events (works with both mouse and touch)
   */
  getPointerEvents: () => {
    if (BrowserDetection.isMobile()) {
      return {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel',
      };
    }

    return {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      cancel: 'mouseout',
    };
  },

  /**
   * Get position from event (mouse or touch)
   */
  getPosition: (
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } | null => {
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }

    if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }

    return null;
  },

  /**
   * Prevent default behavior for touch events
   */
  preventDefaultTouch: (element: HTMLElement): void => {
    element.addEventListener('touchstart', (e) => e.preventDefault(), {
      passive: false,
    });
    element.addEventListener('touchmove', (e) => e.preventDefault(), {
      passive: false,
    });
  },
};

/**
 * Video codec compatibility
 */
export const VideoCodecCompat = {
  /**
   * Get supported video format
   */
  getSupportedFormat: (): 'mp4' | 'webm' | null => {
    if (BrowserDetection.supportsVideoCodec('video/mp4; codecs="avc1.42E01E"')) {
      return 'mp4';
    }

    if (BrowserDetection.supportsVideoCodec('video/webm; codecs="vp9"')) {
      return 'webm';
    }

    return null;
  },

  /**
   * Get recommended video codec
   */
  getRecommendedCodec: (): string => {
    if (BrowserDetection.isSafari()) {
      return 'libx264'; // H.264
    }

    return 'libx264'; // H.264 is widely supported
  },

  /**
   * Get supported audio codec
   */
  getSupportedAudioCodec: (): string => {
    if (BrowserDetection.supportsVideoCodec('audio/mp4; codecs="mp4a.40.2"')) {
      return 'aac';
    }

    if (BrowserDetection.supportsVideoCodec('audio/webm; codecs="opus"')) {
      return 'opus';
    }

    return 'aac'; // Fallback
  },
};

/**
 * Canvas performance compatibility
 */
export const CanvasCompat = {
  /**
   * Get optimal canvas rendering context
   */
  getOptimalContext: (
    canvas: HTMLCanvasElement
  ): CanvasRenderingContext2D | null => {
    const options: CanvasRenderingContext2DSettings = {
      alpha: true,
      desynchronized: true, // Better performance on some browsers
    };

    // Safari has issues with desynchronized
    if (BrowserDetection.isSafari()) {
      delete options.desynchronized;
    }

    return canvas.getContext('2d', options);
  },

  /**
   * Enable image smoothing based on browser
   */
  configureImageSmoothing: (
    ctx: CanvasRenderingContext2D,
    enabled: boolean
  ): void => {
    ctx.imageSmoothingEnabled = enabled;

    // Browser-specific properties
    (ctx as any).mozImageSmoothingEnabled = enabled;
    (ctx as any).webkitImageSmoothingEnabled = enabled;
    (ctx as any).msImageSmoothingEnabled = enabled;
  },
};

/**
 * Storage compatibility
 */
export const StorageCompat = {
  /**
   * Check if localStorage is available
   */
  isLocalStorageAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Check if IndexedDB is available
   */
  isIndexedDBAvailable: (): boolean => {
    return typeof indexedDB !== 'undefined';
  },

  /**
   * Get available storage
   */
  getAvailableStorage: async (): Promise<{
    quota: number;
    usage: number;
  } | null> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  },
};

/**
 * Audio context compatibility
 */
export const AudioCompat = {
  /**
   * Get AudioContext with prefix fallback
   */
  createAudioContext: (): AudioContext => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error('AudioContext is not supported');
    }

    return new AudioContextClass();
  },

  /**
   * Resume audio context (required for autoplay policy)
   */
  resumeAudioContext: async (ctx: AudioContext): Promise<void> => {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  },
};

/**
 * Clipboard compatibility
 */
export const ClipboardCompat = {
  /**
   * Write text to clipboard with fallback
   */
  writeText: async (text: string): Promise<void> => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  },

  /**
   * Read text from clipboard with fallback
   */
  readText: async (): Promise<string> => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }

    throw new Error('Clipboard read not supported');
  },
};

/**
 * Get all browser capabilities
 */
export function getBrowserCapabilities(): {
  browser: string;
  mobile: boolean;
  sharedArrayBuffer: boolean;
  webWorker: boolean;
  offscreenCanvas: boolean;
  webGL: boolean;
  webGL2: boolean;
  ffmpegSupported: boolean;
  localStorage: boolean;
  indexedDB: boolean;
} {
  let browser = 'Unknown';
  if (BrowserDetection.isChrome()) browser = 'Chrome';
  else if (BrowserDetection.isSafari()) browser = 'Safari';
  else if (BrowserDetection.isFirefox()) browser = 'Firefox';

  return {
    browser,
    mobile: BrowserDetection.isMobile(),
    sharedArrayBuffer: BrowserDetection.supportsSharedArrayBuffer(),
    webWorker: BrowserDetection.supportsWebWorker(),
    offscreenCanvas: BrowserDetection.supportsOffscreenCanvas(),
    webGL: BrowserDetection.supportsWebGL(),
    webGL2: BrowserDetection.supportsWebGL2(),
    ffmpegSupported: FFmpegCompat.isSupported(),
    localStorage: StorageCompat.isLocalStorageAvailable(),
    indexedDB: StorageCompat.isIndexedDBAvailable(),
  };
}
