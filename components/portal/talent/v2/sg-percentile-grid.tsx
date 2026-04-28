"use client";

export interface SgPercentileItem {
  label: string;
  category: string;
  percentile: number;
  strokes: number;
  tone?: "good" | "warn" | "bad";
}

export function SgPercentileGrid({ items }: { items: SgPercentileItem[] }) {
  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          Strokes Gained · percentil mot peer (HCP 6–10)
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          <span className="text-white/30">|</span> = MEDIAN PEER
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {items.map((item) => (
          <PercCard key={item.category} item={item} />
        ))}
      </div>
    </>
  );
}

function PercCard({ item }: { item: SgPercentileItem }) {
  const fillTone =
    item.tone === "bad"
      ? "bg-[#F49283]"
      : item.tone === "warn"
        ? "bg-[#E8B967]"
        : "bg-[#D1F843]";

  const strokesIsNeg = item.strokes < 0;

  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4">
      <div className="flex items-start justify-between mb-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
          {item.category}
          <b className="font-display block text-[13px] font-bold text-white mt-0.5 not-italic tracking-[-0.005em]">
            {item.label}
          </b>
        </div>
        <div className="font-display text-[32px] font-extrabold leading-none tracking-[-0.03em] text-white tabular-nums">
          {item.percentile}
          <small className="text-sm font-medium text-white/50 ml-0.5">p</small>
        </div>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-inherit ${fillTone}`}
          style={{ width: `${Math.max(0, Math.min(100, item.percentile))}%` }}
        />
        <div className="absolute -top-0.5 bottom-[-2px] left-1/2 w-[1.5px] bg-white/50" />
      </div>
      <div className="mt-2.5 flex justify-between font-mono text-[10px] tracking-[0.06em] text-white/45">
        <span>STROKES</span>
        <b className={strokesIsNeg ? "text-[#F49283]" : "text-[#D1F843]"}>
          {item.strokes > 0 ? "+" : ""}
          {item.strokes.toFixed(1)}
        </b>
      </div>
    </div>
  );
}
