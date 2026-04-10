"use client";

import Link from "next/link";
import { Check, Calendar, Download, Mail, ArrowRight, LayoutDashboard } from "@/components/shared/icons";

export default function BookingConfirmedPage() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center bg-surface">
      <div className="w-full max-w-2xl text-center mb-16">
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-accent-cta rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-pulse opacity-20"></div>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Bekreftet • Booking Ref: AKA-2025-0482</p>
        <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tighter mb-6">Booking bekreftet!</h1>
        <p className="text-text text-lg max-w-lg mx-auto">
          Din coaching-session er reservert. Vi har sendt en bekreftelse til din e-post.
        </p>
      </div>

      <div className="w-full grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-8 shadow-sm flex flex-col border-b border-primary/10">
          <div className="flex justify-between items-start mb-10 pb-6 border-b border-primary/10">
            <div>
              <h2 className="text-2xl font-semibold text-primary">Session detaljer</h2>
              <p className="text-text">Gjennomgå detaljene for din coaching</p>
            </div>
            <div className="bg-accent-cta px-4 py-2 rounded-full">
              <span className="font-mono text-sm font-medium text-primary uppercase">Bekreftet</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">Pakke</label>
              <p className="text-xl font-semibold text-primary">Performance Pro</p>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">Coach</label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface overflow-hidden">
                  <img src="/images/team/anders-kristiansen.jpg" alt="Anders Kristiansen" className="w-full h-full object-cover"/>
                </div>
                <p className="text-xl font-semibold text-primary">Anders Kristiansen</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">Dato</label>
              <p className="text-xl font-semibold text-primary">8. april 2025</p>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">Tid</label>
              <p className="text-xl font-semibold text-primary">12:00 — 12:20 (20 min)</p>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">Lokasjon</label>
              <p className="text-xl font-semibold text-primary">Gamle Fredrikstad GK</p>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text">TrackMan</label>
              <p className="text-xl font-semibold text-primary">Inkludert</p>
            </div>
          </div>
          <div className="mt-12 p-6 bg-surface rounded-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary">Viktig å huske</p>
              <p className="text-sm text-text">Møt opp 5 minutter før. Ved kansellering må dette gjøres minst 24 timer i forveien.</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-cta" />
              Legg til kalender
            </h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 transition-all rounded-lg flex items-center justify-between group">
                <span className="font-medium text-sm">Google Calendar</span>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
              </button>
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 transition-all rounded-lg flex items-center justify-between group">
                <span className="font-medium text-sm">iCal / Outlook</span>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-primary/10">
            <h3 className="text-lg font-bold text-primary mb-4">Last ned bekreftelse</h3>
            <p className="text-sm text-text mb-6 leading-relaxed">Få bekreftelsen tilsendt på e-post eller last ned som PDF.</p>
            <div className="flex gap-2">
              <button className="flex-1 py-3 px-4 bg-surface hover:bg-accent-cta transition-all rounded-lg border border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />E-post
              </button>
              <button className="flex-1 py-3 px-4 bg-surface hover:bg-accent-cta transition-all rounded-lg border border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />PDF
              </button>
            </div>
          </div>

          <div className="bg-accent-cta rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary mb-2">Spørsmål?</h3>
            <p className="text-sm text-primary/70 mb-4">Kontakt oss på support@akgolf.no</p>
            <a href="mailto:support@akgolf.no" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
              Send e-post <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full flex flex-col md:flex-row items-center justify-center gap-6">
        <Link className="w-full md:w-auto px-12 py-4 bg-primary text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3" href="/portal">
          <LayoutDashboard className="w-5 h-5" />
          Gå til spillerportalen
        </Link>
        <Link className="w-full md:w-auto px-12 py-4 border border-primary text-primary rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-primary/5 transition-colors flex items-center justify-center" href="/booking/select-service">
          Book flere sesjoner
        </Link>
      </div>

      <footer className="mt-24 pt-12 border-b border-primary/10 w-full text-center">
        <p className="font-mono text-[10px] text-text uppercase tracking-[0.3em]">AK Golf Academy • akgolf.no</p>
      </footer>
    </main>
  );
}
