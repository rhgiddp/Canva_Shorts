import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-purple-900">
            AI 캐릭터 숏츠 제작기
          </h1>
          <p className="text-xl text-gray-600">
            이미지 생성부터 비디오 편집까지, 한 곳에서 완성하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Image Generator Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-3 text-purple-800">
              이미지 생성기
            </h2>
            <p className="text-gray-600 mb-6">
              Gemini 2.5 Flash로 AI 캐릭터 이미지를 생성하세요
            </p>
            <Link
              href="/image-generator"
              className="block w-full text-center bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              시작하기
            </Link>
          </div>

          {/* Video Generator Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold mb-3 text-pink-800">
              비디오 생성기
            </h2>
            <p className="text-gray-600 mb-6">
              이미지를 움직이는 비디오로 변환하세요
            </p>
            <Link
              href="/video-generator"
              className="block w-full text-center bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              시작하기
            </Link>
          </div>

          {/* Video Editor Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✂️</div>
            <h2 className="text-2xl font-bold mb-3 text-indigo-800">
              비디오 에디터
            </h2>
            <p className="text-gray-600 mb-6">
              생성한 비디오를 편집하고 효과를 추가하세요
            </p>
            <Link
              href="/editor"
              className="block w-full text-center bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
