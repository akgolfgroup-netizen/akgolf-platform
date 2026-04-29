import { PAYOUT } from "./okonomi-data";

export function PayoutCard() {
  return (
    <section
      className="mb-[18px] rounded-[14px] px-6 py-5"
      style={{
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.10), rgba(13,46,35,0.0)), #0D2E23",
        border: "1px solid rgba(209,248,67,0.20)",
      }}
    >
      <div
        className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: "#D1F843" }}
      >
        Neste utbetaling · Stripe → DNB
      </div>
      <div className="mb-1 mt-1.5 font-inter-tight text-[32px] font-extrabold leading-none tracking-[-0.025em] text-white">
        {PAYOUT.amountKr}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.10em] text-white/70">
        {PAYOUT.when}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-3.5 border-t border-white/[0.06] pt-3.5 font-mono text-[10.5px] text-white/65">
        <span>
          Brutto: <strong className="font-bold text-white">{PAYOUT.gross}</strong>
        </span>
        <span>
          Stripe-fee:{" "}
          <strong className="font-bold text-white">{PAYOUT.stripeFee}</strong>
        </span>
        <span>
          Refusjoner:{" "}
          <strong className="font-bold text-white">{PAYOUT.refunds}</strong>
        </span>
        <span>
          Status:{" "}
          <strong className="font-bold" style={{ color: "#6FCBA1" }}>
            {PAYOUT.status}
          </strong>
        </span>
      </div>
    </section>
  );
}
