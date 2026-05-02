"use client";

import {
  CalendarPlus,
  CalendarX,
  MessageCircle,
  Trophy,
} from "lucide-react";
import { PortalButton } from "@/components/portal/ui/portal-button";

interface EmptyStateProps {
  message: string;
  /** Hvis true: vis "tre forslag"-grid under hovedmeldingen. Default true. */
  showSuggestions?: boolean;
}

/**
 * Bookinger empty-state — Brand Guide V2.0.
 *
 * Vises pa /portal/bookinger nar brukeren ikke har noen bookinger
 * (kommende eller tidligere). Tilbyr CTA + 2 alternative handlinger.
 */
export function EmptyState({
  message,
  showSuggestions = true,
}: EmptyStateProps) {
  return (
    <div className="space-y-4">
      {/* Hovedkort */}
      <div
        className="text-center rounded-2xl"
        style={{
          background: "#0D2E23",
          border: "1px dashed #1A4A3A",
          padding: "48px 24px",
        }}
      >
        <div
          className="grid place-items-center mx-auto mb-5 rounded-2xl"
          style={{
            width: 64,
            height: 64,
            background: "rgba(209,248,67,0.10)",
            color: "#D1F843",
          }}
        >
          <CalendarX className="w-7 h-7" strokeWidth={1.8} />
        </div>
        <h3
          className="text-lg font-bold text-white mb-2 tracking-tight"
          style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
        >
          Ingen bookinger akkurat nå
        </h3>
        <p
          className="mx-auto mb-6 text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.65)",
            maxWidth: 380,
          }}
        >
          {message}
        </p>
        <PortalButton
          href="/portal/bookinger/ny"
          variant="accent"
          size="md"
          leadingIcon={<CalendarPlus className="w-4 h-4" />}
        >
          Book din første time
        </PortalButton>
      </div>

      {/* Forslag-rad */}
      {showSuggestions ? (
        <div className="grid sm:grid-cols-2 gap-3">
          <SuggestionCard
            href="/portal/meldinger"
            icon={<MessageCircle className="w-5 h-5" />}
            title="Snakk med coachen"
            text="Spor om hva som passer deg na, eller diskuter mal."
          />
          <SuggestionCard
            href="/portal/turneringer"
            icon={<Trophy className="w-5 h-5" />}
            title="Se turneringer"
            text="Planlegg sesongens runder og book oppspill mot dato."
          />
        </div>
      ) : null}
    </div>
  );
}

function SuggestionCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ background: "rgba(209,248,67,0.10)", color: "#D1F843" }}
      >
        {icon}
      </div>
      <div
        className="font-bold text-white text-sm mb-1"
        style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      >
        {title}
      </div>
      <div className="text-xs text-white/55 leading-relaxed">{text}</div>
    </a>
  );
}
