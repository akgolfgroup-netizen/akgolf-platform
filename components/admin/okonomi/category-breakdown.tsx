import { CATEGORY_BREAKDOWN } from "./okonomi-data";

export function CategoryBreakdown() {
  return (
    <aside
      className="rounded-[14px] px-[22px] py-[18px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-3.5 flex items-center justify-between text-[14px] font-bold text-white">
        <span>Inntekt per kategori</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          APR 2025
        </span>
      </h3>

      <div className="flex flex-col gap-2">
        {CATEGORY_BREAKDOWN.map((row) => (
          <div key={row.label}>
            <div
              className="grid items-center gap-3 py-2"
              style={{ gridTemplateColumns: "1fr 60px 60px" }}
            >
              <div>
                <div className="text-[12.5px] font-semibold text-white">
                  {row.label}
                </div>
                <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.04em] text-white/50">
                  {row.sublabel}
                </div>
              </div>
              <div className="text-right font-mono text-[11px] font-bold text-white/70">
                {row.pct}%
              </div>
              <div className="text-right font-mono text-[11px] font-bold text-white">
                {row.amountKr}
              </div>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-[3px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-[3px]"
                style={{ width: `${row.pct}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[18px] flex items-center justify-between border-t border-white/[0.06] pt-3.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-white/60">
          SUM
        </span>
        <span className="font-mono text-[18px] font-extrabold text-white">
          184 600 kr
        </span>
      </div>
    </aside>
  );
}
