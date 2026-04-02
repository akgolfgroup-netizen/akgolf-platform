"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact" | "card";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
}: EmptyStateProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--color-grey-100)" }}
        >
          <Icon className="w-5 h-5 text-[var(--color-grey-400)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-grey-900)]">
            {title}
          </p>
          <p className="text-xs text-[var(--color-grey-500)]">{description}</p>
        </div>
        {action && (
          <Link
            href={action.href}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)] transition-colors flex-shrink-0"
          >
            {action.label}
          </Link>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl p-6 bg-white border border-[var(--color-grey-200)]">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--color-grey-100)" }}
          >
            <Icon className="w-6 h-6 text-[var(--color-grey-400)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-grey-900)] mb-1">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-grey-500)] mb-4">
            {description}
          </p>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)] transition-colors"
            >
              {action.label}
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Default variant - full page empty state
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "var(--color-grey-100)" }}
      >
        <Icon className="w-8 h-8 text-[var(--color-grey-400)]" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">
        {title}
      </h2>
      <p className="text-sm text-[var(--color-grey-500)] max-w-md mb-6">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)] transition-colors"
          >
            {action.label}
          </Link>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-6 py-3 rounded-full text-sm font-medium text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Predefined empty states for common scenarios
export const EMPTY_STATES = {
  noRounds: {
    title: "Ingen runder registrert",
    description:
      "Registrer din forste runde for a se statistikk og Strokes Gained-analyse.",
    action: { label: "Registrer runde", href: "/portal/statistikk/ny-runde" },
  },
  noTraining: {
    title: "Ingen treningsokter",
    description:
      "Logg din forste treningsokt for a bygge en streak og se fremgang.",
    action: { label: "Logg okt", href: "/portal/dagbok" },
  },
  noGoals: {
    title: "Ingen mal satt",
    description: "Sett dine golfmal for a fa personlige anbefalinger.",
    action: { label: "Sett mal", href: "/portal/profil" },
  },
  noBookings: {
    title: "Ingen bookinger",
    description: "Book din forste time for a komme i gang med coaching.",
    action: { label: "Book time", href: "/portal/bookinger/ny" },
  },
  noHandicap: {
    title: "Handicap ikke registrert",
    description:
      "Registrer handicap for a se sammenligning med andre spillere.",
    action: { label: "Registrer handicap", href: "/portal/profil" },
  },
  noPlan: {
    title: "Ingen treningsplan",
    description: "Generer en AI-basert treningsplan tilpasset dine mal.",
    action: { label: "Generer plan", href: "/portal/treningsplan" },
  },
};
