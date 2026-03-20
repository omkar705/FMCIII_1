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

  // Founders do not have access to the dashboard — redirect them to their profile
  if (!authLoading && user?.roleId === ROLE_IDS.STARTUP_FOUNDER) {
    return <Redirect href="/profile" />;
  }

  if (sLoading || aLoading || fLoading) {
    return (
      <Shell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  const totalFunding = funding?.reduce((sum, f) => sum + f.amount, 0) || 0;

  const pipelineData = [
    { name: "Applied",   value: applications?.filter(a => a.status === 'Applied').length || 0 },
    { name: "Interview", value: applications?.filter(a => a.status === 'Interview').length || 0 },
    { name: "Selected",  value: applications?.filter(a => a.status === 'Selected').length || 0 },
  ];

  const statCards = [
    {
      label: "Total Startups",
      value: startups?.length || 0,
      icon: Building2,
      iconBg: "rgba(1,81,133,0.08)",
      iconColor: "#015185",
      topColor: "#015185",
      delay: "stagger-1",
    },
    {
      label: "Active Applications",
      value: applications?.length || 0,
      icon: Target,
      iconBg: "rgba(200,120,0,0.08)",
      iconColor: "#c87800",
      topColor: "#c87800",
      delay: "stagger-2",
    },
    {
      label: "Total Funding",
      value: `₹${(totalFunding / 1000000).toFixed(1)}M`,
      icon: IndianRupee,
      iconBg: "rgba(20,140,80,0.08)",
      iconColor: "#148c50",
      topColor: "#148c50",
      delay: "stagger-3",
    },
  ];

  return (
    <Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Overview</h1>
          <p className="text-muted-foreground">Your incubator's key metrics at a glance.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map(card => (
            <div key={card.label} className={`stat-card flex items-center gap-5 ${card.delay}`}>
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
                style={{ background: card.iconBg, border: `1px solid ${card.topColor}20` }}
              >
                <card.icon className="h-6 w-6" style={{ color: card.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-3xl font-display font-bold tracking-tight" style={{ color: "#015185" }}>
                  {card.value}
                </p>
              </div>
              {/* Right accent */}
              <div className="w-1 h-10 rounded-full self-center opacity-40" style={{ background: card.topColor }} />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-6 stagger-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(1,81,133,0.08)" }}>
              <TrendingUp className="h-4 w-4" style={{ color: "#015185" }} />
            </div>
            <h3 className="text-base font-display font-semibold" style={{ color: "#015185" }}>Application Pipeline</h3>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} barCategoryGap="40%">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0270b8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#015185" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(1,81,133,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 13 }}
                  axisLine={{ stroke: "rgba(1,81,133,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(1,81,133,0.04)" }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(1,81,133,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(1,81,133,0.12)",
                    color: "#015185",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 13
                  }}
                  labelStyle={{ color: "#015185", fontWeight: 600 }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Shell>
  );
}
