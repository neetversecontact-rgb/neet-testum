import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Target, TrendingUp, Youtube, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai")({
  component: AITools,
});

const tools = [
  { icon: Brain, title: "AI Syllabus Tracker", desc: "Spot weak chapters automatically", color: "var(--physics)" },
  { icon: TrendingUp, title: "AI Rank Predictor", desc: "Predict your NEET AIR", color: "var(--biology)" },
  { icon: Target, title: "AI College Predictor", desc: "Eligible colleges from your rank", color: "var(--chemistry)" },
  { icon: ClipboardList, title: "DPP Generator", desc: "Daily problems on your gaps", color: "var(--primary-glow)" },
  { icon: Youtube, title: "AI YouTube Recs", desc: "Curated videos for weak topics", color: "var(--destructive)" },
];

function AITools() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-elegant">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">AI Tools</h1>
          <p className="text-sm text-muted-foreground">Smart helpers powered by your practice data</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Card key={t.title} className="group relative overflow-hidden border-border/60 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg text-white shadow-elegant" style={{ background: t.color }}>
              <t.icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold">{t.title}</h3>
              <Badge variant="secondary" className="text-[10px]">Soon</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
