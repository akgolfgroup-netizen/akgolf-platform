import { FREE_SLOTS } from "./analytics-data";
import { BarRow } from "./bar-row";

export function FreeSlotsCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 flex items-center justify-between text-[15px] font-bold text-white">
        <span>Topp-tider · ledig kapasitet</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          90D
        </span>
      </h3>

      {FREE_SLOTS.map((slot) => (
        <BarRow
          key={slot.label}
          label={slot.label}
          barPct={slot.barPct}
          value={`${slot.valuePct}%`}
        />
      ))}

      <div className="mt-3.5 border-t border-white/[0.06] pt-3 text-[11.5px] leading-[1.5] text-white/55">
        Mulig <strong className="font-bold text-white">+18k/mnd</strong> hvis Fre 18-20 fylles til 80 %. Vurder kvelds-promo eller flytte fra topp-tider.
      </div>
    </section>
  );
}
