import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Questions API ---
export async function getQuestions() {
  const { data, error } = await supabase.from("questions").select("*");
  if (error) throw error;
  return data;
}

export async function addQuestion(question: any) {
  const { data, error } = await supabase.from("questions").insert([question]).select();
  if (error) throw error;
  return data;
}

export async function updateQuestion(id: string, updates: any) {
  const { data, error } = await supabase.from("questions").update(updates).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Tests API ---
export async function getTests() {
  const { data, error } = await supabase.from("tests").select("*");
  if (error) throw error;
  return data;
}

export async function addTest(test: any) {
  const { data, error } = await supabase.from("tests").insert([test]).select();
  if (error) throw error;
  return data;
}

export async function updateTest(id: string, updates: any) {
  const { data, error } = await supabase.from("tests").update(updates).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteTest(id: string) {
  const { error } = await supabase.from("tests").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Live Sessions API ---
export async function getLiveSessions() {
  const { data, error } = await supabase.from("live_sessions").select("*").order("scheduled_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addLiveSession(session: any) {
  const { data, error } = await supabase.from("live_sessions").insert([session]).select();
  if (error) throw error;
  return data;
}

export async function updateLiveSession(id: string, updates: any) {
  const { data, error } = await supabase.from("live_sessions").update(updates).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteLiveSession(id: string) {
  const { error } = await supabase.from("live_sessions").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Sidebar Items API ---
export async function getSidebarItems() {
  const { data, error } = await supabase.from("sidebar_items").select("*").order("order_index", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addSidebarItem(item: any) {
  const { data, error } = await supabase.from("sidebar_items").insert([item]).select();
  if (error) throw error;
  return data;
}

export async function updateSidebarItem(id: string, updates: any) {
  const { data, error } = await supabase.from("sidebar_items").update(updates).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteSidebarItem(id: string) {
  const { error } = await supabase.from("sidebar_items").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Broadcasts API ---
export async function getBroadcasts() {
  const { data, error } = await supabase.from("broadcasts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addBroadcast(broadcast: any) {
  const { data, error } = await supabase.from("broadcasts").insert([broadcast]).select();
  if (error) throw error;
  return data;
}

export async function updateBroadcast(id: string, updates: any) {
  const { data, error } = await supabase.from("broadcasts").update(updates).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteBroadcast(id: string) {
  const { error } = await supabase.from("broadcasts").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Test Attempts API ---
export async function getTestAttempts(userId: string) {
  const { data, error } = await supabase.from("test_attempts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addTestAttempt(attempt: any) {
  const { data, error } = await supabase.from("test_attempts").insert([attempt]).select();
  if (error) throw error;
  return data;
}

// --- Practice Progress API ---
export async function getPracticeProgress(userId: string) {
  const { data, error } = await supabase.from("practice_progress").select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function addPracticeProgress(progress: any) {
  const { data, error } = await supabase.from("practice_progress").insert([progress]).select();
  if (error) throw error;
  return data;
}

export async function updatePracticeProgress(userId: string, questionId: string, updates: any) {
  const { data, error } = await supabase.from("practice_progress").update(updates).eq("user_id", userId).eq("question_id", questionId).select();
  if (error) throw error;
  return data;
}
