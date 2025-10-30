import { fabric } from 'fabric';

export interface TimelineTrack {
  id: string;
  type: 'video' | 'canvas' | 'audio';
  clips: TimelineClip[];
  locked?: boolean;
  visible?: boolean;
}

export interface TimelineClip {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  url?: string;
  transition?: Transition;
}

export interface Transition {
  type: 'fade' | 'wipe' | 'dissolve';
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface EditorProject {
  id: string;
  name: string;
  tracks: TimelineTrack[];
  canvasElements: fabric.Object[];
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  fps: number;
  resolution: { width: number; height: number };
  duration: number;
  backgroundColor?: string;
}

export interface AudioTrack {
  id: string;
  type: 'tts' | 'music' | 'sound-effect';
  startTime: number;
  duration: number;
  url?: string;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface TTSSettings {
  text: string;
  language: 'ko' | 'en' | 'ja';
  voice?: string;
  speed: number;
}
