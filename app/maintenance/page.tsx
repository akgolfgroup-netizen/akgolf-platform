"use client";

import Link from "next/link";
import { Wrench, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default function MaintenancePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-white"
      style={{
        background: "var(--akgolf-ink, #0A1F18)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[640px] text-center">
        <Link
          href="/"
          className="mx-auto mb-12 inline-flex items-center gap-2.5 text-[18px] font-extrabold tracking-[-0.02em] text-white"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-[14px] font-extrabold tracking-[-0.04em]"
            style={{
              background: "var(--akgolf-accent, #D1F843)",
              color: "#0A1F18",
            }}
          >
            AK
          </span>
          AK Golf
        </Link>

        <div
          className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(209,248,67,0.18)",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          <Wrench className="h-7 w-7" />
        </div>

        <div
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          VEDLIKEHOLD PÅGÅR
        </div>

        <h1
          className="mb-5 text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white text-balance"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Vi er straks{" "}
          <em
            className="font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-accent, #D1F843)",
            }}
          >
            tilbake
          </em>
          .
        </h1>

        <p className="mx-auto mb-9 max-w-[50ch] text-[17px] leading-[1.55] text-white/70">
          AK Golf gjennomfører vedlikehold for å gi deg en bedre opplevelse.
          Vi er tilbake om kort tid.
        </p>

        <a
          href="mailto:post@akgolf.no"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
        >
          <Mail className="h-4 w-4" strokeWidth={2.4} />
          Kontakt support
        </a>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.20em] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        © 2026 AK GOLF GROUP
      </div>
    </div>
  );
}
