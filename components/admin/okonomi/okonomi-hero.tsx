import { TrendingUp, Receipt } from "lucide-react";
import { HERO_STATS } from "./okonomi-data";

export function OkonomiHero() {
  return (
    <section
      className="mb-[22px] grid items-center gap-6 rounded-[18px] px-7 py-6"
      style={{
        gridTemplateColumns: "1.4fr 1fr",
        background: "#0D2E23",
        border: "1.5px solid rgba(209,248,67,0.30)",
      }}
    >
      <div>
        <div
          className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: "#D1F843" }}
        >
          {HERO_STATS.monthLabel}
        </div>
        <h2 className="font-inter-tight text-[30px] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
          {HERO_STATS.grossKr.toLocaleString("nb-NO")} kr{" "}
          <em className="not-italic" style={{ color: "#D1F843" }}>
            · +{HERO_STATS.yoyPct} % YoY.
          </em>
        </h2>
        <p className="mt-2.5 max-w-[55ch] text-[13.5px] leading-[1.6] text-white/70">
          {HERO_STATS.copy}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition hover:opacity-90"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.8} />
            Drill-down
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-[13px] text-white/90 transition hover:bg-white/[0.09]"
          >
            <Receipt className="h-3.5 w-3.5" strokeWidth={1.8} />
            Faktura-arkiv
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {HERO_STATS.cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[10px] border border-white/[0.06] px-3.5 py-3"
            style={{ background: "rgba(0,0,0,0.20)" }}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {card.label}
            </div>
            <div className="mt-1 font-mono text-[20px] font-extrabold leading-none text-white tabular-nums">
              {card.value}
              <small className="ml-1 text-[11px] font-medium text-white/50">
                {card.suffix}
              </small>
            </div>
            <div
              className="mt-1 font-mono text-[10px] font-bold"
              style={{ color: card.down ? "#F49283" : "#6FCBA1" }}
            >
              {card.delta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
