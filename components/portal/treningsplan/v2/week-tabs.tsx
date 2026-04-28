import Link from "next/link";
import { cn } from "@/lib/portal/utils/cn";

export interface WeekTab {
  /** F.eks. "UKE 18" eller "UKE 18 · NÅ" */
  num: string;
  /** F.eks. "28 apr – 4 mai" */
  range: string;
  /** Prosent-ferdig 0–100 */
  pct: number;
  state: "done" | "active" | "future";
  /** Hvis du vil lenke direkte til dette uke-detalj */
  href?: string;
}

export function WeekTabs({ weeks }: { weeks: WeekTab[] }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1.5 overflow-x-auto pb-0.5">
      {weeks.map((w, i) => {
        const cls = cn(
          "min-w-[110px] rounded-[10px] border px-4 py-3 text-left transition",
          "border-[var(--akgolf-line-dark,#1a4a3a)] bg-[var(--akgolf-card-dark,#0D2E23)]",
          "hover:border-white/[0.18]",
          w.state === "active" &&
            "border-[var(--akgolf-accent,#D1F843)] bg-[rgba(209,248,67,0.08)]",
          w.state === "future" && "opacity-55",
        );
        const inner = (
          <>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">
              {w.num}
            </div>
            <div
              className={cn(
                "my-0.5 text-[13px] font-bold",
                w.state === "active"
                  ? "text-[var(--akgolf-accent,#D1F843)]"
                  : "text-white",
              )}
            >
              {w.range}
            </div>
            <div
              className={cn(
                "text-[16px] font-extrabold tracking-[-0.02em]",
                w.state === "active" && "text-[var(--akgolf-accent,#D1F843)]",
                w.state === "done" && "text-[#6FCBA1]",
                w.state === "future" && "text-white/70",
              )}
            >
              {w.pct}%
            </div>
          </>
        );
        if (w.href) {
          return (
            <Link key={i} href={w.href} className={cls}>
              {inner}
            </Link>
          );
        }
        return (
          <div key={i} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
