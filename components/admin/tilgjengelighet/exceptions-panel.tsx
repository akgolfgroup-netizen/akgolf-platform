import type { ExceptionItem } from "./mock-data";

interface Props {
  items: ExceptionItem[];
}

const VARIANT_BG: Record<ExceptionItem["variant"], string> = {
  danger: "bg-[rgba(184,66,51,0.10)]",
  warning: "bg-[rgba(232,185,103,0.10)]",
};

const VARIANT_FG: Record<ExceptionItem["variant"], string> = {
  danger: "text-[#F49283]",
  warning: "text-[#E8B967]",
};

export function ExceptionsPanel({ items }: Props) {
  return (
    <section className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4">
      <h3 className="flex items-center justify-between text-[13px] font-bold text-white">
        Kommende unntak
        <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-white/50">
          {items.length} ENTRIES
        </span>
      </h3>

      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.date + item.name}
            className={
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 " + VARIANT_BG[item.variant]
            }
          >
            <div
              className={
                "min-w-[62px] font-mono text-[11px] font-bold " + VARIANT_FG[item.variant]
              }
            >
              {item.date}
            </div>
            <div className="flex-1 text-[12px] text-white">{item.name}</div>
            <div
              className={
                "font-mono text-[9px] font-bold tracking-[0.10em] " + VARIANT_FG[item.variant]
              }
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
