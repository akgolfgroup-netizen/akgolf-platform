"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { fonts, colors } from "../academy/pricing-tokens";
import { FAQ_BAND } from "./data";

export function PricingFaqSection() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section className="bg-white px-10 py-[100px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.primary }}
          >
            {FAQ_BAND.eyebrow}
          </div>
          <h2
            className="text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.030em]"
            style={{ fontFamily: fonts.display, color: colors.ink }}
          >
            {FAQ_BAND.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.primary,
              }}
            >
              {FAQ_BAND.headingItalic}
            </em>
            {FAQ_BAND.headingSuffix}
          </h2>
        </div>

        <ul className="mx-auto mt-[50px] flex max-w-[800px] list-none flex-col gap-3 p-0">
          {FAQ_BAND.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className="rounded-2xl border px-7 py-6"
                style={{
                  background: colors.surface,
                  borderColor: colors.line,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] font-bold tracking-[-0.015em]"
                    style={{ fontFamily: fonts.display, color: colors.ink }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="grid h-[18px] w-[18px] flex-shrink-0 place-items-center transition-transform"
                    style={{
                      color: colors.muted,
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </span>
                </button>
                {isOpen ? (
                  <p
                    className="mt-3 text-[15px] leading-[1.55]"
                    style={{ color: colors.text, textWrap: "pretty" }}
                  >
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
