import { AlertTriangle, TrendingUp } from "lucide-react";
import { PlayerCard } from "./player-card";
import type { PlayerGroup as PlayerGroupData } from "./types";

const TONE_COLOR: Record<PlayerGroupData["tone"], string> = {
  alert: "#F49283",
  up: "#6FCBA1",
  default: "#FFFFFF",
};

export function PlayerGroup({ group }: { group: PlayerGroupData }) {
  const Icon =
    group.tone === "alert"
      ? AlertTriangle
      : group.tone === "up"
        ? TrendingUp
        : null;

  return (
    <section className="mt-[22px] first:mt-0">
      <div className="mb-2.5 flex items-center gap-2.5">
        <h3
          className="m-0 inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-tight"
          style={{ color: TONE_COLOR[group.tone] }}
        >
          {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
          {group.title}
        </h3>
        <span className="font-mono text-[11px] tracking-[0.06em] text-white/45">
          {group.count}
        </span>
        <div className="h-px flex-1 bg-[#1a4a3a]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
        {group.cards.map((card) => (
          <PlayerCard key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}
