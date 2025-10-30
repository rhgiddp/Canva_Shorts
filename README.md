# Canva Short Creator

AI-powered shorts creator with two main phases:
1. **Generation Phase**: Create images and videos using Gemini 2.5 Flash and ComfyUI/SVD
2. **Editor Phase**: Canva-style video editor for combining, editing, and enhancing content

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📦 Project Status

### ✅ Phase 0: Project Foundation (Complete)
- ✅ Next.js 15.1.6 with App Router
- ✅ TypeScript & Tailwind CSS
- ✅ Core libraries installed
- ✅ Project structure created

### ✅ Phase 1A: Image Generator (Complete)
- ✅ Gemini 2.5 Flash integration
- ✅ Character configuration UI
- ✅ Image preview and batch generation
- ✅ S3 upload integration

### ✅ Phase 1B: Video Generator (Complete - Mock)
- ✅ Image uploader with drag & drop
- ✅ Video settings (FPS, frames, motion)
- ✅ ComfyUI API client (Mock implementation)
- ✅ Video preview player

### 🚧 Phase 2: Video Editor (Planned)
- ⏳ Timeline-based editing
- ⏳ Canvas overlay system (Fabric.js)
- ⏳ Transition effects
- ⏳ Audio system (TTS, music, sound effects)
- ⏳ FFmpeg export pipeline

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.6
- **Canvas**: Fabric.js 5.3.0
- **Video**: @ffmpeg/ffmpeg
- **State**: Zustand 4.5.4
- **UI**: Radix UI + Tailwind CSS
- **Storage**: AWS S3
- **AI**: Google Gemini 2.5 Flash

## 📁 Project Structure

```
canva-short-creater/
├── app/
│   ├── (features)/
│   │   ├── image-generator/    # Phase 1A
│   │   ├── video-generator/    # Phase 1B
│   │   └── editor/             # Phase 2
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── ImageGenerator/
│   ├── VideoGenerator/
│   └── Editor/                 # Phase 2
├── lib/
│   ├── api.ts
│   ├── gemini.ts
│   ├── comfyui.ts
│   ├── s3.ts
│   └── workflows/              # ComfyUI workflows
├── store/
│   ├── imageStore.ts
│   └── videoStore.ts
└── types/
    ├── api.d.ts
    ├── canvas.d.ts
    └── editor.d.ts
```

## 🔧 Environment Variables

Create a `.env.local` file:

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
NEXT_PUBLIC_USE_MOCK_COMFYUI=true
```

## 📝 Development Progress

See [TASKS_P0.md](./TASKS_P0.md) for detailed task checklist.

**Current Status**: Phase 1 (Generation) Complete, Phase 2 (Editor) Pending

## 🎯 Next Steps

1. Implement Phase 2A: Timeline & Player
2. Add Fabric.js canvas overlay system
3. Integrate FFmpeg export pipeline
4. Add audio system (TTS, music, SFX)
5. Performance optimization

## 📚 Documentation

- **Project Guide**: [CLAUDE.md](./CLAUDE.md)
- **Task Checklist**: [TASKS.md](./TASKS.md)
- **P0 Tasks**: [TASKS_P0.md](./TASKS_P0.md)

## 🤝 Contributing

This is an MVP project in active development. Contributions welcome!

## 📄 License

MIT
