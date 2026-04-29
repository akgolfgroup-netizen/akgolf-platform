"use client";

import Link from "next/link";
import { STEPS } from "./copy";

interface BookingStepperProps {
  current: number;
}

export function BookingStepper({ current }: BookingStepperProps) {
  const progress = Math.round(((current - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="mb-8 md:mb-12">
      {/* Progress bar (mobil) */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
          <span>Steg {current} av {STEPS.length}</span>
          <span>{STEPS[current - 1]?.label}</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full" style={{ background: "var(--color-line-soft)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "var(--color-accent)" }}
          />
        </div>
      </div>

      {/* Desktop stepper */}
      <nav className="hidden md:flex items-center gap-2">
        {STEPS.map((step, i) => {
          const num = i + 1;
          const isDone = num < current;
          const isActive = num === current;

          return (
            <div key={step.path} className="flex items-center">
              <Link
                href={step.path}
                className="group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
                style={{
                  background: isActive ? "var(--color-accent)" : "transparent",
                }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{
                    background: isDone
                      ? "var(--color-primary)"
                      : isActive
                        ? "var(--color-ink)"
                        : "var(--color-surface-soft)",
                    color: isDone || isActive ? "var(--color-card)" : "var(--color-ink-muted)",
                  }}
                >
                  {isDone ? "✓" : step.num}
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{
                    color: isActive ? "var(--color-ink)" : isDone ? "var(--color-ink)" : "var(--color-ink-muted)",
                  }}
                >
                  {step.label}
                </span>
              </Link>
              {i < STEPS.length - 1 && (
                <div
                  className="mx-2 h-px w-6"
                  style={{
                    background: isDone ? "var(--color-accent)" : "var(--color-line)",
                  }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
