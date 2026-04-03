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
      className={`rounded-[20px] p-8 flex flex-col h-full transition-[border-color,box-shadow] duration-400 ${
        highlighted
          ? "bg-black text-white border border-black shadow-xl relative"
          : "bg-white border border-grey-200 hover:border-grey-300 hover:shadow-lg"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-8 bg-black text-white text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1 rounded-full border border-grey-700">
          Mest populær
        </span>
      )}

      <h3 className={`font-display text-xl font-semibold mb-1 ${highlighted ? "text-white" : "text-black"}`}>
        {name}
      </h3>
      <p className={`font-mono text-lg mb-3 ${highlighted ? "text-grey-300" : "text-black"}`}>
        {price}
      </p>
      <p className={`text-sm leading-relaxed mb-6 ${highlighted ? "text-grey-400" : "text-grey-500"}`}>
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
              className={`shrink-0 mt-0.5 ${highlighted ? "text-white" : "text-black"}`}
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className={highlighted ? "text-grey-300" : "text-grey-500"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/#apply"
        className={`w-btn text-center ${
          highlighted ? "w-btn-secondary" : "w-btn-primary"
        }`}
      >
        Reserver din plass
      </Link>
    </div>
  );
}
