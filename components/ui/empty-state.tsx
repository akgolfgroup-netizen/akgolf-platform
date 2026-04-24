/**
 * EmptyState — beautiful empty state med ikon, tittel, beskrivelse og CTA.
 * Heritage-stil: dashed border, surface-container, Material Symbols, lime CTA.
 *
 * Bruk:
 *   <EmptyState
 *     iconName="event_note"
 *     title="Ingen plan ennå"
 *     description="Velg hvordan du vil starte..."
 *     actionLabel="Lag plan"
 *     onAction={() => setOpen(true)}
 *   />
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface EmptyStateProps {
  iconName: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIconName?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  variant?: "default" | "subtle";
}

export function EmptyState({
  iconName,
  title,
  description,
  actionLabel,
  actionIconName,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-6 rounded-3xl p-8 text-center md:p-16",
        variant === "default"
          ? "border-2 border-dashed border-outline-variant bg-surface-container-lowest"
          : "bg-transparent",
        className,
      )}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
        <Icon name={iconName} size={32} />
      </div>

      <div className="flex max-w-md flex-col items-center gap-2">
        <h3 className="font-headline text-xl font-semibold tracking-tight text-on-surface">
          {title}
        </h3>
        {description && (
          <p className="font-body text-sm leading-relaxed text-on-surface-variant">
            {description}
          </p>
        )}
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-on-primary shadow-card transition-all hover:bg-primary-container hover:shadow-card-hover"
            >
              {actionIconName && <Icon name={actionIconName} size={18} />}
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-3 font-body text-sm font-semibold text-on-surface transition-all hover:bg-surface-container"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
