import { AudioTrack } from '@/types/editor';

export class AudioMixer {
  private audioContext: AudioContext;
  private sources: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async loadAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  playTrack(track: AudioTrack, audioBuffer: AudioBuffer, startTime: number = 0): void {
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = track.volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(this.audioContext.currentTime, startTime);
    this.sources.set(track.id, source);
  }

  stopTrack(trackId: string): void {
    const source = this.sources.get(trackId);
    if (source) {
      source.stop();
      this.sources.delete(trackId);
    }
  }

  stopAll(): void {
    this.sources.forEach((source) => source.stop());
    this.sources.clear();
  }

  async mixTracks(tracks: AudioTrack[]): Promise<AudioBuffer> {
    // TODO: Implement proper audio mixing
    // This is a placeholder - real mixing requires more complex implementation
    throw new Error('Audio mixing not fully implemented yet');
  }

  close(): void {
    this.stopAll();
    this.audioContext.close();
  }
}
