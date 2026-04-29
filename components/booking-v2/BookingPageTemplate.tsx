import type { ReactNode } from "react";
import { BookingStepper } from "./BookingStepper";

interface BookingPageTemplateProps {
  step: number;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
  sidebar?: ReactNode;
}

export function BookingPageTemplate({
  step,
  eyebrow,
  title,
  lede,
  children,
  sidebar,
}: BookingPageTemplateProps) {
  return (
    <>
      <BookingStepper current={step} />

      <div className={sidebar ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-12" : ""}>
        <div>
          {/* Eyebrow */}
          <div
            className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <span className="h-px w-5" style={{ background: "var(--color-ink)" }} />
            {eyebrow}
          </div>

          {/* Title */}
          <h1
            className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            {title}
          </h1>

          {/* Lede */}
          <p
            className="mb-8 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {lede}
          </p>

          {children}
        </div>

        {sidebar ? (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {sidebar}
          </aside>
        ) : null}
      </div>
    </>
  );
}
