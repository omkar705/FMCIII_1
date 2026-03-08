import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [api.auth.profile.path],
    queryFn: async () => {
      const res = await fetch(api.auth.profile.path, {
        credentials: "include",
      });

      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      return api.auth.profile.responses[200].parse(data);
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();
      return api.auth.login.responses[200].parse(data);
    },

    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.profile.path], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.setQueryData([api.auth.profile.path], null);
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.profile.path], null);
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
  };
}