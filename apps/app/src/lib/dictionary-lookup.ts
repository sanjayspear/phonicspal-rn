import { starterDictionary, type DictionaryWord } from '@phonicspal/core';

function normalize(rawWord: string): string {
  return rawWord.toLowerCase().replace(/[^a-z']/g, '');
}

interface FreeDictionaryEntry {
  meanings?: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}

const LOOKUP_TIMEOUT_MS = 8000;

// Looks up a tapped word for the "listening to a book, like a word, save
// it" flow (apps/app/src/components/read-aloud-card.tsx): the starter
// list first (instant, offline), then the Free Dictionary API
// (api.dictionaryapi.dev, no key needed) for anything outside it — the
// same online source v1's js/dictionary.js used, per the header comment
// in packages/core/src/dictionary.ts, not ported until now. Returns null
// if the word isn't found anywhere, the lookup fails, or it doesn't
// respond within LOOKUP_TIMEOUT_MS (a blocked/offline network must fail
// the lookup, not leave the "looking it up…" sheet spinning forever).
export async function lookupWord(rawWord: string): Promise<DictionaryWord | null> {
  const w = normalize(rawWord);
  if (!w) return null;

  const local = starterDictionary.find((d) => d.w === w);
  if (local) return local;

  // AbortController + setTimeout rather than AbortSignal.timeout(): this
  // runs on Hermes (native) too, where that newer static method isn't
  // reliably available.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;

    const entries = (await res.json()) as FreeDictionaryEntry[];
    const meaning = entries[0]?.meanings?.[0];
    const definition = meaning?.definitions?.[0];
    if (!meaning || !definition) return null;

    return { w, p: meaning.partOfSpeech, m: definition.definition, e: definition.example ?? '' };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
