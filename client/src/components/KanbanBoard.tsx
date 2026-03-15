import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Application, Startup } from "@shared/schema";
import { Calendar, Target } from "lucide-react";
import { format } from "date-fns";

interface KanbanBoardProps {
  applications: Application[];
  startups: Startup[];
  onStatusChange: (id: number, status: string) => void;
}

const COLUMNS = ["Applied", "Interview", "Selected"];

// Helper to determine if a move is valid
function canTransition(from: string, to: string) {
  const currentIndex = COLUMNS.indexOf(from);
  const nextIndex = COLUMNS.indexOf(to);
  // Allow moving backward or exactly one step forward
  return nextIndex < currentIndex || nextIndex === currentIndex + 1;
}

function ApplicationCard({
  application,
  startup,
  isDragging,
}: {
  application: Application;
  startup?: Startup;
  isDragging: boolean;
}) {
  return (
    <div
      draggable={true}
      className={`mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? "opacity-30 scale-95" : "opacity-100"
      }`}
    >
      <Card className="p-4 bg-card/80 border-white/10 hover:border-primary/50 transition-colors shadow-lg shadow-black/20 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-foreground truncate pr-2">
            {startup?.name || "Unknown Startup"}
          </h4>
          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] px-1.5">
            {startup?.domain || "N/A"}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {startup?.description || "No description provided."}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {application.submittedAt ? format(new Date(application.submittedAt), "MMM d") : "N/A"}
          </span>

          {application.pitchDeckUrl && (
            <span className="flex items-center gap-1 text-primary/80">
              <Target className="h-3 w-3" /> Deck
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

export function KanbanBoard({ applications, startups, onStatusChange }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = React.useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id.toString());
    }
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    const app = applications.find((a) => a.id === draggedId);
    
    // Fix: Guard against null/undefined status
    if (app?.status && canTransition(app.status, column)) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    } else {
      if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDrop = (e: React.DragEvent, dstColumn: string) => {
    e.preventDefault();
    const app = applications.find((a) => a.id === draggedId);

    // Fix: Explicitly check that status is a string and not null
    if (draggedId && app?.status && canTransition(app.status, dstColumn) && app.status !== dstColumn) {
      onStatusChange(draggedId, dstColumn);
    }

    setDraggedId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px] select-none">
      {COLUMNS.map((column) => {
        const columnApps = applications.filter((app) => app.status === column);
        
        // Fix: Safer logic for the target column highlight
        const draggedApp = applications.find(a => a.id === draggedId);
        const isTargetValid = !!(draggedApp?.status && canTransition(draggedApp.status, column));

        return (
          <div
            key={column}
            onDragOver={(e) => handleDragOver(e, column)}
            onDragEnter={() => setDragOverColumn(column)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, column)}
            className={`flex flex-col bg-card/30 rounded-2xl border transition-all duration-300 p-4 relative min-h-[500px] ${
              dragOverColumn === column 
                ? isTargetValid ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-destructive/50 bg-destructive/5"
                : "border-white/80"
            }`}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  column === "Applied" ? "bg-blue-400" : column === "Interview" ? "bg-amber-400" : "bg-emerald-400"
                }`} />
                {column}
              </h3>
              <Badge variant="secondary" className="bg-white/5 text-muted-foreground">
                {columnApps.length}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto">
              {columnApps.length === 0 ? (
                <div className="h-24 flex flex-col items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-white/5 rounded-xl m-2 opacity-50">
                  <p>No applications</p>
                </div>
              ) : (
                columnApps.map((app) => (
                  <div key={app.id} onDragStart={(e) => handleDragStart(e, app.id)}>
                    <ApplicationCard
                      application={app}
                      startup={startups.find((s) => s.id === app.startupId)}
                      isDragging={draggedId === app.id}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}