import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Trophy, ClipboardList, Clock, BookOpenCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { myDashboardStats } from "@/lib/tests.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { user, ready } = useAuth();
  const qc = useQueryClient();
  const fetchStats = useServerFn(myDashboardStats);
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: () => fetchStats(),
    enabled: ready && !!user,
  });

  useEffect(() => {
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  }, [qc]);

  const s = stats ?? { totalTests: 0, totalQuestions: 0, avgAccuracy: 0, bestScore: 0, availableTests: 0, recent: [] };
  const isNew = s.totalTests === 0;

  const statCards = [
    { label: "Tests Attempted", value: s.totalTests.toString(), sub: s.totalTests === 0 ? "Take your first test" : "Keep going", icon: ClipboardList, tint: "primary" },
    { label: "Questions Solved", value: s.totalQuestions.toString(), sub: "Across all tests", icon: BookOpenCheck, tint: "success" },
    { label: "Avg Accuracy", value: s.totalTests > 0 ? `${s.avgAccuracy}%` : "—", sub: s.totalTests > 0 ? "Across all attempts" : "No attempts yet", icon: Target, tint: "warning" },
    { label: "Best Score", value: s.totalTests > 0 ? s.bestScore.toString() : "—", sub: s.totalTests > 0 ? "Personal best" : "No score yet", icon: Trophy, tint: "destructive" },
  ];

  return (
    <div className="space-y-6">
      {isNew && (
        <Card className="border-border/60 bg-brand-gradient p-6 text-primary-foreground shadow-elegant">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge className="bg-white/15 text-primary-foreground hover:bg-white/15">
                <Sparkles className="mr-1 h-3 w-3" /> Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </Badge>
              <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">Start with your first online test</h2>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Pick any test, attempt it online, and see your detailed score with solutions.
              </p>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link to="/dashboard/tests">
                <ClipboardList className="mr-1.5 h-4 w-4" /> Take a Test
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.label} className="border-border/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--${c.tint})]/10 text-[color:var(--${c.tint})]`}>
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent attempts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Recent test attempts</h3>
              <p className="text-xs text-muted-foreground">Your latest scores</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/tests">All tests <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          {s.recent.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border/60 p-8 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No attempts yet. Take a test to see your history here.
              </p>
              <Button asChild className="mt-4 bg-brand-gradient text-primary-foreground shadow-elegant">
                <Link to="/dashboard/tests">Browse tests</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {s.recent.map((a: any) => (
                <div key={a.created_at} className="flex items-center justify-between rounded-lg border border-border/60 p-4">
                  <div>
                    <div className="font-medium">{a.test?.title ?? "Test"}</div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.round((a.time_taken_seconds ?? 0) / 60)} min</span>
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold">{a.score}</div>
                    <div className="text-xs text-muted-foreground">{Math.round(a.accuracy ?? 0)}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-display text-base font-semibold">Available tests</h3>
          <p className="text-xs text-muted-foreground">Ready to attempt</p>
          <div className="mt-4 font-display text-4xl font-bold text-brand-gradient">
            {s.availableTests}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {s.availableTests === 0 ? "No tests published yet." : "Tests waiting for you"}
          </p>
          <Button asChild className="mt-5 w-full bg-brand-gradient text-primary-foreground shadow-elegant">
            <Link to="/dashboard/tests"><ClipboardList className="mr-1.5 h-4 w-4" /> Take a Test</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
