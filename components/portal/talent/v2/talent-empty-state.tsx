"use client";

import { Link2Off, MessageCircle } from "lucide-react";
import Link from "next/link";

export function TalentEmptyState() {
  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#102B1E] text-white">
      <header className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2">
          / TALENT · USI A–K
        </div>
        <h1 className="font-display m-0 text-[34px] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
          Hvor langt kan du komme?
        </h1>
      </header>

      <section
        className="relative overflow-hidden rounded-[22px] border-[1.5px] px-8 py-10 grid items-center gap-6"
        style={{
          background:
            "radial-gradient(circle at 80% 25%, rgba(209,248,67,0.08), transparent 55%), #0D2E23",
          borderColor: "rgba(209,248,67,0.20)",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D1F843]/15 text-[#D1F843] grid place-items-center shrink-0">
            <Link2Off className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display m-0 text-[22px] font-extrabold tracking-[-0.02em] leading-tight text-white">
              Ingen talent-data koblet enda
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-[1.6] text-white/70">
              Talent-dashboardet viser USI-bånd, HCP-prognose og percentil mot
              peer-gruppen din — men forutsetter at coachen din har koblet
              spillerprofilen din til turneringsdata fra NGF, WAGR og college-rankings.
              Ta kontakt med coachen din for å få profilen koblet.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/portal/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Tilbake til dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
