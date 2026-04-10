"use client";

import { PortalError } from "@/components/portal/ui/portal-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PortalError error={error} reset={reset} />;
}
