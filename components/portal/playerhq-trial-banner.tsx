/**
 * Trial-banner som vises i portal-layouten for brukere i gratis-perioden.
 * Skjules etter 1. juni 2026 når trial er over.
 */

import { Sparkles } from "lucide-react";
import type { PlayerHQAccessStatus } from "@/lib/portal/playerhq-access";

export function PlayerHQTrialBanner({ status }: { status: PlayerHQAccessStatus }) {
  // Vis kun for brukere i gratis trial — ikke for coaching-abonnenter eller betalte
  if (!status.isInFreeTrial || !status.hasAccess) return null;

  const days = status.daysUntilTrialEnd;
  const dayText = days === 1 ? "1 dag" : `${days} dager`;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
      style={{
        background: "linear-gradient(90deg, rgba(209,248,67,0.15) 0%, rgba(209,248,67,0.05) 100%)",
        borderBottom: "1px solid var(--color-line)",
        color: "var(--color-ink)",
      }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
        <span className="font-medium">
          {days !== null && days > 0
            ? `PlayerHQ er gratis ut mai. Betaling 299 kr/mnd starter om ${dayText}.`
            : "PlayerHQ er gratis ut mai. Betaling 299 kr/mnd starter 1. juni."}
        </span>
      </div>
      <a
        href="/portal/abonnement"
        className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        Mer info
      </a>
    </div>
  );
}
