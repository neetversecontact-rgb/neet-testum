import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Flame, Target, TrendingUp, Trophy, BookOpenCheck, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { WEEKLY_PERF, SUBJECT_META, TEST_SERIES } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const subjectPie = [
  { name: "Physics", value: 412, color: "var(--physics)" },
  { name: "Chemistry", value: 389, color: "var(--chemistry)" },
  { name: "Biology", value: 521, color: "var(--biology)" },
];

const stats = [
  { label: "Questions Solved", value: "1,322", delta: "+86 this week", icon: BookOpenCheck, tint: "primary" },
  { label: "Accuracy", value: "82%", delta: "+3.4% vs last week", icon: Target, tint: "success" },
  { label: "Predicted AIR", value: "4,210", delta: "↑ 312 ranks", icon: Trophy, tint: "warning" },
  { label: "Streak", value: "14 days", delta: "Keep it going!", icon: Flame, tint: "destructive" },
];

function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--${s.tint})]/10 text-[color:var(--${s.tint})]`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue + Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Weekly performance</h3>
              <p className="text-xs text-muted-foreground">Questions solved & accuracy</p>
            </div>
            <Badge variant="secondary" className="gap-1.5"><TrendingUp className="h-3 w-3" /> +12%</Badge>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer>
              <AreaChart data={WEEKLY_PERF}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="solved" stroke="var(--primary-glow)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-display text-base font-semibold">Subject mix</h3>
          <p className="text-xs text-muted-foreground">Questions by subject</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={subjectPie} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {subjectPie.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {subjectPie.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Continue + Tests */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-brand-gradient p-6 text-primary-foreground shadow-elegant lg:col-span-1">
          <Badge className="bg-white/15 text-primary-foreground backdrop-blur hover:bg-white/15">Continue</Badge>
          <h3 className="mt-3 font-display text-xl font-bold">Biology · Genetics</h3>
          <p className="mt-1 text-sm text-primary-foreground/80">14 of 30 questions complete</p>
          <Progress value={(14 / 30) * 100} className="mt-4 bg-white/15 [&>div]:bg-white" />
          <Button asChild variant="secondary" className="mt-5">
            <Link to="/dashboard/practice/$subject" params={{ subject: "biology" }}>
              Resume <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Upcoming tests</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/tests">View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {TEST_SERIES.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                to="/dashboard/tests/$testId"
                params={{ testId: t.id }}
                className="flex items-center justify-between rounded-lg border border-border/60 p-4 transition hover:border-primary-glow/40 hover:bg-accent/40"
              >
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.duration} min</span>
                    <span>{t.totalQuestions} Qs</span>
                    <span>{t.marks} marks</span>
                  </div>
                </div>
                {t.badge ? <Badge variant="secondary">{t.badge}</Badge> : null}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Subjects */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(Object.keys(SUBJECT_META) as Array<keyof typeof SUBJECT_META>).map((k) => {
          const s = SUBJECT_META[k];
          return (
            <Link key={k} to="/dashboard/practice/$subject" params={{ subject: k }}>
              <Card className="border-border/60 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-base font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.questions} Qs · {s.chapters} chapters</div>
                  </div>
                  <span className="h-10 w-10 rounded-lg" style={{ background: `color-mix(in oklab, var(--${s.color}) 18%, transparent)` }}>
                    <span className="grid h-full w-full place-items-center font-display text-lg font-bold" style={{ color: `var(--${s.color})` }}>
                      {s.label[0]}
                    </span>
                  </span>
                </div>
                <Progress value={[68, 54, 76][["physics", "chemistry", "biology"].indexOf(k)]} className="mt-4 h-1.5" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
