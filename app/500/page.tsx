"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";
import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";

export const dynamic = "force-dynamic";

export default function ServerErrorPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav />
      <main className="flex flex-1 items-center justify-center px-10 py-[140px]">
        <div className="mx-auto max-w-[720px] text-center">
          <div
            className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-2xl"
            style={{
              background: "rgba(184,66,51,0.12)",
              color: "var(--akgolf-danger, #B84233)",
            }}
          >
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-danger, #B84233)",
            }}
          >
            500 · SERVERFEIL
          </div>
          <h1
            className="mb-5 text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Noe gikk{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              galt
            </em>
            .
          </h1>
          <p className="mx-auto mb-9 max-w-[50ch] text-[17px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            Beklager, det oppstod en uventet feil på serveren. Prøv å laste
            siden på nytt, eller gå tilbake til forsiden.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--akgolf-accent,#D1F843)] px-6 py-3.5 text-sm font-bold text-[var(--akgolf-ink,#0A1F18)] transition-all hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(209,248,67,0.35)]"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.4} />
              Last siden på nytt
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(10,31,24,0.20)] bg-transparent px-6 py-3.5 text-sm font-bold text-[var(--akgolf-ink,#0A1F18)] transition-all hover:bg-[var(--akgolf-ink,#0A1F18)] hover:text-white"
            >
              Tilbake til forsiden
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}
