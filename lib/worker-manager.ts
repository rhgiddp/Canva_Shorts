/**
 * Worker manager for video processing tasks
 */

import type { WorkerMessage, WorkerResponse } from '@/workers/video-processor.worker';

export class WorkerManager {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingMessages = new Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
    }
  >();

  /**
   * Initialize worker
   */
  init(): void {
    if (this.worker) {
      return;
    }

    try {
      this.worker = new Worker(
        new URL('../workers/video-processor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.addEventListener('message', this.handleMessage.bind(this));
      this.worker.addEventListener('error', this.handleError.bind(this));
    } catch (error) {
      console.warn('Web Worker not supported:', error);
    }
  }

  /**
   * Handle worker messages
   */
  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { type, payload, id } = event.data;

    const pending = this.pendingMessages.get(id);
    if (!pending) {
      return;
    }

    if (type === 'success') {
      pending.resolve(payload);
      this.pendingMessages.delete(id);
    } else if (type === 'error') {
      pending.reject(new Error(payload.message));
      this.pendingMessages.delete(id);
    } else if (type === 'progress') {
      // Handle progress updates if needed
    }
  }

  /**
   * Handle worker errors
   */
  private handleError(error: ErrorEvent): void {
    console.error('Worker error:', error);
  }

  /**
   * Send message to worker
   */
  private sendMessage<T>(type: WorkerMessage['type'], payload: any): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error('Worker not initialized'));
    }

    return new Promise((resolve, reject) => {
      const id = `msg_${this.messageId++}`;

      this.pendingMessages.set(id, { resolve, reject });

      this.worker!.postMessage({
        type,
        payload,
        id,
      } as WorkerMessage);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id);
          reject(new Error('Worker operation timed out'));
        }
      }, 30000);
    });
  }

  /**
   * Process video frame
   */
  async processFrame(
    imageData: ImageData,
    filters?: any[]
  ): Promise<ImageData> {
    return this.sendMessage('process-frame', { imageData, filters });
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(
    imageData: ImageData,
    width: number,
    height: number,
    quality: number = 0.8
  ): Promise<string> {
    return this.sendMessage('generate-thumbnail', {
      imageData,
      width,
      height,
      quality,
    });
  }

  /**
   * Compress video
   */
  async compressVideo(data: ArrayBuffer, quality: number): Promise<ArrayBuffer> {
    return this.sendMessage('compress-video', { data, quality });
  }

  /**
   * Terminate worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.pendingMessages.clear();
    }
  }
}

// Global worker manager instance
export const workerManager = new WorkerManager();

// Initialize on module load
if (typeof window !== 'undefined') {
  workerManager.init();
}
