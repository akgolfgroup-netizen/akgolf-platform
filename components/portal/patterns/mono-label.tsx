/**
 * MonoLabel — Pattern P-02 (v3.1)
 *
 * JetBrains Mono for metadata: tidsstempler, IDer, prosenter, tabellheaders.
 * Gir lab-følelse uten å stjele fokus fra Inter.
 *
 * Brukes på tvers av alle data-rike skjermer (statistikk, trackman, cockpit, etc).
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes, ElementType, LabelHTMLAttributes } from "react";

type MonoLabelSize = "xs" | "sm" | "md" | "lg";

interface MonoLabelProps
  extends HTMLAttributes<HTMLElement>,
    Pick<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
  children: ReactNode;
  size?: MonoLabelSize;
  uppercase?: boolean;
  tabular?: boolean;
  /** HTML-tag (default "span"). Bruk "p" for blokk-elementer eller "label" for skjema-labels. */
  as?: ElementType;
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
  as: Component = "span",
  className,
  ...props
}: MonoLabelProps) {
  return (
    <Component
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
    </Component>
  );
}
