"use client";

/**
 * AtmosphericBackground — subtil radial gradient for portal.
 * Svært dempet — portalen skal foele seg ren og noytral, ikke aurora.
 */
export function AtmosphericBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,88,64,0.02) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(175,82,222,0.01) 0%, transparent 50%)",
      }}
    />
  );
}
