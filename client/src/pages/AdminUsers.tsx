import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Redirect } from "wouter";
import { ROLE_IDS } from "@/lib/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Users, CheckCircle2 } from "lucide-react";

const ROLE_OPTIONS = [
  { value: String(ROLE_IDS.ADMIN), label: "Admin" },
  { value: String(ROLE_IDS.STARTUP_FOUNDER), label: "Startup Founder" },
  { value: String(ROLE_IDS.MENTOR), label: "Mentor" },
  { value: String(ROLE_IDS.INVESTOR), label: "Investor" },
];

const ROLE_LABELS: Record<number, string> = {
  [ROLE_IDS.ADMIN]: "Admin",
  [ROLE_IDS.STARTUP_FOUNDER]: "Startup Founder",
  [ROLE_IDS.MENTOR]: "Mentor",
  [ROLE_IDS.INVESTOR]: "Investor",
};

const ROLE_COLORS: Record<number, { bg: string; color: string }> = {
  [ROLE_IDS.ADMIN]: { bg: "rgba(1,81,133,0.08)", color: "#015185" },
  [ROLE_IDS.STARTUP_FOUNDER]: { bg: "rgba(200,120,0,0.08)", color: "#c87800" },
  [ROLE_IDS.MENTOR]: { bg: "rgba(80,80,200,0.08)", color: "#4040c8" },
  [ROLE_IDS.INVESTOR]: { bg: "rgba(20,140,80,0.08)", color: "#148c50" },
};

export default function AdminUsers() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: users, isLoading: usersLoading, refetch } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [savingId, setSavingId] = useState<number | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<number, string>>({});

  // Guard: only admins
  if (!authLoading && user && user.roleId !== ROLE_IDS.ADMIN) {
    return <Redirect href="/" />;
  }
  if (!authLoading && !user) {
    return <Redirect href="/login" />;
  }

  const handleRoleChange = (userId: number, newRoleId: string) => {
    setPendingRoles((prev) => ({ ...prev, [userId]: newRoleId }));
  };

  const handleSaveRole = async (userId: number) => {
    const newRoleId = pendingRoles[userId];
    if (!newRoleId) return;
    setSavingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roleId: Number(newRoleId) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update role");
      }
      // Remove from pending after save
      setPendingRoles((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      // Refresh users list
      await refetch();
      // If the updated user is the current user, refresh their session data too
      if (userId === user?.id) {
        queryClient.invalidateQueries({ queryKey: [api.auth.profile.path] });
      }
      toast({ title: "Role updated successfully" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>
            User Management
          </h1>
          <p className="text-muted-foreground">Manage all portal users and their roles.</p>
        </div>

        <Card className="p-6 stagger-2">
          {usersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : !users || users.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Current Role
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Change Role
                    </th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => {
                    const currentRoleId = u.roleId ?? 0;
                    const roleColor = ROLE_COLORS[currentRoleId] ?? { bg: "rgba(100,100,100,0.08)", color: "#666" };
                    const pendingRole = pendingRoles[u.id];
                    const isDirty = pendingRole !== undefined && Number(pendingRole) !== currentRoleId;

                    return (
                      <tr
                        key={u.id}
                        className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
                            >
                              {u.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="font-medium text-foreground">{u.name}</span>
                            {u.id === user?.id && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: roleColor.bg, color: roleColor.color }}
                          >
                            {ROLE_LABELS[currentRoleId] ?? "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={pendingRole ?? String(currentRoleId)}
                            onValueChange={(val) => handleRoleChange(u.id, val)}
                          >
                            <SelectTrigger className="h-8 w-44 rounded-lg text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          {isDirty && (
                            <Button
                              size="sm"
                              onClick={() => handleSaveRole(u.id)}
                              disabled={savingId === u.id}
                              className="h-8 px-3 rounded-lg text-xs font-semibold text-white"
                              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
                            >
                              {savingId === u.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
