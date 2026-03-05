import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast({ title: "Welcome back!" });
      setLocation("/");
    } catch (err: any) {
      toast({ 
        title: "Login failed", 
        description: err.message || "Invalid credentials", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Unsplash abstract tech background */}
      {/* landing page hero abstract dark geometric */}
      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <Card className="w-full max-w-md p-8 relative z-10 glass-panel border-white/10 rounded-2xl shadow-2xl shadow-primary/10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-primary/30">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white text-center tracking-tight mb-2">
            FMCIII Portal
          </h1>
          <p className="text-muted-foreground text-center">Sign in to manage your incubator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white/80">Email Address</Label>
            <Input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-black/40 border-white/10 focus:border-primary text-white h-12 rounded-xl"
              placeholder="admin@fmciii.org"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Password</Label>
            <Input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-black/40 border-white/10 focus:border-primary text-white h-12 rounded-xl"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-muted-foreground">
          <p>Demo Credentials: admin@demo.com / password</p>
        </div>
      </Card>
    </div>
  );
}
