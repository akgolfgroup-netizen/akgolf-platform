"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MapPin, Calendar, TrendingUp, Target, Dumbbell, Check } from "@/components/shared/icons";

export default function LandingAboutPage() {
  return (
    <>
      <Navbar variant="light" />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-black overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-cta flex items-center gap-4">
                <div className="h-px w-12 bg-accent-cta/40"></div>
                Om oss
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
                Systematisk golf coaching golfcoaching
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                AK Golf Academy kombinerer verdensklasse coaching med en digital plattform 
                som følger deg fra driving rangen til 18. hull.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-black/60 flex items-center gap-4">
                <div className="h-px w-12 bg-black/20"></div>
                Historien
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">
                Fra golfpro til gründer
              </h2>
              <div className="space-y-4 text-grey-500 leading-relaxed">
                <p>
                  Anders Kristiansen har jobbet med noen av verdens beste golfspillere. 
                  Fra PGA Tour til Ladies European Tour — han har sett hva som skiller 
                  elite fra amatør.
                </p>
                <p>
                  Men det var ikke nok. Tradisjonell coaching — én time her og der, 
                  uten oppfølging — fungerer ikke for de fleste. Spillere trenger 
                  struktur mellom sesjonene. De trenger å vite nøyaktig hva de skal 
                  trene på, og hvorfor.
                </p>
                <p>
                  Derfor ble AK Golf Academy til. En metode som kombinerer:
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-cta mt-0.5 flex-shrink-0" />
                    <span>Korte, fokuserte coaching-sesjoner (20 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-cta mt-0.5 flex-shrink-0" />
                    <span>TrackMan-data som bekrefter fremgang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-cta mt-0.5 flex-shrink-0" />
                    <span>Digital treningsplan som oppdateres etter hver sesjon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-cta mt-0.5 flex-shrink-0" />
                    <span>Systematisk oppfølging — ikke tilfeldig trening</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
                <Image
                  src="/images/academy/AK-Golf-Academy-10.jpg"
                  alt="AK Golf Academy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent-cta p-6 rounded-2xl shadow-xl">
                <p className="font-mono text-xs uppercase tracking-widest text-black/60 mb-1">Erfaring</p>
                <p className="text-3xl font-bold text-black">15+ år</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 lg:py-32 bg-grey-50">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-black/60 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-black/20"></div>
                Teamet
                <div className="h-px w-12 bg-black/20"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Møt coacherne</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Anders */}
              <div className="text-center">
                <div className="aspect-[4/3] bg-grey-50 rounded-[32px] overflow-hidden mb-6">
                  <Image
                    src="/images/team/anders-kristiansen.jpg"
                    alt="Anders Kristiansen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black">Anders Kristiansen</h3>
              </div>

              {/* Markus */}
              <div className="text-center">
                <div className="aspect-[4/3] bg-grey-50 rounded-[32px] overflow-hidden mb-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center">
                    <span className="text-accent-cta text-4xl font-bold">M</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black">Markus R. Pedersen</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-black/60 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-black/20"></div>
              Lokasjoner
              <div className="h-px w-12 bg-black/20"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">To baner, ett system</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Gamle Fredrikstad GK */}
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent-cta" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-black mb-1">Gamle Fredrikstad GK</h3>
                  <p className="text-lime-dark text-sm font-medium mb-3">Hovedlokasjon</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <span className="truncate">Kongleveien 142, 1615 Fredrikstad</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <Calendar className="w-4 h-4 text-accent-cta flex-shrink-0" />
                      <span>18 hull, korthullsbane</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <TrendingUp className="w-4 h-4 text-accent-cta flex-shrink-0" />
                      <span>TrackMan 4i</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Miklagard GK */}
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-accent-cta" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-black mb-1">Miklagard Golfklubb</h3>
                  <p className="text-lime-dark text-sm font-medium mb-3">Samarbeidslokasjon</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <span className="truncate">Svingen 120, 2114 Disenå</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <Calendar className="w-4 h-4 text-accent-cta flex-shrink-0" />
                      <span>18 hull</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-grey-500">
                      <Target className="w-4 h-4 text-accent-cta flex-shrink-0" />
                      <span>Banecoaching</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Method Section */}
        <section className="py-24 lg:py-32 bg-black">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-cta flex items-center gap-4">
                  <div className="h-px w-12 bg-accent-cta/40"></div>
                  Metoden
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                  Ikke tilfeldig trening — systematisk utvikling
                </h2>
                <div className="space-y-6 text-white/70 leading-relaxed">
                  <p>
                    Hver spiller får en individuell utviklingsplan (IUP) som oppdateres 
                    etter hver sesjon. Planen inkluderer:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-cta flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Tekniske mål</p>
                        <p className="text-sm">Basert på TrackMan-analyse og video</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-cta flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Treningsplan</p>
                        <p className="text-sm">Øvelser med video og beskrivelse</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-cta flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Progresjonslogging</p>
                        <p className="text-sm">Følg utviklingen over tid</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-cta flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Neste sesjon</p>
                        <p className="text-sm">Booket med mål for økten</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[40px] overflow-hidden bg-forest-alt">
                  <Image
                    src="/images/academy/AK-Golf-Academy-30.jpg"
                    alt="TrackMan analyse"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-grey-50">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-6">
              Klar for å bli en del av AK Golf Academy?
            </h2>
            <p className="text-xl text-grey-500 max-w-2xl mx-auto mb-10">
              Book en gratis 15-minutters samtale for å finne ut hvilken pakke som passer deg best.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/landing/pricing"
                className="bg-accent-cta text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
              >
                Se pakker og priser
              </Link>
              <Link 
                href="/landing/contact"
                className="border-2 border-black text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all"
              >
                Kontakt oss
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="light" />
    </>
  );
}
