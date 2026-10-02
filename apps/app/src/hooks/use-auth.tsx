import type { Role } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only auth for now (no password storage, no backend) — mirrors the
// shape of v1's localProvider: accounts (email -> role) persist separately
// from the current session, so logging out doesn't forget a role chosen at
// sign-up. Real auth (Firebase vs. local, per docs/DESIGN.md §5 open items)
// swaps in behind this same hook without screens needing to change.
const ACCOUNTS_KEY = 'phonicspal.accounts';
const SESSION_KEY = 'phonicspal.session';

// Temporary demo credentials (per the "any user should be able to log in
// and try each role" request) — fixed emails that always resolve to a
// given role on log in, so anyone can try the Teacher/Parent/Solo
// experience without signing up first. logIn() never checks a password
// (see below), so these work with any password, including a blank one.
// Remove once real auth (and real per-user accounts) lands.
export const DEMO_ACCOUNTS: { email: string; role: Role }[] = [
  { email: 'teacher.demo@phonicspal.app', role: 'teacher' },
  { email: 'parent.demo@phonicspal.app', role: 'parent' },
  { email: 'solo.demo@phonicspal.app', role: 'solo' },
];
const DEMO_ROLE_BY_EMAIL: Record<string, Role> = Object.fromEntries(
  DEMO_ACCOUNTS.map((a) => [a.email, a.role])
);

export interface Session {
  email: string;
  role: Role;
}

type Accounts = Record<string, Role>;

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signUp: (email: string, role: Role) => Promise<void>;
  logIn: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readAccounts(): Promise<Accounts> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  return raw ? (JSON.parse(raw) as Accounts) : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((raw) => setSession(raw ? (JSON.parse(raw) as Session) : null))
      .finally(() => setLoading(false));
  }, []);

  async function setCurrentSession(next: Session | null) {
    setSession(next);
    if (next) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else await AsyncStorage.removeItem(SESSION_KEY);
  }

  const value: AuthContextValue = {
    session,
    loading,
    signUp: async (email, role) => {
      const accounts = await readAccounts();
      accounts[email] = role;
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      await setCurrentSession({ email, role });
    },
    logIn: async (email) => {
      const accounts = await readAccounts();
      const role = accounts[email] ?? DEMO_ROLE_BY_EMAIL[email] ?? 'solo';
      await setCurrentSession({ email, role });
    },
    logOut: () => setCurrentSession(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
