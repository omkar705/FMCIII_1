import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Applications() {
  const { data: applications, isLoading: aLoading } = useApplications();
  const { data: startups, isLoading: sLoading } = useStartups();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { toast } = useToast();
  const { user } = useAuth();

  if (aLoading || sLoading) {
    return (
      <Shell>
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary h-7 w-7" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Pipeline</h1>
          <p className="text-muted-foreground">Manage application lifecycle.</p>
        </div>

        {user?.roleId === 2 && (
          <Link href="/applications/new">
            <Button
              className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
              <Plus className="mr-1.5 h-4 w-4 relative z-10" />
              <span className="relative z-10">New Application</span>
            </Button>
          </Link>
        )}
      </div>

      {user?.roleId === 1 && (
        <div className="frost-panel p-5 stagger-2">
          <KanbanBoard
            applications={applications || []}
            startups={startups || []}
            onStatusChange={(id, status) => updateStatus({ id, status })}
          />
        </div>
      )}
    </Shell>
  );
}