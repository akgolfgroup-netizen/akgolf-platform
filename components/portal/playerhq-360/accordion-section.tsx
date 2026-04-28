"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface AccordionSectionProps {
  id: string;
  num: string;
  title: string;
  sub: string;
  metaPrimary?: string;
  metaSecondary?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AccordionSection({
  id,
  num,
  title,
  sub,
  metaPrimary,
  metaSecondary,
  open,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <section
      id={id}
      className="overflow-hidden transition-colors"
      style={{
        background: "#0D2E23",
        border: open
          ? "1px solid rgba(209,248,67,0.30)"
          : "1px solid #1A4A3A",
        borderRadius: 16,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full cursor-pointer select-none items-center gap-4 px-5 py-4 text-left lg:px-6 lg:py-5"
        style={{
          gridTemplateColumns: "44px 1fr auto auto",
        }}
      >
        <div
          className="grid place-items-center font-mono text-xs font-bold tracking-wider"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: open
              ? "rgba(209,248,67,0.15)"
              : "rgba(255,255,255,0.06)",
            color: open ? "#D1F843" : "rgba(255,255,255,0.6)",
          }}
        >
          {num}
        </div>
        <div>
          <div
            className="text-[18px] font-bold tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-inter-tight, Inter)" }}
          >
            {title}
          </div>
          <div
            className="mt-0.5 font-mono text-[10px] uppercase"
            style={{
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {sub}
          </div>
        </div>
        <div
          className="hidden text-right font-mono text-[10px] uppercase sm:block"
          style={{
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {metaPrimary ? (
            <strong
              className="block text-[14px] font-bold tracking-[-0.01em] text-white"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {metaPrimary}
            </strong>
          ) : null}
          {metaSecondary}
        </div>
        <div
          className="grid place-items-center transition-transform"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: open
              ? "rgba(209,248,67,0.10)"
              : "rgba(255,255,255,0.04)",
            color: open ? "#D1F843" : "rgba(255,255,255,0.6)",
            transform: open ? "rotate(90deg)" : undefined,
          }}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </div>
      </button>

      {open ? (
        <div
          className="px-5 pb-6 pt-2 lg:px-6"
          style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

interface FullDetailLinkProps {
  meta: string;
  href: string;
}

export function FullDetailLink({ meta, href }: FullDetailLinkProps) {
  return (
    <div
      className="mt-4 flex items-center justify-between pt-3.5"
      style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }}
    >
      <span
        className="font-mono text-[10px] uppercase"
        style={{
          letterSpacing: "0.10em",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {meta}
      </span>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold no-underline"
        style={{ color: "#D1F843" }}
      >
        Vis full detalj →
      </a>
    </div>
  );
}
