// Lightweight localStorage-backed auth shim. Replace with Lovable Cloud when enabled.
import { useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "super_admin";
  targetYear: number;
  joinedAt: string;
};

const KEY = "testum_user";
const LEGACY_KEY = "neetx_user";
const LISTENERS = new Set<() => void>();

function inferRole(email: string): User["role"] {
  const normalized = email.toLowerCase();
  if (normalized.includes("super") || normalized.startsWith("owner@")) return "super_admin";
  if (normalized.includes("admin") || normalized.endsWith("@testum.in")) return "admin";
  return "student";
}

function normalizeUser(user: User): User {
  return {
    ...user,
    role: user.role ?? inferRole(user.email),
  };
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const user = normalizeUser(JSON.parse(raw) as User);
    localStorage.setItem(KEY, JSON.stringify(user));
    localStorage.removeItem(LEGACY_KEY);
    return user;
  } catch {
    return null;
  }
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(normalizeUser(u)));
  else localStorage.removeItem(KEY);
  LISTENERS.forEach((fn) => fn());
}

export function signIn(email: string, name?: string, role?: User["role"]): User {
  const existing = getUser();
  const user: User =
    existing && existing.email === email
      ? { ...existing, role: role ?? existing.role ?? inferRole(email) }
      : {
          id: crypto.randomUUID(),
          name: name || email.split("@")[0].replace(/[._]/g, " "),
          email,
          role: role ?? inferRole(email),
          targetYear: new Date().getFullYear() + 1,
          joinedAt: new Date().toISOString(),
        };
  setUser(user);
  return user;
}

export function signOut() {
  setUser(null);
}

export function hasAdminAccess(user = getUser()) {
  return user?.role === "admin" || user?.role === "super_admin";
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
