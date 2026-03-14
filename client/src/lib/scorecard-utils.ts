import type { Scorecard } from "@shared/schema";

/** Returns the effective startup name from a scorecard record (new field first, legacy fallback). */
export function getScorecardStartupName(score: Scorecard): string {
  return score.startupName ?? (score.applicationId ? `App #${score.applicationId}` : "—");
}

/** Returns the effective judge name from a scorecard record (new field first, legacy fallback). */
export function getScorecardJudgeName(score: Scorecard): string {
  return score.judgeName ?? (score.judgeId ? `Judge #${score.judgeId}` : "—");
}

/** Returns the effective numeric score from a scorecard record (new field first, legacy fallback). */
export function getScorecardScore(score: Scorecard): number | null {
  return score.score ?? score.totalScore ?? null;
}

/** Returns the effective feedback text from a scorecard record (new field first, legacy fallback). */
export function getScorecardFeedback(score: Scorecard): string {
  return score.feedback ?? score.remarks ?? "";
}
