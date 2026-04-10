"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { GripVertical, Clock } from "lucide-react";

/* ── Types ── */

interface DragExercise {
  id: string;
  name: string;
  pyramid: string;
  durationMinutes: number;
}

interface TrainingDndProviderProps {
  children: React.ReactNode;
  onDropExercise?: (exerciseId: string, targetDayId: string) => void;
}

const PYRAMID_DOT: Record<string, string> = {
  FYS: "bg-[var(--pyramid-fys)]",
  TEK: "bg-[var(--pyramid-tek)]",
  SLAG: "bg-[var(--pyramid-slag)]",
  SPILL: "bg-[var(--pyramid-spill)]",
  TURN: "bg-[var(--pyramid-turn)]",
};

/* ── Provider ── */

export function TrainingDndProvider({ children, onDropExercise }: TrainingDndProviderProps) {
  const [activeItem, setActiveItem] = useState<DragExercise | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragExercise | undefined;
    if (data) {
      setActiveItem(data);
    }
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Could highlight drop target here
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (over && onDropExercise) {
        const exerciseId = active.id as string;
        const targetDayId = over.id as string;
        onDropExercise(exerciseId, targetDayId);
      }
    },
    [onDropExercise]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Drag overlay — ghost card following cursor */}
      <DragOverlay dropAnimation={null}>
        {activeItem && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#005840] shadow-[0_16px_48px_rgba(0,0,0,0.12)] w-[260px] opacity-90">
            <GripVertical className="w-3.5 h-3.5 text-[#7A8C85] flex-shrink-0" />
            <div className={`w-1.5 h-1.5 rounded-full ${PYRAMID_DOT[activeItem.pyramid] || "bg-[#7A8C85]"}`} />
            <span className="text-xs font-semibold text-[#0A1F18] truncate flex-1">
              {activeItem.name}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#7A8C85] tabular-nums">
              <Clock className="w-3 h-3" />
              {activeItem.durationMinutes} min
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

/* ── Draggable exercise wrapper (for sidebar items) ── */

export { useDraggable } from "@dnd-kit/core";
export { useDroppable } from "@dnd-kit/core";
export {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
