import Link from "next/link";
import { ACCENT_COLORS, type Accent } from "@/lib/design-tokens";

export function ServiceCard({
  title,
  description,
  features,
  href,
  accent,
}: {
  title: string;
  description: string;
  features: readonly string[];
  href: string;
  accent: Accent;
}) {
  return (
    <Link href={href} className="group block">
      <div className="w-service-card h-full flex flex-col">
        {/* Accent bar */}
        <div className={`h-1 w-12 rounded-full ${ACCENT_COLORS[accent]} mb-6`} />

        <h3 className="w-heading-sm mb-3 transition-opacity duration-300 group-hover:opacity-80">
          {title}
        </h3>

        <p className="text-sm text-ink-50 leading-relaxed mb-6 flex-1">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-ink-60">
              <span className={`w-1 h-1 rounded-full ${ACCENT_COLORS[accent]} shrink-0`} />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-ink-70 group-hover:text-ink-90 transition-colors duration-300">
          Les mer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
