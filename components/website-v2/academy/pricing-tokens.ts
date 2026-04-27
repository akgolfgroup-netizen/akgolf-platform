// Felles font- og fargetokens for academy-prising-komponentene.
// Brand Guide V2.0 — fallback-verdier matcher app/globals.css.

export const fonts = {
  display: "var(--font-inter-tight), var(--font-inter), Inter, sans-serif",
  body: "var(--font-inter), Inter, sans-serif",
  mono: "var(--font-jetbrains-mono), monospace",
  italic: "var(--font-fraunces), Georgia, serif",
} as const;

export const colors = {
  surface: "var(--akgolf-surface, #F4F6F4)",
  ink: "var(--akgolf-ink, #0A1F18)",
  text: "var(--akgolf-text, #324D45)",
  primary: "var(--akgolf-primary, #005840)",
  accent: "var(--akgolf-accent, #D1F843)",
  muted: "var(--akgolf-muted, #7A8C85)",
  line: "var(--akgolf-line-light, #E4EAE6)",
} as const;
