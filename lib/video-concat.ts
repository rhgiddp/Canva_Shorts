import { loadFFmpeg, writeFile, readFile, exec } from './ffmpeg';

export async function concatenateVideos(
  videoBlobs: Blob[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);

  // Write input files
  for (let i = 0; i < videoBlobs.length; i++) {
    const buffer = await videoBlobs[i].arrayBuffer();
    await writeFile(ffmpeg, `input${i}.mp4`, new Uint8Array(buffer));
  }

  // Create concat file list
  const fileList = videoBlobs.map((_, i) => `file 'input${i}.mp4'`).join('\n');
  await writeFile(ffmpeg, 'inputs.txt', new TextEncoder().encode(fileList));

  // Concatenate videos
  await exec(ffmpeg, [
    '-f', 'concat',
    '-safe', '0',
    '-i', 'inputs.txt',
    '-c', 'copy',
    'output.mp4'
  ]);

  // Read output
  const data = await readFile(ffmpeg, 'output.mp4');
  return new Blob([new Uint8Array(data).buffer], { type: 'video/mp4' });
}
