"use client";

import Image from "next/image";

export default function LandingHomepage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface backdrop-blur-md flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto w-full border-b border-outline-variant/20">
        <div className="text-2xl font-bold tracking-tighter text-on-surface">
          AK Golf Academy
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="font-medium uppercase tracking-wider text-sm text-on-surface border-b-2 border-secondary-fixed pb-1" href="#">Hjem</a>
          <a className="font-medium uppercase tracking-wider text-sm text-on-surface/70 hover:text-on-surface transition-colors" href="/booking">Book nå</a>
          <a className="font-medium uppercase tracking-wider text-sm text-on-surface/70 hover:text-on-surface transition-colors" href="/landing/about">Om oss</a>
          <a className="font-medium uppercase tracking-wider text-sm text-on-surface/70 hover:text-on-surface transition-colors" href="/landing/contact">Kontakt</a>
        </div>
        <div className="flex items-center gap-6">
          <a href="/portal/login" className="font-medium uppercase tracking-wider text-sm text-on-surface/70 hover:text-on-surface">Logg inn</a>
          <a 
            href="/portal"
            className="bg-secondary-fixed text-on-surface px-6 py-2.5 rounded-lg font-medium uppercase tracking-wider text-sm scale-95 active:scale-90 transition-transform hover:opacity-80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
          >
            PlayersHQ
          </a>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative bg-surface overflow-hidden min-h-[870px] flex items-center">
          <div className="max-w-[1440px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface rounded-full mb-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface font-bold">Systematisk golf coaching</span>
                <div className="w-1 h-1 rounded-full bg-lime-dark"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface/60">Est. 2024</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-semibold text-on-surface leading-[1.05] tracking-tight mb-8">
                Bli en bedre golfspiller — <span className="text-lime-bright italic">med system</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant/80 max-w-lg mb-12 leading-relaxed">
                AK Golf Academy kombinerer individuell coaching med en digital treningsplattform som følger deg mellom sesjonene. Strukturert utvikling for golfspillere på alle nivåer.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/booking" className="bg-secondary-fixed text-on-surface px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                  Book nå
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </a>
                <a href="/landing/about" className="bg-transparent border-2 border-black/20 text-on-surface px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-black hover:bg-on-surface/5 transition-all inline-flex items-center">
                  Les mer
                </a>
              </div>
            </div>
            <div className="relative h-[600px] lg:h-[800px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-surface rounded-[48px] overflow-hidden">
                <Image
                  src="/images/hero/hero-main.jpg"
                  alt="Golfspiller i sving"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-forest-alt/10 to-transparent flex items-center justify-center">
                  <span className="material-symbols-outlined text-[200px] text-on-surface/10">sports_golf</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-outline-variant/20">
                <div className="w-16 h-16 rounded-2xl bg-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-fixed text-3xl">insights</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-on-surface/50 tracking-widest mb-1">Spillere coachet</p>
                  <p className="text-2xl font-bold text-on-surface">200+</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slik fungerer det */}
        <section className="py-32 px-8 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-on-surface tracking-tight mb-6">Treningsabonnement</h2>
              <p className="text-on-surface-variant/80 text-lg">Systematisk coaching med alt inkludert. Ikke bare én time i blant — men kontinuerlig utvikling med oppfølging mellom hver sesjon.</p>
              <p className="text-lime-dark text-sm mt-3 font-medium">Lanseres i starten av mai 2026</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-[32px] border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface text-3xl">calendar_today</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-on-surface/40 mb-2">Steg 1</div>
              <h3 className="text-2xl font-semibold text-on-surface mb-4">Book selv</h3>
              <p className="text-on-surface-variant/80 leading-relaxed">Book selv i appen. Velg tid som passer deg. Performance Pro-medlemmer ser tider 14 dager frem, Performance ser 7 dager.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[32px] border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface text-3xl">sports_golf</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-on-surface/40 mb-2">Steg 2</div>
              <h3 className="text-2xl font-semibold text-on-surface mb-4">20 minutter med fokus</h3>
              <p className="text-on-surface-variant/80 leading-relaxed">Én ting per sesjon. Teknisk veiledning etter plan — ikke tilfeldig trening. TrackMan bekrefter at endringene sitter.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[32px] border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface text-3xl">trending_up</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-on-surface/40 mb-2">Steg 3</div>
              <h3 className="text-2xl font-semibold text-on-surface mb-4">Tren mellom sesjonene</h3>
              <p className="text-on-surface-variant/80 leading-relaxed">Treningsplanen oppdateres etter hver sesjon. Øvelsesbank, statistikk og progresjonslogging holder deg på sporet.</p>
            </div>
          </div>
        </section>

        {/* Om oss */}
        <section className="py-32 bg-surface overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mb-8 font-mono text-xs uppercase tracking-widest text-on-surface/60 flex items-center gap-4">
                <div className="h-px w-12 bg-on-surface/20"></div>
                Om oss
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-6">
                Systematisk golf coaching golfcoaching
              </h2>
              <p className="text-xl text-on-surface-variant/80 leading-relaxed mb-8">
                AK Golf Academy drives av Anders Kristiansen — en coach som har jobbet med spillere på PGA Tour, DP World Tour og Ladies European Tour. Metodikken bygger på teknisk veiledning etter plan, ikke bare data fra TrackMan.
              </p>
              <p className="text-lg text-on-surface-variant/80 leading-relaxed mb-8">
                Hver spiller får en individuell utviklingsplan som oppdateres etter hver sesjon, slik at du alltid vet hva du skal jobbe med og hvorfor.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-3 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-on-surface flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-xl">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">Gamle Fredrikstad GK</h4>
                    <p className="text-on-surface-variant/80 text-xs mt-1">Kongleveien 142, 1615 Fredrikstad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-on-surface flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-xl">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">Miklagard Golfklubb</h4>
                    <p className="text-on-surface-variant/80 text-xs mt-1">Svingen 120, 2114 Disenå</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-on-surface/10">
                <Image
                  src="/images/academy/AK-Golf-Academy-1.jpg"
                  alt="AK Golf Academy fasiliteter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-on-surface overflow-hidden relative">
          <div className="max-w-[1440px] mx-auto px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-surface tracking-tight mb-6">
              Klar for å ta golfen til neste nivå?
            </h2>
            <p className="text-xl text-surface/70 max-w-2xl mx-auto mb-10">
              Start med et 3-sesjers Start-pakke, eller gå rett på Performance-abonnement. Du velger.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/booking" className="bg-secondary-fixed text-on-surface px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform inline-flex items-center">
                Book nå
              </a>
              <a href="/landing/contact" className="border-2 border-white/30 text-surface px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-surface-container-lowest/10 transition-all inline-flex items-center">
                Kontakt oss
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-outline-variant/20 bg-surface flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8">
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-on-surface text-xl">AK Golf Academy</div>
          <p className="text-sm tracking-normal text-on-surface/60">© 2024 AK Golf Group AS. Alle rettigheter reservert.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <a className="text-sm tracking-normal text-on-surface/60 hover:text-secondary-fixed transition-colors" href="/personvern">Personvern</a>
          <a className="text-sm tracking-normal text-on-surface/60 hover:text-secondary-fixed transition-colors" href="/personvern">Vilkår</a>
          <a className="text-sm tracking-normal text-on-surface/60 hover:text-secondary-fixed transition-colors" href="/landing/contact">Kontakt</a>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-beige-warm flex items-center justify-center hover:bg-secondary-fixed transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-surface text-xl">public</span>
          </div>
        </div>
      </footer>
    </>
  );
}
