'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { TimelineTrack } from './TimelineTrack';
import { Plus, ZoomIn, ZoomOut } from 'lucide-react';

export const VideoTimeline: React.FC = () => {
  const {
    tracks,
    currentTime,
    duration,
    zoom,
    setZoom,
    setCurrentTime,
    addTrack,
    selectClip,
  } = useEditorStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  // Format time in mm:ss format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate time markers
  const generateTimeMarkers = () => {
    const markers: React.ReactElement[] = [];
    const interval = zoom < 50 ? 10 : zoom < 100 ? 5 : 1;

    for (let i = 0; i <= Math.ceil(duration); i += interval) {
      markers.push(
        <div
          key={i}
          className="absolute top-0 bottom-0 flex flex-col"
          style={{ left: `${i * zoom}px` }}
        >
          <div className="text-xs text-gray-400 px-1">{formatTime(i)}</div>
          <div className="w-px bg-gray-600 flex-1" />
        </div>
      );
    }

    return markers;
  };

  // Handle playhead drag
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 192; // Subtract header width (w-48 = 192px)
    const time = Math.max(0, x / zoom);

    setCurrentTime(time);
    selectClip(null);
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingPlayhead || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 192;
      const time = Math.max(0, x / zoom);

      setCurrentTime(time);
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
    };

    if (isDraggingPlayhead) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingPlayhead, zoom, setCurrentTime]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.5, 500));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.5, 10));
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Timeline header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-200">Timeline</h3>

        <div className="flex-1" />

        {/* Add track buttons */}
        <button
          onClick={() => addTrack('video')}
          className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Video Track
        </button>

        <button
          onClick={() => addTrack('canvas')}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Canvas Track
        </button>

        <button
          onClick={() => addTrack('audio')}
          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Audio Track
        </button>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 ml-4 border-l border-gray-700 pl-4">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-gray-700 rounded"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-xs text-gray-400 min-w-[60px] text-center">
            {Math.round(zoom)}px/s
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-gray-700 rounded"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Timeline content */}
      <div className="flex-1 overflow-auto" ref={timelineRef}>
        {/* Time ruler */}
        <div className="flex sticky top-0 z-10 bg-gray-850 border-b border-gray-700">
          <div className="w-48 flex-shrink-0 bg-gray-800 border-r border-gray-700" />
          <div className="relative h-8" style={{ width: `${duration * zoom + 1000}px` }}>
            {generateTimeMarkers()}
          </div>
        </div>

        {/* Tracks */}
        {tracks.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <p className="text-sm">No tracks yet</p>
              <p className="text-xs mt-1">Add a track to get started</p>
            </div>
          </div>
        ) : (
          <div onClick={() => selectClip(null)}>
            {tracks.map((track) => (
              <TimelineTrack key={track.id} track={track} zoom={zoom} />
            ))}
          </div>
        )}

        {/* Playhead */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 cursor-ew-resize z-20 pointer-events-none"
            style={{ left: `${192 + currentTime * zoom}px` }}
          >
            <div
              className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 pointer-events-auto cursor-grab active:cursor-grabbing"
              style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
              onMouseDown={handlePlayheadMouseDown}
            />
          </div>
        )}
      </div>

      {/* Timeline footer */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <span className="text-gray-300">{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
