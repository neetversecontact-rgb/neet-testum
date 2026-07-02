import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BellRing,
  BookOpenCheck,
  Eye,
  EyeOff,
  FileUp,
  GripVertical,
  LayoutDashboard,
  ListChecks,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { hasAdminAccess, useUser } from "@/lib/auth";
import { SUBJECT_META, type Question, type Subject } from "@/lib/mockData";
import {
  ICONS,
  addBroadcast,
  addMenuItem,
  addQuestion,
  adminMetrics,
  deleteQuestion,
  updateMenuItem,
  addLiveSession,
  updateLiveSession,
  deleteLiveSession,
  type SidebarItem,
  type LiveSession,
  type Broadcast,
  type AuditEvent,
} from "@/lib/platformStore";
import { usePlatformStore } from "@/hooks/usePlatformStore";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Testum" },
      { name: "description", content: "Manage Testum questions, sidebar, analytics, broadcasts and audit trails." },
    ],
  }),
  component: AdminPage,
});

const groups: SidebarItem["group"][] = ["Overview", "Learn", "Performance", "Admin"];
const subjects = Object.keys(SUBJECT_META) as Subject[];

function AdminPage() {
  const user = useUser();
  const navigate = useNavigate();
  const store = usePlatformStore();
  const metrics = useMemo(() => adminMetrics(store), [store]);

  useEffect(() => {
    if (!user || !hasAdminAccess(user)) navigate({ to: "/dashboard", replace: true });
  }, [navigate, user]);

  if (!user || !hasAdminAccess(user)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <Card className="max-w-md border-border/60 p-8">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 font-display text-xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with an admin account to manage Testum.</p>
          <Button asChild className="mt-5 bg-brand-gradient text-primary-foreground">
            <Link to="/auth">Go to sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const adminUser = user;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient shadow-elegant">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold">Testum Admin</div>
              <div className="text-[11px] text-muted-foreground">{adminUser.email}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{adminUser.role.replace("_", " ")}</Badge>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Student view</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Users" value={metrics.users.toLocaleString()} icon={Users} />
          <Metric label="Questions" value={metrics.questions.toString()} icon={BookOpenCheck} />
          <Metric label="Tests" value={metrics.tests.toString()} icon={ListChecks} />
          <Metric label="Attempts" value={metrics.attempts.toLocaleString()} icon={Activity} />
          <Metric label="Avg accuracy" value={`${metrics.avgAccuracy}%`} icon={BarChart3} />
        </section>

        <Tabs defaultValue="questions" className="space-y-5">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="live-sessions">Live Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="m-0">
            <QuestionManager questions={store.questions} />
          </TabsContent>
          <TabsContent value="sidebar" className="m-0">
            <SidebarManager menu={store.menu} />
          </TabsContent>
          <TabsContent value="analytics" className="m-0">
            <AnalyticsPanel metrics={metrics} />
          </TabsContent>
          <TabsContent value="broadcasts" className="m-0">
            <BroadcastManager broadcasts={store.broadcasts} />
          </TabsContent>
          <TabsContent value="audit" className="m-0">
            <AuditTrail audit={store.audit} />
          </TabsContent>
          <TabsContent value="live-sessions" className="m-0">
            <LiveSessionManager liveSessions={store.liveSessions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function QuestionManager({ questions }: { questions: Question[] }) {
  const [subject, setSubject] = useState<Subject>("biology");
  const [chapter, setChapter] = useState("Genetics");
  const [topic, setTopic] = useState("Mendelian Inheritance");
  const [difficulty, setDifficulty] = useState<Question["difficulty"]>("Medium");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<Question["correct"]>("A");
  const [explanation, setExplanation] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || options.some((o) => !o.trim()) || !explanation.trim()) {
      toast.error("Complete question, all options and solution");
      return;
    }
    addQuestion({
      subject,
      chapter: chapter.trim(),
      topic: topic.trim(),
      difficulty,
      text: text.trim(),
      options: [
        { id: "A", text: options[0].trim() },
        { id: "B", text: options[1].trim() },
        { id: "C", text: options[2].trim() },
        { id: "D", text: options[3].trim() },
      ],
      correct,
      explanation: explanation.trim(),
      source: "Admin entry",
    });
    setText("");
    setOptions(["", "", "", ""]);
    setExplanation("");
    toast.success("Question added");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card className="border-border/60 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Question management</h2>
            <p className="text-xs text-muted-foreground">Manual rich entry; image URLs can be pasted into text/options.</p>
          </div>
          <FileUp className="h-5 w-5 text-muted-foreground" />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject">
              <Select value={subject} onValueChange={(v) => setSubject(v as Subject)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{SUBJECT_META[s].label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Question["difficulty"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Easy", "Medium", "Hard"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Chapter"><Input value={chapter} onChange={(e) => setChapter(e.target.value)} /></Field>
          <Field label="Topic"><Input value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
          <Field label="Question"><Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Enter MCQ stem, formula, or image URL" /></Field>
          <div className="grid gap-2">
            {options.map((value, index) => (
              <Input key={index} value={value} onChange={(e) => setOptions((prev) => prev.map((o, i) => i === index ? e.target.value : o))} placeholder={`Option ${String.fromCharCode(65 + index)}`} />
            ))}
          </div>
          <Field label="Correct option">
            <Select value={correct} onValueChange={(v) => setCorrect(v as Question["correct"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Solution"><Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3} /></Field>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> Add question</Button>
        </form>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Question bank</h2>
        <div className="mt-4 max-h-[720px] space-y-2 overflow-auto pr-1">
          {questions.map((q) => (
            <div key={q.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{SUBJECT_META[q.subject].label}</Badge>
                    <Badge variant="outline">{q.chapter}</Badge>
                    <Badge>{q.difficulty}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{q.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Correct: {q.correct} · {q.topic}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { deleteQuestion(q.id); toast.success("Question deleted"); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SidebarManager({ menu }: { menu: SidebarItem[] }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("/dashboard");
  const [group, setGroup] = useState<SidebarItem["group"]>("Learn");
  const [icon, setIcon] = useState<SidebarItem["icon"]>("LayoutDashboard");

  function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return toast.error("Title and URL are required");
    addMenuItem({ title: title.trim(), url: url.trim(), group, icon, visible: true });
    setTitle("");
    toast.success("Sidebar item created");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Create menu item</h2>
        <form onSubmit={create} className="mt-4 space-y-4">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Rank Predictor" /></Field>
          <Field label="URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/dashboard/ai" /></Field>
          <Field label="Group">
            <Select value={group} onValueChange={(v) => setGroup(v as SidebarItem["group"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Icon">
            <Select value={icon} onValueChange={(v) => setIcon(v as SidebarItem["icon"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(ICONS).map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> Add item</Button>
        </form>
      </Card>
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Dynamic sidebar</h2>
        <div className="mt-4 space-y-2">
          {[...menu].sort((a, b) => a.order - b.order).map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            return (
              <div key={item.id} className="grid gap-3 rounded-lg border border-border/60 p-3 md:grid-cols-[1fr_110px_90px_92px] md:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{item.group} · {item.url}</div>
                  </div>
                </div>
                <Input type="number" value={item.order} onChange={(e) => updateMenuItem(item.id, { order: Number(e.target.value) })} />
                <Button variant="outline" onClick={() => updateMenuItem(item.id, { visible: !item.visible })}>
                  {item.visible ? <Eye className="mr-1.5 h-4 w-4" /> : <EyeOff className="mr-1.5 h-4 w-4" />}
                  {item.visible ? "Show" : "Hide"}
                </Button>
                <Select value={item.group} onValueChange={(v) => updateMenuItem(item.id, { group: v as SidebarItem["group"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AnalyticsPanel({ metrics }: { metrics: ReturnType<typeof adminMetrics> }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Per topic/question</h2>
        <div className="mt-4 space-y-3 text-sm">
          {Object.entries(metrics.bySubject).map(([subject, count]) => (
            <div key={subject}>
              <div className="flex justify-between"><span className="capitalize">{subject}</span><span>{count} questions</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-brand-gradient" style={{ width: `${Math.min(100, Number(count) * 7)}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Difficulty quality</h2>
        <div className="mt-4 space-y-3 text-sm">
          {Object.entries(metrics.byDifficulty).map(([difficulty, count]) => (
            <div key={difficulty} className="flex items-center justify-between rounded-lg bg-accent/40 p-3">
              <span>{difficulty}</span><Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Granular tracking</h2>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <Row label="Per user" value="streak, accuracy, weak topics" />
          <Row label="Per question" value="attempts, correct %, reports" />
          <Row label="Per test" value="rank, score bands, time spent" />
          <Row label="Per topic" value="mastery and revision due" />
        </div>
      </Card>
    </div>
  );
}

function BroadcastManager({ broadcasts }: { broadcasts: Broadcast[] }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [segment, setSegment] = useState("all");
  const [status, setStatus] = useState("draft");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error("Title and message are required");
    addBroadcast({ title: title.trim(), message: message.trim(), segment: segment as never, status: status as never });
    setTitle("");
    setMessage("");
    toast.success("Broadcast saved");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Segmented broadcast</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Message"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} /></Field>
          <Field label="Segment">
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All students</SelectItem>
                <SelectItem value="physics">Physics learners</SelectItem>
                <SelectItem value="chemistry">Chemistry learners</SelectItem>
                <SelectItem value="biology">Biology learners</SelectItem>
                <SelectItem value="low_accuracy">Low accuracy</SelectItem>
                <SelectItem value="test_takers">Recent test takers</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["draft", "scheduled", "sent"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><BellRing className="mr-1.5 h-4 w-4" /> Save broadcast</Button>
        </form>
      </Card>
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Broadcast queue</h2>
        <div className="mt-4 space-y-3">
          {broadcasts.map((b) => (
            <div key={b.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div><div className="font-medium">{b.title}</div><p className="mt-1 text-sm text-muted-foreground">{b.message}</p></div>
                <Badge>{b.status}</Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Segment: {b.segment} · {new Date(b.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AuditTrail({ audit }: { audit: AuditEvent[] }) {
  return (
    <Card className="border-border/60 p-6">
      <h2 className="font-display text-lg font-semibold">Audit trail</h2>
      <div className="mt-4 space-y-2">
        {audit.map((event) => (
          <div key={event.id} className="grid gap-2 rounded-lg border border-border/60 p-4 text-sm md:grid-cols-[180px_1fr_160px]">
            <div className="truncate font-medium">{event.actor}</div>
            <div><span className="font-medium">{event.action}</span><span className="text-muted-foreground"> · {event.target}</span></div>
            <div className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LiveSessionManager({ liveSessions }: { liveSessions: LiveSession[] }) {
  const [title, setTitle] = useState("");
  const [educator, setEducator] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isLive, setIsLive] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !educator.trim() || !youtubeVideoId.trim() || !scheduledAt.trim()) {
      toast.error("Title, Educator, YouTube Video ID, and Scheduled At are required");
      return;
    }
    await addLiveSession({
      title: title.trim(),
      educator: educator.trim(),
      description: description.trim(),
      youtube_video_id: youtubeVideoId.trim(),
      scheduled_at: new Date(scheduledAt).toISOString(),
      is_live: isLive,
    });
    setTitle("");
    setEducator("");
    setDescription("");
    setYoutubeVideoId("");
    setScheduledAt("");
    setIsLive(false);
    toast.success("Live session added");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Live Session Management</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Physics — Rotational Mechanics deep dive" /></Field>
          <Field label="Educator"><Input value={educator} onChange={(e) => setEducator(e.target.value)} placeholder="Dr. R. Sharma" /></Field>
          <Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Detailed description of the session" /></Field>
          <Field label="YouTube Video ID"><Input value={youtubeVideoId} onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="dQw4w9WgXcQ" /></Field>
          <Field label="Scheduled At"><Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} /></Field>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isLive" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} />
            <Label htmlFor="isLive">Mark as Live Now</Label>
          </div>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> Add Live Session</Button>
        </form>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Upcoming Live Sessions</h2>
        <div className="mt-4 max-h-[720px] space-y-2 overflow-auto pr-1">
          {liveSessions.map((session) => (
            <div key={session.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{session.educator}</Badge>
                    <Badge>{new Date(session.scheduled_at).toLocaleString()}</Badge>
                    {session.is_live && <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">LIVE</Badge>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{session.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">YouTube ID: {session.youtube_video_id}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateLiveSession(session.id, { is_live: !session.is_live })}>
                    {session.is_live ? "End Live" : "Go Live"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteLiveSession(session.id); toast.success("Live session deleted"); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block">{label}</Label>{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between rounded-lg bg-accent/40 p-3"><span className="font-medium text-foreground">{label}</span><span>{value}</span></div>;
}
