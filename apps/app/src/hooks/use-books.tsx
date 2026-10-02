import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only library: v1 stores the original PDF/TXT/EPUB file in
// IndexedDB (35MB cap) and extracts text via PDF.js/JSZip loaded from a
// CDN. Here PDF.js/JSZip are real npm deps instead of CDN scripts (see
// src/lib/book-text.ts), but only the *extracted text* is kept — not the
// original file — since AsyncStorage (not IndexedDB) is the storage here.
// MAX_UPLOAD_SIZE gates the original file (extraction can be slow/memory-
// heavy for a huge PDF); MAX_TEXT_LENGTH gates what actually gets stored.
// 35MB matches v1's IndexedDB cap (docs/DESIGN.md §0).
export const MAX_UPLOAD_SIZE = 35 * 1024 * 1024; // 35MB original file
export const MAX_TEXT_LENGTH = 2_500_000; // ~2.5MB of extracted text

const STORAGE_KEY = 'phonicspal.books';

export type BookExt = 'txt' | 'pdf' | 'epub';

export interface Book {
  id: string;
  name: string;
  ext: BookExt;
  size: number; // original file size, for display
  text: string;
}

interface BooksContextValue {
  loading: boolean;
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  removeBook: (id: string) => void;
}

const BooksContext = createContext<BooksContextValue | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setBooks(JSON.parse(raw) as Book[]);
      })
      .finally(() => setLoading(false));
  }, []);

  function persist(next: Book[]) {
    setBooks(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: BooksContextValue = {
    loading,
    books,
    addBook: (book) => persist([{ ...book, id: `${Date.now()}` }, ...books]),
    removeBook: (id) => persist(books.filter((b) => b.id !== id)),
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksContextValue {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooks must be used within BooksProvider');
  return ctx;
}
