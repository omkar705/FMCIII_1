
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
      className={`mb-3 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
      data-application-id={application.id}
    >
      <Card className="p-4 bg-card/80 border-white/10 hover:border-primary/50 transition-colors shadow-lg shadow-black/20 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-foreground truncate pr-2">
            {startup?.name || "Unknown Startup"}
          </h4>

          <Badge
            variant="outline"
            className="bg-white/5 border-white/10 text-xs"
          >
            {startup?.domain || "N/A"}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {startup?.description || "No description provided."}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {application.submittedAt
              ? format(new Date(application.submittedAt), "MMM d, yyyy")
              : "N/A"}
          </span>

          {application.pitchDeckUrl && (
            <span className="flex items-center gap-1 text-primary">
              <Target className="h-3 w-3" /> Deck
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

function Column({
  column,
  applications,
  startups,
  isDragOver,
}: {
  column: string;
  applications: Application[];
  startups: Startup[];
  isDragOver: boolean;
}) {
  const columnApps = applications.filter((app) => app.status === column);

  return (
    <div
      data-column-id={column}
      className={`flex flex-col bg-card/30 rounded-2xl border transition-all p-4 relative overflow-hidden min-h-[500px] ${
        isDragOver ? "border-primary bg-primary/5" : "border-white/5"
      }`}
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />

      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              column === "Applied"
                ? "bg-blue-400"
                : column === "Interview"
                ? "bg-amber-400"
                : "bg-primary"
            }`}
          />
          {column}
        </h3>

        <Badge variant="secondary" className="bg-white/10">
          {columnApps.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="min-h-[100px]" data-column-content={column}>
          {columnApps.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-white/10 rounded-xl m-2">
              Drop items here
            </div>
          ) : (
            columnApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                startup={startups.find((s) => s.id === app.startupId)}
                isDragging={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Allowed transitions
 */
function canTransition(from: string, to: string) {
  const flow: Record<string, string[]> = {
    Applied: ["Interview"],
    Interview: ["Selected"],
    Selected: [],
  };

  return flow[from]?.includes(to);
}

export function KanbanBoard({
  applications,
  startups,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggedId, setDraggedId] = React.useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(
    null
  );

  const handleDragStart: React.DragEventHandler = (e) => {
    const card = (e.target as HTMLElement).closest("[data-application-id]");

    if (!card) return;

    const appId = parseInt(
      card.getAttribute("data-application-id") || "0",
      10
    );

    setDraggedId(appId);

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault();

    const column = (e.target as HTMLElement).closest("[data-column-id]");

    if (column && draggedId) {
      const dstColumn = column.getAttribute("data-column-id");
      const app = applications.find((a) => a.id === draggedId);

    if (!app?.status || !dstColumn) return;

      if (app && dstColumn && canTransition(app.status, dstColumn)) {
        setDragOverColumn(dstColumn);
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      } else {
        setDragOverColumn(null);
        if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
      }
    }
  };

  const handleDragLeave: React.DragEventHandler = () => {
    setDragOverColumn(null);
  };

  const handleDrop: React.DragEventHandler = (e) => {
    e.preventDefault();

    const column = (e.target as HTMLElement).closest("[data-column-id]");

    if (column && draggedId) {
      const dstColumn = column.getAttribute("data-column-id");
      const app = applications.find((a) => a.id === draggedId);
    if (!app?.status || !dstColumn) return;

if (canTransition(app.status, dstColumn)) {

      if (dstColumn && app && app.status !== dstColumn) {
        if (canTransition(app.status, dstColumn)) {
          onStatusChange(draggedId, dstColumn);
        }
      }
    }

    setDraggedId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd: React.DragEventHandler = () => {
    setDraggedId(null);
    setDragOverColumn(null);
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {COLUMNS.map((column) => (
        <Column
          key={column}
          column={column}
          applications={applications}
          startups={startups}
          isDragOver={dragOverColumn === column}
        />
      ))}
    </div>
  );
}
}