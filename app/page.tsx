"use client";

import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  MapPin,
  GolfIcon,
} from "@/components/shared/icons";

export default function LandingHomepage() {
  return (
    <>
      <Navbar variant="light" />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-[#fdf9f0] overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f7f3ea] rounded-full mb-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#154212] font-bold">Systematisk golf coaching</span>
                <div className="w-1 h-1 rounded-full bg-[#576500]"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#154212]/60">Est. 2024</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#154212] leading-[1.05] tracking-tight mb-8">
                Bli en bedre golfspiller — <span className="text-[#b8d300] italic">med system</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#42493e] max-w-lg mb-12 leading-relaxed">
                AK Golf Academy kombinerer individuell coaching med en digital treningsplattform som følger deg mellom sesjonene. Strukturert utvikling for golfspillere på alle nivåer.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/booking-temp"
                  className="bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]"
                >
                  Se pakker og priser
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/landing/about"
                  className="bg-transparent border-2 border-[#154212]/20 text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-[#154212] hover:bg-[#154212]/5 transition-all"
                >
                  Les mer
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-[#f7f3ea] rounded-[48px] overflow-hidden">
                <img 
                  src="/images/hero/hero-main.jpg" 
                  alt="Golfspiller i sving"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a27]/10 to-transparent flex items-center justify-center">
                  <GolfIcon className="w-48 h-48 text-[#154212]/10" />
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-[#154212]/5">
                <div className="w-16 h-16 rounded-2xl bg-[#154212] flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#d2f000]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#154212]/50 tracking-widest mb-1">Spillere coachet</p>
                  <p className="text-2xl font-bold text-[#154212]">200+</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slik fungerer det */}
        <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#154212] tracking-tight mb-6">Treningsabonnement</h2>
              <p className="text-[#42493e] text-lg">Systematisk coaching med alt inkludert. Ikke bare én time i blant — men kontinuerlig utvikling med oppfølging mellom hver sesjon.</p>
              <p className="text-[#576500] text-sm mt-3 font-medium">Lanseres i starten av mai 2026</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 lg:p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <Calendar className="w-8 h-8 text-[#154212]" />
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 1</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">Book selv</h3>
              <p className="text-[#42493e] leading-relaxed">Book selv i appen. Velg tid som passer deg. Performance Pro-medlemmer ser tider 14 dager frem, Performance ser 7 dager.</p>
            </div>
            <div className="bg-white p-8 lg:p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <GolfIcon className="w-8 h-8 text-[#154212]" />
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 2</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">20 minutter med fokus</h3>
              <p className="text-[#42493e] leading-relaxed">Én ting per sesjon. Teknisk veiledning etter plan — ikke tilfeldig trening. TrackMan bekrefter at endringene sitter.</p>
            </div>
            <div className="bg-white p-8 lg:p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="w-8 h-8 text-[#154212]" />
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 3</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">Tren mellom sesjonene</h3>
              <p className="text-[#42493e] leading-relaxed">Treningsplanen oppdateres etter hver sesjon. Øvelsesbank, statistikk og progresjonslogging holder deg på sporet.</p>
            </div>
          </div>
        </section>

        {/* Om oss */}
        <section className="py-24 lg:py-32 bg-[#f7f3ea] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mb-8 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center gap-4">
                <div className="h-px w-12 bg-[#154212]/20"></div>
                Om oss
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight mb-6">
                Systematisk golf coaching
              </h2>
              <p className="text-xl text-[#42493e] leading-relaxed mb-8">
                AK Golf Academy drives av Anders Kristiansen — en coach som har jobbet med spillere på PGA Tour, DP World Tour og Ladies European Tour. Metodikken bygger på teknisk veiledning etter plan, ikke bare data fra TrackMan.
              </p>
              <p className="text-lg text-[#42493e] leading-relaxed mb-8">
                Hver spiller får en individuell utviklingsplan som oppdateres etter hver sesjon, slik at du alltid vet hva du skal jobbe med og hvorfor.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#154212]">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Gamle Fredrikstad GK</span>
                </div>
                <div className="flex items-center gap-2 text-[#154212]">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Miklagard Golfklubb</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="/landing/about"
                  className="inline-flex items-center gap-2 text-[#154212] font-semibold hover:text-[#d2f000] transition-colors"
                >
                  Les mer om oss
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-[#154212]/10">
                <img 
                  src="/images/academy/AK-Golf-Academy-15.jpg" 
                  alt="AK Golf Academy fasiliteter"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#154212]/20"></div>
              Vårt team
              <div className="h-px w-12 bg-[#154212]/20"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight">Møt coacherne</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Anders */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg">
              <div className="aspect-[4/3] bg-[#f7f3ea]">
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
                <p className="text-[#42493e] mb-4">
                  Har coachet spillere på PGA Tour, DP World Tour og Ladies European Tour. Kombinerer teknisk veiledning med TrackMan-analyse.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">PGA Tour erfaring</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">TrackMan</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">DECADE</span>
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
                <p className="text-[#42493e] mb-4">
                  College-golf fra USA, bachelor i business. Spesialisert på gruppetrening, banecoaching og nybegynneropplæring.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">College-golf USA</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">Gruppetrening</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded">Nybegynnere</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#154212] overflow-hidden relative">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Klar for å ta golfen til neste nivå?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Start med et 3-sesjers Start-pakke, eller gå rett på Performance-abonnement. Du velger.
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
                className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
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
