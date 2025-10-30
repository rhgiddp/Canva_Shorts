/**
 * Project serialization and deserialization for saving/loading
 */

import { serializeCanvas, deserializeCanvas } from './canvas';

export interface SerializedProject {
  version: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: any;
  tracks: any[];
  canvasElements: any[];
  canvasData?: string; // Serialized Fabric.js canvas
  metadata: {
    duration: number;
    fps: number;
    resolution: {
      width: number;
      height: number;
    };
  };
}

/**
 * Current project format version
 */
const PROJECT_VERSION = '1.0.0';

/**
 * Serialize editor state to JSON
 */
export function serializeProject(
  state: any,
  fabricCanvas?: any
): SerializedProject {
  const project: SerializedProject = {
    version: PROJECT_VERSION,
    id: state.currentProject?.id || '',
    name: state.currentProject?.name || 'Untitled Project',
    createdAt: state.currentProject?.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: state.settings || {},
    tracks: state.tracks || [],
    canvasElements: state.canvasElements || [],
    metadata: {
      duration: state.duration || 0,
      fps: state.settings?.fps || 30,
      resolution: state.settings?.resolution || { width: 1920, height: 1080 },
    },
  };

  // Serialize Fabric.js canvas if provided
  if (fabricCanvas) {
    try {
      const serialized = serializeCanvas(fabricCanvas);
      project.canvasData = JSON.stringify(serialized);
    } catch (error) {
      console.error('Failed to serialize canvas:', error);
    }
  }

  return project;
}

/**
 * Deserialize JSON to editor state
 */
export function deserializeProject(
  data: SerializedProject,
  fabricCanvas?: any
): any {
  // Version check
  if (data.version !== PROJECT_VERSION) {
    console.warn(
      `Project version mismatch: ${data.version} (expected ${PROJECT_VERSION})`
    );
    // In production, you might want to run migrations here
  }

  const state: any = {
    currentProject: {
      id: data.id,
      name: data.name,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      settings: data.settings,
    },
    settings: data.settings,
    tracks: data.tracks,
    canvasElements: data.canvasElements,
    duration: data.metadata.duration,
  };

  // Deserialize Fabric.js canvas if provided
  if (fabricCanvas && data.canvasData) {
    try {
      const parsed = JSON.parse(data.canvasData);
      deserializeCanvas(fabricCanvas, parsed);
    } catch (error) {
      console.error('Failed to deserialize canvas:', error);
    }
  }

  return state;
}

/**
 * Validate project data
 */
export function validateProject(data: any): data is SerializedProject {
  return (
    data &&
    typeof data === 'object' &&
    'version' in data &&
    'id' in data &&
    'name' in data &&
    'settings' in data &&
    'tracks' in data &&
    'metadata' in data
  );
}

/**
 * Export project to downloadable JSON file
 */
export function exportProjectToFile(project: SerializedProject): void {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Import project from JSON file
 */
export async function importProjectFromFile(
  file: File
): Promise<SerializedProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);

        if (!validateProject(data)) {
          throw new Error('Invalid project file format');
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Save project to localStorage
 */
export function saveProjectToLocalStorage(project: SerializedProject): void {
  const key = `canva-shorts-project-${project.id}`;

  try {
    localStorage.setItem(key, JSON.stringify(project));

    // Update project list
    const listKey = 'canva-shorts-project-list';
    const list = getProjectListFromLocalStorage();

    const existing = list.find((p) => p.id === project.id);
    if (existing) {
      existing.name = project.name;
      existing.updatedAt = project.updatedAt;
    } else {
      list.push({
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    }

    localStorage.setItem(listKey, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
    throw error;
  }
}

/**
 * Load project from localStorage
 */
export function loadProjectFromLocalStorage(
  projectId: string
): SerializedProject | null {
  const key = `canva-shorts-project-${projectId}`;

  try {
    const json = localStorage.getItem(key);
    if (!json) {
      return null;
    }

    const data = JSON.parse(json);

    if (!validateProject(data)) {
      throw new Error('Invalid project data in localStorage');
    }

    return data;
  } catch (error) {
    console.error('Failed to load project from localStorage:', error);
    return null;
  }
}

/**
 * Get project list from localStorage
 */
export function getProjectListFromLocalStorage(): Array<{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}> {
  const listKey = 'canva-shorts-project-list';

  try {
    const json = localStorage.getItem(listKey);
    if (!json) {
      return [];
    }

    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load project list from localStorage:', error);
    return [];
  }
}

/**
 * Delete project from localStorage
 */
export function deleteProjectFromLocalStorage(projectId: string): void {
  const key = `canva-shorts-project-${projectId}`;

  try {
    localStorage.removeItem(key);

    // Update project list
    const listKey = 'canva-shorts-project-list';
    const list = getProjectListFromLocalStorage();
    const filtered = list.filter((p) => p.id !== projectId);
    localStorage.setItem(listKey, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete project from localStorage:', error);
  }
}

/**
 * Save project to S3 (requires API endpoint)
 */
export async function saveProjectToS3(
  project: SerializedProject,
  uploadUrl: string
): Promise<void> {
  const json = JSON.stringify(project);
  const blob = new Blob([json], { type: 'application/json' });

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload project to S3');
  }
}

/**
 * Load project from S3 (requires API endpoint)
 */
export async function loadProjectFromS3(downloadUrl: string): Promise<SerializedProject> {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error('Failed to download project from S3');
  }

  const data = await response.json();

  if (!validateProject(data)) {
    throw new Error('Invalid project data from S3');
  }

  return data;
}

/**
 * Auto-save manager
 */
export class AutoSaveManager {
  private intervalId: NodeJS.Timeout | null = null;
  private isDirty = false;

  constructor(
    private saveInterval: number = 30000, // 30 seconds
    private onSave: () => Promise<void>
  ) {}

  start(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(async () => {
      if (this.isDirty) {
        try {
          await this.onSave();
          this.isDirty = false;
          console.log('[AutoSave] Project saved');
        } catch (error) {
          console.error('[AutoSave] Failed to save project:', error);
        }
      }
    }, this.saveInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  markDirty(): void {
    this.isDirty = true;
  }

  async saveNow(): Promise<void> {
    if (this.isDirty) {
      await this.onSave();
      this.isDirty = false;
    }
  }
}
