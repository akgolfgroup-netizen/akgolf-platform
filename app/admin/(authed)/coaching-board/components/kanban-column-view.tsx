"use client";

import { Plus } from "lucide-react";
import { KanbanCardView } from "./kanban-card-view";
import type { ColumnTone, KanbanColumn } from "./kanban-types";

const COLUMN_PILL: Record<ColumnTone, { bg: string; color: string }> = {
  preparation: { bg: "rgba(0,122,255,0.12)", color: "#6FB3FF" },
  active: { bg: "rgba(209,248,67,0.18)", color: "#D1F843" },
  followup: { bg: "rgba(196,138,50,0.18)", color: "#E8B967" },
  done: { bg: "rgba(42,125,90,0.16)", color: "#6FCBA1" },
};

interface KanbanColumnViewProps {
  column: KanbanColumn;
  onAdd: () => void;
  onCardClick: (card: KanbanColumn["cards"][number]) => void;
}

/**
 * En av de fire kolonnene i Coaching Board (preparation / active / followup / done).
 * Mockup: `.kcol` med header (ikon + tittel + antall-pille + plussknapp) og kortliste.
 */
export function KanbanColumnView({
  column,
  onAdd,
  onCardClick,
}: KanbanColumnViewProps) {
  const Icon = column.icon;
  const pill = COLUMN_PILL[column.tone];

  return (
    <div
      className="p-3 min-h-[600px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div
          className="text-[12px] font-semibold flex items-center gap-1.5"
          style={{ color: "#FFFFFF" }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
          {column.title}
          <span
            className="px-1.5 rounded-[9px] font-mono"
            style={{
              fontSize: 9,
              padding: "1px 6px",
              background: pill.bg,
              color: pill.color,
              letterSpacing: "0.06em",
            }}
          >
            {column.count}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Legg til økt"
          style={{ color: "rgba(255,255,255,0.5)" }}
          className="hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {column.cards.length === 0 ? (
          <div
            className="text-[11px] text-center py-6"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Ingen økter
          </div>
        ) : (
          column.cards.map((card) => (
            <KanbanCardView
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))
        )}
      </div>
    </div>
  );
}
