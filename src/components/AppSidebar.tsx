import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  Atom,
  ShieldCheck,
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
import { ICONS } from "@/lib/platformStore";
import { usePlatformStore } from "@/hooks/usePlatformStore";
import { toast } from "sonner";

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = useUser();
  const navigate = useNavigate();
  const { menu } = usePlatformStore();

  const grouped = menu
    .filter((item) => item.visible && (item.group !== "Admin" || user?.role === "admin" || user?.role === "super_admin"))
    .sort((a, b) => a.order - b.order)
    .reduce<Record<string, typeof menu>>((acc, item) => {
      acc[item.group] = [...(acc[item.group] ?? []), item];
      return acc;
    }, {});

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
            <span className="font-display text-base font-bold leading-tight">Testum</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Student</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(grouped).map(([label, items]) => (
          <SidebarGroup key={label}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = ICONS[item.icon] ?? ShieldCheck;
                  return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );})}
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
