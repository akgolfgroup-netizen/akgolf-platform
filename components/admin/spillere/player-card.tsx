import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  CircleDot,
  Clock,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  PlayerCard as PlayerCardData,
  PlayerCardFlag,
  PlayerCardFooterIcon,
  PlayerCardPillTone,
  PlayerCardStat,
} from "./types";

const FLAG_BORDER: Record<PlayerCardFlag, string> = {
  none: "",
  up: "border-l-[3px] border-l-[#6FCBA1] pl-[14px]",
  warn: "border-l-[3px] border-l-[#E8B967] pl-[14px]",
  alert: "border-l-[3px] border-l-[#F49283] pl-[14px]",
};

const PILL_TONE: Record<PlayerCardPillTone, string> = {
  default: "bg-white/[0.06] text-white/70",
  lime: "bg-[rgba(209,248,67,0.18)] text-[#D1F843]",
  green: "bg-[rgba(42,125,90,0.22)] text-[#6FCBA1]",
  amber: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
  violet: "bg-[rgba(175,82,222,0.22)] text-[#C896E8]",
  coral: "bg-[rgba(184,66,51,0.22)] text-[#F49283]",
};

const STAT_TONE: Record<NonNullable<PlayerCardStat["tone"]>, string> = {
  default: "text-white",
  up: "text-[#6FCBA1]",
  down: "text-[#F49283]",
  muted: "text-white/40",
};

const FOOTER_ICON: Record<PlayerCardFooterIcon, LucideIcon> = {
  message: MessageCircle,
  "calendar-plus": CalendarPlus,
  zap: Zap,
  "calendar-check": CalendarCheck,
  "circle-dot": CircleDot,
  "arrow-right": ArrowRight,
  target: Target,
  sparkles: Sparkles,
};

export function PlayerCard({ data }: { data: PlayerCardData }) {
  const FooterIcon = FOOTER_ICON[data.ctaIcon];

  return (
    <Link
      href={`/portal/admin/spillere/${data.id}`}
      className={
        "group relative flex flex-col rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] p-4 transition hover:-translate-y-px hover:border-[rgba(209,248,67,0.30)] " +
        FLAG_BORDER[data.flag]
      }
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-[#0A1F18]"
          style={{ background: data.avatarColor }}
        >
          {data.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold tracking-tight text-white">
            {data.fullName}
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-white/45">
            {data.metaLine}
          </div>
        </div>
        <span className="text-white/40">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {data.pills.map((pill) => (
          <span
            key={pill.label}
            className={
              "rounded-full px-1.5 py-[2px] text-[10px] font-medium " +
              PILL_TONE[pill.tone]
            }
          >
            {pill.label}
          </span>
        ))}
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2.5 border-t border-[#1a4a3a] pt-3.5">
        {data.stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
              {stat.label}
            </div>
            <div
              className={
                "mt-0.5 text-[16px] font-bold tracking-[-0.01em] tabular-nums " +
                STAT_TONE[stat.tone ?? "default"]
              }
            >
              {stat.value}
              {stat.small ? (
                <small className="ml-0.5 text-[10px] font-medium text-white/50">
                  {stat.small}
                </small>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 200 28"
        preserveAspectRatio="none"
        className="mt-3 h-7 w-full"
      >
        <polyline
          points={data.sparkPoints}
          fill="none"
          stroke={data.sparkColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={data.sparkDashed ? "2 3" : undefined}
        />
      </svg>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#1a4a3a] pt-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-white/55">
          <Clock className="h-2.5 w-2.5" /> {data.lastSeenLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D1F843]">
          {data.ctaLabel} <FooterIcon className="h-2.5 w-2.5" />
        </span>
      </div>
    </Link>
  );
}
