import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;

export async function loadFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.15/dist/umd';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}

export async function writeFile(ffmpeg: FFmpeg, name: string, data: Uint8Array): Promise<void> {
  await ffmpeg.writeFile(name, data);
}

export async function readFile(ffmpeg: FFmpeg, name: string): Promise<Uint8Array> {
  return await ffmpeg.readFile(name) as Uint8Array;
}

export async function deleteFile(ffmpeg: FFmpeg, name: string): Promise<void> {
  try {
    await ffmpeg.deleteFile(name);
  } catch (e) {
    // File might not exist
  }
}

export async function exec(ffmpeg: FFmpeg, args: string[]): Promise<void> {
  await ffmpeg.exec(args);
}
