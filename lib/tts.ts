export type TTSLanguage = 'ko' | 'en' | 'ja';
export type TTSVoice = string;

export interface TTSOptions {
  text: string;
  language: TTSLanguage;
  voice?: TTSVoice;
  speed: number; // 0.5 to 2.0
}

export interface TTSResult {
  audioUrl: string;
  duration: number;
  text: string;
}

/**
 * Web Speech API TTS (Browser-based, free)
 */
export async function generateTTSBrowser(options: TTSOptions): Promise<TTSResult> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(options.text);

    // Set language
    const langMap: Record<TTSLanguage, string> = {
      ko: 'ko-KR',
      en: 'en-US',
      ja: 'ja-JP',
    };
    utterance.lang = langMap[options.language];

    // Set voice if specified
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Set speed
    utterance.rate = options.speed;

    // Estimate duration (rough approximation)
    const wordsPerMinute = 150 * options.speed;
    const words = options.text.split(' ').length;
    const estimatedDuration = (words / wordsPerMinute) * 60;

    utterance.onend = () => {
      // Note: Browser TTS doesn't produce an audio file
      // For real implementation, consider using a proper TTS API
      resolve({
        audioUrl: '', // No URL for browser TTS
        duration: estimatedDuration,
        text: options.text,
      });
    };

    utterance.onerror = (event) => {
      reject(new Error(`TTS error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

/**
 * Get available voices for Web Speech API
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  return speechSynthesis.getVoices();
}

/**
 * Get voices for specific language
 */
export function getVoicesByLanguage(language: TTSLanguage): SpeechSynthesisVoice[] {
  const langMap: Record<TTSLanguage, string> = {
    ko: 'ko',
    en: 'en',
    ja: 'ja',
  };

  const voices = getAvailableVoices();
  return voices.filter(voice => voice.lang.startsWith(langMap[language]));
}

/**
 * Generate TTS using external API (placeholder for future implementation)
 * Examples: Google Cloud TTS, Amazon Polly, ElevenLabs, etc.
 */
export async function generateTTSAPI(options: TTSOptions): Promise<TTSResult> {
  // TODO: Implement external TTS API integration
  // For now, return a placeholder
  throw new Error('External TTS API not implemented yet. Use browser TTS for now.');
}

/**
 * Convert text to audio blob using MediaRecorder (captures browser TTS)
 */
export async function captureAudioFromTTS(options: TTSOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window) || !('MediaRecorder' in window)) {
      reject(new Error('Required APIs not supported'));
      return;
    }

    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dest = audioContext.createMediaStreamDestination();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(options.text);
    const langMap: Record<TTSLanguage, string> = {
      ko: 'ko-KR',
      en: 'en-US',
      ja: 'ja-JP',
    };
    utterance.lang = langMap[options.language];
    utterance.rate = options.speed;

    // Setup media recorder
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(dest.stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      resolve(blob);
    };

    utterance.onstart = () => {
      mediaRecorder.start();
    };

    utterance.onend = () => {
      mediaRecorder.stop();
      audioContext.close();
    };

    utterance.onerror = (event) => {
      mediaRecorder.stop();
      audioContext.close();
      reject(new Error(`TTS error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

/**
 * Create audio URL from blob
 */
export function createAudioURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Clean up audio URL
 */
export function revokeAudioURL(url: string): void {
  URL.revokeObjectURL(url);
}
