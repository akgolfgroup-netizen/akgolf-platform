"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SessionCard } from "./SessionCard";
import type { TrainingSession } from "./types";
import {
  DAY_NAMES,
  TIME_CONFIG,
  calculatePositionFromTime,
  calculateHeightFromDuration,
  groupSessionsByDay,
} from "./useDragAndDrop";

interface DayColumnProps {
  dayOfWeek: number;
  sessions: TrainingSession[];
  isOver?: boolean;
  onEdit?: (session: TrainingSession) => void;
  onDelete?: (sessionId: string) => void;
  onDuplicate?: (session: TrainingSession) => void;
}

function DayColumn({
  dayOfWeek,
  sessions,
  isOver,
  onEdit,
  onDelete,
  onDuplicate,
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

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-w-[180px] flex-1
        border-r border-gray-200 last:border-r-0
        transition-colors duration-300
        ${showDropIndicator ? "bg-blue-50/50" : ""}
      `}
    >
      {/* Dag-header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{dayName.short}</span>
          <span className="text-xs text-gray-500">
            {totalDuration > 0 ? `${totalDuration} min` : ""}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">{dayName.full}</div>
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
              />
            ))}
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
  showWeekend?: boolean;
}

export function WeekCalendar({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  showWeekend = true,
}: WeekCalendarProps) {
  const groupedSessions = useMemo(() => groupSessionsByDay(sessions), [sessions]);

  const days = showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

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
      <div className="flex-1 overflow-auto">
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
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
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
  showWeekend?: boolean;
}

export function WeekCalendarCompact({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  showWeekend = true,
}: WeekCalendarCompactProps) {
  const groupedSessions = useMemo(() => groupSessionsByDay(sessions), [sessions]);
  const days = showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {days.map((day) => {
        const daySessions = groupedSessions[day] || [];
        const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);

        return (
          <div
            key={day}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Dag-header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {DAY_NAMES[day].short}
                </span>
                {totalDuration > 0 && (
                  <span className="text-xs text-gray-500">{totalDuration} min</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {DAY_NAMES[day].full}
              </div>
            </div>

            {/* Sessions-liste */}
            <div className="p-2 space-y-2 min-h-[100px]">
              {daySessions.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Ingen økter
                </div>
              ) : (
                daySessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
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
