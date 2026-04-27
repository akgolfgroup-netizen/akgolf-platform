import { Check } from "lucide-react";
import type { CompletedItem } from "./mock-data";

interface Props {
  items: CompletedItem[];
}

export function CompletedStrip({ items }: Props) {
  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[14px] font-semibold text-white">
            Allerede ute av veien i dag
          </h3>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6FCBA1]">
            +4 fullført · god start
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-[0.06em] text-white/50">
          SISTE 8T
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div
            key={item.text}
            className="grid items-center gap-3 rounded-lg px-2.5 py-2 text-[12px] line-through opacity-55"
            style={{
              gridTemplateColumns: "16px 1fr auto",
              background: "rgba(42,125,90,0.06)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <div className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#6FCBA1]">
              <Check className="h-2.5 w-2.5 text-ink" strokeWidth={3} />
            </div>
            <div>{item.text}</div>
            <div className="font-mono text-[10px] text-white/50">
              {item.when}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
