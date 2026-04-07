import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Redirect } from "wouter";
import { ROLE_IDS } from "@/lib/roles";
import { TrendingUp, Pencil, Check, Loader2, Mail, Shield } from "lucide-react";

export default function InvestorProfile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");

  // Guard: only investors can access this page
  if (!isLoading && user && user.roleId !== ROLE_IDS.INVESTOR) {
    return <Redirect href="/" />;
  }
  if (!isLoading && !user) {
    return <Redirect href="/login" />;
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  const startEditing = () => {
    setName(user?.name ?? "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update profile");
      }
      const updated = await res.json();
      // Refresh auth query cache so the sidebar name updates immediately
      queryClient.setQueryData([api.auth.profile.path], updated);
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const roleName = "Investor";

  return (
    <Shell>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>
            Investor Profile
          </h1>
          <p className="text-muted-foreground">View and manage your investor profile.</p>
        </div>

        <Card className="p-6 stagger-2">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                style={{ background: "linear-gradient(135deg, #148c50, #0ea55e)" }}
              >
                {user?.name?.[0]?.toUpperCase() || "I"}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#015185" }}>
                  {user?.name}
                </h2>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1"
                  style={{ background: "rgba(20,140,80,0.08)", color: "#148c50" }}
                >
                  <Shield className="h-3 w-3" />
                  {roleName}
                </span>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={startEditing}
                variant="outline"
                className="h-9 px-4 rounded-lg shrink-0"
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                    Full Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="h-10 rounded-lg border-border/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      value={user?.email ?? ""}
                      disabled
                      className="h-10 rounded-lg pl-9 bg-muted/40 text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                    Role
                  </Label>
                  <Input
                    value={roleName}
                    disabled
                    className="h-10 rounded-lg bg-muted/40 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Role is assigned by administrators.</p>
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="h-9 px-4 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-9 px-4 rounded-lg font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>
                        <Check className="mr-1.5 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium" style={{ color: "#015185" }}>{user?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="font-medium" style={{ color: "#015185" }}>{user?.email || "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(20,140,80,0.08)", color: "#148c50" }}
                  >
                    <Shield className="h-3 w-3" />
                    {roleName}
                  </span>
                </div>
                {user?.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium" style={{ color: "#015185" }}>{user.phone}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Info card */}
        <Card className="p-5 stagger-3 border-border/50 bg-muted/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#148c50" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#015185" }}>Investor Access</p>
              <p className="text-sm text-muted-foreground mt-1">
                As an investor, you have access to the Funding module and Knowledge Base.
                Use the sidebar to navigate between sections.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
