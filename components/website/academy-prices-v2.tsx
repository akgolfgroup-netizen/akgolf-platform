import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { COACHING_PACKAGES, FLEX_PACKAGES } from "@/lib/website-constants";

export function AcademyPricesV2() {
  return (
    <section id="priser" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[var(--color-primary)] font-bold tracking-widest text-xs uppercase mb-4">
            Pakker og priser
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            Finn pakken som passer deg
          </h2>
          <p className="text-[var(--color-muted)] text-lg">
            Alle abonnementer er uten bindingstid og kan avsluttes naar som helst.
          </p>
        </div>

        {/* Abonnementer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {COACHING_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl p-8 flex flex-col gap-6 border ${
                pkg.highlighted
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] shadow-xl"
                  : "bg-white border-[var(--color-grey-200)] shadow-sm"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--color-accent-cta)] text-[var(--color-primary)] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                </div>
              )}
              <div>
                <h3
                  className={`text-xl font-bold mb-1 ${
                    pkg.highlighted ? "text-white" : "text-[var(--color-text)]"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-sm ${
                    pkg.highlighted ? "text-white/65" : "text-[var(--color-muted)]"
                  }`}
                >
                  {pkg.tagline}
                </p>
              </div>
              <div className="flex items-end gap-1">
                <span
                  className={`text-4xl font-bold ${
                    pkg.highlighted ? "text-white" : "text-[var(--color-text)]"
                  }`}
                >
                  {pkg.price}
                </span>
                <span
                  className={`text-sm mb-1 ${
                    pkg.highlighted ? "text-white/65" : "text-[var(--color-muted)]"
                  }`}
                >
                  {pkg.period}
                </span>
              </div>
              <ul className="space-y-3 flex-grow">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        pkg.highlighted
                          ? "text-[var(--color-accent-cta)]"
                          : "text-[var(--color-success)]"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        pkg.highlighted ? "text-white/80" : "text-[var(--color-text)]"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/booking/select-service"
                className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg transition-all duration-200 text-sm ${
                  pkg.highlighted
                    ? "bg-[var(--color-accent-cta)] text-[var(--color-primary)] hover:brightness-105"
                    : "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                }`}
              >
                Velg {pkg.name}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Flex */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-surface)] p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">
                {FLEX_PACKAGES[0].name}
              </h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {FLEX_PACKAGES[0].tagline}
              </p>
              <ul className="space-y-2">
                {FLEX_PACKAGES[0].includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--color-success)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              <div className="text-right">
                <div className="text-3xl font-bold text-[var(--color-text)]">
                  {FLEX_PACKAGES[0].price}
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  {FLEX_PACKAGES[0].period} &middot; {FLEX_PACKAGES[0].duration}
                </div>
              </div>
              <Link
                href="/booking/select-service"
                className="inline-flex items-center justify-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-bold px-6 py-3 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 text-sm"
              >
                Book Flex-sesjon
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--color-muted)] mt-8">
          Alle priser er inkludert. Ingen bindingstid på abonnementer.
        </p>
      </div>
    </section>
  );
}
