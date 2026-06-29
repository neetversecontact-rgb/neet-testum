import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Atom, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Testum" },
      { name: "description", content: "Sign in or create your free Testum account to start practicing NEET MCQs." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (tab === "signup" && !name) {
      toast.error("Please enter your name");
      return;
    }
    signIn(email, name || undefined);
    toast.success(tab === "signup" ? "Welcome to Testum!" : "Welcome back!");
    navigate({ to: "/dashboard" });
  }

  function handleGoogle() {
    // Mock Google sign-in until Lovable Cloud is enabled
    const demo = `student${Math.floor(Math.random() * 999)}@gmail.com`;
    signIn(demo, "Google Student");
    toast.success("Signed in with Google");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-brand-gradient p-12 text-primary-foreground lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> <span className="text-sm">Back to home</span>
        </Link>
        <div className="my-auto max-w-md">
          <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Atom className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Practice. Test.<br />Ace NEET.
          </h1>
          <p className="mt-4 text-primary-foreground/85">
            Join 100K+ aspirants practicing 4.5L+ decoded NEET MCQs with AI-powered analytics.
          </p>
          <div className="mt-10 space-y-3 text-sm">
            {[
              "4.5L+ decoded questions across PCB",
              "AI rank & college predictor",
              "Live poll classes with educators",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} Testum</div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md border-border/60 p-8 shadow-elegant">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
              <span className="font-display text-sm font-bold text-primary-foreground">T</span>
            </div>
            <span className="font-display text-lg font-bold">Testum</span>
          </Link>
          <h2 className="font-display text-2xl font-bold">Welcome</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue your NEET prep
          </p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TabsContent value="signup" className="m-0 space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Aarav Mehta" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
              </TabsContent>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground shadow-elegant hover:opacity-90">
                {tab === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" onClick={handleGoogle} className="w-full gap-2">
            <GoogleLogo /> Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </Card>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
