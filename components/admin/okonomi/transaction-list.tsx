import { TRANSACTIONS, type Transaction } from "./okonomi-data";

const STATUS_STYLE: Record<Transaction["status"], { bg: string; color: string; label: string }> = {
  PAID: { bg: "rgba(42,125,90,0.25)", color: "#6FCBA1", label: "PAID" },
  PENDING: { bg: "rgba(232,185,103,0.20)", color: "#E8B967", label: "VENT." },
  REFUND: { bg: "rgba(184,66,51,0.18)", color: "#F49283", label: "REFUND" },
};

function formatAmount(n: number): string {
  const abs = Math.abs(n).toLocaleString("nb-NO");
  return n < 0 ? `−${abs}` : abs;
}

export function TransactionList() {
  return (
    <section
      className="rounded-[14px] px-[22px] py-[18px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-3.5 flex items-center justify-between text-[14px] font-bold text-white">
        <span>Siste transaksjoner</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SE ALLE 87
        </span>
      </h3>

      <div className="flex flex-col">
        {TRANSACTIONS.map((tx, i) => {
          const stat = STATUS_STYLE[tx.status];
          return (
            <div
              key={tx.name + tx.date}
              className={`grid items-center gap-3 py-2.5 text-[12.5px] ${
                i === 0 ? "" : "border-t border-white/[0.04]"
              }`}
              style={{ gridTemplateColumns: "36px 1fr 90px 80px 80px" }}
            >
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: tx.avatarColor, color: "#0A1F18" }}
              >
                {tx.initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{tx.name}</div>
                <div className="mt-0.5 font-mono text-[9.5px] text-white/55">
                  {tx.product}
                </div>
              </div>
              <div className="font-mono text-[11px] text-white/65">{tx.date}</div>
              <div
                className="text-right font-mono text-[12.5px] font-bold tabular-nums"
                style={{ color: tx.amount < 0 ? "#F49283" : "#FFFFFF" }}
              >
                {formatAmount(tx.amount)}
              </div>
              <div
                className="rounded-[5px] py-0.5 text-center font-mono text-[9.5px] font-bold uppercase tracking-[0.08em]"
                style={{ background: stat.bg, color: stat.color }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
