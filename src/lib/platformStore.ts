// Fully local (localStorage-backed) synchronous platform store.
// Powers the dynamic sidebar, question bank, broadcasts, live sessions and audit trail
// used by the admin panel and student experience. Auth still uses Supabase.
import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Radio,
  Sparkles,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { QUESTIONS, TEST_SERIES, type Question, type Subject } from "@/lib/mockData";
import { getUser } from "@/lib/auth";

export type SidebarItem = {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof ICONS;
  group: "Overview" | "Learn" | "Performance" | "Admin";
  order: number;
  visible: boolean;
  admin_only?: boolean;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
};

export type Broadcast = {
  id: string;
  title: string;
  message: string;
  segment: "all" | Subject | "low_accuracy" | "test_takers";
  status: "draft" | "scheduled" | "sent";
  scheduled_at?: string;
  createdAt: string;
};

export type LiveSession = {
  id: string;
  title: string;
  educator: string;
  description?: string;
  youtube_video_id: string;
  scheduled_at: string;
  is_live: boolean;
  students_count: number;
  createdAt: string;
};

export type Store = {
  menu: SidebarItem[];
  questions: Question[];
  broadcasts: Broadcast[];
  audit: AuditEvent[];
  liveSessions: LiveSession[];
};

export const ICONS = {
  LayoutDashboard,
  BookOpenCheck,
  ClipboardList,
  Sparkles,
  Radio,
  GraduationCap,
  Trophy,
  User,
  BarChart3,
} satisfies Record<string, LucideIcon>;

const KEY = "testum_phase2_store_v2";

const defaultMenu: SidebarItem[] = [
  { id: "dashboard", title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard", group: "Overview", order: 1, visible: true },
  { id: "practice", title: "Practice", url: "/dashboard/practice", icon: "BookOpenCheck", group: "Learn", order: 2, visible: true },
  { id: "tests", title: "Tests", url: "/dashboard/tests", icon: "ClipboardList", group: "Learn", order: 3, visible: true },
  { id: "ai", title: "AI Tools", url: "/dashboard/ai", icon: "Sparkles", group: "Learn", order: 4, visible: true },
  { id: "live", title: "Live Classes", url: "/dashboard/live", icon: "Radio", group: "Learn", order: 5, visible: true },
  { id: "material", title: "Study Material", url: "/dashboard/material", icon: "GraduationCap", group: "Learn", order: 6, visible: true },
  { id: "leaderboard", title: "Leaderboard", url: "/dashboard/leaderboard", icon: "Trophy", group: "Performance", order: 7, visible: true },
  { id: "profile", title: "Profile", url: "/dashboard/profile", icon: "User", group: "Performance", order: 8, visible: true },
  { id: "analytics", title: "Admin panel", url: "/admin", icon: "BarChart3", group: "Admin", order: 9, visible: true, admin_only: true },
];

const seedAudit: AuditEvent[] = [
  { id: "a1", actor: "System", action: "Seeded question bank", target: `${QUESTIONS.length} demo MCQs`, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "a2", actor: "System", action: "Published dynamic sidebar", target: "Student navigation", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
];

const seedBroadcasts: Broadcast[] = [
  {
    id: "b1",
    title: "Biology PYQ sprint tonight",
    message: "Genetics and Human Physiology poll class at 8 PM.",
    segment: "biology",
    status: "scheduled",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

const seedLiveSessions: LiveSession[] = [
  {
    id: "l1",
    title: "Physics — Rotational Mechanics deep dive",
    educator: "Dr. R. Sharma",
    description: "Live doubt clearing on rotational motion with poll-based MCQs.",
    youtube_video_id: "dQw4w9WgXcQ",
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    is_live: false,
    students_count: 128,
    createdAt: new Date().toISOString(),
  },
];

function baseStore(): Store {
  return {
    menu: defaultMenu,
    questions: QUESTIONS,
    broadcasts: seedBroadcasts,
    audit: seedAudit,
    liveSessions: seedLiveSessions,
  };
}

const listeners = new Set<() => void>();
let cachedSnapshot: Store | null = null;

function emit() {
  cachedSnapshot = null; // invalidate cache so next read reflects latest
  listeners.forEach((fn) => fn());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("testum-store-change"));
  }
}

export function subscribeStore(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function loadStore(): Store {
  if (typeof window === "undefined") return baseStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = baseStore();
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<Store>;
    const seeded = baseStore();
    return {
      menu: parsed.menu?.length ? parsed.menu : seeded.menu,
      questions: parsed.questions?.length ? parsed.questions : seeded.questions,
      broadcasts: parsed.broadcasts ?? seeded.broadcasts,
      audit: parsed.audit?.length ? parsed.audit : seeded.audit,
      liveSessions: parsed.liveSessions ?? seeded.liveSessions,
    };
  } catch {
    return baseStore();
  }
}

export function readStore(): Store {
  // CRITICAL: return a stable reference so useSyncExternalStore doesn't loop.
  if (cachedSnapshot) return cachedSnapshot;
  cachedSnapshot = loadStore();
  return cachedSnapshot;
}

function writeStore(next: Store) {
  if (typeof window === "undefined") return;
  cachedSnapshot = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
  cachedSnapshot = next; // re-set after emit invalidation
}

function log(next: Store, action: string, target: string) {
  const user = getUser();
  next.audit = [
    {
      id: crypto.randomUUID(),
      actor: user?.email ?? "Local admin",
      action,
      target,
      createdAt: new Date().toISOString(),
    },
    ...next.audit,
  ].slice(0, 80);
}

// --- Menu ---
export function updateMenuItem(id: string, patch: Partial<SidebarItem>) {
  const store = readStore();
  store.menu = store.menu.map((item) => (item.id === id ? { ...item, ...patch } : item));
  log(store, "Updated sidebar item", id);
  writeStore(store);
}

export function addMenuItem(item: Omit<SidebarItem, "id" | "order">) {
  const store = readStore();
  const maxOrder = Math.max(0, ...store.menu.map((m) => m.order));
  const created: SidebarItem = { ...item, id: crypto.randomUUID(), order: maxOrder + 1 };
  store.menu = [...store.menu, created];
  log(store, "Created sidebar item", created.title);
  writeStore(store);
}

// --- Questions ---
export function addQuestion(question: Omit<Question, "id">) {
  const store = readStore();
  const created: Question = { ...question, id: crypto.randomUUID() };
  store.questions = [created, ...store.questions];
  log(store, "Added question", `${question.subject} · ${question.chapter}`);
  writeStore(store);
}

export function deleteQuestion(id: string) {
  const store = readStore();
  store.questions = store.questions.filter((q) => q.id !== id);
  log(store, "Deleted question", id);
  writeStore(store);
}

// --- Broadcasts ---
export function addBroadcast(broadcast: Omit<Broadcast, "id" | "createdAt">) {
  const store = readStore();
  const created: Broadcast = {
    ...broadcast,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.broadcasts = [created, ...store.broadcasts];
  log(store, "Created segmented broadcast", `${created.title} → ${created.segment}`);
  writeStore(store);
}

// --- Live Sessions ---
export function addLiveSession(session: Omit<LiveSession, "id" | "createdAt" | "students_count">) {
  const store = readStore();
  const created: LiveSession = {
    ...session,
    id: crypto.randomUUID(),
    students_count: 0,
    createdAt: new Date().toISOString(),
  };
  store.liveSessions = [created, ...store.liveSessions];
  log(store, "Created live session", created.title);
  writeStore(store);
}

export function updateLiveSession(id: string, patch: Partial<LiveSession>) {
  const store = readStore();
  store.liveSessions = store.liveSessions.map((s) => (s.id === id ? { ...s, ...patch } : s));
  log(store, "Updated live session", id);
  writeStore(store);
}

export function deleteLiveSession(id: string) {
  const store = readStore();
  store.liveSessions = store.liveSessions.filter((s) => s.id !== id);
  log(store, "Deleted live session", id);
  writeStore(store);
}

export function getCurrentLiveSession(store: Store = readStore()): LiveSession | null {
  const now = Date.now();
  const two_hours = 2 * 60 * 60 * 1000;
  const active = store.liveSessions.find((session) => {
    const scheduledTime = new Date(session.scheduled_at).getTime();
    return session.is_live || (scheduledTime <= now && scheduledTime + two_hours > now);
  });
  return active ?? null;
}

export function adminMetrics(store: Store = readStore()) {
  const bySubject = store.questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.subject] = (acc[q.subject] ?? 0) + 1;
    return acc;
  }, {});
  const byDifficulty = store.questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
    return acc;
  }, {});
  return {
    users: 100284,
    questions: store.questions.length,
    tests: TEST_SERIES.length,
    attempts: 42150,
    avgAccuracy: 82,
    bySubject,
    byDifficulty,
  };
}
