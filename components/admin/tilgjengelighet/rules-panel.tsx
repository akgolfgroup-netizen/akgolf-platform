import {
  Calendar,
  Clock4,
  Coffee,
  Moon,
  Repeat,
  Sun,
  Timer,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { IconName, RuleItem } from "./mock-data";

const ICON_MAP: Record<IconName, LucideIcon> = {
  sun: Sun,
  calendar: Calendar,
  moon: Moon,
  coffee: Coffee,
  timer: Timer,
  "clock-4": Clock4,
  "x-circle": XCircle,
  repeat: Repeat,
};

interface Props {
  title: string;
  meta: string;
  rules: RuleItem[];
}

export function RulesPanel({ title, meta, rules }: Props) {
  return (
    <section className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4">
      <h3 className="flex items-center justify-between text-[13px] font-bold text-white">
        {title}
        <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-white/50">
          {meta}
        </span>
      </h3>

      <div className="mt-2 flex flex-col">
        {rules.map((r, idx) => {
          const Icon = ICON_MAP[r.icon];
          return (
            <div
              key={r.name}
              className={
                "grid grid-cols-[36px_1fr_auto] items-center gap-3 py-2.5 " +
                (idx === 0 ? "" : "border-t border-white/[0.04]")
              }
            >
              <div
                className={
                  "grid h-9 w-9 place-items-center rounded-lg " +
                  (r.muted
                    ? "bg-white/[0.05] text-white/60"
                    : "bg-[rgba(209,248,67,0.10)] text-accent")
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[12.5px] font-semibold text-white">{r.name}</div>
                <div className="mt-0.5 font-mono text-[10px] tracking-[0.04em] text-white/55">
                  {r.meta}
                </div>
              </div>
              <Toggle on={r.on} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={
        "relative inline-block h-5 w-9 rounded-full " +
        (on ? "bg-[rgba(209,248,67,0.30)]" : "bg-white/10")
      }
    >
      <span
        className={
          "absolute top-0.5 h-4 w-4 rounded-full transition " +
          (on ? "right-0.5 bg-accent" : "left-0.5 bg-white/60")
        }
      />
    </span>
  );
}
