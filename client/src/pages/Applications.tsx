import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useApplications, useUpdateApplicationStatus, useCreateApplication } from "@/hooks/use-applications";
import { useStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Applications() {
  const { data: applications, isLoading: aLoading } = useApplications();
  const { data: startups, isLoading: sLoading } = useStartups();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { mutateAsync: createApplication, isPending } = useCreateApplication();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createApplication({
        startupId: Number(formData.get("startupId")),
        pitchDeckUrl: formData.get("pitchDeckUrl") as string,
        status: "Applied"
      });
      setIsOpen(false);
      toast({ title: "Application submitted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (aLoading || sLoading) {
    return <Shell><div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div></Shell>;
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Pipeline</h1>
          <p className="text-muted-foreground text-lg">Manage application lifecycle.</p>
        </div>

        {user?.roleId === 2 ? (
          <Link href="/applications/new">
            <Button className="rounded-xl h-11 px-6">
              <Plus className="mr-2 h-4 w-4" /> New Application
            </Button>

          </Link>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl h-11 px-6">
                <Plus className="mr-2 h-4 w-4" /> New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Start Application</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Select Startup</Label>
                  <Select name="startupId" required>
                    <SelectTrigger className="bg-black/50 border-white/10">
                      <SelectValue placeholder="Choose a startup..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {startups?.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pitch Deck URL</Label>
                  <Input name="pitchDeckUrl" type="url" className="bg-black/50 border-white/10" placeholder="https://..." />
                </div>
                <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl">
                  {isPending ? <Loader2 className="animate-spin" /> : "Submit Application"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>


      {user?.roleId === 1 && (
    <div className="bg-white /20 rounded-3xl p-6 border border-black/50">
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


