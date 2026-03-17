import { 
  Building2, LayoutDashboard, Target, Users, LogOut, Library,
  IndianRupee, ClipboardCheck, Building, CalendarDays,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_IDS } from "@/lib/roles";

const getNavigationItems = (roleId?: number | null) => {
  if (roleId === ROLE_IDS.ADMIN) return [
    { title: "Dashboard",    url: "/",             icon: LayoutDashboard },
    { title: "Startups",     url: "/startups",     icon: Building2 },
    { title: "Applications", url: "/applications", icon: Target },
    { title: "Mentorship",   url: "/mentorship",   icon: Users },
    { title: "Funding",      url: "/funding",      icon: IndianRupee },
    { title: "Scorecards",   url: "/scorecards",   icon: ClipboardCheck },
    { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    { title: "Bookings",     url: "/bookings",     icon: CalendarDays },
  ];
  if (roleId === ROLE_IDS.INCUBATEE) return [
    { title: "Dashboard",    url: "/",             icon: LayoutDashboard },
    { title: "Mentorship",   url: "/mentorship",   icon: Users },
    { title: "Applications", url: "/applications", icon: Target },
    { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    { title: "Bookings",     url: "/bookings",     icon: CalendarDays },
    { title: "Profile",      url: "/profile",      icon: Building },
  ];
  if (roleId === ROLE_IDS.MENTOR) return [
    { title: "Dashboard",    url: "/",             icon: LayoutDashboard },
    { title: "Mentorship",   url: "/mentorship",   icon: Users },
    { title: "Scorecards",   url: "/scorecards",   icon: ClipboardCheck },
    { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
  ];
  if (roleId === ROLE_IDS.INVESTOR) return [
    { title: "Dashboard",    url: "/",             icon: LayoutDashboard },
    { title: "Funding",      url: "/funding",      icon: IndianRupee },
    { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
  ];
  return [];
};

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const items = getNavigationItems(user?.roleId);
  const isStartupProfile = /^\/startups\/\d+/.test(location);

  return (
    <Sidebar
      className="border-r border-border/60"
      style={{
        background: "rgba(255,255,255,0.90)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <SidebarContent>
        {/* Brand header */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-base tracking-tight block leading-tight"
              style={{ color: "#015185" }}>FMCIII</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="pt-3">
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground px-4 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2">
              {items.map((item, idx) => {
                const isActive = isStartupProfile
                  ? item.url === "/profile"
                  : location === item.url;
                return (
                  <SidebarMenuItem key={item.title}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${idx * 35}ms` }}
                  >
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link
                        href={item.url}
                        className={`
                          flex items-center gap-2.5 px-3 py-2.5 rounded-lg group transition-all duration-150 relative
                          ${isActive
                            ? "font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }
                        `}
                        style={isActive ? {
                          background: "rgba(1,81,133,0.08)",
                          color: "#015185",
                          borderLeft: "2px solid #015185",
                          paddingLeft: "calc(0.75rem - 2px)",
                          boxShadow: "inset 0 0 0 1px rgba(1,81,133,0.06)"
                        } : {}}
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105"
                          style={isActive ? { color: "#015185" } : {}}
                        />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/50">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors mb-1">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate text-foreground">{user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-red-50 rounded-lg transition-colors font-medium group"
        >
          <LogOut className="h-4 w-4 group-hover:scale-105 transition-transform" />
          Sign out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
