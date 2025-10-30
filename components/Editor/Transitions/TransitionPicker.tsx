'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { AVAILABLE_TRANSITIONS, TransitionConfig } from '@/lib/transitions';
import { Transition } from '@/types/editor';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  X,
} from 'lucide-react';

interface TransitionPickerProps {
  trackId: string;
  clipId: string;
  currentTransition?: Transition;
  onClose?: () => void;
}

export const TransitionPicker: React.FC<TransitionPickerProps> = ({
  trackId,
  clipId,
  currentTransition,
  onClose,
}) => {
  const { updateClip } = useEditorStore();
  const [selectedTransition, setSelectedTransition] = useState<TransitionConfig | null>(
    currentTransition
      ? AVAILABLE_TRANSITIONS.find((t) => t.type === currentTransition.type) || null
      : null
  );
  const [duration, setDuration] = useState(currentTransition?.duration || 1);

  const getTransitionIcon = (config: TransitionConfig) => {
    if (config.type === 'wipe') {
      switch (config.direction) {
        case 'left':
          return <ArrowLeft className="w-4 h-4" />;
        case 'right':
          return <ArrowRight className="w-4 h-4" />;
        case 'up':
          return <ArrowUp className="w-4 h-4" />;
        case 'down':
          return <ArrowDown className="w-4 h-4" />;
      }
    }
    return <Sparkles className="w-4 h-4" />;
  };

  const handleSelectTransition = (config: TransitionConfig) => {
    setSelectedTransition(config);
  };

  const handleApply = () => {
    if (selectedTransition) {
      const transition: Transition = {
        type: selectedTransition.type,
        duration,
        direction: selectedTransition.direction,
      };

      updateClip(trackId, clipId, { transition });
    }
    onClose?.();
  };

  const handleRemove = () => {
    updateClip(trackId, clipId, { transition: undefined });
    onClose?.();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-200">Select Transition</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Transition grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {AVAILABLE_TRANSITIONS.map((config) => (
          <button
            key={config.id}
            onClick={() => handleSelectTransition(config)}
            className={`p-3 rounded border-2 text-left transition-colors ${
              selectedTransition?.id === config.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-750 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-gray-300">{getTransitionIcon(config)}</div>
              <div className="text-sm font-medium text-gray-200">{config.name}</div>
            </div>
            <div className="text-xs text-gray-400">{config.description}</div>
          </button>
        ))}
      </div>

      {/* Duration slider */}
      {selectedTransition && (
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">
            Duration: {duration.toFixed(1)}s
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {currentTransition && (
          <button
            onClick={handleRemove}
            className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Remove
          </button>
        )}
        <button
          onClick={handleApply}
          disabled={!selectedTransition}
          className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
