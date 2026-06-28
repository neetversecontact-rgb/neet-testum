import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Medal } from "lucide-react";
import { LEADERBOARD } from "@/lib/mockData";
import { useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  const [tab, setTab] = useState("week");
  const user = useUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">See where you stand among NEET aspirants</p>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This week</TabsTrigger>
            <TabsTrigger value="month">This month</TabsTrigger>
            <TabsTrigger value="all">All-time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Podium */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, i) => {
          const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
          const Icon = pos === 1 ? Crown : Medal;
          return (
            <Card
              key={p.name}
              className={cn(
                "border-border/60 p-6 text-center",
                pos === 1 && "sm:-translate-y-3 bg-brand-gradient text-primary-foreground shadow-elegant",
              )}
            >
              <Icon className={cn("mx-auto h-7 w-7", pos === 1 ? "text-warning" : "text-muted-foreground")} />
              <div className="mt-3 grid h-16 w-16 mx-auto place-items-center rounded-full bg-white/15 font-display text-2xl font-bold">
                {p.name[0]}
              </div>
              <div className="mt-3 font-display text-lg font-semibold">{p.name}</div>
              <div className={cn("text-xs", pos === 1 ? "text-primary-foreground/80" : "text-muted-foreground")}>{p.city}</div>
              <div className="mt-3 font-display text-2xl font-bold">{p.score}</div>
              <div className={cn("text-xs", pos === 1 ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {p.accuracy}% accuracy · Rank #{p.rank}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full list */}
      <Card className="border-border/60">
        <div className="border-b border-border/60 px-5 py-3.5 text-sm font-semibold">Global Rankings</div>
        <div className="divide-y divide-border/60">
          {LEADERBOARD.map((p) => {
            const isYou = false; // mock
            return (
              <div key={p.rank} className={cn("grid grid-cols-12 items-center gap-3 px-5 py-3.5 text-sm", isYou && "bg-accent/30")}>
                <div className="col-span-1 font-display font-bold text-muted-foreground">#{p.rank}</div>
                <div className="col-span-6 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient font-semibold text-primary-foreground">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.city}</div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <Badge variant="secondary">{p.accuracy}%</Badge>
                </div>
                <div className="col-span-3 text-right font-display font-bold">{p.score}</div>
              </div>
            );
          })}
          {user && (
            <div className="grid grid-cols-12 items-center gap-3 bg-brand-gradient px-5 py-3.5 text-sm text-primary-foreground">
              <div className="col-span-1 font-display font-bold">#247</div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-semibold">
                  {user.name[0]}
                </div>
                <div>
                  <div className="font-medium">{user.name} (You)</div>
                  <div className="text-xs text-primary-foreground/80">Keep climbing!</div>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <Badge className="bg-white/20 text-primary-foreground hover:bg-white/20">82%</Badge>
              </div>
              <div className="col-span-3 text-right font-display font-bold">412</div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Streak Master", d: "14-day practice streak", icon: "🔥" },
          { t: "Sharpshooter", d: "90%+ accuracy this week", icon: "🎯" },
          { t: "Mock Champion", d: "Top 10% in latest mock", icon: "🏆" },
        ].map((b) => (
          <Card key={b.t} className="border-border/60 p-5">
            <div className="text-3xl">{b.icon}</div>
            <div className="mt-3 font-display font-semibold">{b.t}</div>
            <div className="text-xs text-muted-foreground">{b.d}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
