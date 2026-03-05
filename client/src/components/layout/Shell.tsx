import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function Shell({ children }: { children: ReactNode }) {
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
