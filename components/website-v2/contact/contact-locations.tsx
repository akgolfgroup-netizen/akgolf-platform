"use client";

import { ExternalLink, Flag, MapPin } from "lucide-react";

export function ContactLocations() {
  return (
    <section className="bg-white px-10 py-[90px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col items-end justify-between gap-10 md:flex-row">
          <div>
            <div
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              Finn oss
            </div>
            <h2
              className="m-0 text-[clamp(36px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "var(--akgolf-ink, #0A1F18)",
              }}
            >
              Bossum, Fredrikstad.{" "}
              <em
                className="font-medium not-italic"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                15 minutter fra E6.
              </em>
            </h2>
          </div>
          <a
            href="https://maps.google.com/?q=Gamle+Fredrikstad+Golfklubb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] px-5 py-3 text-[13px] font-bold transition-all hover:-translate-y-px"
            style={{
              borderColor: "var(--akgolf-line-light, #E4EAE6)",
              color: "var(--akgolf-ink, #0A1F18)",
              background: "transparent",
            }}
          >
            Åpne i Google Maps
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1.4fr_1fr]">
          <MapTile />
          <LocationCard />
        </div>
      </div>
    </section>
  );
}

function MapTile() {
  return (
    <div
      className="relative grid place-items-center overflow-hidden rounded-[24px] border-[1.5px]"
      style={{
        background: "var(--akgolf-surface, #F4F6F4)",
        borderColor: "var(--akgolf-line-light, #E4EAE6)",
        aspectRatio: "4 / 5",
      }}
    >
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="kn-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(10,31,24,0.05)"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="kn-grid-2"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="rgba(10,31,24,0.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#kn-grid)" />
        <rect width="400" height="500" fill="url(#kn-grid-2)" />
        <path
          d="M -20 320 Q 80 280 180 310 Q 280 340 380 320 L 420 540 L -20 540 Z"
          fill="rgba(0,88,64,0.06)"
        />
        <path
          d="M 60 100 Q 180 140 320 110"
          fill="none"
          stroke="rgba(0,88,64,0.15)"
          strokeWidth="1.5"
          strokeDasharray="3,4"
        />
        <path
          d="M 80 220 Q 200 180 340 230"
          fill="none"
          stroke="rgba(0,88,64,0.12)"
          strokeWidth="1"
        />
        <path
          d="M 40 380 Q 200 340 380 390"
          fill="none"
          stroke="rgba(10,31,24,0.10)"
          strokeWidth="2"
        />
        <path
          d="M 200 50 L 200 460"
          fill="none"
          stroke="rgba(10,31,24,0.08)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />
      </svg>

      <div
        className="absolute grid h-9 w-9 place-items-center rounded-full border-[3px] shadow-[0_8px_16px_rgba(10,31,24,0.20)]"
        style={{
          top: "44%",
          left: "48%",
          background: "var(--akgolf-accent, #D1F843)",
          borderColor: "#fff",
          color: "#0A1F18",
          transform: "scale(1.15)",
        }}
      >
        <Flag className="h-4 w-4" strokeWidth={2.4} />
      </div>
      <div
        className="absolute rounded-lg border bg-white px-2.5 py-1 text-[11px] font-bold"
        style={{
          top: "38%",
          left: "55%",
          borderColor: "var(--akgolf-line-light, #E4EAE6)",
          color: "var(--akgolf-ink, #0A1F18)",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        Gamle Fredrikstad GK
      </div>

      <div
        className="absolute bottom-4 left-4 rounded-[10px] bg-white/95 px-3.5 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--akgolf-muted, #5C6B62)",
        }}
      >
        Skjematisk · ikke målestokk
      </div>
    </div>
  );
}

function LocationCard() {
  return (
    <div
      className="flex flex-col rounded-[24px] border-[1.5px] px-8 pb-8 pt-[30px]"
      style={{
        background: "var(--akgolf-surface, #F4F6F4)",
        borderColor: "var(--akgolf-line-light, #E4EAE6)",
      }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--akgolf-primary, #005840)",
        }}
      >
        Hovedanlegg
      </div>
      <h4
        className="mb-3.5 text-[24px] font-extrabold tracking-[-0.02em]"
        style={{
          color: "var(--akgolf-ink, #0A1F18)",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        Gamle Fredrikstad Golfklubb
      </h4>
      <div
        className="mb-[22px] text-[14px] leading-[1.6]"
        style={{ color: "var(--akgolf-text, #324D45)" }}
      >
        <strong style={{ color: "var(--akgolf-ink, #0A1F18)" }}>Bossum</strong>
        <br />
        Gamle Fredrikstad Golfklubb
        <br />
        Fredrikstad
        <br />
        <br />
        <span className="inline-flex items-center gap-1.5">
          <MapPin
            className="h-3.5 w-3.5"
            style={{ color: "var(--akgolf-primary, #005840)" }}
            strokeWidth={2.4}
          />
          15 minutter fra E6 / Sarpsborg
        </span>
      </div>

      <div
        className="mb-[22px] flex flex-col gap-1.5 border-y py-4"
        style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
      >
        <HoursRow day="Man–fre" hours="06–22" />
        <HoursRow day="Lør" hours="08–20" />
        <HoursRow day="Søn" hours="08–20" />
      </div>

      <div className="mt-auto flex gap-2">
        <a
          href="https://maps.google.com/?q=Gamle+Fredrikstad+Golfklubb"
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-[12px] font-bold transition-all hover:-translate-y-px"
          style={{
            background: "var(--akgolf-accent, #D1F843)",
            color: "#0A1F18",
          }}
        >
          Veibeskrivelse
        </a>
        <a
          href="/booking-v2?v=2"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-2.5 text-[12px] font-bold transition-all hover:-translate-y-px"
          style={{
            borderColor: "var(--akgolf-line-light, #E4EAE6)",
            color: "var(--akgolf-ink, #0A1F18)",
            background: "transparent",
          }}
        >
          Book time
        </a>
      </div>
    </div>
  );
}

function HoursRow({
  day,
  hours,
  closed = false,
}: {
  day: string;
  hours: string;
  closed?: boolean;
}) {
  return (
    <div className="flex justify-between text-[12px]">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--akgolf-muted, #5C6B62)",
        }}
      >
        {day}
      </span>
      <span
        className="text-[12px] font-semibold"
        style={{
          color: closed
            ? "var(--akgolf-muted, #5C6B62)"
            : "var(--akgolf-ink, #0A1F18)",
        }}
      >
        {hours}
      </span>
    </div>
  );
}
