export interface Character {
  name: string;
  base_description: string;
  reference_image?: string | null;
}

export interface Scene {
  action: string;
  angle?: string;
  outfit?: string;
  props?: string;
  background?: string;
  pose_reference?: string;
  dialogue?: string;
}

export interface VideoGenerationRequest {
  character: Character;
  scenes: Scene[];
  video_type: 'story' | 'loop';
  fps: number;
  frames: number;
}

export interface GeneratedImage {
  id: string;
  scene_num?: number;
  image: string; // base64 or URL
  description: string;
  createdAt: Date;
}

export interface GeneratedVideo {
  id: string;
  scene: string | number;
  video_url: string;
  type: 'loop' | 'transition';
  duration: number;
  fps: number;
  frames: number;
  createdAt: Date;
}

export interface VideoSettings {
  fps: number;
  frames: number;
  motionStrength: number;
  videoType: 'story' | 'loop';
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inline_data?: {
          mime_type: string;
          data: string; // base64
        };
        text?: string;
      }>;
    };
  }>;
}

export interface ComfyUIWorkflow {
  [key: string]: {
    class_type: string;
    inputs: Record<string, any>;
  };
}

export interface S3UploadResult {
  url: string;
  key: string;
  bucket: string;
}
