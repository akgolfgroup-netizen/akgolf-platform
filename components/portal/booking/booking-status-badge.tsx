"use client";

import type { BookingStatusVariant } from "./booking-types";

const BADGE_STYLES: Record<BookingStatusVariant, string> = {
  success: "bg-success-light text-success-text border-success/20",
  warning: "bg-warning-light text-warning-text border-warning/20",
  cancelled: "bg-error-light text-error-text border-error/20",
};

interface BookingStatusBadgeProps {
  label: string;
  variant: BookingStatusVariant;
}

export function BookingStatusBadge({ label, variant }: BookingStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border ${BADGE_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}
