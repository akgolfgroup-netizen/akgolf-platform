import type {
  RosterMember,
  RosterBadge,
  ScheduleRow,
  ProgressRow,
  NoteEntry,
} from "./detail-mock-data";

const BADGE_LABELS: Record<RosterBadge, string> = {
  TOPP: "★ TOPP",
  PA_MAL: "PÅ MÅL",
  PUTT: "⚠ PUTT",
  FRAVAER: "⚠ FRAVÆR",
};

function badgeClass(b: RosterBadge) {
  if (b === "PUTT" || b === "FRAVAER") {
    return "bg-[rgba(196,138,50,0.22)] text-[#E8B967]";
  }
  return "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]";
}

export function RosterCard({
  members,
  total,
}: {
  members: RosterMember[];
  total: number;
}) {
  return (
    <section className="mb-[18px] rounded-[14px] border border-white/[0.06] bg-[#0D2E23] px-[22px] py-[18px]">
      <div className="mb-3.5 flex items-center justify-between text-[14px] font-bold tracking-tight text-white">
        <h3 className="m-0">Roster · {total} spillere</h3>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SE ALLE
        </span>
      </div>
      <div>
        {members.map((m, i) => (
          <div
            key={m.id}
            className={
              "grid items-center gap-2.5 py-2.5 text-[12.5px] " +
              (i > 0 ? "border-t border-white/[0.05]" : "")
            }
            style={{ gridTemplateColumns: "32px 1fr 80px 80px auto" }}
          >
            <div
              className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-[#0A1F18]"
              style={{ background: m.color }}
            >
              {m.initials}
            </div>
            <div className="font-semibold text-white">
              {m.name}
              <small className="mt-px block font-mono text-[9px] tracking-[0.06em] text-white/50">
                {m.meta}
              </small>
            </div>
            <div className="font-mono text-[12px] font-bold text-white">
              {m.hcp}
            </div>
            <div className="font-mono text-[11px] text-white/70">
              {m.attendance}
            </div>
            <span
              className={
                "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.10em] " +
                badgeClass(m.badge)
              }
            >
              {BADGE_LABELS[m.badge]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ScheduleCard({ rows }: { rows: ScheduleRow[] }) {
  return (
    <section className="mb-[18px] rounded-[14px] border border-white/[0.06] bg-[#0D2E23] px-[22px] py-[18px]">
      <div className="mb-3.5 flex items-center justify-between text-[14px] font-bold tracking-tight text-white">
        <h3 className="m-0">Plan · neste 4 uker</h3>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          {rows.length} ØKTER
        </span>
      </div>
      <div>
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={
              "grid items-center gap-2.5 py-2.5 text-[12.5px] " +
              (i > 0 ? "border-t border-white/[0.05]" : "")
            }
            style={{ gridTemplateColumns: "70px 1fr 100px" }}
          >
            <div className="font-mono text-[13px] font-bold leading-none text-white">
              {r.day}
              <small className="mt-1 block font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
                {r.weekday}
              </small>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">
                {r.title}
              </div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[0.04em] text-white/55">
                {r.meta}
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-white/65">
              {r.attendance}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProgressCard({ rows }: { rows: ProgressRow[] }) {
  return (
    <section className="mb-[18px] rounded-[14px] border border-white/[0.06] bg-[#0D2E23] px-[22px] py-[18px]">
      <h3 className="mb-3.5 text-[14px] font-bold tracking-tight text-white">
        Fremgang · uke 1 → 6
      </h3>
      <div className="mb-3.5 font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
        % AV ROSTER MED MÅLT FORBEDRING
      </div>
      <div className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid items-center gap-3.5 py-2"
            style={{ gridTemplateColumns: "100px 1fr 60px" }}
          >
            <div className="text-[12px] font-semibold text-white">
              {r.label}
            </div>
            <div className="h-2 overflow-hidden rounded-[4px] bg-white/[0.06]">
              <div
                className="h-full rounded-[4px] bg-accent"
                style={{ width: `${r.fillPercent}%` }}
              />
            </div>
            <div className="text-right font-mono text-[11px] font-bold text-white/70">
              {r.ratio}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NotesCard({
  notes,
  total,
  authorLabel,
}: {
  notes: NoteEntry[];
  total: number;
  authorLabel: string;
}) {
  return (
    <section className="mb-[18px] rounded-[14px] border border-white/[0.06] bg-[#0D2E23] px-[22px] py-[18px]">
      <div className="mb-3.5 flex items-center justify-between text-[14px] font-bold tracking-tight text-white">
        <h3 className="m-0">{authorLabel}</h3>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          {total} NOTATER
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {notes.map((n) => (
          <div
            key={n.id}
            className="rounded-[10px] bg-black/[0.18] px-3.5 py-3"
          >
            <div className="text-[12px] font-semibold text-white">{n.who}</div>
            <div className="mt-1 font-mono text-[9.5px] tracking-[0.06em] text-white/50">
              {n.when}
            </div>
            <div className="mt-1.5 text-[12.5px] leading-[1.55] text-white/[0.78]">
              {n.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
