import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HERO } from "@/lib/website-constants";

export function AcademyHeroV2() {
  return (
    <section className="bg-[var(--color-primary)] py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[var(--color-accent-cta)] font-bold tracking-widest text-xs uppercase mb-6">
            {HERO.eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Effektiv 1-til-1{" "}
            <span className="text-[var(--color-accent-cta)]">coaching.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl mx-auto">
            {HERO.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking/select-service"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent-cta)] text-[var(--color-primary)] font-bold px-8 py-4 rounded-lg hover:brightness-105 transition-all duration-200 text-base"
            >
              Book din time
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#priser"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200 text-base"
            >
              {HERO.ctaPrimary}
            </Link>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 border-t border-white/15 pt-10">
            {HERO.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
