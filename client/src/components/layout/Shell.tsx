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
  adminOnly?: boolean;
}

export function Shell({ children, adminOnly }: ShellProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div
            className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary"
            style={{ animation: "spin 0.9s linear infinite" }}
          />
          <Loader2 className="absolute h-5 w-5 text-primary/40" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (adminOnly && user.roleId !== ROLE_IDS.ADMIN) {
    return (
      <SidebarProvider
        style={{ "--sidebar-width": "17rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      >
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <header
              className="h-14 flex items-center px-6 border-b border-border/60 sticky top-0 z-20"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
            >
              <SidebarTrigger className="hover:bg-accent text-muted-foreground hover:text-foreground transition-colors rounded-md" />
            </header>
            <main className="flex-1 overflow-auto p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
              <div className="frost-panel p-10 max-w-md animate-fade-in-scale">
                <div className="h-16 w-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2" style={{ color: "#015185" }}>Access Denied</h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  You don't have permission to view this page. This section is restricted to administrators only.
                </p>
                <Button asChild className="rounded-lg btn-primary-pro">
                  <Link href="/">Go to Dashboard</Link>
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "17rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {/* Sticky glass header bar */}
          <header
            className="h-14 flex items-center gap-3 px-6 border-b border-border/60 sticky top-0 z-20"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
          >
            <SidebarTrigger className="hover:bg-accent text-muted-foreground hover:text-foreground transition-colors rounded-md" />
            {/* Gradient separator at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 w-full max-w-7xl mx-auto animate-fade-in-up">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
