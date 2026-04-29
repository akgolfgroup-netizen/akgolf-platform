import { ArrowRight, MessageCircle } from "lucide-react";
import { WebButton } from "../web-button";
import { JUNIOR_CTA_V3 } from "@/lib/website-constants";

export function JuniorCtaSection() {
  const s = JUNIOR_CTA_V3;
  return (
    <section
      className="relative overflow-hidden px-10 py-[100px]"
      style={{ background: "var(--akgolf-ink, #0A1F18)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
        }}
      />
      <div className="relative z-[2] mx-auto max-w-[1280px] text-center">
        <h2
          className="mx-auto mb-5 max-w-[22ch] text-[clamp(40px,5.4vw,68px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-white"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {s.headingLead}{" "}
          <em
            className="font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-accent, #D1F843)",
            }}
          >
            {s.headingItalic}
          </em>
          {s.headingTrail}
        </h2>
        <p className="mx-auto mb-9 max-w-[50ch] text-[17px] text-white/70">
          {s.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <WebButton href={s.ctaPrimaryHref} variant="primary" size="lg">
            {s.ctaPrimary}
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </WebButton>
          {s.ctaSecondary ? (
            <WebButton href={s.ctaSecondaryHref} variant="ghost" size="lg">
              {s.ctaSecondary}
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
            </WebButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}
