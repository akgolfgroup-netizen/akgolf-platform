"use client";

import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CheckCircle } from "@/components/shared/icons";
import {
  COACHING_SUBSCRIPTION_PRODUCTS,
  FLEX_PRODUCTS,
} from "@/lib/stripe/products";
import { COACHING_PACKAGES, BANECOACHING } from "@/lib/website-constants";

function formatNok(ore: number) {
  return new Intl.NumberFormat("no-NO").format(ore / 100);
}

export default function LandingPricingPage() {
  // Use Anders' packages for feature copy; prices from Stripe config
  const andersPackages = COACHING_PACKAGES.filter(
    (p) => p.coach === "Anders"
  );

  const performancePkg = andersPackages.find((p) => p.name === "Performance");
  const performanceProPkg = andersPackages.find(
    (p) => p.name === "Performance Pro"
  );

  const subProAmount = formatNok(
    COACHING_SUBSCRIPTION_PRODUCTS.performancePro.amount
  );
  const subAmount = formatNok(
    COACHING_SUBSCRIPTION_PRODUCTS.performance.amount
  );
  const flex50Amount = formatNok(FLEX_PRODUCTS.flex50.amount);
  const flex90Amount = formatNok(FLEX_PRODUCTS.flex90.amount);

  const bane9 = BANECOACHING.find((b) => b.name === "Banecoaching 9 hull");
  const banePar3 = BANECOACHING.find((b) => b.name === "Korthullsbane-økt");

  return (
    <>
      <Navbar variant="light" />

      <main className="pt-32 pb-24 px-6 max-w-[1280px] mx-auto">
        <header className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-on-surface opacity-60 mb-4 block">
            Alle pakker inkluderer PlayersHQ
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Velg ditt nivå
          </h1>
          <p className="text-on-surface-variant/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Alle pakker inkluderer full tilgang til AK Golf PlayersHQ —
            treningsplaner, øvelsesbank, statistikk og progresjonslogging.
            Coaching-tjenester er MVA-fritatt.
          </p>
        </header>

        {/* Abonnement */}
        <div className="mb-16">
          <h2 className="text-center text-2xl font-bold text-on-surface mb-10 uppercase tracking-wider">
            Abonnement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Performance Pro */}
            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 flex flex-col h-full border-2 border-secondary-fixed shadow-[0_4px_32px_rgba(45,90,39,0.08)] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-fixed text-on-surface font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                Mest populær
              </div>
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Abonnement
                </h3>
                <div className="text-4xl font-bold text-on-surface mb-1">
                  Performance Pro
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-bold text-on-surface">
                    {subProAmount} kr
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">/mnd</span>
                </div>
              </div>
              <div className="flex-grow space-y-4 mb-10">
                {(performanceProPkg?.features ?? [
                  "4 × 20 min coaching per måned",
                  "TrackMan analyse",
                  "Selvbooking 14 dager frem",
                  "Prioritert tilgang",
                  "Full PlayersHQ",
                ]).map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant/80 mb-6 italic">
                Passer for: Ambisiøse spillere som trener 3+ ganger i uken.
              </p>
              <Link
                href="/booking"
                className="w-full py-4 bg-secondary-fixed text-on-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(210,240,0,0.4)] transition-all duration-300 transform hover:scale-[1.02] text-center block"
              >
                Velg Performance Pro
              </Link>
            </div>

            {/* Performance */}
            <div className="bg-surface rounded-[1.5rem] p-8 flex flex-col h-full border border-transparent transition-all hover:bg-beige-hover">
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Abonnement
                </h3>
                <div className="text-4xl font-bold text-on-surface mb-1">
                  Performance
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-bold text-on-surface">
                    {subAmount} kr
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">/mnd</span>
                </div>
              </div>
              <div className="flex-grow space-y-4 mb-10">
                {(performancePkg?.features ?? [
                  "2 × 20 min coaching per måned",
                  "TrackMan analyse",
                  "Selvbooking 7 dager frem",
                  "Full PlayersHQ",
                  "Treningsplan oppdatert etter hver sesjon",
                ]).map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant/80 mb-6 italic">
                Passer for: Klubbspillere som spiller 1–2 ganger i uken.
              </p>
              <Link
                href="/booking"
                className="w-full py-4 border-2 border-black text-on-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-on-surface hover:text-surface transition-all duration-300 text-center block"
              >
                Velg Performance
              </Link>
            </div>
          </div>
        </div>

        {/* Onboarding */}
        <div className="mb-16">
          <h2 className="text-center text-2xl font-bold text-on-surface mb-10 uppercase tracking-wider">
            Onboarding
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 border border-black/10">
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Onboarding
                </h3>
                <div className="text-4xl font-bold text-on-surface mb-1">Start</div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-bold text-on-surface">3 000 kr</span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">
                    /engangsavgift
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  "3 × 20 min individuelle sesjoner over 30 dager",
                  "TrackMan spredningsanalyse med 7-jern og driver",
                  "Personlig teknisk plan",
                  "30 dagers tilgang til PlayersHQ",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant/80 mb-6 italic">
                Passer for: Alle som vil prøve AK Golf-metoden før de forplikter
                seg til abonnement. Etter Start anbefaler vi overgang til
                Performance eller Performance Pro.
              </p>
              <Link
                href="/booking"
                className="w-full py-4 bg-on-surface text-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-90 transition-all duration-300 text-center block"
              >
                Start nå
              </Link>
            </div>
          </div>
        </div>

        {/* Drop-in */}
        <div className="mb-16">
          <h2 className="text-center text-2xl font-bold text-on-surface mb-10 uppercase tracking-wider">
            Drop-in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-surface rounded-[1.5rem] p-8">
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Drop-in
                </h3>
                <div className="text-3xl font-bold text-on-surface mb-1">Flex 50</div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-on-surface">
                    {flex50Amount} kr
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">/solo</span>
                </div>
                <p className="text-sm text-on-surface-variant/80 mt-2">
                  850 kr per person for duo
                </p>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "Én 50-minutters coaching-sesjon",
                  "Uten binding",
                  "Book 48 timer i forveien",
                  "Coaching-notater i appen",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-error-bright mb-4">
                Ingen PlayersHQ inkludert
              </p>
              <Link
                href="/booking"
                className="w-full py-4 border-2 border-black text-on-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-on-surface hover:text-surface transition-all duration-300 text-center block"
              >
                Book Flex 50
              </Link>
            </div>

            <div className="bg-surface rounded-[1.5rem] p-8">
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Drop-in
                </h3>
                <div className="text-3xl font-bold text-on-surface mb-1">Flex 90</div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-on-surface">
                    {flex90Amount} kr
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">/solo</span>
                </div>
                <p className="text-sm text-on-surface-variant/80 mt-2">
                  1 400 kr per person for duo
                </p>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "Én 90-minutters dypdykk",
                  "Ideell for teknisk gjennomgang",
                  "Putting-analyse eller sesongplanlegging",
                  "Book 48 timer i forveien",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-error-bright mb-4">
                Ingen PlayersHQ inkludert
              </p>
              <Link
                href="/booking"
                className="w-full py-4 border-2 border-black text-on-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-on-surface hover:text-surface transition-all duration-300 text-center block"
              >
                Book Flex 90
              </Link>
            </div>
          </div>
        </div>

        {/* Banecoaching */}
        <div className="mb-16">
          <h2 className="text-center text-2xl font-bold text-on-surface mb-10 uppercase tracking-wider">
            Banecoaching
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 border border-black/10">
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Banecoaching
                </h3>
                <div className="text-3xl font-bold text-on-surface mb-1">
                  Banecoaching 9 hull
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-on-surface">
                    {bane9?.price ?? "3 000"} kr
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">
                    /per spiller
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "9 hull på 18-hullsbanen med Anders",
                  "DECADE-strategi i praksis",
                  "Maks 2 spillere",
                  "Varighet ca. 2,5 timer",
                  "Greenfee inkludert",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/booking"
                className="w-full py-4 bg-on-surface text-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-90 transition-all duration-300 text-center block"
              >
                Book Banecoaching 9 hull
              </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 border border-black/10">
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface/60 mb-2">
                  Banecoaching
                </h3>
                <div className="text-3xl font-bold text-on-surface mb-1">
                  Banecoaching Par 3
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-on-surface">
                    {banePar3?.price && banePar3.price !== "TBD"
                      ? `${banePar3.price} kr`
                      : "Pris kommer"}
                  </span>
                  <span className="text-on-surface-variant/80 opacity-60 text-sm">
                    /per spiller
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "9 hull på korthullsbanen med Markus",
                  "Fokus på kort spill og banemanagement",
                  "Grupper på 4 spillere",
                  "Lav terskel, høyt læringsutbytte",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-on-surface flex-shrink-0" />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/booking"
                className="w-full py-4 bg-on-surface text-surface font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-90 transition-all duration-300 text-center block"
              >
                Book Par 3
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ / Drop-in vs Abonnement */}
        <section className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-on-surface mb-8 text-center">
            Drop-in vs Abonnement
          </h2>
          <div className="bg-surface rounded-xl p-8 mb-6">
            <h3 className="font-bold text-on-surface text-lg mb-3">
              Trenger du binding? Nei. Men det lønner seg.
            </h3>
            <p className="text-on-surface-variant/80 leading-relaxed">
              Flex gir deg coaching uten forpliktelser. Men du får kun
              coaching-notater — ikke PlayersHQ. Ingen treningsplan mellom
              sesjonene, ingen statistikk, ingen progresjon.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border-2 border-secondary-fixed">
            <h3 className="font-bold text-on-surface text-lg mb-3">
              Performance gir deg coaching OG systemet
            </h3>
            <p className="text-on-surface-variant/80 leading-relaxed">
              Performance gir deg coaching OG systemet som gjør at treningen
              mellom sesjonene faktisk fungerer. Det er forskjellen mellom å ta
              en time og å utvikle seg.
            </p>
          </div>
        </section>
      </main>

      <Footer variant="light" />
    </>
  );
}
