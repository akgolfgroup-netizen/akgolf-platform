"use client";


import { Icon } from "@/components/ui/icon";
import { useEffect } from "react";

import Link from "next/link";

interface PortalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Valgfri tittel. Standard: "Noe gikk galt" */
  title?: string;
  /** Valgfri beskrivelse. Standard er en generisk feilmelding */
  description?: string;
  /** Vis hjem-lenke i tillegg til prøv igjen. Standard: true */
  showHomeLink?: boolean;
}

/**
 * Gjenbrukbar feilvisning for portal-sider.
 *
 * BRUK I error.tsx:
 * ```tsx
 * "use client";
 * import { PortalError } from "@/components/portal/ui/portal-error";
 *
 * export default function Error({ error, reset }: { error: Error; reset: () => void }) {
 *   return <PortalError error={error} reset={reset} />;
 * }
 * ```
 *
 * ALDRI vis rå feilmeldinger til brukeren — de kan inneholde sensitiv info.
 */
export function PortalError({
  error,
  reset,
  title = "Noe gikk galt",
  description = "Vi kunne ikke laste inn denne siden. Prøv igjen, eller gå tilbake til forsiden.",
  showHomeLink = true,
}: PortalErrorProps) {
  useEffect(() => {
    // Logg feilen til konsollen for debugging
    // I produksjon ville dette gått til en feil-tracking-tjeneste
    console.error("Portal error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mb-6">
        <Icon name="warning" className="w-8 h-8 text-[var(--color-grey-500)]" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2 text-center">
        {title}
      </h2>

      {/* Description */}
      <p className="text-[var(--color-grey-500)] text-center mb-6 max-w-md">
        {description}
      </p>

      {/* Error digest for support (kun hvis tilgjengelig) */}
      {error.digest && (
        <p className="text-xs text-[var(--color-grey-400)] mb-6 font-mono">
          Feilkode: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-black)] text-surface rounded-[980px] font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
        >
          <Icon name="refresh" className="w-4 h-4" />
          Prøv igjen
        </button>

        {showHomeLink && (
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-grey-100)] text-[var(--color-grey-900)] rounded-[980px] font-semibold hover:bg-[var(--color-grey-200)] transition-colors"
          >
            <Icon name="home" className="w-4 h-4" />
            Til forsiden
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Pre-konfigurerte feilmeldinger for vanlige scenarier
 */
export const ERROR_MESSAGES = {
  database: {
    title: "Databasefeil",
    description: "Vi har problemer med å hente data akkurat nå. Prøv igjen om noen sekunder.",
  },
  auth: {
    title: "Tilgangsfeil",
    description: "Du har ikke tilgang til denne siden, eller økten din har utløpt.",
  },
  notFound: {
    title: "Ikke funnet",
    description: "Siden eller ressursen du leter etter finnes ikke.",
  },
  network: {
    title: "Nettverksfeil",
    description: "Kunne ikke koble til serveren. Sjekk internettforbindelsen din.",
  },
} as const;
