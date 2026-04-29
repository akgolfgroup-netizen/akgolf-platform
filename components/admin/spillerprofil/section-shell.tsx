"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { COLORS } from "./primitives";

type Tone = "lime" | "green" | "violet" | "blue" | "amber" | "coral" | "neutral";

const TONE_STYLES: Record<Tone, { bg: string; color: string }> = {
  lime: { bg: "rgba(209,248,67,0.16)", color: COLORS.accent },
  green: { bg: "rgba(42,125,90,0.22)", color: COLORS.success },
  violet: { bg: "rgba(175,82,222,0.22)", color: COLORS.violet },
  blue: { bg: "rgba(0,122,255,0.20)", color: COLORS.info },
  amber: { bg: "rgba(196,138,50,0.22)", color: COLORS.warn },
  coral: { bg: "rgba(184,66,51,0.22)", color: COLORS.danger },
  neutral: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" },
};

/**
 * Long-page section-shell — collapsible kort med farget ikon-boks,
 * tittel, subline og head-pills til høyre. Bruk i d8 longpage.
 */
export function SectionShell({
  id,
  tone = "neutral",
  icon,
  title,
  sub,
  pills,
  children,
  defaultOpen = true,
}: {
  id: string;
  tone?: Tone;
  icon: ReactNode;
  title: string;
  sub: string;
  pills?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const t = TONE_STYLES[tone];

  return (
    <section
      id={id}
      className="overflow-hidden"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 14,
        scrollMarginTop: 76,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full select-none items-center gap-[12px] px-[22px] py-[16px] text-left"
      >
        <span
          className="grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[8px]"
          style={{ background: t.bg, color: t.color }}
        >
          {icon}
        </span>
        <div>
          <h2
            className="m-0 text-[15px] font-semibold tracking-[-0.01em]"
            style={{ color: "#fff" }}
          >
            {title}
          </h2>
          <p
            className="m-0 mt-[2px] font-mono text-[11px] uppercase tracking-[0.06em]"
            style={{ color: COLORS.textSubtle }}
          >
            {sub}
          </p>
        </div>
        {pills ? (
          <div className="ml-auto flex items-center gap-[6px]">{pills}</div>
        ) : (
          <span className="ml-auto" />
        )}
        <span
          className="ml-[6px] transition-transform"
          style={{
            color: COLORS.textTertiary,
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      {open ? (
        <div
          className="border-t px-[22px] pt-[18px] pb-[22px]"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
