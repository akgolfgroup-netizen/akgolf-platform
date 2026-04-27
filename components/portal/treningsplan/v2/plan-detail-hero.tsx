import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

export interface PlanDetailMeta {
  label: string;
  value: string;
  small?: boolean;
}

export function PlanDetailHero({
  breadcrumbHref,
  breadcrumbLabel,
  trail,
  title,
  lede,
  meta,
  progressPct,
}: {
  breadcrumbHref: string;
  breadcrumbLabel: string;
  trail: string;
  title: string;
  lede?: string;
  meta: PlanDetailMeta[];
  /** 0–100 */
  progressPct: number;
}) {
  // Stroke-dasharray = sirkelen (2πr ≈ 226 for r=36).
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.max(0, Math.min(100, progressPct)) / 100);

  return (
    <section
      className={cn(
        "relative mb-7 overflow-hidden rounded-[20px] border-[1.5px] px-8 py-7",
        "border-[rgba(209,248,67,0.30)]",
      )}
      style={{
        background:
          "radial-gradient(circle at 88% 18%, rgba(209,248,67,0.18), transparent 50%), linear-gradient(135deg, rgba(13,46,35,0.96), rgba(10,31,24,1))",
      }}
    >
      <div className="mb-3.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
        <Link
          href={breadcrumbHref}
          className="text-white/50 hover:text-[var(--akgolf-accent,#D1F843)]"
        >
          {breadcrumbLabel}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span>{trail}</span>
      </div>
      <h1 className="m-0 max-w-[24ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
        {title}
      </h1>
      {lede && (
        <p className="mb-5 mt-2.5 max-w-[56ch] text-[14px] text-white/70">{lede}</p>
      )}

      <div className="grid items-center gap-7 sm:grid-cols-[repeat(4,1fr)_auto]">
        {meta.map((m, i) => (
          <div key={i}>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {m.label}
            </div>
            <div
              className={cn(
                "mt-1 font-extrabold tracking-[-0.02em] tabular-nums text-white",
                m.small ? "text-[15px] leading-snug" : "text-[22px]",
              )}
            >
              {m.value}
            </div>
          </div>
        ))}

        <div className="relative h-[84px] w-[84px]">
          <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke="#D1F843"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[22px] font-extrabold tracking-[-0.02em] text-[var(--akgolf-accent,#D1F843)]">
            {progressPct}%
          </div>
        </div>
      </div>
    </section>
  );
}
