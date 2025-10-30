'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';

export default function PromptInput() {
  const { currentPrompt, setPrompt, generateImage, generateBatch, isGenerating } =
    useImageStore();
  const [batchCount, setBatchCount] = useState(1);
  const [localPrompt, setLocalPrompt] = useState(currentPrompt);

  const handleGenerate = async () => {
    if (!localPrompt.trim()) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    setPrompt(localPrompt);

    try {
      if (batchCount === 1) {
        await generateImage(localPrompt);
      } else {
        await generateBatch(batchCount);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        이미지 생성 프롬프트
      </h3>

      {/* Prompt Input */}
      <div>
        <textarea
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          placeholder="생성하고 싶은 이미지를 설명해주세요...
예: 나노바나나 스타일의 귀여운 캐릭터, 파란색 머리, 웃고 있는 표정"
          rows={6}
          maxLength={2000}
          disabled={isGenerating}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="text-xs text-gray-500 text-right mt-1">
          {localPrompt.length} / 2000
        </div>
      </div>

      {/* Batch Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          생성 개수
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => setBatchCount(count)}
              disabled={isGenerating}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                batchCount === count
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {count}개
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !localPrompt.trim()}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            생성 중...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            이미지 생성하기
          </>
        )}
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-600 text-center">
        💡 팁: 구체적인 설명일수록 더 정확한 이미지가 생성됩니다
      </p>
    </div>
  );
}
