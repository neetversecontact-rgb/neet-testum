import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signOut, useUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  component: Profile,
});

function Profile() {
  const user = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [year, setYear] = useState(2026);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setYear(user.targetYear);
    }
  }, [user]);

  if (!user) return null;

  async function save() {
    const { error } = await supabase
      .from("profiles")
      .update({ name, target_year: year })
      .eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account & preferences</p>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="flex items-center gap-4 bg-brand-gradient p-6 text-primary-foreground">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 font-display text-2xl font-bold backdrop-blur">
            {user.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-xl font-bold">{user.name}</div>
            <div className="truncate text-sm text-primary-foreground/85">{user.email}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-primary-foreground hover:bg-white/15">NEET {user.targetYear}</Badge>
              <Badge className="bg-white/15 text-primary-foreground hover:bg-white/15">Student</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="year">Target NEET year</Label>
            <Input id="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-1.5" />
          </div>
        </div>

        <div className="flex justify-between border-t border-border/60 bg-muted/30 px-6 py-4">
          <Button variant="ghost" onClick={handleSignOut} className="text-destructive hover:text-destructive">
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
          <Button onClick={save} className="bg-brand-gradient text-primary-foreground shadow-elegant">Save changes</Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Member since", v: new Date(user.joinedAt).toLocaleDateString() },
          { l: "Questions solved", v: "1,322" },
          { l: "Tests taken", v: "27" },
        ].map((s) => (
          <Card key={s.l} className="border-border/60 p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="mt-2 font-display text-xl font-bold">{s.v}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
