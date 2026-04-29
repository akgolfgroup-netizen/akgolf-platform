// Felles dark-surface stiler for v2-skjermer (Brand V2)
// Brukes inline siden portal-layouten er lys og vi gjenskaper mockup pixel-naert.

export const ink = "#0A1F18";
export const accent = "#D1F843";
export const accentSoft = "rgba(209,248,67,0.18)";
export const cardDark = "#0D2E23";
export const lineDark = "#1a4a3a";
export const success = "#6FCBA1";
export const warning = "#E8B967";
export const danger = "#F49283";
export const ai = "#C99CF3";
export const blue = "#6BB1FF";

export const monoFont =
  "var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace";

export const heroShellStyle: React.CSSProperties = {
  background: `radial-gradient(circle at 80% 30%, rgba(209,248,67,0.08), transparent 60%), ${cardDark}`,
  border: "1.5px solid rgba(209,248,67,0.30)",
  boxShadow: "0 0 32px rgba(209,248,67,0.08)",
  borderRadius: 22,
};

export const cardStyle: React.CSSProperties = {
  background: cardDark,
  border: `1px solid ${lineDark}`,
  borderRadius: 14,
};
