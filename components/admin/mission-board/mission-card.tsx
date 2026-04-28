import { MessageCircle, Users } from "lucide-react";
import { MissionRing } from "./mission-ring";
import type { MissionCard as MissionCardData } from "./types";

const DEADLINE_STYLES = {
  default: "bg-white/[0.025] text-white/60",
  near: "bg-[rgba(196,138,50,0.18)] text-[#E8B967]",
  passed: "bg-[rgba(184,66,51,0.16)] text-[#F49283]",
} as const;

export function MissionCard({ mission }: { mission: MissionCardData }) {
  const PrimaryActionIcon =
    mission.primaryAction.icon === "users" ? Users : MessageCircle;

  return (
    <article
      className={`relative rounded-2xl border bg-[#0D2E23] p-[18px] shadow-[0_1px_2px_rgba(10,31,24,0.03),0_6px_20px_rgba(255,255,255,0.04)] ${
        mission.glow
          ? "border-[rgba(209,248,67,0.30)] shadow-[0_0_0_3px_rgba(209,248,67,0.10),0_6px_20px_rgba(255,255,255,0.06)]"
          : "border-[#1a4a3a]"
      }`}
    >
      <header className="mb-3.5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-[#0A1F18]"
            style={{ background: mission.avatarColor }}
          >
            {mission.studentInitials}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">
              {mission.studentName}
            </div>
            <div className="mt-px font-mono text-[11px] tracking-[0.06em] text-white/45">
              {mission.studentSub}
            </div>
          </div>
        </div>
        <span
          className={`rounded-[5px] px-2 py-[3px] font-mono text-[10px] tracking-[0.06em] ${DEADLINE_STYLES[mission.deadline.variant]}`}
        >
          {mission.deadline.label}
        </span>
      </header>

      <h3 className="m-0 mt-2 text-[14px] font-semibold leading-[1.35] tracking-[-0.01em] text-white">
        {mission.goalTitle}
      </h3>
      <p className="mt-1 text-[12px] leading-[1.4] text-white/60">
        {mission.goalSubtitle}
      </p>

      <div className="my-4 flex items-center gap-4">
        <MissionRing
          percent={mission.ringPercent}
          color={mission.ringColor}
        />
        <div className="flex-1">
          {mission.metrics.map((metric, idx) => (
            <div key={metric.label} className={idx > 0 ? "mt-2" : ""}>
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-white/50">
                <span>{metric.label}</span>
                <span>{metric.delta}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-[2px] bg-white/[0.06]">
                <div
                  className="h-full rounded-[2px]"
                  style={{
                    width: `${metric.percent}%`,
                    background: metric.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="my-3 flex flex-col gap-1.5">
        {mission.milestones.map((ms, idx) => (
          <li
            key={`${mission.id}-ms-${idx}`}
            className={`flex items-center gap-2 py-[5px] text-[11px] text-white/70 ${
              idx < mission.milestones.length - 1
                ? "border-b border-[#1a4a3a]"
                : ""
            }`}
          >
            <span
              className={`grid h-3 w-3 shrink-0 place-items-center rounded-full border-[1.5px] ${
                ms.done
                  ? "border-accent bg-accent"
                  : "border-white/[0.22] bg-transparent"
              }`}
              aria-hidden
            >
              {ms.done ? (
                <span
                  className="h-[2px] w-1 -translate-y-px rotate-[-45deg] border-b-[1.5px] border-l-[1.5px] border-[#0A1F18]"
                  aria-hidden
                />
              ) : null}
            </span>
            <span
              className={
                ms.done ? "text-white/45 line-through" : ""
              }
            >
              {ms.label}
            </span>
            <span className="ml-auto font-mono text-[9px] text-white/50">
              {ms.when}
            </span>
          </li>
        ))}
      </ul>

      <footer className="mt-3 flex gap-1.5 border-t border-[#1a4a3a] pt-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-[#E6EAE8] transition hover:border-white/[0.16] hover:bg-white/[0.09]"
        >
          <PrimaryActionIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
          {mission.primaryAction.label}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-2.5 py-1.5 text-[11px] text-white/80 transition hover:bg-white/[0.05]"
        >
          Detalj →
        </button>
      </footer>
    </article>
  );
}
