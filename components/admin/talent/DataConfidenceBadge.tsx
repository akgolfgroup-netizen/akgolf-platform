"use client";

import { Badge } from "@/components/ui";

export function DataConfidenceBadge({
  score,
  showValue = false,
}: {
  score: number | null;
  showValue?: boolean;
}) {
  if (score === null || score === undefined) {
    return <Badge variant="muted">Ingen data</Badge>;
  }
  let variant: "error" | "warning" | "success";
  let label: string;
  if (score < 0.3) {
    variant = "error";
    label = "Lav";
  } else if (score < 0.7) {
    variant = "warning";
    label = "Middels";
  } else {
    variant = "success";
    label = "Høy";
  }
  return (
    <Badge variant={variant}>
      {label}
      {showValue ? ` (${(score * 100).toFixed(0)}%)` : ""}
    </Badge>
  );
}
