import { TOP_PLAYERS } from "./rapporter-data";

export function TopPlayersCard() {
  return (
    <section
      className="rounded-[14px] px-[22px] py-[18px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-3.5 flex items-center justify-between text-[14px] font-bold text-white">
        <span>Topp-5 fremgang · denne perioden</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SE ALLE 42
        </span>
      </h3>

      <div className="flex flex-col">
        {TOP_PLAYERS.map((p, i) => {
          const delta = (p.after - p.before).toFixed(1);
          return (
            <div
              key={p.name}
              className={`grid items-center gap-3 py-2.5 text-[12.5px] ${
                i === 0 ? "" : "border-t border-white/[0.04]"
              }`}
              style={{ gridTemplateColumns: "32px 1fr 90px 70px 60px" }}
            >
              <div
                className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: p.avatarColor, color: "#0A1F18" }}
              >
                {p.initials}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-white">{p.name}</div>
                <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.04em] text-white/50">
                  {p.category}
                </div>
              </div>
              <div className="text-right font-mono font-bold text-white tabular-nums">
                {p.before.toFixed(1)} → {p.after.toFixed(1)}
              </div>
              <svg viewBox="0 0 60 24" className="h-6 w-[60px]">
                <path
                  d={p.sparkPath}
                  stroke="#6FCBA1"
                  fill="none"
                  strokeWidth="1.6"
                />
              </svg>
              <div
                className="text-right font-mono font-bold tabular-nums"
                style={{ color: "#6FCBA1" }}
              >
                {delta}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
