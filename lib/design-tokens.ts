// ─── Shared Design Tokens (TypeScript) ───
// Centralised accent color map used across components.
// Import this instead of duplicating colour lookups.

export const ACCENT_COLORS = {
  academy: "bg-academy",
  junior: "bg-junior",
  software: "bg-software",
  utvikling: "bg-utvikling",
  gold: "bg-gold",
} as const;

export const ACCENT_TEXT_COLORS = {
  academy: "text-academy",
  junior: "text-junior",
  software: "text-software",
  utvikling: "text-utvikling",
  gold: "text-gold",
} as const;

export type Accent = keyof typeof ACCENT_COLORS;

// Standard section header bottom margin — use consistently
export const SECTION_HEADER_MB = "mb-12";

// Standard animation easing curves
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
export const EASE_STANDARD = [0.25, 0.46, 0.45, 0.94] as const;
