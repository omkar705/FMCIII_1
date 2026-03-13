import { 
  Building2, 
  LayoutDashboard, 
  Target, 
  Users, 
  LogOut, 
  Library,
  IndianRupee,
  ClipboardCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const getNavigationItems = (roleId?: number | null) => {

  if (roleId === 1) { // ADMIN
    return [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Startups", url: "/startups", icon: Building2 },
      { title: "Applications", url: "/applications", icon: Target },
      { title: "Mentorship", url: "/mentorship", icon: Users },
      { title: "Funding", url: "/funding", icon: IndianRupee },
      { title: "Scorecards", url: "/scorecards", icon: ClipboardCheck },
      { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    ];
  }

  if (roleId === 2) { // INCUBATEE
    return [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Mentorship", url: "/mentorship", icon: Users },
      { title: "Applications", url: "/applications", icon: Target },
      { title: "Startups", url: "/startups", icon: Building2 },
      { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    ];
  }

  if (roleId === 3) { // MENTOR
    return [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Mentorship", url: "/mentorship", icon: Users },
      { title: "Scorecards", url: "/scorecards", icon: ClipboardCheck },
      { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    ];
  }

  if (roleId === 4) { // INVESTOR
    return [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Startups", url: "/startups", icon: Building2 },
      { title: "Funding", url: "/funding", icon: IndianRupee },
      { title: "Knowledge Base", url: "/knowledge-base", icon: Library },
    ];
  }

  return [];
};

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const items = getNavigationItems(user?.roleId);

  return (
    <Sidebar className="border-r border-white/5 bg-card/50 backdrop-blur-xl">
      <SidebarContent>
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
         <span className="text-primary font-semibold">
FMCIII Portal
</span>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 font-medium">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate text-white">{user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
