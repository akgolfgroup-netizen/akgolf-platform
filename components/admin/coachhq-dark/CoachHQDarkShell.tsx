"use client";

import { CoachHQDarkRail } from "./CoachHQDarkRail";
import { CoachHQDarkNav } from "./CoachHQDarkNav";
import { CoachHQDarkTopbar } from "./CoachHQDarkTopbar";

interface CoachHQDarkShellProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  title: string;
  meta?: string;
  children: React.ReactNode;
}

/**
 * Dark cockpit shell for CoachHQ — pixel-nær mockup
 * (public/design-reference/handoff-2026-04-27/screens/_coachhq.css).
 *
 * 3-kolonne grid:
 *   - 48px ikon-rail (#0A1F18)
 *   - 200px nav-liste (#0A1F18)
 *   - 1fr main + 58px topbar (#102B1E)
 */
export function CoachHQDarkShell({
  user,
  title,
  meta,
  children,
}: CoachHQDarkShellProps) {
  return (
    <div
      className="min-h-screen grid"
      style={{
        gridTemplateColumns: "48px 200px 1fr",
        gridTemplateRows: "58px 1fr",
        gridTemplateAreas: `"rail nav top" "rail nav main"`,
        background: "#102B1E",
        color: "#E6EAE8",
      }}
    >
      <div style={{ gridArea: "rail" }}>
        <CoachHQDarkRail user={user} />
      </div>
      <div style={{ gridArea: "nav" }}>
        <CoachHQDarkNav />
      </div>
      <div style={{ gridArea: "top" }}>
        <CoachHQDarkTopbar title={title} meta={meta} user={user} />
      </div>
      <main
        style={{
          gridArea: "main",
          background: "#102B1E",
          color: "#E6EAE8",
        }}
        className="overflow-y-auto px-7 pt-6 pb-12"
      >
        {children}
      </main>
    </div>
  );
}
