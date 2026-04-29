import type { HeatRow } from "./mock-data";

const LEVEL_BG: Record<number, string> = {
  0: "bg-white/[0.04]",
  1: "bg-accent/20",
  2: "bg-accent/40",
  3: "bg-accent/65",
  4: "bg-accent",
};

export function HeatmapCard({ rows }: { rows: HeatRow[] }) {
  return (
    <div className="mb-[18px] rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-[18px]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-white">
            Aktivitet · 4 uker
          </h3>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            Per coach
          </div>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-white/50">
          MINDRE
          <span className="inline-flex gap-[3px]">
            <span className="h-2.5 w-2.5 rounded-sm bg-white/[0.04]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-accent/20" />
            <span className="h-2.5 w-2.5 rounded-sm bg-accent/40" />
            <span className="h-2.5 w-2.5 rounded-sm bg-accent/65" />
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
          </span>
          MER
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.coach}
            className="grid items-center gap-[3px] py-1.5"
            style={{ gridTemplateColumns: "80px repeat(28, 1fr)" }}
          >
            <div className="text-[11px] text-white/70">{row.coach}</div>
            {row.cells.map((lvl, idx) => (
              <div
                key={`${row.coach}-${idx}`}
                className={
                  "rounded-[3px] " + (LEVEL_BG[lvl] ?? LEVEL_BG[0])
                }
                style={{ aspectRatio: "1 / 1" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
