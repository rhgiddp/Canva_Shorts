/**
 * Video generation state management with Zustand
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { GeneratedVideo, VideoSettings } from '@/types/api';

interface VideoState {
  // State
  videos: GeneratedVideo[];
  startImage: string | null;
  endImage: string | null;
  videoType: 'story' | 'loop';
  settings: VideoSettings;
  isGenerating: boolean;
  progress: number;
  error: string | null;

  // Actions
  setStartImage: (image: string) => void;
  setEndImage: (image: string) => void;
  setVideoType: (type: 'story' | 'loop') => void;
  setSettings: (settings: Partial<VideoSettings>) => void;
  generateVideo: () => Promise<void>;
  addVideo: (video: GeneratedVideo) => void;
  removeVideo: (id: string) => void;
  clearVideos: () => void;
  clearError: () => void;
}

const defaultSettings: VideoSettings = {
  fps: 8,
  frames: 25,
  motionStrength: 0.5,
  videoType: 'loop',
};

export const useVideoStore = create<VideoState>((set, get) => ({
  // Initial state
  videos: [],
  startImage: null,
  endImage: null,
  videoType: 'loop',
  settings: defaultSettings,
  isGenerating: false,
  progress: 0,
  error: null,

  // Set start image
  setStartImage: (image: string) => {
    set({ startImage: image, error: null });
  },

  // Set end image
  setEndImage: (image: string) => {
    set({ endImage: image, error: null });
  },

  // Set video type
  setVideoType: (type: 'story' | 'loop') => {
    set((state) => ({
      videoType: type,
      settings: { ...state.settings, videoType: type },
      // Clear end image if switching to loop mode
      endImage: type === 'loop' ? null : state.endImage,
    }));
  },

  // Update settings
  setSettings: (newSettings: Partial<VideoSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  // Generate video
  generateVideo: async () => {
    const { startImage, endImage, videoType, settings } = get();

    // Validation
    if (!startImage) {
      set({ error: '시작 이미지를 선택해주세요.' });
      return;
    }

    if (videoType === 'story' && !endImage) {
      set({ error: 'Story 모드에서는 끝 이미지가 필요합니다.' });
      return;
    }

    set({ isGenerating: true, error: null, progress: 0 });

    try {
      // TODO: Implement ComfyUI workflow execution
      // For now, simulate video generation
      await new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          set({ progress });
          if (progress >= 100) {
            clearInterval(interval);
            resolve(null);
          }
        }, 500);
      });

      // Mock generated video
      const newVideo: GeneratedVideo = {
        id: uuidv4(),
        scene: videoType === 'story' ? 'transition' : 'loop',
        video_url: startImage, // Mock: using start image as placeholder
        type: videoType === 'story' ? 'transition' : 'loop',
        duration: settings.frames / settings.fps,
        fps: settings.fps,
        frames: settings.frames,
        createdAt: new Date(),
      };

      set((state) => ({
        videos: [newVideo, ...state.videos],
        isGenerating: false,
        progress: 100,
      }));

      console.log('Video generated (mock):', newVideo);
    } catch (error) {
      set({
        error: (error as Error).message,
        isGenerating: false,
        progress: 0,
      });
      throw error;
    }
  },

  // Add video manually
  addVideo: (video: GeneratedVideo) => {
    set((state) => ({
      videos: [video, ...state.videos],
    }));
  },

  // Remove video
  removeVideo: (id: string) => {
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    }));
  },

  // Clear all videos
  clearVideos: () => {
    set({ videos: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
