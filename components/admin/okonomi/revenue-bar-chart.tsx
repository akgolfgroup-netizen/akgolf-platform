import { REVENUE_MONTHS } from "./okonomi-data";

const LEGEND = [
  { color: "#D1F843", label: "1:1 coach" },
  { color: "#6BB1FF", label: "Pakker" },
  { color: "#C99CF3", label: "Test & data" },
  { color: "#E8B967", label: "Camp / gruppe" },
];

export function RevenueBarChart() {
  return (
    <section
      className="mb-[22px] rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <div className="mb-[18px] flex items-end justify-between">
        <h3 className="text-[15px] font-bold text-white">
          Inntekt · siste 12 måneder
        </h3>
        <div className="font-mono text-[10px] text-white/55">
          {LEGEND.map((l, i) => (
            <span key={l.label} className={i > 0 ? "ml-3.5" : ""}>
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-[2px] align-middle"
                style={{ background: l.color }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative flex items-end gap-3 pb-7"
        style={{ height: "220px" }}
      >
        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-7"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "100% 25%",
          }}
        />

        {REVENUE_MONTHS.map((m) => (
          <div
            key={m.label}
            className={`relative flex h-full flex-1 flex-col items-center justify-end gap-0.5 ${
              m.current ? "rounded outline outline-1 outline-offset-4" : ""
            }`}
            style={
              m.current
                ? { outlineColor: "rgba(209,248,67,0.30)" }
                : undefined
            }
          >
            <div className="flex w-full max-w-[36px] flex-col items-stretch gap-0.5">
              <div
                className="rounded-[3px]"
                style={{ height: `${m.s1}px`, background: "#D1F843" }}
              />
              <div
                className="rounded-[3px]"
                style={{ height: `${m.s2}px`, background: "#6BB1FF" }}
              />
              <div
                className="rounded-[3px]"
                style={{ height: `${m.s3}px`, background: "#C99CF3" }}
              />
              {m.s4 > 0 && (
                <div
                  className="rounded-[3px]"
                  style={{ height: `${m.s4}px`, background: "#E8B967" }}
                />
              )}
            </div>
            <div
              className="absolute bottom-0 font-mono text-[9px] tracking-[0.06em]"
              style={{ color: m.current ? "#D1F843" : "rgba(255,255,255,0.5)" }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
