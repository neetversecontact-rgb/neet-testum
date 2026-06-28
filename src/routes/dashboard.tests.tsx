import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, FileText, Layers } from "lucide-react";
import { TEST_SERIES, SUBJECT_META } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/tests")({
  component: TestsLayout,
});

function TestsLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isIndex = pathname === "/dashboard/tests" || pathname === "/dashboard/tests/";
  if (!isIndex) return <Outlet />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tests</h1>
        <p className="text-sm text-muted-foreground">Mock tests, chapter sprints and full-syllabus papers</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {TEST_SERIES.map((t) => {
          const meta = t.subject !== "full" ? SUBJECT_META[t.subject] : null;
          return (
            <Card key={t.id} className="border-border/60 p-6 transition hover:shadow-soft">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white shadow-elegant"
                    style={{ background: meta ? `var(--${meta.color})` : "linear-gradient(135deg, var(--primary), var(--primary-glow))" }}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold leading-snug">{t.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.duration} min</span>
                      <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> {t.totalQuestions} Qs</span>
                      <span>{t.marks} marks</span>
                    </div>
                  </div>
                </div>
                {t.badge && <Badge variant="secondary">{t.badge}</Badge>}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">+4 / −1 marking</span>
                <Button asChild size="sm" className="bg-brand-gradient text-primary-foreground shadow-elegant">
                  <Link to="/dashboard/tests/$testId" params={{ testId: t.id }}>
                    Start test <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
