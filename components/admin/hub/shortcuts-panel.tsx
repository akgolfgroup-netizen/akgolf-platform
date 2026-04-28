import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HubShortcut } from "./types";

export function ShortcutsPanel({ shortcuts }: { shortcuts: HubShortcut[] }) {
  return (
    <section className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-6 py-[22px]">
      <h3 className="m-0 mb-3.5 flex items-center justify-between text-[15px] font-bold text-white">
        Hurtig-handlinger
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SHORTCUTS
        </span>
      </h3>

      <div className="flex flex-col gap-2.5">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <Link
              key={sc.id}
              href={sc.href}
              className="group flex items-center gap-3 rounded-[10px] bg-black/20 px-4 py-3.5 transition hover:bg-white/[0.04]"
            >
              <div className="grid h-8 w-8 place-items-center rounded-[7px] bg-[rgba(209,248,67,0.15)] text-accent">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white">
                  {sc.name}
                </div>
                <div className="mt-px font-mono text-[10px] text-white/50">
                  {sc.meta}
                </div>
              </div>
              <ArrowRight
                className="ml-auto h-3.5 w-3.5 text-white/40 transition group-hover:text-white"
                strokeWidth={1.8}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
