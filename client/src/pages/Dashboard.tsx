import { Shell } from "@/components/layout/Shell";
import { useStartups } from "@/hooks/use-startups";
import { useApplications } from "@/hooks/use-applications";
import { useFunding } from "@/hooks/use-funding";
import { useAuth } from "@/hooks/use-auth";
import { Building2, Target, IndianRupee, Loader2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Redirect } from "wouter";
import { ROLE_IDS } from "@/lib/roles";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: startups, isLoading: sLoading } = useStartups();
  const { data: applications, isLoading: aLoading } = useApplications();
  const { data: funding, isLoading: fLoading } = useFunding();

  if (!authLoading && user?.roleId === ROLE_IDS.STARTUP_FOUNDER) return <Redirect href="/profile" />;
  if (!authLoading && user?.roleId === ROLE_IDS.MENTOR)          return <Redirect href="/mentor-profile" />;
  if (!authLoading && user?.roleId === ROLE_IDS.INVESTOR)        return <Redirect href="/investor-profile" />;

  if (sLoading || aLoading || fLoading) {
    return (
      <Shell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#F5941E" }} />
        </div>
      </Shell>
    );
  }

  const totalFunding = funding?.reduce((sum, f) => sum + f.amount, 0) || 0;

  const pipelineData = [
    { name: "Applied",   value: applications?.filter(a => a.status === 'Applied').length   || 0 },
    { name: "Interview", value: applications?.filter(a => a.status === 'Interview').length || 0 },
    { name: "Selected",  value: applications?.filter(a => a.status === 'Selected').length  || 0 },
  ];

  /* ── Stat cards — Sky Blue, Orange, Gold ── */
  const statCards = [
    {
      label:     "Total Startups",
      value:     startups?.length || 0,
      icon:      Building2,
      iconBg:    "rgba(46,163,224,0.10)",
      iconColor: "#2EA3E0",
      border:    "rgba(46,163,224,0.18)",
      topBar:    "#2EA3E0",
      valueColor:"#2EA3E0",
      accentClass: "",
      delay:     "stagger-1",
    },
    {
      label:     "Active Applications",
      value:     applications?.length || 0,
      icon:      Target,
      iconBg:    "rgba(245,148,30,0.10)",
      iconColor: "#F5941E",
      border:    "rgba(245,148,30,0.18)",
      topBar:    "#F5941E",
      valueColor:"#F5941E",
      accentClass: "orange-accent",
      delay:     "stagger-2",
    },
    {
      label:     "Total Funding",
      value:     `₹${(totalFunding / 1000000).toFixed(1)}M`,
      icon:      IndianRupee,
      iconBg:    "rgba(247,183,49,0.10)",
      iconColor: "#F7B731",
      border:    "rgba(247,183,49,0.18)",
      topBar:    "#F7B731",
      valueColor:"#d4780e",
      accentClass: "gold-accent",
      delay:     "stagger-3",
    },
  ];

  return (
    <Shell>
      <div className="space-y-8">

        {/* Header — dual-tone title */}
        <div className="stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1">
            <span style={{ color: "#2EA3E0" }}>Over</span>
            <span style={{ color: "#F5941E" }}>view</span>
          </h1>
          <p className="text-muted-foreground">Your incubator's key metrics at a glance.</p>
          {/* Animated brand divider */}
          <div className="brand-divider mt-3 w-24" />
        </div>

        {/* Stat cards — Sky / Orange / Gold */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map(card => (
            <div
              key={card.label}
              className={`stat-card ${card.accentClass} ${card.delay} flex items-center gap-5`}
            >
              {/* Colored top bar via inline style override */}
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
                style={{ background: card.iconBg, border: `1px solid ${card.border}` }}
              >
                <card.icon className="h-6 w-6" style={{ color: card.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-display font-bold tracking-tight" style={{ color: card.valueColor }}>
                  {card.value}
                </p>
              </div>
              {/* Right accent bar */}
              <div
                className="w-1 h-10 rounded-full self-center"
                style={{ background: `linear-gradient(180deg, ${card.topBar}, transparent)`, opacity: 0.5 }}
              />
            </div>
          ))}
        </div>

        {/* Chart — Sky Blue bars with orange tooltip */}
        <div className="glass-card p-6 stagger-4">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,148,30,0.10)", border: "1px solid rgba(245,148,30,0.18)" }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: "#F5941E" }} />
            </div>
            <h3 className="text-base font-display font-semibold" style={{ color: "#4D4D4F" }}>
              Application Pipeline
            </h3>
            {/* Title underline — dual tone */}
            <div className="flex-1">
              <div
                className="h-[2px] rounded-full opacity-40"
                style={{ background: "linear-gradient(90deg, #2EA3E0, #F5941E)" }}
              />
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} barCategoryGap="40%">
                <defs>
                  {/* Sky→Orange gradient bars */}
                  <linearGradient id="barGradSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#2EA3E0" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#5dbdea" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barGradOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#F5941E" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#f8ad55" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barGradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#F7B731" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#f7b731" stopOpacity={0.65} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,163,224,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 13 }}
                  axisLine={{ stroke: "rgba(46,163,224,0.10)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(46,163,224,0.04)" }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(245,148,30,0.20)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(245,148,30,0.14)",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "#F5941E", fontWeight: 700 }}
                  itemStyle={{ color: "#2EA3E0" }}
                />
                {/* Three bars — each colored differently */}
                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                  fill="url(#barGradSky)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Shell>
  );
}
