# 📋 Canva Short Creator - 전체 태스크 체크리스트

> **작업 방식**: P0 → P1 → P2 순서로 진행
> **진행 상황**: [PROGRESS.md](./PROGRESS.md) 참고

---

## 📊 전체 진행률

- **Phase 0 - 프로젝트 기반**: 0/5 (0%)
- **Phase 1A - 이미지 생성기**: 0/6 (0%)
- **Phase 1B - 비디오 생성기**: 0/5 (0%)
- **Phase 2A - 에디터 기본**: 0/5 (0%)
- **Phase 2B - 캔버스 시스템**: 0/5 (0%)
- **Phase 2C - 오디오 시스템**: 0/4 (0%)
- **Phase 2D - 익스포트**: 0/5 (0%)
- **Phase 3 - 최적화**: 0/6 (0%)

**전체 진행률**: 0/41 (0%)

---

## 🎯 Phase별 상세 태스크

### 📦 Phase 0: 프로젝트 기반 구축 (P0 - Critical)

#### P0-001: Next.js 프로젝트 초기화 🔴
- [ ] Next.js 15.1.6 + App Router 설정
- [ ] TypeScript strict 모드 구성
- [ ] Tailwind CSS 설정
- [ ] 기본 디렉토리 구조 생성
- **복잡도**: Small | **의존성**: None
- **파일**: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`

#### P0-002: 핵심 라이브러리 설치 🔴
- [ ] Fabric.js 5.3.0-browser 설치
- [ ] @ffmpeg/ffmpeg, @ffmpeg/util 설치
- [ ] Zustand 4.5.4 설치
- [ ] Radix UI 컴포넌트 설치
- [ ] AWS S3 SDK 설치
- **복잡도**: Small | **의존성**: P0-001
- **파일**: `package.json`

#### P0-003: 프로젝트 구조 생성 🔴
- [ ] app/(features) 디렉토리 생성
- [ ] components/ 디렉토리 구조 생성
- [ ] lib/, store/, types/ 디렉토리 생성
- [ ] 기본 README.md 작성
- **복잡도**: Small | **의존성**: P0-001
- **디렉토리**: `app/`, `components/`, `lib/`, `store/`, `types/`

#### P0-004: 환경변수 & 타입 정의 🔴
- [ ] .env.example 파일 생성
- [ ] types/canvas.d.ts (Fabric.js 타입)
- [ ] types/editor.d.ts (에디터 인터페이스)
- [ ] types/api.d.ts (API 타입)
- **복잡도**: Small | **의존성**: P0-001
- **파일**: `.env.example`, `types/*.d.ts`

#### P0-005: 기본 레이아웃 & 랜딩 페이지 🔴
- [ ] app/layout.tsx (Zustand Provider)
- [ ] app/page.tsx (랜딩 페이지)
- [ ] components/Navigation.tsx
- [ ] 3개 주요 기능 링크 구성
- **복잡도**: Medium | **의존성**: P0-001, P0-002
- **파일**: `app/layout.tsx`, `app/page.tsx`, `components/Navigation.tsx`

---

### 🎨 Phase 1A: 이미지 생성기 (P0 - Critical)

#### P0-101: Gemini API 클라이언트 구현 🔴
- [ ] lib/api.ts 기본 구조
- [ ] lib/gemini.ts (Gemini 2.5 Flash 연동)
- [ ] 이미지 생성 요청 함수
- [ ] 에러 핸들링 & 재시도 로직
- **복잡도**: Medium | **의존성**: P0-004
- **파일**: `lib/api.ts`, `lib/gemini.ts`

#### P0-102: 이미지 생성 상태 관리 🔴
- [ ] store/imageStore.ts 생성
- [ ] 생성된 이미지 목록 상태
- [ ] 프롬프트 & 캐릭터 설정 상태
- [ ] 로딩 & 에러 상태
- **복잡도**: Small | **의존성**: P0-002
- **파일**: `store/imageStore.ts`

#### P0-103: 프롬프트 입력 컴포넌트 🔴
- [ ] components/ImageGenerator/PromptInput.tsx
- [ ] components/ImageGenerator/CharacterConfig.tsx
- [ ] 텍스트 프롬프트 입력 UI
- [ ] 참조 이미지 업로드 (optional)
- [ ] Google AI Studio 스타일 디자인
- **복잡도**: Medium | **의존성**: P0-102
- **파일**: `components/ImageGenerator/PromptInput.tsx`, `CharacterConfig.tsx`

#### P0-104: 이미지 프리뷰 컴포넌트 🔴
- [ ] components/ImageGenerator/ImagePreview.tsx
- [ ] 생성된 이미지 그리드 표시
- [ ] 이미지 다운로드 기능
- [ ] 비디오 생성기로 전달 기능
- [ ] 로딩 애니메이션
- **복잡도**: Medium | **의존성**: P0-102
- **파일**: `components/ImageGenerator/ImagePreview.tsx`

#### P0-105: 이미지 생성 페이지 통합 🔴
- [ ] app/(features)/image-generator/page.tsx
- [ ] 프롬프트 입력 → 생성 → 프리뷰 플로우
- [ ] 배치 생성 지원
- [ ] S3 업로드 연동
- **복잡도**: Medium | **의존성**: P0-103, P0-104
- **파일**: `app/(features)/image-generator/page.tsx`

#### P0-106: S3 이미지 업로드 🔴
- [ ] lib/s3.ts 생성
- [ ] Presigned URL 생성 함수
- [ ] 이미지 업로드 함수
- [ ] 업로드 진행률 표시
- **복잡도**: Medium | **의존성**: P0-004
- **파일**: `lib/s3.ts`

---

### 🎬 Phase 1B: 비디오 생성기 (P0 - Critical)

#### P0-201: 비디오 생성 상태 관리 🔴
- [ ] store/videoStore.ts 생성
- [ ] 비디오 클립 목록 상태
- [ ] 생성 설정 (FPS, frames) 상태
- [ ] Story/Loop 모드 상태
- [ ] 시작/끝 이미지 상태
- **복잡도**: Small | **의존성**: P0-002
- **파일**: `store/videoStore.ts`

#### P0-202: 이미지 업로더 컴포넌트 🔴
- [ ] components/VideoGenerator/ImageUploader.tsx
- [ ] 시작 이미지 선택/업로드
- [ ] 끝 이미지 선택 (story 모드)
- [ ] 이미지 생성기에서 가져오기
- [ ] 드래그 앤 드롭 지원
- **복잡도**: Medium | **의존성**: P0-201
- **파일**: `components/VideoGenerator/ImageUploader.tsx`

#### P0-203: 비디오 설정 컴포넌트 🔴
- [ ] components/VideoGenerator/VideoSettings.tsx
- [ ] FPS 설정 (기본 8)
- [ ] 프레임 수 설정 (기본 25)
- [ ] Story/Loop 모드 토글
- [ ] 모션 강도 슬라이더
- **복잡도**: Small | **의존성**: P0-201
- **파일**: `components/VideoGenerator/VideoSettings.tsx`

#### P0-204: ComfyUI API 클라이언트 🔴⚠️
- [ ] lib/comfyui.ts 생성
- [ ] ComfyUI 서버 연동 (HTTP + WebSocket)
- [ ] lib/workflows/svd-loop.json (루프 워크플로우)
- [ ] lib/workflows/svd-story.json (스토리 워크플로우)
- [ ] 워크플로우 실행 & 결과 폴링
- **복잡도**: Large | **의존성**: P0-004
- **파일**: `lib/comfyui.ts`, `lib/workflows/*.json`
- **주의**: 외부 서버 의존성 - Mock API 우선 구현 권장

#### P0-205: 비디오 생성 페이지 🔴
- [ ] app/(features)/video-generator/page.tsx
- [ ] 이미지 선택 → 설정 → 생성 플로우
- [ ] 생성 진행률 표시
- [ ] 비디오 프리뷰 플레이어
- [ ] S3 업로드 및 URL 저장
- **복잡도**: Large | **의존성**: P0-202, P0-203, P0-204
- **파일**: `app/(features)/video-generator/page.tsx`

---

### 🎞️ Phase 2A: 비디오 에디터 기본 (P1 - High)

#### P1-301: 에디터 상태 관리 🟡
- [ ] store/editorStore.ts 생성
- [ ] 타임라인 트랙 상태 (비디오, 캔버스, 오디오)
- [ ] 현재 재생 시간 & 선택 요소 상태
- [ ] 캔버스 요소 목록
- [ ] 프로젝트 설정
- **복잡도**: Large | **의존성**: P0-002
- **파일**: `store/editorStore.ts`

#### P1-302: 비디오 타임라인 컴포넌트 🟡⚠️
- [ ] components/Editor/Timeline/VideoTimeline.tsx
- [ ] components/Editor/Timeline/TimelineTrack.tsx
- [ ] components/Editor/Timeline/TimelineClip.tsx
- [ ] 다중 트랙 타임라인 UI
- [ ] 클립 드래그 앤 드롭
- [ ] 클립 트림 (시작/끝)
- [ ] 시간 스케일 조정 & 재생 헤드
- **복잡도**: Large | **의존성**: P1-301
- **파일**: `components/Editor/Timeline/*.tsx`

#### P1-303: 트랜지션 효과 시스템 🟡
- [ ] components/Editor/Transitions/TransitionPicker.tsx
- [ ] lib/transitions.ts (효과 로직)
- [ ] Fade (in/out/cross) 효과
- [ ] Wipe (방향별) 효과
- [ ] Dissolve 효과
- [ ] 트랜지션 지속시간 조절
- **복잡도**: Medium | **의존성**: P1-302
- **파일**: `components/Editor/Transitions/*.tsx`, `lib/transitions.ts`

#### P1-304: 비디오 플레이어 🟡⚠️
- [ ] components/Editor/Player/VideoPlayer.tsx
- [ ] 실시간 프리뷰 재생
- [ ] 재생/일시정지/정지 컨트롤
- [ ] 프레임 단위 이동
- [ ] 볼륨 조절
- [ ] 타임라인 동기화
- **복잡도**: Large | **의존성**: P1-301
- **파일**: `components/Editor/Player/VideoPlayer.tsx`

#### P1-305: 에디터 메인 페이지 🟡
- [ ] app/(features)/editor/page.tsx
- [ ] app/(features)/editor/[projectId]/page.tsx
- [ ] 레이아웃 구성 (도구바, 플레이어, 타임라인, 속성)
- [ ] 컴포넌트 통합
- **복잡도**: Large | **의존성**: P1-302, P1-304
- **파일**: `app/(features)/editor/*.tsx`

---

### 🎨 Phase 2B: 캔버스 오버레이 시스템 (P1 - High)

#### P1-401: Fabric.js 래퍼 유틸리티 🟡
- [ ] lib/canvas.ts 생성
- [ ] Fabric.js 초기화 함수
- [ ] 객체 생성 헬퍼 함수
- [ ] 직렬화/역직렬화 함수
- [ ] 메모리 정리 함수
- **복잡도**: Medium | **의존성**: P0-002, P0-004
- **파일**: `lib/canvas.ts`

#### P1-402: 캔버스 컴포넌트 🟡⚠️
- [ ] components/Editor/Canvas/FabricCanvas.tsx
- [ ] Fabric.js 캔버스 렌더링
- [ ] 비디오와 프레임 동기화
- [ ] 요소 선택/편집
- [ ] 레이어 순서 관리
- [ ] 캔버스 저장/로드
- **복잡도**: Large | **의존성**: P1-401, P1-301
- **파일**: `components/Editor/Canvas/FabricCanvas.tsx`

#### P1-403: 드로잉 도구 🟡
- [ ] components/Editor/Canvas/CanvasTools.tsx
- [ ] 텍스트 추가 도구
- [ ] 이미지 추가 도구
- [ ] 도형 도구 (사각형, 원, 선)
- [ ] 브러시 (자유 그리기)
- [ ] 지우개 도구
- **복잡도**: Medium | **의존성**: P1-402
- **파일**: `components/Editor/Canvas/CanvasTools.tsx`

#### P1-404: 키프레임 애니메이션 에디터 🟡⚠️
- [ ] components/Editor/Timeline/Keyframes.tsx
- [ ] 키프레임 추가/삭제 UI
- [ ] 속성 애니메이션 (위치, 크기, 회전, 투명도)
- [ ] Tween 곡선 선택 (linear, ease, bounce)
- [ ] 키프레임 타임라인 표시
- **복잡도**: Large | **의존성**: P1-402
- **파일**: `components/Editor/Timeline/Keyframes.tsx`

#### P1-405: 캔버스-비디오 동기화 🟡⚠️
- [ ] lib/sync.ts 생성
- [ ] requestAnimationFrame 동기화
- [ ] 프레임별 캔버스 렌더링
- [ ] 애니메이션 보간 (interpolation)
- [ ] 성능 최적화 (프레임 캐싱)
- **복잡도**: Large | **의존성**: P1-402, P1-304
- **파일**: `lib/sync.ts`
- **주의**: 성능 병목 가능 - 프로토타입 검증 필요

---

### 🔊 Phase 2C: 오디오 시스템 (P1 - High)

#### P1-501: TTS 자막 생성기 🟡⚠️
- [ ] components/Editor/AudioManager/TTSGenerator.tsx
- [ ] lib/tts.ts (TTS API 연동)
- [ ] 다국어 TTS (한국어, 영어, 일본어)
- [ ] 자막 텍스트 입력 UI
- [ ] 음성 속도 조절
- [ ] 음성 미리듣기
- [ ] 타임라인 위치 지정
- **복잡도**: Large | **의존성**: P1-301
- **파일**: `components/Editor/AudioManager/TTSGenerator.tsx`, `lib/tts.ts`

#### P1-502: 배경음악 관리 🟡
- [ ] components/Editor/AudioManager/MusicTrack.tsx
- [ ] 음악 파일 업로드 (MP3, WAV)
- [ ] 음악 트림 (시작/끝)
- [ ] 페이드 인/아웃
- [ ] 볼륨 조절 슬라이더
- [ ] 루프 설정
- **복잡도**: Medium | **의존성**: P1-301
- **파일**: `components/Editor/AudioManager/MusicTrack.tsx`

#### P1-503: 효과음 삽입기 🟡
- [ ] components/Editor/AudioManager/SoundEffects.tsx
- [ ] 효과음 라이브러리 UI
- [ ] 특정 시간에 삽입
- [ ] 볼륨 조절
- [ ] 프리셋 효과음 (선택사항)
- **복잡도**: Small | **의존성**: P1-301
- **파일**: `components/Editor/AudioManager/SoundEffects.tsx`

#### P1-504: 오디오 믹싱 🟡
- [ ] lib/audio-mixer.ts 생성
- [ ] 다중 오디오 트랙 믹싱
- [ ] 볼륨 노멀라이제이션
- [ ] 오디오 동기화
- [ ] Web Audio API 활용
- **복잡도**: Medium | **의존성**: P1-501, P1-502, P1-503
- **파일**: `lib/audio-mixer.ts`

---

### 📤 Phase 2D: 최종 익스포트 파이프라인 (P1 - High)

#### P1-601: FFmpeg 초기화 & 설정 🟡
- [ ] lib/ffmpeg.ts 생성
- [ ] @ffmpeg/ffmpeg 로드
- [ ] WASM 초기화
- [ ] 진행률 이벤트 리스너
- [ ] 크로스 브라우저 호환성 체크
- **복잡도**: Medium | **의존성**: P0-002
- **파일**: `lib/ffmpeg.ts`

#### P1-602: 비디오 합치기 🟡⚠️
- [ ] lib/video-concat.ts 생성
- [ ] 여러 MP4 연결 (concat)
- [ ] 트랜지션 적용 (FFmpeg filter)
- [ ] 비디오 인코딩 최적화
- [ ] 임시 파일 관리
- **복잡도**: Large | **의존성**: P1-601, P1-303
- **파일**: `lib/video-concat.ts`

#### P1-603: 캔버스 오버레이 렌더링 🟡⚠️
- [ ] lib/canvas-renderer.ts 생성
- [ ] Fabric.js → 비디오 프레임 렌더링
- [ ] 프레임별 캔버스 이미지 생성
- [ ] FFmpeg overlay filter 적용
- [ ] Web Worker로 성능 최적화
- **복잡도**: Large | **의존성**: P1-402, P1-601
- **파일**: `lib/canvas-renderer.ts`

#### P1-604: 오디오 믹싱 & 합성 🟡⚠️
- [ ] lib/audio-export.ts 생성
- [ ] 오디오 트랙 믹싱 (FFmpeg)
- [ ] 비디오와 오디오 동기화
- [ ] FFmpeg audio filter 적용
- [ ] 최종 MP4 생성
- **복잡도**: Large | **의존성**: P1-504, P1-601
- **파일**: `lib/audio-export.ts`

#### P1-605: 익스포트 UI 🟡
- [ ] components/Editor/ExportDialog.tsx
- [ ] 익스포트 설정 (해상도, 프레임레이트, 품질)
- [ ] 진행률 표시 (프로그레스 바)
- [ ] 미리보기 옵션
- [ ] 다운로드 또는 S3 업로드 선택
- **복잡도**: Medium | **의존성**: P1-602, P1-603, P1-604
- **파일**: `components/Editor/ExportDialog.tsx`

---

### ⚡ Phase 3: 최적화 & 통합 (P2 - Medium)

#### P2-701: 성능 최적화 🟢⚠️
- [ ] Lazy loading (Editor, FFmpeg 컴포넌트)
- [ ] 비디오 썸네일 생성
- [ ] Virtual scrolling (타임라인)
- [ ] Web Worker (무거운 연산)
- [ ] 프레임 캐싱 시스템
- **복잡도**: Large | **의존성**: All previous
- **파일**: 여러 파일 수정

#### P2-702: 메모리 관리 🟢
- [ ] Fabric 객체 dispose
- [ ] 비디오 blob 정리
- [ ] FFmpeg 파일 시스템 정리
- [ ] 메모리 누수 방지 (useEffect cleanup)
- **복잡도**: Medium | **의존성**: P1-402, P1-601
- **파일**: 여러 컴포넌트 수정

#### P2-703: 크로스 브라우저 호환성 🟢
- [ ] Safari FFmpeg WASM 테스트
- [ ] Fabric.js 터치 이벤트 테스트
- [ ] SharedArrayBuffer fallback
- [ ] 브라우저별 폴리필 적용
- **복잡도**: Medium | **의존성**: All
- **파일**: 설정 파일 및 유틸리티

#### P2-704: 프로젝트 저장/로드 🟢
- [ ] lib/project-serializer.ts 생성
- [ ] 프로젝트 JSON 직렬화
- [ ] Fabric.js 캔버스 직렬화
- [ ] S3에 프로젝트 저장
- [ ] 프로젝트 로드 및 복원
- **복잡도**: Medium | **의존성**: P1-301, P1-402
- **파일**: `lib/project-serializer.ts`

#### P2-705: 에러 핸들링 & 로깅 🟢
- [ ] 전역 에러 바운더리 추가
- [ ] API 에러 처리 개선
- [ ] 사용자 친화적 에러 메시지
- [ ] 로깅 시스템 (Sentry 선택적)
- **복잡도**: Small | **의존성**: All
- **파일**: `app/error.tsx`, 에러 유틸리티

#### P2-706: 테스팅 🟢
- [ ] 단위 테스트 (주요 함수)
- [ ] 통합 테스트 (에디터 플로우)
- [ ] E2E 테스트 (Playwright 선택적)
- [ ] 성능 벤치마크
- **복잡도**: Large | **의존성**: All
- **파일**: `__tests__/` 디렉토리

---

## 🚨 주의사항

### ⚠️ 복잡도 High & 기술 리스크

- **P0-204**: ComfyUI API (외부 서버 의존) → Mock API 우선
- **P1-302**: 타임라인 시스템 (복잡한 UI) → 단계적 구현
- **P1-304**: 비디오 플레이어 (동기화) → 프로토타입 검증
- **P1-402**: Fabric.js 캔버스 (메모리) → 정리 로직 필수
- **P1-404**: 키프레임 에디터 (수학적 보간) → 라이브러리 활용
- **P1-405**: 캔버스-비디오 동기화 (성능) → 캐싱 전략 필수
- **P1-501**: TTS 시스템 (다국어) → API 선택 중요
- **P1-602-604**: FFmpeg 파이프라인 (WASM 제한) → 청크 처리
- **P2-701**: 성능 최적화 (전체 영향) → 측정 후 최적화

---

## 📖 참고 문서

- **세부 우선순위별 태스크**:
  - [TASKS_P0.md](./TASKS_P0.md) - Critical (MVP 필수)
  - [TASKS_P1.md](./TASKS_P1.md) - High (핵심 기능)
  - [TASKS_P2.md](./TASKS_P2.md) - Medium (품질 향상)
- **진행 상황**: [PROGRESS.md](./PROGRESS.md)
- **기술 가이드**: [CLAUDE.md](./CLAUDE.md)

---

**마지막 업데이트**: 2025-10-30
**다음 작업**: P0-001 Next.js 프로젝트 초기화