import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/live")({
  component: LiveClasses,
});

const classes = [
  { title: "Physics — Rotational Mechanics deep dive", educator: "Dr. R. Sharma", time: "Today · 6:00 PM", live: true, students: 1240 },
  { title: "Biology — Genetics: Numerical practice", educator: "Dr. M. Iyer", time: "Tomorrow · 5:00 PM", students: 980 },
  { title: "Chemistry — Organic name reactions", educator: "Dr. A. Bose", time: "Thu · 7:00 PM", students: 1102 },
];

function LiveClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Live Classes</h1>
        <p className="text-sm text-muted-foreground">Interactive sessions with real-time MCQ polls</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {classes.map((c) => (
          <Card key={c.title} className="border-border/60 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground shadow-elegant">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.educator}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.time}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.students}</span>
                  </div>
                </div>
              </div>
              {c.live && <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">LIVE</Badge>}
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" className="bg-brand-gradient text-primary-foreground shadow-elegant">
                {c.live ? "Join now" : "Set reminder"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
