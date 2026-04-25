"use client";

import { Icon } from "@/components/ui/icon";
import { GlassPanel } from "@/components/portal/patterns/glass-panel";
import { MonoLabel } from "@/components/portal/patterns/mono-label";
import { NightSurface } from "@/components/portal/patterns/night-surface";

export const dynamic = "force-dynamic";

export default function GlobalError() {
  return (
    <html>
      <body>
        <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <GlassPanel variant="dark" padding="lg" className="text-center">
              <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="error" size={32} className="text-error-container" />
              </div>

              <MonoLabel size="xs" uppercase className="text-[#F2F5F1]/40 block mb-2">
                500 — Server Error
              </MonoLabel>

              <h1 className="text-2xl font-bold text-[#F2F5F1] mb-2">
                Noe gikk galt
              </h1>
              <p className="text-[#F2F5F1]/60 mb-8">
                Beklager, det oppstod en uventet feil. Prøv å laste siden på nytt.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#F2F5F1]/5 hover:bg-[#F2F5F1]/10 text-[#F2F5F1] font-semibold py-3 rounded-xl border border-white/[0.10] transition-all"
                >
                  <Icon name="refresh" size={18} />
                  Last siden på nytt
                </button>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 w-full bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-secondary-fixed font-bold py-3 rounded-xl transition-all"
                >
                  <Icon name="home" size={18} />
                  Til forsiden
                </a>
              </div>
            </GlassPanel>
          </div>
        </NightSurface>
      </body>
    </html>
  );
}
