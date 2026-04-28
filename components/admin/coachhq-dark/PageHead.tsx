import type { ReactNode } from "react";

interface PageHeadProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHead({
  eyebrow,
  title,
  description,
  actions,
}: PageHeadProps) {
  return (
    <div
      className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-5 border-b"
      style={{ borderColor: "#1a4a3a" }}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div
            className="mb-1.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#D1F843",
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          className="m-0 text-[28px] font-bold"
          style={{
            color: "#FFFFFF",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="m-0 mt-1.5 text-[13px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
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
