"use client";

export default function LandingHomepage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#fdf9f0] backdrop-blur-md flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto w-full border-b border-[#154212]/5">
        <div className="text-2xl font-bold tracking-tighter text-[#154212]">
          AK Golf Academy
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="font-medium uppercase tracking-wider text-sm text-[#154212] border-b-2 border-[#d2f000] pb-1" href="#">Hjem</a>
          <a className="font-medium uppercase tracking-wider text-sm text-[#154212]/70 hover:text-[#154212] transition-colors" href="#">Pakker</a>
          <a className="font-medium uppercase tracking-wider text-sm text-[#154212]/70 hover:text-[#154212] transition-colors" href="#">Om oss</a>
          <a className="font-medium uppercase tracking-wider text-sm text-[#154212]/70 hover:text-[#154212] transition-colors" href="#">Kontakt</a>
        </div>
        <div className="flex items-center gap-6">
          <button className="font-medium uppercase tracking-wider text-sm text-[#154212]/70 hover:text-[#154212]">Logg inn</button>
          <button className="bg-[#d2f000] text-[#154212] px-6 py-2.5 rounded-lg font-medium uppercase tracking-wider text-sm scale-95 active:scale-90 transition-transform hover:opacity-80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">Bli medlem</button>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative bg-[#fdf9f0] overflow-hidden min-h-[870px] flex items-center">
          <div className="max-w-[1440px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f7f3ea] rounded-full mb-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#154212] font-bold">Systematisk golf coaching</span>
                <div className="w-1 h-1 rounded-full bg-[#576500]"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#154212]/60">Est. 2024</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-semibold text-[#154212] leading-[1.05] tracking-tight mb-8">
                Bli en bedre golfspiller — <span className="text-[#b8d300] italic">med system</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#42493e] max-w-lg mb-12 leading-relaxed">
                AK Golf Academy kombinerer individuell coaching med en digital treningsplattform som følger deg mellom sesjonene. Strukturert utvikling for golfspillere på alle nivåer.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                  Se pakker og priser
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
                <button className="bg-transparent border-2 border-[#154212]/20 text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-[#154212] hover:bg-[#154212]/5 transition-all">
                  Les mer
                </button>
              </div>
            </div>
            <div className="relative h-[600px] lg:h-[800px] w-full flex items-center justify-center">
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
                  <span className="material-symbols-outlined text-[200px] text-[#154212]/10">sports_golf</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-[#154212]/5">
                <div className="w-16 h-16 rounded-2xl bg-[#154212] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#d2f000] text-3xl">insights</span>
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
        <section className="py-32 px-8 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#154212] tracking-tight mb-6">Slik fungerer det</h2>
              <p className="text-[#42493e] text-lg">20 minutter som endrer spillet ditt. Tradisjonell golfcoaching er én time, én gang i blant, uten oppfølging mellom sesjonene. Vi gjør det annerledes.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#154212] text-3xl">calendar_today</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 1</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">Book selv</h3>
              <p className="text-[#42493e] leading-relaxed">Book selv i appen. Velg tid som passer deg. Performance Pro-medlemmer ser tider 14 dager frem, Performance ser 7 dager.</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#154212] text-3xl">sports_golf</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 2</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">20 minutter med fokus</h3>
              <p className="text-[#42493e] leading-relaxed">Én ting per sesjon. Teknisk veiledning etter plan — ikke tilfeldig trening. TrackMan bekrefter at endringene sitter.</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] border border-[#154212]/5 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#154212] text-3xl">trending_up</span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#154212]/40 mb-2">Steg 3</div>
              <h3 className="text-2xl font-semibold text-[#154212] mb-4">Tren mellom sesjonene</h3>
              <p className="text-[#42493e] leading-relaxed">Treningsplanen oppdateres etter hver sesjon. Øvelsesbank, statistikk og progresjonslogging holder deg på sporet.</p>
            </div>
          </div>
        </section>

        {/* Om oss */}
        <section className="py-32 bg-[#f7f3ea] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mb-8 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center gap-4">
                <div className="h-px w-12 bg-[#154212]/20"></div>
                Om oss
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight mb-6">
                Systematisk golf coaching golfcoaching
              </h2>
              <p className="text-xl text-[#42493e] leading-relaxed mb-8">
                AK Golf Academy drives av Anders Kristiansen — en coach som har jobbet med spillere på PGA Tour, DP World Tour og Ladies European Tour. Metodikken bygger på teknisk veiledning etter plan, ikke bare data fra TrackMan.
              </p>
              <p className="text-lg text-[#42493e] leading-relaxed mb-8">
                Hver spiller får en individuell utviklingsplan som oppdateres etter hver sesjon, slik at du alltid vet hva du skal jobbe med og hvorfor.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#154212]">
                  <span className="material-symbols-outlined">location_on</span>
                  <span className="font-medium">Gamle Fredrikstad GK</span>
                </div>
                <div className="flex items-center gap-2 text-[#154212]">
                  <span className="material-symbols-outlined">location_on</span>
                  <span className="font-medium">Miklagard Golfklubb</span>
                </div>
              </div>
              <p className="mt-4 text-[#576500] font-medium">To baner, ett system.</p>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-[#154212]/10">
                <img 
                  src="/images/academy/AK-Golf-Academy-1.jpg" 
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

        {/* CTA Section */}
        <section className="py-24 bg-[#154212] overflow-hidden relative">
          <div className="max-w-[1440px] mx-auto px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Klar for å ta golfen til neste nivå?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Start med et 3-sesjers Start-pakke, eller gå rett på Performance-abonnement. Du velger.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                Se pakker og priser
              </button>
              <button className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Kontakt oss
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#154212]/5 bg-[#f7f3ea] flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8">
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-[#154212] text-xl">AK Golf Academy</div>
          <p className="text-sm tracking-normal text-[#154212]/60">© 2024 AK Golf Group AS. Alle rettigheter reservert.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <a className="text-sm tracking-normal text-[#154212]/60 hover:text-[#d2f000] transition-colors" href="#">Personvern</a>
          <a className="text-sm tracking-normal text-[#154212]/60 hover:text-[#d2f000] transition-colors" href="#">Vilkår</a>
          <a className="text-sm tracking-normal text-[#154212]/60 hover:text-[#d2f000] transition-colors" href="#">Kontakt</a>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#e6e2d9] flex items-center justify-center hover:bg-[#d2f000] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#154212] text-xl">public</span>
          </div>
        </div>
      </footer>
    </>
  );
}
