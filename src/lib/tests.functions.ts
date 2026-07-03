// Server functions for tests, questions and attempts (DB-backed).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Public reads (any signed-in user) ----------

export const listTests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tests")
      .select("id, title, subject, duration_minutes, total_questions, total_marks, badge, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getTestWithQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ testId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: test, error: te } = await supabase
      .from("tests")
      .select("id, title, subject, duration_minutes, total_questions, total_marks, badge")
      .eq("id", data.testId)
      .maybeSingle();
    if (te) throw new Error(te.message);
    if (!test) throw new Error("Test not found");

    const { data: rows, error: qe } = await supabase
      .from("test_questions")
      .select("order_index, question:questions(id, subject, chapter, topic, difficulty, question_text, options, correct_option, explanation)")
      .eq("test_id", data.testId)
      .order("order_index", { ascending: true });
    if (qe) throw new Error(qe.message);

    const questions = (rows ?? [])
      .map((r) => r.question)
      .filter((q): q is NonNullable<typeof q> => !!q);
    return { test, questions };
  });

// ---------- Attempts ----------

export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      testId: z.string().uuid(),
      answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])),
      timeTakenSeconds: z.number().int().nonnegative(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Fetch correct answers server-side (never trust client)
    const { data: rows, error: qe } = await supabase
      .from("test_questions")
      .select("question:questions(id, correct_option)")
      .eq("test_id", data.testId);
    if (qe) throw new Error(qe.message);

    let correct = 0;
    let wrong = 0;
    const total = rows?.length ?? 0;
    for (const r of rows ?? []) {
      const q = r.question;
      if (!q) continue;
      const picked = data.answers[q.id];
      if (!picked) continue;
      if (picked === q.correct_option) correct++;
      else wrong++;
    }
    const score = correct * 4 - wrong;
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    const { data: attempt, error: ie } = await supabase
      .from("test_attempts")
      .insert({
        user_id: userId,
        test_id: data.testId,
        score,
        accuracy,
        time_taken_seconds: data.timeTakenSeconds,
        answers: data.answers,
      })
      .select("id")
      .single();
    if (ie) throw new Error(ie.message);

    return { attemptId: attempt.id, score, correct, wrong, unattempted: total - attempted, accuracy, totalQuestions: total };
  });

export const listMyAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("test_attempts")
      .select("id, test_id, score, accuracy, time_taken_seconds, created_at, test:tests(title, total_questions, total_marks, subject)")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const myDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: attempts, error: ae }, { count: testCount }] = await Promise.all([
      supabase
        .from("test_attempts")
        .select("score, accuracy, time_taken_seconds, created_at, test:tests(subject, total_questions)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.from("tests").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);
    if (ae) throw new Error(ae.message);

    const totalTests = attempts?.length ?? 0;
    const totalQuestions = (attempts ?? []).reduce((s, a) => s + (a.test?.total_questions ?? 0), 0);
    const avgAccuracy =
      totalTests > 0
        ? Math.round((attempts ?? []).reduce((s, a) => s + (a.accuracy ?? 0), 0) / totalTests)
        : 0;
    const bestScore = (attempts ?? []).reduce((m, a) => Math.max(m, a.score ?? 0), 0);

    return {
      totalTests,
      totalQuestions,
      avgAccuracy,
      bestScore,
      availableTests: testCount ?? 0,
      recent: (attempts ?? []).slice(0, 5),
    };
  });

// ---------- Leaderboard ----------

export const leaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("test_attempts")
      .select("user_id, score, accuracy")
      .order("score", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const byUser = new Map<string, { bestScore: number; bestAccuracy: number; attempts: number }>();
    for (const row of data ?? []) {
      if (!row.user_id) continue;
      const existing = byUser.get(row.user_id);
      if (!existing) {
        byUser.set(row.user_id, { bestScore: row.score ?? 0, bestAccuracy: row.accuracy ?? 0, attempts: 1 });
      } else {
        existing.attempts++;
        if ((row.score ?? 0) > existing.bestScore) {
          existing.bestScore = row.score ?? 0;
          existing.bestAccuracy = row.accuracy ?? 0;
        }
      }
    }
    const userIds = Array.from(byUser.keys());
    let names = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await context.supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);
      names = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Aspirant"]));
    }
    return Array.from(byUser.entries())
      .map(([userId, v]) => ({ userId, name: names.get(userId) ?? "Aspirant", ...v }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 25);
  });

