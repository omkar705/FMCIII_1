import { Shell } from "@/components/layout/Shell";
import { useScorecards, useCreateScorecard } from "@/hooks/use-scorecards";
import { useStartups } from "@/hooks/use-startups";
import { useUsers } from "@/hooks/use-users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const getTodayDate = () => new Date().toISOString().split("T")[0];

export default function Scorecards() {
  const { data: scorecards, isLoading: sLoading } = useScorecards();
  const { mutateAsync: createScorecard, isPending } = useCreateScorecard();
  const { data: startups, isLoading: startupsLoading } = useStartups();
  const { data: users, isLoading: usersLoading } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Form state
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [selectedStartupName, setSelectedStartupName] = useState<string>("");
  const [selectedJudgeId, setSelectedJudgeId] = useState<string>("");
  const [selectedJudgeName, setSelectedJudgeName] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [evaluationDate, setEvaluationDate] = useState<string>(getTodayDate);
  const [submitted, setSubmitted] = useState(false);

  const isSaveDisabled = !selectedStartupId || !selectedJudgeId || !score || isPending;

  const resetForm = () => {
    setSelectedStartupId("");
    setSelectedStartupName("");
    setSelectedJudgeId("");
    setSelectedJudgeName("");
    setScore("");
    setFeedback("");
    setEvaluationDate(getTodayDate());
    setSubmitted(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (isSaveDisabled) return;
    const payload = {
      startupId: Number(selectedStartupId),
      startupName: selectedStartupName,
      judgeId: Number(selectedJudgeId),
      judgeName: selectedJudgeName,
      score: Number(score),
      feedback,
      evaluationDate: evaluationDate || getTodayDate(),
    };
    console.log("[Scorecards] Submitting scorecard payload:", payload);
    try {
      await createScorecard(payload);
      handleOpenChange(false);
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

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              {/* Startup dropdown */}
              <div className="space-y-2">
                <Label>Startup</Label>
                {startupsLoading ? (
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-black/50 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading startups…
                  </div>
                ) : (
                  <Select
                    value={selectedStartupId}
                    onValueChange={(val) => {
                      const startup = startups?.find((s) => String(s.id) === val);
                      setSelectedStartupId(val);
                      setSelectedStartupName(startup?.name ?? "");
                    }}
                    required
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                      <SelectValue placeholder="Select a startup" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {startups?.map((startup) => (
                        <SelectItem key={startup.id} value={String(startup.id)}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!selectedStartupId && !startupsLoading && submitted && (
                  <p className="text-xs text-destructive">Please select a startup.</p>
                )}
              </div>

              {/* Judge dropdown */}
              <div className="space-y-2">
                <Label>Judge</Label>
                {usersLoading ? (
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-black/50 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading judges…
                  </div>
                ) : (
                  <Select
                    value={selectedJudgeId}
                    onValueChange={(val) => {
                      const judge = users?.find((u) => String(u.id) === val);
                      setSelectedJudgeId(val);
                      setSelectedJudgeName(judge?.name ?? "");
                    }}
                    required
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                      <SelectValue placeholder="Select a judge" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!selectedJudgeId && !usersLoading && submitted && (
                  <p className="text-xs text-destructive">Please select a judge.</p>
                )}
              </div>

              {/* Score */}
              <div className="space-y-2">
                <Label>Score (0–100)</Label>
                <Input
                  type="number"
                  name="score"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="bg-black/50 border-white/10"
                />
                {!score && submitted && (
                  <p className="text-xs text-destructive">Score is required.</p>
                )}
              </div>

              {/* Evaluation Date */}
              <div className="space-y-2">
                <Label>Evaluation Date</Label>
                <Input
                  type="date"
                  name="evaluationDate"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="bg-black/50 border-white/10"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea
                  name="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-black/50 border-white/10"
                  placeholder="Feedback notes..."
                />
              </div>

              <Button type="submit" disabled={isSaveDisabled} className="w-full h-11 rounded-xl">
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

