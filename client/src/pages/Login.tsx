import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ROLE_IDS } from "@/lib/roles";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn }  = useAuth();
  const [, setLocation]         = useLocation();
  const { toast }               = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      toast({ title: "Welcome back!" });
      if (result?.user?.roleId === ROLE_IDS.STARTUP_FOUNDER) setLocation("/profile");
      else if (result?.user?.roleId === ROLE_IDS.MENTOR)     setLocation("/mentor-profile");
      else if (result?.user?.roleId === ROLE_IDS.INVESTOR)   setLocation("/investor-profile");
      else                                                    setLocation("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f0f6fc 0%, #e8f2fb 40%, #ddeeff 100%)" }}
    >
      {/* Background glows — Sky top-left, Orange bottom-right */}
      <div
        className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #2EA3E0, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F5941E, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F7B731, transparent 70%)" }}
      />

      {/* Login card */}
      <div
        className="w-full max-w-md mx-4 relative z-10 rounded-2xl overflow-hidden animate-fade-in-scale"
        style={{
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(46,163,224,0.12)",
          boxShadow: "0 24px 64px rgba(46,163,224,0.13), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)"
        }}
      >
        {/* Animated dual-tone top accent bar */}
        <div className="brand-divider-top" />

        <div className="p-8 pt-7">
          {/* FMCIII Logo — real image */}
          <div className="flex flex-col items-center mb-7">
            <img
              src="/fmciii-logo.webp"
              alt="FMCIII"
              className="h-20 w-20 object-contain mb-3 animate-float"
            />
            <h1
              className="text-2xl font-display font-bold text-center mb-1"
              style={{
                background: "linear-gradient(135deg, #2EA3E0, #F5941E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
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
                background: "linear-gradient(135deg, #F5941E 0%, #d4780e 100%)",
                boxShadow: "0 3px 12px rgba(245,148,30,0.32)"
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
