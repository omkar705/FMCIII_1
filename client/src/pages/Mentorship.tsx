import { Shell } from "@/components/layout/Shell";
import { useMentorAssignments, useCreateMentorAssignment } from "@/hooks/use-mentorship";
import { useAllStartups, useStartupByUserId } from "@/hooks/use-startups";
import { useUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Loader2, ArrowRight, UserCircle, Mail, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_IDS } from "@/lib/roles";

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6"];
const selectStyle = { background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", border: "1px solid rgba(1,81,133,0.12)" };

/** Founder-specific Mentorship View */
function FounderMentorshipView({ userId }: { userId: number }) {
  const { data: startup, isLoading: sLoading } = useStartupByUserId(userId);
  const { data: assignments, isLoading: mLoading } = useMentorAssignments();
  const { data: users } = useUsers();

  if (sLoading || mLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary h-7 w-7" />
      </div>
    );
  }

  // Find assignment for this founder's startup
  const assignment = startup
    ? assignments?.find((a) => a.startupId === startup.id && a.status === "active")
    : undefined;

  const mentor = assignment ? users?.find((u) => u.id === assignment.mentorId) : undefined;

  if (!assignment || !mentor) {
    return (
      <div className="py-16 text-center stagger-2">
        <div className="inline-flex flex-col items-center gap-3 p-10 rounded-2xl border-2 border-dashed border-border max-w-sm mx-auto">
          <Users className="h-12 w-12 text-muted-foreground/30 animate-float" />
          <div>
            <h3 className="text-base font-semibold text-foreground/70">No mentor assigned yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No mentors have been assigned yet. The admin will assign a mentor soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md stagger-2">
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase" style={{ color: "#015185" }}>
          <UserCircle className="h-4 w-4" />
          Your Assigned Mentor
        </div>

        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}
          >
            {mentor.name?.[0]?.toUpperCase() || "M"}
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{mentor.name}</p>
            <p className="text-sm text-muted-foreground">{mentor.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border/40 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" style={{ color: "#015185" }} />
            <span>{mentor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" style={{ color: "#015185" }} />
            <span>
              Assigned:{" "}
              {assignment.assignedDate
                ? new Date(assignment.assignedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Mentorship() {
  const { data: assignments, isLoading: mLoading } = useMentorAssignments();
  const { data: startups } = useAllStartups();
  const { data: users } = useUsers();
  const { mutateAsync: createAssignment, isPending } = useCreateMentorAssignment();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isFounder = user?.roleId === ROLE_IDS.STARTUP_FOUNDER;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createAssignment({
        startupId: Number(formData.get("startupId")),
        mentorId: Number(formData.get("mentorId")),
        status: "active"
      });
      setIsOpen(false);
      toast({ title: "Mentor assigned successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // ── Founder View ─────────────────────────────────────────
  if (isFounder && user) {
    return (
      <Shell>
        <div className="mb-7 stagger-1">
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Mentorship</h1>
          <p className="text-muted-foreground">View your assigned mentor details.</p>
        </div>
        <FounderMentorshipView userId={user.id} />
      </Shell>
    );
  }

  // ── Admin / Other Roles View ─────────────────────────────
  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Mentorship</h1>
          <p className="text-muted-foreground">Connect startups with expert guidance.</p>
        </div>

        {user?.roleId === ROLE_IDS.ADMIN && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
                style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
                <Plus className="mr-1.5 h-4 w-4 relative z-10" />
                <span className="relative z-10">Assign Mentor</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border/60"
              style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(1,81,133,0.12)" }}>
              <div className="h-1 rounded-t-md mb-3" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
              <DialogHeader>
                <DialogTitle className="font-display text-xl" style={{ color: "#015185" }}>New Pairing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {[
                  { label: "Startup", name: "startupId", data: startups },
                  { label: "Mentor (User)", name: "mentorId", data: users },
                ].map(({ label, name, data }) => (
                  <div key={name} className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">{label}</Label>
                    <Select name={name} required>
                      <SelectTrigger className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10">
                        <SelectValue placeholder={`Select ${label}`} />
                      </SelectTrigger>
                      <SelectContent style={selectStyle}>
                        {data?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()} className="focus:bg-primary/5">
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button type="submit" disabled={isPending} className="w-full h-10 rounded-lg font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
                  {isPending ? <Loader2 className="animate-spin" /> : "Create Assignment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {mLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-7 w-7" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments?.map((assignment, idx) => {
            const startup = startups?.find(s => s.id === assignment.startupId);
            const mentor  = users?.find(u => u.id === assignment.mentorId);
            const isActive = assignment.status === 'active';

            return (
              <div key={assignment.id} className={`glass-card p-5 ${STAGGER[idx % STAGGER.length]}`}>
                {/* Mentor ↔ Startup */}
                <div className="flex items-center gap-4">
                  {/* Mentor */}
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
                      {mentor?.name?.[0] || 'M'}
                    </div>
                    <span className="text-sm font-semibold text-center text-foreground leading-tight">
                      {mentor?.name || `Mentor #${assignment.mentorId}`}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "#015185" }}>Mentor</span>
                  </div>

                  {/* Connector */}
                  <div className="flex items-center gap-1 px-1">
                    <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
                    <ArrowRight className="h-4 w-4 text-primary/60 animate-float" style={{ animationDuration: "3s" }} />
                    <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, #0270b8, #00907a)" }} />
                  </div>

                  {/* Startup */}
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #00907a, #007a68)" }}>
                      {startup?.name?.[0] || 'S'}
                    </div>
                    <span className="text-sm font-semibold text-center text-foreground leading-tight">
                      {startup?.name || `Startup #${assignment.startupId}`}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "#00907a" }}>Startup</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Assigned: {new Date(assignment.assignedDate!).toLocaleDateString()}
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={isActive
                      ? { background: "rgba(1,81,133,0.08)", border: "1px solid rgba(1,81,133,0.15)", color: "#015185" }
                      : { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", color: "#6b7280" }
                    }
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>
            );
          })}

          {assignments?.length === 0 && (
            <div className="col-span-full py-14 text-center stagger-1">
              <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border">
                <Users className="h-10 w-10 text-muted-foreground/30 animate-float" />
                <div>
                  <h3 className="text-base font-medium text-foreground/60">No mentorship pairings yet</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Create the first mentor-startup pairing above.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}

