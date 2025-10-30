'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditorStore } from '@/store/editorStore';
import { VideoTimeline } from '@/components/Editor/Timeline/VideoTimeline';
import { VideoPlayer } from '@/components/Editor/Player/VideoPlayer';
import { Save, Home, Upload, Download } from 'lucide-react';

export default function EditorProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { currentProject, saveProject, tracks, addTrack } = useEditorStore();

  const projectId = params.projectId as string;

  useEffect(() => {
    // If no project loaded and not "new", redirect
    if (projectId !== 'new' && !currentProject) {
      router.push('/editor');
    }
  }, [projectId, currentProject, router]);

  const handleSave = async () => {
    await saveProject();
    alert('Project saved!');
  };

  const handleImportVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      // Add video track if none exists
      const videoTracks = tracks.filter((t) => t.type === 'video');
      let targetTrackId = videoTracks[0]?.id;

      if (!targetTrackId) {
        addTrack('video');
        // Get the newly created track
        const newVideoTracks = useEditorStore.getState().tracks.filter((t) => t.type === 'video');
        targetTrackId = newVideoTracks[0]?.id;
      }

      // TODO: Upload files to S3 and add clips to timeline
      alert(`Selected ${files.length} video(s). Upload to S3 coming soon.`);
    };

    input.click();
  };

  const handleExport = () => {
    alert('Export functionality coming in Phase 2D');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-4">
        <Link
          href="/editor"
          className="p-2 hover:bg-gray-700 rounded"
          title="Back to projects"
        >
          <Home className="w-5 h-5" />
        </Link>

        <div className="flex-1">
          <h1 className="text-lg font-bold">
            {currentProject?.name || 'Untitled Project'}
          </h1>
        </div>

        <button
          onClick={handleImportVideo}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 text-sm"
        >
          <Upload className="w-4 h-4" />
          Import Video
        </button>

        <button
          onClick={handleSave}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          onClick={handleExport}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </header>

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Tools (Phase 2B) */}
        <div className="w-16 bg-gray-850 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
          <div className="text-xs text-gray-500 text-center">Tools</div>
          <div className="text-xs text-gray-600 text-center mt-4">Phase 2B</div>
        </div>

        {/* Center - Video player */}
        <div className="flex-1 flex flex-col">
          <VideoPlayer />
        </div>

        {/* Right sidebar - Properties (Phase 2B) */}
        <div className="w-64 bg-gray-850 border-l border-gray-700 p-4">
          <h3 className="text-sm font-bold mb-4">Properties</h3>
          <div className="text-xs text-gray-500">
            Select an element to edit its properties
          </div>
          <div className="text-xs text-gray-600 mt-4">Phase 2B</div>
        </div>
      </div>

      {/* Bottom - Timeline */}
      <div className="h-64 border-t border-gray-700">
        <VideoTimeline />
      </div>
    </div>
  );
}
