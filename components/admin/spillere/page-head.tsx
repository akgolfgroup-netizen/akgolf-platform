import type { ReactNode } from "react";

interface PageHeadProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions: ReactNode;
}

export function SpillerePageHead({
  eyebrow,
  title,
  subtitle,
  actions,
}: PageHeadProps) {
  return (
    <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
      <div>
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#D1F843]">
          {eyebrow}
        </div>
        <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] text-white/60">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5">{actions}</div>
    </div>
  );
}
