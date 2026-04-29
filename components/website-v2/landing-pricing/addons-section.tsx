"use client";

import { Camera } from "lucide-react";
import { fonts, colors } from "../academy/pricing-tokens";
import { ADDONS, ADDONS_HEAD, type AddOn } from "./data";

export function AddOnsSection() {
  return (
    <section
      className="px-10 py-[100px]"
      style={{ background: colors.surface }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-[50px] text-center">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.primary }}
          >
            {ADDONS_HEAD.eyebrow}
          </div>
          <h2
            className="text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.030em]"
            style={{ fontFamily: fonts.display, color: colors.ink }}
          >
            {ADDONS_HEAD.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.primary,
              }}
            >
              {ADDONS_HEAD.headingItalic}
            </em>
            {ADDONS_HEAD.headingSuffix}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ADDONS.map((a) => (
            <AddOnCard key={a.id} addOn={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

const TONE_BG: Record<AddOn["imageTone"], string> = {
  default:
    "linear-gradient(135deg, rgba(0,88,64,0.85) 0%, rgba(15,31,24,0.95) 100%)",
  cream:
    "linear-gradient(135deg, rgba(244,246,244,1) 0%, rgba(228,234,230,1) 100%)",
  warm: "linear-gradient(135deg, rgba(196,138,50,0.85) 0%, rgba(75,52,18,0.95) 100%)",
};

function AddOnCard({ addOn }: { addOn: AddOn }) {
  const isLight = addOn.imageTone === "cream";
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] border bg-white"
      style={{ borderColor: colors.line }}
    >
      <div
        className="relative grid h-[180px] place-items-center"
        style={{ background: TONE_BG[addOn.imageTone] }}
        aria-hidden="true"
      >
        <div
          className="flex flex-col items-center gap-2 px-6 text-center"
          style={{ color: isLight ? colors.muted : "rgba(255,255,255,0.85)" }}
        >
          <div
            className="grid h-10 w-10 place-items-center rounded-full"
            style={{
              background: isLight ? "#fff" : "rgba(255,255,255,0.18)",
              color: isLight ? colors.primary : "#fff",
            }}
          >
            <Camera className="h-4 w-4" strokeWidth={1.8} />
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ fontFamily: fonts.mono }}
          >
            [Foto]
          </div>
          <div
            className="max-w-[26ch] text-[12px] leading-[1.4]"
            style={{ opacity: 0.85 }}
          >
            {addOn.imageDesc}
          </div>
          <div
            className="text-[9px] tracking-[0.10em]"
            style={{ fontFamily: fonts.mono, opacity: 0.6 }}
          >
            16:9 · LANDSCAPE
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-[26px] pt-6 pb-[26px]">
        <div
          className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ fontFamily: fonts.mono, color: colors.primary }}
        >
          {addOn.label}
        </div>
        <h4
          className="mb-2 text-[19px] font-extrabold tracking-[-0.020em]"
          style={{ fontFamily: fonts.display, color: colors.ink }}
        >
          {addOn.title}
        </h4>
        <p
          className="mb-[18px] text-[13.5px] leading-[1.55]"
          style={{ color: colors.text }}
        >
          {addOn.description}
        </p>
        <div
          className="mt-auto flex items-baseline gap-1.5 border-t pt-4"
          style={{ borderColor: colors.line }}
        >
          <span
            className="text-[24px] font-extrabold tracking-[-0.02em] tabular-nums"
            style={{
              fontFamily: fonts.body,
              color: colors.ink,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {addOn.price}
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.10em]"
            style={{ fontFamily: fonts.mono, color: colors.muted }}
          >
            {addOn.unit}
          </span>
        </div>
      </div>
    </article>
  );
}
