import Link from 'next/link';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">
                ✂️ 비디오 에디터
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                비디오를 편집하고 효과를 추가하세요
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            개발 중입니다
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            비디오 에디터 기능은 Phase 2에서 구현될 예정입니다.
          </p>

          <div className="bg-white rounded-lg shadow-md p-8 text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📋 예정된 기능
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>타임라인 편집:</strong> 여러 비디오 클립을 타임라인에
                  배치하고 편집
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>캔버스 오버레이:</strong> Fabric.js를 사용한 그리기
                  도구 및 애니메이션
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>트랜지션 효과:</strong> Fade, Wipe, Dissolve 등 다양한
                  전환 효과
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>오디오 시스템:</strong> TTS, 배경음악, 효과음 추가 및
                  믹싱
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>최종 익스포트:</strong> FFmpeg를 사용한 비디오 렌더링
                  및 다운로드
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/image-generator"
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              이미지 생성하기
            </Link>
            <Link
              href="/video-generator"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              비디오 생성하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
