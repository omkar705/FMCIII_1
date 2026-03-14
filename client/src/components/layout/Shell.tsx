import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ROLE_IDS } from "@/lib/roles";

interface ShellProps {
  children: ReactNode;
  /** When true, only users with roleId === 1 (ADMIN) can view this page. */
  adminOnly?: boolean;
}

export function Shell({ children, adminOnly }: ShellProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (adminOnly && user.roleId !== ROLE_IDS.ADMIN) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--sidebar-width-icon": "4rem",
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-screen w-full bg-background selection:bg-primary/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          <AppSidebar />
          <div className="flex flex-col flex-1 relative z-10 w-full overflow-hidden">
            <header className="h-16 flex items-center px-6 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20">
              <SidebarTrigger className="hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors" />
            </header>
            <main className="flex-1 overflow-auto p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
              <ShieldAlert className="h-16 w-16 text-destructive mb-6 opacity-80" />
              <h2 className="text-3xl font-display font-bold text-white mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                You don't have permission to view this page. This section is restricted to
                administrators only.
              </p>
              <Button asChild className="rounded-xl">
                <Link href="/">Go to Dashboard</Link>
              </Button>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <AppSidebar />
        <div className="flex flex-col flex-1 relative z-10 w-full overflow-hidden">
          <header className="h-16 flex items-center px-6 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20">
            <SidebarTrigger className="hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors" />
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
