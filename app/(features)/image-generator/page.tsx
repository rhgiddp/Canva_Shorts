import Link from 'next/link';
import CharacterConfig from '@/components/ImageGenerator/CharacterConfig';
import PromptInput from '@/components/ImageGenerator/PromptInput';
import ImagePreview from '@/components/ImageGenerator/ImagePreview';

export default function ImageGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-900">
                🎨 이미지 생성기
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gemini 2.0 Flash로 AI 캐릭터 이미지를 생성하세요
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input */}
          <div className="lg:col-span-1 space-y-6">
            <CharacterConfig />
            <PromptInput />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <ImagePreview />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 캐릭터 설정을 저장하면 일관된 스타일로 여러 이미지를 생성할 수 있습니다</li>
            <li>• 참조 이미지를 제공하면 더 정확한 결과를 얻을 수 있습니다</li>
            <li>• 배치 생성 기능으로 한 번에 여러 이미지를 생성할 수 있습니다</li>
            <li>• 생성된 이미지는 비디오 생성기로 바로 전환할 수 있습니다</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
