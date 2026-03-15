import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useScorecards() {
  return useQuery({
    queryKey: [api.scorecards.list.path],
    queryFn: async () => {
      const res = await fetch(api.scorecards.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scorecards");
      return api.scorecards.list.responses[200].parse(await res.json());
    },
  });
}

export function useScorecard(id: number | undefined) {
  return useQuery({
    queryKey: ["/api/scorecards", id],
    enabled: id !== undefined,
    queryFn: async () => {
      const res = await fetch(`/api/scorecards/${id}`, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scorecard");
      return api.scorecards.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateScorecard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      startupId: number;
      startupName?: string;
      judgeRefId: number;
      judgeName?: string;
      evaluationDate?: string;
      status?: string;
    }) => {
      console.log("[useCreateScorecard] Sending payload to", api.scorecards.create.path, data);
      const res = await fetch(api.scorecards.create.path, {
        method: api.scorecards.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        let errorMessage = "Failed to create scorecard";
        try {
          const errorBody = await res.json();
          if (errorBody?.message) errorMessage = errorBody.message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }
      return api.scorecards.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.scorecards.list.path] }),
  });
}

export function useScorecardParameters(scorecardId: number | undefined) {
  return useQuery({
    queryKey: ["/api/scorecards", scorecardId, "parameters"],
    enabled: scorecardId !== undefined,
    queryFn: async () => {
      const res = await fetch(`/api/scorecards/${scorecardId}/parameters`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scorecard parameters");
      return api.scorecards.listParameters.responses[200].parse(await res.json());
    },
  });
}

export function useUpsertScorecardParameter(scorecardId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { parameterName: string; marks: number | null; maxMarks: number }) => {
      const res = await fetch(`/api/scorecards/${scorecardId}/parameters`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        let errorMessage = "Failed to save parameter";
        try {
          const errorBody = await res.json();
          if (errorBody?.message) errorMessage = errorBody.message;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scorecards", scorecardId, "parameters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scorecards", scorecardId] });
      queryClient.invalidateQueries({ queryKey: [api.scorecards.list.path] });
    },
  });
}
