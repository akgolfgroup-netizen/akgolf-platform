"use client";

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
        <section className="relative bg-[#154212] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-[#d2f000] flex items-center gap-4">
                <div className="h-px w-12 bg-[#d2f000]/40"></div>
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
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center gap-4">
                <div className="h-px w-12 bg-[#154212]/20"></div>
                Historien
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#154212] tracking-tight mb-6">
                Fra golfpro til gründer
              </h2>
              <div className="space-y-4 text-[#42493e] leading-relaxed">
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
                    <Check className="w-5 h-5 text-[#d2f000] mt-0.5 flex-shrink-0" />
                    <span>Korte, fokuserte coaching-sesjoner (20 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#d2f000] mt-0.5 flex-shrink-0" />
                    <span>TrackMan-data som bekrefter fremgang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#d2f000] mt-0.5 flex-shrink-0" />
                    <span>Digital treningsplan som oppdateres etter hver sesjon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#d2f000] mt-0.5 flex-shrink-0" />
                    <span>Systematisk oppfølging — ikke tilfeldig trening</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="/images/academy/AK-Golf-Academy-10.jpg" 
                  alt="AK Golf Academy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#d2f000] p-6 rounded-2xl shadow-xl">
                <p className="font-mono text-xs uppercase tracking-widest text-[#154212]/60 mb-1">Erfaring</p>
                <p className="text-3xl font-bold text-[#154212]">15+ år</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 lg:py-32 bg-[#f7f3ea]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-[#154212]/20"></div>
                Teamet
                <div className="h-px w-12 bg-[#154212]/20"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight">Møt coacherne</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Anders */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg">
                <div className="aspect-[4/3] bg-[#f7f3ea] relative">
                  <img 
                    src="/images/team/anders-kristiansen.jpg" 
                    alt="Anders Kristiansen"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#154212] mb-1">Anders Kristiansen</h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#576500] mb-4">Hovedcoach & Grunnlegger</p>
                  <p className="text-[#42493e] mb-6">
                    Har coachet spillere på PGA Tour, DP World Tour og Ladies European Tour. 
                    Norges beste og dyreste golftrener per time. Kombinerer teknisk veiledning 
                    etter plan med TrackMan-analyse.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">PGA Tour erfaring</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">TrackMan sertifisert</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">DECADE-strategi</span>
                  </div>
                  <div className="bg-[#f7f3ea] rounded-xl p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#154212]/40 mb-2">Tilgjengelighet</p>
                    <p className="text-sm text-[#154212]">Man 12-20, Tirs 13-20, Ons 12-16, Tors 13-20, Fre 10-14</p>
                  </div>
                </div>
              </div>

              {/* Markus */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg">
                <div className="aspect-[4/3] bg-[#f7f3ea] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-[#154212] flex items-center justify-center">
                    <span className="text-[#d2f000] text-4xl font-bold">M</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#154212] mb-1">Markus</h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#576500] mb-4">Assistentcoach</p>
                  <p className="text-[#42493e] mb-6">
                    College-golf fra USA med bachelor i business. Spesialisert på 
                    gruppetrening, banecoaching og nybegynneropplæring. Halv pris av Anders, 
                    samme engasjement.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">College-golf USA</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">Gruppetrening</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">Nybegynnere</span>
                  </div>
                  <div className="bg-[#f7f3ea] rounded-xl p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#154212]/40 mb-2">Tilgjengelighet</p>
                    <p className="text-sm text-[#154212]">Etter avtale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#154212]/20"></div>
              Lokasjoner
              <div className="h-px w-12 bg-[#154212]/20"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight">To baner, ett system</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gamle Fredrikstad GK */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg">
              <div className="aspect-[16/9] bg-[#f7f3ea]">
                <img 
                  src="/images/academy/AK-Golf-Academy-5.jpg" 
                  alt="Gamle Fredrikstad Golfklubb"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#154212] mb-2">Gamle Fredrikstad Golfklubb</h3>
                <p className="text-[#576500] font-medium mb-4">Hovedlokasjon</p>
                <p className="text-[#42493e] mb-6">
                  Vår hovedlokasjon med full tilgang til driving range, korthullsbane, 
                  18-hullsbanen og putting green. TrackMan 4i er tilgjengelig for alle coaching-sesjoner.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <MapPin className="w-4 h-4 text-[#d2f000]" />
                    <span>Stevnsgt. 135, 1605 Fredrikstad</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <Calendar className="w-4 h-4 text-[#d2f000]" />
                    <span>Driving range, 18 hull, korthullsbane</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <TrendingUp className="w-4 h-4 text-[#d2f000]" />
                    <span>TrackMan 4i</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Miklagard GK */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg">
              <div className="aspect-[16/9] bg-[#f7f3ea]">
                <img 
                  src="/images/academy/AK-Golf-Academy-20.jpg" 
                  alt="Miklagard Golfklubb"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#154212] mb-2">Miklagard Golfklubb</h3>
                <p className="text-[#576500] font-medium mb-4">Samarbeidslokasjon</p>
                <p className="text-[#42493e] mb-6">
                  Samarbeid med Miklagard Golfklubb gir våre medlemmer tilgang til en av 
                  Norges beste baner. Perfekt for on-course coaching og turneringsforberedelser.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <MapPin className="w-4 h-4 text-[#d2f000]" />
                    <span>Hvam, 2114 Disenå</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <Calendar className="w-4 h-4 text-[#d2f000]" />
                    <span>18 hull, øvingsområde</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#42493e]">
                    <Target className="w-4 h-4 text-[#d2f000]" />
                    <span>Banecoaching tilgjengelig</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Method Section */}
        <section className="py-24 lg:py-32 bg-[#154212]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-6 font-mono text-xs uppercase tracking-widest text-[#d2f000] flex items-center gap-4">
                  <div className="h-px w-12 bg-[#d2f000]/40"></div>
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
                      <div className="w-8 h-8 rounded-lg bg-[#d2f000] flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-[#154212]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Tekniske mål</p>
                        <p className="text-sm">Basert på TrackMan-analyse og video</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#d2f000] flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-[#154212]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Treningsplan</p>
                        <p className="text-sm">Øvelser med video og beskrivelse</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#d2f000] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-[#154212]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Progresjonslogging</p>
                        <p className="text-sm">Følg utviklingen over tid</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#d2f000] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#154212]" />
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
                <div className="aspect-square rounded-[40px] overflow-hidden bg-[#2d5a27]">
                  <img 
                    src="/images/academy/AK-Golf-Academy-30.jpg" 
                    alt="TrackMan analyse"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#f7f3ea]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight mb-6">
              Klar for å bli en del av AK Golf Academy?
            </h2>
            <p className="text-xl text-[#42493e] max-w-2xl mx-auto mb-10">
              Book en gratis 15-minutters samtale for å finne ut hvilken pakke som passer deg best.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/landing/pricing"
                className="bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
              >
                Se pakker og priser
              </Link>
              <Link 
                href="/landing/contact"
                className="border-2 border-[#154212] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#154212] hover:text-white transition-all"
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
