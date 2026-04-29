/* AK Golf Group — primitives + tokens for Treningsplanlegger */

const AK = {
  // Brand
  bg: "#0A1F18",
  card: "#0D2E23",
  cardHover: "#133A2D",
  border: "#1a4a3a",
  borderSoft: "#163d30",
  primary: "#005840",
  accent: "#D1F843",
  white: "#FFFFFF",
  muted: "#7a9a8e",
  mutedBright: "#A5B2AD",

  // Light
  lightBg: "#ECF0EF",
  lightCard: "#FFFFFF",
  lightBorder: "#e0e8e5",
  lightText: "#324D45",
  lightMuted: "#A5B2AD",
  lightSubtle: "#F5F8F7",

  // Pyramid (per design system spec)
  fys: "#3B82F6",   // blå
  tek: "#16A34A",   // grønn
  slag: "#D4AF37",  // gull
  spill: "#F97316", // oransje
  turn: "#EF4444",  // rød

  // Status
  success: "#2A7D5A",
  warning: "#C48A32",
  danger: "#B84233",
};

const PYR = {
  FYS:   { color: AK.fys,   label: "Fysisk",     short: "FYS" },
  TEK:   { color: AK.tek,   label: "Teknikk",    short: "TEK" },
  SLAG:  { color: AK.slag,  label: "Slag",       short: "SLAG" },
  SPILL: { color: AK.spill, label: "Spill",      short: "SPILL" },
  TURN:  { color: AK.turn,  label: "Turnering",  short: "TURN" },
};

const akFont = { fontFamily: "Inter, system-ui, sans-serif" };

function useTheme(theme) {
  if (theme === "light") {
    return {
      bg: AK.lightBg,
      card: AK.lightCard,
      cardSubtle: AK.lightSubtle,
      border: AK.lightBorder,
      text: AK.lightText,
      muted: AK.lightMuted,
      hover: "#F5F8F7",
    };
  }
  return {
    bg: AK.bg,
    card: AK.card,
    cardSubtle: "#0B2A20",
    border: AK.border,
    text: AK.white,
    muted: AK.muted,
    hover: AK.cardHover,
  };
}

/* Lucide icon helper — uses CDN sprite-style stroke icons.
   We render inline SVG paths so no network dep at runtime beyond an icon set. */
const ICONS = {
  home: "M3 12 12 3l9 9M5 10v10h14V10",
  calendar: "M3 7h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  layers: "m12 2 10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5",
  target: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
  bookopen: "M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  trending: "m22 7-8.5 8.5-5-5L2 17M16 7h6v6",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  search: "m21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0",
  plus: "M12 5v14M5 12h14",
  chevL: "m15 18-6-6 6-6",
  chevR: "m9 18 6-6-6-6",
  chevD: "m6 9 6 6 6-6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
  sparkles: "M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3zM5 3v4M3 5h4M19 17v4M17 19h4",
  clock: "M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0M12 6v6l4 2",
  check: "m20 6-11 11-5-5",
  checkCircle: "m9 11 3 3 8-8M21 12a9 9 0 1 1-6.22-8.56",
  more: "M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0M19 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0M5 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
  grip: "M5 9h.01M5 15h.01M12 9h.01M12 15h.01M19 9h.01M19 15h.01",
  flag: "M4 22V4M4 4h13l-2 4 2 4H4",
  trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0z",
  zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  arrowR: "m12 5 7 7-7 7M5 12h14",
  x: "M18 6 6 18M6 6l18 18",
  cal2: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18",
  dumbbell: "M14.4 14.4 9.6 9.6M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829zM21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z",
  play: "M5 3l14 9-14 9z",
  edit: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z",
  copy: "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  panel: "M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
};

function Icon({ name, size = 16, color = "currentColor", strokeWidth = 2, style = {} }) {
  const d = ICONS[name];
  if (!d) return <span style={{ display: "inline-block", width: size, height: size, ...style }} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
}

/* Card — with optional glow for the focal element */
function Card({ children, theme = "dark", glow, style = {}, padding = 18, ...rest }) {
  const T = useTheme(theme);
  return (
    <div
      {...rest}
      style={{
        background: T.card,
        borderRadius: 16,
        padding,
        border: glow ? `1.5px solid ${AK.accent}40` : `1px solid ${T.border}`,
        boxShadow: glow ? `0 0 24px ${AK.accent}1A` : (theme === "dark" ? "0 4px 20px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.04)"),
        color: T.text,
        ...akFont,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Pill button (used for filters, periods) */
function Pill({ children, active, onClick, theme = "dark", color, size = "md", style = {} }) {
  const T = useTheme(theme);
  const padding = size === "sm" ? "4px 10px" : "6px 12px";
  const fs = size === "sm" ? 11 : 12;
  return (
    <button
      onClick={onClick}
      style={{
        padding,
        borderRadius: 20,
        border: active ? `1px solid ${color || AK.accent}` : `1px solid ${T.border}`,
        background: active ? (color ? color + "22" : AK.accent + "22") : "transparent",
        color: active ? (color || (theme === "dark" ? AK.accent : AK.primary)) : T.muted,
        fontSize: fs,
        fontWeight: 600,
        cursor: "pointer",
        ...akFont,
        transition: "all 150ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* Soft labeled badge for pyramid level */
function PyrBadge({ level, size = "md" }) {
  const p = PYR[level];
  if (!p) return null;
  const padding = size === "sm" ? "2px 6px" : "3px 8px";
  const fs = size === "sm" ? 9 : 10;
  return (
    <span style={{
      ...akFont,
      display: "inline-flex", alignItems: "center", gap: 4,
      padding, borderRadius: 6,
      background: p.color + "22",
      color: p.color,
      fontWeight: 700, fontSize: fs,
      letterSpacing: 0.4,
    }}>
      {p.short}
    </span>
  );
}

Object.assign(window, { AK, PYR, akFont, useTheme, Icon, Card, Pill, PyrBadge });
