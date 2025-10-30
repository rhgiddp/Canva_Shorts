'use client';

import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/store/editorStore';
import {
  initializeCanvas,
  disposeCanvas,
  addObject,
  removeObject,
  selectObject,
  deselectAll,
  getActiveObject,
  interpolateKeyframes,
  serializeCanvas,
  deserializeCanvas,
} from '@/lib/canvas';

export const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const {
    settings,
    currentTime,
    isPlaying,
    canvasElements,
    selectedCanvasElementId,
    selectCanvasElement,
    updateCanvasElement,
  } = useEditorStore();

  const [isReady, setIsReady] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = initializeCanvas(canvasRef.current, {
      width: settings.resolution.width,
      height: settings.resolution.height,
      backgroundColor: 'transparent',
    });

    fabricCanvasRef.current = canvas;
    setIsReady(true);

    // Event handlers
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);

    return () => {
      if (fabricCanvasRef.current) {
        disposeCanvas(fabricCanvasRef.current);
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update canvas size when settings change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.setWidth(settings.resolution.width);
    fabricCanvasRef.current.setHeight(settings.resolution.height);
    fabricCanvasRef.current.renderAll();
  }, [settings.resolution]);

  // Handle selection
  const handleSelection = (e: fabric.IEvent) => {
    const activeObject = e.selected?.[0];
    if (activeObject) {
      const id = (activeObject as any).id;
      if (id) {
        selectCanvasElement(id);
      }
    }
  };

  const handleSelectionCleared = () => {
    selectCanvasElement(null);
  };

  const handleObjectModified = (e: fabric.IEvent) => {
    const object = e.target;
    if (!object) return;

    const id = (object as any).id;
    if (!id) return;

    // Update store with modified properties
    updateCanvasElement(id, {
      left: object.left,
      top: object.top,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      angle: object.angle,
      opacity: object.opacity,
    } as any);
  };

  // Sync canvas objects with store
  useEffect(() => {
    if (!fabricCanvasRef.current || !isReady) return;

    const canvas = fabricCanvasRef.current;
    const currentObjects = canvas.getObjects();

    // Remove objects that are no longer in store
    currentObjects.forEach((obj) => {
      const id = (obj as any).id;
      const existsInStore = canvasElements.some((el: any) => el.id === id);

      if (!existsInStore) {
        removeObject(canvas, obj);
      }
    });

    // Add new objects from store
    canvasElements.forEach((element: any) => {
      const existsInCanvas = currentObjects.some((obj: any) => obj.id === element.id);

      if (!existsInCanvas) {
        // TODO: Create fabric object from element data
        // For now, skip
      }
    });

    canvas.renderAll();
  }, [canvasElements, isReady]);

  // Update keyframe animations
  useEffect(() => {
    if (!fabricCanvasRef.current || !isReady || isPlaying) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();

    objects.forEach((obj) => {
      interpolateKeyframes(obj, currentTime);
    });

    canvas.renderAll();
  }, [currentTime, isReady, isPlaying]);

  // Select active object
  useEffect(() => {
    if (!fabricCanvasRef.current || !isReady) return;

    const canvas = fabricCanvasRef.current;

    if (selectedCanvasElementId) {
      const objects = canvas.getObjects();
      const object = objects.find((obj: any) => obj.id === selectedCanvasElementId);

      if (object) {
        selectObject(canvas, object);
      }
    } else {
      deselectAll(canvas);
    }
  }, [selectedCanvasElementId, isReady]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;
      const activeObject = getActiveObject(canvas);

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        const id = (activeObject as any).id;
        if (id) {
          const { removeCanvasElement } = useEditorStore.getState();
          removeCanvasElement(id);
        }
      }

      // Copy (Cmd/Ctrl + C)
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && activeObject) {
        activeObject.clone((cloned: fabric.Object) => {
          (canvas as any)._clipboard = cloned;
        });
      }

      // Paste (Cmd/Ctrl + V)
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        const clipboard = (canvas as any)._clipboard;
        if (clipboard) {
          clipboard.clone((cloned: fabric.Object) => {
            cloned.set({
              left: (cloned.left || 0) + 10,
              top: (cloned.top || 0) + 10,
            });
            (cloned as any).id = `${Date.now()}`;
            addObject(canvas, cloned);

            const { addCanvasElement } = useEditorStore.getState();
            addCanvasElement(cloned);
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
      <div className="relative border border-gray-700 shadow-xl">
        <canvas ref={canvasRef} />

        {/* Grid overlay */}
        <div
          className="absolute top-0 left-0 pointer-events-none opacity-20"
          style={{
            width: settings.resolution.width,
            height: settings.resolution.height,
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};
