import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { useScorecard, useScorecardParameters, useUpsertScorecardParameter } from "@/hooks/use-scorecards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  getScorecardStartupName,
  getScorecardJudgeName,
} from "@/lib/scorecard-utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  User,
  Building2,
  AlertCircle,
  Save,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

const PARAMETERS = [
  { name: "Innovation", maxMarks: 15 },
  { name: "Business Model", maxMarks: 15 },
  { name: "Scalability", maxMarks: 15 },
  { name: "UI/UX", maxMarks: 15 },
  { name: "Technical Feasibility", maxMarks: 15 },
  { name: "Market Potential", maxMarks: 15 },
  { name: "Presentation", maxMarks: 10 },
];

const MAX_TOTAL = PARAMETERS.reduce((sum, p) => sum + p.maxMarks, 0);

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-10 w-36 rounded-xl bg-white/10" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-lg bg-white/10" />
          <Skeleton className="h-5 w-36 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = status ?? "pending";
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
      <AlertCircle className="h-3 w-3" /> Pending Evaluation
    </Badge>
  );
}

export default function ScorecardDetail() {
  const params = useParams<{ scorecardId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const numericId = params.scorecardId ? parseInt(params.scorecardId) : undefined;
  const scorecardId = isNaN(numericId ?? NaN) ? undefined : numericId;

  const { data: scorecard, isLoading } = useScorecard(scorecardId);
  const { data: parameters, isLoading: paramsLoading } = useScorecardParameters(scorecardId);
  const { mutateAsync: upsertParam, isPending: isSaving } = useUpsertScorecardParameter(scorecardId);

  // Local state for marks input (parameterName -> marks string)
  const [localMarks, setLocalMarks] = useState<Record<string, string>>({});
  const [savingParam, setSavingParam] = useState<string | null>(null);

  // Sync local marks from fetched parameters
  useEffect(() => {
    if (parameters) {
      const initial: Record<string, string> = {};
      parameters.forEach((p) => {
        if (p.marks !== null && p.marks !== undefined) {
          initial[p.parameterName] = String(p.marks);
        }
      });
      setLocalMarks(initial);
    }
  }, [parameters]);

  const getParamMarks = (name: string): number | null => {
    const p = parameters?.find((x) => x.parameterName === name);
    return p?.marks ?? null;
  };

  const finalScore = PARAMETERS.reduce((sum, p) => {
    const marks = getParamMarks(p.name);
    return sum + (marks ?? 0);
  }, 0);

  const filledCount = PARAMETERS.filter((p) => getParamMarks(p.name) !== null).length;

  const handleSaveParam = async (paramName: string, maxMarks: number) => {
    const rawVal = localMarks[paramName];
    if (rawVal === undefined || rawVal === "") return;
    const num = Number(rawVal);
    if (isNaN(num) || num < 0 || num > maxMarks) {
      toast({ title: "Invalid marks", description: `Marks must be between 0 and ${maxMarks}`, variant: "destructive" });
      return;
    }
    setSavingParam(paramName);
    try {
      await upsertParam({ parameterName: paramName, marks: num, maxMarks });
      toast({ title: "Saved", description: `${paramName} marks saved.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingParam(null);
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <DetailSkeleton />
      </Shell>
    );
  }

  if (!scorecard) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground opacity-50" />
          <h2 className="text-3xl font-display font-bold text-white">Scorecard Not Found</h2>
          <p className="text-muted-foreground text-lg max-w-sm">
            The scorecard you are looking for does not exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/scorecards")}
            className="mt-4 rounded-xl h-11 px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scorecards
          </Button>
        </div>
      </Shell>
    );
  }

  const displayStartupName = getScorecardStartupName(scorecard);
  const displayJudgeName = getScorecardJudgeName(scorecard);

  return (
    <Shell>
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/scorecards")}
        className="mb-6 -ml-2 text-muted-foreground hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scorecards
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
              {displayStartupName}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              {displayJudgeName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={scorecard.status} />
          <span className="text-2xl font-display font-bold text-white">
            {filledCount > 0 ? (
              <>
                <span className="text-primary">{finalScore}</span>
                <span className="text-muted-foreground text-lg"> / {MAX_TOTAL}</span>
              </>
            ) : (
              <span className="text-muted-foreground text-lg">—</span>
            )}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evaluation Summary */}
        <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Evaluation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Final Score</span>
              <span className="text-white font-bold">
                {filledCount > 0 ? `${finalScore} / ${MAX_TOTAL}` : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Judge</span>
              <span className="text-white font-medium">{displayJudgeName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Startup</span>
              <span className="text-white font-medium">{displayStartupName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Status</span>
              <StatusBadge status={scorecard.status} />
            </div>
            {scorecard.evaluationDate && (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Date
                </span>
                <span className="text-white font-medium">{scorecard.evaluationDate}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parameter Evaluation */}
        <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Parameter Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paramsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {PARAMETERS.map((param) => {
                  const savedMarks = getParamMarks(param.name);
                  const localVal = localMarks[param.name] ?? (savedMarks !== null ? String(savedMarks) : "");
                  const isSavingThis = savingParam === param.name;
                  return (
                    <div key={param.name} className="flex items-center gap-3">
                      <span className="flex-1 text-sm text-white/80 min-w-0 truncate">{param.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Input
                          type="number"
                          min={0}
                          max={param.maxMarks}
                          value={localVal}
                          onChange={(e) =>
                            setLocalMarks((prev) => ({ ...prev, [param.name]: e.target.value }))
                          }
                          className="w-16 h-8 text-center bg-black/50 border-white/10 text-sm p-1"
                          placeholder="—"
                        />
                        <span className="text-xs text-muted-foreground">/{param.maxMarks}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                          disabled={isSavingThis || isSaving}
                          onClick={() => handleSaveParam(param.name, param.maxMarks)}
                        >
                          {isSavingThis ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Final Score</span>
                  <span className="text-lg font-display font-bold text-primary">
                    {filledCount > 0 ? `${finalScore} / ${MAX_TOTAL}` : "—"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
