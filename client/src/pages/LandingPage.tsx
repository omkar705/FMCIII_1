import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ROLE_IDS } from "@/lib/roles";
import {
  Building2, Loader2, Lock, Mail, User, Phone,
  Rocket, Users, IndianRupee
, Lightbulb, BookOpen,
  ArrowRight, ChevronDown, Shield, Target, Zap,
  CheckCircle2, GraduationCap, TrendingUp, Globe,
  Sparkles, Award, BarChart3, 
} from "lucide-react";

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = target / (duration / 16);
          let current = 0;
          const id = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(id); }
            else setCount(Math.floor(current));
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  return { count, ref };
}

/* ─── Section observer for scroll-triggered fade-in ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ═══════════════════════════════════════════════════════════
   FMCIII LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  /* Auth form state */
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  /* Floating background spheres parallax */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email: form.email, password: form.password });
      toast({ title: "Welcome back!" });
      if (result?.user?.roleId === ROLE_IDS.STARTUP_FOUNDER) setLocation("/profile");
      else setLocation("/");
    } catch {
      toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name: form.name,
        email: form.email,
        passwordHash: form.password,
        phone: form.phone || null,
        roleId: ROLE_IDS.INCUBATEE,
        status: "active",
      });
      toast({ title: "Account created!" });
      setLocation("/profile");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    }
  };

  /* Scroll-reveal sections */
  const statsReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const howReveal = useScrollReveal();
  const authReveal = useScrollReveal();

  /* Stat counters */
  const s1 = useCounter(70);
  const s2 = useCounter(100);
  const s3 = useCounter(20);
  const s4 = useCounter(100);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(160deg, #f0f6fc 0%, #e8f2fb 40%, #ddeeff 100%)" }}>
      {/* ── Animated background spheres ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #015185, transparent 70%)",
            top: `${-100 + mousePos.y * 30}px`,
            left: `${-100 + mousePos.x * 30}px`,
            transition: "top 0.8s ease-out, left 0.8s ease-out",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #0270b8, transparent 70%)",
            bottom: `${-80 + (1 - mousePos.y) * 25}px`,
            right: `${-80 + (1 - mousePos.x) * 25}px`,
            transition: "bottom 0.8s ease-out, right 0.8s ease-out",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #5a3fa8, transparent 70%)",
            top: "40%",
            left: `${50 + mousePos.x * 10}%`,
            transition: "left 1s ease-out",
          }}
        />
      </div>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(1,81,133,0.10)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
            >
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: "#015185" }}>
              FMCIII
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["About", "Programs", "Mentors", "Contact"].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "hsl(215 15% 50%)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#015185")}
                onMouseLeave={e => (e.currentTarget.style.color = "hsl(215,15%,50%)")}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#auth"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{ color: "#015185" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(1,81,133,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              onClick={() => setTab("login")}
            >
              Log In
            </a>
            <a
              href="#auth"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #015185, #0270b8)",
                boxShadow: "0 2px 10px rgba(1,81,133,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(1,81,133,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(1,81,133,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left text */}
          <div className="flex-1 text-center lg:text-left" style={{ animation: "fadeInUp 0.8s ease both" }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(1,81,133,0.08)",
                color: "#015185",
                border: "1px solid rgba(1,81,133,0.15)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              India's Premier Incubation Centre
            </div>

            <h1 className="font-display font-bold leading-[1.1] mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
              <span style={{ color: "#015185" }}>Empowering Startups</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #015185, #0270b8, #5a3fa8)" }}
              >
                from Idea to Scale.
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0" style={{ color: "hsl(215,15%,45%)" }}>
              FMCIII — Foundation for MAKEITHAPPEN Center for Invention, Innovation , Incubation provides world-class mentorship, funding access,
              co-working infrastructure, and an innovation ecosystem designed to accelerate your startup
              from a bold idea to market leadership.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#auth"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm relative overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #015185, #0270b8)",
                  boxShadow: "0 4px 20px rgba(1,81,133,0.3)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(1,81,133,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,81,133,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                onClick={() => setTab("signup")}
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-600" />
                <Rocket className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Apply Now</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  color: "#015185",
                  border: "1px solid rgba(1,81,133,0.25)",
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(1,81,133,0.06)"; e.currentTarget.style.borderColor = "rgba(1,81,133,0.40)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(1,81,133,0.25)"; }}
              >
                Learn More
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right hero card — floating glass panel */}
          <div
            className="relative w-full max-w-md"
            style={{ animation: "fadeInScale 0.9s ease 0.3s both" }}
          >
            <div
              className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
            />
            <div
              className="relative rounded-2xl p-8 border overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(1,81,133,0.12)",
                boxShadow: "0 20px 60px rgba(1,81,133,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, label: "Expert Mentorship", desc: "45+ mentors on board" },
                  { icon: IndianRupee, label: "Funding Support", desc: "₹50Cr+ facilitated" },
                  { icon: Users, label: "Vibrant Community", desc: "120+ startups" },
                  { icon: Globe, label: "Global Network", desc: "Pan-India reach" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-4 border transition-all duration-300"
                    style={{
                      background: "rgba(1,81,133,0.03)",
                      borderColor: "rgba(1,81,133,0.08)",
                      animation: `staggerFadeIn 0.5s ease both`,
                      animationDelay: `${0.5 + i * 0.1}s`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(1,81,133,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(1,81,133,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <item.icon className="h-6 w-6 mb-2" style={{ color: "#015185" }} />
                    <p className="text-sm font-bold" style={{ color: "#015185" }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(215,15%,50%)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS STRIP ═══════════════════ */}
      <section
        ref={statsReveal.ref}
        className="relative z-10 py-14 border-y"
        style={{
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(1,81,133,0.08)",
          opacity: statsReveal.visible ? 1 : 0,
          transform: statsReveal.visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { counter: s1, suffix: "+", label: "Startups Incubated", icon: Rocket },
            { counter: s2, suffix: "+", label: "Industry Mentors", icon: GraduationCap },
            { counter: s3, suffix: "Cr+", prefix: "₹", label: "Funding Facilitated", icon: TrendingUp },
            { counter: s4, suffix: "+", label: "Events & Workshops", icon: Award },
          ].map((stat, i) => (
            <div
              key={stat.label}
              ref={stat.counter.ref}
              className="text-center group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(1,81,133,0.08)" }}
              >
                <stat.icon className="h-5 w-5" style={{ color: "#015185" }} />
              </div>
              <p className="text-3xl md:text-4xl font-display font-bold" style={{ color: "#015185" }}>
                {stat.prefix || ""}{stat.counter.count}{stat.suffix}
              </p>
              <p className="text-sm mt-1" style={{ color: "hsl(215,15%,50%)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ ABOUT / FEATURES ═══════════════════ */}
      <section
        id="about"
        ref={featuresReveal.ref}
        className="relative z-10 py-20 md:py-28"
        style={{
          opacity: featuresReveal.visible ? 1 : 0,
          transform: featuresReveal.visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#0270b8" }}>
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: "#015185" }}>
              Everything Your Startup Needs
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "hsl(215,15%,50%)" }}>
              From ideation to scaling, FMCIII provides a comprehensive support ecosystem
              tailored for ambitious entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: "Mentorship Program",
                desc: "One-on-one guidance from 45+ seasoned industry mentors, serial entrepreneurs, and domain experts.",
                accent: "#015185",
              },
              {
                icon: IndianRupee
,
                title: "Funding Access",
                desc: "Connect with angel investors, VCs, and government grants. ₹20Cr+ in funding facilitated for our startups.",
                accent: "#0270b8",
              },
              {
                icon: Shield,
                title: "Co-Working Space",
                desc: "State-of-the-art labs, meeting rooms, hot desks, and high-speed internet in a vibrant innovation hub.",
                accent: "#00907a",
              },
              {
                icon: BookOpen,
                title: "Knowledge Resources",
                desc: "Curated library of guides, legal templates, pitch frameworks, and growth playbooks for every stage.",
                accent: "#5a3fa8",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="group rounded-2xl p-6 border cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(1,81,133,0.10)",
                  boxShadow: "0 4px 20px rgba(1,81,133,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  animationDelay: `${i * 0.12}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(1,81,133,0.14), inset 0 1px 0 rgba(255,255,255,0.95)`;
                  e.currentTarget.style.borderColor = `${card.accent}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,81,133,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";
                  e.currentTarget.style.borderColor = "rgba(1,81,133,0.10)";
                }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${card.accent}12`, border: `1px solid ${card.accent}20` }}
                >
                  <card.icon className="h-6 w-6" style={{ color: card.accent }} />
                </div>
                <h3 className="text-lg font-display font-bold mb-2" style={{ color: "#015185" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,15%,50%)" }}>{card.desc}</p>
                <div
                  className="mt-4 h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section
        id="programs"
        ref={howReveal.ref}
        className="relative z-10 py-20 md:py-28"
        style={{
          background: "rgba(1,81,133,0.025)",
          opacity: howReveal.visible ? 1 : 0,
          transform: howReveal.visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#0270b8" }}>
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: "#015185" }}>
              Your Journey with FMCIII
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "hsl(215,15%,50%)" }}>
              A streamlined 4-step path from application to market leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, #015185, #0270b8, #015185, transparent)", opacity: 0.2 }}
            />

            {[
              { step: "01", icon: Target, title: "Apply", desc: "Fill your startup profile and submit application with idea details." },
              { step: "02", icon: BarChart3, title: "Evaluate", desc: "Expert panels score and review your application through multiple criteria." },
              { step: "03", icon: Zap, title: "Incubate", desc: "Get accepted into the program — access mentors, funding, and infrastructure." },
              { step: "04", icon: TrendingUp, title: "Scale", desc: "Graduate with traction, investment, and a network to take on the market." },
            ].map((item, i) => (
              <div
                key={item.step}
                className="group flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="relative h-16 w-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(1,81,133,0.15)",
                    boxShadow: "0 8px 24px rgba(1,81,133,0.10)",
                  }}
                >
                  <item.icon className="h-7 w-7" style={{ color: "#015185" }} />
                  <span
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold mb-1.5" style={{ color: "#015185" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed max-w-[200px]" style={{ color: "hsl(215,15%,50%)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AUTH SECTION ═══════════════════ */}
      <section
        id="auth"
        ref={authReveal.ref}
        className="relative z-10 py-20 md:py-28"
        style={{
          opacity: authReveal.visible ? 1 : 0,
          transform: authReveal.visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left CTA text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: "#015185" }}>
              Ready to Build the<br />
              <span style={{ color: "#0270b8" }}>Next Big Thing?</span>
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0" style={{ color: "hsl(215,15%,50%)" }}>
              Join 70+ startups already thriving in the FMCIII ecosystem.
              Sign up today and take your first step toward market leadership.
            </p>
            <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
              {[
                "World-class mentorship from day one",
                "Access to investor network & government grants",
                "State-of-the-art co-working infrastructure",
                "Structured evaluation & growth tracking",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#015185" }} />
                  <p className="text-sm" style={{ color: "hsl(215,20%,35%)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right auth card */}
          <div className="w-full max-w-md">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-3xl opacity-20 blur-2xl"
                style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
              />
              <div
                className="relative rounded-2xl overflow-hidden border"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(1,81,133,0.12)",
                  boxShadow: "0 20px 60px rgba(1,81,133,0.13), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {/* Top gradient */}
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #015185, #0270b8, #015185)" }} />

                <div className="p-8 pt-6">
                  {/* Logo */}
                  <div className="flex flex-col items-center mb-6">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                      style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
                    >
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold" style={{ color: "#015185" }}>
                      FMCIII Portal
                    </h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex rounded-lg overflow-hidden mb-6 border" style={{ borderColor: "rgba(1,81,133,0.15)" }}>
                    {(["login", "signup"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="flex-1 py-2.5 text-sm font-semibold transition-all duration-200"
                        style={{
                          background: tab === t ? "linear-gradient(135deg, #015185, #0270b8)" : "rgba(255,255,255,0.6)",
                          color: tab === t ? "#fff" : "#015185",
                        }}
                      >
                        {t === "login" ? "Log In" : "Sign Up"}
                      </button>
                    ))}
                  </div>

                  {/* Login Form */}
                  {tab === "login" && (
                    <form
                      onSubmit={handleLogin}
                      className="space-y-4"
                      style={{ animation: "fadeInUp 0.4s ease both" }}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            type="email" required value={form.email} onChange={set("email")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="admin@fmciii.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            type="password" required value={form.password} onChange={set("password")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit" disabled={isLoggingIn}
                        className="w-full h-11 rounded-xl font-semibold text-white relative overflow-hidden group mt-1"
                        style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 3px 12px rgba(1,81,133,0.3)" }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-600" />
                        {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="relative z-10">Sign In</span>}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground/60 mt-3">
                        Demo: admin@fmciii.com / password123
                      </p>
                    </form>
                  )}

                  {/* Signup Form */}
                  {tab === "signup" && (
                    <form
                      onSubmit={handleSignup}
                      className="space-y-4"
                      style={{ animation: "fadeInUp 0.4s ease both" }}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            required value={form.name} onChange={set("name")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="Jane Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            type="email" required value={form.email} onChange={set("email")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="you@startup.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            type="password" required value={form.password} onChange={set("password")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">Phone (optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            type="tel" value={form.phone} onChange={set("phone")}
                            className="pl-9 h-11 rounded-xl border-border/70 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit" disabled={isRegistering}
                        className="w-full h-11 rounded-xl font-semibold text-white relative overflow-hidden group mt-1"
                        style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 3px 12px rgba(1,81,133,0.3)" }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-600" />
                        {isRegistering ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="relative z-10">Create Account</span>}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        id="contact"
        className="relative z-10 border-t py-14"
        style={{
          background: "rgba(1,81,133,0.03)",
          borderColor: "rgba(1,81,133,0.10)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg" style={{ color: "#015185" }}>FMCIII</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: "hsl(215,15%,50%)" }}>
                Foundation for MAKEITHAPPEN Center for Invention, Innovation , Incubation — Empowering founders with mentorship,
                funding, infrastructure, and a world-class innovation ecosystem.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-display font-bold mb-4" style={{ color: "#015185" }}>Quick Links</h4>
              <ul className="space-y-2">
                {["About Us", "Programs", "Mentors", "Apply Now"].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors duration-200" style={{ color: "hsl(215,15%,50%)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#015185")}
                      onMouseLeave={e => (e.currentTarget.style.color = "hsl(215,15%,50%)")}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-display font-bold mb-4" style={{ color: "#015185" }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: "hsl(215,15%,50%)" }}>
                <li>1st Floor, Innovation Hub</li>
                <li>MMCOE Campus, Pune 411052</li>
                <li>info@fmciii.com</li>
                <li>+91 20 1234 5678</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(1,81,133,0.10)" }}>
            <p className="text-xs" style={{ color: "hsl(215,15%,55%)" }}>
              © {new Date().getFullYear()} FMCIII — Foundation for MAKEITHAPPEN Center for Invention, Innovation , Incubation. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service"].map(link => (
                <a key={link} href="#" className="text-xs transition-colors duration-200"
                  style={{ color: "hsl(215,15%,55%)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#015185")}
                  onMouseLeave={e => (e.currentTarget.style.color = "hsl(215,15%,55%)")}
                >{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
