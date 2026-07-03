// Admin-only server functions for tests and questions (DB-backed).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  const { data: isSuper } = await supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" });
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
}

// ---------- Questions ----------

const questionSchema = z.object({
  subject: z.string().min(1),
  chapter: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  question_text: z.string().min(1),
  options: z.array(z.object({ id: z.enum(["A", "B", "C", "D"]), text: z.string().min(1) })).length(4),
  correct_option: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
});

export const adminListQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      subject: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().int().min(1).max(500).default(200),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("questions")
      .select("id, subject, chapter, topic, difficulty, question_text, options, correct_option, explanation, source, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.subject) q = q.eq("subject", data.subject);
    if (data.search) q = q.ilike("question_text", `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminCreateQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => questionSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("questions")
      .insert(data)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const adminDeleteQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Tests ----------

export const adminCreateTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({
      title: z.string().min(3),
      subject: z.string().min(1),
      duration_minutes: z.number().int().min(1).max(600),
      badge: z.string().optional().nullable(),
      question_ids: z.array(z.string().uuid()).min(1).max(180),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: test, error: te } = await context.supabase
      .from("tests")
      .insert({
        title: data.title,
        subject: data.subject,
        duration_minutes: data.duration_minutes,
        total_questions: data.question_ids.length,
        total_marks: data.question_ids.length * 4,
        badge: data.badge ?? null,
        is_active: true,
      })
      .select("id")
      .single();
    if (te) throw new Error(te.message);

    const rows = data.question_ids.map((qid, i) => ({
      test_id: test.id,
      question_id: qid,
      order_index: i + 1,
    }));
    const { error: le } = await context.supabase.from("test_questions").insert(rows);
    if (le) {
      // rollback
      await context.supabase.from("tests").delete().eq("id", test.id);
      throw new Error(le.message);
    }
    return { id: test.id };
  });

export const adminDeleteTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleTestActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tests").update({ is_active: data.is_active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminPlatformStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [{ count: users }, { count: questions }, { count: tests }, { count: attempts }] = await Promise.all([
      context.supabase.from("profiles").select("id", { count: "exact", head: true }),
      context.supabase.from("questions").select("id", { count: "exact", head: true }),
      context.supabase.from("tests").select("id", { count: "exact", head: true }),
      context.supabase.from("test_attempts").select("id", { count: "exact", head: true }),
    ]);
    return {
      users: users ?? 0,
      questions: questions ?? 0,
      tests: tests ?? 0,
      attempts: attempts ?? 0,
    };
  });
