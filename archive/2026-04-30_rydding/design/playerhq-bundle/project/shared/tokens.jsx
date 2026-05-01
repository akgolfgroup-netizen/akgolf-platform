/* Shared palette + typography helpers for all three screens.
   Grounded in brand-package V2 + colors_and_type.css.
   Uses a SINGLE name (akC) to avoid global-scope collisions. */

const akC = {
  // brand
  primary: "#005840",
  accent:  "#D1F843",

  // dark surfaces
  dark:          "#0A1F18",
  darkCard:      "#0D2E23",
  darkCardHover: "#133A2D",
  darkBorder:    "#1a4a3a",
  darkMuted:     "#7a9a8e",
  darkMutedSoft: "#A5B2AD",

  // light surfaces
  light:         "#ECF0EF",
  lightCard:     "#FFFFFF",
  lightCardSoft: "#F5F8F7",
  lightBorder:   "#e0e8e5",
  lightText:     "#324D45",
  lightMuted:    "#A5B2AD",
  lightMutedSoft:"#5A6E66",

  // semantic
  success: "#2A7D5A",
  warning: "#C48A32",
  danger:  "#B84233",
  ai:      "#AF52DE",
  white:   "#FFFFFF",
  yellow:  "#FACC15",
};

function akT(theme) {
  return theme === "light"
    ? {
        bg: akC.light,
        bgSoft: akC.lightCardSoft,
        card: akC.lightCard,
        border: akC.lightBorder,
        text: akC.lightText,
        muted: akC.lightMutedSoft,
        mutedSoft: akC.lightMuted,
        accentInk: akC.primary,   // "accent" color used on light bg where lime would be too bright
      }
    : {
        bg: akC.dark,
        bgSoft: "#081A13",
        card: akC.darkCard,
        border: akC.darkBorder,
        text: akC.white,
        muted: akC.darkMuted,
        mutedSoft: akC.darkMutedSoft,
        accentInk: akC.accent,
      };
}

const akFont = { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" };

/* Lucide icon — renders the requested name via the CDN library.
   Usage:  <LucideIcon name="target" size={14} color="#fff" />
   Falls back to nothing if the icon is missing from the library. */
function LucideIcon({ name, size = 16, color = "currentColor", strokeWidth = 2, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!window.lucide || !ref.current) return;
    ref.current.innerHTML = "";
    const span = document.createElement("span");
    span.setAttribute("data-lucide", name);
    ref.current.appendChild(span);
    try { window.lucide.createIcons({ nameAttr: "data-lucide", attrs: { width: size, height: size, stroke: color, "stroke-width": strokeWidth, "stroke-linecap": "round", "stroke-linejoin": "round" } }); } catch(e) {}
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0, width: size, height: size, ...style }} />;
}

Object.assign(window, { akC, akT, akFont, LucideIcon });
