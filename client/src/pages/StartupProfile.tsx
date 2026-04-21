import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
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

  const [startup, setStartup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await fetch(`/api/startups/${params.id}`);
        const data = await res.json();
        setStartup(data);
      } catch (error) {
        console.error("Failed to fetch startup", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartup();
  }, [params.id]);

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
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Startup Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The startup you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/startups")}
            variant="outline"
            className="rounded-xl border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell adminOnly>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/startups")}
        className="mb-6 text-muted-foreground hover:text-[#2EA3E0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Startups
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/30 border border-white/10 flex items-center justify-center">
          <span className="font-bold text-4xl text-primary">
            {startup.name?.charAt(0)}
          </span>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white">{startup.name}</h1>
          <p className="text-muted-foreground text-sm">{startup.tagline}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> {startup.domain}
            </span>

            <Badge className="bg-primary/20 text-primary border border-primary/30">
              {startup.stage}
            </Badge>

            <Badge className="bg-white/10 text-[#2EA3E0] border border-white/20">
              <Users className="h-3 w-3 mr-1" />
              {startup.teammembers} members
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="captable">Cap Table</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{startup.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
