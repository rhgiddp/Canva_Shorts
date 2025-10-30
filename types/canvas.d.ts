import { fabric } from 'fabric';

declare module 'fabric' {
  interface IObjectOptions {
    id?: string;
    keyframes?: Keyframe[];
  }
}

export interface Keyframe {
  time: number;
  properties: {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    opacity?: number;
  };
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export interface CanvasElement extends fabric.Object {
  id: string;
  keyframes?: Keyframe[];
}
