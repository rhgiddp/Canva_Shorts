'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditorStore } from '@/store/editorStore';
import { Plus, FolderOpen } from 'lucide-react';

export default function EditorPage() {
  const router = useRouter();
  const { createProject } = useEditorStore();

  const handleCreateProject = () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      createProject(projectName);
      router.push('/editor/new');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Video Editor</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and edit video projects
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Create new project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={handleCreateProject}
              className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-dashed border-indigo-300 hover:border-indigo-500 group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Plus className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">New Project</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Start from scratch
                  </p>
                </div>
              </div>
            </button>

            <Link
              href="/editor/projects"
              className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-300 group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <FolderOpen className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Open Project</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Continue editing
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>Multi-track Timeline:</strong> Arrange and edit multiple video clips
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>Canvas Overlay:</strong> Add text, shapes, and animations with Fabric.js
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>Transitions:</strong> Apply fade, wipe, and dissolve effects between clips
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>Audio System:</strong> Add TTS, background music, and sound effects
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 font-bold">•</span>
                <div>
                  <strong>Export:</strong> Render final video with FFmpeg
                </div>
              </li>
            </ul>
          </div>

          {/* Quick actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/image-generator"
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Generate Images
            </Link>
            <Link
              href="/video-generator"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              Generate Videos
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
