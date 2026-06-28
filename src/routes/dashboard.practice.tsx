import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Atom, FlaskConical, Leaf } from "lucide-react";
import { SUBJECT_META, type Subject } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/practice")({
  component: PracticeLayout,
});

const icons: Record<Subject, typeof Atom> = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
};

function PracticeLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isIndex = pathname === "/dashboard/practice" || pathname === "/dashboard/practice/";

  if (!isIndex) return <Outlet />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Practice</h1>
        <p className="text-sm text-muted-foreground">Pick a subject to start solving MCQs</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {(Object.keys(SUBJECT_META) as Subject[]).map((k) => {
          const s = SUBJECT_META[k];
          const Icon = icons[k];
          return (
            <Link key={k} to="/dashboard/practice/$subject" params={{ subject: k }}>
              <Card className="group relative overflow-hidden border-border/60 p-6 transition hover:-translate-y-1 hover:shadow-elegant">
                <div
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 transition group-hover:scale-110"
                  style={{ background: `color-mix(in oklab, var(--${s.color}) 30%, transparent)` }}
                />
                <div className="relative">
                  <div
                    className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl text-white shadow-elegant"
                    style={{ background: `var(--${s.color})` }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{s.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.questions} questions · {s.chapters} chapters</p>
                  <div className="mt-5 flex gap-2">
                    <Badge variant="secondary">Easy</Badge>
                    <Badge variant="secondary">Medium</Badge>
                    <Badge variant="secondary">Hard</Badge>
                  </div>
                  <div className="mt-6 inline-flex items-center text-sm font-medium text-primary-glow">
                    Start practice <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
