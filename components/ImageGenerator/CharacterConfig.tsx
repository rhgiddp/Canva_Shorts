'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';
import type { Character } from '@/types/api';

export default function CharacterConfig() {
  const { character, setCharacter } = useImageStore();
  const [name, setName] = useState(character?.name || '');
  const [description, setDescription] = useState(character?.base_description || '');
  const [referenceImage, setReferenceImage] = useState<string | null>(
    character?.reference_image || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setReferenceImage(result);
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

  const handleSave = () => {
    if (!name || !description) {
      alert('캐릭터 이름과 설명을 입력해주세요.');
      return;
    }

    const newCharacter: Character = {
      name,
      base_description: description,
      reference_image: referenceImage || null,
    };

    setCharacter(newCharacter);
  };

  const handleClear = () => {
    setReferenceImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">캐릭터 설정</h3>

      {/* Character Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          캐릭터 이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 나노"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Character Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          캐릭터 설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="캐릭터의 외모, 성격, 특징 등을 자세히 설명해주세요..."
          rows={4}
          maxLength={2000}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <div className="text-xs text-gray-500 text-right mt-1">
          {description.length} / 2000
        </div>
      </div>

      {/* Reference Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          참조 이미지 (선택사항)
        </label>

        {!referenceImage ? (
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
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="reference-image-upload"
            />
            <label
              htmlFor="reference-image-upload"
              className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600 transition-colors"
            >
              파일 선택
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-48 object-contain rounded-lg border border-gray-300"
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

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!name || !description}
        className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        캐릭터 저장
      </button>
    </div>
  );
}
