"use client";

const FIELDS = [
  { label: "Spiller", value: "Anders Kristiansen" },
  { label: "Lengde", value: "4 uker" },
  { label: "Start", value: "Man 6. mai" },
];

type Props = {
  defaultName?: string;
};

export function PlanInfo({
  defaultName = "Anders · mai-blokk · alignment + putt 6m",
}: Props) {
  return (
    <section
      className="mb-3.5 rounded-2xl border px-5 py-4"
      style={{ background: "#0D2E23", borderColor: "#1a4a3a" }}
    >
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
            Plan-navn
          </div>
          <input
            type="text"
            defaultValue={defaultName}
            className="w-full rounded-lg border px-3 py-2 text-[13px] text-white outline-none transition focus:border-[rgba(209,248,67,0.35)]"
            style={{
              background: "rgba(0,0,0,0.20)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          />
        </div>
        {FIELDS.map((f) => (
          <div key={f.label}>
            <div className="mb-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] text-white/50">
              {f.label}
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] text-white transition hover:border-[rgba(209,248,67,0.35)]"
              style={{
                background: "rgba(0,0,0,0.20)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <span>{f.value}</span>
              <span className="text-white/40">▾</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
