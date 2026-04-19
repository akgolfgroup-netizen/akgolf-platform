/**
 * Icon — Material Symbols Outlined-wrapper.
 *
 * Bruker Google Material Symbols som er lastet via <link> i app/layout.tsx.
 * Erstatter Lucide React i hele Heritage Grid-migrering.
 *
 * Eksempel:
 *   <Icon name="dashboard" />
 *   <Icon name="search" size={20} />
 *   <Icon name="check_circle" filled size={18} className="text-primary" />
 */

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbol-navn, f.eks. "dashboard", "search", "check_circle" */
  name: string;
  /** Fylt variant (0 = outline, 1 = fylt). Default: false */
  filled?: boolean;
  /** Font weight 100-700. Default: 400 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Optical size (pixels). Default: 24 */
  size?: number;
  /** Grade (-50 til 200). Default: 0 */
  grade?: number;
}

export function Icon({
  name,
  filled = false,
  weight = 400,
  size = 24,
  grade = 0,
  className,
  style,
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        fontSize: size,
        width: size,
        height: size,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`,
        ...style,
      }}
      aria-hidden={ariaHidden}
      {...props}
    >
      {name}
    </span>
  );
}
