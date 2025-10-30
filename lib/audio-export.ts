import { loadFFmpeg, writeFile, readFile, exec } from './ffmpeg';

export async function mixAudioTracks(
  audioBlobs: Array<{ blob: Blob; startTime: number; volume: number }>,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);

  // Write audio files
  for (let i = 0; i < audioBlobs.length; i++) {
    const buffer = await audioBlobs[i].blob.arrayBuffer();
    await writeFile(ffmpeg, `audio${i}.mp3`, new Uint8Array(buffer));
  }

  // Mix audio (simplified - real implementation needs complex filter)
  const args = ['-i', 'audio0.mp3'];

  for (let i = 1; i < audioBlobs.length; i++) {
    args.push('-i', `audio${i}.mp3`);
  }

  args.push('-filter_complex', 'amix=inputs=' + audioBlobs.length, 'output.mp3');

  await exec(ffmpeg, args);

  const data = await readFile(ffmpeg, 'output.mp3');
  return new Blob([new Uint8Array(data).buffer], { type: 'audio/mpeg' });
}

export async function combineVideoAndAudio(
  videoBlob: Blob,
  audioBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);

  // Write input files
  await writeFile(ffmpeg, 'video.mp4', new Uint8Array(await videoBlob.arrayBuffer()));
  await writeFile(ffmpeg, 'audio.mp3', new Uint8Array(await audioBlob.arrayBuffer()));

  // Combine video and audio
  await exec(ffmpeg, [
    '-i', 'video.mp4',
    '-i', 'audio.mp3',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-strict', 'experimental',
    'output.mp4'
  ]);

  const data = await readFile(ffmpeg, 'output.mp4');
  return new Blob([new Uint8Array(data).buffer], { type: 'video/mp4' });
}
