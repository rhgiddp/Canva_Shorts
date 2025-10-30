/**
 * Web Worker for heavy video processing tasks
 * Keeps main thread responsive during intensive operations
 */

export interface WorkerMessage {
  type: 'process-frame' | 'generate-thumbnail' | 'compress-video';
  payload: any;
  id: string;
}

export interface WorkerResponse {
  type: 'success' | 'error' | 'progress';
  payload: any;
  id: string;
}

// Worker context
const ctx: Worker = self as any;

ctx.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'process-frame':
        result = await processFrame(payload);
        break;

      case 'generate-thumbnail':
        result = await generateThumbnail(payload);
        break;

      case 'compress-video':
        result = await compressVideo(payload);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    ctx.postMessage({
      type: 'success',
      payload: result,
      id,
    } as WorkerResponse);
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      payload: { message: (error as Error).message },
      id,
    } as WorkerResponse);
  }
});

/**
 * Process video frame
 */
async function processFrame(payload: {
  imageData: ImageData;
  filters?: any[];
}): Promise<ImageData> {
  const { imageData, filters = [] } = payload;

  // Apply filters to image data
  const processed = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  for (const filter of filters) {
    applyFilter(processed, filter);
  }

  return processed;
}

/**
 * Apply filter to image data
 */
function applyFilter(imageData: ImageData, filter: any): void {
  const { data } = imageData;

  switch (filter.type) {
    case 'brightness':
      applyBrightness(data, filter.value);
      break;

    case 'contrast':
      applyContrast(data, filter.value);
      break;

    case 'grayscale':
      applyGrayscale(data);
      break;

    // Add more filters as needed
  }
}

function applyBrightness(data: Uint8ClampedArray, value: number): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + value)); // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value)); // B
  }
}

function applyContrast(data: Uint8ClampedArray, value: number): void {
  const factor = (259 * (value + 255)) / (255 * (259 - value));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128)); // R
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // G
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // B
  }
}

function applyGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray; // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
}

/**
 * Generate thumbnail from video frame
 */
async function generateThumbnail(payload: {
  imageData: ImageData;
  width: number;
  height: number;
  quality: number;
}): Promise<string> {
  const { imageData, width, height, quality } = payload;

  // Create offscreen canvas
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw and scale image data
  ctx.putImageData(imageData, 0, 0);

  // Convert to blob
  const blob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality,
  });

  // Convert blob to base64 using FileReader (async in worker)
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress video data
 */
async function compressVideo(payload: {
  data: ArrayBuffer;
  quality: number;
}): Promise<ArrayBuffer> {
  // Placeholder for video compression
  // In a real implementation, this would use a compression algorithm
  return payload.data;
}

// Export empty object to make this a module
export {};
