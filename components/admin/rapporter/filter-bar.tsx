import {
  Calendar,
  Users,
  Layers,
  MapPin,
  Plus,
  type LucideIcon,
} from "lucide-react";

type FilterPill = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  trailing?: boolean;
};

const PILLS: FilterPill[] = [
  { label: "SISTE 12 MND", icon: Calendar, active: true },
  { label: "ALLE SPILLERE (42)", icon: Users },
  { label: "JUNIOR ELITE", icon: Layers },
  { label: "BOGSTAD + SKULLERUD", icon: MapPin },
  { label: "Legg til filter", icon: Plus, trailing: true },
];

export function FilterBar() {
  return (
    <div
      className="mb-[18px] flex flex-wrap items-center gap-2 rounded-[12px] px-[18px] py-3"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <span className="mr-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/55">
        Filter
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
