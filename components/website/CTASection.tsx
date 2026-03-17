import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { BOOKING_URL } from "@/lib/website-constants";

export function CTASection({
  eyebrow = "Klar for neste steg?",
  heading,
  description,
  ctaLabel = "Book time",
  ctaHref = BOOKING_URL,
  external = true,
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryExternal = false,
}: {
  eyebrow?: string;
  heading: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  external?: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryExternal?: boolean;
}) {
  return (
    <section className="bg-ink-100 w-section">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-2xl mx-auto text-center rounded-2xl p-10 md:p-16 bg-ink-90">
            <SectionLabel>{eyebrow}</SectionLabel>
            <h2 className="w-heading-lg text-white mt-4 mb-4">{heading}</h2>
            <p className="text-ink-40 leading-relaxed mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {external ? (
                <a 
                  href={ctaHref} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-btn w-btn-primary"
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link href={ctaHref} className="w-btn w-btn-primary">
                  {ctaLabel}
                </Link>
              )}
              {secondaryCtaLabel && secondaryCtaHref && (
                secondaryExternal ? (
                  <a 
                    href={secondaryCtaHref} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-btn w-btn-secondary"
                  >
                    {secondaryCtaLabel}
                  </a>
                ) : (
                  <Link href={secondaryCtaHref} className="w-btn w-btn-secondary">
                    {secondaryCtaLabel}
                  </Link>
                )
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
