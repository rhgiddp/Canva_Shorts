'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const {
    tracks,
    currentTime,
    duration,
    isPlaying,
    settings,
    play,
    pause,
    stop,
    setCurrentTime,
  } = useEditorStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get or create video element
  const getOrCreateVideo = useCallback((clipId: string, url: string): HTMLVideoElement => {
    let video = videoRefs.current.get(clipId);

    if (!video) {
      video = document.createElement('video');
      video.src = url;
      video.muted = isMuted;
      video.volume = volume;
      video.preload = 'auto';
      videoRefs.current.set(clipId, video);
    }

    return video;
  }, [isMuted, volume]);

  // Render current frame
  const renderFrame = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = settings.backgroundColor || '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find and render active video clips
    const videoTracks = tracks.filter((track) => track.type === 'video' && track.visible);

    videoTracks.forEach((track) => {
      track.clips.forEach((clip) => {
        if (time >= clip.startTime && time < clip.endTime && clip.url) {
          const video = getOrCreateVideo(clip.id, clip.url);

          if (video.readyState >= 2) {
            // HAVE_CURRENT_DATA
            const videoTime = time - clip.startTime;
            video.currentTime = videoTime;

            // Apply transition if exists
            if (clip.transition) {
              // TODO: Apply transition effect
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } else {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
          }
        }
      });
    });

    // TODO: Render canvas elements overlay
  }, [tracks, settings, getOrCreateVideo]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = settings.resolution.width;
    canvas.height = settings.resolution.height;
  }, [settings.resolution]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let startTime = performance.now();
    let pausedTime = 0;

    const updateFrame = (timestamp: number) => {
      if (!isPlaying) return;

      const elapsed = (timestamp - startTime - pausedTime) / 1000;
      const newTime = lastTimeRef.current + elapsed;

      if (newTime >= duration) {
        stop();
        return;
      }

      setCurrentTime(newTime);
      renderFrame(newTime);

      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration, setCurrentTime, stop, renderFrame]);

  // Update last time when playback state changes
  useEffect(() => {
    lastTimeRef.current = currentTime;
  }, [isPlaying, currentTime]);

  // Playback controls
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
      }
      play();
    }
  };

  const handleStop = () => {
    stop();
    renderFrame(0);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 1);
    setCurrentTime(newTime);
    renderFrame(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 1);
    setCurrentTime(newTime);
    renderFrame(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    // Update all video elements
    videoRefs.current.forEach((video) => {
      video.volume = newVolume;
      video.muted = newVolume === 0;
    });
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    videoRefs.current.forEach((video) => {
      video.muted = newMuted;
    });
  };

  const handleFullscreen = () => {
    if (!canvasRef.current) return;

    if (!isFullscreen) {
      canvasRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Render frame when time changes (and not playing)
  useEffect(() => {
    if (!isPlaying) {
      renderFrame(currentTime);
    }
  }, [currentTime, isPlaying, renderFrame]);

  // Cleanup video elements on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      });
      videoRefs.current.clear();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Video canvas */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full border border-gray-700 rounded"
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        {/* Playback controls */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={handleSkipBackward}
            className="p-2 hover:bg-gray-700 rounded text-gray-300"
            title="Skip backward 1s"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <button
            onClick={handleSkipForward}
            className="p-2 hover:bg-gray-700 rounded text-gray-300"
            title="Skip forward 1s"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Time display */}
          <div className="text-sm text-gray-300 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex-1" />

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="p-2 hover:bg-gray-700 rounded text-gray-300"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-gray-700 rounded text-gray-300"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-700 rounded cursor-pointer group">
          <div
            className="absolute top-0 left-0 h-full bg-purple-600 rounded transition-all"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
            }}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
