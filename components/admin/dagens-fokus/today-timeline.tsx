import type { TimelineEntry, TimelineStatus } from "./mock-data";
import { DAGENS_FOKUS_ICON_MAP } from "./icon-map";

const STATUS_PILL: Record<
  TimelineStatus,
  { label: string; className: string }
> = {
  done: {
    label: "Fullfort",
    className: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
  },
  live: {
    label: "Pagar na",
    className: "bg-[rgba(209,248,67,0.18)] text-accent",
  },
  next: {
    label: "Neste opp",
    className: "bg-white/10 text-white/85",
  },
  upcoming: {
    label: "Kommer",
    className: "bg-white/10 text-white/85",
  },
  warning: {
    label: "Ikke forberedt",
    className: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
  },
};

const ROW_CARD_STYLE: Record<TimelineStatus, string> = {
  done: "border-l-2 border-white/10 bg-white/[0.025]",
  live: "border-l-2 border-accent bg-[rgba(209,248,67,0.16)]",
  next: "border-l-2 border-[#6FCBA1] bg-[rgba(42,125,90,0.16)]",
  upcoming: "border-l-2 border-white/10 bg-white/[0.025]",
  warning: "border-l-2 border-white/10 bg-white/[0.025]",
};

function TimelineRow({ entry }: { entry: TimelineEntry }) {
  const Icon = DAGENS_FOKUS_ICON_MAP[entry.iconName];
  const pill = STATUS_PILL[entry.status];

  return (
    <div className="grid grid-cols-[64px_1fr] gap-3.5 border-b border-[#1a4a3a] py-3 last:border-b-0">
      <div className="pt-0.5 font-mono text-[11px] tracking-[0.05em] text-white/50">
        {entry.time}
        <span className="mt-0.5 block font-mono text-[9px] tracking-[0.1em] text-white/40">
          {entry.duration}
        </span>
      </div>
      <div
        className={`rounded-r-[10px] px-3.5 py-2.5 ${ROW_CARD_STYLE[entry.status]}`}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
            {entry.status === "live" ? (
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_0_4px_rgba(209,248,67,0.18)]" />
            ) : null}
            {entry.title}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
              entry.status === "warning"
                ? STATUS_PILL.warning.className
                : pill.className
            }`}
          >
            {entry.statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          {Icon ? <Icon className="h-3 w-3" strokeWidth={1.8} /> : null}
          <span>{entry.meta}</span>
        </div>
      </div>
    </div>
  );
}

export function TodayTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="font-inter-tight text-[14px] font-semibold tracking-tight text-white">
          Dagens timeline
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          06:00 — 20:00
        </span>
      </div>
      <div className="flex flex-col">
        {entries.map((entry) => (
          <TimelineRow key={entry.time + entry.title} entry={entry} />
        ))}
      </div>
    </div>
  );
}
