import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Calendar, Users } from "lucide-react";
import { useMemo } from "react";
import { getCurrentLiveSession } from "@/lib/platformStore";
import { usePlatformStore } from "@/hooks/usePlatformStore";

export const Route = createFileRoute("/dashboard/live")({
  component: LiveClasses,
});

function LiveClasses() {
  const store = usePlatformStore();
  const currentLive = useMemo(() => getCurrentLiveSession(store), [store]);
  const liveSessions = store.liveSessions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Live Classes</h1>
        <p className="text-sm text-muted-foreground">Interactive sessions with real-time MCQ polls</p>
      </div>

      {currentLive && (
        <Card className="border-border/60 p-5">
          <h2 className="font-display text-xl font-bold mb-3">Live Now: {currentLive.title}</h2>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentLive.youtube_video_id}?autoplay=1&modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(currentLive.scheduled_at).toLocaleString()}</span>
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {currentLive.students_count} students</span>
            </div>
            <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">LIVE</Badge>
          </div>
          {currentLive.description && <p className="mt-3 text-sm text-muted-foreground">{currentLive.description}</p>}
        </Card>
      )}

      <h2 className="font-display text-xl font-bold mt-8">Upcoming Sessions</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {liveSessions.filter((s) => s.id !== currentLive?.id).map((c) => (
          <Card key={c.id} className="border-border/60 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground shadow-elegant">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.educator}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(c.scheduled_at).toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.students_count}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" className="bg-brand-gradient text-primary-foreground shadow-elegant">
                Set reminder
              </Button>
            </div>
          </Card>
        ))}
        {liveSessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No upcoming sessions yet. Admins can schedule from the Admin panel.</p>
        )}
      </div>
    </div>
  );
}
