import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { useStartup } from "@/hooks/use-startups";
import { startupMockProfiles } from "@/data/startups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  User,
  Users,
  IndianRupee,
  CalendarDays,
  MapPin,
  ExternalLink,
  Loader2,
} from "lucide-react";

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-white/10" />
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-white/10" />
          <div className="h-5 w-32 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default function StartupProfile() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = parseInt(params.id ?? "0", 10);

  const { data: startup, isLoading } = useStartup(id);

  if (isLoading) {
    return (
      <Shell adminOnly>
        <ProfileSkeleton />
      </Shell>
    );
  }

  if (!startup) {
    return (
      <Shell adminOnly>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
          <h2 className="text-3xl font-display font-bold text-white mb-2">Startup Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The startup you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/startups")} variant="outline" className="rounded-xl border-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Startups
          </Button>
        </div>
      </Shell>
    );
  }

  const mock = startupMockProfiles[startup.name];

  const statusColor: Record<string, string> = {
    Selected: "bg-green-500/20 text-green-400 border-green-500/30",
    Interview: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <Shell adminOnly>
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/startups")}
        className="mb-6 text-muted-foreground hover:text-white rounded-xl"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Startups
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/30 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-4xl text-primary">
            {startup.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-display font-bold text-white mb-1">{startup.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {startup.domain && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" /> {startup.domain}
              </span>
            )}
            {mock?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {mock.location}
              </span>
            )}
            {mock?.applicationStatus && (
              <Badge
                className={`border ${statusColor[mock.applicationStatus] ?? "bg-white/10 text-white border-white/20"}`}
              >
                {mock.applicationStatus}
              </Badge>
            )}
            {mock?.fundingStage && (
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                {mock.fundingStage}
              </Badge>
            )}
          </div>
        </div>
        {mock?.website && (
          <a
            href={mock.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> Visit Website
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Section */}
        <Card className="border-white/5 bg-card/60 backdrop-blur-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {startup.description || "No description provided."}
            </p>
            {mock && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{mock.teamSize}</p>
                  <p className="text-xs text-muted-foreground mt-1">Team Members</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{mock.fundingStage}</p>
                  <p className="text-xs text-muted-foreground mt-1">Funding Stage</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{mock.applicationStatus}</p>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-white">
                    {new Date(mock.createdDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Founded</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Details */}
        {mock && (
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Founder</p>
                  <p className="text-sm font-medium text-white">{mock.founder}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${mock.email}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {mock.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-white">{mock.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(mock.createdDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mentorship Info */}
        {mock && (
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Mentorship
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mock.mentors.length > 0 ? (
                mock.mentors.map((mentor) => (
                  <div key={mentor} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {mentor.split(" ").pop()?.charAt(0) ?? mentor.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-white">{mentor}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No mentors assigned yet.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Funding Info */}
        {mock && (
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" /> Funding Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm text-muted-foreground">Funding Stage</span>
                <Badge className="bg-primary/20 text-primary border border-primary/30">
                  {mock.fundingStage}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm text-muted-foreground">Application Status</span>
                <Badge
                  className={`border ${statusColor[mock.applicationStatus] ?? "bg-white/10 text-white border-white/20"}`}
                >
                  {mock.applicationStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scorecard Summary */}
        {mock && (
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Scorecard Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScoreBar label="Innovation" value={mock.scorecard.innovation} />
              <ScoreBar label="Market Potential" value={mock.scorecard.marketPotential} />
              <ScoreBar label="Team Strength" value={mock.scorecard.teamStrength} />
              <ScoreBar label="Execution" value={mock.scorecard.execution} />
              <div className="pt-2 border-t border-white/10">
                <ScoreBar label="Overall Score" value={mock.scorecard.overall} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Shell>
  );
}
