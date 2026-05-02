"use client";

import { useRouter } from "next/navigation";
import { Circle, Play, CheckCircle2, Plus, Filter, LayoutList } from "lucide-react";
import { PageHead, Button, Pill } from "@/components/admin/coachhq-dark";
import type { MissionBoardData, MissionCard, MissionStatus } from "./actions";

interface Props {
  board: MissionBoardData;
}

const COLUMNS: { id: MissionStatus; title: string; icon: typeof Circle }[] = [
  { id: "todo", title: "TODO", icon: Circle },
  { id: "in_progress", title: "IN PROGRESS", icon: Play },
  { id: "done", title: "DONE", icon: CheckCircle2 },
];

const COLUMN_STYLES: Record<MissionStatus, { pillBg: string; pillColor: string; border: string }> = {
  todo: { pillBg: "rgba(111,179,255,0.14)", pillColor: "#6FB3FF", border: "rgba(111,179,255,0.15)" },
  in_progress: { pillBg: "rgba(209,248,67,0.14)", pillColor: "#D1F843", border: "rgba(209,248,67,0.15)" },
  done: { pillBg: "rgba(111,203,161,0.14)", pillColor: "#6FCBA1", border: "rgba(111,203,161,0.15)" },
};

export function MissionBoardClientV2({ board }: Props) {
  const router = useRouter();
  const total = board.counts.todo + board.counts.in_progress + board.counts.done;

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="Mission Board · Kanban"
        title="Hva jobber vi mot?"
        description={`${total} aktive oppdrag fordelt på ${COLUMNS.length} faser. Klikk et kort for detaljer.`}
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/elever")}
            >
              Alle oppdrag
            </Button>
            <Button
              variant="ghost"
              icon={<LayoutList className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/elever/oversikt")}
            >
              Tabell-visning
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/bookinger/ny")}
            >
              Nytt oppdrag
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            col={col}
            cards={board.columns[col.id]}
            count={board.counts[col.id]}
            onCardClick={(card) => router.push(card.href)}
            onAdd={() => router.push("/admin/bookinger/ny")}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Column ─── */

function KanbanColumn({
  col,
  cards,
  count,
  onCardClick,
  onAdd,
}: {
  col: (typeof COLUMNS)[number];
  cards: MissionCard[];
  count: number;
  onCardClick: (card: MissionCard) => void;
  onAdd: () => void;
}) {
  const style = COLUMN_STYLES[col.id];
  const Icon = col.icon;

  return (
    <div
      className="p-3 min-h-[500px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${style.border}`,
        borderRadius: 14,
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[12px] font-semibold flex items-center gap-1.5 text-white">
          <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
          {col.title}
          <span
            className="px-1.5 rounded-[9px] font-mono"
            style={{
              fontSize: 9,
              padding: "1px 6px",
              background: style.pillBg,
              color: style.pillColor,
              letterSpacing: "0.06em",
            }}
          >
            {count}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Legg til"
          className="text-white/40 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {cards.length === 0 ? (
          <div
            className="text-[11px] text-center py-6 font-mono uppercase tracking-[0.08em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Ingen oppdrag
          </div>
        ) : (
          cards.map((card) => (
            <MissionCardView key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Card ─── */

function MissionCardView({ card, onClick }: { card: MissionCard; onClick: () => void }) {
  const priorityColor =
    card.priority === "urgent"
      ? "#B84233"
      : card.priority === "high"
        ? "#E8B967"
        : card.priority === "medium"
          ? "#6FB3FF"
          : "rgba(255,255,255,0.35)";

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 cursor-pointer transition-all text-left w-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${priorityColor}`,
        borderRadius: 10,
        boxShadow: "0 1px 2px rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-[26px] h-[26px] rounded-full grid place-items-center text-[10px] font-bold"
            style={{ background: card.avatarColor, color: "#0A1F18" }}
          >
            {card.initials}
          </div>
          <span className="text-[12px] font-semibold text-white">{card.playerName}</span>
        </div>
        <span
          className="text-[10px] font-mono tracking-[0.06em]"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          {card.dueText}
        </span>
      </div>

      <div className="text-[12px] text-white/70 leading-snug">{card.title}</div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {card.tags.map((tag) => (
            <Pill key={tag} tone="default">
              {tag}
            </Pill>
          ))}
        </div>
        {card.assignee && (
          <span
            className="text-[10px] font-mono tracking-[0.06em]"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            {card.assignee}
          </span>
        )}
      </div>
    </button>
  );
}
