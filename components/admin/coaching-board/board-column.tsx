import {
  CheckCircle2,
  ClipboardList,
  Edit3,
  Plus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BoardCard } from "./board-card";
import type { KColumnData } from "./types";

const COLUMN_ICONS: Record<KColumnData["icon"], LucideIcon> = {
  "clipboard-list": ClipboardList,
  zap: Zap,
  "edit-3": Edit3,
  "check-circle-2": CheckCircle2,
};

const PILL_STYLES: Record<KColumnData["key"], string> = {
  preparation: "bg-[rgba(0,122,255,0.12)] text-[#6FB3FF]",
  active: "bg-[rgba(209,248,67,0.18)] text-accent",
  followup: "bg-[rgba(196,138,50,0.18)] text-[#E8B967]",
  done: "bg-[rgba(42,125,90,0.16)] text-[#6FCBA1]",
};

export function BoardColumn({ column }: { column: KColumnData }) {
  const Icon = COLUMN_ICONS[column.icon];

  return (
    <section className="min-h-[600px] rounded-[14px] border border-[#1a4a3a] bg-white/[0.025] p-3">
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
          {column.title}
          <span
            className={`rounded-[9px] px-1.5 py-px font-mono text-[9px] tracking-[0.06em] ${PILL_STYLES[column.key]}`}
          >
            {column.count}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Legg til i ${column.title}`}
          className="text-white/50 transition hover:text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </header>

      <div className="flex flex-col gap-2.5">
        {column.cards.map((card) => (
          <BoardCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
