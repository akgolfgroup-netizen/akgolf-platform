import type { ReactNode } from "react";

interface McPageHeadProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function McPageHead({ eyebrow, title, description, actions }: McPageHeadProps) {
  return (
    <div
      className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-5 border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div
            className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          className="m-0 text-[26px] font-bold tracking-[-0.025em] text-white"
          style={{ fontFamily: "var(--font-inter-tight)", lineHeight: 1.15 }}
        >
          {title}
        </h1>
        {description && (
          <p className="m-0 mt-1.5 text-[13px] text-white/55 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
