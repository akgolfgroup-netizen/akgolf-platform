"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { SessionCard } from "./SessionCard";
import type { TrainingSession } from "./types";
import {
  DAY_NAMES,
  TIME_CONFIG,
  calculatePositionFromTime,
  groupSessionsByDay,
} from "./useDragAndDrop";

interface DayColumnProps {
  dayOfWeek: number;
  sessions: TrainingSession[];
  isOver?: boolean;
  isToday?: boolean;
  onEdit?: (session: TrainingSession) => void;
  onDelete?: (sessionId: string) => void;
  onDuplicate?: (session: TrainingSession) => void;
  onAddClick?: (dayOfWeek: number) => void;
  onSessionClick?: (session: TrainingSession) => void;
}

function DayColumn({
  dayOfWeek,
  sessions,
  isOver,
  isToday,
  onEdit,
  onDelete,
  onDuplicate,
  onAddClick,
  onSessionClick,
}: DayColumnProps) {
  const { setNodeRef, isOver: droppableIsOver } = useDroppable({
    id: `day-${dayOfWeek}`,
    data: {
      type: "day",
      dayOfWeek,
    },
  });

  const dayName = DAY_NAMES[dayOfWeek];
  const showDropIndicator = droppableIsOver || isOver;

  // Beregn total varighet for dagen
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Sjekk om det er i dag og beregn tidsindikatorposisjon
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const showTimeIndicator = isToday && currentHour >= TIME_CONFIG.startHour && currentHour <= TIME_CONFIG.endHour;
  const timeIndicatorPosition = showTimeIndicator 
    ? calculatePositionFromTime(currentHour, currentMinute)
    : null;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-w-[180px] flex-1
        border-r border-gray-200 last:border-r-0
        transition-colors duration-300
        ${showDropIndicator ? "bg-blue-50/50" : ""}
        ${isToday ? "bg-blue-50/30" : ""}
      `}
    >
      {/* Dag-header */}
      <div className={`p-3 border-b border-gray-200 sticky top-0 z-10 ${
        isToday ? "bg-blue-100/50" : "bg-gray-50/50"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isToday ? "text-blue-700" : "text-gray-900"}`}>
              {dayName.short}
            </span>
            {isToday && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500 text-white font-medium">
                I dag
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {totalDuration > 0 ? `${totalDuration} min` : ""}
          </span>
        </div>
        <div className={`text-xs mt-0.5 ${isToday ? "text-blue-600" : "text-gray-400"}`}>
          {dayName.full}
        </div>
      </div>

      {/* Tidslinje-grid */}
      <div className="relative flex-1 min-h-[600px]">
        {/* Time-linjer */}
        {Array.from(
          { length: TIME_CONFIG.endHour - TIME_CONFIG.startHour + 1 },
          (_, i) => TIME_CONFIG.startHour + i
        ).map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-b border-gray-100"
            style={{
              top: calculatePositionFromTime(hour, 0),
              height: TIME_CONFIG.hourHeight,
            }}
          >
            <span className="absolute -top-2 left-1 text-[10px] text-gray-300">
              {hour.toString().padStart(2, "0")}:00
            </span>
          </div>
        ))}

        {/* Rød tidsindikator-linje (kun i dag) */}
        {showTimeIndicator && timeIndicatorPosition !== null && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: timeIndicatorPosition }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
            <span className="absolute -top-4 right-0 text-[10px] font-medium text-red-500">
              {currentHour.toString().padStart(2, "0")}:{currentMinute.toString().padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Drop indicator */}
        {showDropIndicator && (
          <div className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-100/30 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-blue-600 font-medium">
              Slipp her
            </span>
          </div>
        )}

        {/* Sessions */}
        <SortableContext
          items={sessions.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative p-2 space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onClick={onSessionClick}
              />
            ))}
            
            {/* Legg til økt-knapp for tomme dager */}
            {sessions.length === 0 && !showDropIndicator && (
              <button
                onClick={() => onAddClick?.(dayOfWeek)}
                className="w-full py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
              >
                <span className="flex items-center justify-center gap-1 text-sm">
                  <Icon name="add" className="w-4 h-4" />
                  Legg til økt
                </span>
              </button>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

interface WeekCalendarProps {
  sessions: TrainingSession[];
  onEdit?: (session: TrainingSession) => void;
  onDelete?: (sessionId: string) => void;
  onDuplicate?: (session: TrainingSession) => void;
  onAddClick?: (dayOfWeek: number) => void;
  onSessionClick?: (session: TrainingSession) => void;
  showWeekend?: boolean;
  weekOffset?: number;
}

export function WeekCalendar({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  onAddClick,
  onSessionClick,
  showWeekend = true,
  weekOffset = 0,
}: WeekCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const groupedSessions = useMemo(() => groupSessionsByDay(sessions), [sessions]);

  const days = showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

  // Beregn hvilken dag som er i dag (hvis vi viser nåværende uke)
  const today = new Date().getDay();
  const todayDayOfWeek = today === 0 ? 7 : today;
  const isCurrentWeek = weekOffset === 0;

  // Scroll til 07:00 (toppen) ved første render
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [weekOffset]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tidslinje-header */}
      <div className="flex border-b border-gray-200">
        {/* Tid-kolonne header */}
        <div className="w-14 p-3 border-r border-gray-200 bg-gray-50/50 shrink-0">
          <span className="text-xs font-medium text-gray-500">Tid</span>
        </div>

        {/* Dag-kolonner headers */}
        {days.map((day) => (
          <div
            key={day}
            className="flex-1 min-w-[180px] p-3 border-r border-gray-200 last:border-r-0 bg-gray-50/50"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {DAY_NAMES[day].short}
              </span>
              <span className="text-xs text-gray-500">
                {groupedSessions[day]?.reduce((sum, s) => sum + s.duration, 0) || 0} min
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {DAY_NAMES[day].full}
            </div>
          </div>
        ))}
      </div>

      {/* Kalender-innhold med scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="flex min-h-[600px]">
          {/* Tid-kolonne */}
          <div className="w-14 border-r border-gray-200 bg-gray-50/30 shrink-0 sticky left-0 z-20">
            {Array.from(
              { length: TIME_CONFIG.endHour - TIME_CONFIG.startHour + 1 },
              (_, i) => TIME_CONFIG.startHour + i
            ).map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 text-xs text-gray-400"
                style={{
                  height: TIME_CONFIG.hourHeight,
                }}
              >
                <span className="-mt-2">{hour.toString().padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {/* Dag-kolonner */}
          {days.map((day) => (
            <DayColumn
              key={day}
              dayOfWeek={day}
              sessions={groupedSessions[day] || []}
              isToday={isCurrentWeek && day === todayDayOfWeek}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onAddClick={onAddClick}
              onSessionClick={onSessionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Kompakt versjon uten tidslinje (kun listevisning)
interface WeekCalendarCompactProps {
  sessions: TrainingSession[];
  onEdit?: (session: TrainingSession) => void;
  onDelete?: (sessionId: string) => void;
  onDuplicate?: (session: TrainingSession) => void;
  onAddClick?: (dayOfWeek: number) => void;
  onSessionClick?: (session: TrainingSession) => void;
  showWeekend?: boolean;
  weekOffset?: number;
}

export function WeekCalendarCompact({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  onAddClick,
  onSessionClick,
  showWeekend = true,
  weekOffset = 0,
}: WeekCalendarCompactProps) {
  const groupedSessions = useMemo(() => groupSessionsByDay(sessions), [sessions]);
  const days = showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

  // Beregn hvilken dag som er i dag
  const today = new Date().getDay();
  const todayDayOfWeek = today === 0 ? 7 : today;
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {days.map((day) => {
        const daySessions = groupedSessions[day] || [];
        const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
        const isToday = isCurrentWeek && day === todayDayOfWeek;

        return (
          <div
            key={day}
            className={`rounded-xl border shadow-sm overflow-hidden ${
              isToday ? "border-blue-300 bg-blue-50/30" : "border-gray-200 bg-white"
            }`}
          >
            {/* Dag-header */}
            <div className={`p-3 border-b ${
              isToday ? "border-blue-200 bg-blue-100/50" : "border-gray-200 bg-gray-50/50"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isToday ? "text-blue-700" : "text-gray-900"}`}>
                    {DAY_NAMES[day].short}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500 text-white font-medium">
                      I dag
                    </span>
                  )}
                </div>
                {totalDuration > 0 && (
                  <span className="text-xs text-gray-500">{totalDuration} min</span>
                )}
              </div>
              <div className={`text-xs mt-0.5 ${isToday ? "text-blue-600" : "text-gray-400"}`}>
                {DAY_NAMES[day].full}
              </div>
            </div>

            {/* Sessions-liste */}
            <div className="p-2 space-y-2 min-h-[100px]">
              {daySessions.length === 0 ? (
                <button
                  onClick={() => onAddClick?.(day)}
                  className="w-full py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
                >
                  <span className="flex items-center justify-center gap-1 text-sm">
                    <Icon name="add" className="w-4 h-4" />
                    Legg til økt
                  </span>
                </button>
              ) : (
                daySessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onClick={onSessionClick}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Drag overlay komponent for visuell feedback under dragging
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DragOverlayWrapperProps {
  activeSession: TrainingSession | null;
}

export function DragOverlayWrapper({ activeSession }: DragOverlayWrapperProps) {
  return (
    <DragOverlay
      dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: "0.5",
            },
          },
        }),
      }}
    >
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
          <SessionCard
            session={activeSession}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
}
