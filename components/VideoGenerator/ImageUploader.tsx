'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { useImageStore } from '@/store/imageStore';

interface ImageUploaderProps {
  type: 'start' | 'end';
  label: string;
}

export default function ImageUploader({ type, label }: ImageUploaderProps) {
  const { startImage, endImage, setStartImage, setEndImage } = useVideoStore();
  const { images: generatedImages } = useImageStore();
  const [isDragging, setIsDragging] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);

  const currentImage = type === 'start' ? startImage : endImage;
  const setImage = type === 'start' ? setStartImage : setEndImage;

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSelectGenerated = (imageUrl: string) => {
    setImage(imageUrl);
    setShowGenerated(false);
  };

  const handleClear = () => {
    setImage('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {!currentImage && generatedImages.length > 0 && (
          <button
            onClick={() => setShowGenerated(!showGenerated)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {showGenerated ? '파일 선택' : '생성된 이미지'}
          </button>
        )}
      </div>

      {!currentImage ? (
        showGenerated ? (
          /* Generated Images Grid */
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg">
            {generatedImages.map((img) => (
              <button
                key={img.id}
                onClick={() => handleSelectGenerated(img.image)}
                className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <img
                  src={img.image}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          /* File Upload */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400'
            }`}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id={`image-upload-${type}`}
            />
            <label
              htmlFor={`image-upload-${type}`}
              className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600 transition-colors"
            >
              파일 선택
            </label>
          </div>
        )
      ) : (
        /* Image Preview */
        <div className="relative">
          <img
            src={currentImage}
            alt={label}
            className="w-full h-48 object-contain rounded-lg border border-gray-300 bg-gray-50"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
