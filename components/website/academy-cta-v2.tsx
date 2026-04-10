import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AcademyCtaV2() {
  return (
    <section className="bg-[var(--color-primary)] py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Klar til å ta neste steg?
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Akademiet har begrenset kapasitet — maks 65 plasser totalt. Book en
            sesjon i dag og opplev forskjellen strukturert coaching gjør for
            spillet ditt.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent-cta)] text-[var(--color-primary)] font-bold px-10 py-4 rounded-lg hover:brightness-105 transition-all duration-200 text-base"
          >
            Book din første time
            <ArrowRight size={18} />
          </Link>
          <p className="mt-6 text-sm text-white/50">
            Ingen binding. Avbestilling frem til 24 timer før.
          </p>
        </div>
      </div>
    </section>
  );
}
