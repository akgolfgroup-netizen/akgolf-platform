/**
 * ProfileShell — mørk container som matcher PlayerHQ-mockup (a1/a2).
 * Tar over portal-layoutens lyse `bg-surface` med en mørk ramme på profil-flatene.
 */

import type { ReactNode } from "react";

interface ProfileShellProps {
  children: ReactNode;
}

export function ProfileShell({ children }: ProfileShellProps) {
  return (
    <div className="-m-4 lg:-m-8 lg:-mt-8 -mt-18 min-h-[calc(100vh-1rem)] bg-[#0A1F18] text-white">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8 lg:px-10 lg:py-10 pt-22 lg:pt-10">
        {children}
      </div>
    </div>
  );
}
