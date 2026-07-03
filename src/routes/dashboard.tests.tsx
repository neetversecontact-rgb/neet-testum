import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, FileText, Layers, ClipboardList } from "lucide-react";
import { listTests } from "@/lib/tests.functions";

export const Route = createFileRoute("/dashboard/tests")({
  component: TestsLayout,
});

function TestsLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isIndex = pathname === "/dashboard/tests" || pathname === "/dashboard/tests/";
  if (!isIndex) return <Outlet />;

  const fetchTests = useServerFn(listTests);
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["tests-list"],
    queryFn: () => fetchTests(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tests</h1>
        <p className="text-sm text-muted-foreground">Attempt full-length online tests with timer and instant scoring</p>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16 text-sm text-muted-foreground">Loading tests…</div>
      ) : tests.length === 0 ? (
        <Card className="border-border/60 border-dashed p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-display text-lg font-semibold">No tests yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tests will appear here once an admin publishes them.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {tests.map((t) => (
            <Card key={t.id} className="border-border/60 p-6 transition hover:shadow-soft">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground shadow-elegant">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold leading-snug">{t.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.duration_minutes} min</span>
                      <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> {t.total_questions} Qs</span>
                      <span>{t.total_marks} marks</span>
                      <Badge variant="outline" className="capitalize">{t.subject}</Badge>
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
          ))}
        </div>
      )}
    </div>
  );
}
