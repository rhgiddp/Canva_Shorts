'use client';

import { Download, Film, Trash2, ImageIcon } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';
import { downloadFile } from '@/lib/api';

export default function ImagePreview() {
  const { images, removeImage, isGenerating, progress } = useImageStore();

  const handleDownload = (image: string, index: number) => {
    downloadFile(image, `generated-image-${index + 1}.png`);
  };

  const handleConvertToVideo = (imageId: string) => {
    // TODO: Navigate to video generator with this image
    console.log('Convert to video:', imageId);
    alert('비디오 생성 기능은 곧 추가됩니다!');
  };

  if (images.length === 0 && !isGenerating) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <ImageIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          생성된 이미지가 없습니다
        </h3>
        <p className="text-gray-500 mb-6">
          왼쪽에서 프롬프트를 입력하고 이미지를 생성해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          생성된 이미지 ({images.length})
        </h3>
        {isGenerating && (
          <div className="flex items-center gap-2 text-purple-600">
            <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isGenerating && images.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={image.image}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
                <div className="flex gap-2 w-full">
                  {/* Download */}
                  <button
                    onClick={() => handleDownload(image.image, index)}
                    className="flex-1 py-2 px-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    title="다운로드"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </button>

                  {/* Convert to Video */}
                  <button
                    onClick={() => handleConvertToVideo(image.id)}
                    className="flex-1 py-2 px-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 text-sm"
                    title="비디오로 변환"
                  >
                    <Film className="h-4 w-4" />
                    비디오
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Image Info */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {images.length > 0 && images[0].description && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">프롬프트:</span>{' '}
            {images[0].description}
          </p>
        </div>
      )}
    </div>
  );
}
