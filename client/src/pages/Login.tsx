import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2, Loader2, Lock, Mail } from "lucide-react";
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
      const result = await login({ email, password });
      toast({ title: "Welcome back!" });
      // Redirect founders to their profile on first login
      if (result?.user?.roleId === 2) {
        setLocation("/profile");
      } else {
        setLocation("/");
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    }
  };

  return (
    
    <div
    
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #f0f6fc 0%, #e8f2fb 40%, #ddeeff 100%)"
      }}
    >
      {/* Subtle decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #015185, transparent 70%)" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0270b8, transparent 70%)" }} />

      {/* Login card */}
      <div
        className="w-full max-w-md mx-4 relative z-10 rounded-2xl overflow-hidden animate-fade-in-scale"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(1,81,133,0.12)",
          boxShadow: "0 20px 60px rgba(1,81,133,0.13), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)"
        }}
      >
        {/* Top accent stripe */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #015185, #0270b8, #015185)" }} />

        <div className="p-8 pt-7">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 shadow-primary-sm"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
            >
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-center mb-1" style={{ color: "#015185" }}>
              FMCIII Portal
            </h1>
            <p className="text-muted-foreground text-sm text-center">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50"
                  placeholder="admin@fmciii.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 rounded-xl font-semibold text-white relative overflow-hidden group mt-2"
              style={{
                background: "linear-gradient(135deg, #015185, #0270b8)",
                boxShadow: "0 3px 12px rgba(1,81,133,0.3)"
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-600" />
              {isLoggingIn
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : <span className="relative z-10">Sign In</span>
              }
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground/60">Demo: admin@fmciii.com / password123</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
