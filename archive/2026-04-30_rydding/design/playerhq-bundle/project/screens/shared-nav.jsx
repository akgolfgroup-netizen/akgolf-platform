/* Top navigation bar used in Dashboard A (system-tro). */

function AkTopNav({ theme, activeTab = "Hjem", onTab, scale = 1 }) {
  const T = akT(theme);
  const tabs = [
    { icon: "layout-dashboard", label: "Hjem" },
    { icon: "flag",             label: "Aktiviteter" },
    { icon: "heart-pulse",      label: "Helsestatus" },
    { icon: "clipboard-list",   label: "Treningsplan" },
  ];
  const innerPillBg = theme === "light" ? T.bg : "#081A13";
  const utilBg = theme === "light" ? T.card : akC.darkCard;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 28px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      ...akFont,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img
          src={theme === "light"
            ? "assets/logos/ak-golf-logo-primary-on-light.svg"
            : "assets/logos/ak-golf-logo-primary-on-dark.svg"}
          alt="AK Golf Group"
          style={{ height: 26 }}
        />

        {/* tab pills */}
        <div style={{ display: "flex", gap: 2, background: innerPillBg, borderRadius: 24, padding: 3 }}>
          {tabs.map(t => {
            const active = t.label === activeTab;
            return (
              <button key={t.label}
                onClick={() => onTab && onTab(t.label)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 20, border: "none",
                  background: active ? akC.primary : "transparent",
                  color: active ? "#fff" : T.muted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  letterSpacing: ".005em",
                  transition: "all .15s ease",
                  ...akFont,
                }}>
                <LucideIcon name={t.icon} size={13} color={active ? "#fff" : T.muted} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Utility pills */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: 20,
          background: utilBg, border: `1px solid ${T.border}`,
          fontSize: 12, color: T.muted, cursor: "pointer",
        }}>
          <LucideIcon name="search" size={13} color={T.muted} /> Søk
          <span style={{ color: T.muted, opacity: 0.5, marginLeft: 6, fontSize: 10, letterSpacing: ".02em" }}>⌘K</span>
        </div>
        <button style={{
          width: 34, height: 34, borderRadius: "50%",
          background: utilBg, border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          <LucideIcon name="bell" size={14} color={T.muted} />
          <span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: "50%", background: akC.danger, border: `2px solid ${utilBg}` }} />
        </button>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg,${akC.primary},${akC.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: akC.dark,
          border: `2px solid ${T.card}`,
        }}>MK</div>
      </div>
    </div>
  );
}

function AkSidebar({ theme, active = 0 }) {
  const T = akT(theme);
  const items = [
    { icon: "flag",           label: "Oversikt" },
    { icon: "bar-chart-3",    label: "Statistikk" },
    { icon: "target",         label: "Mål" },
    { icon: "calendar-check", label: "Økter" },
    { icon: "moon-star",      label: "Helse" },
    { icon: "settings",       label: "Innstillinger" },
  ];
  return (
    <div style={{
      width: 56, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 6, paddingTop: 24, flexShrink: 0,
      borderRight: `1px solid ${T.border}`,
    }}>
      {items.map((it, i) => {
        const isActive = i === active;
        return (
          <button key={i} title={it.label} style={{
            width: 40, height: 40, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isActive ? akC.primary : "transparent",
            color: isActive ? akC.accent : T.muted,
            cursor: "pointer", border: "none",
            transition: "background .15s ease",
          }}>
            <LucideIcon name={it.icon} size={16} color={isActive ? akC.accent : T.muted} />
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
    </div>
  );
}

Object.assign(window, { AkTopNav, AkSidebar });
