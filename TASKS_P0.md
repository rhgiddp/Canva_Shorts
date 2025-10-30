# 🔴 P0 태스크 - Critical Priority (MVP 필수)

> **목표**: 최소 기능 제품(MVP) 완성
> **예상 기간**: 15-20일
> **진행률**: 0/16 (0%)

---

## 📊 Phase별 진행률

- **Phase 0 - 프로젝트 기반**: 0/5 (0%)
- **Phase 1A - 이미지 생성기**: 0/6 (0%)
- **Phase 1B - 비디오 생성기**: 0/5 (0%)

---

## 📦 Phase 0: 프로젝트 기반 구축

### ✅ P0-001: Next.js 프로젝트 초기화
**복잡도**: Small | **소요 시간**: 1-2시간 | **의존성**: None

#### 체크리스트
- [ ] Next.js 15.1.6 설치 (`npx create-next-app@latest`)
- [ ] App Router 활성화 확인
- [ ] TypeScript strict 모드 설정
- [ ] Tailwind CSS 설정 완료
- [ ] 기본 디렉토리 구조 생성
  - [ ] `app/` (App Router)
  - [ ] `components/`
  - [ ] `lib/`
  - [ ] `store/`
  - [ ] `types/`
  - [ ] `public/`

#### 생성/수정 파일
```
✓ package.json
✓ tsconfig.json
✓ next.config.js
✓ tailwind.config.ts
✓ postcss.config.js
✓ app/layout.tsx
✓ app/page.tsx
```

#### 검증
- [ ] `npm run dev` 정상 실행 (http://localhost:3000)
- [ ] TypeScript 에러 없음
- [ ] Tailwind CSS 적용 확인

---

### ✅ P0-002: 핵심 라이브러리 설치
**복잡도**: Small | **소요 시간**: 30분 | **의존성**: P0-001

#### 체크리스트
- [ ] **Fabric.js** `npm install fabric@5.3.0-browser @types/fabric@5.3.0`
- [ ] **FFmpeg** `npm install @ffmpeg/ffmpeg@0.12.15 @ffmpeg/util@0.12.2`
- [ ] **Zustand** `npm install zustand@4.5.4`
- [ ] **Radix UI**
  - [ ] `@radix-ui/react-dialog`
  - [ ] `@radix-ui/react-dropdown-menu`
  - [ ] `@radix-ui/react-slider`
  - [ ] `@radix-ui/react-progress`
  - [ ] `@radix-ui/react-scroll-area`
  - [ ] `@radix-ui/react-tooltip`
- [ ] **AWS S3** `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- [ ] **기타 유틸리티**
  - [ ] `lucide-react` (아이콘)
  - [ ] `date-fns` (날짜)
  - [ ] `lodash.debounce` (디바운스)
  - [ ] `uuidv4` (UUID 생성)
  - [ ] `sonner` (토스트 알림)

#### 검증
- [ ] `npm install` 에러 없음
- [ ] `package.json` dependencies 확인
- [ ] TypeScript 타입 정의 확인

---

### ✅ P0-003: 프로젝트 구조 생성
**복잡도**: Small | **소요 시간**: 30분 | **의존성**: P0-001

#### 체크리스트
- [ ] **app 디렉토리**
  - [ ] `app/(features)/` (그룹 라우트)
  - [ ] `app/(features)/image-generator/`
  - [ ] `app/(features)/video-generator/`
  - [ ] `app/(features)/editor/`

- [ ] **components 디렉토리**
  - [ ] `components/ImageGenerator/`
  - [ ] `components/VideoGenerator/`
  - [ ] `components/Editor/Canvas/`
  - [ ] `components/Editor/Timeline/`
  - [ ] `components/Editor/Player/`
  - [ ] `components/Editor/AudioManager/`
  - [ ] `components/Editor/Transitions/`
  - [ ] `components/UI/` (공용 컴포넌트)

- [ ] **lib 디렉토리**
  - [ ] `lib/`
  - [ ] `lib/workflows/`

- [ ] **store 디렉토리**
  - [ ] `store/`

- [ ] **types 디렉토리**
  - [ ] `types/`

- [ ] **기타**
  - [ ] `public/` (이미 있음)
  - [ ] `README.md` 업데이트

#### 검증
- [ ] 모든 디렉토리 생성 확인
- [ ] Git에 빈 디렉토리 추적 (.gitkeep 추가)

---

### ✅ P0-004: 환경변수 & 타입 정의
**복잡도**: Small | **소요 시간**: 1시간 | **의존성**: P0-001

#### 체크리스트

##### 환경변수 파일
- [ ] `.env.example` 생성
```env
# Google Gemini API
GOOGLE_API_KEY=your-gemini-api-key

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name

# ComfyUI Server (optional)
NEXT_PUBLIC_COMFYUI_URL=http://localhost:8188

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
```

##### TypeScript 타입 정의
- [ ] **types/canvas.d.ts** (Fabric.js 확장)
```typescript
import { fabric } from 'fabric';

declare module 'fabric' {
  interface IObjectOptions {
    id?: string;
    keyframes?: Keyframe[];
  }
}

export interface Keyframe {
  time: number;
  properties: {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    opacity?: number;
  };
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}
```

- [ ] **types/editor.d.ts** (에디터 인터페이스)
```typescript
export interface TimelineTrack {
  id: string;
  type: 'video' | 'canvas' | 'audio';
  clips: TimelineClip[];
}

export interface TimelineClip {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  url?: string;
  transition?: Transition;
}

export interface Transition {
  type: 'fade' | 'wipe' | 'dissolve';
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface EditorProject {
  id: string;
  name: string;
  tracks: TimelineTrack[];
  canvasElements: fabric.Object[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  fps: number;
  resolution: { width: number; height: number };
  duration: number;
}
```

- [ ] **types/api.d.ts** (API 타입)
```typescript
export interface Character {
  name: string;
  base_description: string;
  reference_image?: string | null;
}

export interface Scene {
  action: string;
  angle?: string;
  outfit?: string;
  props?: string;
  background?: string;
  pose_reference?: string;
  dialogue?: string;
}

export interface VideoGenerationRequest {
  character: Character;
  scenes: Scene[];
  video_type: 'story' | 'loop';
  fps: number;
  frames: number;
}

export interface GeneratedImage {
  scene_num: number;
  image: string; // base64 or URL
  description: string;
}

export interface GeneratedVideo {
  scene: string | number;
  video_url: string;
  type: 'loop' | 'transition';
}
```

#### 검증
- [ ] `.env.example` 파일 확인
- [ ] 타입 파일 TypeScript 에러 없음
- [ ] IDE 자동완성 동작

---

### ✅ P0-005: 기본 레이아웃 & 랜딩 페이지
**복잡도**: Medium | **소요 시간**: 2-3시간 | **의존성**: P0-001, P0-002

#### 체크리스트

##### app/layout.tsx
- [ ] RootLayout 컴포넌트 생성
- [ ] Tailwind CSS 글로벌 스타일 import
- [ ] 폰트 설정 (Inter 또는 Pretendard)
- [ ] 메타데이터 설정
```typescript
export const metadata: Metadata = {
  title: 'Canva Short Creator',
  description: 'AI-powered shorts creator with video editor',
}
```

##### app/page.tsx (랜딩 페이지)
- [ ] 히어로 섹션
  - [ ] 제목: "AI 캐릭터 숏츠 제작기"
  - [ ] 부제목
  - [ ] 주요 기능 설명
- [ ] 3개 주요 기능 카드
  - [ ] **이미지 생성기** 링크 → `/image-generator`
  - [ ] **비디오 생성기** 링크 → `/video-generator`
  - [ ] **비디오 에디터** 링크 → `/editor`
- [ ] 각 카드에 아이콘 + 설명
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)

##### components/Navigation.tsx
- [ ] 네비게이션 바 컴포넌트
- [ ] 로고/제목
- [ ] 메뉴 항목
  - [ ] 홈
  - [ ] 이미지 생성
  - [ ] 비디오 생성
  - [ ] 에디터
- [ ] 모바일 메뉴 (햄버거)

#### UI 디자인
```typescript
// 색상 테마 예시
const theme = {
  primary: 'purple-500',
  secondary: 'pink-500',
  background: 'gradient-to-br from-purple-50 to-pink-50',
}
```

#### 검증
- [ ] 랜딩 페이지 렌더링 정상
- [ ] 3개 링크 동작 (404 페이지 확인)
- [ ] 네비게이션 바 표시
- [ ] 반응형 디자인 동작

---

## 🎨 Phase 1A: 이미지 생성기 (Gemini 2.5 Flash)

### ✅ P0-101: Gemini API 클라이언트 구현
**복잡도**: Medium | **소요 시간**: 2-3시간 | **의존성**: P0-004

#### 체크리스트

##### lib/api.ts (기본 API 클라이언트)
- [ ] fetch wrapper 함수 생성
- [ ] 에러 핸들링 미들웨어
- [ ] 타임아웃 설정
- [ ] 재시도 로직 (retry)

##### lib/gemini.ts (Gemini API)
- [ ] Google Generative AI SDK 설치
  - [ ] `npm install @google/generative-ai`
- [ ] Gemini 2.5 Flash 초기화
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
```
- [ ] 이미지 생성 함수
  - [ ] `generateImage(prompt: string, referenceImage?: string)`
  - [ ] Base64 이미지 처리
  - [ ] 에러 핸들링
- [ ] 배치 생성 지원
  - [ ] `generateBatch(prompts: string[], count: number)`

#### API 응답 예시
```typescript
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inline_data?: {
          mime_type: string;
          data: string; // base64
        };
      }>;
    };
  }>;
}
```

#### 검증
- [ ] API 키 유효성 확인
- [ ] 이미지 생성 테스트 (간단한 프롬프트)
- [ ] 에러 응답 핸들링
- [ ] Base64 이미지 디코딩

---

### ✅ P0-102: 이미지 생성 상태 관리
**복잡도**: Small | **소요 시간**: 1시간 | **의존성**: P0-002

#### 체크리스트

##### store/imageStore.ts (Zustand)
- [ ] Store 생성
```typescript
interface ImageState {
  // 상태
  images: GeneratedImage[];
  currentPrompt: string;
  character: Character | null;
  isGenerating: boolean;
  error: string | null;

  // 액션
  setPrompt: (prompt: string) => void;
  setCharacter: (character: Character) => void;
  generateImage: (prompt: string) => Promise<void>;
  addImage: (image: GeneratedImage) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
}
```
- [ ] 상태 초기값 설정
- [ ] 액션 함수 구현
- [ ] localStorage persist (선택사항)

#### 검증
- [ ] Store 생성 확인
- [ ] 상태 업데이트 동작
- [ ] TypeScript 타입 체크

---

### ✅ P0-103: 프롬프트 입력 컴포넌트
**복잡도**: Medium | **소요 시간**: 2-3시간 | **의존성**: P0-102

#### 체크리스트

##### components/ImageGenerator/PromptInput.tsx
- [ ] 텍스트 영역 (Textarea)
  - [ ] 플레이스홀더: "캐릭터를 설명하세요..."
  - [ ] 최대 길이: 2000자
  - [ ] 실시간 글자 수 표시
- [ ] 생성 버튼
  - [ ] 로딩 상태 표시
  - [ ] 비활성화 조건 (빈 프롬프트)
- [ ] Google AI Studio 스타일 UI
  - [ ] 그라데이션 배경
  - [ ] 그림자 효과
  - [ ] 애니메이션

##### components/ImageGenerator/CharacterConfig.tsx
- [ ] 캐릭터 이름 입력
- [ ] 상세 설명 텍스트 영역
- [ ] 참조 이미지 업로드 (선택사항)
  - [ ] 드래그 앤 드롭 지원
  - [ ] 이미지 미리보기
  - [ ] Base64 변환

#### UI 레이아웃
```
┌─────────────────────────────────┐
│  캐릭터 이름: [__________]      │
│                                  │
│  설명:                           │
│  [텍스트 영역                    │
│   여러 줄 입력]                  │
│                                  │
│  참조 이미지: [파일 선택] 📷     │
│  [미리보기]                      │
│                                  │
│        [🎨 이미지 생성]          │
└─────────────────────────────────┘
```

#### 검증
- [ ] 프롬프트 입력 동작
- [ ] 캐릭터 설정 저장
- [ ] 이미지 업로드 동작
- [ ] 생성 버튼 클릭 → API 호출

---

### ✅ P0-104: 이미지 프리뷰 컴포넌트
**복잡도**: Medium | **소요 시간**: 2시간 | **의존성**: P0-102

#### 체크리스트

##### components/ImageGenerator/ImagePreview.tsx
- [ ] 이미지 그리드 레이아웃
  - [ ] 반응형 (1/2/3/4 컬럼)
  - [ ] 이미지 카드 디자인
- [ ] 각 이미지 카드
  - [ ] 이미지 표시 (Base64 → img src)
  - [ ] 액션 버튼
    - [ ] 다운로드 버튼
    - [ ] 비디오로 전환 버튼
    - [ ] 삭제 버튼
  - [ ] 호버 효과
- [ ] 로딩 상태
  - [ ] 스켈레톤 UI
  - [ ] 스피너 애니메이션
- [ ] 빈 상태 (이미지 없을 때)
  - [ ] 안내 메시지
  - [ ] 생성 시작 버튼

#### UI 레이아웃
```
┌─────────────────────────────────┐
│  생성된 이미지 (3)               │
│                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ 이미지 │  │ 이미지 │  │ 이미지 │  │
│  │      │  │      │  │      │  │
│  └──────┘  └──────┘  └──────┘  │
│  [⬇][🎬][🗑]  [⬇][🎬][🗑]  [⬇][🎬][🗑]  │
└─────────────────────────────────┘
```

#### 검증
- [ ] 이미지 그리드 렌더링
- [ ] Base64 이미지 표시
- [ ] 다운로드 동작 (Blob 생성)
- [ ] 비디오 전환 버튼 (videoStore 연동)

---

### ✅ P0-105: 이미지 생성 페이지 통합
**복잡도**: Medium | **소요 시간**: 2시간 | **의존성**: P0-103, P0-104

#### 체크리스트

##### app/(features)/image-generator/page.tsx
- [ ] 페이지 레이아웃
  - [ ] 2컬럼 (입력 | 프리뷰)
  - [ ] 반응형 (모바일: 세로 배치)
- [ ] 컴포넌트 통합
  - [ ] `<CharacterConfig />`
  - [ ] `<PromptInput />`
  - [ ] `<ImagePreview />`
- [ ] 상태 관리 연결
  - [ ] `useImageStore()` 훅 사용
  - [ ] 생성 플로우: 입력 → API → 프리뷰
- [ ] 배치 생성 지원
  - [ ] 생성 개수 선택 (1-4)
  - [ ] 동시 생성 또는 순차 생성

#### 페이지 레이아웃
```
┌────────────────────────────────────────┐
│  🎨 이미지 생성기                       │
├───────────────┬────────────────────────┤
│               │                        │
│  [입력 영역]  │     [프리뷰 영역]      │
│               │                        │
│ - 캐릭터 설정  │  - 생성된 이미지       │
│ - 프롬프트    │  - 액션 버튼           │
│ - 생성 버튼   │                        │
│               │                        │
└───────────────┴────────────────────────┘
```

#### 검증
- [ ] 페이지 접근 (http://localhost:3000/image-generator)
- [ ] 전체 플로우 테스트
  1. 캐릭터 설정 입력
  2. 프롬프트 입력
  3. 생성 버튼 클릭
  4. 로딩 표시
  5. 이미지 프리뷰 표시
- [ ] 에러 처리 (API 실패)

---

### ✅ P0-106: S3 이미지 업로드
**복잡도**: Medium | **소요 시간**: 2시간 | **의존성**: P0-004

#### 체크리스트

##### lib/s3.ts
- [ ] S3 Client 초기화
```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
```

- [ ] Presigned URL 생성 함수
```typescript
async function getUploadUrl(fileName: string, fileType: string): Promise<string>
```

- [ ] 이미지 업로드 함수
```typescript
async function uploadImage(
  file: File | Blob,
  key: string
): Promise<string> // 업로드된 URL 반환
```

- [ ] 업로드 진행률
  - [ ] Progress 이벤트 리스너
  - [ ] 퍼센티지 계산

- [ ] URL 가져오기 함수
```typescript
async function getImageUrl(key: string): Promise<string>
```

#### 검증
- [ ] S3 버킷 접근 권한 확인
- [ ] 이미지 업로드 테스트
- [ ] 업로드된 URL 접근 가능
- [ ] 진행률 표시 동작

---

## 🎬 Phase 1B: 비디오 생성기 (ComfyUI + SVD)

### ✅ P0-201: 비디오 생성 상태 관리
**복잡도**: Small | **소요 시간**: 1시간 | **의존성**: P0-002

#### 체크리스트

##### store/videoStore.ts
- [ ] Store 생성
```typescript
interface VideoState {
  // 상태
  videos: GeneratedVideo[];
  startImage: string | null;
  endImage: string | null;
  videoType: 'story' | 'loop';
  settings: {
    fps: number;
    frames: number;
    motionStrength: number;
  };
  isGenerating: boolean;
  progress: number;
  error: string | null;

  // 액션
  setStartImage: (image: string) => void;
  setEndImage: (image: string) => void;
  setVideoType: (type: 'story' | 'loop') => void;
  setSettings: (settings: Partial<VideoSettings>) => void;
  generateVideo: () => Promise<void>;
  addVideo: (video: GeneratedVideo) => void;
  clearVideos: () => void;
}
```

- [ ] 기본 설정값
```typescript
const defaultSettings = {
  fps: 8,
  frames: 25,
  motionStrength: 0.5,
};
```

#### 검증
- [ ] Store 생성 확인
- [ ] 상태 업데이트 동작

---

### ✅ P0-202: 이미지 업로더 컴포넌트
**복잡도**: Medium | **소요 시간**: 2-3시간 | **의존성**: P0-201

#### 체크리스트

##### components/VideoGenerator/ImageUploader.tsx
- [ ] 시작 이미지 선택
  - [ ] 파일 업로드 (input type="file")
  - [ ] 드래그 앤 드롭
  - [ ] 이미지 생성기에서 선택 (imageStore 연동)
  - [ ] 미리보기
- [ ] 끝 이미지 선택 (Story 모드)
  - [ ] 동일한 업로드 옵션
  - [ ] Loop 모드일 때 숨김
- [ ] 이미지 소스 탭
  - [ ] 파일 업로드 탭
  - [ ] 생성된 이미지 탭 (P0-105 연동)

#### UI 레이아웃
```
┌─────────────────────────────────┐
│  시작 이미지                     │
│  ┌───────────────┐              │
│  │  [이미지]     │              │
│  │   또는        │              │
│  │  [드롭존]     │              │
│  └───────────────┘              │
│  [ 파일 선택 | 생성된 이미지 ]  │
│                                  │
│  끝 이미지 (Story 모드만)        │
│  ┌───────────────┐              │
│  │  [이미지]     │              │
│  └───────────────┘              │
└─────────────────────────────────┘
```

#### 검증
- [ ] 파일 업로드 동작
- [ ] 드래그 앤 드롭 동작
- [ ] 생성된 이미지 목록 표시
- [ ] Story/Loop 모드에 따른 UI 변경

---

### ✅ P0-203: 비디오 설정 컴포넌트
**복잡도**: Small | **소요 시간**: 1-2시간 | **의존성**: P0-201

#### 체크리스트

##### components/VideoGenerator/VideoSettings.tsx
- [ ] Video Type 선택
  - [ ] 라디오 버튼 또는 토글
  - [ ] Story 모드 / Loop 모드
  - [ ] 아이콘 + 설명
- [ ] FPS 설정
  - [ ] 슬라이더 (4-30 fps)
  - [ ] 기본값: 8 fps
  - [ ] 숫자 입력 (직접 입력)
- [ ] 프레임 수 설정
  - [ ] 슬라이더 (10-50 frames)
  - [ ] 기본값: 25 frames
  - [ ] 예상 재생 시간 표시
- [ ] 모션 강도 (선택사항)
  - [ ] 슬라이더 (0.1-1.0)
  - [ ] 기본값: 0.5

#### UI 레이아웃
```
┌─────────────────────────────────┐
│  비디오 타입                     │
│  ○ Story 모드  ● Loop 모드       │
│                                  │
│  FPS: [────●────] 8              │
│  프레임: [────●────] 25          │
│  예상 시간: 3.1초                │
│                                  │
│  모션 강도: [──●────] 0.5        │
│                                  │
│        [🎬 비디오 생성]          │
└─────────────────────────────────┘
```

#### 검증
- [ ] Story/Loop 모드 전환
- [ ] 슬라이더 동작
- [ ] 예상 시간 계산 (frames / fps)
- [ ] 설정 값 videoStore 저장

---

### ✅ P0-204: ComfyUI API 클라이언트 ⚠️
**복잡도**: Large | **소요 시간**: 4-6시간 | **의존성**: P0-004
**주의**: 외부 서버 의존성 - Mock API 우선 구현 권장

#### 체크리스트

##### lib/comfyui.ts
- [ ] ComfyUI 서버 연결
```typescript
const COMFYUI_URL = process.env.NEXT_PUBLIC_COMFYUI_URL || 'http://localhost:8188';
```

- [ ] 이미지 업로드 API
```typescript
async function uploadImage(image: Blob, filename: string): Promise<void>
```

- [ ] 워크플로우 실행 API
```typescript
async function queuePrompt(workflow: any): Promise<string> // prompt_id
```

- [ ] 결과 폴링 (HTTP)
```typescript
async function getHistory(promptId: string): Promise<any>
```

- [ ] WebSocket 연결 (선택사항)
  - [ ] 진행률 업데이트
  - [ ] 실시간 알림

##### lib/workflows/svd-loop.json
- [ ] SVD 루프 워크플로우 JSON
```json
{
  "1": {
    "class_type": "LoadImage",
    "inputs": { "image": "start.png" }
  },
  "2": {
    "class_type": "SVDimg2vid",
    "inputs": {
      "image": ["1", 0],
      "video_frames": 25,
      "motion_bucket_id": 50,
      "fps": 8,
      "seed": 42
    }
  },
  "3": {
    "class_type": "SaveVideo",
    "inputs": {
      "video": ["2", 0],
      "filename_prefix": "loop_"
    }
  }
}
```

##### lib/workflows/svd-story.json
- [ ] SVD 스토리 워크플로우 JSON
- [ ] 시작/끝 이미지 보간

##### Mock API (ComfyUI 없을 때)
- [ ] `lib/comfyui-mock.ts` 생성
- [ ] 가짜 비디오 URL 반환
- [ ] 타이머로 진행률 시뮬레이션

#### 검증
- [ ] ComfyUI 서버 연결 확인
- [ ] 이미지 업로드 테스트
- [ ] 워크플로우 실행 테스트
- [ ] 결과 다운로드 테스트
- [ ] Mock API 동작 (서버 없을 때)

---

### ✅ P0-205: 비디오 생성 페이지
**복잡도**: Large | **소요 시간**: 3-4시간 | **의존성**: P0-202, P0-203, P0-204

#### 체크리스트

##### app/(features)/video-generator/page.tsx
- [ ] 페이지 레이아웃
  - [ ] 3단계 플로우
    1. 이미지 선택
    2. 설정
    3. 생성 & 프리뷰
- [ ] 컴포넌트 통합
  - [ ] `<ImageUploader />`
  - [ ] `<VideoSettings />`
- [ ] 비디오 생성 플로우
  - [ ] 이미지 → S3 업로드
  - [ ] ComfyUI 워크플로우 실행
  - [ ] 진행률 표시
  - [ ] 결과 다운로드 & S3 저장
- [ ] 비디오 프리뷰 플레이어
  - [ ] HTML5 video 태그
  - [ ] 재생/일시정지
  - [ ] 다운로드 버튼
  - [ ] 에디터로 전송 버튼

#### 페이지 레이아웃
```
┌────────────────────────────────────────┐
│  🎬 비디오 생성기                       │
├───────────────┬────────────────────────┤
│               │                        │
│  [Step 1]     │     [Step 3]           │
│  이미지 선택   │     프리뷰              │
│               │                        │
│  [Step 2]     │  ┌──────────────┐     │
│  설정         │  │  [비디오]    │     │
│               │  └──────────────┘     │
│               │  [▶] [⬇] [→에디터]    │
│  [생성하기]   │                        │
│               │                        │
└───────────────┴────────────────────────┘
```

#### 생성 플로우
1. [ ] 시작/끝 이미지 유효성 검사
2. [ ] S3에 이미지 업로드
3. [ ] ComfyUI 워크플로우 생성
4. [ ] 워크플로우 실행 & 진행률
5. [ ] 결과 비디오 다운로드
6. [ ] S3에 비디오 업로드
7. [ ] videoStore에 저장

#### 검증
- [ ] 페이지 접근 가능
- [ ] 전체 플로우 테스트
  1. 이미지 업로드
  2. 설정 조정
  3. 생성 버튼
  4. 진행률 표시
  5. 비디오 프리뷰
- [ ] 에러 처리 (이미지 없음, API 실패)
- [ ] 에디터로 전송 동작

---

## 🎉 P0 완료 조건

### Phase 0 완료
- [ ] Next.js 프로젝트 정상 실행
- [ ] 모든 라이브러리 설치
- [ ] 랜딩 페이지 표시

### Phase 1A 완료
- [ ] 이미지 생성 페이지 동작
- [ ] Gemini API로 이미지 생성 성공
- [ ] S3 업로드 동작

### Phase 1B 완료
- [ ] 비디오 생성 페이지 동작
- [ ] ComfyUI 워크플로우 실행 (또는 Mock)
- [ ] 비디오 프리뷰 재생

### MVP 데모 가능
- [ ] 이미지 생성 → 비디오 생성 전체 플로우
- [ ] 기본 UI/UX 완성
- [ ] 에러 핸들링

---

**다음 단계**: [TASKS_P1.md](./TASKS_P1.md) - 비디오 에디터 핵심 기능 구현