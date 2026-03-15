import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Loader2 } from "lucide-react";
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
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Pipeline</h1>
          <p className="text-muted-foreground text-lg">Manage application lifecycle.</p>
        </div>

        {/* Always navigate to the full application form */}
        {/* <Link href="/applications/new">
          <Button className="rounded-xl h-11 px-6">
            <Plus className="mr-2 h-4 w-4" /> New Application
          </Button>
        </Link> */}
      </div>

      {user?.roleId === 1 && (
        <div className="bg-white/20 rounded-3xl p-6 border border-black/50">
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