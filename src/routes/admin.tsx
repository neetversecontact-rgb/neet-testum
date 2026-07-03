import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, BookOpenCheck, ClipboardList, Plus, ShieldCheck, Trash2, Users, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { hasAdminAccess, useUser } from "@/lib/auth";
import {
  adminListQuestions, adminCreateQuestion, adminDeleteQuestion,
  adminCreateTest, adminDeleteTest, adminPlatformStats,
} from "@/lib/adminTests.functions";
import { listTests } from "@/lib/tests.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Testum" }] }),
  component: AdminPage,
});

const SUBJECTS = ["physics", "chemistry", "biology"] as const;

function AdminPage() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !hasAdminAccess(user)) navigate({ to: "/dashboard", replace: true });
  }, [navigate, user]);

  if (!user) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!hasAdminAccess(user)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <Card className="max-w-md border-border/60 p-8">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 font-display text-xl font-bold">Admin access required</h1>
          <Button asChild className="mt-5 bg-brand-gradient text-primary-foreground">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient shadow-elegant">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold">Testum Admin</div>
              <div className="text-[11px] text-muted-foreground">{user.email}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{user.role.replace("_", " ")}</Badge>
            <Button variant="outline" asChild><Link to="/dashboard">Student view</Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <StatsRow />
        <Tabs defaultValue="tests" className="space-y-5">
          <TabsList>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="tests" className="m-0"><TestManager /></TabsContent>
          <TabsContent value="questions" className="m-0"><QuestionManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatsRow() {
  const fetchStats = useServerFn(adminPlatformStats);
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats() });
  const s = data ?? { users: 0, questions: 0, tests: 0, attempts: 0 };
  const items: Array<[string, number, LucideIcon]> = [
    ["Users", s.users, Users], ["Questions", s.questions, BookOpenCheck],
    ["Tests", s.tests, ClipboardList], ["Attempts", s.attempts, Activity],
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value, Icon]) => (
        <Card key={label} className="border-border/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{value}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}

function QuestionManager() {
  const qc = useQueryClient();
  const fetchQs = useServerFn(adminListQuestions);
  const createQ = useServerFn(adminCreateQuestion);
  const deleteQ = useServerFn(adminDeleteQuestion);

  const { data: questions = [] } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: () => fetchQs({ data: { limit: 200 } }),
  });

  const [form, setForm] = useState({
    subject: "biology", chapter: "", topic: "", difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    question_text: "", opts: ["", "", "", ""], correct: "A" as "A" | "B" | "C" | "D", explanation: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text.trim() || form.opts.some((o) => !o.trim()) || !form.chapter.trim() || !form.topic.trim()) {
      return toast.error("Fill all fields");
    }
    try {
      await createQ({ data: {
        subject: form.subject, chapter: form.chapter.trim(), topic: form.topic.trim(),
        difficulty: form.difficulty, question_text: form.question_text.trim(),
        options: form.opts.map((t, i) => ({ id: ["A", "B", "C", "D"][i] as "A", text: t.trim() })),
        correct_option: form.correct, explanation: form.explanation.trim() || null, source: "Admin",
      }});
      toast.success("Question added");
      setForm({ ...form, question_text: "", opts: ["", "", "", ""], explanation: "" });
      qc.invalidateQueries({ queryKey: ["admin-questions"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  async function del(id: string) {
    try {
      await deleteQ({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-questions"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Add question</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject">
              <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Easy", "Medium", "Hard"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Chapter"><Input value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} /></Field>
          <Field label="Topic"><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></Field>
          <Field label="Question"><Textarea rows={3} value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} /></Field>
          <div className="grid gap-2">
            {form.opts.map((v, i) => (
              <Input key={i} value={v} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                onChange={(e) => setForm({ ...form, opts: form.opts.map((o, j) => j === i ? e.target.value : o) })} />
            ))}
          </div>
          <Field label="Correct option">
            <Select value={form.correct} onValueChange={(v) => setForm({ ...form, correct: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Solution (optional)"><Textarea rows={2} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} /></Field>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> Add question</Button>
        </form>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Question bank ({questions.length})</h2>
        <div className="mt-4 max-h-[720px] space-y-2 overflow-auto pr-1">
          {questions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No questions yet. Add your first one on the left.</p>
          ) : questions.map((q) => (
            <div key={q.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">{q.subject}</Badge>
                    <Badge variant="outline">{q.chapter}</Badge>
                    <Badge>{q.difficulty}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{q.question_text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Correct: {q.correct_option} · {q.topic}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => del(q.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TestManager() {
  const qc = useQueryClient();
  const fetchTests = useServerFn(listTests);
  const fetchQs = useServerFn(adminListQuestions);
  const createTest = useServerFn(adminCreateTest);
  const deleteTest = useServerFn(adminDeleteTest);

  const { data: tests = [] } = useQuery({ queryKey: ["tests-list"], queryFn: () => fetchTests() });
  const { data: allQuestions = [] } = useQuery({
    queryKey: ["admin-questions-pick"],
    queryFn: () => fetchQs({ data: { limit: 500 } }),
  });

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("biology");
  const [duration, setDuration] = useState(180);
  const [badge, setBadge] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => filter === "all" ? allQuestions : allQuestions.filter((q) => q.subject === filter),
    [allQuestions, filter],
  );

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else if (n.size < 180) n.add(id);
      else { toast.warning("Max 180 questions per test"); return s; }
      return n;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Test title required");
    if (selected.size === 0) return toast.error("Pick at least 1 question");
    try {
      await createTest({ data: {
        title: title.trim(), subject, duration_minutes: duration, badge: badge.trim() || null,
        question_ids: Array.from(selected),
      }});
      toast.success(`Test created with ${selected.size} questions`);
      setTitle(""); setBadge(""); setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["tests-list"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  async function del(id: string) {
    if (!confirm("Delete this test and all its attempts?")) return;
    try {
      await deleteTest({ data: { id } });
      toast.success("Test deleted");
      qc.invalidateQueries({ queryKey: ["tests-list"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Create test</h2>
        <p className="text-xs text-muted-foreground">Pick up to 180 questions. Students will attempt them online with timer + auto-scoring.</p>
        <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-[380px_1fr]">
          <div className="space-y-3">
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Syllabus Mock 01" /></Field>
            <Field label="Subject">
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  <SelectItem value="full">Full Syllabus</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Duration (minutes)">
              <Input type="number" min={1} max={600} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </Field>
            <Field label="Badge (optional)"><Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Featured" /></Field>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
              <div className="flex justify-between"><span>Selected</span><span className="font-bold">{selected.size} / 180</span></div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Total marks</span><span>{selected.size * 4}</span>
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> Publish test</Button>
          </div>

          <div className="rounded-lg border border-border/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Pick questions ({filtered.length})</div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {SUBJECTS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[520px] space-y-2 overflow-auto">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">No questions in bank. Add some in the Questions tab first.</p>
              ) : filtered.map((q) => (
                <label key={q.id} className="flex items-start gap-3 rounded border border-border/60 p-3 hover:bg-accent/40 cursor-pointer">
                  <Checkbox checked={selected.has(q.id)} onCheckedChange={() => toggle(q.id)} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="capitalize text-[10px]">{q.subject}</Badge>
                      <Badge variant="outline" className="text-[10px]">{q.chapter}</Badge>
                      <Badge className="text-[10px]">{q.difficulty}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm">{q.question_text}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Published tests ({tests.length})</h2>
        <div className="mt-4 space-y-2">
          {tests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No tests published yet.</p>
          ) : tests.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/60 p-4">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  <span className="capitalize">{t.subject}</span> · {t.total_questions} Qs · {t.duration_minutes} min · {t.total_marks} marks
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/tests/$testId" params={{ testId: t.id }}>Preview</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => del(t.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
