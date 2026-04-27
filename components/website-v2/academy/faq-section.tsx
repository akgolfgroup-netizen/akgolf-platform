"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { fonts, colors } from "./pricing-tokens";

interface FaqSectionProps {
  faq: typeof ACADEMY_PRICING_V2.faq;
}

export function FaqSection({ faq }: FaqSectionProps) {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="px-10 py-[100px]" style={{ background: colors.surface }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-start gap-20 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ fontFamily: fonts.mono, color: colors.primary }}
            >
              {faq.eyebrow}
            </div>
            <h2
              className="mb-4 text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: fonts.display, color: colors.ink }}
            >
              {faq.headingPrefix}{" "}
              <em
                className="not-italic font-medium"
                style={{
                  fontFamily: fonts.italic,
                  fontStyle: "italic",
                  color: colors.primary,
                }}
              >
                {faq.headingItalic}
              </em>{" "}
              {faq.headingSuffix}
            </h2>
            <p
              className="text-[16px] leading-[1.6]"
              style={{ color: colors.text }}
            >
              {faq.description}
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  className="border-t py-6 last:border-b"
                  style={{ borderColor: colors.line }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span
                      className="text-[18px] font-bold tracking-[-0.015em]"
                      style={{ color: colors.ink }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-transform"
                      style={{
                        background: "#fff",
                        color: colors.primary,
                        transform: isOpen ? "rotate(45deg)" : "none",
                        border: `1px solid ${colors.line}`,
                      }}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </button>
                  {isOpen ? (
                    <p
                      className="mt-3.5 max-w-[65ch] text-[15px] leading-[1.65]"
                      style={{ color: colors.text }}
                    >
                      {item.a}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
