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
import {
  getQuestions, addQuestion as addQuestionSupabase, updateQuestion as updateQuestionSupabase, deleteQuestion as deleteQuestionSupabase,
  getTests, addTest as addTestSupabase, updateTest as updateTestSupabase, deleteTest as deleteTestSupabase,
  getLiveSessions, addLiveSession as addLiveSessionSupabase, updateLiveSession as updateLiveSessionSupabase, deleteLiveSession as deleteLiveSessionSupabase,
  getSidebarItems, addSidebarItem as addSidebarItemSupabase, updateSidebarItem as updateSidebarItemSupabase, deleteSidebarItem as deleteSidebarItemSupabase,
  getBroadcasts, addBroadcast as addBroadcastSupabase, updateBroadcast as updateBroadcastSupabase, deleteBroadcast as deleteBroadcastSupabase,
  getTestAttempts, addTestAttempt as addTestAttemptSupabase,
  getPracticeProgress, addPracticeProgress as addPracticeProgressSupabase, updatePracticeProgress as updatePracticeProgressSupabase,
} from "./supabaseClient";

export type SidebarItem = {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof ICONS;
  group: "Overview" | "Learn" | "Performance" | "Admin";
  order: number;
  visible: boolean;
  admin_only?: boolean; // Added for admin panel control
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
  scheduled_at?: string; // Added for scheduling
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

type Store = {
  menu: SidebarItem[];
  questions: Question[];
  broadcasts: Broadcast[];
  audit: AuditEvent[];
  liveSessions: LiveSession[]; // Added live sessions to store
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
  { id: "analytics", title: "Analytics", url: "/admin", icon: "BarChart3", group: "Admin", order: 9, visible: true, admin_only: true },
];

const seedAudit: AuditEvent[] = [
  { id: "a1", actor: "System", action: "Seeded question bank", target: "15 demo MCQs", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "a2", actor: "System", action: "Published dynamic sidebar", target: "Student navigation", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
];

// --- Local Storage fallback for initial development/offline, will be replaced by Supabase calls ---
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
    liveSessions: [],
  };
}

// This function will now primarily fetch from Supabase, with a local fallback
export async function readStore(): Promise<Store> {
  if (typeof window === "undefined") return baseStore();
  try {
    const [questions, menu, broadcasts, liveSessions] = await Promise.all([
      getQuestions(),
      getSidebarItems(),
      getBroadcasts(),
      getLiveSessions(),
    ]);

    return {
      menu: menu.length ? menu : defaultMenu,
      questions: questions.length ? questions : QUESTIONS,
      broadcasts: broadcasts.length ? broadcasts : baseStore().broadcasts,
      audit: seedAudit, // Audit log will be handled separately or fetched from DB
      liveSessions: liveSessions.length ? liveSessions : [],
    };
  } catch (error) {
    console.error("Error fetching from Supabase, falling back to local storage:", error);
    // Fallback to local storage if Supabase fetch fails
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
      liveSessions: parsed.liveSessions?.length ? parsed.liveSessions : [],
    };
  }
}

// writeStore will no longer be used for core data, only for audit log if needed locally
function writeStore(next: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("testum-store-change"));
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
  writeStore(next); // Keep local audit log for now
}

export async function updateMenuItem(id: string, patch: Partial<SidebarItem>) {
  const store = await readStore(); // Read from Supabase
  const updatedItem = await updateSidebarItemSupabase(id, patch);
  if (updatedItem) {
    store.menu = store.menu.map((item) => item.id === id ? { ...item, ...patch } : item);
    log(store, "Updated sidebar item", id);
    // No need to writeStore(store) as data is now in Supabase
  }
}

export async function addMenuItem(item: Omit<SidebarItem, "id" | "order">) {
  const store = await readStore(); // Read from Supabase
  const maxOrder = Math.max(0, ...store.menu.map((m) => m.order));
  const next = { ...item, order: maxOrder + 1 };
  const newMenuItem = await addSidebarItemSupabase(next);
  if (newMenuItem) {
    log(store, "Created sidebar item", newMenuItem[0].title);
  }
}

export async function addQuestion(question: Omit<Question, "id">) {
  const store = await readStore(); // Read from Supabase
  const newQuestion = await addQuestionSupabase(question);
  if (newQuestion) {
    log(store, "Added question", `${question.subject} · ${question.chapter}`);
  }
}

export async function deleteQuestion(id: string) {
  const store = await readStore(); // Read from Supabase
  const deleted = await deleteQuestionSupabase(id);
  if (deleted) {
    log(store, "Deleted question", id);
  }
}

export async function addBroadcast(broadcast: Omit<Broadcast, "id" | "createdAt">) {
  const store = await readStore(); // Read from Supabase
  const newBroadcast = await addBroadcastSupabase(broadcast);
  if (newBroadcast) {
    log(store, "Created segmented broadcast", `${newBroadcast[0].title} → ${newBroadcast[0].segment}`);
  }
}

// New functions for Live Sessions
export async function addLiveSession(session: Omit<LiveSession, "id" | "createdAt" | "students_count">) {
  const store = await readStore();
  const newSession = await addLiveSessionSupabase({ ...session, students_count: 0 });
  if (newSession) {
    log(store, "Created live session", newSession[0].title);
  }
}

export async function updateLiveSession(id: string, patch: Partial<LiveSession>) {
  const store = await readStore();
  const updatedSession = await updateLiveSessionSupabase(id, patch);
  if (updatedSession) {
    log(store, "Updated live session", id);
  }
}

export async function deleteLiveSession(id: string) {
  const store = await readStore();
  const deleted = await deleteLiveSessionSupabase(id);
  if (deleted) {
    log(store, "Deleted live session", id);
  }
}

// Existing functions, now fetching from Supabase
export async function getPlatformQuestions() {
  return await getQuestions();
}

export async function getSidebarMenu() {
  const menu = await getSidebarItems();
  return menu.filter((item) => item.is_visible).sort((a, b) => a.order_index - b.order_index);
}

export async function adminMetrics(store = baseStore()) { // Will need to update this to fetch real data
  const questions = await getQuestions();
  const tests = await getTests();
  const attempts = await getTestAttempts(getUser()?.id || ''); // Needs user ID

  const bySubject = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.subject] = (acc[q.subject] ?? 0) + 1;
    return acc;
  }, {});
  const byDifficulty = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
    return acc;
  }, {});
  return {
    users: 100284, // Mock data for now
    questions: questions.length,
    tests: tests.length,
    attempts: attempts.length, // Real attempts count
    avgAccuracy: 82, // Mock data for now
    bySubject,
    byDifficulty,
  };
}

// Helper to get current live session
export async function getCurrentLiveSession(): Promise<LiveSession | null> {
  const sessions = await getLiveSessions();
  const now = new Date();
  // Find a session that is marked as live or scheduled to be live now
  const activeSession = sessions.find(session => {
    const scheduledTime = new Date(session.scheduled_at);
    // Consider a session live if it's marked as such, or if it's scheduled to be live within a reasonable window
    return session.is_live || (scheduledTime <= now && (scheduledTime.getTime() + 2 * 60 * 60 * 1000) > now); // Live for 2 hours after scheduled time
  });
  return activeSession || null;
}
