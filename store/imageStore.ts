/**
 * Image generation state management with Zustand
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { generateImage, buildCharacterPrompt } from '@/lib/gemini';
import type { Character, GeneratedImage } from '@/types/api';

interface ImageState {
  // State
  images: GeneratedImage[];
  currentPrompt: string;
  character: Character | null;
  isGenerating: boolean;
  error: string | null;
  progress: number;

  // Actions
  setPrompt: (prompt: string) => void;
  setCharacter: (character: Character) => void;
  generateImage: (prompt: string, referenceImage?: string) => Promise<void>;
  generateBatch: (count: number) => Promise<void>;
  addImage: (image: GeneratedImage) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  clearError: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
  // Initial state
  images: [],
  currentPrompt: '',
  character: null,
  isGenerating: false,
  error: null,
  progress: 0,

  // Set prompt
  setPrompt: (prompt: string) => {
    set({ currentPrompt: prompt, error: null });
  },

  // Set character
  setCharacter: (character: Character) => {
    set({ character, error: null });
  },

  // Generate single image
  generateImage: async (prompt: string, referenceImage?: string) => {
    set({ isGenerating: true, error: null, progress: 0 });

    try {
      const base64Image = await generateImage({
        prompt,
        referenceImage,
      });

      const newImage: GeneratedImage = {
        id: uuidv4(),
        image: `data:image/png;base64,${base64Image}`,
        description: prompt,
        createdAt: new Date(),
      };

      set((state) => ({
        images: [newImage, ...state.images],
        isGenerating: false,
        progress: 100,
      }));
    } catch (error) {
      set({
        error: (error as Error).message,
        isGenerating: false,
        progress: 0,
      });
      throw error;
    }
  },

  // Generate multiple images in batch
  generateBatch: async (count: number) => {
    const { currentPrompt, character } = get();

    if (!currentPrompt && !character) {
      set({ error: 'Please provide a prompt or character description' });
      return;
    }

    set({ isGenerating: true, error: null, progress: 0 });

    try {
      const finalPrompt = character
        ? buildCharacterPrompt({
            name: character.name,
            baseDescription: character.base_description,
          })
        : currentPrompt;

      for (let i = 0; i < count; i++) {
        try {
          const base64Image = await generateImage({
            prompt: finalPrompt,
            referenceImage: character?.reference_image || undefined,
          });

          const newImage: GeneratedImage = {
            id: uuidv4(),
            scene_num: i + 1,
            image: `data:image/png;base64,${base64Image}`,
            description: finalPrompt,
            createdAt: new Date(),
          };

          set((state) => ({
            images: [newImage, ...state.images],
            progress: ((i + 1) / count) * 100,
          }));
        } catch (err) {
          console.error(`Failed to generate image ${i + 1}:`, err);
          // Continue with remaining images
        }
      }

      set({ isGenerating: false, progress: 100 });
    } catch (error) {
      set({
        error: (error as Error).message,
        isGenerating: false,
        progress: 0,
      });
      throw error;
    }
  },

  // Add image manually
  addImage: (image: GeneratedImage) => {
    set((state) => ({
      images: [image, ...state.images],
    }));
  },

  // Remove image
  removeImage: (id: string) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  // Clear all images
  clearImages: () => {
    set({ images: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
