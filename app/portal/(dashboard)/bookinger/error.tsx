"use client";

import { PortalError } from "@/components/portal/ui/portal-error";

export default function BookingerError({
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
      title="Kunne ikke laste bookinger"
      description="Det oppstod en feil ved henting av bookingdata. Prøv igjen."
    />
  );
}
