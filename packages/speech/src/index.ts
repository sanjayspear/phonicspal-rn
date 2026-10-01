// SpeechEngine interface — see PHONICSPAL_RN_DESIGN_DOC.md §3.3.
// apps/app registers platform-specific implementations:
//   native  -> expo-speech
//   web     -> browser speechSynthesis (+ optionally Kokoro/Piper, ported from v1 js/speech.js)

export interface SpeechEngine {
  name: string;
  say(text: string, opts?: { rate?: number }): Promise<void>;
  stop(): void;
}
