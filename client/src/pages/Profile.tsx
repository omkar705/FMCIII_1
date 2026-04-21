import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useStartupByUserId, useCreateStartup, useUpdateStartup } from "@/hooks/use-startups";
import { ROLE_IDS } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import {
  Building2,
  Globe,
  MapPin,
  ExternalLink,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";

/** Editable profile for Startup Founders */
function FounderProfile({ userId }: { userId: number }) {
  const { data: startup, isLoading } = useStartupByUserId(userId);
  const { mutateAsync: createStartup, isPending: isCreating } = useCreateStartup();
  const { mutateAsync: updateStartup, isPending: isUpdating } = useUpdateStartup();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    stage: "",
    teammembers: "",
    location: "",
    website: "",
    description: "",
  });

  const startEditing = () => {
    setForm({
      name: startup?.name ?? "",
      domain: startup?.domain ?? "",
      stage: startup?.stage ?? "",
      teammembers: startup?.teammembers ?? "",
      location: startup?.location ?? "",
      website: startup?.website ?? "",
      description: startup?.description ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (startup) {
        await updateStartup({ id: startup.id, ...form });
      } else {
        await createStartup({ ...form, userId } as any);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/startups/by-user", userId] });
      toast({ title: "Profile saved successfully" });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary h-7 w-7" />
      </div>
    );
  }

  if (!startup && !isEditing) {
    // First-time profile setup
    return (
      <div className="py-10 text-center stagger-1">
        <div className="inline-flex flex-col items-center gap-4 p-10 rounded-2xl border-2 border-dashed border-border max-w-md mx-auto">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(46,163,224,0.07)" }}>
            <Building2 className="h-7 w-7" style={{ color: "#2EA3E0" }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Set up your startup profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your startup details to get started with the FMCIII Portal.
            </p>
          </div>
          <Button
            onClick={startEditing}
            className="h-9 px-4 rounded-lg font-semibold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)" }}
          >
            <Pencil className="mr-1.5 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl stagger-2">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-5" style={{ color: "#2EA3E0" }}>Edit Startup Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Startup Name", field: "name", placeholder: "e.g. Lenskart" },
              { label: "Domain / Industry", field: "domain", placeholder: "e.g. FinTech" },
              { label: "Stage", field: "stage", placeholder: "e.g. Seed, Pre-Seed" },
              { label: "Team Size", field: "teammembers", placeholder: "e.g. 5" },
              { label: "Location", field: "location", placeholder: "e.g. Mumbai, India" },
              { label: "Website", field: "website", placeholder: "https://yourstartup.com" },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">{label}</Label>
                <Input
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="h-10 rounded-lg border-border/70"
                />
              </div>
            ))}
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of your startup..."
                className="min-h-[80px] rounded-lg border-border/70"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="h-9 px-4 rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="h-9 px-4 rounded-lg font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)" }}
            >
              {isCreating || isUpdating ? (
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
      </div>
    );
  }

  // Display view
  return (
    <div className="flex flex-col gap-6 stagger-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)" }}
          >
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: "#2EA3E0" }}>{startup?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {startup?.domain}
              {startup?.stage ? ` • ${startup.stage} Stage` : ""}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {startup?.location && (
                <span className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10" style={{ color: "#2EA3E0" }}>
                  <MapPin className="inline h-3 w-3 mr-1" />{startup.location}
                </span>
              )}
              {startup?.teammembers && (
                <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-600 border border-blue-400/20">
                  {startup.teammembers} Team Member{Number(startup.teammembers) !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={startEditing}
          variant="outline"
          className="h-9 px-4 rounded-lg shrink-0"
        >
          <Pencil className="mr-1.5 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Details cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#2EA3E0" }}>About</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {startup?.description || "No description provided yet."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 pt-5 border-t mt-5">
            {[
              { label: "Domain", value: startup?.domain },
              { label: "Stage", value: startup?.stage },
              { label: "Team Size", value: startup?.teammembers },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium" style={{ color: "#2EA3E0" }}>{value || "—"}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-5" style={{ color: "#2EA3E0" }}>Contact</h2>
          <div className="space-y-4 text-sm">
            {startup?.website && (
              <div className="flex gap-3 items-center">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={startup.website} target="_blank" rel="noopener noreferrer"
                  className="text-primary flex items-center gap-1 hover:underline truncate">
                  {startup.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
            {startup?.location && (
              <div className="flex gap-3 items-center">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span style={{ color: "#2EA3E0" }}>{startup.location}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/** Fallback profile view for non-founder roles */
function NonFounderProfileView() {
  return (
    <div className="py-16 text-center stagger-1">
      <div className="inline-flex flex-col items-center gap-4 p-10 rounded-2xl border-2 border-dashed border-border max-w-md mx-auto">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(46,163,224,0.07)" }}>
          <Building2 className="h-7 w-7" style={{ color: "#2EA3E0" }} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Profile</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Startup profiles are available for founders only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const isFounder = user?.roleId === ROLE_IDS.STARTUP_FOUNDER;

  return (
    <Shell>
      {isFounder && user ? (
        <FounderProfile userId={user.id} />
      ) : (
        <NonFounderProfileView />
      )}
    </Shell>
  );
}
