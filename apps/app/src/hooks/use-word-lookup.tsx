import type { DictionaryWord } from '@phonicspal/core';
import { useState } from 'react';

import { lookupWord } from '@/lib/dictionary-lookup';

export interface WordLookupState {
  word: string | null;
  result: DictionaryWord | null;
  loading: boolean;
  failed: boolean;
  open: (rawWord: string) => void;
  close: () => void;
}

// Shared by every "tap a word to look it up and save it" surface
// (apps/app/src/components/read-aloud-card.tsx for Read/Books, and the
// Phonics screen's word-bearing cards) so the fetch/state logic lives in
// one place instead of being copy-pasted per screen.
export function useWordLookup(): WordLookupState {
  const [word, setWord] = useState<string | null>(null);
  const [result, setResult] = useState<DictionaryWord | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function open(rawWord: string) {
    const clean = rawWord.replace(/[^a-zA-Z']/g, '');
    if (!clean) return;

    setWord(clean);
    setResult(null);
    setFailed(false);
    setLoading(true);
    const found = await lookupWord(clean);
    setLoading(false);
    if (found) setResult(found);
    else setFailed(true);
  }

  function close() {
    setWord(null);
    setResult(null);
    setFailed(false);
  }

  return { word, result, loading, failed, open, close };
}
