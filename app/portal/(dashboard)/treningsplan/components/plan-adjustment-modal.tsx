"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import type { AdjustmentSuggestion } from "./plan-adjustment-banner";

interface PlanAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: AdjustmentSuggestion | null;
  onApprove: (factor: number) => Promise<void>;
}

export function PlanAdjustmentModal({
  isOpen,
  onClose,
  suggestion,
  onApprove,
}: PlanAdjustmentModalProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !suggestion) return null;

  const factor =
    suggestion.recommendation === "reduce"
      ? 0.8
      : suggestion.recommendation === "increase"
        ? 1.2
        : 1.0;

  const currentHours = suggestion.plannedHours ?? 0;
  const newHours = currentHours * factor;
  const changePct = Math.round((factor - 1) * 100);

  const sessionsToChange = Math.max(1, Math.ceil((suggestion.plannedSessionsThisWeek ?? 0) * Math.abs(changePct) / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                suggestion.recommendation === "reduce"
                  ? "bg-error/10 text-error"
                  : suggestion.recommendation === "increase"
                    ? "bg-warning/10 text-warning"
                    : "bg-info/10 text-info"
              )}
            >
              <Icon
                name={
                  suggestion.recommendation === "reduce"
                    ? "remove_circle"
                    : suggestion.recommendation === "increase"
                      ? "add_circle"
                      : "sync"
                }
                className="w-4 h-4"
              />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Juster treningsplan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
          >
            <Icon name="close" className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-surface-container p-3">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Nåværende plan
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {currentHours.toFixed(1)}t
              <span className="text-sm font-normal text-on-surface-variant ml-1">/uke</span>
            </p>
          </div>

          <div className="rounded-xl bg-surface-container p-3">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Foreslått justering
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {newHours.toFixed(1)}t
              <span className="text-sm font-normal text-on-surface-variant ml-1">/uke</span>
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {changePct > 0 && `+${changePct}% økning`}
              {changePct < 0 && `${changePct}% reduksjon`}
              {changePct === 0 && "Ingen endring"}
            </p>
          </div>

          <div className="rounded-lg bg-surface p-3">
            <p className="text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface">Grunn: </span>
              {suggestion.detailMessage}
            </p>
          </div>

          {sessionsToChange > 0 && changePct !== 0 && (
            <div className="text-xs text-on-surface-variant">
              <p className="font-medium text-on-surface mb-1">Hva som endres:</p>
              <ul className="space-y-1 list-disc list-inside">
                {changePct < 0 && (
                  <li>{sessionsToChange} økt(er) reduseres med {Math.abs(changePct)}%</li>
                )}
                {changePct > 0 && (
                  <li>{sessionsToChange} økt(er) økes med {changePct}%</li>
                )}
                <li>Varighet justeres automatisk</li>
                <li>Fokusområder beholdes</li>
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              startTransition(async () => {
                await onApprove(factor);
                onClose();
              });
            }}
            disabled={isPending || factor === 1}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors",
              factor === 1
                ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                : "bg-primary text-surface hover:bg-primary-container"
            )}
          >
            {isPending ? (
              <>
                <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
                Justerer...
              </>
            ) : (
              <>
                <Icon name="check" className="w-4 h-4" />
                Godkjenn ny plan
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
