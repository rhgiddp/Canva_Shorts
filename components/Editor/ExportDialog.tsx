'use client';

import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportDialogProps {
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ onClose }) => {
  const [resolution, setResolution] = useState('1920x1080');
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }

    alert('Export complete! (This is a placeholder - actual export not yet implemented)');
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Export Video</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              disabled={isExporting}
            >
              <option value="1920x1080">1920x1080 (Full HD)</option>
              <option value="1280x720">1280x720 (HD)</option>
              <option value="3840x2160">3840x2160 (4K)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Frame Rate</label>
            <select
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              disabled={isExporting}
            >
              <option value="24">24 FPS</option>
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Quality</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              disabled={isExporting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>

          {isExporting && (
            <div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Exporting...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
