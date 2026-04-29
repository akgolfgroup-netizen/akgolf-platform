import { ArrowRight } from "lucide-react";
import type { TomorrowItem } from "./mock-data";

interface Props {
  items: TomorrowItem[];
  subtitle: string;
}

export function TomorrowPreview({ items, subtitle }: Props) {
  return (
    <div className="mt-5 rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-[18px]">
      <div className="mb-2.5 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[13px] font-semibold text-white">
            Forhåndsvisning · i morgen
          </h3>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            {subtitle}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/80 transition hover:bg-white/10"
        >
          Se hele <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item) => (
          <div
            key={item.time}
            className="rounded-lg bg-white/[0.03] px-3 py-2.5 text-[12px] text-white/85"
          >
            <div className="mb-1 font-mono text-[10px] text-white/50">
              {item.time}
            </div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
