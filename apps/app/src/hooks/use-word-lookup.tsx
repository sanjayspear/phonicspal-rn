import type { DictionaryWord } from '@phonicspal/core';
import { useState } from 'react';

import { lookupWord } from '@/lib/dictionary-lookup';

// 'not-found' is a real answer (the dictionary was reached and genuinely
// has no entry); 'offline' means the lookup never got an answer at all —
// kept distinct so the sheet can tell the user which one happened instead
// of showing "No definition found" for a plain connectivity failure.
export type WordLookupFailure = 'not-found' | 'offline';

export interface WordLookupState {
  word: string | null;
  result: DictionaryWord | null;
  loading: boolean;
  failure: WordLookupFailure | null;
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
  const [failure, setFailure] = useState<WordLookupFailure | null>(null);

  async function open(rawWord: string) {
    const clean = rawWord.replace(/[^a-zA-Z']/g, '');
    if (!clean) return;

    setWord(clean);
    setResult(null);
    setFailure(null);
    setLoading(true);
    const outcome = await lookupWord(clean);
    setLoading(false);
    if (outcome.status === 'found') setResult(outcome.word);
    else setFailure(outcome.status);
  }

  function close() {
    setWord(null);
    setResult(null);
    setFailure(null);
  }

  return { word, result, loading, failure, open, close };
}
