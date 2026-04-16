"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core";
import type { TrainingSession } from "./types";

interface UseDragAndDropProps {
  onMoveSession: (sessionId: string, dayOfWeek: number, startH: number, startM: number) => Promise<void>;
}

interface UseDragAndDropReturn {
  sensors: ReturnType<typeof useSensors>;
  activeSession: TrainingSession | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  dropAnimation: DropAnimation;
}

export function useDragAndDrop({ onMoveSession }: UseDragAndDropProps): UseDragAndDropReturn {
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [overDay, setOverDay] = useState<number | null>(null);

  // Konfigurer sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum 8px bevegelse før drag starter
      },
    })
  );

  // Drop animation config
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Håndter start av dragging
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const session = active.data.current?.session as TrainingSession | undefined;
    
    if (session) {
      setActiveSession(session);
    }
  }, []);

  // Håndter dragging over et droppable område
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    
    if (over?.id) {
      const dayId = over.id.toString();
      if (dayId.startsWith("day-")) {
        const day = parseInt(dayId.replace("day-", ""), 10);
        setOverDay(day);
      }
    } else {
      setOverDay(null);
    }
  }, []);

  // Håndter slutt av dragging (drop)
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveSession(null);
      setOverDay(null);

      if (!over) return;

      const session = active.data.current?.session as TrainingSession | undefined;
      if (!session) return;

      const overId = over.id.toString();

      // Håndter drop på en dag
      if (overId.startsWith("day-")) {
        const targetDay = parseInt(overId.replace("day-", ""), 10);
        
        // Bare oppdater hvis dagen faktisk endret seg
        if (targetDay !== session.dayOfWeek) {
          try {
            await onMoveSession(
              session.id,
              targetDay,
              session.startH,
              session.startM
            );
          } catch (error) {
            console.error("Failed to move session:", error);
          }
        }
      }

      // Håndter drop på et tidsslot (for fremtidig tidsbasert flytting)
      if (overId.startsWith("timeslot-")) {
        const [, dayStr, hourStr, minuteStr] = overId.split("-");
        const targetDay = parseInt(dayStr, 10);
        const targetHour = parseInt(hourStr, 10);
        const targetMinute = parseInt(minuteStr, 10);

        try {
          await onMoveSession(
            session.id,
            targetDay,
            targetHour,
            targetMinute
          );
        } catch (error) {
          console.error("Failed to move session:", error);
        }
      }
    },
    [onMoveSession]
  );

  return {
    sensors,
    activeSession,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    dropAnimation,
  };
}

// Hook for å håndtere sorting innenfor en dag
interface UseSortableDayProps {
  dayOfWeek: number;
  sessions: TrainingSession[];
  onReorder: (dayOfWeek: number, sessionIds: string[]) => Promise<void>;
}

export function useSortableDay({ dayOfWeek, sessions, onReorder }: UseSortableDayProps) {
  const [items, setItems] = useState<string[]>(() => 
    sessions.map((s) => s.id)
  );

  // Oppdater items når sessions endres
  useState(() => {
    setItems(sessions.map((s) => s.id));
  });

  const handleReorder = useCallback(
    async (newOrder: string[]) => {
      setItems(newOrder);
      try {
        await onReorder(dayOfWeek, newOrder);
      } catch (error) {
        // Revert til original order ved feil
        setItems(sessions.map((s) => s.id));
        console.error("Failed to reorder sessions:", error);
      }
    },
    [dayOfWeek, sessions, onReorder]
  );

  return {
    items,
    handleReorder,
  };
}

// Utility for å gruppere sessions etter dag
export function groupSessionsByDay(sessions: TrainingSession[]): Record<number, TrainingSession[]> {
  const grouped: Record<number, TrainingSession[]> = {
    1: [], // Mandag
    2: [], // Tirsdag
    3: [], // Onsdag
    4: [], // Torsdag
    5: [], // Fredag
    6: [], // Lørdag
    7: [], // Søndag
  };

  for (const session of sessions) {
    const day = session.dayOfWeek;
    if (grouped[day]) {
      grouped[day].push(session);
    }
  }

  // Sorter hver dag etter starttid
  for (const day of Object.keys(grouped)) {
    grouped[parseInt(day)].sort((a, b) => {
      const timeA = a.startH * 60 + a.startM;
      const timeB = b.startH * 60 + b.startM;
      return timeA - timeB;
    });
  }

  return grouped;
}

// Dag-navn på norsk
export const DAY_NAMES: Record<number, { short: string; full: string }> = {
  1: { short: "Man", full: "Mandag" },
  2: { short: "Tir", full: "Tirsdag" },
  3: { short: "Ons", full: "Onsdag" },
  4: { short: "Tor", full: "Torsdag" },
  5: { short: "Fre", full: "Fredag" },
  6: { short: "Lør", full: "Lørdag" },
  7: { short: "Søn", full: "Søndag" },
};

// Tidslinje-konfigurasjon
export const TIME_CONFIG = {
  startHour: 7,
  endHour: 22,
  hourHeight: 60, // piksler per time
  snapMinutes: 15, // snap til nærmeste 15 minutter
};

// Hjelpefunksjon for å beregne posisjon fra tid
export function calculatePositionFromTime(hour: number, minute: number): number {
  const { startHour, hourHeight } = TIME_CONFIG;
  const totalMinutes = (hour - startHour) * 60 + minute;
  return (totalMinutes / 60) * hourHeight;
}

// Hjelpefunksjon for å beregne høyde fra varighet
export function calculateHeightFromDuration(durationMinutes: number): number {
  const { hourHeight } = TIME_CONFIG;
  return (durationMinutes / 60) * hourHeight;
}
