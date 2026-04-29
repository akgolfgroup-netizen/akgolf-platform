import {
  HEATMAP_CELLS,
  HEATMAP_DAYS,
  HEATMAP_HOURS,
  HEAT_BG,
} from "./analytics-data";

export function HeatmapCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 flex items-center justify-between text-[15px] font-bold text-white">
        <span>Belegg-heatmap · time × dag</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SISTE 90D · % AV KAPASITET
        </span>
      </h3>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
      >
        <div />
        {HEATMAP_DAYS.map((d) => (
          <div
            key={d}
            className="px-0 py-1 text-center font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white/45"
          >
            {d}
          </div>
        ))}

        {HEATMAP_HOURS.map((hour, rowIdx) => (
          <div key={hour} className="contents">
            <div className="flex items-center justify-end pr-2 font-mono text-[10px] font-semibold text-white/50">
              {hour}
            </div>
            {HEATMAP_CELLS[rowIdx].map((level, colIdx) => (
              <div
                key={`${hour}-${colIdx}`}
                className="rounded-[4px]"
                style={{
                  aspectRatio: "1.5 / 1",
                  background: HEAT_BG[level],
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.10em] text-white/50">
        MIN
        {[0, 1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className="h-3 w-[18px] rounded-[4px]"
            style={{ background: HEAT_BG[l] }}
          />
        ))}
        MAX
      </div>
    </section>
  );
}
