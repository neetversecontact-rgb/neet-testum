import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Atom,
  FlaskConical,
  Leaf,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Target,
  Trophy,
  Sparkles,
  BookOpen,
  Brain,
  BarChart3,
  Radio,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Testum — India's #1 NEET MCQ Practice Platform" },
      {
        name: "description",
        content:
          "Practice 4.5 Lakh+ NEET MCQs with chapter-wise tests, mock exams, AI rank predictor and live poll classes. Trusted by 100K+ aspirants.",
      },
      { property: "og:title", content: "Testum — Practice. Test. Ace NEET." },
      {
        property: "og:description",
        content: "4.5L+ NEET MCQs, AI tools, live poll classes and chapter-wise mock tests.",
      },
    ],
  }),
  component: Landing,
});

const subjects = [
  { key: "physics", label: "Physics", icon: Atom, qs: "15K+", ch: 29, accent: "from-[oklch(0.62_0.19_256)] to-[oklch(0.55_0.18_295)]" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, qs: "15K+", ch: 30, accent: "from-[oklch(0.65_0.18_25)] to-[oklch(0.76_0.16_75)]" },
  { key: "biology", label: "Biology", icon: Leaf, qs: "15K+", ch: 38, accent: "from-[oklch(0.62_0.16_155)] to-[oklch(0.66_0.18_180)]" },
];

const features = [
  { icon: Target, title: "Custom Test Generator", desc: "Build tests from any chapter, topic or difficulty mix." },
  { icon: Brain, title: "AI Syllabus Tracker", desc: "Spot weak chapters and get a daily focus plan." },
  { icon: Sparkles, title: "DPP Generator", desc: "Auto-generated Daily Practice Problems on your gaps." },
  { icon: BarChart3, title: "AI Rank Predictor", desc: "Predict your AIR and target colleges instantly." },
  { icon: Radio, title: "Live Poll Classes", desc: "Solve MCQs live with educators and your batch." },
  { icon: BookOpen, title: "NCERT + Smart Modules", desc: "Curated theory tightly linked to every question." },
];


function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <SubjectGrid />
      <HowItWorks />
      <Features />
      <PaperProof />
      
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient shadow-elegant">
            <span className="font-display text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="font-display text-xl font-bold">
            Test<span className="text-brand-gradient">um</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#subjects" className="text-sm text-muted-foreground hover:text-foreground">Subjects</a>
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild className="bg-brand-gradient text-primary-foreground shadow-elegant hover:opacity-90">
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero-gradient">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="mb-5 w-fit gap-1.5 px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> 82 / 90 Biology match in NEET 2024
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            India's #1 Platform for{" "}
            <span className="text-brand-gradient">NEET MCQ Practice</span> & Testing
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            4.5 Lakh+ decoded questions, chapter-wise mock tests, AI rank predictor and live poll
            classes — everything you need to crack NEET in one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild className="bg-brand-gradient text-primary-foreground shadow-elegant hover:opacity-90">
              <Link to="/auth">Start practicing free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how"><PlayCircle className="mr-1.5 h-4 w-4" /> See how it works</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["A", "S", "V", "D"].map((c, i) => (
                <div key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-accent text-xs font-semibold text-accent-foreground">
                  {c}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                <span className="ml-1.5 font-semibold text-foreground">4.9</span>
              </div>
              <p className="text-xs">Rated by 100K+ NEET aspirants</p>
            </div>
          </div>
        </div>

        {/* Hero card preview */}
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-brand-gradient opacity-20 blur-3xl" />
          <Card className="overflow-hidden border-border/60 shadow-elegant">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              </div>
              <span className="text-xs text-muted-foreground">Mock Test · 02:14</span>
            </div>
            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between text-xs">
                <Badge className="bg-[color:var(--biology)]/15 text-[color:var(--biology)] hover:bg-[color:var(--biology)]/15">Biology · Genetics</Badge>
                <span className="text-muted-foreground">Q 14 / 45</span>
              </div>
              <h3 className="font-display text-lg font-semibold">
                Ratio of phenotypes in a typical dihybrid cross is:
              </h3>
              <div className="space-y-2.5">
                {[
                  ["A", "3 : 1"],
                  ["B", "1 : 2 : 1"],
                  ["C", "9 : 3 : 3 : 1", true],
                  ["D", "1 : 1 : 1 : 1"],
                ].map(([k, v, correct]) => (
                  <div
                    key={k as string}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition ${
                      correct
                        ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/10"
                        : "border-border bg-background hover:border-primary-glow/40"
                    }`}
                  >
                    <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-semibold ${
                      correct ? "bg-[color:var(--success)] text-success-foreground" : "bg-muted text-muted-foreground"
                    }`}>{k as string}</span>
                    <span className="flex-1">{v as string}</span>
                    {correct ? <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> : null}
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-accent/50 p-3 text-xs text-accent-foreground">
                <strong>Solution:</strong> Mendel's dihybrid cross yields a 9:3:3:1 phenotypic ratio in F₂.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "4.5 L+", l: "Decoded Questions" },
    { v: "100K+", l: "NEET Aspirants" },
    { v: "82/90", l: "Biology Match (2024)" },
    { v: "10K+", l: "Mock Tests Taken Daily" },
  ];
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-3xl font-bold text-brand-gradient sm:text-4xl">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubjectGrid() {
  return (
    <section id="subjects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-3">Three subjects, fully decoded</Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Practice that mirrors the real paper</h2>
        <p className="mt-3 text-muted-foreground">
          Every question is tagged to a chapter and topic, and indexed against the NCERT syllabus.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {subjects.map((s) => (
          <Link key={s.key} to="/auth" className="group">
            <Card className="relative overflow-hidden border-border/60 p-6 transition hover:-translate-y-1 hover:shadow-elegant">
              <div className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-elegant`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold">{s.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.qs} questions · {s.ch} chapters</p>
              <div className="mt-6 flex items-center text-sm font-medium text-primary-glow opacity-0 transition group-hover:opacity-100">
                Start practicing <ArrowRight className="ml-1.5 h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Watch the tutorial", d: "5-minute walkthrough of the platform, syllabus tracker and test engine." },
    { n: "02", t: "Practice daily", d: "Chapter-wise MCQs, DPPs and timed sprints tuned to your weak areas." },
    { n: "03", t: "Ace the exam", d: "Take full mock tests, predict your rank, and walk into NEET prepared." },
  ];
  return (
    <section id="how" className="border-y border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">How it works</Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">From your first question to your rank card</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.n} className="border-border/60 p-7">
              <div className="font-display text-5xl font-bold text-brand-gradient">{s.n}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-3">Built for NEET 2026</Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything in one focused workspace</h2>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="group border-border/60 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg bg-accent text-accent-foreground transition group-hover:bg-brand-gradient group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function PaperProof() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5">
              <Trophy className="h-3.5 w-3.5" /> Proof, not promises
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              We decoded NEET 2024 — and matched 82 of 90 Biology questions.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every PYQ scan on the platform is placed side-by-side with the matching question on Testum,
              so you can verify the overlap before you trust the prep.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Side-by-side NEET paper vs platform comparison",
                "Year-wise PYQ index across 2014 → 2025",
                "Topic-level coverage map by chapter",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { tag: "NEET 2024 · Paper", title: "Q 47", body: "Site of fertilization in humans is …" },
              { tag: "Testum Bank", title: "B-006", body: "Site of fertilization in humans is …" },
              { tag: "NEET 2024 · Paper", title: "Q 12", body: "Ratio of phenotypes in dihybrid cross …" },
              { tag: "Testum Bank", title: "B-002", body: "Ratio of phenotypes in dihybrid cross …" },
            ].map((c, i) => (
              <Card key={i} className="border-border/60 p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.tag}</div>
                <div className="mt-1.5 font-display text-base font-semibold">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.body}</div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full w-3/4 rounded-full bg-brand-gradient" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function CTA() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-gradient p-10 text-center text-primary-foreground shadow-elegant sm:p-16">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Start practicing in under 60 seconds</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Free forever for daily practice. No card. No spam. Just NEET prep, done right.
        </p>
        <Button size="lg" variant="secondary" asChild className="mt-7">
          <Link to="/auth">Create free account <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
              <span className="font-display text-sm font-bold text-primary-foreground">N</span>
            </div>
            <span className="font-display text-lg font-bold">Testum</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            India's #1 NEET MCQ practice & testing platform.
          </p>
        </div>
        {[
          { t: "Product", l: ["Subjects", "Mock Tests", "AI Tools", "Live Classes"] },
          { t: "Resources", l: ["NCERT Books", "PYQ Bank", "Rank Predictor", "Blog"] },
          { t: "Company", l: ["About", "Careers", "Contact", "Privacy"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-sm font-semibold">{c.t}</div>
            <ul className="mt-3 space-y-2">
              {c.l.map((i) => (
                <li key={i}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Testum. Built for NEET aspirants.
      </div>
    </footer>
  );
}
