import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStartups, useCreateStartup } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Globe, Loader2, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6","stagger-7","stagger-8"];

// Professional icon background tints keyed to index
const ICON_STYLES = [
  { bg: "rgba(46,163,224,0.09)",   color: "#2EA3E0" },
  { bg: "rgba(100,50,200,0.09)", color: "#6432c8" },
  { bg: "rgba(0,160,130,0.09)",  color: "#00907a" },
  { bg: "rgba(200,100,0,0.09)",  color: "#c86400" },
  { bg: "rgba(180,30,80,0.09)",  color: "#b41e50" },
  { bg: "rgba(0,140,200,0.09)",  color: "#008cc8" },
];

const inputStyle = { background: "rgba(255,255,255,0.9)" };

export default function Startups() {
  const { data: startups, isLoading } = useStartups();
  const { mutateAsync: createStartup, isPending } = useCreateStartup();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createStartup({
        name: formData.get("name") as string,
        domain: formData.get("domain") as string,
        description: formData.get("description") as string,
      });
      setIsOpen(false);
      toast({ title: "Startup created successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  function handleStartupClick(id: number) {
    navigate(`/startups/${id}`);
  }

  return (
    <Shell adminOnly>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#2EA3E0" }}>Startups</h1>
          <p className="text-muted-foreground">Directory of all portfolio companies.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)", boxShadow: "0 2px 10px rgba(46,163,224,0.25)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
              <Plus className="mr-1.5 h-4 w-4 relative z-10" />
              <span className="relative z-10">Add Startup</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[480px] border-border/60"
            style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(46,163,224,0.12)" }}>
            <div className="h-1 w-full rounded-t-md mb-3" style={{ background: "linear-gradient(90deg, #2EA3E0, #2EA3E0)" }} />
            <DialogHeader>
              <DialogTitle className="font-display text-xl" style={{ color: "#2EA3E0" }}>New Startup</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {[
                { name: "name", label: "Company Name", placeholder: "e.g. Acme Corp", required: true },
                { name: "domain", label: "Industry / Domain", placeholder: "e.g. FinTech, AI, SaaS" },
              ].map(f => (
                <div key={f.name} className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">{f.label}</Label>
                  <Input name={f.name} required={f.required} style={inputStyle} className="h-10 rounded-lg border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder={f.placeholder} />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Description</Label>
                <Textarea name="description" style={inputStyle} className="rounded-lg border-border/70 min-h-[90px] focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="Brief pitch..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-10 rounded-lg font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)" }}>
                {isPending ? <Loader2 className="animate-spin" /> : "Save Company"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-7 w-7" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups?.map((startup, idx) => {
            const ic = ICON_STYLES[idx % ICON_STYLES.length];
            return (
              <div
                key={startup.id}
                className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${STAGGER[idx % STAGGER.length]}`}
                onClick={() => handleStartupClick(startup.id)}
              >
                {/* Subtle background watermark */}
                <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                  <Building2 className="h-24 w-24" />
                </div>
                {/* Arrow on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-4 w-4" style={{ color: ic.color }} />
                </div>

                <div className="relative z-10">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 border transition-transform duration-200 group-hover:scale-105"
                    style={{ background: ic.bg, borderColor: `${ic.color}20` }}
                  >
                    <span className="font-display font-bold text-lg" style={{ color: ic.color }}>
                      {startup.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold mb-1 text-foreground">{startup.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Globe className="h-3.5 w-3.5" />
                    {startup.domain || "No Domain"}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {startup.description || "No description provided."}
                  </p>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${ic.color}50, transparent)` }} />
              </div>
            );
          })}

          {startups?.length === 0 && (
            <div className="col-span-full py-14 text-center stagger-1">
              <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border">
                <Building2 className="h-10 w-10 text-muted-foreground/40 animate-float" />
                <div>
                  <h3 className="text-base font-medium text-foreground/60">No startups yet</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Get started by adding a new company.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
