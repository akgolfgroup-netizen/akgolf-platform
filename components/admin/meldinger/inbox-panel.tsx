import type { InboxRow, InboxTag } from "./mock-data";

const TAG_STYLE: Record<InboxTag, string> = {
  URGENT: "bg-[#B84233]/20 text-[#F49283]",
  FORELDRE: "bg-[#AF52DE]/20 text-[#C99CF3]",
  SPILLER: "bg-accent/20 text-accent",
  SYSTEM: "bg-[#6BB1FF]/20 text-[#6BB1FF]",
};

interface InboxPanelProps {
  rows: InboxRow[];
}

export function InboxPanel({ rows }: InboxPanelProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23]">
      <div className="flex items-center justify-between border-b border-[#1a4a3a] px-[18px] py-[14px]">
        <h3 className="text-[14px] font-bold text-white">Innboks</h3>
        <span className="font-mono text-[10px] font-bold tracking-[0.10em] text-accent">
          7 ULESTE
        </span>
      </div>
      <div className="flex border-b border-[#1a4a3a] px-1.5">
        {[
          { label: "Alle", count: 28, active: true },
          { label: "Urgent", count: 3, active: false },
          { label: "Spillere", count: null, active: false },
          { label: "Foreldre", count: null, active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            className={
              "cursor-pointer border-b-2 px-3 py-[9px] font-mono text-[10px] font-bold uppercase tracking-[0.10em] " +
              (tab.active
                ? "border-accent text-accent"
                : "border-transparent text-white/50")
            }
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-1 text-white/50">({tab.count})</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {rows.map((row) => (
          <InboxRowItem key={row.id} row={row} />
        ))}
      </div>
    </section>
  );
}

function InboxRowItem({ row }: { row: InboxRow }) {
  const tagClass = TAG_STYLE[row.tag];
  return (
    <div
      className={
        "relative grid cursor-pointer grid-cols-[36px_1fr] items-start gap-2.5 border-b border-white/[0.04] px-[18px] py-[14px] hover:bg-white/[0.025] " +
        (row.active ? "bg-accent/[0.06]" : "")
      }
    >
      {row.active && (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      )}
      {row.unread && (
        <span className="absolute right-[14px] top-[18px] h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      <div
        className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold text-ink"
        style={{ background: row.avatarColor }}
      >
        {row.initials}
      </div>
      <div className="min-w-0">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span
            className={
              "truncate text-[13px] " +
              (row.unread ? "font-bold text-white" : "text-white/85")
            }
          >
            {row.name}
          </span>
          <span className="shrink-0 font-mono text-[9.5px] font-medium text-white/50">
            {row.when}
          </span>
        </div>
        <div className="line-clamp-2 text-[12px] leading-[1.4] text-white/60">
          {row.preview}
        </div>
        <span
          className={
            "mt-1 inline-block rounded-[3px] px-[5px] py-px font-mono text-[8.5px] font-bold uppercase tracking-[0.10em] " +
            tagClass
          }
        >
          {row.tag}
        </span>
      </div>
    </div>
  );
}
