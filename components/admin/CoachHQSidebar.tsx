"use client";

import { IconRail } from "./coachhq/IconRail";
import { NameList } from "./coachhq/NameList";

interface CoachHQSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  /** Antall pågående økter (live). Hentes fra DB i prod. */
  liveSessions?: number;
}

/**
 * CoachHQ Sidebar — tre-panel-layout (56px ikonrad + 200px navnliste).
 *
 * Designfasit: public/design-reference/coachhq-reference.html
 * Erstatter: components/portal/mission-control/mc-sidebar.tsx (legacy)
 *
 * Brand Guide V2.0 tokens:
 *   --color-sidebar (#0F1F18) · --color-accent (#D1F843) · --color-primary (#005840)
 */
export function CoachHQSidebar({ user, liveSessions }: CoachHQSidebarProps) {
  return (
    <div className="flex h-screen sticky top-0 z-30 shrink-0">
      <IconRail user={user} />
      <NameList liveSessions={liveSessions} />
    </div>
  );
}
