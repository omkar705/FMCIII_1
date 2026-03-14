import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { useScorecard } from "@/hooks/use-scorecards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { startups } from "@/data/startups";
import {
  getScorecardStartupName,
  getScorecardJudgeName,
  getScorecardScore,
  getScorecardFeedback,
} from "@/lib/scorecard-utils";
import {
  ArrowLeft,
  ClipboardCheck,
  Star,
  MessageSquare,
  BarChart3,
  CalendarDays,
  User,
  Building2,
  AlertCircle,
} from "lucide-react";

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

function ScoreBadge({ score }: { score: number | null | undefined }) {
  const value = score ?? 0;
  const color =
    value >= 80
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : value >= 60
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-lg font-bold border ${color}`}
    >
      {value}
      <Star className="h-4 w-4 fill-current" />
      <span className="text-sm font-normal opacity-70">/ 100</span>
    </span>
  );
}

export default function ScorecardDetail() {
  const params = useParams<{ scorecardId: string }>();
  const [, navigate] = useLocation();

  const numericId = params.scorecardId ? parseInt(params.scorecardId) : undefined;
  const { data: scorecard, isLoading } = useScorecard(isNaN(numericId ?? NaN) ? undefined : numericId);

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
  const displayScore = getScorecardScore(scorecard);
  const displayFeedback = getScorecardFeedback(scorecard);

  // Try to find matching startup from static data for extra info
  const startupInfo = startups.find(
    (s) => s.name.toLowerCase() === (scorecard.startupName ?? "").toLowerCase()
  );

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
        <ScoreBadge score={displayScore} />
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
              <span className="text-muted-foreground text-sm">Score</span>
              <ScoreBadge score={displayScore} />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Judge</span>
              <span className="text-white font-medium">{displayJudgeName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground text-sm">Startup</span>
              <span className="text-white font-medium">{displayStartupName}</span>
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

        {/* Judge Feedback */}
        <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Judge Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5 min-h-[100px]">
              <p className="text-white/80 italic leading-relaxed">
                "{displayFeedback || "No feedback provided."}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Startup Info */}
        <Card className="border-white/5 bg-card/60 backdrop-blur-xl md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Startup Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Domain</p>
                <p className="text-white font-medium">{startupInfo?.domain ?? "—"}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Stage</p>
                <p className="text-white font-medium">{startupInfo?.stage ?? "—"}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Team Size</p>
                <p className="text-white font-medium">
                  {startupInfo ? `${startupInfo.teamSize} members` : "—"}
                </p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-white font-medium">{startupInfo?.location ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
