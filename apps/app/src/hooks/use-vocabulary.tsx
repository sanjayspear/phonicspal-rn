import type { DictionaryWord } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'phonicspal.savedWords';

interface VocabularyContextValue {
  loading: boolean;
  savedWords: DictionaryWord[];
  isSaved: (word: string) => boolean;
  saveWord: (word: DictionaryWord) => void;
  removeWord: (word: string) => void;
}

const VocabularyContext = createContext<VocabularyContextValue | null>(null);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [savedWords, setSavedWords] = useState<DictionaryWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSavedWords(JSON.parse(raw) as DictionaryWord[]);
      })
      .finally(() => setLoading(false));
  }, []);

  function persist(next: DictionaryWord[]) {
    setSavedWords(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: VocabularyContextValue = {
    loading,
    savedWords,
    isSaved: (word) => savedWords.some((x) => x.w === word),
    saveWord: (word) => persist([...savedWords.filter((x) => x.w !== word.w), word]),
    removeWord: (word) => persist(savedWords.filter((x) => x.w !== word)),
  };

  return <VocabularyContext.Provider value={value}>{children}</VocabularyContext.Provider>;
}

export function useVocabulary(): VocabularyContextValue {
  const ctx = useContext(VocabularyContext);
  if (!ctx) throw new Error('useVocabulary must be used within VocabularyProvider');
  return ctx;
}
