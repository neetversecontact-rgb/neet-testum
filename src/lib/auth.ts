// Lightweight localStorage-backed auth shim. Replace with Lovable Cloud when enabled.
import { useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  targetYear: number;
  joinedAt: string;
};

const KEY = "neetx_user";
const LISTENERS = new Set<() => void>();

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  LISTENERS.forEach((fn) => fn());
}

export function signIn(email: string, name?: string): User {
  const existing = getUser();
  const user: User =
    existing && existing.email === email
      ? existing
      : {
          id: crypto.randomUUID(),
          name: name || email.split("@")[0].replace(/[._]/g, " "),
          email,
          targetYear: new Date().getFullYear() + 1,
          joinedAt: new Date().toISOString(),
        };
  setUser(user);
  return user;
}

export function signOut() {
  setUser(null);
}

export function useUser() {
  const [user, setLocal] = useState<User | null>(() => getUser());
  useEffect(() => {
    const fn = () => setLocal(getUser());
    LISTENERS.add(fn);
    return () => {
      LISTENERS.delete(fn);
    };
  }, []);
  return user;
}
