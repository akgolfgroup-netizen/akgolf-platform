"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/portal/utils/cn";
import type { WidgetId } from "@/lib/portal/widgets/registry";
import { getWidgetDef, WIDGET_SIZE_CLASSES } from "@/lib/portal/widgets/registry";
import { WidgetBase } from "./widget-base";
import { WidgetRenderer } from "./widget-renderer";

// ── SortableWidget wrapper ───────────────────────────────

interface SortableWidgetProps {
  widgetId: WidgetId;
  isEditing: boolean;
  onRemove: (id: WidgetId) => void;
}

function SortableWidget({ widgetId, isEditing, onRemove }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId });

  const def = getWidgetDef(widgetId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        WIDGET_SIZE_CLASSES[def.size],
        isDragging && "opacity-50"
      )}
      {...attributes}
    >
      <div {...(isEditing ? listeners : {})}>
        <WidgetBase
          widgetId={widgetId}
          size={def.size}
          isEditing={isEditing}
          onRemove={onRemove}
        >
          <WidgetRenderer widgetId={widgetId} />
        </WidgetBase>
      </div>
    </div>
  );
}

// ── WidgetGrid ───────────────────────────────────────────

interface WidgetGridProps {
  initialWidgets: WidgetId[];
  onLayoutChange?: (widgets: WidgetId[]) => void;
  className?: string;
}

/**
 * WidgetGrid — drag-drop grid med dnd-kit.
 *
 * Støtter:
 * - Reordering via drag-drop
 * - Fjerning av widgets i redigeringsmodus
 * - Callback ved layout-endring
 */
export function WidgetGrid({
  initialWidgets,
  onLayoutChange,
  className,
}: WidgetGridProps) {
  const [widgets, setWidgets] = useState<WidgetId[]>(initialWidgets);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setWidgets((items) => {
          const oldIndex = items.indexOf(active.id as WidgetId);
          const newIndex = items.indexOf(over.id as WidgetId);
          const newItems = arrayMove(items, oldIndex, newIndex);
          onLayoutChange?.(newItems);
          return newItems;
        });
      }
    },
    [onLayoutChange]
  );

  const handleRemove = useCallback(
    (widgetId: WidgetId) => {
      setWidgets((items) => {
        const newItems = items.filter((id) => id !== widgetId);
        onLayoutChange?.(newItems);
        return newItems;
      });
    },
    [onLayoutChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Edit toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing((v) => !v)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            isEditing
              ? "bg-primary text-surface"
              : "bg-surface-container text-on-surface-variant/80 hover:bg-surface-variant hover:text-text"
          )}
        >
          {isEditing ? "Ferdig" : "Rediger layout"}
        </button>
      </div>

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
            {widgets.map((widgetId) => (
              <SortableWidget
                key={widgetId}
                widgetId={widgetId}
                isEditing={isEditing}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {widgets.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p className="text-sm">Ingen widgets aktive.</p>
          <p className="text-xs mt-1">Klikk &quot;Rediger layout&quot; for å legge til.</p>
        </div>
      )}
    </div>
  );
}
