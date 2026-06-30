import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Flag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SUBJECT_META, type Subject } from "@/lib/mockData";
import { usePlatformStore } from "@/hooks/usePlatformStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/practice/$subject")({
  component: PracticeSubject,
});

function PracticeSubject() {
  const { subject } = Route.useParams() as { subject: Subject };
  const meta = SUBJECT_META[subject];
  const store = usePlatformStore();
  const all = useMemo(() => store.questions.filter((q) => q.subject === subject), [store.questions, subject]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  if (!meta || all.length === 0) {
    return (
      <div className="grid place-items-center py-20 text-center text-muted-foreground">
        Subject not found. <Link to="/dashboard/practice" className="ml-2 text-primary-glow">Back</Link>
      </div>
    );
  }

  const q = all[idx];

  function check() {
    if (!selected) return toast.error("Pick an option first");
    setRevealed(true);
    if (selected === q.correct) {
      setStats((s) => ({ ...s, correct: s.correct + 1 }));
      toast.success("Correct!");
    } else {
      setStats((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
  }

  function next() {
    setSelected(null);
    setRevealed(false);
    if (idx < all.length - 1) setIdx(idx + 1);
    else toast.success("Set complete!");
  }

  function toggleBookmark() {
    setBookmarked((b) => {
      const n = new Set(b);
      if (n.has(q.id)) {
        n.delete(q.id);
        toast("Removed bookmark");
      } else {
        n.add(q.id);
        toast.success("Bookmarked");
      }
      return n;
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/practice"><ArrowLeft className="mr-1.5 h-4 w-4" /> All subjects</Link>
        </Button>
        <div className="flex items-center gap-2 text-xs">
          <Badge className="bg-success/15 text-success hover:bg-success/15">✓ {stats.correct}</Badge>
          <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">✕ {stats.wrong}</Badge>
        </div>
      </div>

      <Card className="border-border/60 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge style={{ background: `color-mix(in oklab, var(--${meta.color}) 18%, transparent)`, color: `var(--${meta.color})` }}>
              {meta.label}
            </Badge>
            <Badge variant="secondary">{q.chapter}</Badge>
            <Badge variant="outline">{q.difficulty}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Question <span className="font-semibold text-foreground">{idx + 1}</span> / {all.length}
          </div>
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold leading-snug">{q.text}</h2>

        <div className="mt-6 space-y-2.5">
          {q.options.map((o) => {
            const isPicked = selected === o.id;
            const isCorrect = revealed && o.id === q.correct;
            const isWrong = revealed && isPicked && o.id !== q.correct;
            return (
              <button
                key={o.id}
                disabled={revealed}
                onClick={() => setSelected(o.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition",
                  !revealed && isPicked && "border-primary-glow bg-accent/40",
                  !revealed && !isPicked && "border-border hover:border-primary-glow/40 hover:bg-accent/30",
                  isCorrect && "border-success bg-success/10",
                  isWrong && "border-destructive bg-destructive/10",
                  revealed && !isPicked && !isCorrect && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold",
                    isCorrect && "bg-success text-success-foreground",
                    isWrong && "bg-destructive text-destructive-foreground",
                    !revealed && isPicked && "bg-primary-glow text-primary-foreground",
                    !revealed && !isPicked && "bg-muted text-muted-foreground",
                  )}
                >
                  {o.id}
                </span>
                <span className="flex-1">{o.text}</span>
                {isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                {isWrong && <XCircle className="h-4 w-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 rounded-lg border border-border/60 bg-accent/30 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solution</div>
            <p className="mt-1.5 text-sm">{q.explanation}</p>
            {q.source && <p className="mt-2 text-xs text-muted-foreground">Source: {q.source}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleBookmark}>
              <Bookmark className={cn("mr-1.5 h-4 w-4", bookmarked.has(q.id) && "fill-current")} />
              {bookmarked.has(q.id) ? "Saved" : "Bookmark"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast("Reported. Thanks!")}>
              <Flag className="mr-1.5 h-4 w-4" /> Report
            </Button>
          </div>
          <div className="flex gap-2">
            {!revealed ? (
              <Button onClick={check} className="bg-brand-gradient text-primary-foreground shadow-elegant">
                Check answer
              </Button>
            ) : (
              <Button onClick={next} disabled={idx >= all.length - 1} className="bg-brand-gradient text-primary-foreground shadow-elegant">
                Next <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
