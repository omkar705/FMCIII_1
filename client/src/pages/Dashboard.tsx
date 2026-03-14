import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { useStartups } from "@/hooks/use-startups";
import { useApplications } from "@/hooks/use-applications";
import { useFunding } from "@/hooks/use-funding";
import { Building2, Target, IndianRupee, TrendingUp, Loader2 } from "lucide-react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { data: startups, isLoading: sLoading } = useStartups();
  const { data: applications, isLoading: aLoading } = useApplications();
  const { data: funding, isLoading: fLoading } = useFunding();

  if (sLoading || aLoading || fLoading) {
    return (
      <Shell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  const totalFunding = funding?.reduce((sum, f) => sum + f.amount, 0) || 0;
  
  // Prepare funnel data
  const pipelineData = [
    { name: "Applied", value: applications?.filter(a => a.status === 'Applied').length || 0 },
    { name: "Interview", value: applications?.filter(a => a.status === 'Interview').length || 0 },
    { name: "Selected", value: applications?.filter(a => a.status === 'Selected').length || 0 },
  ];

  // Prepare funding history data (mocked grouping by month)
  const fundingData = funding?.map(f => ({
    name: new Date(f.fundingDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    amount: f.amount
  })) || [];

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Overview</h1>
          <p className="text-muted-foreground text-lg">Your incubator's key metrics at a glance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-white/5 shadow-xl shadow-black/20 hover-elevate">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Startups</p>
                <h3 className="text-3xl font-display font-bold text-white">{startups?.length || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card border-white/5 shadow-xl shadow-black/20 hover-elevate">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Applications</p>
                <h3 className="text-3xl font-display font-bold text-white">{applications?.length || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-white/5 shadow-xl shadow-black/20 hover-elevate">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Funding</p>
                <h3 className="text-3xl font-display font-bold text-white">
                  ₹{(totalFunding / 1000000).toFixed(1)}M
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-white/5 shadow-xl shadow-black/20 hover-elevate">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Success Rate</p>
                <h3 className="text-3xl font-display font-bold text-white">
                  {applications?.length ? Math.round((pipelineData[2].value / applications.length) * 100) : 0}%
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-white/5 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Application Pipeline</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} />
                  <YAxis stroke="#888" tick={{fill: '#888'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-white/5 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Funding Trajectory</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fundingData.length ? fundingData : [{name: 'Jan', amount: 100000}, {name: 'Feb', amount: 250000}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} />
                  <YAxis stroke="#888" tick={{fill: '#888'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
