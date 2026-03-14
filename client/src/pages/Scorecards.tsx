import { Shell } from "@/components/layout/Shell";
import { useScorecards, useCreateScorecard } from "@/hooks/use-scorecards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Plus, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  getScorecardStartupName,
  getScorecardJudgeName,
  getScorecardScore,
  getScorecardFeedback,
} from "@/lib/scorecard-utils";

export default function Scorecards() {
  const { data: scorecards, isLoading: sLoading } = useScorecards();
  const { mutateAsync: createScorecard, isPending } = useCreateScorecard();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createScorecard({
        startupName: formData.get("startupName") as string,
        judgeName: formData.get("judgeName") as string,
        score: Number(formData.get("score")),
        feedback: formData.get("feedback") as string,
        evaluationDate: formData.get("evaluationDate") as string,
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
          <h1 className="text-4xl font-display font-bold text-white mb-2">Evaluations</h1>
          <p className="text-muted-foreground text-lg">Judge scoring and feedback.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6">
              <Plus className="mr-2 h-4 w-4" /> Add Score
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Scorecard</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Startup Name</Label>
                <Input
                  name="startupName"
                  required
                  placeholder="e.g. TechNova"
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Judge Name</Label>
                <Input
                  name="judgeName"
                  required
                  placeholder="e.g. Judge #1"
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Score (0–100)</Label>
                <Input
                  type="number"
                  name="score"
                  min="0"
                  max="100"
                  required
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Evaluation Date</Label>
                <Input
                  type="date"
                  name="evaluationDate"
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea
                  name="feedback"
                  className="bg-black/50 border-white/10"
                  placeholder="Feedback notes..."
                />
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
          {scorecards?.map(score => {
            const displayName = getScorecardStartupName(score);
            const displayJudge = getScorecardJudgeName(score);
            const displayScore = getScorecardScore(score);
            const displayFeedback = getScorecardFeedback(score);
            return (
              <Card
                key={score.id}
                onClick={() => navigate(`/scorecards/${score.id}`)}
                className="p-6 border-white/5 bg-card/60 backdrop-blur-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-white/20 hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{displayName}</h4>
                      <p className="text-xs text-muted-foreground">{displayJudge}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-display font-bold text-white flex items-center gap-1">
                      {displayScore ?? "—"} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-white/80 italic truncate">
                    "{displayFeedback || "No feedback provided"}"
                  </p>
                </div>
              </Card>
            );
          })}
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
