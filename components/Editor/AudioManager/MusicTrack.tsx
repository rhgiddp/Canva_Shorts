'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Music, Upload, X } from 'lucide-react';

export const MusicTrack: React.FC = () => {
  const [volume, setVolume] = useState(0.7);
  const { currentTime, audioTracks, addAudioTrack, removeAudioTrack } = useEditorStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      addAudioTrack({
        type: 'music',
        startTime: currentTime,
        duration: audio.duration,
        url,
        volume,
      });
    };
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
        <Music className="w-4 h-4" />
        Background Music
      </h3>

      <div className="space-y-4">
        <label className="block">
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer text-sm">
            <Upload className="w-4 h-4" />
            Upload Music
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          {audioTracks.filter(t => t.type === 'music').map((track) => (
            <div key={track.id} className="flex items-center gap-2 p-2 bg-gray-750 rounded text-sm">
              <Music className="w-3 h-3 text-gray-400" />
              <span className="flex-1 text-gray-300 truncate">{track.url}</span>
              <button
                onClick={() => removeAudioTrack(track.id)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
