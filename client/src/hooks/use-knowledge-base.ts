import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertKnowledgeBaseSchema } from "@shared/schema";
import { z } from "zod";

export function useKnowledgeBase() {
  return useQuery({
    queryKey: [api.knowledgeBase.list.path],
    queryFn: async () => {
      const res = await fetch(api.knowledgeBase.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      return api.knowledgeBase.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertKnowledgeBaseSchema>) => {
      const res = await fetch(api.knowledgeBase.create.path, {
        method: api.knowledgeBase.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create article");
      return api.knowledgeBase.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.knowledgeBase.list.path] }),
  });
}
