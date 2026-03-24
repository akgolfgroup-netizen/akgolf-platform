import Link from "next/link";

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col h-full transition-all duration-400 ${
        highlighted
          ? "bg-ink-90 text-white border-2 border-gold/30 shadow-xl relative"
          : "bg-white border border-ink-10 hover:border-ink-20 hover:shadow-lg"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-8 bg-gold text-white text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1 rounded-full">
          Mest populær
        </span>
      )}

      <h3 className={`font-display text-xl font-semibold mb-1 ${highlighted ? "text-white" : "text-ink-90"}`}>
        {name}
      </h3>
      <p className={`font-mono text-lg mb-3 ${highlighted ? "text-gold" : "text-gold-text"}`}>
        {price}
      </p>
      <p className={`text-sm leading-relaxed mb-6 ${highlighted ? "text-ink-30" : "text-ink-50"}`}>
        {description}
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 mt-0.5 text-gold"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className={highlighted ? "text-ink-20" : "text-ink-60"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/#apply"
        className={`w-btn text-center ${
          highlighted ? "w-btn-gold" : "w-btn-primary"
        }`}
      >
        Reserver din plass
      </Link>
    </div>
  );
}
