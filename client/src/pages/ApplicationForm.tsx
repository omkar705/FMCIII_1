import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Redirect } from "wouter";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const STARTUP_CATEGORIES = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "AgriTech",
  "CleanTech",
  "E-Commerce",
  "AI/ML",
  "SaaS",
  "IoT",
  "Deep Tech",
  "Other",
];

function useSubmitApplicationForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await fetch("/api/application-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit application");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.applications.list.path] });
    },
  });
}

export default function ApplicationForm() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: submitForm, isPending } = useSubmitApplicationForm();
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [businessPlanFile, setBusinessPlanFile] = useState<File | null>(null);
  const [financialFile, setFinancialFile] = useState<File | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.roleId !== 2) {
    return <Redirect href="/applications" />;
  }

  if (submitted) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Your application has been successfully submitted. Our team will
            review it and get back to you shortly.
          </p>
        </div>
      </Shell>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        data[key] = value;
      }
    });

    data.startupCategory = category;
    data.businessPlanFile = businessPlanFile?.name ?? "";
    data.financialProjectionsFile = financialFile?.name ?? "";

    try {
      await submitForm(data);
      setSubmitted(true);
      toast({ title: "Application submitted successfully!" });
    } catch (err: any) {
      toast({
        title: "Error submitting application",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            New Application
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill out the form below to submit your startup application.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Applicant Information */}
          <div className="bg-black/20 rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-xl font-display font-semibold text-white">
              Applicant Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input
                  id="applicantName"
                  name="applicantName"
                  defaultValue={user.name}
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Startup Details */}
          <div className="bg-black/20 rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-xl font-display font-semibold text-white">
              Startup Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name *</Label>
                <Input
                  id="startupName"
                  name="startupName"
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="Your startup name"
                />
              </div>
              <div className="space-y-2">
                <Label>Startup Category *</Label>
                <Select
                  name="startupCategory"
                  value={category}
                  onValueChange={setCategory}
                  required
                >
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {STARTUP_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="problemStatement">Problem Statement *</Label>
                <Textarea
                  id="problemStatement"
                  name="problemStatement"
                  required
                  className="bg-black/50 border-white/10 min-h-[100px]"
                  placeholder="What problem does your startup solve?"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ideaDescription">
                  Startup Idea Description *
                </Label>
                <Textarea
                  id="ideaDescription"
                  name="ideaDescription"
                  required
                  className="bg-black/50 border-white/10 min-h-[100px]"
                  placeholder="Describe your startup idea in detail..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market *</Label>
                <Input
                  id="targetMarket"
                  name="targetMarket"
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="Who are your target customers?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Estimated Budget (₹) *</Label>
                <Input
                  id="estimatedBudget"
                  name="estimatedBudget"
                  type="number"
                  min="0"
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="e.g. 500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamStrength">Team Strength *</Label>
                <Input
                  id="teamStrength"
                  name="teamStrength"
                  type="number"
                  min="1"
                  required
                  className="bg-black/50 border-white/10"
                  placeholder="Number of team members"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRevenue">Current Revenue (₹)</Label>
                <Input
                  id="currentRevenue"
                  name="currentRevenue"
                  type="number"
                  min="0"
                  className="bg-black/50 border-white/10"
                  placeholder="0 if pre-revenue"
                />
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-black/20 rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-xl font-display font-semibold text-white">
              Business Plan
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="problemSolution">Problem &amp; Solution *</Label>
                <Textarea
                  id="problemSolution"
                  name="problemSolution"
                  required
                  className="bg-black/50 border-white/10 min-h-[100px]"
                  placeholder="Explain your solution to the problem..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scalability">Scalability</Label>
                <Textarea
                  id="scalability"
                  name="scalability"
                  className="bg-black/50 border-white/10 min-h-[80px]"
                  placeholder="How do you plan to scale your startup?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketOpportunity">Market Opportunity</Label>
                <Textarea
                  id="marketOpportunity"
                  name="marketOpportunity"
                  className="bg-black/50 border-white/10 min-h-[80px]"
                  placeholder="Describe the market opportunity..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPlan">
                  Business Plan Upload (PDF/DOC) *
                </Label>
                <Input
                  id="businessPlan"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) =>
                    setBusinessPlanFile(e.target.files?.[0] ?? null)
                  }
                  className="bg-black/50 border-white/10 file:bg-primary/20 file:text-primary file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3 cursor-pointer"
                />
                {businessPlanFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <FileText className="h-3 w-3" /> {businessPlanFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-black/20 rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-xl font-display font-semibold text-white">
              Financial Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="financialProjections">
                  Future Financial Projections
                </Label>
                <Textarea
                  id="financialProjections"
                  name="financialProjections"
                  className="bg-black/50 border-white/10 min-h-[80px]"
                  placeholder="Describe your financial projections for the next 3–5 years..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financialProjectionsFile">
                  Financial Projections Upload (Excel/PDF)
                </Label>
                <Input
                  id="financialProjectionsFile"
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) =>
                    setFinancialFile(e.target.files?.[0] ?? null)
                  }
                  className="bg-black/50 border-white/10 file:bg-primary/20 file:text-primary file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3 cursor-pointer"
                />
                {financialFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <FileText className="h-3 w-3" /> {financialFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl text-base"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </div>
    </Shell>
  );
}
