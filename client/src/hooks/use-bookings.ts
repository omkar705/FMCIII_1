import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertPhysicalAssetSchema, insertAssetBookingSchema } from "@shared/schema";
import { z } from "zod";

export function usePhysicalAssets() {
  return useQuery({
    queryKey: [api.physicalAssets.list.path],
    queryFn: async () => {
      const res = await fetch(api.physicalAssets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assets");
      return api.physicalAssets.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePhysicalAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertPhysicalAssetSchema>) => {
      const res = await fetch(api.physicalAssets.create.path, {
        method: api.physicalAssets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create asset");
      return api.physicalAssets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.physicalAssets.list.path] }),
  });
}

export function useAssetBookings() {
  return useQuery({
    queryKey: [api.assetBookings.list.path],
    queryFn: async () => {
      const res = await fetch(api.assetBookings.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.assetBookings.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAssetBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertAssetBookingSchema>) => {
      const res = await fetch(api.assetBookings.create.path, {
        method: api.assetBookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create booking");
      return api.assetBookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.assetBookings.list.path] }),
  });
}

export function useCancelAssetBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.assetBookings.list.path] }),
  });
}
