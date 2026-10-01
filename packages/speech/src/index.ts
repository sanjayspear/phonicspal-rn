// SpeechEngine interface — see PHONICSPAL_RN_DESIGN_DOC.md §3.3.
//
// expo-speech wraps the platform TTS on iOS/Android and the browser's
// SpeechSynthesis API on web, so one implementation covers every target
// this app ships to — the native/web split the design doc anticipated
// turned out to only matter for the *high-quality* voices (v1's
// Kokoro/Piper WASM models), which are still future work. This is the
// "browser voice"-equivalent fallback tier, not a port of those.
import * as Speech from 'expo-speech';

export interface SpeechBoundary {
  charIndex: number;
  charLength: number;
}

export interface SpeechEngine {
  name: string;
  say(
    text: string,
    opts?: { rate?: number; onBoundary?: (e: SpeechBoundary) => void }
  ): Promise<void>;
  stop(): void;
}

export const expoSpeechEngine: SpeechEngine = {
  name: 'expo-speech',
  say(text, opts) {
    return new Promise((resolve) => {
      Speech.speak(text, {
        rate: opts?.rate ?? 0.85,
        onBoundary: opts?.onBoundary,
        onDone: resolve,
        onStopped: resolve,
        onError: () => resolve(),
      });
    });
  },
  stop() {
    Speech.stop();
  },
};
