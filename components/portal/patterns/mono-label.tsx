/**
 * MonoLabel — Pattern P-02 (v3.1)
 *
 * JetBrains Mono for metadata: tidsstempler, IDer, prosenter, tabellheaders.
 * Gir lab-følelse uten å stjele fokus fra Inter.
 *
 * Brukes på tvers av alle data-rike skjermer (statistikk, trackman, cockpit, etc).
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

type MonoLabelSize = "xs" | "sm" | "md" | "lg";

interface MonoLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  size?: MonoLabelSize;
  uppercase?: boolean;
  tabular?: boolean;
}

const SIZE_CLASSES: Record<MonoLabelSize, string> = {
  xs: "text-[10px] tracking-[0.12em]",
  sm: "text-[11px] tracking-[0.08em]",
  md: "text-[13px] tracking-[0.04em]",
  lg: "text-[15px] tracking-[0.02em]",
};

export function MonoLabel({
  children,
  size = "sm",
  uppercase = false,
  tabular = true,
  className,
  ...props
}: MonoLabelProps) {
  return (
    <span
      className={cn(
        "font-mono",
        SIZE_CLASSES[size],
        tabular && "tabular-nums",
        uppercase && "uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
