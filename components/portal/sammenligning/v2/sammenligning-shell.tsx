import * as React from "react";

/**
 * Mørk PlayerHQ V2-shell (matcher a13-sammenligning.html).
 * Wrapper hele siden inne i den eksisterende lyse dashboard-layouten.
 */
export function SammenligningShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 lg:p-8 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 min-h-[calc(100vh-2rem)]"
      style={{
        background: "#0D2E23",
        color: "#E6EAE8",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
