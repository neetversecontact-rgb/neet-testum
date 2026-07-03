import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Atom,
  FlaskConical,
  Leaf,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  BookOpen,
  Brain,
  BarChart3,
  Radio,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Testum — NEET MCQ Practice & Online Tests" },
      {
        name: "description",
        content:
          "Practice NEET MCQs, attempt full-length online tests, track accuracy and revise weak topics. Built for NEET aspirants.",
      },
      { property: "og:title", content: "Testum — Practice. Test. Ace NEET." },
      {
        property: "og:description",
        content: "Chapter-wise MCQ practice and online mock tests for NEET aspirants.",
      },
    ],
  }),
  component: Landing,
});

const subjects = [
  { key: "physics", label: "Physics", icon: Atom, ch: 29, accent: "from-[oklch(0.62_0.19_256)] to-[oklch(0.55_0.18_295)]" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, ch: 30, accent: "from-[oklch(0.65_0.18_25)] to-[oklch(0.76_0.16_75)]" },
  { key: "biology", label: "Biology", icon: Leaf, ch: 38, accent: "from-[oklch(0.62_0.16_155)] to-[oklch(0.66_0.18_180)]" },
];

const features = [
  { icon: ClipboardList, title: "Online Mock Tests", desc: "Attempt full-length tests with timer, palette and instant scoring." },
  { icon: Target, title: "Chapter-wise Practice", desc: "MCQs organised by subject, chapter and topic." },
  { icon: Brain, title: "Detailed Solutions", desc: "Every question comes with a step-by-step explanation." },
  { icon: BarChart3, title: "Personal Analytics", desc: "Track your accuracy, strong topics and weak areas." },
  { icon: Radio, title: "Live Doubt Classes", desc: "Solve MCQs live with educators (coming soon)." },
  { icon: BookOpen, title: "NCERT-linked", desc: "Questions mapped to NCERT chapters and topics." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SubjectGrid />
      <HowItWorks />
      <Features />
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
            <Sparkles className="h-3.5 w-3.5" /> Built for NEET aspirants
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            NEET MCQ Practice &{" "}
            <span className="text-brand-gradient">Online Tests</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Practice chapter-wise MCQs, attempt online mock tests with a live timer and question palette,
            and see detailed solutions the moment you submit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild className="bg-brand-gradient text-primary-foreground shadow-elegant hover:opacity-90">
              <Link to="/dashboard/tests"><ClipboardList className="mr-1.5 h-4 w-4" /> Take a Test</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Start free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
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
              <span className="text-xs text-muted-foreground">Sample Test · 02:14</span>
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

function SubjectGrid() {
  return (
    <section id="subjects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-3">Three subjects</Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Physics · Chemistry · Biology</h2>
        <p className="mt-3 text-muted-foreground">
          Every question is tagged to a chapter and topic. Practice by subject or attempt full mock tests.
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
              <p className="mt-1 text-sm text-muted-foreground">{s.ch} chapters · NCERT-linked</p>
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
    { n: "01", t: "Create your free account", d: "Sign up in seconds with email or Google." },
    { n: "02", t: "Practice or take a test", d: "Chapter-wise MCQs or a full-length timed online test." },
    { n: "03", t: "See detailed solutions", d: "Understand every question and revise weak topics." },
  ];
  return (
    <section id="how" className="border-y border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">How it works</Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Simple, focused, effective</h2>
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
        <Badge variant="secondary" className="mb-3">Features</Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need for NEET prep</h2>
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

function CTA() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-gradient p-10 text-center text-primary-foreground shadow-elegant sm:p-16">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to take a test?</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Sign up free, pick a test, and start practicing. No card required.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/dashboard/tests"><ClipboardList className="mr-1.5 h-4 w-4" /> Take a Test</Link>
          </Button>
          <Button size="lg" asChild className="bg-white/10 text-primary-foreground hover:bg-white/20">
            <Link to="/auth">Create account <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
            <span className="font-display text-sm font-bold text-primary-foreground">T</span>
          </div>
          <span className="font-display text-lg font-bold">Testum</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Testum · NEET MCQ practice & tests
        </p>
      </div>
    </footer>
  );
}
