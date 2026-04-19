"use client";

import { useState, useCallback, useMemo } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight, Calendar, List, LayoutGrid, Clock } from "lucide-react";
import Link from "next/link";

// Komponenter fra treningsplan-mappen
import {
  WeekCalendar,
  WeekCalendarCompact,
  SessionCard,
  useDragAndDrop,
  DAY_NAMES,
  SidePanel,
  SessionDetailModal,
  NewSessionModal,
  type TrainingSession,
  type StandardTemplate,
} from "@/components/portal/treningsplan";

// Server actions
import {
  updateSessionTime,
  deleteSession,
} from "./actions";

// Konvertering fra V2Event til TrainingSession
interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  exercises: V2Exercise[];
  done: boolean;
}

interface V2Exercise {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  cs: string | null;
  m: string | null;
  pr: string | null;
  pFrom: string | null;
  pTo: string | null;
  slagFocus: string[];
  baller: number;
  bevegelser: number;
}

interface V2Template {
  id: string;
  title: string;
  dur: number;
  focus: string;
  exercises: V2Exercise[];
}

// Props
export interface TrainingPlannerV3Props {
  events: V2Event[];
  templates: V2Template[];
  planId: string | null;
  weekOffset: number;
  onSaveEvent?: (event: V2Event) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  onMoveEvent?: (eventId: string, date: string, startH: number, startM: number) => Promise<void>;
  onResizeEvent?: (eventId: string, durationMinutes: number) => Promise<void>;
  onSaveLiveSession?: (data: {
    durationMinutes: number;
    focusArea: string | null;
    exercises: V2Exercise[];
  }) => Promise<void>;
}

// Fargekoding for fokusområder
const FOCUS_COLORS: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
  FYS: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400", lightBg: "bg-blue-500" },
  TEK: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-400", lightBg: "bg-green-500" },
  SLAG: { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-400", lightBg: "bg-amber-500" },
  SPILL: { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-400", lightBg: "bg-orange-500" },
  TURN: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-400", lightBg: "bg-red-500" },
};

export function TrainingPlannerV3({
  events,
  templates,
  planId,
  weekOffset,
  onDeleteEvent,
  onMoveEvent,
}: TrainingPlannerV3Props) {
  const [view, setView] = useState<"calendar" | "compact" | "list">("calendar");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [selectedDayForNewSession, setSelectedDayForNewSession] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Konverter V2Events til TrainingSessions
  const sessions: TrainingSession[] = useMemo(() => {
    return events.map((event) => {
      const d = new Date(event.date);
      const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();

      return {
        id: event.id,
        title: event.title,
        duration: event.dur,
        focus: (event.focus as "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN") || "TEK",
        dayOfWeek,
        startH: event.startH,
        startM: event.startM,
        completed: event.done,
        exercises: event.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          pyramid: (ex.pyramid as "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN") || "TEK",
          area: ex.area,
          duration: 15,
          lPhase: ex.lPhase,
          cs: ex.cs,
          m: ex.m,
          pr: ex.pr,
        })),
      };
    });
  }, [events]);

  // Filtrerte sessions
  const filteredSessions = useMemo(() => {
    if (!selectedFilter) return sessions;
    return sessions.filter((s) => s.focus === selectedFilter);
  }, [sessions, selectedFilter]);

  // Drag & Drop håndtering
  const handleMoveSession = useCallback(
    async (sessionId: string, dayOfWeek: number, startH: number, startM: number) => {
      // Finn nåværende uke basert på weekOffset
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
      
      // Beregn måldato
      const targetDate = new Date(currentWeekStart);
      targetDate.setDate(currentWeekStart.getDate() + dayOfWeek - 1);
      
      const dateStr = targetDate.toISOString().split("T")[0];
      
      if (onMoveEvent) {
        await onMoveEvent(sessionId, dateStr, startH, startM);
      }
    },
    [onMoveEvent, weekOffset]
  );

  const {
    sensors,
    activeSession,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    dropAnimation,
  } = useDragAndDrop({ onMoveSession: handleMoveSession });

  // Håndter sletting
  const handleDelete = useCallback(
    async (sessionId: string) => {
      if (onDeleteEvent) {
        await onDeleteEvent(sessionId);
      }
    },
    [onDeleteEvent]
  );

  // Håndter duplisering
  const handleDuplicate = useCallback((_session: TrainingSession) => {
    // TODO: Implementer duplisering via server action
  }, []);

  // Håndter klikk på session (åpner detail modal)
  const handleSessionClick = useCallback((session: TrainingSession) => {
    setEditingSession(session);
    setDetailModalOpen(true);
  }, []);

  // Håndter redigering fra meny
  const handleEdit = useCallback((session: TrainingSession) => {
    setEditingSession(session);
    setDetailModalOpen(true);
  }, []);

  // Håndter lagring av session fra modal
  const handleSaveSession = useCallback(async (session: TrainingSession) => {
    setIsSaving(true);
    try {
      await updateSessionTime(
        session.id,
        session.startH,
        session.startM,
        session.duration
      );
      // Refresh page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to save session:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Håndter sletting fra modal
  const handleDeleteFromModal = useCallback(async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      // Refresh page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw error;
    }
  }, []);

  // Håndter klikk på "+ Legg til økt"
  const handleAddClick = useCallback((dayOfWeek: number) => {
    setSelectedDayForNewSession(dayOfWeek);
    setNewSessionModalOpen(true);
  }, []);

  // Håndter legg til fra template
  const handleAddFromTemplate = useCallback(async (template: StandardTemplate, dayOfWeek: number) => {
    // TODO: Implementere opprettelse av ny session fra template via server action
    alert(`Økt "${template.title}" vil bli lagt til på ${DAY_NAMES[dayOfWeek].full}. Denne funksjonen krever backend-implementasjon.`);
  }, []);

  // Konverter V2 templates til StandardTemplate format
  const standardTemplates: StandardTemplate[] = useMemo(() => {
    return templates.map((t) => ({
      id: t.id,
      title: t.title,
      duration: t.dur,
      focus: (t.focus as StandardTemplate["focus"]) || "TEK",
      exercises: t.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        pyramid: (e.pyramid as StandardTemplate["focus"]) || "TEK",
        area: e.area,
        lPhase: e.lPhase,
        cs: e.cs,
        m: e.m,
        pr: e.pr,
      })),
    }));
  }, [templates]);

  // Beregn uke-info
  const weekInfo = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formatDate = (d: Date) =>
      d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
    
    return {
      label: weekOffset === 0 ? "Denne uken" : weekOffset === 1 ? "Neste uke" : `Uke ${weekOffset > 0 ? "+" : ""}${weekOffset}`,
      range: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`,
    };
  }, [weekOffset]);

  // Total statistikk
  const stats = useMemo(() => {
    const total = filteredSessions.length;
    const completed = filteredSessions.filter((s) => s.completed).length;
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const byFocus = filteredSessions.reduce((acc, s) => {
      acc[s.focus] = (acc[s.focus] || 0) + s.duration;
      return acc;
    }, {} as Record<string, number>);

    return { total, completed, totalMinutes, byFocus };
  }, [filteredSessions]);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Hovedkalender-område */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-100">
              {weekInfo.label}
            </h2>
            <span className="text-sm text-slate-400">{weekInfo.range}</span>
            
            {/* Uke-navigasjon */}
            <div className="flex items-center gap-1">
              <Link
                href={`/portal/treningsplan?view=calendar&week=${weekOffset - 1}`}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/portal/treningsplan?view=calendar&week=0"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  weekOffset === 0
                    ? "bg-slate-700 text-slate-200"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                I dag
              </Link>
              <Link
                href={`/portal/treningsplan?view=calendar&week=${weekOffset + 1}`}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Visnings-kontroller */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setView("calendar")}
                className={`p-2 rounded-md transition-colors ${
                  view === "calendar" ? "bg-slate-700 text-slate-200" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Kalendervisning"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("compact")}
                className={`p-2 rounded-md transition-colors ${
                  view === "compact" ? "bg-slate-700 text-slate-200" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Kompakt visning"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-colors ${
                  view === "list" ? "bg-slate-700 text-slate-200" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Listevisning"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistikk-bar */}
        <div className="flex items-center gap-6 mb-4 px-4 py-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">{stats.totalMinutes}</span> min totalt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">{stats.completed}</span>/{stats.total} fullført
            </span>
          </div>
          {/* Fokus-fordeling */}
          <div className="flex items-center gap-2 ml-auto">
            {Object.entries(stats.byFocus).map(([focus, minutes]) => {
              const colors = FOCUS_COLORS[focus] || FOCUS_COLORS.TEK;
              return (
                <div
                  key={focus}
                  className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  {focus}: {minutes} min
                </div>
              );
            })}
          </div>
        </div>

        {/* Kalender-innhold */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-hidden">
            {view === "calendar" && (
              <WeekCalendar
                sessions={filteredSessions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onAddClick={handleAddClick}
                onSessionClick={handleSessionClick}
                weekOffset={weekOffset}
              />
            )}
            {view === "compact" && (
              <WeekCalendarCompact
                sessions={filteredSessions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onAddClick={handleAddClick}
                onSessionClick={handleSessionClick}
                weekOffset={weekOffset}
              />
            )}
            {view === "list" && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <p className="text-slate-400 text-center">Listevisning kommer snart</p>
              </div>
            )}
          </div>

          {/* Drag overlay */}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeSession ? (
              <div
                className="transform rotate-2 scale-105 cursor-grabbing"
                style={{
                  transform: CSS.Transform.toString({
                    x: 0,
                    y: 0,
                    scaleX: 1.05,
                    scaleY: 1.05,
                  }),
                }}
              >
                <SessionCard session={activeSession} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Sidepanel med øvelsesbank */}
      <SidePanel
        onAddSession={(template) => {
          // Når vi drar fra sidepanel, bruker vi dag 1 som default
          handleAddFromTemplate(template, 1);
        }}
        onFilterChange={setSelectedFilter}
        selectedFilter={selectedFilter}
      />

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={editingSession}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        onDelete={handleDeleteFromModal}
      />

      {/* New Session Modal */}
      <NewSessionModal
        isOpen={newSessionModalOpen}
        onClose={() => {
          setNewSessionModalOpen(false);
          setSelectedDayForNewSession(null);
        }}
        onAdd={handleAddFromTemplate}
        dayOfWeek={selectedDayForNewSession}
        standardTemplates={standardTemplates}
      />
    </div>
  );
}
