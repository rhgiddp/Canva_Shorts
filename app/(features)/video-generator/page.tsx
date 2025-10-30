'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Download, ArrowRight } from 'lucide-react';
import ImageUploader from '@/components/VideoGenerator/ImageUploader';
import VideoSettings from '@/components/VideoGenerator/VideoSettings';
import { useVideoStore } from '@/store/videoStore';
import { generateVideo } from '@/lib/comfyui';

export default function VideoGeneratorPage() {
  const {
    videos,
    startImage,
    endImage,
    videoType,
    settings,
    isGenerating,
    progress,
    error,
    generateVideo: storeGenerateVideo,
  } = useVideoStore();

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!startImage) {
      alert('시작 이미지를 선택해주세요.');
      return;
    }

    if (videoType === 'story' && !endImage) {
      alert('Story 모드에서는 끝 이미지가 필요합니다.');
      return;
    }

    try {
      await storeGenerateVideo();

      // Show the first video after generation
      if (videos.length > 0) {
        setSelectedVideo(videos[0].video_url);
      }
    } catch (error) {
      console.error('Video generation failed:', error);
      alert('비디오 생성에 실패했습니다.');
    }
  };

  const handleDownload = (videoUrl: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `generated-video-${Date.now()}.mp4`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pink-900">
                🎬 비디오 생성기
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                이미지를 움직이는 비디오로 변환하세요
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Step 1: Image Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                1️⃣ 이미지 선택
              </h3>
              <ImageUploader type="start" label="시작 이미지" />
              {videoType === 'story' && (
                <ImageUploader type="end" label="끝 이미지" />
              )}
            </div>

            {/* Step 2: Video Settings */}
            <VideoSettings />

            {/* Step 3: Generate */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !startImage}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    생성 중... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    비디오 생성하기
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                3️⃣ 프리뷰 & 다운로드
              </h3>

              {/* Video Player */}
              {selectedVideo || videos.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      key={selectedVideo || videos[0]?.video_url}
                      src={selectedVideo || videos[0]?.video_url}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full"
                    />
                  </div>

                  {/* Video Controls */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleDownload(selectedVideo || videos[0]?.video_url)
                      }
                      className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Download className="h-5 w-5" />
                      다운로드
                    </button>

                    <button
                      onClick={() => alert('에디터 기능은 곧 추가됩니다!')}
                      className="flex-1 py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <ArrowRight className="h-5 w-5" />
                      에디터로 이동
                    </button>
                  </div>

                  {/* Video List */}
                  {videos.length > 1 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        생성된 비디오 ({videos.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {videos.map((video, index) => (
                          <button
                            key={video.id}
                            onClick={() => setSelectedVideo(video.video_url)}
                            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                              selectedVideo === video.video_url
                                ? 'border-pink-500'
                                : 'border-gray-300 hover:border-pink-300'
                            }`}
                          >
                            <video
                              src={video.video_url}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty State */
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Play className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">
                      생성된 비디오가 없습니다
                    </p>
                    <p className="text-sm mt-2">
                      왼쪽에서 이미지를 선택하고 비디오를 생성해보세요
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Info Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">ℹ️ 안내</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              • <strong>Loop 모드:</strong> 같은 이미지로 반복되는 애니메이션을
              생성합니다 (게임 캐릭터에 적합)
            </li>
            <li>
              • <strong>Story 모드:</strong> 시작 이미지에서 끝 이미지로
              자연스럽게 전환됩니다 (스토리텔링에 적합)
            </li>
            <li>
              • FPS와 프레임 수를 조정하여 비디오 길이와 부드러움을 제어할 수
              있습니다
            </li>
            <li>
              • 모션 강도를 높이면 더 역동적인 움직임이 생성됩니다
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
