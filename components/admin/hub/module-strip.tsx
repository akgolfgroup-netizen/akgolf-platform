import Link from "next/link";
import type { HubModule } from "./types";

const BADGE_STYLES = {
  accent: "bg-[rgba(209,248,67,0.15)] text-accent",
  warn: "bg-[rgba(232,185,103,0.18)] text-[#E8B967]",
} as const;

export function ModuleStrip({ modules }: { modules: HubModule[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-4">
      {modules.map((module) => {
        const Icon = module.icon;
        return (
          <Link
            key={module.id}
            href={module.href}
            className="group relative block rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-5 py-[18px] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(209,248,67,0.30)]"
          >
            {module.badge ? (
              <span
                className={`absolute right-3.5 top-3.5 rounded-[5px] px-1.5 py-[3px] font-mono text-[9.5px] font-bold tracking-[0.06em] ${BADGE_STYLES[module.badge.tone]}`}
              >
                {module.badge.label}
              </span>
            ) : null}
            <div className="mb-3.5 grid h-10 w-10 place-items-center rounded-[10px] bg-[rgba(209,248,67,0.15)] text-accent">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>
            <div className="text-[14px] font-bold text-white">
              {module.title}
            </div>
            <div className="mt-1 text-[12px] leading-[1.5] text-white/55">
              {module.subtitle}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
