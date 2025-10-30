import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { Keyframe } from '@/types/canvas';

// Initialize Fabric.js canvas
export function initializeCanvas(
  canvasElement: HTMLCanvasElement,
  options?: fabric.ICanvasOptions
): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasElement, {
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    ...options,
  });

  return canvas;
}

// Dispose of canvas and free memory
export function disposeCanvas(canvas: fabric.Canvas): void {
  canvas.dispose();
}

// Clear all objects from canvas
export function clearCanvas(canvas: fabric.Canvas): void {
  canvas.clear();
}

// Object creation helpers

export function createText(
  text: string,
  options?: Partial<fabric.ITextOptions>
): fabric.Text {
  const textObject = new fabric.Text(text, {
    left: 100,
    top: 100,
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#000000',
    ...options,
  });

  (textObject as any).id = uuidv4();
  return textObject;
}

export function createRect(
  options?: Partial<fabric.IRectOptions>
): fabric.Rect {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: '#ff0000',
    ...options,
  });

  (rect as any).id = uuidv4();
  return rect;
}

export function createCircle(
  options?: Partial<fabric.ICircleOptions>
): fabric.Circle {
  const circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 50,
    fill: '#00ff00',
    ...options,
  });

  (circle as any).id = uuidv4();
  return circle;
}

export function createLine(
  points: number[],
  options?: Partial<fabric.ILineOptions>
): fabric.Line {
  const line = new fabric.Line(points, {
    stroke: '#000000',
    strokeWidth: 2,
    ...options,
  });

  (line as any).id = uuidv4();
  return line;
}

export function createImage(
  url: string,
  options?: Partial<fabric.IImageOptions>
): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        if (!img) {
          reject(new Error('Failed to load image'));
          return;
        }

        img.set({
          left: 100,
          top: 100,
          ...options,
        });

        (img as any).id = uuidv4();
        resolve(img);
      },
      { crossOrigin: 'anonymous' }
    );
  });
}

// Serialization

export interface SerializedCanvas {
  version: string;
  objects: any[];
  background?: string | fabric.Pattern;
}

export function serializeCanvas(canvas: fabric.Canvas): SerializedCanvas {
  return {
    version: '5.3.0',
    objects: canvas.toJSON(['id', 'keyframes']).objects,
    background: canvas.backgroundColor as string | fabric.Pattern,
  };
}

export function deserializeCanvas(
  canvas: fabric.Canvas,
  data: SerializedCanvas
): void {
  canvas.loadFromJSON(
    {
      version: data.version,
      objects: data.objects,
      background: data.background,
    },
    () => {
      canvas.renderAll();
    }
  );
}

// Object manipulation

export function addObject(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.add(object);
  canvas.setActiveObject(object);
  canvas.renderAll();
}

export function removeObject(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.remove(object);
  canvas.renderAll();
}

export function updateObject(
  canvas: fabric.Canvas,
  objectId: string,
  updates: Partial<fabric.Object>
): void {
  const objects = canvas.getObjects();
  const object = objects.find((obj: any) => obj.id === objectId);

  if (object) {
    object.set(updates);
    canvas.renderAll();
  }
}

export function getObjectById(
  canvas: fabric.Canvas,
  objectId: string
): fabric.Object | undefined {
  const objects = canvas.getObjects();
  return objects.find((obj: any) => obj.id === objectId);
}

// Layer management

export function bringToFront(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.bringToFront(object);
  canvas.renderAll();
}

export function sendToBack(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.sendToBack(object);
  canvas.renderAll();
}

export function bringForward(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.bringForward(object);
  canvas.renderAll();
}

export function sendBackwards(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.sendBackwards(object);
  canvas.renderAll();
}

// Selection

export function selectObject(canvas: fabric.Canvas, object: fabric.Object): void {
  canvas.setActiveObject(object);
  canvas.renderAll();
}

export function deselectAll(canvas: fabric.Canvas): void {
  canvas.discardActiveObject();
  canvas.renderAll();
}

export function getActiveObject(canvas: fabric.Canvas): fabric.Object | null | undefined {
  return canvas.getActiveObject();
}

// Keyframe helpers

export function setKeyframe(
  object: fabric.Object,
  time: number,
  properties: Partial<fabric.Object>,
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'easeInOut'
): void {
  const keyframes = (object as any).keyframes || [];

  // Remove existing keyframe at this time
  const filteredKeyframes = keyframes.filter((kf: Keyframe) => kf.time !== time);

  // Add new keyframe
  filteredKeyframes.push({
    time,
    properties,
    easing,
  });

  // Sort by time
  filteredKeyframes.sort((a: Keyframe, b: Keyframe) => a.time - b.time);

  (object as any).keyframes = filteredKeyframes;
}

export function removeKeyframe(object: fabric.Object, time: number): void {
  const keyframes = (object as any).keyframes || [];
  (object as any).keyframes = keyframes.filter((kf: Keyframe) => kf.time !== time);
}

export function getKeyframes(object: fabric.Object): Keyframe[] {
  return (object as any).keyframes || [];
}

export function interpolateKeyframes(
  object: fabric.Object,
  currentTime: number
): void {
  const keyframes = getKeyframes(object);

  if (keyframes.length === 0) return;

  // Find surrounding keyframes
  let prevKeyframe: Keyframe | null = null;
  let nextKeyframe: Keyframe | null = null;

  for (let i = 0; i < keyframes.length; i++) {
    if (keyframes[i].time <= currentTime) {
      prevKeyframe = keyframes[i];
    }
    if (keyframes[i].time > currentTime && !nextKeyframe) {
      nextKeyframe = keyframes[i];
      break;
    }
  }

  // Apply interpolation
  if (prevKeyframe && nextKeyframe) {
    const duration = nextKeyframe.time - prevKeyframe.time;
    const elapsed = currentTime - prevKeyframe.time;
    const progress = elapsed / duration;

    // Apply easing
    const easedProgress = applyEasing(progress, nextKeyframe.easing || 'easeInOut');

    // Interpolate properties
    const interpolated: any = {};

    Object.keys(nextKeyframe.properties).forEach((key) => {
      const startValue = (prevKeyframe!.properties as any)[key] || (object as any)[key];
      const endValue = (nextKeyframe!.properties as any)[key];

      if (typeof startValue === 'number' && typeof endValue === 'number') {
        interpolated[key] = startValue + (endValue - startValue) * easedProgress;
      } else {
        interpolated[key] = easedProgress < 0.5 ? startValue : endValue;
      }
    });

    object.set(interpolated);
  } else if (prevKeyframe) {
    // Use exact keyframe properties
    object.set(prevKeyframe.properties as any);
  }
}

// Easing functions
function applyEasing(
  t: number,
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
): number {
  switch (easing) {
    case 'linear':
      return t;
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t;
  }
}

// Render canvas to image
export function renderToImage(
  canvas: fabric.Canvas,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1
): string {
  return canvas.toDataURL({
    format,
    quality,
  });
}

// Clone object
export function cloneObject(object: fabric.Object): Promise<fabric.Object> {
  return new Promise((resolve) => {
    object.clone((cloned: fabric.Object) => {
      (cloned as any).id = uuidv4();
      resolve(cloned);
    }, ['id', 'keyframes']);
  });
}
