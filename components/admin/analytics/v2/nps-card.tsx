import { NPS } from "./analytics-data";
import { BarRow } from "./bar-row";

export function NpsCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 text-[15px] font-bold text-white">
        Spiller-tilfredshet · NPS
      </h3>

      <div className="py-6 text-center">
        <div
          className="font-inter-tight text-[54px] font-extrabold leading-none tracking-[-0.03em]"
          style={{ color: "#D1F843" }}
        >
          {NPS.score}
        </div>
        <div className="mt-1.5 font-mono text-[11px] tracking-[0.10em] text-white/55">
          NPS · {NPS.basis}
        </div>
      </div>

      <BarRow
        label="PROMOTERS"
        barPct={74}
        value={String(NPS.promoters)}
        labelColor="#6FCBA1"
        barColor="#6FCBA1"
      />
      <BarRow
        label="PASSIVE"
        barPct={21}
        value={String(NPS.passive)}
        labelColor="rgba(255,255,255,0.7)"
        barColor="rgba(255,255,255,0.40)"
      />
      <BarRow
        label="DETRACTORS"
        barPct={5}
        value={String(NPS.detractors)}
        labelColor="#F49283"
        barColor="#F49283"
      />
    </section>
  );
}
