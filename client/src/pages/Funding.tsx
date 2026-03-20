import { Shell } from "@/components/layout/Shell";
import { useFunding, useCreateFunding } from "@/hooks/use-funding";
import { useStartups } from "@/hooks/use-startups";
import { useUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, TrendingUp, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6"];
const selectStyle = { background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", border: "1px solid rgba(1,81,133,0.12)" };
const user = { id: 1, name: "Admin User" }; // Placeholder for current user (investor) info
// Per-funding-type accent (professional, not neon)
const FUNDING_PALETTE: Record<string, { accent: string; bg: string; text: string }> = {
  "Pre-Seed": { accent: "#c87800", bg: "rgba(200,120,0,0.07)",  text: "#a06200" },
  "Seed":     { accent: "#148c50", bg: "rgba(20,140,80,0.07)",  text: "#0f6e3f" },
  "Series A": { accent: "#015185", bg: "rgba(1,81,133,0.07)",   text: "#015185" },
  "Series B": { accent: "#5a3fa8", bg: "rgba(90,63,168,0.07)",  text: "#4a2f98" },
  "Grant":    { accent: "#a0295c", bg: "rgba(160,41,92,0.07)",  text: "#841e4c" },
};

const DEFAULT_PALETTE = { accent: "#015185", bg: "rgba(1,81,133,0.07)", text: "#015185" };

export default function Funding() {
  const { data: funding, isLoading: fLoading } = useFunding();
  const { data: startups } = useStartups();
  const { data: users } = useUsers();
  const { mutateAsync: recordFunding, isPending } = useCreateFunding();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await recordFunding({
        startupId: Number(formData.get("startupId")),
        investorId: Number(formData.get("investorId")),
        amount: Number(formData.get("amount")),
        fundingType: formData.get("fundingType") as string,
      });
      setIsOpen(false);
      toast({ title: "Funding recorded successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Funding Tracker</h1>
          <p className="text-muted-foreground">Monitor investments and capital raised.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
              <Plus className="mr-1.5 h-4 w-4 relative z-10" />
              <span className="relative z-10">Log Investment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/60"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(1,81,133,0.12)" }}>
            <div className="h-1 rounded-t-md mb-3" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
            <DialogHeader>
              <DialogTitle className="font-display text-xl" style={{ color: "#015185" }}>Record Funding</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {[
                { label: "Startup", name: "startupId", data: startups, getLabel: (s: any) => s.name },
                { label: "Investor", name: "investorId", data: users, getLabel: (u: any) => u.name },
              ].map(({ label, name, data, getLabel }) => (
                <div key={name} className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">{label}</Label>
                  <Select name={name} required>
                    <SelectTrigger className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent style={selectStyle}>
                      {data?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()} className="focus:bg-primary/5">{getLabel(item)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Amount (INR)</Label>
                <Input type="number" name="amount" required className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="e.g. 500000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Funding Stage</Label>
                <Select name="fundingType" required>
                  <SelectTrigger className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent style={selectStyle}>
                    {["Pre-Seed","Seed","Series A","Series B","Grant"].map(v => (
                      <SelectItem key={v} value={v} className="focus:bg-primary/5">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-10 rounded-lg font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
                {isPending ? <Loader2 className="animate-spin" /> : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {fLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-7 w-7" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {funding?.map((record, idx) => {
            const startup = startups?.find(s => s.id === record.startupId);
            const p = FUNDING_PALETTE[record.fundingType] || DEFAULT_PALETTE;

            return (
              <div key={record.id} className={`glass-card p-5 relative overflow-hidden group ${STAGGER[idx % STAGGER.length]}`}>
                {/* Colored top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: p.accent }} />

                {/* Background watermark */}
                <div className="absolute -right-3 -bottom-3 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <TrendingUp className="h-24 w-24" style={{ color: p.accent }} />
                </div>

                <div className="relative z-10 pt-2">
                  {/* Funding type badge */}
                  <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3"
                    style={{ background: p.bg, color: p.text, border: `1px solid ${p.accent}22` }}>
                    {record.fundingType}
                  </span>

                  {/* Amount */}
                  <div className="text-2xl font-display font-bold mb-1" style={{ color: "#015185" }}>
                    ₹{record.amount.toLocaleString()}
                  </div>

                  <p className="text-foreground/70 font-medium text-sm mb-4">
                    {startup?.name || `Startup #${record.startupId}`}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <span>Investor: {user.name}</span>
                    <span>{new Date(record.fundingDate!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {funding?.length === 0 && (
            <div className="col-span-full py-14 text-center stagger-1">
              <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border">
                <IndianRupee className="h-10 w-10 text-muted-foreground/30 animate-float" />
                <div>
                  <h3 className="text-base font-medium text-foreground/60">No funding records</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Log the first investment above.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
