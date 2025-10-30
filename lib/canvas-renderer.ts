import { fabric } from 'fabric';
import { interpolateKeyframes } from './canvas';

export async function renderCanvasFrames(
  canvas: fabric.Canvas,
  startTime: number,
  endTime: number,
  fps: number,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const frames: Blob[] = [];
  const totalFrames = Math.ceil((endTime - startTime) * fps);
  const frameTime = 1 / fps;

  for (let i = 0; i < totalFrames; i++) {
    const time = startTime + i * frameTime;

    // Update animations
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      interpolateKeyframes(obj, time);
    });

    // Render canvas
    canvas.renderAll();

    // Capture frame as blob
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const blob = await (await fetch(dataURL)).blob();
    frames.push(blob);

    if (onProgress) {
      onProgress((i + 1) / totalFrames);
    }

    // Allow browser to breathe
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return frames;
}
