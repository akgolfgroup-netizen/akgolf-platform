import { Activity, Circle, CircleDot, MoreHorizontal, Target, Zap } from "lucide-react";
import type { SessionRow as Row } from "@/app/admin/(authed)/okter/okter-data";

const ROW_GRID =
  "grid items-center gap-3.5 px-[18px] py-3.5 text-[13px] border-b border-white/5 hover:bg-white/[0.025] transition cursor-pointer";
const ROW_COLS = {
  gridTemplateColumns: "90px 32px 1.5fr 1fr 1fr 80px 110px 60px",
};

const ICON_STYLES = {
  iron: { bg: "rgba(0,122,255,0.18)", color: "#6FB3FF", Icon: Target },
  driver: { bg: "rgba(184,66,51,0.20)", color: "#F49283", Icon: Zap },
  short: { bg: "rgba(196,138,50,0.22)", color: "#E8B967", Icon: CircleDot },
  putt: { bg: "rgba(42,125,90,0.22)", color: "#6FCBA1", Icon: Circle },
  bunker: { bg: "rgba(175,82,222,0.22)", color: "#C896E8", Icon: Activity },
  tempo: { bg: "rgba(209,248,67,0.18)", color: "#D1F843", Icon: CircleDot },
} as const;

const STATUS_STYLES = {
  done: { bg: "rgba(42,125,90,0.20)", color: "#6FCBA1", label: "Fullført" },
  upcoming: { bg: "rgba(0,122,255,0.18)", color: "#6FB3FF", label: "Planlagt" },
  live: { bg: "rgba(209,248,67,0.18)", color: "#D1F843", label: "● Live" },
  cancelled: { bg: "rgba(184,66,51,0.18)", color: "#F49283", label: "Avlyst" },
} as const;

const TAG_STYLES = {
  default: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" },
  pr: { bg: "rgba(209,248,67,0.18)", color: "#D1F843" },
  video: { bg: "rgba(175,82,222,0.18)", color: "#C896E8" },
  tm: { bg: "rgba(0,122,255,0.18)", color: "#6FB3FF" },
} as const;

export function SessionTableRow({ row }: { row: Row }) {
  const ic = ICON_STYLES[row.iconKind];
  const Icon = ic.Icon;
  const st = STATUS_STYLES[row.status];

  return (
    <div className={ROW_GRID} style={ROW_COLS}>
      <div className="font-semibold text-white">
        {row.dayLabel}
        <small className="mt-0.5 block font-mono text-[10px] font-normal tracking-wider text-white/50">
          {row.timeLabel}
        </small>
      </div>

      <div>
        <div
          className="grid h-[30px] w-[30px] place-items-center rounded-lg"
          style={{ background: ic.bg, color: ic.color }}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#0A1F18]"
          style={{ background: row.player.color }}
        >
          {row.player.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-white">{row.player.name}</div>
          {row.player.sub && (
            <div className="mt-0.5 font-mono text-[10px] tracking-wider text-white/50">
              {row.player.sub}
            </div>
          )}
        </div>
      </div>

      <div>
        <strong className="text-white">{row.type.title}</strong>
        {row.type.sub && (
          <div className="mt-0.5 text-[11px] text-white/55">{row.type.sub}</div>
        )}
      </div>

      <div className="text-[12px] text-white/85">
        {row.coach.name}
        {row.coach.tag && (
          <small className="mt-0.5 block font-mono text-[10px] text-white/45">
            {row.coach.tag}
          </small>
        )}
      </div>

      <div className="font-mono text-[12px] text-white">{row.durationMin} m</div>

      <div className="flex flex-wrap gap-1">
        <span
          className="inline-block rounded px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: st.bg, color: st.color }}
        >
          {st.label}
        </span>
        {row.tags.map((t) => {
          const style = TAG_STYLES[t.variant];
          return (
            <span
              key={t.label}
              className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider"
              style={{ background: style.bg, color: style.color }}
            >
              {t.label}
            </span>
          );
        })}
      </div>

      <div className="text-right text-white/50">
        <MoreHorizontal className="ml-auto h-3.5 w-3.5" strokeWidth={1.8} />
      </div>
    </div>
  );
}

export function SessionTableHead() {
  return (
    <div
      className="grid items-center gap-3.5 border-b border-white/5 bg-white/[0.025] px-[18px] py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
      style={ROW_COLS}
    >
      <span>Dag</span>
      <span></span>
      <span>Spiller</span>
      <span>Type / fokus</span>
      <span>Coach</span>
      <span>Lengde</span>
      <span>Status / tags</span>
      <span className="text-right">Mer</span>
    </div>
  );
}
