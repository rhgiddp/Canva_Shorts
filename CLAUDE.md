# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered shorts creator with two main phases:
1. **Generation Phase**: Create images and videos using Gemini 2.5 Flash (나노바나나) and ComfyUI/SVD
2. **Editor Phase**: Canva-style video editor for combining, editing, and enhancing content

## Architecture & Technical Stack

### Core Technologies
- **Framework**: Next.js 15.1.6 with App Router, React 19
- **Canvas Engine**: Fabric.js 5.3.0-browser for drawing and animations
- **Video Processing**: @ffmpeg/ffmpeg for browser-based video manipulation
- **Storage**: AWS S3 (client-s3, s3-request-presigner)
- **State Management**: Zustand 4.5.4
- **UI Components**: Radix UI components, Lucide React icons
- **Spreadsheet/Docs**: Univerjs suite (for future expansions)

### Backend Integration Points
- Gemini 2.5 Flash API for image generation
- ComfyUI with SVD (Stable Video Diffusion) for video creation
- FastAPI server for orchestration (reference implementation in PRD)

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev          # Runs on http://localhost:3000

# Production build
npm run build
npm run start

# Code quality
npm run lint

# Testing (when tests are added)
npm test
npm run test:watch
```

## Project Structure

```
app/
├── page.tsx                    # Main landing page
├── layout.tsx                  # Root layout with providers
└── (features)/
    ├── image-generator/        # Phase 1: AI image generation
    │   └── page.tsx           # Gemini 2.5 Flash interface
    ├── video-generator/        # Phase 1: Image to video
    │   └── page.tsx           # SVD video generation
    └── editor/                # Phase 2: Video editor
        ├── page.tsx           # Main editor interface
        └── [projectId]/       # Project-specific editing

components/
├── ImageGenerator/
│   ├── PromptInput.tsx       # Text prompt interface
│   └── ImagePreview.tsx      # Generated image display
├── VideoGenerator/
│   ├── ImageUploader.tsx     # Start/end image selection
│   └── VideoSettings.tsx     # FPS, frames, loop/story mode
└── Editor/
    ├── Canvas/
    │   ├── FabricCanvas.tsx   # Main Fabric.js canvas
    │   └── CanvasTools.tsx    # Drawing tools interface
    ├── Timeline/
    │   ├── VideoTimeline.tsx  # Multi-track timeline
    │   └── Keyframes.tsx      # Animation keyframes
    ├── Transitions/           # Video transition effects
    ├── AudioManager/          # TTS, music, sound effects
    └── Player/               # Real-time preview player

lib/
├── api.ts                     # API client for backend
├── canvas.ts                  # Fabric.js wrapper utilities
├── ffmpeg.ts                  # FFmpeg initialization and ops
└── s3.ts                      # AWS S3 upload/download

store/
├── imageStore.ts              # Generated images state
├── videoStore.ts              # Video clips and settings
└── editorStore.ts             # Editor state, timeline, canvas

types/
├── canvas.d.ts                # Fabric.js type extensions
└── editor.d.ts                # Editor-specific types
```

## Key Implementation Priorities

### Phase 1: Generation Features
1. **Image Generator**
   - Google AI Studio-like interface for Gemini 2.5 Flash
   - Prompt engineering for 나노바나나 style images
   - Batch generation support

2. **Video Generator**
   - Story mode: Different start/end images for narrative
   - Loop mode: Same image for game character animations
   - 8 FPS, 25 frames default settings

### Phase 2: Editor Features
1. **Video Composition**
   - Multiple MP4 concatenation with transitions
   - Fade, wipe, dissolve effects between clips
   - Timeline-based editing interface

2. **Canvas Overlay System**
   - Fabric.js elements on top of video
   - Tween animations for canvas elements
   - Keyframe-based animation editor

3. **Audio System**
   - TTS subtitle generation (multi-language)
   - Background music tracks
   - Sound effect insertion at specific timestamps
   - Audio mixing and volume controls

4. **Export Pipeline**
   - Combine video + canvas + audio layers
   - Real-time preview before final render
   - FFmpeg-based final video generation

## Technical Decisions & Rationale

### Why Fabric.js 5.3.0
- Robust canvas manipulation with object model
- Built-in animation and tweening support
- Serialization for saving/loading projects
- Active community and extensive documentation

### Why FFmpeg in Browser
- No backend required for basic video operations
- Client-side processing for privacy
- Reduce server costs for video processing
- WebAssembly performance is sufficient for shorts

### Why Zustand over Redux
- Minimal boilerplate for rapid development
- TypeScript-first with excellent inference
- Lightweight (8kb) for better performance
- Simple async actions without middleware

### Why Radix UI
- Unstyled, accessible components
- Composable architecture fits with Tailwind
- Production-ready with proper ARIA support
- Consistent API across all components

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_API_KEY=your-gemini-api-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name
```

## Critical Implementation Notes

### Canvas-Video Synchronization
- Fabric.js canvas must be frame-synchronized with video playback
- Use requestAnimationFrame for smooth animations
- Cache rendered frames for performance

### Memory Management
- Dispose of Fabric objects when unmounting
- Clean up video blobs after processing
- Implement progressive loading for long videos

### Cross-Browser Compatibility
- Test FFmpeg WASM loading on Safari
- Ensure Fabric.js works with touch events
- Fallback for browsers without SharedArrayBuffer

### Performance Optimization
- Lazy load heavy components (Editor, FFmpeg)
- Use video thumbnails for timeline preview
- Implement virtual scrolling for long timelines
- Web Workers for heavy computations

## Integration with Existing System

This project is designed to be integrated with "the-canvas" project later. Key considerations:
- Modular component architecture for easy extraction
- Consistent state management patterns
- Shared UI component library (Radix UI)
- Compatible routing structure with Next.js App Router