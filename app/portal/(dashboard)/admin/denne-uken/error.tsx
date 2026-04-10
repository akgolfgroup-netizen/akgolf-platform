"use client";

import { PortalError } from "@/components/portal/ui/portal-error";

export default function DenneUkenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PortalError
      error={error}
      reset={reset}
      title="Kunne ikke laste ukeoversikten"
      description="Det oppstod en feil ved henting av turneringsdata. Prøv igjen."
    />
  );
}
