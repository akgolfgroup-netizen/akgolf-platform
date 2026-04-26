/* Primitives used across the Spillerportal UI kit */

const C = {
  bg: "#0A1F18",
  card: "#0D2E23",
  cardHover: "#133A2D",
  border: "#1a4a3a",
  accent: "#D1F843",
  primary: "#005840",
  white: "#FFFFFF",
  muted: "#7a9a8e",
  mutedLight: "#A5B2AD",
  danger: "#E85D4A",
  green: "#4ADE80",
  yellow: "#FACC15",
  // light mode
  lightBg: "#ECF0EF",
  lightCard: "#FFFFFF",
  lightBorder: "#e0e8e5",
  lightText: "#324D45",
  lightMuted: "#A5B2AD",
};

/* pick a palette by theme */
function useT(theme) {
  return theme === "light"
    ? {
        ...C,
        bg: C.lightBg,
        card: C.lightCard,
        border: C.lightBorder,
        white: C.lightText,   // "foreground" for text
        muted: C.lightMuted,
      }
    : C;
}

const font = { fontFamily: "Inter, system-ui, sans-serif" };

/* ── tiny reusable pieces ── */
const Dot = ({ c = C.accent, s = 6 }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: c, flexShrink: 0 }} />
);

const Pill = ({ children, active, onClick, small, theme = "dark" }) => {
  const T = useT(theme);
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "4px 12px" : "6px 16px",
        borderRadius: 20,
        border: "none",
        cursor: "pointer",
        background: active ? T.accent : "transparent",
        color: active ? C.bg : theme === "light" ? T.lightMuted : T.muted,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        ...font,
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
};

/* Card wrapper with optional glow */
const Card = ({ children, theme = "dark", glow, style = {}, ...rest }) => {
  const T = useT(theme);
  return (
    <div
      {...rest}
      style={{
        background: T.card,
        borderRadius: 16,
        padding: 16,
        border: glow
          ? `1.5px solid ${C.accent}35`
          : `1px solid ${T.border}`,
        boxShadow: glow ? `0 0 24px ${C.accent}10` : "none",
        color: theme === "light" ? C.lightText : C.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* Card header: icon/title left, trailing right */
const CardHeader = ({ icon, title, trailing, theme = "dark" }) => {
  const T = useT(theme);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon != null && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span style={{ color: theme === "light" ? C.lightText : C.white, fontWeight: 600, fontSize: 13, ...font }}>
          {title}
        </span>
      </div>
      <span style={{ color: T.muted || C.muted, fontSize: 13 }}>{trailing ?? "↗"}</span>
    </div>
  );
};

Object.assign(window, { C, useT, font, Dot, Pill, Card, CardHeader });
