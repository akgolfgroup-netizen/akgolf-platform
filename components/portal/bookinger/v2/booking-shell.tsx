"use client";

import * as React from "react";

/**
 * Dark container som matcher PlayerHQ V2 Cockpit-mockupen
 * (handoff-2026-04-27/screens/a4-mine-bookinger.html).
 * Brukes som wrapper rundt hele bookinger-siden i den eksisterende
 * lyse dashboard-layouten.
 */
export function BookingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 lg:p-8 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 min-h-[calc(100vh-2rem)]"
      style={{
        background: "#102B1E",
        color: "#E6EAE8",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
