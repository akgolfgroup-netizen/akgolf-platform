/**
 * HQShell — mørk container som matcher PlayerHQ 360°-mockup (a10).
 * Tar over portal-layoutens lyse `bg-surface` med en mørk ramme
 * for hele 360°-flaten.
 */

import type { ReactNode } from "react";

interface HQShellProps {
  children: ReactNode;
}

export function HQShell({ children }: HQShellProps) {
  return (
    <div className="-m-4 lg:-m-8 -mt-18 lg:-mt-8 min-h-[calc(100vh-1rem)] bg-[#102B1E] text-white">
      {children}
    </div>
  );
}
