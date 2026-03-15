import { Shell } from "@/components/layout/Shell";
import { useScorecards, useCreateScorecard, useDeleteScorecard } from "@/hooks/use-scorecards";
import { useStartups } from "@/hooks/use-startups";
import { useJudges } from "@/hooks/use-judges";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardCheck, Plus, Loader2, Star, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  getScorecardStartupName,
  getScorecardJudgeName,
} from "@/lib/scorecard-utils";
import { ROLE_IDS } from "@/lib/roles";

const getTodayDate = () => new Date().toISOString().split("T")[0];

type ScorecardStatus = "pending" | "in_progress" | "completed";

function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = (status ?? "pending") as ScorecardStatus;
  if (s === "completed") {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </Badge>
    );
  }
  if (s === "in_progress") {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 gap-1">
        <Clock className="h-3 w-3" /> In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 gap-1">
      <AlertCircle className="h-3 w-3" /> Pending
    </Badge>
  );
}

export default function Scorecards() {
  const { data: scorecards, isLoading: sLoading } = useScorecards();
  const { mutateAsync: createScorecard, isPending } = useCreateScorecard();
  const { mutateAsync: deleteScorecard, isPending: isDeleting } = useDeleteScorecard();
  const { data: startups, isLoading: startupsLoading } = useStartups();
  const { data: judges, isLoading: judgesLoading } = useJudges();
  const { user } = useAuth();
  const isAdmin = user?.roleId === ROLE_IDS.ADMIN;
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Form state
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [selectedStartupName, setSelectedStartupName] = useState<string>("");
  const [selectedJudgeId, setSelectedJudgeId] = useState<string>("");
  const [selectedJudgeName, setSelectedJudgeName] = useState<string>("");
  const [evaluationDate, setEvaluationDate] = useState<string>(getTodayDate);
  const [submitted, setSubmitted] = useState(false);

  // Delete state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const isSaveDisabled = !selectedStartupId || !selectedJudgeId || isPending;

  const resetForm = () => {
    setSelectedStartupId("");
    setSelectedStartupName("");
    setSelectedJudgeId("");
    setSelectedJudgeName("");
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
      judgeRefId: Number(selectedJudgeId),
      judgeName: selectedJudgeName,
      evaluationDate: evaluationDate || getTodayDate(),
      status: "pending",
    };
    console.log("[Scorecards] Submitting scorecard payload:", payload);
    try {
      const created = await createScorecard(payload);
      handleOpenChange(false);
      toast({ title: "Scorecard created", description: "Now enter parameter marks." });
      navigate(`/scorecards/${created.id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      await deleteScorecard(deleteTargetId);
      toast({ title: "Scorecard deleted", description: "The scorecard has been removed." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open) setDeleteTargetId(null);
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
              <Plus className="mr-2 h-4 w-4" /> Add Scorecard
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
                {judgesLoading ? (
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-black/50 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading judges…
                  </div>
                ) : (
                  <Select
                    value={selectedJudgeId}
                    onValueChange={(val) => {
                      const judge = judges?.find((j) => String(j.id) === val);
                      setSelectedJudgeId(val);
                      setSelectedJudgeName(judge?.name ?? "");
                    }}
                    required
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                      <SelectValue placeholder="Select a judge" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {judges?.map((judge) => (
                        <SelectItem key={judge.id} value={String(judge.id)}>
                          {judge.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!selectedJudgeId && !judgesLoading && submitted && (
                  <p className="text-xs text-destructive">Please select a judge.</p>
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

              <Button type="submit" disabled={isSaveDisabled} className="w-full h-11 rounded-xl">
                {isPending ? <Loader2 className="animate-spin" /> : "Create Scorecard"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scorecards?.map(sc => {
            const displayName = getScorecardStartupName(sc);
            const displayJudge = getScorecardJudgeName(sc);
            const displayScore = sc.score;
            return (
              <Card
                key={sc.id}
                onClick={() => navigate(`/scorecards/${sc.id}`)}
                className="p-6 border-white/5 bg-card/60 backdrop-blur-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-white/20 hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{displayName}</h4>
                      <p className="text-xs text-muted-foreground">{displayJudge}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {displayScore !== null && displayScore !== undefined ? (
                      <span className="text-xl font-display font-bold text-white flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        {displayScore}
                        <span className="text-xs text-muted-foreground font-normal">/ 100</span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Not scored</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={sc.status} />
                  <div className="flex items-center gap-2">
                    {sc.evaluationDate && (
                      <span className="text-xs text-muted-foreground">{sc.evaluationDate}</span>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(sc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
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

      <AlertDialog open={deleteTargetId !== null} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent className="bg-card border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scorecard</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this scorecard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
