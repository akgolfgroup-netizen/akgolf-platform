/* Player profile pieces — avatar placeholder + header cards.
   Uses initials + gradient as honest portrait placeholder (no invented photos). */

function AkAvatar({ size = 56, theme = "dark", initials = "MK", ring = false, status = "online" }) {
  const T = akT(theme);
  const ringSize = size + 8;
  return (
    <div style={{ position: "relative", width: ring ? ringSize : size, height: ring ? ringSize : size, flexShrink: 0 }}>
      {ring && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from 160deg, ${akC.accent}, ${akC.primary} 40%, ${akC.accent} 70%, ${akC.primary})`,
          padding: 2,
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            background: T.card, padding: 2, boxSizing: "border-box",
          }}>
            <AvatarInner size={size - 4} initials={initials} />
          </div>
        </div>
      )}
      {!ring && <AvatarInner size={size} initials={initials} />}
      {status && (
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: size * 0.22, height: size * 0.22, borderRadius: "50%",
          background: status === "online" ? akC.success : akC.muted,
          border: `2px solid ${T.card}`,
        }} />
      )}
    </div>
  );
}

function AvatarInner({ size, initials }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `
        radial-gradient(circle at 30% 25%, ${akC.accent}44 0%, transparent 55%),
        radial-gradient(circle at 75% 85%, ${akC.primary}EE 0%, #08241A 100%)
      `,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: akC.accent,
      fontFamily: "Inter, sans-serif",
      fontSize: size * 0.38,
      fontWeight: 700,
      letterSpacing: "-.02em",
      boxShadow: `inset 0 0 0 1px ${akC.accent}22`,
    }}>{initials}</div>
  );
}

/* Compact header row used on screens 1 + 2 */
function PlayerHeaderRow({ theme }) {
  const T = akT(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <AkAvatar size={52} theme={theme} initials="MK" ring />
      <div style={akFont}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 4 }}>
          Onsdag, 9. april
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-.02em", color: T.text, ...akFont, lineHeight: 1 }}>Hei, Magnus</h1>
          <div style={{
            padding: "3px 9px", borderRadius: 10,
            background: `${T.accentInk}1A`, color: T.accentInk,
            fontSize: 11, fontWeight: 700, letterSpacing: ".02em",
          }}>HCP 15,9</div>
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
          <LucideIcon name="map-pin" size={11} color={T.muted} />
          Gamle Fredrikstad GK · Medlem siden 2019
        </div>
      </div>
    </div>
  );
}

/* Large portrait-banner for screen 3 — breaks bento with a full-width hero */
function PlayerHeroBanner({ theme }) {
  const T = akT(theme);
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      background: `linear-gradient(110deg, #072118 0%, #0B3A2A 45%, #0A1F18 100%)`,
      border: `1px solid ${akC.darkBorder}`,
      padding: 24,
      display: "flex",
      alignItems: "center",
      gap: 24,
      minHeight: 160,
    }}>
      {/* Decorative lime spark */}
      <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%",
        background: `radial-gradient(circle, ${akC.accent}22 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", right: 40, bottom: -30, width: 180, height: 180, borderRadius: "50%",
        background: `radial-gradient(circle, ${akC.primary}66 0%, transparent 70%)` }} />

      <AkAvatar size={92} theme="dark" initials="MK" ring status={null} />

      <div style={{ flex: 1, position: "relative", ...akFont }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: akC.accent }} />
          <span style={{ fontSize: 11, color: akC.accent, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
            Sesong 2026 · Uke 15
          </span>
        </div>
        <h1 style={{
          fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: "-.03em", color: "#fff",
          ...akFont, lineHeight: 1.05,
        }}>God morgen, Magnus.</h1>
        <div style={{ fontSize: 13, color: akC.darkMutedSoft, marginTop: 8, maxWidth: 440, textWrap: "pretty" }}>
          Du ligger <span style={{ color: akC.accent, fontWeight: 700 }}>2,1 slag</span> foran planen for april. Neste turnering: Onsøy Open, lørdag.
        </div>
      </div>

      {/* Coach relationship strip */}
      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        borderRadius: 14,
        background: `${akC.accent}0E`,
        border: `1px solid ${akC.accent}26`,
        minWidth: 280,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `radial-gradient(circle at 30% 25%, ${akC.accent}55, ${akC.primary} 80%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: akC.accent, fontSize: 14, fontWeight: 700, ...akFont, letterSpacing: "-.02em",
          flexShrink: 0,
        }}>AB</div>
        <div style={akFont}>
          <div style={{ fontSize: 10, color: akC.darkMuted, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 2 }}>Din coach</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-.005em" }}>Andreas Berg</div>
          <div style={{ fontSize: 10, color: akC.darkMutedSoft, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
            <LucideIcon name="calendar" size={10} color={akC.darkMutedSoft} /> Neste økt · tor 10:00
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 8,
        alignItems: "flex-end",
      }}>
        <div style={{
          padding: "5px 12px", borderRadius: 12,
          background: `${akC.accent}1A`, color: akC.accent,
          fontSize: 12, fontWeight: 700, ...akFont, letterSpacing: "-.005em",
        }}>HCP 15,9</div>
        <div style={{ fontSize: 10, color: akC.darkMutedSoft, ...akFont, display: "flex", alignItems: "center", gap: 4 }}>
          <LucideIcon name="trending-down" size={10} color={akC.success} />
          <span style={{ color: akC.success, fontWeight: 700 }}>−0,4</span> siste 30d
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AkAvatar, PlayerHeaderRow, PlayerHeroBanner });
