import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertFundingSchema } from "@shared/schema";
import { z } from "zod";

export function useFunding() {
  return useQuery({
    queryKey: [api.funding.list.path],
    queryFn: async () => {
      const res = await fetch(api.funding.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch funding records");
      return api.funding.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFunding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertFundingSchema>) => {
      const res = await fetch(api.funding.create.path, {
        method: api.funding.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to record funding");
      return api.funding.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.funding.list.path] }),
  });
}
