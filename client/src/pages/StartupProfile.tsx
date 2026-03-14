import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { startups } from "@/data/startups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  Users,
  MapPin,
  Edit,
  CalendarDays,
} from "lucide-react";

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-10 w-48 rounded-xl bg-white/10" />
      <div className="flex items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg bg-white/10" />
          <Skeleton className="h-5 w-32 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default function StartupProfile() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isLoading] = useState(false);

  const startup = startups.find((s) => s.id === params.id);

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
            {startup.logoInitial}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-display font-bold text-white mb-1">{startup.name}</h1>
          <p className="text-muted-foreground text-sm mb-2">{startup.tagline}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> {startup.domain}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {startup.location}
            </span>
            <Badge className="bg-primary/20 text-primary border border-primary/30">
              {startup.stage}
            </Badge>
            <Badge className="bg-white/10 text-white border border-white/20">
              <Users className="h-3 w-3 mr-1" /> {startup.teamSize} members
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-white/10 text-muted-foreground hover:text-white flex-shrink-0"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company">
        <TabsList className="mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
          <TabsTrigger value="company" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Company
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Team
          </TabsTrigger>
          <TabsTrigger value="captable" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Cap Table
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value="company">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About the Company */}
            <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> About the Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{startup.about}</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Domain</p>
                    <p className="text-sm font-medium text-white">{startup.domain}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Stage</p>
                    <p className="text-sm font-medium text-white">{startup.stage}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Founded</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {startup.foundedYear}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Team Size</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {startup.teamSize} members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {startup.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <a
                      href={`mailto:${startup.email}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {startup.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-white">{startup.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                    <p className="text-sm font-medium text-white">{startup.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab (placeholder) */}
        <TabsContent value="team">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-lg font-medium text-white mb-1">Team Members</h3>
              <p className="text-muted-foreground text-sm">Team information will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cap Table Tab (placeholder) */}
        <TabsContent value="captable">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-lg font-medium text-white mb-1">Cap Table</h3>
              <p className="text-muted-foreground text-sm">Equity and ownership details will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab (placeholder) */}
        <TabsContent value="documents">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-lg font-medium text-white mb-1">Documents</h3>
              <p className="text-muted-foreground text-sm">Startup documents and files will be listed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
