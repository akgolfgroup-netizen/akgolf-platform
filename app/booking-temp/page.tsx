"use client";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TemporaryBookingPage() {
  return (
    <>
      <Navbar variant="light" />
      
      <main className="min-h-screen bg-[#fdf9f0] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[#154212] hover:text-[#d2f000] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til forsiden
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#154212] tracking-tight mb-4">
              Book coaching
            </h1>
            <p className="text-[#42493e] text-lg max-w-2xl">
              Velg tid som passer deg. Ved spørsmål, kontakt oss på{' '}
              <a href="mailto:post@akgolf.no" className="text-[#576500] hover:underline">
                post@akgolf.no
              </a>
            </p>
          </div>

          {/* Acuity Scheduling Embed */}
          <div className="bg-white rounded-[32px] shadow-lg border border-[#154212]/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[#154212]/5 bg-[#f7f3ea]">
              <p className="text-sm text-[#576500] font-medium">
                🔒 Sikker booking via Acuity Scheduling
              </p>
            </div>
            
            <div className="relative" style={{ minHeight: '800px' }}>
              <iframe 
                src="https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=11780416&ref=embedded_csp" 
                title="Schedule Appointment" 
                width="100%" 
                height="800" 
                frameBorder="0" 
                allow="payment"
                className="w-full"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#154212]/5">
              <div className="w-12 h-12 bg-[#f7f3ea] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#154212] mb-2">20 minutters økter</h3>
              <p className="text-[#42493e] text-sm">
                Fokuserte sesjoner med én ting per gang. Ingen fyllminutter.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#154212]/5">
              <div className="w-12 h-12 bg-[#f7f3ea] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#154212] mb-2">Gamle Fredrikstad GK</h3>
              <p className="text-[#42493e] text-sm">
                Stevnsgt. 135, 1605 Fredrikstad
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#154212]/5">
              <div className="w-12 h-12 bg-[#f7f3ea] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#154212] mb-2">Betal enkelt</h3>
              <p className="text-[#42493e] text-sm">
                Betal med kort eller Vipps direkte i bookingen.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#42493e] mb-4">
              Ønsker du å vite mer om våre coaching-pakker?
            </p>
            <Link
              href="/landing/pricing"
              className="inline-flex items-center gap-2 bg-[#154212] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all"
            >
              Se priser og pakker
            </Link>
          </div>
        </div>
      </main>

      <Footer variant="light" />
      
      {/* Acuity Embed Script */}
      <script 
        src="https://embed.acuityscheduling.com/js/embed.js" 
        type="text/javascript"
      />
    </>
  );
}
