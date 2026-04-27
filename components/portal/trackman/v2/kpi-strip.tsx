"use client";

export interface KpiTile {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
}

export function KpiStrip({ tiles }: { tiles: KpiTile[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-xl border border-white/[0.06] bg-[#121614] px-4 py-3.5"
        >
          <div className="font-mono text-[9px] text-white/55 tracking-[0.14em] uppercase">
            {tile.label}
          </div>
          <div className="font-mono text-[22px] font-bold text-white tracking-[-0.01em] mt-0.5 tabular-nums">
            {tile.value}
          </div>
          {tile.delta && (
            <div
              className={[
                "font-mono text-[11px] mt-0.5",
                tile.deltaTone === "negative"
                  ? "text-[#E85D4E]"
                  : tile.deltaTone === "positive"
                    ? "text-[#D1F843]"
                    : "text-white/55",
              ].join(" ")}
            >
              {tile.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
