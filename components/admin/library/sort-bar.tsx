import {
  Bookmark,
  Grid3x3,
  List,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";

type Pill = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

const PILLS: Pill[] = [
  {
    label: "NYESTE",
    icon: <Sparkles className="h-[13px] w-[13px]" strokeWidth={1.8} />,
    active: true,
  },
  {
    label: "MEST BRUKT",
    icon: <TrendingUp className="h-[13px] w-[13px]" strokeWidth={1.8} />,
  },
  {
    label: "MINE FAVORITTER",
    icon: <Bookmark className="h-[13px] w-[13px]" strokeWidth={1.8} />,
  },
  {
    label: "DELT MED ANDERS",
    icon: <User className="h-[13px] w-[13px]" strokeWidth={1.8} />,
  },
];

export function SortBar() {
  return (
    <div className="mb-[18px] flex flex-wrap items-center gap-2 rounded-xl border border-[#1a4a3a] bg-[#0D2E23] px-[18px] py-3">
      <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-[0.10em] text-white/50">
        Sortér
      </span>
      {PILLS.map((p) => (
        <button
          key={p.label}
          type="button"
          className={
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] " +
            (p.active
              ? "border-accent/30 bg-accent/15 text-accent"
              : "border-white/[0.06] bg-white/[0.04] text-white/70")
          }
        >
          {p.icon}
          {p.label}
        </button>
      ))}
      <button
        type="button"
        className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70"
      >
        <Grid3x3 className="h-[13px] w-[13px]" strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70"
      >
        <List className="h-[13px] w-[13px]" strokeWidth={1.8} />
      </button>
    </div>
  );
}
