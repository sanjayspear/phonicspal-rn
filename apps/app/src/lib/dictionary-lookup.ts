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

// 'offline' vs 'not-found' are deliberately distinct outcomes: a timed-out
// fetch or a DNS/connection failure means "we couldn't ask," not "the
// dictionary doesn't have this word" — the word-lookup sheet shows a
// different, actionable message for each (see word-lookup-sheet.tsx)
// instead of collapsing both into one "No definition found."
export type LookupResult =
  | { status: 'found'; word: DictionaryWord }
  | { status: 'not-found' }
  | { status: 'offline' };

// Looks up a tapped word for the "listening to a book, like a word, save
// it" flow (apps/app/src/components/read-aloud-card.tsx): the starter
// list first (instant, offline), then the Free Dictionary API
// (api.dictionaryapi.dev, no key needed) for anything outside it — the
// same online source v1's js/dictionary.js used, per the header comment
// in packages/core/src/dictionary.ts, not ported until now. Doesn't
// respond within LOOKUP_TIMEOUT_MS a blocked/offline network must fail
// the lookup, not leave the "looking it up…" sheet spinning forever.
export async function lookupWord(rawWord: string): Promise<LookupResult> {
  const w = normalize(rawWord);
  if (!w) return { status: 'not-found' };

  const local = starterDictionary.find((d) => d.w === w);
  if (local) return { status: 'found', word: local };

  // AbortController + setTimeout rather than AbortSignal.timeout(): this
  // runs on Hermes (native) too, where that newer static method isn't
  // reliably available.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`, {
      signal: controller.signal,
    });
    // The Free Dictionary API answers a genuinely unlisted word with a
    // real 404 — that's the only case that means "not in the dictionary."
    // Any other non-OK status is the API itself being unreachable/erroring.
    if (!res.ok) return { status: res.status === 404 ? 'not-found' : 'offline' };

    const entries = (await res.json()) as FreeDictionaryEntry[];
    const meaning = entries[0]?.meanings?.[0];
    const definition = meaning?.definitions?.[0];
    if (!meaning || !definition) return { status: 'not-found' };

    return {
      status: 'found',
      word: { w, p: meaning.partOfSpeech, m: definition.definition, e: definition.example ?? '' },
    };
  } catch {
    // fetch rejects (not a non-OK response) for a DNS failure, a dropped
    // connection, or our own timeout abort above — all "couldn't reach
    // it," never "this word doesn't exist."
    return { status: 'offline' };
  } finally {
    clearTimeout(timer);
  }
}
