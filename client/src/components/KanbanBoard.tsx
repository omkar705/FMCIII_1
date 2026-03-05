import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Application, Startup } from "@shared/schema";
import { Building2, Calendar, Target } from "lucide-react";
import { format } from "date-fns";

interface KanbanBoardProps {
  applications: Application[];
  startups: Startup[];
  onStatusChange: (id: number, status: string) => void;
}

const COLUMNS = ["Applied", "Interview", "Selected"];

function SortableItem({ application, startup }: { application: Application; startup?: Startup }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing">
      <Card className="p-4 bg-card/80 border-white/10 hover:border-primary/50 transition-colors shadow-lg shadow-black/20 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-foreground truncate pr-2">
            {startup?.name || "Unknown Startup"}
          </h4>
          <Badge variant="outline" className="bg-white/5 border-white/10 text-xs">
            {startup?.domain || "N/A"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {startup?.description || "No description provided."}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {application.submittedAt ? format(new Date(application.submittedAt), "MMM d, yyyy") : "N/A"}
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

export function KanbanBoard({ applications, startups, onStatusChange }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const applicationId = active.id as number;
    const overId = over.id as string;
    
    // Check if dropping onto a column
    if (COLUMNS.includes(overId)) {
      const app = applications.find(a => a.id === applicationId);
      if (app && app.status !== overId) {
        onStatusChange(applicationId, overId);
      }
    } else {
      // Find what column the over item belongs to
      const overApp = applications.find(a => a.id === over.id);
      const activeApp = applications.find(a => a.id === applicationId);
      if (overApp && activeApp && overApp.status !== activeApp.status) {
        onStatusChange(applicationId, overApp.status!);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
        {COLUMNS.map((column) => {
          const columnApps = applications.filter((app) => app.status === column);
          return (
            <div key={column} className="flex flex-col bg-card/30 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${column === 'Applied' ? 'bg-blue-400' : column === 'Interview' ? 'bg-amber-400' : 'bg-primary'}`} />
                  {column}
                </h3>
                <Badge variant="secondary" className="bg-white/10">{columnApps.length}</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <SortableContext id={column} items={columnApps.map(a => a.id)} strategy={verticalListSortingStrategy}>
                  <div className="min-h-[100px] h-full" id={column}>
                    {columnApps.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-white/10 rounded-xl m-2">
                        Drop items here
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <SortableItem 
                          key={app.id} 
                          application={app} 
                          startup={startups.find(s => s.id === app.startupId)} 
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
