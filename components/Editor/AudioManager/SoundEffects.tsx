'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Volume2 } from 'lucide-react';

export const SoundEffects: React.FC = () => {
  const { currentTime, addAudioTrack } = useEditorStore();

  const effects = [
    { name: 'Whoosh', duration: 0.5 },
    { name: 'Pop', duration: 0.3 },
    { name: 'Click', duration: 0.1 },
    { name: 'Swoosh', duration: 0.4 },
  ];

  const handleAddEffect = (effect: typeof effects[0]) => {
    addAudioTrack({
      type: 'sound-effect',
      startTime: currentTime,
      duration: effect.duration,
      volume: 0.8,
    });
    alert(`Added ${effect.name} effect at ${currentTime.toFixed(2)}s`);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        Sound Effects
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {effects.map((effect) => (
          <button
            key={effect.name}
            onClick={() => handleAddEffect(effect)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
          >
            {effect.name}
          </button>
        ))}
      </div>
    </div>
  );
};
