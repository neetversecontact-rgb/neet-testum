// Real Supabase-backed auth + role state, replacing the earlier localStorage shim.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "student" | "admin" | "super_admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  targetYear: number;
  joinedAt: string;
};

const LISTENERS = new Set<(user: User | null) => void>();
let cache: User | null = null;
let loaded = false;
let loadingPromise: Promise<User | null> | null = null;

async function fetchUser(): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getUser();
  const authUser = sessionData.user;
  if (!authUser) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("name, target_year, created_at, email").eq("id", authUser.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", authUser.id),
  ]);

  const roleList = (roles ?? []).map((r) => r.role as Role);
  const role: Role = roleList.includes("super_admin")
    ? "super_admin"
    : roleList.includes("admin")
      ? "admin"
      : "student";

  return {
    id: authUser.id,
    email: profile?.email ?? authUser.email ?? "",
    name: profile?.name || (authUser.user_metadata?.name as string | undefined) || (authUser.email?.split("@")[0] ?? "Student"),
    role,
    targetYear: profile?.target_year ?? new Date().getFullYear() + 1,
    joinedAt: profile?.created_at ?? authUser.created_at ?? new Date().toISOString(),
  };
}

async function refresh() {
  cache = await fetchUser();
  loaded = true;
  LISTENERS.forEach((fn) => fn(cache));
  return cache;
}

if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
      loadingPromise = refresh();
    }
  });
}

export function ensureUser(): Promise<User | null> {
  if (loaded) return Promise.resolve(cache);
  if (!loadingPromise) loadingPromise = refresh();
  return loadingPromise;
}

export function getUser(): User | null {
  return cache;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await refresh();
}

export async function signUpWithPassword(email: string, password: string, name: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      data: { name },
    },
  });
  if (error) throw error;
  await refresh();
}

export async function signOut() {
  await supabase.auth.signOut();
  cache = null;
  LISTENERS.forEach((fn) => fn(null));
}

export function hasAdminAccess(user = cache) {
  return user?.role === "admin" || user?.role === "super_admin";
}

export function useUser() {
  const [user, setLocal] = useState<User | null>(cache);
  const [ready, setReady] = useState(loaded);
  useEffect(() => {
    const fn = (u: User | null) => {
      setLocal(u);
      setReady(true);
    };
    LISTENERS.add(fn);
    ensureUser().then((u) => {
      setLocal(u);
      setReady(true);
    });
    return () => {
      LISTENERS.delete(fn);
    };
  }, []);
  return { user, ready };
}
