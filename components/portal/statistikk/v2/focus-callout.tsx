import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface FocusCalloutProps {
  title: string;
  tag?: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Fokus-callout fra a13-sammenligning.html.
 * Brand Guide V2.0-stil med lime ikon-block.
 */
export function FocusCallout({
  title,
  tag,
  description,
  ctaLabel = "Lag plan",
  ctaHref = "/portal/treningsplan",
}: FocusCalloutProps) {
  return (
    <section
      className="col-span-12 grid items-center gap-5 rounded-2xl border p-6"
      style={{
        gridTemplateColumns: "56px 1fr auto",
        borderColor: "rgba(0, 88, 64, 0.18)",
        background:
          "linear-gradient(160deg, rgba(0, 88, 64, 0.04) 0%, rgba(255,255,255,0) 60%), var(--color-card, #FFFFFF)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div
        className="grid h-14 w-14 place-items-center rounded-xl"
        style={{
          background: "#D1F843",
          color: "#0A1F18",
        }}
      >
        <Zap className="h-7 w-7" strokeWidth={2.2} />
      </div>
      <div>
        <h4
          className="flex flex-wrap items-center gap-2 text-base font-bold leading-tight tracking-[-0.01em]"
          style={{ color: "var(--color-ink, #0A1F18)" }}
        >
          {title}
          {tag ? (
            <span
              className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{
                background: "rgba(0, 88, 64, 0.1)",
                color: "var(--color-primary, #005840)",
              }}
            >
              {tag}
            </span>
          ) : null}
        </h4>
        <p
          className="mt-1.5 text-[13px] leading-[1.55]"
          style={{ color: "var(--color-ink-muted, #5C6B62)" }}
        >
          {description}
        </p>
      </div>
      <div className="hidden sm:block">
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
          style={{
            background: "var(--color-primary, #005840)",
            color: "#FFFFFF",
          }}
        >
          <ArrowRight className="h-4 w-4" />
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
