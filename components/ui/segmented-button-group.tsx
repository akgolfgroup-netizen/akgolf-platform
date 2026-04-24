"use client";

/**
 * SegmentedButtonGroup — pill-row med valg.
 * Heritage-stil: rounded-full track, primary aktiv, surface-container ramme.
 *
 * Bruk:
 *   <SegmentedButtonGroup options={["1 uke", "4 uker", "8 uker"]} selected={v} onChange={setV} />
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SegmentedButtonGroupProps {
  options: Option[] | string[];
  selected?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SegmentedButtonGroup({
  options,
  selected,
  onChange,
  className,
  size = "md",
}: SegmentedButtonGroupProps) {
  const normalized: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const [active, setActive] = React.useState<string>(
    selected ?? normalized[0]?.value ?? "",
  );

  React.useEffect(() => {
    if (selected !== undefined) setActive(selected);
  }, [selected]);

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-container p-1",
        className,
      )}
      role="radiogroup"
    >
      {normalized.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            type="button"
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => handleClick(option.value)}
            className={cn(
              "rounded-full font-body font-semibold transition-all duration-200",
              sizeClasses,
              isActive
                ? "bg-primary text-on-primary shadow-card"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
