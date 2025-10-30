'use client';

import { useVideoStore } from '@/store/videoStore';

export default function VideoSettings() {
  const { videoType, settings, setVideoType, setSettings } = useVideoStore();

  const handleFpsChange = (fps: number) => {
    setSettings({ fps });
  };

  const handleFramesChange = (frames: number) => {
    setSettings({ frames });
  };

  const handleMotionChange = (motionStrength: number) => {
    setSettings({ motionStrength });
  };

  const expectedDuration = settings.frames / settings.fps;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800">비디오 설정</h3>

      {/* Video Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          비디오 타입
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setVideoType('loop')}
            className={`p-4 rounded-lg border-2 transition-all ${
              videoType === 'loop'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-gray-800">Loop 모드</div>
            <div className="text-xs text-gray-500 mt-1">
              같은 이미지로 반복 애니메이션
            </div>
          </button>

          <button
            onClick={() => setVideoType('story')}
            className={`p-4 rounded-lg border-2 transition-all ${
              videoType === 'story'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-300 hover:border-pink-300'
            }`}
          >
            <div className="text-2xl mb-2">📖</div>
            <div className="font-medium text-gray-800">Story 모드</div>
            <div className="text-xs text-gray-500 mt-1">
              시작↔끝 이미지 전환
            </div>
          </button>
        </div>
      </div>

      {/* FPS Setting */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">FPS (초당 프레임)</label>
          <input
            type="number"
            value={settings.fps}
            onChange={(e) => handleFpsChange(Number(e.target.value))}
            min={4}
            max={30}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <input
          type="range"
          value={settings.fps}
          onChange={(e) => handleFpsChange(Number(e.target.value))}
          min={4}
          max={30}
          step={1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>8 (권장)</span>
          <span>30</span>
        </div>
      </div>

      {/* Frames Setting */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">프레임 수</label>
          <input
            type="number"
            value={settings.frames}
            onChange={(e) => handleFramesChange(Number(e.target.value))}
            min={10}
            max={50}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <input
          type="range"
          value={settings.frames}
          onChange={(e) => handleFramesChange(Number(e.target.value))}
          min={10}
          max={50}
          step={1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10</span>
          <span>25 (권장)</span>
          <span>50</span>
        </div>
      </div>

      {/* Expected Duration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm font-medium text-blue-900">
          ⏱️ 예상 재생 시간: {expectedDuration.toFixed(1)}초
        </div>
      </div>

      {/* Motion Strength */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">모션 강도</label>
          <span className="text-sm text-gray-600">{settings.motionStrength.toFixed(1)}</span>
        </div>
        <input
          type="range"
          value={settings.motionStrength}
          onChange={(e) => handleMotionChange(Number(e.target.value))}
          min={0.1}
          max={1.0}
          step={0.1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>약함</span>
          <span>보통</span>
          <span>강함</span>
        </div>
      </div>
    </div>
  );
}
