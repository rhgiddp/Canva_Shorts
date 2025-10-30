'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { TTSLanguage, generateTTSBrowser, getVoicesByLanguage } from '@/lib/tts';
import { Mic, Play, Pause } from 'lucide-react';

export const TTSGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<TTSLanguage>('en');
  const [speed, setSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const { currentTime, addAudioTrack } = useEditorStore();

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateTTSBrowser({ text, language, speed });

      addAudioTrack({
        type: 'tts',
        startTime: currentTime,
        duration: result.duration,
        volume: 1,
      });

      alert('TTS audio added to timeline');
      setText('');
    } catch (error) {
      alert('Failed to generate TTS');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
        <Mic className="w-4 h-4" />
        Text-to-Speech
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-2">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for TTS..."
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as TTSLanguage)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="en">English</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Speed: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!text.trim() || isGenerating}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm"
        >
          {isGenerating ? 'Generating...' : 'Generate TTS'}
        </button>
      </div>
    </div>
  );
};
