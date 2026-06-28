import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpenCheck,
  ClipboardList,
  Trophy,
  User,
  LogOut,
  Atom,
  Sparkles,
  Radio,
  GraduationCap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut, useUser } from "@/lib/auth";
import { toast } from "sonner";

const nav = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Learn",
    items: [
      { title: "Practice", url: "/dashboard/practice", icon: BookOpenCheck },
      { title: "Tests", url: "/dashboard/tests", icon: ClipboardList },
      { title: "AI Tools", url: "/dashboard/ai", icon: Sparkles },
      { title: "Live Classes", url: "/dashboard/live", icon: Radio },
      { title: "Study Material", url: "/dashboard/material", icon: GraduationCap },
    ],
  },
  {
    label: "You",
    items: [
      { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = useUser();
  const navigate = useNavigate();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  function handleSignOut() {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient shadow-elegant">
            <Atom className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-bold leading-tight">NEETx</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Student</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={user?.name ?? "Profile"}>
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient font-semibold text-primary-foreground">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{user?.name ?? "Guest"}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{user?.email ?? ""}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
