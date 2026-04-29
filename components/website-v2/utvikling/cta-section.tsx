import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { UTVIKLING_CTA_V2 } from "@/lib/website-constants";

const c = UTVIKLING_CTA_V2;

const PRIMARY = "var(--akgolf-primary, #005840)";
const ACCENT = "var(--akgolf-accent, #D1F843)";

const FRAUNCES_INLINE: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontStyle: "italic",
  color: PRIMARY,
};

export function UtviklingCtaSection() {
  return (
    <section className="px-10">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="mb-25 mt-10 rounded-[28px] px-15 py-16 text-center"
          style={{ background: ACCENT }}
        >
          <h3
            className="m-0 mb-3.5 text-[clamp(36px,4.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#0A1F18",
            }}
          >
            {c.headingStart}{" "}
            <em className="font-medium not-italic" style={FRAUNCES_INLINE}>
              {c.headingEm}
            </em>
          </h3>
          <p
            className="mx-auto mb-7 max-w-[54ch] text-[17px] leading-[1.6]"
            style={{ color: "#0A1F18" }}
          >
            {c.description}
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <Link
              href={c.ctaPrimaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A1F18] px-7 py-4 text-[14px] font-bold text-white transition-transform hover:-translate-y-px"
            >
              {c.ctaPrimary}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
            <Link
              href={c.ctaSecondaryHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] px-7 py-4 text-[14px] font-bold text-[#0A1F18] transition-colors hover:bg-[#0A1F18]/5"
              style={{ borderColor: "rgba(10,31,24,0.30)" }}
            >
              {c.ctaSecondary}
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
