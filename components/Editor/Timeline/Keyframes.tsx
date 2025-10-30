'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { setKeyframe, removeKeyframe, getKeyframes } from '@/lib/canvas';
import { Keyframe as KeyframeType } from '@/types/canvas';
import { Plus, X } from 'lucide-react';

export const Keyframes: React.FC = () => {
  const {
    selectedCanvasElementId,
    currentTime,
    zoom,
  } = useEditorStore();

  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('left');
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [easingType, setEasingType] = useState<'linear' | 'easeIn' | 'easeOut' | 'easeInOut'>('easeInOut');

  // Mock keyframes for now - should come from selected canvas element
  const keyframes: KeyframeType[] = selectedCanvasElementId
    ? []
    : [];

  const properties = [
    { value: 'left', label: 'Position X' },
    { value: 'top', label: 'Position Y' },
    { value: 'scaleX', label: 'Scale X' },
    { value: 'scaleY', label: 'Scale Y' },
    { value: 'angle', label: 'Rotation' },
    { value: 'opacity', label: 'Opacity' },
  ];

  const easingOptions = [
    { value: 'linear', label: 'Linear' },
    { value: 'easeIn', label: 'Ease In' },
    { value: 'easeOut', label: 'Ease Out' },
    { value: 'easeInOut', label: 'Ease In/Out' },
  ];

  const handleAddKeyframe = () => {
    if (!selectedCanvasElementId) {
      alert('Please select a canvas element first');
      return;
    }

    setShowPropertyDialog(true);
  };

  const handleCreateKeyframe = () => {
    if (!selectedCanvasElementId || !propertyValue.trim()) return;

    const value = parseFloat(propertyValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    // TODO: Get the actual fabric object and set keyframe
    // For now, just close dialog
    setShowPropertyDialog(false);
    setPropertyValue('');
  };

  const handleRemoveKeyframe = (time: number) => {
    if (!selectedCanvasElementId) return;

    // TODO: Remove keyframe from fabric object
    alert(`Remove keyframe at ${time.toFixed(2)}s`);
  };

  if (!selectedCanvasElementId) {
    return (
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="text-sm text-gray-500 text-center">
          Select a canvas element to edit keyframes
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-bold text-gray-200">Keyframes</h3>
        <button
          onClick={handleAddKeyframe}
          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Keyframe
        </button>
      </div>

      {/* Keyframe list */}
      <div className="p-4">
        {keyframes.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            No keyframes yet. Click &quot;Add Keyframe&quot; to start animating.
          </div>
        ) : (
          <div className="space-y-2">
            {keyframes.map((keyframe, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-750 rounded"
              >
                <div className="flex-1">
                  <div className="text-sm text-gray-200">
                    {keyframe.time.toFixed(2)}s
                  </div>
                  <div className="text-xs text-gray-400">
                    {Object.entries(keyframe.properties)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveKeyframe(keyframe.time)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Keyframe Dialog */}
      {showPropertyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">Add Keyframe</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Time: {currentTime.toFixed(2)}s
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Property</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {properties.map((prop) => (
                  <option key={prop.value} value={prop.value}>
                    {prop.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Value</label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="any"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Easing</label>
              <select
                value={easingType}
                onChange={(e) => setEasingType(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {easingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateKeyframe}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowPropertyDialog(false);
                  setPropertyValue('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
