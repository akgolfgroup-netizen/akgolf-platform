"use client";

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
 * Dark cockpit shell for CoachHQ — én navnliste (220px) med ikoner inni.
 * Tidligere hadde to sidemenyer (48px rail + 200px nav) — kollapset til én.
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
        gridTemplateColumns: "220px 1fr",
        gridTemplateRows: "58px 1fr",
        gridTemplateAreas: `"nav top" "nav main"`,
        background: "#102B1E",
        color: "#E6EAE8",
      }}
    >
      <div style={{ gridArea: "nav" }}>
        <CoachHQDarkNav user={user} />
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
