/* Shared primitives for all three screens. Uses akC / akT / akFont from tokens.jsx. */

const AkDot = ({ c = akC.accent, s = 6, style }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: c, flexShrink: 0, ...style }} />
);

function AkPill({ children, active, onClick, theme = "dark", small, style = {} }) {
  const T = akT(theme);
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "4px 12px" : "6px 14px",
        borderRadius: 20,
        border: "none",
        cursor: "pointer",
        background: active ? T.accentInk : "transparent",
        color: active ? (theme === "light" ? "#fff" : akC.dark) : T.muted,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        letterSpacing: ".01em",
        transition: "all .15s ease",
        ...akFont,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function AkCard({ children, theme = "dark", glow, flush, style = {}, onClick, ...rest }) {
  const T = akT(theme);
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      {...rest}
      style={{
        background: hov && theme === "dark" ? akC.darkCardHover : T.card,
        borderRadius: 16,
        padding: flush ? 0 : 18,
        border: glow
          ? `1.5px solid ${akC.accent}3B`
          : `1px solid ${T.border}`,
        boxShadow: glow
          ? `0 0 28px ${akC.accent}18`
          : theme === "dark"
            ? "0 4px 20px rgba(0,0,0,0.25)"
            : "0 4px 20px rgba(0,0,0,0.04)",
        color: T.text,
        transition: "background .15s ease, box-shadow .15s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function AkCardHeader({ icon, title, trailing, theme = "dark", accent }) {
  const T = akT(theme);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && (
          <LucideIcon
            name={icon}
            size={14}
            color={accent ? T.accentInk : T.muted}
            strokeWidth={2}
          />
        )}
        <span style={{ color: T.text, fontWeight: 600, fontSize: 13, letterSpacing: "-.005em", ...akFont }}>
          {title}
        </span>
      </div>
      <span style={{ color: T.muted, fontSize: 12, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", ...akFont }}>
        {trailing ?? <LucideIcon name="arrow-up-right" size={14} color={T.muted} />}
      </span>
    </div>
  );
}

/* Small meta chip — "+5%", "−1t" etc. */
function AkMeta({ children, tone = "accent", theme = "dark" }) {
  const T = akT(theme);
  const colors = {
    accent:  { bg: `${akC.accent}1F`, fg: T.accentInk },
    success: { bg: `${akC.success}22`, fg: akC.success },
    danger:  { bg: `${akC.danger}22`, fg: akC.danger },
    muted:   { bg: theme === "light" ? "#EEF2F1" : `${akC.darkMuted}22`, fg: T.muted },
  };
  const c = colors[tone] || colors.accent;
  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: 10,
      background: c.bg,
      color: c.fg,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: ".01em",
      ...akFont,
    }}>{children}</span>
  );
}

/* KPI block: big number + label */
function AkKpi({ value, unit, label, theme = "dark", size = 40, color }) {
  const T = akT(theme);
  return (
    <div style={{ ...akFont }}>
      <div style={{ fontSize: size, fontWeight: 800, color: color || T.text, lineHeight: 1, letterSpacing: "-.02em", ...akFont }}>
        {value}
        {unit && <span style={{ fontSize: size * 0.35, fontWeight: 400, color: T.muted, marginLeft: 4 }}>{unit}</span>}
      </div>
      {label && <div style={{ fontSize: 11, color: T.muted, marginTop: 4, ...akFont }}>{label}</div>}
    </div>
  );
}

Object.assign(window, { AkDot, AkPill, AkCard, AkCardHeader, AkMeta, AkKpi });
