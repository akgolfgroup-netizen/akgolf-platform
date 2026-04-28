"use client";

interface QuotaItem {
  label: string;
  used: number;
  total: number | null; // null = unlimited
  meta: string;
  warn?: boolean;
}

interface QuotaCardProps {
  title: string;
  period: string;
  items: QuotaItem[];
}

export function QuotaCard({ title, period, items }: QuotaCardProps) {
  return (
    <section
      className="rounded-[16px] px-6 py-5.5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <div className="mb-4.5 flex items-end justify-between">
        <h3 className="m-0 text-sm font-semibold tracking-[-0.01em] text-white">
          {title}
        </h3>
        <div
          className="font-mono text-[10px] uppercase"
          style={{
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.14em",
          }}
        >
          {period}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => {
          const total = item.total;
          const pct =
            total && total > 0
              ? Math.min(100, Math.round((item.used / total) * 100))
              : Math.min(100, item.used > 0 ? 42 : 0);
          return (
            <div key={item.label}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <span
                  className="text-[12.5px] font-medium"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {item.label}
                </span>
                <span
                  className="font-mono text-sm font-semibold tabular-nums text-white"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.used}{" "}
                  <small
                    className="text-[11px] font-medium"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    / {total ?? "∞"}
                  </small>
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: item.warn ? "#E8B967" : "#D1F843",
                  }}
                />
              </div>
              <div
                className="mt-2 font-mono text-[11px] uppercase"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.04em",
                }}
              >
                {item.meta}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
