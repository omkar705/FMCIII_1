import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertMentorAssignmentSchema } from "@shared/schema";
import { z } from "zod";

export function useMentorAssignments() {
  return useQuery({
    queryKey: [api.mentorAssignments.list.path],
    queryFn: async () => {
      const res = await fetch(api.mentorAssignments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mentor assignments");
      return api.mentorAssignments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMentorAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertMentorAssignmentSchema>) => {
      const res = await fetch(api.mentorAssignments.create.path, {
        method: api.mentorAssignments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to assign mentor");
      return api.mentorAssignments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mentorAssignments.list.path] }),
  });
}
