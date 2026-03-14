import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStartups, useCreateStartup } from "@/hooks/use-startups";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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

  return (
    <Shell adminOnly>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Startups</h1>
          <p className="text-muted-foreground text-lg">Directory of all portfolio companies.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Add Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Startup</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input name="name" required className="bg-black/50 border-white/10" placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label>Industry / Domain</Label>
                <Input name="domain" className="bg-black/50 border-white/10" placeholder="e.g. FinTech, AI, SaaS" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" className="bg-black/50 border-white/10 min-h-[100px]" placeholder="Brief pitch..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl">
                {isPending ? <Loader2 className="animate-spin" /> : "Save Company"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups?.map(startup => (
            <Card
              key={startup.id}
              className="p-6 border-white/5 bg-card/60 backdrop-blur-xl hover-elevate overflow-hidden group cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
              onClick={() => navigate(`/startups/${startup.id}`)}
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-xl text-primary">{startup.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">{startup.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Globe className="h-4 w-4" /> {startup.domain || "No Domain"}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {startup.description || "No description provided."}
                </p>
              </div>
            </Card>
          ))}
          {startups?.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white">No startups yet</h3>
              <p className="text-muted-foreground mt-1">Get started by adding a new company.</p>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
