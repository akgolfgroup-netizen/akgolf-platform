import type { ApprovalRow, ApprovalType } from "./mock-data";

const TYPE_BADGE: Record<ApprovalType, { cls: string; label: string }> = {
  video: { cls: "bg-[rgba(175,82,222,0.18)] text-[#C896E8]", label: "VIDEO" },
  refund: { cls: "bg-[rgba(184,66,51,0.18)] text-[#F49283]", label: "REFUSJON" },
  contract: { cls: "bg-[rgba(0,122,255,0.18)] text-[#6FB3FF]", label: "KONTRAKT" },
  discount: { cls: "bg-[rgba(196,138,50,0.18)] text-[#E8B967]", label: "RABATT" },
  cancel: { cls: "bg-white/[0.06] text-white/70", label: "FRAFALL" },
};

const URGENCY_DOT: Record<string, string> = {
  high: "bg-[#F49283]",
  med: "bg-[#E8B967]",
  low: "bg-white/30",
};

interface Props {
  rows: ApprovalRow[];
}

export function ApprovalInbox({ rows }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
      <div className="flex items-center justify-between border-b border-[#1a4a3a] px-4 py-3.5">
        <h3 className="m-0 text-[13px] font-semibold text-white">Ventende</h3>
        <div className="font-mono text-[10px] tracking-[0.06em] text-accent">
          3 nye
        </div>
      </div>

      <div className="flex border-b border-[#1a4a3a] px-2">
        <div className="border-b-2 border-accent px-3 py-2.5 font-mono text-[11px] tracking-[0.06em] text-accent">
          VENTER 3
        </div>
        <div className="cursor-pointer border-b-2 border-transparent px-3 py-2.5 font-mono text-[11px] tracking-[0.06em] text-white/50 transition hover:text-white/70">
          GODKJENT 12
        </div>
        <div className="cursor-pointer border-b-2 border-transparent px-3 py-2.5 font-mono text-[11px] tracking-[0.06em] text-white/50 transition hover:text-white/70">
          AVSLÅTT 1
        </div>
      </div>

      {rows.map((row, idx) => {
        const isFaded = row.status !== "pending";
        const isActive = !!row.active;
        const isLast = idx === rows.length - 1;
        const badge = TYPE_BADGE[row.type];

        return (
          <div
            key={row.id}
            className={
              "relative flex cursor-pointer items-start gap-3 px-4 py-3.5 transition " +
              (isLast ? "" : "border-b border-[#1a4a3a] ") +
              (isActive
                ? "bg-accent/[0.06] "
                : "hover:bg-white/[0.025] ") +
              (isFaded ? "opacity-45" : "")
            }
          >
            {isActive ? (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
            ) : null}
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-ink"
              style={{ background: row.avatarColor }}
            >
              {row.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 truncate text-[13px] font-semibold text-white">
                {row.who}
              </div>
              <div className="mb-1.5 truncate text-[11px] text-white/60">
                {row.what}
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.06em]">
                {row.urgency ? (
                  <span
                    className={
                      "h-1.5 w-1.5 rounded-full " + URGENCY_DOT[row.urgency]
                    }
                  />
                ) : null}
                <span
                  className={
                    "rounded px-1.5 py-0.5 font-semibold uppercase " + badge.cls
                  }
                >
                  {badge.label}
                </span>
                <span className="text-white/50">{row.when}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
