import { Transition } from '@/types/editor';

export type TransitionType = 'fade' | 'wipe' | 'dissolve';
export type WipeDirection = 'left' | 'right' | 'up' | 'down';

export interface TransitionConfig extends Transition {
  id: string;
  name: string;
  description: string;
}

// Available transitions
export const AVAILABLE_TRANSITIONS: TransitionConfig[] = [
  {
    id: 'fade-in',
    type: 'fade',
    name: 'Fade In',
    description: 'Gradually fade from black',
    duration: 1,
  },
  {
    id: 'fade-out',
    type: 'fade',
    name: 'Fade Out',
    description: 'Gradually fade to black',
    duration: 1,
  },
  {
    id: 'crossfade',
    type: 'fade',
    name: 'Crossfade',
    description: 'Smooth blend between clips',
    duration: 1,
  },
  {
    id: 'wipe-left',
    type: 'wipe',
    name: 'Wipe Left',
    description: 'Wipe from right to left',
    duration: 0.5,
    direction: 'left',
  },
  {
    id: 'wipe-right',
    type: 'wipe',
    name: 'Wipe Right',
    description: 'Wipe from left to right',
    duration: 0.5,
    direction: 'right',
  },
  {
    id: 'wipe-up',
    type: 'wipe',
    name: 'Wipe Up',
    description: 'Wipe from bottom to top',
    duration: 0.5,
    direction: 'up',
  },
  {
    id: 'wipe-down',
    type: 'wipe',
    name: 'Wipe Down',
    description: 'Wipe from top to bottom',
    duration: 0.5,
    direction: 'down',
  },
  {
    id: 'dissolve',
    type: 'dissolve',
    name: 'Dissolve',
    description: 'Pixelated transition',
    duration: 0.8,
  },
];

// Get FFmpeg filter string for transition
export function getTransitionFilter(
  transition: Transition,
  width: number,
  height: number
): string {
  const { type, duration, direction } = transition;

  switch (type) {
    case 'fade':
      // Fade transition using fade filter
      return `fade=t=in:st=0:d=${duration}:alpha=1`;

    case 'wipe':
      // Wipe transition using xfade filter
      const xfadeDirection = direction || 'left';
      return `xfade=transition=wipe${xfadeDirection}:duration=${duration}:offset=0`;

    case 'dissolve':
      // Dissolve transition using pixelize and fade
      return `xfade=transition=pixelize:duration=${duration}:offset=0`;

    default:
      return '';
  }
}

// Apply transition using Canvas API (for preview)
export function applyTransitionToCanvas(
  ctx: CanvasRenderingContext2D,
  fromFrame: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
  toFrame: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
  transition: Transition,
  progress: number // 0 to 1
): void {
  const { width, height } = ctx.canvas;

  switch (transition.type) {
    case 'fade':
      // Draw from frame
      ctx.globalAlpha = 1 - progress;
      ctx.drawImage(fromFrame, 0, 0, width, height);

      // Draw to frame
      ctx.globalAlpha = progress;
      ctx.drawImage(toFrame, 0, 0, width, height);

      ctx.globalAlpha = 1;
      break;

    case 'wipe':
      const direction = transition.direction || 'left';

      ctx.save();

      // Draw from frame
      ctx.drawImage(fromFrame, 0, 0, width, height);

      // Clip and draw to frame
      ctx.beginPath();
      switch (direction) {
        case 'left':
          ctx.rect(width * (1 - progress), 0, width * progress, height);
          break;
        case 'right':
          ctx.rect(0, 0, width * progress, height);
          break;
        case 'up':
          ctx.rect(0, height * (1 - progress), width, height * progress);
          break;
        case 'down':
          ctx.rect(0, 0, width, height * progress);
          break;
      }
      ctx.clip();
      ctx.drawImage(toFrame, 0, 0, width, height);

      ctx.restore();
      break;

    case 'dissolve':
      // Simple dissolve using opacity
      ctx.drawImage(fromFrame, 0, 0, width, height);

      ctx.globalAlpha = progress;
      ctx.drawImage(toFrame, 0, 0, width, height);

      ctx.globalAlpha = 1;
      break;
  }
}

// Calculate transition progress based on time
export function calculateTransitionProgress(
  currentTime: number,
  transitionStartTime: number,
  transitionDuration: number
): number {
  if (currentTime < transitionStartTime) return 0;
  if (currentTime > transitionStartTime + transitionDuration) return 1;

  const elapsed = currentTime - transitionStartTime;
  return elapsed / transitionDuration;
}

// Easing functions for smoother transitions
export const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export function applyEasing(progress: number, easing: keyof typeof easingFunctions = 'easeInOut'): number {
  return easingFunctions[easing](progress);
}
