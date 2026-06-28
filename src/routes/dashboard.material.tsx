import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/dashboard/material")({
  component: StudyMaterial,
});

const ncert = [
  { subject: "Physics", title: "Class 11 — Mechanics", chapters: 8 },
  { subject: "Chemistry", title: "Class 11 — Physical Chemistry", chapters: 9 },
  { subject: "Biology", title: "Class 12 — Genetics & Evolution", chapters: 7 },
  { subject: "Physics", title: "Class 12 — Electromagnetism", chapters: 8 },
];

function StudyMaterial() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Study Material</h1>
        <p className="text-sm text-muted-foreground">NCERT books, smart modules and notes</p>
      </div>

      <div>
        <h2 className="font-display text-base font-semibold">NCERT Books</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {ncert.map((b) => (
            <Card key={b.title} className="flex items-center gap-4 border-border/60 p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground shadow-elegant">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <Badge variant="secondary" className="mb-1">{b.subject}</Badge>
                <div className="truncate font-display font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.chapters} chapters</div>
              </div>
              <Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-semibold">Smart Modules</h2>
        <Card className="mt-3 grid place-items-center border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
          <FileText className="mb-2 h-8 w-8 text-muted-foreground/60" />
          Editorial-style curated modules coming soon.
        </Card>
      </div>
    </div>
  );
}
