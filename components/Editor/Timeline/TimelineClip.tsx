'use client';

import React, { useRef, useState } from 'react';
import { TimelineClip as TimelineClipType } from '@/types/editor';
import { useEditorStore } from '@/store/editorStore';

interface TimelineClipProps {
  trackId: string;
  clip: TimelineClipType;
  zoom: number;
}

export const TimelineClip: React.FC<TimelineClipProps> = ({ trackId, clip, zoom }) => {
  const { selectedClipId, selectClip, updateClip, moveClip } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);

  const isSelected = selectedClipId === clip.id;

  // Calculate position and width based on time and zoom
  const left = clip.startTime * zoom;
  const width = (clip.endTime - clip.startTime) * zoom;

  const handleClipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectClip(clip.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartTime.current = clip.startTime;
    selectClip(clip.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(side);
    dragStartX.current = e.clientX;
    dragStartTime.current = side === 'left' ? clip.startTime : clip.endTime;
    selectClip(clip.id);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartX.current;
        const deltaTime = deltaX / zoom;
        const newStartTime = Math.max(0, dragStartTime.current + deltaTime);
        moveClip(trackId, clip.id, newStartTime);
      } else if (isResizing) {
        const deltaX = e.clientX - dragStartX.current;
        const deltaTime = deltaX / zoom;

        if (isResizing === 'left') {
          const newStartTime = Math.max(0, Math.min(dragStartTime.current + deltaTime, clip.endTime - 0.1));
          updateClip(trackId, clip.id, {
            startTime: newStartTime,
            duration: clip.endTime - newStartTime,
          });
        } else {
          const newEndTime = Math.max(clip.startTime + 0.1, dragStartTime.current + deltaTime);
          updateClip(trackId, clip.id, {
            endTime: newEndTime,
            duration: newEndTime - clip.startTime,
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, zoom, trackId, clip, dragStartTime, updateClip, moveClip]);

  return (
    <div
      className={`absolute top-1 bottom-1 rounded overflow-hidden cursor-move transition-colors ${
        isSelected ? 'bg-purple-500 ring-2 ring-purple-300' : 'bg-purple-400 hover:bg-purple-450'
      }`}
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
      onClick={handleClipClick}
      onMouseDown={handleMouseDown}
    >
      {/* Resize handle - left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-purple-600"
        onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
      />

      {/* Clip content */}
      <div className="px-2 py-1 text-xs text-white truncate">
        {clip.url ? clip.url.split('/').pop() : 'Clip'}
      </div>

      {/* Transition indicator */}
      {clip.transition && (
        <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-1 rounded-bl">
          {clip.transition.type}
        </div>
      )}

      {/* Resize handle - right */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-purple-600"
        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
      />
    </div>
  );
};
