import { Shell } from "@/components/layout/Shell";
import { useScorecards, useCreateScorecard } from "@/hooks/use-scorecards";
import { useApplications } from "@/hooks/use-applications";
import { useUsers } from "@/hooks/use-users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Plus, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Scorecards() {
  const { data: scorecards, isLoading: sLoading } = useScorecards();
  const { data: applications } = useApplications();
  const { data: users } = useUsers();
  const { mutateAsync: createScorecard, isPending } = useCreateScorecard();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createScorecard({
        applicationId: Number(formData.get("applicationId")),
        judgeId: Number(formData.get("judgeId")),
        totalScore: Number(formData.get("totalScore")),
        remarks: formData.get("remarks") as string,
      });
      setIsOpen(false);
      toast({ title: "Scorecard submitted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Evaluations</h1>
          <p className="text-muted-foreground text-lg">Judge scoring and feedback.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6">
              <Plus className="mr-2 h-4 w-4" /> Add Score
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Scorecard</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Application</Label>
                <Select name="applicationId" required>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select Application" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {applications?.map(a => (
                      <SelectItem key={a.id} value={a.id.toString()}>App #{a.id} - {a.status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Judge</Label>
                <Select name="judgeId" required>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select Judge" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {users?.map(u => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Total Score (0-100)</Label>
                <Input type="number" name="totalScore" min="0" max="100" required className="bg-white border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Remarks</Label>
                <Textarea name="remarks" className="bg-white border-gray-200" placeholder="Feedback notes..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl">
                {isPending ? <Loader2 className="animate-spin" /> : "Save Evaluation"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scorecards?.map(score => (
            <Card key={score.id} className="p-6 border-gray-200 bg-white shadow-sm hover-elevate">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">App #{score.applicationId}</h4>
                    <p className="text-xs text-muted-foreground">Judge #{score.judgeId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-display font-bold flex items-center gap-1">
                    {score.totalScore} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-muted-foreground italic">"{score.remarks || "No remarks provided"}"</p>
              </div>
            </Card>
          ))}
          {scorecards?.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No evaluations recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
