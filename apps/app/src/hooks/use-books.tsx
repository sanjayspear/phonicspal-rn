import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only library: v1 stores PDF/TXT/EPUB in IndexedDB with a 35MB cap
// and extracts text via PDF.js/JSZip (CDN scripts, web-only). Neither has a
// clean RN equivalent, so this is scoped down hard: .txt files only, text
// stored directly in AsyncStorage (not a separate file store), capped well
// below 35MB to stay within AsyncStorage's practical limits. PDF/EPUB
// support is future work, not attempted here.
const STORAGE_KEY = 'phonicspal.books';
export const MAX_BOOK_SIZE = 2 * 1024 * 1024; // 2MB — see note above

export interface Book {
  id: string;
  name: string;
  size: number;
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
