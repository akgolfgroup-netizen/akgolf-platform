import { cn } from "@/lib/portal/utils/cn";

export interface MiniStat {
  label: string;
  value: string;
  suffix?: string;
  /** 0–100 */
  pct: number;
  /** Bar-farge i hex eller token. Default lime accent. */
  barColor?: string;
}

export function MiniStats({ stats }: { stats: MiniStat[] }) {
  return (
    <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--akgolf-line-dark,#1a4a3a)] bg-[var(--akgolf-card-dark,#0D2E23)] p-4"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
            {s.label}
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-sans text-[26px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-white">
            {s.value}
            {s.suffix && (
              <span className="text-[12px] font-normal text-white/50">{s.suffix}</span>
            )}
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className={cn("block h-full rounded-full")}
              style={{
                width: `${Math.max(0, Math.min(100, s.pct))}%`,
                background: s.barColor ?? "var(--akgolf-accent, #D1F843)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
