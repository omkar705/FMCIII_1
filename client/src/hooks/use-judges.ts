import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useJudges() {
  return useQuery({
    queryKey: [api.judges.list.path],
    queryFn: async () => {
      const res = await fetch(api.judges.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch judges");
      return api.judges.list.responses[200].parse(await res.json());
    },
  });
}
