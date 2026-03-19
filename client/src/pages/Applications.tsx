import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useApplications, useFounderApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useAllStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FileText, Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ROLE_IDS } from "@/lib/roles";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; color: string; border: string }> = {
  Applied: {
    label: "Applied",
    icon: Clock,
    bg: "rgba(1,81,133,0.07)",
    color: "#015185",
    border: "rgba(1,81,133,0.18)",
  },
  "Under Review": {
    label: "Under Review",
    icon: AlertCircle,
    bg: "rgba(200,130,0,0.08)",
    color: "#b87a00",
    border: "rgba(200,130,0,0.20)",
  },
  Selected: {
    label: "Selected",
    icon: CheckCircle2,
    bg: "rgba(0,144,122,0.08)",
    color: "#00907a",
    border: "rgba(0,144,122,0.20)",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "rgba(180,30,50,0.07)",
    color: "#b41e32",
    border: "rgba(180,30,50,0.18)",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Applied"];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

/** Founder-specific Applications Dashboard */
function FounderApplicationsView({ email }: { email: string }) {
  const { data: applications, isLoading } = useFounderApplications(email);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary h-7 w-7" />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="py-16 text-center stagger-1">
        <div className="inline-flex flex-col items-center gap-4 p-10 rounded-2xl border-2 border-dashed border-border max-w-md mx-auto">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(1,81,133,0.07)" }}>
            <FileText className="h-7 w-7" style={{ color: "#015185" }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">No applications submitted yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Submit your first application to get started with the incubation program.
            </p>
          </div>
          <Link href="/applications/new">
            <Button
              className="h-9 px-4 rounded-lg font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-2">
      {applications.map((app, idx) => (
        <div
          key={app.id}
          className="glass-card p-5 flex flex-col gap-3"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(1,81,133,0.08)" }}
              >
                <FileText className="h-5 w-5" style={{ color: "#015185" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {app.name || `Application #${app.id}`}
                </p>
                {app.category && (
                  <p className="text-xs text-muted-foreground">{app.category}</p>
                )}
              </div>
            </div>
            <StatusBadge status={app.status ?? "Applied"} />
          </div>

          {/* Details */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Submitted:{" "}
              {app.submittedAt
                ? new Date(app.submittedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>

          {/* Description snippet */}
          {app.St_idea_desc && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {app.St_idea_desc}
            </p>
          )}

          {/* Bottom accent */}
          <div
            className="h-0.5 rounded-full mt-1"
            style={{
              background:
                app.status === "Selected"
                  ? "linear-gradient(90deg, #00907a, #007a68)"
                  : app.status === "Rejected"
                  ? "linear-gradient(90deg, #b41e32, #8b1526)"
                  : "linear-gradient(90deg, #015185, #0270b8)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Applications() {
  const { data: applications, isLoading: aLoading } = useApplications();
  const { data: startups, isLoading: sLoading } = useAllStartups();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { toast } = useToast();
  const { user } = useAuth();

  const isFounder = user?.roleId === ROLE_IDS.STARTUP_FOUNDER;

  if (aLoading || sLoading) {
    return (
      <Shell>
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary h-7 w-7" />
        </div>
      </Shell>
    );
  }

  // ── Founder View ────────────────────────────────────────────
  if (isFounder) {
    return (
      <Shell>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>
              My Applications
            </h1>
            <p className="text-muted-foreground">Track the status of your submitted applications.</p>
          </div>

          <Link href="/applications/new">
            <Button
              className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
              <Plus className="mr-1.5 h-4 w-4 relative z-10" />
              <span className="relative z-10">New Application</span>
            </Button>
          </Link>
        </div>

        <FounderApplicationsView email={user?.email ?? ""} />
      </Shell>
    );
  }

  // ── Admin / Mentor / Other Roles View ───────────────────────
  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Pipeline</h1>
          <p className="text-muted-foreground">Manage application lifecycle.</p>
        </div>
      </div>

      {user?.roleId === ROLE_IDS.ADMIN && (
        <div className="frost-panel p-5 stagger-2">
          <KanbanBoard
            applications={applications || []}
            startups={startups || []}
            onStatusChange={(id, status) => updateStatus({ id, status })}
          />
        </div>
      )}
    </Shell>
  );
}
