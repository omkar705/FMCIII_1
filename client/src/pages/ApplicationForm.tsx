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
import { Loader2, FileText, CheckCircle2, User, Rocket, FileBarChart, DollarSign, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const STARTUP_CATEGORIES = [
  "FinTech","HealthTech","EdTech","AgriTech","CleanTech",
  "E-Commerce","AI/ML","SaaS","IoT","Deep Tech","Other",
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

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  accentClass?: string;
  children: React.ReactNode;
}

function FormSection({ icon, title, accentClass = "section-accent-blue", children }: FormSectionProps) {
  return (
    <div className="frost-panel p-5 space-y-4">
      <div className={`flex items-center gap-2.5 ${accentClass}`}>
        <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(46,163,224,0.07)" }}>
          <span className="text-primary">{icon}</span>
        </div>
        <h2 className="text-base font-display font-semibold" style={{ color: "#2EA3E0" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

const inputCls = "h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50";
const areaCls  = "rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50";
const labelCls = "text-[11px] font-semibold tracking-wide uppercase text-foreground/55";

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
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.roleId !== 2) {
    return <Redirect href="/applications" />;
  }

  if (submitted) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center stagger-1">
          <div className="frost-panel p-10 max-w-sm flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-[-10px] rounded-full border-2 border-green-200 animate-ping opacity-60" />
              <div className="h-20 w-20 rounded-full flex items-center justify-center border-2 border-green-200"
                style={{ background: "rgba(20,140,80,0.06)" }}>
                <CheckCircle2 className="h-10 w-10 text-green-600 animate-scale-in" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold mb-2" style={{ color: "#2EA3E0" }}>Application Submitted!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your application has been successfully submitted. Our team will review it and get back to you shortly.
              </p>
            </div>
            <div className="text-xs font-medium px-4 py-1.5 rounded-full"
              style={{ background: "rgba(20,140,80,0.08)", border: "1px solid rgba(20,140,80,0.2)", color: "#148c50" }}>
              ✓ Submitted successfully
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => { if (typeof value === "string") data[key] = value; });
    data.startupCategory = category;
    data.businessPlanFile = businessPlanFile?.name ?? "";
    data.financialProjectionsFile = financialFile?.name ?? "";
    try {
      await submitForm(data);
      setSubmitted(true);
      toast({ title: "Application submitted successfully!" });
    } catch (err: any) {
      toast({ title: "Error submitting application", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-7 stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#2EA3E0" }}>New Application</h1>
          <p className="text-muted-foreground">Fill out the form below to submit your startup application.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Applicant Information */}
          <div className="stagger-2">
            <FormSection icon={<User className="h-3.5 w-3.5" />} title="Applicant Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Applicant Name *</Label>
                  <Input id="applicantName" name="applicantName" defaultValue={user.name} required className={inputCls} placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Email *</Label>
                  <Input id="email" name="email" type="email" defaultValue={user.email} required className={inputCls} placeholder="email@example.com" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className={labelCls}>Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required className={inputCls} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </FormSection>
          </div>

          {/* Startup Details */}
          <div className="stagger-3">
            <FormSection icon={<Rocket className="h-3.5 w-3.5" />} title="Startup Details" accentClass="section-accent-teal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Startup Name *</Label>
                  <Input id="startupName" name="startupName" required className={inputCls} placeholder="Your startup name" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Category *</Label>
                  <Select name="startupCategory" value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", border: "1px solid rgba(46,163,224,0.12)" }}>
                      {STARTUP_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="focus:bg-primary/5">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className={labelCls}>Problem Statement *</Label>
                  <Textarea id="problemStatement" name="problemStatement" required className={`${areaCls} min-h-[90px]`} placeholder="What problem does your startup solve?" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className={labelCls}>Startup Idea Description *</Label>
                  <Textarea id="ideaDescription" name="ideaDescription" required className={`${areaCls} min-h-[90px]`} placeholder="Describe your startup idea in detail..." />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Target Market *</Label>
                  <Input id="targetMarket" name="targetMarket" required className={inputCls} placeholder="Who are your target customers?" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Estimated Budget (₹) *</Label>
                  <Input id="estimatedBudget" name="estimatedBudget" type="number" min="0" required className={inputCls} placeholder="e.g. 500000" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Team Strength *</Label>
                  <Input id="teamStrength" name="teamStrength" type="number" min="1" required className={inputCls} placeholder="Number of team members" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Current Revenue (₹)</Label>
                  <Input id="currentRevenue" name="currentRevenue" type="number" min="0" className={inputCls} placeholder="0 if pre-revenue" />
                </div>
              </div>
            </FormSection>
          </div>

          {/* Business Plan */}
          <div className="stagger-4">
            <FormSection icon={<FileBarChart className="h-3.5 w-3.5" />} title="Business Plan" accentClass="section-accent-purple">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Problem &amp; Solution *</Label>
                  <Textarea id="problemSolution" name="problemSolution" required className={`${areaCls} min-h-[90px]`} placeholder="Explain your solution to the problem..." />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Scalability</Label>
                  <Textarea id="scalability" name="scalability" className={`${areaCls} min-h-[70px]`} placeholder="How do you plan to scale your startup?" />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Market Opportunity</Label>
                  <Textarea id="marketOpportunity" name="marketOpportunity" className={`${areaCls} min-h-[70px]`} placeholder="Describe the market opportunity..." />
                </div>
                {/* File upload */}
                <div className="space-y-1.5">
                  <Label className={labelCls}>Business Plan Upload (PDF/DOC) *</Label>
                  <label htmlFor="businessPlan" className="file-drop-zone flex flex-col items-center gap-2 py-5 px-4 rounded-lg cursor-pointer">
                    <Upload className="h-5 w-5 text-primary/40" />
                    <span className="text-sm text-muted-foreground">
                      {businessPlanFile
                        ? <span className="text-primary font-medium flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />{businessPlanFile.name}
                          </span>
                        : <>Drop file or <span className="text-primary font-medium underline underline-offset-2">browse</span></>
                      }
                    </span>
                    <span className="text-xs text-muted-foreground/50">PDF, DOC, DOCX supported</span>
                    <Input id="businessPlan" type="file" accept=".pdf,.doc,.docx" className="hidden"
                      onChange={e => setBusinessPlanFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Financial Information */}
          <div className="stagger-5">
            <FormSection icon={<DollarSign className="h-3.5 w-3.5" />} title="Financial Information" accentClass="section-accent-slate">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Future Financial Projections</Label>
                  <Textarea id="financialProjections" name="financialProjections" className={`${areaCls} min-h-[70px]`} placeholder="Describe your financial projections for the next 3–5 years..." />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Financial Projections Upload (Excel/PDF)</Label>
                  <label htmlFor="financialProjectionsFile" className="file-drop-zone flex flex-col items-center gap-2 py-5 px-4 rounded-lg cursor-pointer">
                    <Upload className="h-5 w-5 text-primary/40" />
                    <span className="text-sm text-muted-foreground">
                      {financialFile
                        ? <span className="text-primary font-medium flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />{financialFile.name}
                          </span>
                        : <>Drop file or <span className="text-primary font-medium underline underline-offset-2">browse</span></>
                      }
                    </span>
                    <span className="text-xs text-muted-foreground/50">PDF, XLSX, XLS, CSV supported</span>
                    <Input id="financialProjectionsFile" type="file" accept=".pdf,.xlsx,.xls,.csv" className="hidden"
                      onChange={e => setFinancialFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Submit */}
          <div className="stagger-6">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)", boxShadow: "0 3px 14px rgba(46,163,224,0.28)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-600" />
              {isPending ? (
                <><Loader2 className="animate-spin mr-2 h-5 w-5 relative z-10" /><span className="relative z-10">Submitting...</span></>
              ) : (
                <span className="relative z-10">Submit Application</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
