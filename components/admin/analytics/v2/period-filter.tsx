import { Calendar, Filter, Users, type LucideIcon } from "lucide-react";

type Pill = { label: string; icon: LucideIcon; active?: boolean; trailing?: boolean };

const PILLS: Pill[] = [
  { label: "7D", icon: Calendar },
  { label: "30D", icon: Calendar },
  { label: "90D", icon: Calendar, active: true },
  { label: "12 MND", icon: Calendar },
  { label: "EGENDEFINERT", icon: Calendar },
  { label: "Filter", icon: Filter, trailing: true },
  { label: "ALLE KOHORTER", icon: Users },
];

export function PeriodFilter() {
  return (
    <div
      className="mb-[18px] flex flex-wrap items-center gap-2 rounded-[12px] px-[18px] py-3"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-[0.10em] text-white/50">
        Periode
      </span>
      {PILLS.map((pill) => {
        const Icon = pill.icon;
        const activeStyle = pill.active
          ? { background: "rgba(209,248,67,0.16)", color: "#D1F843", borderColor: "rgba(209,248,67,0.30)" }
          : undefined;
        return (
          <button
            key={pill.label}
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-[7px] border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition hover:bg-white/[0.07] ${
              pill.trailing ? "ml-auto" : ""
            }`}
            style={activeStyle}
          >
            <Icon className="h-[13px] w-[13px]" strokeWidth={1.8} />
            <span>{pill.label}</span>
          </button>
        );
      })}
    </div>
  );
}
