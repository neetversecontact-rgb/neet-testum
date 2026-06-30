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
  createdAt: string;
};

type Store = {
  menu: SidebarItem[];
  questions: Question[];
  broadcasts: Broadcast[];
  audit: AuditEvent[];
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

const KEY = "testum_phase2_store";

const defaultMenu: SidebarItem[] = [
  { id: "dashboard", title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard", group: "Overview", order: 1, visible: true },
  { id: "practice", title: "Practice", url: "/dashboard/practice", icon: "BookOpenCheck", group: "Learn", order: 2, visible: true },
  { id: "tests", title: "Tests", url: "/dashboard/tests", icon: "ClipboardList", group: "Learn", order: 3, visible: true },
  { id: "ai", title: "AI Tools", url: "/dashboard/ai", icon: "Sparkles", group: "Learn", order: 4, visible: true },
  { id: "live", title: "Live Classes", url: "/dashboard/live", icon: "Radio", group: "Learn", order: 5, visible: true },
  { id: "material", title: "Study Material", url: "/dashboard/material", icon: "GraduationCap", group: "Learn", order: 6, visible: true },
  { id: "leaderboard", title: "Leaderboard", url: "/dashboard/leaderboard", icon: "Trophy", group: "Performance", order: 7, visible: true },
  { id: "profile", title: "Profile", url: "/dashboard/profile", icon: "User", group: "Performance", order: 8, visible: true },
  { id: "analytics", title: "Analytics", url: "/admin", icon: "BarChart3", group: "Admin", order: 9, visible: true },
];

const seedAudit: AuditEvent[] = [
  { id: "a1", actor: "System", action: "Seeded question bank", target: "15 demo MCQs", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "a2", actor: "System", action: "Published dynamic sidebar", target: "Student navigation", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
];

function baseStore(): Store {
  return {
    menu: defaultMenu,
    questions: QUESTIONS,
    broadcasts: [
      {
        id: "b1",
        title: "Biology PYQ sprint tonight",
        message: "Genetics and Human Physiology poll class at 8 PM.",
        segment: "biology",
        status: "scheduled",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
    ],
    audit: seedAudit,
  };
}

export function readStore(): Store {
  if (typeof window === "undefined") return baseStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = baseStore();
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Store;
    return {
      ...baseStore(),
      ...parsed,
      menu: parsed.menu?.length ? parsed.menu : defaultMenu,
      questions: parsed.questions?.length ? parsed.questions : QUESTIONS,
      audit: parsed.audit?.length ? parsed.audit : seedAudit,
    };
  } catch {
    return baseStore();
  }
}

function writeStore(next: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("testum-store-change"));
}

export function subscribeStore(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("testum-store-change", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("testum-store-change", listener);
    window.removeEventListener("storage", listener);
  };
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

export function updateMenuItem(id: string, patch: Partial<SidebarItem>) {
  const store = readStore();
  store.menu = store.menu.map((item) => item.id === id ? { ...item, ...patch } : item);
  log(store, "Updated sidebar item", id);
  writeStore(store);
}

export function addMenuItem(item: Omit<SidebarItem, "id" | "order">) {
  const store = readStore();
  const maxOrder = Math.max(0, ...store.menu.map((m) => m.order));
  const next = { ...item, id: crypto.randomUUID(), order: maxOrder + 1 };
  store.menu.push(next);
  log(store, "Created sidebar item", next.title);
  writeStore(store);
}

export function addQuestion(question: Omit<Question, "id">) {
  const store = readStore();
  const next = { ...question, id: crypto.randomUUID() };
  store.questions = [next, ...store.questions];
  log(store, "Added question", `${question.subject} · ${question.chapter}`);
  writeStore(store);
}

export function deleteQuestion(id: string) {
  const store = readStore();
  store.questions = store.questions.filter((q) => q.id !== id);
  log(store, "Deleted question", id);
  writeStore(store);
}

export function addBroadcast(broadcast: Omit<Broadcast, "id" | "createdAt">) {
  const store = readStore();
  const next = { ...broadcast, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  store.broadcasts = [next, ...store.broadcasts];
  log(store, "Created segmented broadcast", `${next.title} → ${next.segment}`);
  writeStore(store);
}

export function getPlatformQuestions() {
  return readStore().questions;
}

export function getSidebarMenu() {
  return readStore().menu.filter((item) => item.visible).sort((a, b) => a.order - b.order);
}

export function adminMetrics(store = readStore()) {
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
    attempts: 48216,
    avgAccuracy: 82,
    bySubject,
    byDifficulty,
  };
}