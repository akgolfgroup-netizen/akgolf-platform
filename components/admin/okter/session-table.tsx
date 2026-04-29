import {
  Target,
  Zap,
  CircleDot,
  Circle,
  Activity,
  UserPlus,
  MoreHorizontal,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { DayGroup, SessionRow, SessionType, SessionTag } from "./mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  zap: Zap,
  "circle-dot": CircleDot,
  circle: Circle,
  activity: Activity,
  "user-plus": UserPlus,
};

const TYPE_BG: Record<SessionType, string> = {
  iron: "bg-[rgba(0,122,255,0.18)] text-[#6FB3FF]",
  driver: "bg-[rgba(184,66,51,0.20)] text-[#F49283]",
  short: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
  putt: "bg-[rgba(42,125,90,0.22)] text-[#6FCBA1]",
  bunker: "bg-[rgba(175,82,222,0.22)] text-[#C896E8]",
  tempo: "bg-accent/20 text-accent",
};

const STATUS_STYLES: Record<string, string> = {
  done: "bg-[rgba(42,125,90,0.20)] text-[#6FCBA1]",
  upcoming: "bg-[rgba(0,122,255,0.18)] text-[#6FB3FF]",
  live: "bg-accent/20 text-accent",
  cancelled: "bg-[rgba(184,66,51,0.18)] text-[#F49283]",
};

const TAG_STYLES: Record<SessionTag, string> = {
  PR: "bg-accent/20 text-accent font-semibold",
  VIDEO: "bg-[rgba(175,82,222,0.18)] text-[#C896E8]",
  TM: "bg-[rgba(0,122,255,0.18)] text-[#6FB3FF]",
  FULLFORT: "bg-white/[0.06] text-white/70",
};

const TAG_LABEL: Record<SessionTag, string> = {
  PR: "★ PR",
  VIDEO: "VIDEO",
  TM: "TM",
  FULLFORT: "FULLFØRT",
};

const GRID =
  "grid-cols-[90px_32px_1.5fr_1fr_1fr_80px_110px_60px]";

function Row({ session }: { session: SessionRow }) {
  const Icon = ICON_MAP[session.iconName] ?? Target;
  return (
    <div
      className={
        "grid " +
        GRID +
        " cursor-pointer items-center gap-3.5 border-b border-[#1a4a3a] px-[18px] py-3.5 text-[13px] transition hover:bg-white/[0.025]"
      }
    >
      <div className="text-[13px] font-semibold text-white">
        {session.date}
        <small className="mt-0.5 block font-mono text-[10px] font-normal tracking-[0.04em] text-white/50">
          {session.time}
        </small>
      </div>
      <div>
        <div
          className={
            "grid h-[30px] w-[30px] place-items-center rounded-lg " +
            TYPE_BG[session.type]
          }
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-ink"
          style={{ background: session.studentColor }}
        >
          {session.studentInitials}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-white">
            {session.studentName}
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.04em] text-white/50">
            {session.studentSub}
          </div>
        </div>
      </div>
      <div>
        <strong className="text-white">{session.title}</strong>
        <div className="mt-0.5 text-[11px] text-white/55">{session.detail}</div>
      </div>
      <div className="text-[12px] text-white/85">
        {session.coach}
        <small className="mt-0.5 block font-mono text-[10px] text-white/45">
          {session.location}
        </small>
      </div>
      <div className="font-mono text-[12px] tabular-nums text-white/85">
        {session.duration}
      </div>
      <div>
        {session.status && session.statusLabel ? (
          <span
            className={
              "inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] " +
              (STATUS_STYLES[session.status] ?? "")
            }
          >
            {session.statusLabel}
          </span>
        ) : session.tags ? (
          <div className="flex flex-wrap gap-1">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className={
                  "rounded font-mono text-[10px] tracking-[0.04em] " +
                  TAG_STYLES[tag] +
                  " px-1.5 py-0.5"
                }
              >
                {TAG_LABEL[tag]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="text-right">
        <MoreHorizontal
          className="ml-auto h-3.5 w-3.5 text-white/50"
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}

function DayDivider({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between bg-white/[0.03] px-[18px] py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
      <span>{label}</span>
      <span className="text-accent">{count} økter</span>
    </div>
  );
}

export function SessionTable({ groups }: { groups: DayGroup[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
      <div
        className={
          "grid " +
          GRID +
          " gap-3.5 border-b border-[#1a4a3a] bg-white/[0.025] px-[18px] py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
        }
      >
        <span>Dag</span>
        <span />
        <span>Spiller</span>
        <span>Type / fokus</span>
        <span>Coach · Lokasjon</span>
        <span>Lengde</span>
        <span>Status / tags</span>
        <span className="text-right">Mer</span>
      </div>

      {groups.map((g) => (
        <div key={g.label}>
          <DayDivider label={g.label} count={g.count} />
          {g.sessions.map((s) => (
            <Row key={s.id} session={s} />
          ))}
        </div>
      ))}

      <div className="border-t border-[#1a4a3a] bg-white/[0.02] px-[18px] py-3.5 text-center">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[12px] text-white/80 transition hover:bg-white/10"
        >
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} /> Vis 134 økter til
        </button>
      </div>
    </div>
  );
}
