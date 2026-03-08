import { Shell } from "@/components/layout/Shell";
import { useFunding, useCreateFunding } from "@/hooks/use-funding";
import { useStartups } from "@/hooks/use-startups";
import { useUsers } from "@/hooks/use-users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, TrendingUp, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Funding Tracker</h1>
          <p className="text-muted-foreground text-lg">Monitor investments and capital raised.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Log Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Record Funding</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Startup</Label>
                <Select name="startupId" required>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select Startup" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {startups?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Investor</Label>
                <Select name="investorId" required>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select Investor" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {users?.map(u => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (INR)</Label>
                <Input type="number" name="amount" required className="bg-black/50 border-white/10" placeholder="500000" />
              </div>
              <div className="space-y-2">
                <Label>Funding Stage</Label>
                <Select name="fundingType" required>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                    <SelectItem value="Grant">Grant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700">
                {isPending ? <Loader2 className="animate-spin" /> : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {fLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funding?.map(record => {
            const startup = startups?.find(s => s.id === record.startupId);
            return (
              <Card key={record.id} className="p-6 border-white/5 bg-card/60 backdrop-blur-xl hover-elevate relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <TrendingUp className="h-24 w-24 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {record.fundingType}
                  </Badge>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">
                    ₹{(record.amount).toLocaleString()}
                  </h3>
                  <p className="text-lg text-white/90 mb-4">{startup?.name || `Startup #${record.startupId}`}</p>
                  
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                    <span className="text-muted-foreground">Investor #{record.investorId}</span>
                    <span className="text-muted-foreground">{new Date(record.fundingDate!).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            );
          })}
          {funding?.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white">No funding records</h3>
              <p className="text-muted-foreground mt-1">Log the first investment.</p>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
