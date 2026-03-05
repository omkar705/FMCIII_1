import { Shell } from "@/components/layout/Shell";
import { useMentorAssignments, useCreateMentorAssignment } from "@/hooks/use-mentorship";
import { useStartups } from "@/hooks/use-startups";
import { useUsers } from "@/hooks/use-users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Mentorship() {
  const { data: assignments, isLoading: mLoading } = useMentorAssignments();
  const { data: startups } = useStartups();
  const { data: users } = useUsers();
  const { mutateAsync: createAssignment, isPending } = useCreateMentorAssignment();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createAssignment({
        startupId: Number(formData.get("startupId")),
        mentorId: Number(formData.get("mentorId")),
        status: "active"
      });
      setIsOpen(false);
      toast({ title: "Mentor assigned successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Mentorship</h1>
          <p className="text-muted-foreground text-lg">Connect startups with expert guidance.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6">
              <Plus className="mr-2 h-4 w-4" /> Assign Mentor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Pairing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Startup</Label>
                <Select name="startupId" required>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select Startup" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {startups?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mentor (User)</Label>
                <Select name="mentorId" required>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select Mentor" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {users?.map(u => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl">
                {isPending ? <Loader2 className="animate-spin" /> : "Create Assignment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {mLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments?.map(assignment => {
            const startup = startups?.find(s => s.id === assignment.startupId);
            const mentor = users?.find(u => u.id === assignment.mentorId);
            return (
              <Card key={assignment.id} className="p-6 border-white/5 bg-card/60 backdrop-blur-xl hover-elevate">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {mentor?.name?.[0] || 'M'}
                      </div>
                      <span className="font-semibold text-white">{mentor?.name || `Mentor #${assignment.mentorId}`}</span>
                    </div>
                  </div>
                  
                  <div className="px-4 text-muted-foreground">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {startup?.name?.[0] || 'S'}
                      </div>
                      <span className="font-semibold text-white">{startup?.name || `Startup #${assignment.startupId}`}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Assigned: {new Date(assignment.assignedDate!).toLocaleDateString()}
                  </span>
                  <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'} className="bg-primary/20 text-primary border-0">
                    {assignment.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
          {assignments?.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No mentorship pairings yet.</p>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
