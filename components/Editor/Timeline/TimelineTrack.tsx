'use client';

import React from 'react';
import { TimelineTrack as TimelineTrackType } from '@/types/editor';
import { useEditorStore } from '@/store/editorStore';
import { TimelineClip } from './TimelineClip';
import { Video, Layers, Music, Lock, Eye, EyeOff } from 'lucide-react';

interface TimelineTrackProps {
  track: TimelineTrackType;
  zoom: number;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ track, zoom }) => {
  const { selectedTrackId, selectTrack, updateTrack, removeTrack } = useEditorStore();

  const isSelected = selectedTrackId === track.id;

  const getTrackIcon = () => {
    switch (track.type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'canvas':
        return <Layers className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTrackColor = () => {
    switch (track.type) {
      case 'video':
        return 'bg-gray-700';
      case 'canvas':
        return 'bg-gray-750';
      case 'audio':
        return 'bg-gray-800';
      default:
        return 'bg-gray-700';
    }
  };

  const handleTrackClick = () => {
    selectTrack(track.id);
  };

  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTrack(track.id, { locked: !track.locked });
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTrack(track.id, { visible: !track.visible });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this track?')) {
      removeTrack(track.id);
    }
  };

  return (
    <div
      className={`flex border-b border-gray-600 ${isSelected ? 'bg-gray-650' : ''}`}
      onClick={handleTrackClick}
    >
      {/* Track header */}
      <div className="w-48 flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-800 border-r border-gray-600">
        <div className="text-gray-300">{getTrackIcon()}</div>
        <div className="flex-1 text-sm text-gray-200 capitalize">{track.type}</div>

        {/* Track controls */}
        <div className="flex gap-1">
          <button
            onClick={toggleVisibility}
            className="p-1 hover:bg-gray-700 rounded"
            title={track.visible ? 'Hide track' : 'Show track'}
          >
            {track.visible ? (
              <Eye className="w-3 h-3 text-gray-400" />
            ) : (
              <EyeOff className="w-3 h-3 text-gray-500" />
            )}
          </button>

          <button
            onClick={toggleLock}
            className="p-1 hover:bg-gray-700 rounded"
            title={track.locked ? 'Unlock track' : 'Lock track'}
          >
            <Lock
              className={`w-3 h-3 ${track.locked ? 'text-red-400' : 'text-gray-400'}`}
            />
          </button>

          <button
            onClick={handleDelete}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
            title="Delete track"
          >
            ×
          </button>
        </div>
      </div>

      {/* Track content (clips) */}
      <div className={`flex-1 relative h-16 ${getTrackColor()}`}>
        {track.clips.map((clip) => (
          <TimelineClip key={clip.id} trackId={track.id} clip={clip} zoom={zoom} />
        ))}
      </div>
    </div>
  );
};
