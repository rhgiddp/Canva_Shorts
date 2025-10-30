/**
 * ComfyUI API client for video generation with SVD
 * Includes Mock implementation for development without ComfyUI server
 */

import { fetchWithRetry, APIError } from './api';
import type { ComfyUIWorkflow } from '@/types/api';
import svdLoopWorkflow from './workflows/svd-loop.json';
import svdStoryWorkflow from './workflows/svd-story.json';

const COMFYUI_URL =
  process.env.NEXT_PUBLIC_COMFYUI_URL || 'http://localhost:8188';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_COMFYUI !== 'false';

export interface VideoGenerationOptions {
  startImageUrl: string;
  endImageUrl?: string;
  fps: number;
  frames: number;
  motionStrength: number;
  videoType: 'loop' | 'story';
  onProgress?: (progress: number) => void;
}

/**
 * Upload image to ComfyUI server
 */
async function uploadImageToComfyUI(
  imageBlob: Blob,
  filename: string
): Promise<void> {
  const formData = new FormData();
  formData.append('image', imageBlob, filename);

  await fetchWithRetry(`${COMFYUI_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Queue workflow for execution
 */
async function queueWorkflow(workflow: ComfyUIWorkflow): Promise<string> {
  const response = await fetchWithRetry(`${COMFYUI_URL}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: workflow }),
  });

  const data = await response.json();
  return data.prompt_id;
}

/**
 * Get execution history/status
 */
async function getHistory(promptId: string): Promise<any> {
  const response = await fetchWithRetry(
    `${COMFYUI_URL}/history/${promptId}`
  );
  return response.json();
}

/**
 * Poll for completion
 */
async function pollForCompletion(
  promptId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const maxAttempts = 60; // 5 minutes max
  const pollInterval = 5000; // 5 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const history = await getHistory(promptId);

    if (history[promptId]?.status?.completed) {
      // Extract output video URL
      const outputs = history[promptId].outputs;
      const videoNode = Object.values(outputs).find(
        (node: any) => node.videos
      ) as any;

      if (videoNode && videoNode.videos && videoNode.videos.length > 0) {
        const videoInfo = videoNode.videos[0];
        return `${COMFYUI_URL}/view?filename=${videoInfo.filename}&subfolder=${videoInfo.subfolder}&type=output`;
      }
    }

    // Update progress
    if (onProgress) {
      const progress = Math.min((attempt / maxAttempts) * 100, 90);
      onProgress(progress);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new APIError('Video generation timed out');
}

/**
 * Generate video using ComfyUI
 */
export async function generateVideo(
  options: VideoGenerationOptions
): Promise<string> {
  // Use mock implementation if ComfyUI is not available
  if (USE_MOCK) {
    return generateVideoMock(options);
  }

  try {
    const {
      startImageUrl,
      endImageUrl,
      fps,
      frames,
      motionStrength,
      videoType,
      onProgress,
    } = options;

    // Download images
    const startBlob = await fetch(startImageUrl).then((r) => r.blob());
    await uploadImageToComfyUI(startBlob, 'start.png');

    if (videoType === 'story' && endImageUrl) {
      const endBlob = await fetch(endImageUrl).then((r) => r.blob());
      await uploadImageToComfyUI(endBlob, 'end.png');
    }

    // Prepare workflow
    const workflow =
      videoType === 'loop'
        ? { ...svdLoopWorkflow }
        : { ...svdStoryWorkflow };

    // Update workflow parameters
    const svdNode = Object.values(workflow).find(
      (node: any) => node.class_type === 'SVDimg2vid'
    ) as any;

    if (svdNode) {
      svdNode.inputs.video_frames = frames;
      svdNode.inputs.fps = fps;
      svdNode.inputs.motion_bucket_id = Math.round(motionStrength * 100);
    }

    // Queue workflow
    const promptId = await queueWorkflow(workflow);

    // Poll for completion
    const videoUrl = await pollForCompletion(promptId, onProgress);

    if (onProgress) {
      onProgress(100);
    }

    return videoUrl;
  } catch (error) {
    throw new APIError(
      `ComfyUI video generation failed: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

/**
 * Mock video generation for development
 */
async function generateVideoMock(
  options: VideoGenerationOptions
): Promise<string> {
  const { onProgress } = options;

  console.log('[MOCK] Generating video with options:', options);

  // Simulate processing time
  const totalSteps = 10;
  for (let i = 0; i <= totalSteps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onProgress) {
      onProgress((i / totalSteps) * 100);
    }
  }

  // Return mock video URL (using start image as placeholder)
  return options.startImageUrl;
}

/**
 * Check if ComfyUI server is available
 */
export async function checkComfyUIAvailability(): Promise<boolean> {
  try {
    await fetchWithRetry(`${COMFYUI_URL}/system_stats`, {
      timeout: 5000,
      retries: 1,
    });
    return true;
  } catch {
    return false;
  }
}
