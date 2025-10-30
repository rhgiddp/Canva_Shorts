'use client';

import React, { useState } from 'react';
import { Type, Square, Circle, Image, Brush, Eraser } from 'lucide-react';
import { createText, createRect, createCircle, createImage } from '@/lib/canvas';
import { useEditorStore } from '@/store/editorStore';

export type ToolType = 'select' | 'text' | 'rect' | 'circle' | 'image' | 'brush' | 'eraser';

export const CanvasTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [textInput, setTextInput] = useState('');
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { addCanvasElement } = useEditorStore();

  const tools: Array<{ type: ToolType; icon: React.ReactNode; label: string }> = [
    { type: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
    { type: 'rect', icon: <Square className="w-5 h-5" />, label: 'Rectangle' },
    { type: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Circle' },
    { type: 'image', icon: <Image className="w-5 h-5" />, label: 'Image' },
    { type: 'brush', icon: <Brush className="w-5 h-5" />, label: 'Brush' },
    { type: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser' },
  ];

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(tool);

    switch (tool) {
      case 'text':
        setShowTextDialog(true);
        break;
      case 'rect':
        handleAddRect();
        break;
      case 'circle':
        handleAddCircle();
        break;
      case 'image':
        setShowImageDialog(true);
        break;
      case 'brush':
        // TODO: Enable drawing mode
        break;
      case 'eraser':
        // TODO: Enable eraser mode
        break;
    }
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;

    const textObject = createText(textInput, {
      left: 100,
      top: 100,
      fontSize: 32,
    });

    addCanvasElement(textObject);
    setTextInput('');
    setShowTextDialog(false);
    setActiveTool('select');
  };

  const handleAddRect = () => {
    const rect = createRect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#8b5cf6',
    });

    addCanvasElement(rect);
    setActiveTool('select');
  };

  const handleAddCircle = () => {
    const circle = createCircle({
      left: 100,
      top: 100,
      radius: 75,
      fill: '#ec4899',
    });

    addCanvasElement(circle);
    setActiveTool('select');
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;

    try {
      const img = await createImage(imageUrl);
      addCanvasElement(img);
      setImageUrl('');
      setShowImageDialog(false);
      setActiveTool('select');
    } catch (error) {
      alert('Failed to load image. Please check the URL.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      try {
        const img = await createImage(dataUrl);
        addCanvasElement(img);
        setShowImageDialog(false);
        setActiveTool('select');
      } catch (error) {
        alert('Failed to load image.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 mr-2">Tools:</span>

        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => handleToolClick(tool.type)}
            className={`p-2 rounded transition-colors ${
              activeTool === tool.type
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Text Dialog */}
      {showTextDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">Add Text</h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
              placeholder="Enter text..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddText}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowTextDialog(false);
                  setTextInput('');
                  setActiveTool('select');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">Add Image</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Or upload file</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddImage}
                disabled={!imageUrl.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl('');
                  setActiveTool('select');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
