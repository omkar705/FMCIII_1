import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { insertStartupSchema } from "@shared/schema";
import { z } from "zod";

export function useStartups() {
  return useQuery({
    queryKey: [api.startups.list.path],
    queryFn: async () => {
      const res = await fetch(api.startups.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch startups");
      return api.startups.list.responses[200].parse(await res.json());
    },
  });
}

export function useStartup(id: number) {
  return useQuery({
    queryKey: [api.startups.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.startups.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch startup");
      return api.startups.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateStartup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertStartupSchema>) => {
      const res = await fetch(api.startups.create.path, {
        method: api.startups.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create startup");
      return api.startups.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.startups.list.path] }),
  });
}
