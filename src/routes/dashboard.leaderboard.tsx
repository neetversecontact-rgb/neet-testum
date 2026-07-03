import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Medal } from "lucide-react";
import { leaderboard } from "@/lib/tests.functions";
import { useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  const user = useUser();
  const fetchLb = useServerFn(leaderboard);
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["leaderboard"], queryFn: () => fetchLb() });

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const myRow = rows.findIndex((r) => r.userId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Ranked by best test score across all attempts</p>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16 text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <Card className="border-border/60 border-dashed p-12 text-center">
          <Trophy className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-display text-lg font-semibold">No rankings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Attempt a test to appear on the leaderboard.</p>
        </Card>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {top3.map((p, i) => {
                const Icon = i === 0 ? Crown : Medal;
                const isFirst = i === 0;
                return (
                  <Card key={p.userId} className={cn("border-border/60 p-6 text-center", isFirst && "bg-brand-gradient text-primary-foreground shadow-elegant")}>
                    <Icon className={cn("mx-auto h-7 w-7", isFirst ? "text-warning" : "text-muted-foreground")} />
                    <div className="mt-3 grid h-16 w-16 mx-auto place-items-center rounded-full bg-white/15 font-display text-2xl font-bold">
                      {p.name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="mt-3 font-display text-lg font-semibold">{p.name}</div>
                    <div className="mt-3 font-display text-2xl font-bold">{p.bestScore}</div>
                    <div className={cn("text-xs", isFirst ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {Math.round(p.bestAccuracy)}% · Rank #{i + 1}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <Card className="border-border/60">
            <div className="border-b border-border/60 px-5 py-3.5 text-sm font-semibold">Rankings</div>
            <div className="divide-y divide-border/60">
              {rest.map((p, i) => {
                const rank = i + 4;
                const isYou = p.userId === user?.id;
                return (
                  <div key={p.userId} className={cn("grid grid-cols-12 items-center gap-3 px-5 py-3.5 text-sm", isYou && "bg-accent/30")}>
                    <div className="col-span-1 font-display font-bold text-muted-foreground">#{rank}</div>
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient font-semibold text-primary-foreground">
                        {p.name[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="font-medium">{p.name} {isYou && <span className="text-xs text-muted-foreground">(You)</span>}</div>
                    </div>
                    <div className="col-span-2 text-right"><Badge variant="secondary">{Math.round(p.bestAccuracy)}%</Badge></div>
                    <div className="col-span-3 text-right font-display font-bold">{p.bestScore}</div>
                  </div>
                );
              })}
              {user && myRow === -1 && (
                <div className="bg-brand-gradient px-5 py-3.5 text-sm text-primary-foreground">
                  Attempt a test to see your rank here.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
