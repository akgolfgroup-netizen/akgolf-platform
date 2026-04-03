"use client";

import { PortalError } from "@/components/portal/ui/portal-error";

/**
 * Global error boundary for hele dashboard-området.
 * Fanger opp alle feil som ikke håndteres av mer spesifikke error.tsx-filer.
 *
 * VIKTIG: Aldri vis error.message direkte til brukeren — kan inneholde sensitiv info.
 */
export default function DashboardError({
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
      title="Noe gikk galt"
      description="Det oppstod en uventet feil. Prøv igjen, eller kontakt support hvis problemet vedvarer."
    />
  );
}
