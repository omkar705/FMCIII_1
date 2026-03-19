import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useStartupByUserId, useCreateStartup, useUpdateStartup } from "@/hooks/use-startups";
import { ROLE_IDS } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import {
  Building2,
  Users,
  PieChart,
  FileText,
  Download,
  Mail,
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
            style={{ background: "rgba(1,81,133,0.07)" }}>
            <Building2 className="h-7 w-7" style={{ color: "#015185" }} />
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
            style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
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
          <h2 className="text-xl font-bold mb-5" style={{ color: "#015185" }}>Edit Startup Profile</h2>
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
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
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
            style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
          >
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: "#015185" }}>{startup?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {startup?.domain}
              {startup?.stage ? ` • ${startup.stage} Stage` : ""}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {startup?.location && (
                <span className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10" style={{ color: "#015185" }}>
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
          <h2 className="text-xl font-bold mb-4" style={{ color: "#015185" }}>About</h2>
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
                <p className="font-medium" style={{ color: "#015185" }}>{value || "—"}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-5" style={{ color: "#015185" }}>Contact</h2>
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
                <span style={{ color: "#015185" }}>{startup.location}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/** Admin / static profile view - kept for non-founder roles */
function AdminProfileView() {
  const [activeTab, setActiveTab] = useState("company");

  const company = {
    name: "Acme Corp",
    domain: "FinTech / SaaS",
    description:
      "Acme Corp is revolutionizing digital payments with advanced AI-driven fraud detection and seamless cross-border transactions for businesses.",
    founded: "2023",
    stage: "Seed",
    location: "Mumbai, India",
    website: "https://acmecorp.example.com",
    email: "contact@acmecorp.example.com",
    phone: "+91 98765 43210",
  };

  const teamMembers = [
    { id: 1, name: "Alice Johnson", role: "CEO & Founder", equity: "45%" },
    { id: 2, name: "Bob Smith", role: "CTO", equity: "30%" },
    { id: 3, name: "Charlie Davis", role: "Head of Product", equity: "5%" },
    { id: 4, name: "Diana Prince", role: "Lead Engineer", equity: "2%" },
  ];

  const capTable = [
    { id: 1, stakeholder: "Founders", shares: "7,500,000", percentage: "75%" },
    { id: 2, stakeholder: "Seed Investors", shares: "1,500,000", percentage: "15%" },
    { id: 3, stakeholder: "Employee Option Pool", shares: "1,000,000", percentage: "10%" },
  ];

  const documents = [
    { id: 1, name: "Certificate of Incorporation", type: "PDF", date: "Jan 15, 2023", size: "2.4 MB" },
    { id: 2, name: "Founders Agreement", type: "PDF", date: "Jan 20, 2023", size: "4.1 MB" },
    { id: 3, name: "Term Sheet (Seed Round)", type: "PDF", date: "Nov 05, 2023", size: "1.8 MB" },
    { id: 4, name: "Non-Disclosure Agreement Template", type: "Word", date: "Feb 10, 2023", size: "850 KB" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-xl">
            <Building2 className="h-10 w-10 text-[#015185]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#015185]">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.domain} • Founded {company.founded}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                {company.stage} Stage
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20">
                {teamMembers.length} Team Members
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10">
                {company.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <Button variant="outline">Edit Profile</Button>
          <Button>Share</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 flex gap-1 w-fit">
          <TabsTrigger value="company"><Building2 className="h-4 w-4 mr-2" />Company</TabsTrigger>
          <TabsTrigger value="team"><Users className="h-4 w-4 mr-2" />Team</TabsTrigger>
          <TabsTrigger value="captable"><PieChart className="h-4 w-4 mr-2" />Cap Table</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-2" />Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="p-6 bg-white/[0.03] border border-white/10 lg:col-span-2">
              <h2 className="text-xl font-bold text-[#015185] mb-4">About the Company</h2>
              <p className="text-muted-foreground leading-relaxed">{company.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 mt-6">
                {[
                  { label: "Domain", value: company.domain },
                  { label: "Stage", value: company.stage },
                  { label: "Founded", value: company.founded },
                  { label: "Team Size", value: teamMembers.length },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-[#015185] font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 bg-white/[0.03] border border-white/10">
              <h2 className="text-xl font-bold text-[#015185] mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex gap-3 items-center">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a href={company.website} className="text-primary flex items-center gap-1 hover:underline">
                    {company.website.replace("https://", "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[#015185]">{company.email}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[#015185]">{company.location}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card className="bg-white/[0.03] border border-white/10 mt-6">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#015185]">Team Members</h2>
              <Button size="sm">Add Member</Button>
            </div>
            <table className="w-full text-left">
              <thead className="text-muted-foreground text-sm border-b border-white/10">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Equity</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-[#015185]/5 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-[#015185] font-medium">{member.name}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{member.role}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-medium">{member.equity}</span>
                        <div className="h-1.5 w-20 bg-white/10 rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: member.equity }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="captable">
          <Card className="bg-white/[0.03] border border-white/10 mt-6">
            <div className="p-6 border-b border-white/10 flex justify-between">
              <h2 className="text-xl font-bold text-[#015185]">Ownership Structure</h2>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
            <table className="w-full">
              <thead className="text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="p-4">Stakeholder</th>
                  <th className="p-4">Shares</th>
                  <th className="p-4">Ownership</th>
                </tr>
              </thead>
              <tbody>
                {capTable.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-[#015185] font-medium">{row.stakeholder}</td>
                    <td className="p-4 text-muted-foreground">{row.shares}</td>
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-primary font-medium">{row.percentage}</span>
                      <div className="h-2 w-32 bg-white/10 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: row.percentage }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6 bg-white/[0.03] border border-white/10 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#015185]">Legal Documents</h2>
              <Button size="sm">Upload Document</Button>
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:border-primary/40 transition">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[#015185] font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
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
        <AdminProfileView />
      )}
    </Shell>
  );
}
