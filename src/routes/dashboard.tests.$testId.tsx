import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  Trophy,
  CheckCircle2,
  XCircle,
  Target,
} from "lucide-react";
import { TEST_SERIES, questionsForTest, SUBJECT_META, type Question, type Subject } from "@/lib/mockData";
import { usePlatformStore } from "@/hooks/usePlatformStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/tests/$testId")({
  component: TestEngine,
});

type AnswerMap = Record<string, "A" | "B" | "C" | "D" | undefined>;

function TestEngine() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();
  const test = TEST_SERIES.find((t) => t.id === testId);
  const store = usePlatformStore();
  const questions = useMemo<Question[]>(() => {
    if (!test) return questionsForTest(testId);
    const pool = test.subject === "full"
      ? store.questions
      : store.questions.filter((q) => q.subject === test.subject);
    const chosen = pool.slice(0, test.totalQuestions);
    return chosen.length > 0 ? chosen : questionsForTest(testId);
  }, [store.questions, test, testId]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState((test?.duration ?? 15) * 60);
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
    toast.success("Test submitted!");
  }

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) {
      toast.warning("Time's up — submitting your test");
      handleSubmit();
    }
  }, [secondsLeft, submitted]);

  if (!test || questions.length === 0) {
    return (
      <div className="grid place-items-center py-20 text-center text-muted-foreground">
        Test not found.
        <Link to="/dashboard/tests" className="mt-2 text-primary-glow">Back to tests</Link>
      </div>
    );
  }

  if (submitted) return <ResultView test={test} questions={questions} answers={answers} navigate={navigate} />;

  const q = questions[idx];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const lowTime = secondsLeft < 60;

  function setAnswer(opt: "A" | "B" | "C" | "D") {
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  }
  const subjectMeta = SUBJECT_META[q.subject as Subject] ?? { label: q.subject, color: "primary" };
  function toggleMark() {
    setMarked((m) => {
      const n = new Set(m);
      n.has(q.id) ? n.delete(q.id) : n.add(q.id);
      return n;
    });
  }

  const answered = Object.values(answers).filter(Boolean).length;

  return (
    <div className="-m-4 grid min-h-[calc(100vh-3.5rem)] grid-cols-1 gap-0 sm:-m-6 lg:-m-8 lg:grid-cols-[1fr_320px]">
      {/* Main */}
      <div className="flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-background px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-semibold">{test.title}</div>
            <div className="text-xs text-muted-foreground">Question {idx + 1} of {questions.length}</div>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums",
            lowTime ? "border-destructive bg-destructive/10 text-destructive animate-pulse" : "border-border bg-muted/50",
          )}>
            <Clock className="h-4 w-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Card className="mx-auto max-w-3xl border-border/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge style={{ background: `color-mix(in oklab, var(--${subjectMeta.color}) 18%, transparent)`, color: `var(--${subjectMeta.color})` }}>
                {subjectMeta.label}
              </Badge>
              <Badge variant="secondary">{q.chapter}</Badge>
              <Badge variant="outline">{q.difficulty}</Badge>
              <span className="ml-auto text-xs text-muted-foreground">+4 / −1</span>
            </div>
            <h2 className="mt-5 font-display text-lg font-semibold leading-snug sm:text-xl">{q.text}</h2>
            <div className="mt-6 space-y-2.5">
              {q.options.map((o) => {
                const picked = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setAnswer(o.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition",
                      picked ? "border-primary-glow bg-accent/50" : "border-border hover:border-primary-glow/40 hover:bg-accent/30",
                    )}
                  >
                    <span className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold",
                      picked ? "bg-primary-glow text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}>{o.id}</span>
                    <span className="flex-1">{o.text}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-background px-4 py-3 sm:px-6">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Prev
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleMark}>
              <Flag className={cn("mr-1.5 h-4 w-4", marked.has(q.id) && "fill-warning text-warning")} />
              {marked.has(q.id) ? "Unmark" : "Mark for review"}
            </Button>
            {idx < questions.length - 1 ? (
              <Button className="bg-brand-gradient text-primary-foreground shadow-elegant" onClick={() => setIdx(idx + 1)}>
                Save & Next <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-brand-gradient text-primary-foreground shadow-elegant" onClick={() => setConfirmOpen(true)}>
                Submit test
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Palette */}
      <aside className="border-t border-border/60 bg-background p-4 lg:border-l lg:border-t-0 lg:p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold">Question palette</h3>
          <span className="text-xs text-muted-foreground">{answered}/{questions.length}</span>
        </div>
        <Progress value={(answered / questions.length) * 100} className="mt-3 h-1.5" />
        <div className="mt-4 grid grid-cols-8 gap-2 lg:grid-cols-6">
          {questions.map((qq, i) => {
            const isAns = !!answers[qq.id];
            const isMark = marked.has(qq.id);
            const isCur = i === idx;
            return (
              <button
                key={qq.id}
                onClick={() => setIdx(i)}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-md border text-xs font-semibold transition",
                  isCur && "ring-2 ring-primary-glow ring-offset-2 ring-offset-background",
                  isMark ? "border-warning bg-warning/15 text-warning" :
                  isAns ? "border-success bg-success/15 text-success" :
                  "border-border bg-background text-muted-foreground hover:border-primary-glow/40",
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-5 space-y-2 text-xs">
          <Legend color="success" label="Answered" />
          <Legend color="warning" label="Marked for review" />
          <Legend color="border" label="Not answered" />
        </div>
        <Button onClick={() => setConfirmOpen(true)} className="mt-5 w-full bg-brand-gradient text-primary-foreground shadow-elegant">
          Submit test
        </Button>
      </aside>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit test?</AlertDialogTitle>
            <AlertDialogDescription>
              You've answered {answered} of {questions.length} questions. Once submitted, you can't change answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue test</AlertDialogCancel>
            <AlertDialogAction className="bg-brand-gradient" onClick={handleSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        "h-3.5 w-3.5 rounded border",
        color === "success" && "border-success bg-success/15",
        color === "warning" && "border-warning bg-warning/15",
        color === "border" && "border-border bg-background",
      )} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function ResultView({
  test, questions, answers, navigate,
}: {
  test: typeof TEST_SERIES[number];
  questions: ReturnType<typeof questionsForTest>;
  answers: AnswerMap;
  navigate: ReturnType<typeof useNavigate>;
}) {
  let correct = 0, wrong = 0, unattempted = 0;
  questions.forEach((q) => {
    const a = answers[q.id];
    if (!a) unattempted++;
    else if (a === q.correct) correct++;
    else wrong++;
  });
  const score = correct * 4 - wrong * 1;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  const air = Math.max(150, 50000 - score * 800 + Math.floor(Math.random() * 500));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/dashboard/tests" })}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> All tests
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-elegant">
        <div className="bg-brand-gradient p-8 text-primary-foreground">
          <Badge className="bg-white/15 text-primary-foreground hover:bg-white/15">Result</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold">{test.title}</h1>
          <p className="mt-1 text-primary-foreground/85">Here's how you did</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { l: "Score", v: `${score} / ${questions.length * 4}` },
              { l: "Accuracy", v: `${accuracy}%` },
              { l: "Correct", v: correct },
              { l: "Predicted AIR", v: air.toLocaleString() },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{s.l}</div>
                <div className="mt-1 font-display text-2xl font-bold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border/60">
          <Stat icon={CheckCircle2} color="success" label="Correct" value={correct} />
          <Stat icon={XCircle} color="destructive" label="Wrong" value={wrong} />
          <Stat icon={Target} color="warning" label="Unattempted" value={unattempted} />
        </div>
      </Card>

      <Card className="border-border/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Question-wise breakdown</h3>
          <Badge variant="secondary" className="gap-1.5"><Trophy className="h-3 w-3" /> Top 8%</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {questions.map((q, i) => {
            const a = answers[q.id];
            const status = !a ? "skip" : a === q.correct ? "ok" : "bad";
            return (
              <div key={q.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <span className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-semibold",
                  status === "ok" && "bg-success/15 text-success",
                  status === "bad" && "bg-destructive/15 text-destructive",
                  status === "skip" && "bg-muted text-muted-foreground",
                )}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium">{q.text}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Your answer: <span className="font-semibold">{a ?? "—"}</span> · Correct: <span className="font-semibold">{q.correct}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-brand-gradient text-primary-foreground shadow-elegant">
          <Link to="/dashboard/tests">Take another test <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/leaderboard">View leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, color, label, value }: { icon: typeof CheckCircle2; color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 p-5">
      <div className={cn("grid h-10 w-10 place-items-center rounded-lg",
        color === "success" && "bg-success/15 text-success",
        color === "destructive" && "bg-destructive/15 text-destructive",
        color === "warning" && "bg-warning/15 text-warning",
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
