/**
 * Google Gemini API client for image generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { APIError, blobToBase64 } from './api';
import type { GeminiResponse } from '@/types/api';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn('GOOGLE_API_KEY not found in environment variables');
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!API_KEY) {
    throw new APIError('Google API key is not configured');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export interface GenerateImageOptions {
  prompt: string;
  referenceImage?: string | Blob; // base64 or Blob
  negativePrompt?: string;
}

/**
 * Generate image using Gemini 2.0 Flash
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<string> {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    let parts: any[] = [{ text: options.prompt }];

    // Add reference image if provided
    if (options.referenceImage) {
      let base64Data: string;

      if (typeof options.referenceImage === 'string') {
        base64Data = options.referenceImage;
      } else {
        base64Data = await blobToBase64(options.referenceImage);
      }

      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = result.response;

    // Extract image data from response
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new APIError('No image generated from Gemini');
    }

    const imagePart = candidate.content.parts.find(
      (part: any) => part.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imagePart || !imagePart.inlineData) {
      throw new APIError('No image data in Gemini response');
    }

    // Return base64 image data
    return imagePart.inlineData.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Gemini API error: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

/**
 * Generate multiple images in batch
 */
export async function generateBatch(
  prompts: string[],
  options?: Omit<GenerateImageOptions, 'prompt'>
): Promise<string[]> {
  const results = await Promise.allSettled(
    prompts.map((prompt) =>
      generateImage({ ...options, prompt })
    )
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to generate image ${index + 1}:`, result.reason);
      throw result.reason;
    }
  });
}

/**
 * Build prompt for character image generation
 * Following 나노바나나 style guidelines
 */
export function buildCharacterPrompt(
  character: {
    name: string;
    baseDescription: string;
  },
  scene?: {
    action?: string;
    angle?: string;
    outfit?: string;
    props?: string;
    background?: string;
  }
): string {
  let prompt = `Generate an image of ${character.name}. `;
  prompt += `Character description: ${character.baseDescription}. `;

  if (scene) {
    if (scene.action) prompt += `Action: ${scene.action}. `;
    if (scene.angle) prompt += `Camera angle: ${scene.angle}. `;
    if (scene.outfit) prompt += `Outfit: ${scene.outfit}. `;
    if (scene.props) prompt += `Props: ${scene.props}. `;
    if (scene.background) prompt += `Background: ${scene.background}. `;
  }

  // Add quality prompts
  prompt += 'High quality, detailed, professional artwork, consistent character design, vibrant colors.';

  return prompt;
}
