import { create } from 'zustand';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import {
  TimelineTrack,
  TimelineClip,
  EditorProject,
  ProjectSettings,
  AudioTrack,
} from '@/types/editor';

interface EditorState {
  // Project state
  currentProject: EditorProject | null;
  projectId: string | null;

  // Timeline state
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoom: number; // Timeline zoom level (pixels per second)

  // Selection state
  selectedTrackId: string | null;
  selectedClipId: string | null;
  selectedCanvasElementId: string | null;

  // Canvas state
  canvasElements: fabric.Object[];

  // Audio state
  audioTracks: AudioTrack[];

  // Project settings
  settings: ProjectSettings;

  // UI state
  isExporting: boolean;
  exportProgress: number;

  // Actions - Project
  createProject: (name: string) => void;
  loadProject: (project: EditorProject) => void;
  saveProject: () => Promise<void>;
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;

  // Actions - Timeline
  addTrack: (type: 'video' | 'canvas' | 'audio') => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<TimelineTrack>) => void;

  // Actions - Clips
  addClip: (trackId: string, clip: Omit<TimelineClip, 'id'>) => void;
  removeClip: (trackId: string, clipId: string) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<TimelineClip>) => void;
  moveClip: (trackId: string, clipId: string, newStartTime: number) => void;

  // Actions - Playback
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;

  // Actions - Selection
  selectTrack: (trackId: string | null) => void;
  selectClip: (clipId: string | null) => void;
  selectCanvasElement: (elementId: string | null) => void;

  // Actions - Canvas
  addCanvasElement: (element: fabric.Object) => void;
  removeCanvasElement: (elementId: string) => void;
  updateCanvasElement: (elementId: string, updates: Partial<fabric.Object>) => void;
  clearCanvas: () => void;

  // Actions - Audio
  addAudioTrack: (audio: Omit<AudioTrack, 'id'>) => void;
  removeAudioTrack: (audioId: string) => void;
  updateAudioTrack: (audioId: string, updates: Partial<AudioTrack>) => void;

  // Actions - Timeline UI
  setZoom: (zoom: number) => void;

  // Actions - Export
  setExporting: (isExporting: boolean) => void;
  setExportProgress: (progress: number) => void;
}

const defaultSettings: ProjectSettings = {
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  duration: 0,
  backgroundColor: '#000000',
};

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  currentProject: null,
  projectId: null,
  tracks: [],
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  zoom: 100, // 100px per second
  selectedTrackId: null,
  selectedClipId: null,
  selectedCanvasElementId: null,
  canvasElements: [],
  audioTracks: [],
  settings: defaultSettings,
  isExporting: false,
  exportProgress: 0,

  // Project actions
  createProject: (name: string) => {
    const projectId = uuidv4();
    const now = new Date();

    const newProject: EditorProject = {
      id: projectId,
      name,
      tracks: [],
      canvasElements: [],
      settings: { ...defaultSettings },
      createdAt: now,
      updatedAt: now,
    };

    set({
      currentProject: newProject,
      projectId,
      tracks: [],
      canvasElements: [],
      audioTracks: [],
      settings: { ...defaultSettings },
      currentTime: 0,
      duration: 0,
    });
  },

  loadProject: (project: EditorProject) => {
    set({
      currentProject: project,
      projectId: project.id,
      tracks: project.tracks,
      canvasElements: project.canvasElements,
      settings: project.settings,
      duration: project.settings.duration,
      currentTime: 0,
    });
  },

  saveProject: async () => {
    const state = get();
    if (!state.currentProject) return;

    const updatedProject: EditorProject = {
      ...state.currentProject,
      tracks: state.tracks,
      canvasElements: state.canvasElements,
      settings: state.settings,
      updatedAt: new Date(),
    };

    set({ currentProject: updatedProject });

    // TODO: Save to backend or localStorage
    console.log('Project saved:', updatedProject);
  },

  updateProjectSettings: (settings: Partial<ProjectSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },

  // Timeline actions
  addTrack: (type: 'video' | 'canvas' | 'audio') => {
    const newTrack: TimelineTrack = {
      id: uuidv4(),
      type,
      clips: [],
      locked: false,
      visible: true,
    };

    set((state) => ({
      tracks: [...state.tracks, newTrack],
    }));
  },

  removeTrack: (trackId: string) => {
    set((state) => ({
      tracks: state.tracks.filter((track) => track.id !== trackId),
      selectedTrackId: state.selectedTrackId === trackId ? null : state.selectedTrackId,
    }));
  },

  updateTrack: (trackId: string, updates: Partial<TimelineTrack>) => {
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, ...updates } : track
      ),
    }));
  },

  // Clip actions
  addClip: (trackId: string, clip: Omit<TimelineClip, 'id'>) => {
    const newClip: TimelineClip = {
      id: uuidv4(),
      ...clip,
    };

    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, clips: [...track.clips, newClip] }
          : track
      ),
      duration: Math.max(state.duration, newClip.endTime),
    }));
  },

  removeClip: (trackId: string, clipId: string) => {
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, clips: track.clips.filter((clip) => clip.id !== clipId) }
          : track
      ),
      selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId,
    }));
  },

  updateClip: (trackId: string, clipId: string, updates: Partial<TimelineClip>) => {
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              clips: track.clips.map((clip) =>
                clip.id === clipId ? { ...clip, ...updates } : clip
              ),
            }
          : track
      ),
    }));
  },

  moveClip: (trackId: string, clipId: string, newStartTime: number) => {
    set((state) => {
      const track = state.tracks.find((t) => t.id === trackId);
      if (!track) return state;

      const clip = track.clips.find((c) => c.id === clipId);
      if (!clip) return state;

      const duration = clip.endTime - clip.startTime;
      const newEndTime = newStartTime + duration;

      return {
        tracks: state.tracks.map((t) =>
          t.id === trackId
            ? {
                ...t,
                clips: t.clips.map((c) =>
                  c.id === clipId
                    ? { ...c, startTime: newStartTime, endTime: newEndTime }
                    : c
                ),
              }
            : t
        ),
        duration: Math.max(state.duration, newEndTime),
      };
    });
  },

  // Playback actions
  setCurrentTime: (time: number) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  stop: () => {
    set({ isPlaying: false, currentTime: 0 });
  },

  seek: (time: number) => {
    set({
      currentTime: Math.max(0, Math.min(time, get().duration)),
      isPlaying: false,
    });
  },

  // Selection actions
  selectTrack: (trackId: string | null) => {
    set({ selectedTrackId: trackId });
  },

  selectClip: (clipId: string | null) => {
    set({ selectedClipId: clipId });
  },

  selectCanvasElement: (elementId: string | null) => {
    set({ selectedCanvasElementId: elementId });
  },

  // Canvas actions
  addCanvasElement: (element: fabric.Object) => {
    set((state) => ({
      canvasElements: [...state.canvasElements, element],
    }));
  },

  removeCanvasElement: (elementId: string) => {
    set((state) => ({
      canvasElements: state.canvasElements.filter((el: any) => el.id !== elementId),
      selectedCanvasElementId:
        state.selectedCanvasElementId === elementId ? null : state.selectedCanvasElementId,
    }));
  },

  updateCanvasElement: (elementId: string, updates: Partial<fabric.Object>) => {
    set((state) => ({
      canvasElements: state.canvasElements.map((el: any) =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
    }));
  },

  clearCanvas: () => {
    set({ canvasElements: [], selectedCanvasElementId: null });
  },

  // Audio actions
  addAudioTrack: (audio: Omit<AudioTrack, 'id'>) => {
    const newAudio: AudioTrack = {
      id: uuidv4(),
      ...audio,
    };

    set((state) => ({
      audioTracks: [...state.audioTracks, newAudio],
      duration: Math.max(state.duration, audio.startTime + audio.duration),
    }));
  },

  removeAudioTrack: (audioId: string) => {
    set((state) => ({
      audioTracks: state.audioTracks.filter((audio) => audio.id !== audioId),
    }));
  },

  updateAudioTrack: (audioId: string, updates: Partial<AudioTrack>) => {
    set((state) => ({
      audioTracks: state.audioTracks.map((audio) =>
        audio.id === audioId ? { ...audio, ...updates } : audio
      ),
    }));
  },

  // Timeline UI actions
  setZoom: (zoom: number) => {
    set({ zoom: Math.max(10, Math.min(500, zoom)) });
  },

  // Export actions
  setExporting: (isExporting: boolean) => {
    set({ isExporting });
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: Math.max(0, Math.min(100, progress)) });
  },
}));
