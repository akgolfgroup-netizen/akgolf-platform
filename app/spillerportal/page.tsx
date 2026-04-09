"use client";

import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight } from "@/components/shared/icons";

export default function SpillerportalLandingPage() {
  return (
    <>
      <Navbar variant="light" />
      
      <main className="min-h-screen bg-[#fdf9f0] pt-32 pb-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d2f000]/20 rounded-full mb-8">
              <svg className="w-4 h-4 text-[#154212]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-widest text-[#154212] font-bold">
                Kommer snart
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#154212] tracking-tight mb-6">
              Spillerportalen
            </h1>
            
            <p className="text-xl text-[#42493e] leading-relaxed mb-8">
              Din personlige golf-dashboard. Følg progresjonen din, 
              få tilgang til treningsplaner, statistikk og coaching-notater — alt på ett sted.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
              >
                Book coaching
              </Link>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            <div className="bg-white p-8 rounded-[32px] border border-[#154212]/5 text-center">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#154212] mb-2">Treningsplan</h3>
              <p className="text-[#42493e] text-sm">
                Personlige treningsplaner oppdatert etter hver coaching-sesjon
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-[#154212]/5 text-center">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#154212] mb-2">Statistikk</h3>
              <p className="text-[#42493e] text-sm">
                Spillstatistikk, handicap-tracking og progresjon over tid
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-[#154212]/5 text-center">
              <div className="w-14 h-14 bg-[#f7f3ea] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#154212] mb-2">Coaching-notater</h3>
              <p className="text-[#42493e] text-sm">
                Tilgang til alle coaching-notater og videoer fra sessjonene dine
              </p>
            </div>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-[#154212] rounded-[32px] p-8 md:p-12 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Portalen lanseres snart
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Vi jobber med å ferdigstille spillerportalen. 
              Inntil videre kan du booke coaching og vi sender deg informasjon på e-post.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#d2f000] text-[#154212] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Book coaching nå
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-20 text-center">
            <p className="text-[#576500] font-medium">
              Spillerportalen lanseres i løpet av våren 2026
            </p>
          </div>
        </div>
      </main>

      <Footer variant="light" />
    </>
  );
}
