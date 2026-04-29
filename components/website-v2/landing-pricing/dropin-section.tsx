"use client";

import {
  ArrowRight,
  BarChart3,
  Calendar,
  Flag,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { fonts, colors } from "../academy/pricing-tokens";
import { DROP_INS, DROPIN_HEAD, type DropIn, type DropInIcon } from "./data";

const ICON_MAP: Record<DropInIcon, LucideIcon> = {
  Zap,
  Users,
  Flag,
  BarChart3,
};

export function DropInSection() {
  return (
    <section className="bg-white px-10 py-[100px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-[50px] grid items-end gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <div
              className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ fontFamily: fonts.mono, color: colors.primary }}
            >
              {DROPIN_HEAD.eyebrow}
            </div>
            <h2
              className="text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.030em]"
              style={{ fontFamily: fonts.display, color: colors.ink }}
            >
              {DROPIN_HEAD.headingPrefix}{" "}
              <em
                className="not-italic font-medium"
                style={{
                  fontFamily: fonts.italic,
                  fontStyle: "italic",
                  color: colors.primary,
                }}
              >
                {DROPIN_HEAD.headingItalic}
              </em>
              {DROPIN_HEAD.headingSuffix}
            </h2>
          </div>
          <a
            href={DROPIN_HEAD.ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[13px] font-bold transition-colors hover:bg-[var(--akgolf-ink,#0A1F18)] hover:text-white"
            style={{
              borderColor: colors.ink,
              color: colors.ink,
              fontFamily: fonts.body,
            }}
          >
            {DROPIN_HEAD.ctaLabel}
            <Calendar className="h-3.5 w-3.5" strokeWidth={2.2} />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DROP_INS.map((d) => (
            <DropInCard key={d.id} dropIn={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DropInCard({ dropIn }: { dropIn: DropIn }) {
  const Icon = ICON_MAP[dropIn.icon];
  return (
    <article
      className="rounded-2xl border bg-white px-[26px] py-6"
      style={{ borderColor: colors.line }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="grid h-9 w-9 place-items-center rounded-[10px]"
          style={{
            background: "rgba(0,88,64,0.08)",
            color: colors.primary,
          }}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>
        <div className="text-right">
          <span
            className="text-[22px] font-extrabold tracking-[-0.020em]"
            style={{ fontFamily: fonts.body, color: colors.ink }}
          >
            {dropIn.price}
          </span>
          <div
            className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.10em]"
            style={{ fontFamily: fonts.mono, color: colors.muted }}
          >
            {dropIn.unit}
          </div>
        </div>
      </div>

      <h4
        className="mb-1.5 text-[17px] font-bold tracking-[-0.015em]"
        style={{ fontFamily: fonts.display, color: colors.ink }}
      >
        {dropIn.title}
      </h4>
      <div
        className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ fontFamily: fonts.mono, color: colors.primary }}
      >
        {dropIn.duration}
      </div>
      <p
        className="mb-4 text-[13.5px] leading-[1.5]"
        style={{ color: colors.text }}
      >
        {dropIn.description}
      </p>

      <a
        href={dropIn.href}
        className="group/cta inline-flex items-center gap-1.5 text-[13px] font-bold transition-all"
        style={{ color: colors.primary }}
      >
        {dropIn.cta}
        <ArrowRight
          className="h-3 w-3 transition-transform group-hover/cta:translate-x-1"
          strokeWidth={2.4}
        />
      </a>
    </article>
  );
}
