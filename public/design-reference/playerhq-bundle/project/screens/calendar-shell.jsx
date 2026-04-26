/* Notion-style chrome: sidebar, breadcrumb header, view tabs, filter bar.
   Tuned to AK Golf dark palette. */

/* ─── SIDEBAR (Notion workspace-nav) ─────────────────────── */
function NotionSidebar() {
  const workspaceItems = [
    { icon: "search",        label: "Søk",            kbd: "⌘K" },
    { icon: "inbox",         label: "Innboks",        count: 3 },
    { icon: "bell",          label: "Varsler" },
    { icon: "settings",      label: "Innstillinger" },
  ];
  const spaces = [
    {
      title: "Spillerportal",
      items: [
        { icon: "layout-dashboard", label: "Hjem" },
        { icon: "bar-chart-3",      label: "Statistikk" },
        { icon: "flag",             label: "Runder",        count: 14 },
        { icon: "heart-pulse",      label: "Helsestatus" },
      ],
    },
    {
      title: "Trening",
      items: [
        { icon: "clipboard-list",   label: "Treningsplan",  expanded: true, children: [
          { icon: "calendar-days", label: "Kalender",     active: true },
          { icon: "list",          label: "Alle økter" },
          { icon: "dumbbell",      label: "Øvelsesbank" },
          { icon: "sparkles",      label: "AI-generator" },
        ]},
        { icon: "target",           label: "Mål & milepæler" },
      ],
    },
    {
      title: "Coaching",
      items: [
        { icon: "users",            label: "Coach-relasjon" },
        { icon: "message-circle",   label: "Samtaler",       count: 2 },
        { icon: "history",          label: "Historikk" },
      ],
    },
  ];

  return (
    <aside style={{
      width: 248, flexShrink: 0, background: "#081A13",
      borderRight: "1px solid #122A21",
      display: "flex", flexDirection: "column",
      padding: "10px 0",
      ...akFont,
    }}>
      {/* Workspace switcher */}
      <div style={{ padding: "4px 10px 10px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 8px", borderRadius: 6,
          cursor: "pointer",
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 4,
            background: `linear-gradient(135deg, ${akC.primary}, ${akC.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, color: akC.dark,
            letterSpacing: "-.03em",
          }}>AK</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", flex: 1 }}>AK Golf Group</span>
          <LucideIcon name="chevrons-up-down" size={12} color="#7a9a8e" />
        </div>
      </div>

      {/* Top utility rows */}
      <div style={{ padding: "0 6px" }}>
        {workspaceItems.map((it, i) => (
          <div key={i} style={sidebarItemRow()}>
            <LucideIcon name={it.icon} size={14} color="#9AB4A8" />
            <span style={{ fontSize: 13, color: "#CBD9D1", flex: 1 }}>{it.label}</span>
            {it.kbd && <span style={{ fontSize: 10, color: "#5A7267", letterSpacing: ".04em" }}>{it.kbd}</span>}
            {it.count != null && (
              <span style={{ fontSize: 10, color: "#9AB4A8", background: "#122A21", padding: "1px 6px", borderRadius: 10 }}>{it.count}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 14 }} />

      {/* Spaces */}
      {spaces.map((sp, si) => (
        <div key={si} style={{ marginBottom: 10 }}>
          <div style={{
            padding: "4px 14px 4px 16px",
            fontSize: 11, fontWeight: 600, color: "#6A8578",
            textTransform: "uppercase", letterSpacing: ".08em",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span>{sp.title}</span>
            <span style={{ display: "flex", gap: 4 }}>
              <button style={sidebarMicroBtn()}><LucideIcon name="plus" size={12} color="#6A8578" /></button>
              <button style={sidebarMicroBtn()}><LucideIcon name="chevron-down" size={12} color="#6A8578" /></button>
            </span>
          </div>
          <div style={{ padding: "0 6px" }}>
            {sp.items.map((it, i) => (
              <React.Fragment key={i}>
                <div style={sidebarItemRow(it.active)}>
                  <LucideIcon name={it.expanded ? "chevron-down" : "chevron-right"} size={11} color="#5A7267" style={{ opacity: it.children ? 1 : 0 }} />
                  <LucideIcon name={it.icon} size={14} color={it.active ? "#fff" : "#9AB4A8"} />
                  <span style={{ fontSize: 13, color: it.active ? "#fff" : "#CBD9D1", flex: 1, fontWeight: it.active ? 500 : 400 }}>{it.label}</span>
                  {it.count != null && (
                    <span style={{ fontSize: 10, color: "#9AB4A8", background: "#122A21", padding: "1px 6px", borderRadius: 10 }}>{it.count}</span>
                  )}
                </div>
                {it.children && it.expanded && it.children.map((ch, ci) => (
                  <div key={ci} style={sidebarItemRow(ch.active, true)}>
                    <LucideIcon name={ch.icon} size={13} color={ch.active ? akC.accent : "#9AB4A8"} />
                    <span style={{ fontSize: 13, color: ch.active ? "#fff" : "#CBD9D1", flex: 1, fontWeight: ch.active ? 600 : 400 }}>{ch.label}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* Add page */}
      <div style={{ padding: "6px 10px", borderTop: "1px solid #122A21" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 8px", borderRadius: 6, cursor: "pointer",
          color: "#9AB4A8", fontSize: 13,
        }}>
          <LucideIcon name="plus" size={14} color="#9AB4A8" />
          Legg til ny side
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 8px", borderRadius: 6, cursor: "pointer",
          color: "#9AB4A8", fontSize: 13,
        }}>
          <LucideIcon name="trash-2" size={14} color="#9AB4A8" />
          Søppel
        </div>
      </div>
    </aside>
  );
}

function sidebarItemRow(active, indent) {
  return {
    display: "flex", alignItems: "center", gap: 8,
    padding: indent ? "5px 8px 5px 30px" : "5px 8px",
    borderRadius: 6, cursor: "pointer",
    background: active ? "rgba(209,248,67,0.08)" : "transparent",
    borderLeft: active ? `2px solid ${akC.accent}` : "2px solid transparent",
    marginBottom: 1,
  };
}
function sidebarMicroBtn() {
  return {
    width: 18, height: 18, borderRadius: 4, background: "transparent",
    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  };
}

/* ─── PAGE HEADER (breadcrumb + title + share) ───────────── */
function NotionPageHeader({ onNew }) {
  return (
    <div style={{
      padding: "12px 40px 0",
      borderBottom: "1px solid #122A21",
      background: akC.dark,
      ...akFont,
    }}>
      {/* Breadcrumb row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9AB4A8" }}>
          <LucideIcon name="clipboard-list" size={13} color="#7a9a8e" />
          <span style={{ padding: "2px 6px", borderRadius: 4, cursor: "pointer" }}>Treningsplan</span>
          <LucideIcon name="chevron-right" size={11} color="#5A7267" />
          <span style={{ padding: "2px 6px", borderRadius: 4, color: "#CBD9D1", cursor: "pointer" }}>Kalender</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Collaborators */}
          <div style={{ display: "flex", marginRight: 8 }}>
            {[
              { bg: `linear-gradient(135deg, ${akC.primary}, ${akC.accent})`, i: "MK" },
              { bg: `linear-gradient(135deg, #2E4B3E, #6B9FF5)`, i: "AB" },
              { bg: `linear-gradient(135deg, #3a5a4a, #F5C86B)`, i: "IS" },
            ].map((a, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: "50%", background: a.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: akC.dark,
                border: `2px solid ${akC.dark}`, marginLeft: i ? -6 : 0,
                letterSpacing: "-.02em",
              }}>{a.i}</div>
            ))}
          </div>
          <NotionChromeBtn label="Del" />
          <NotionChromeBtn icon="message-square" />
          <NotionChromeBtn icon="clock" />
          <NotionChromeBtn icon="star" />
          <NotionChromeBtn icon="more-horizontal" />
        </div>
      </div>

      {/* Title row */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 36 }}>📅</span>
          <h1 style={{
            fontSize: 32, fontWeight: 700, margin: 0, color: "#fff",
            letterSpacing: "-.02em", ...akFont,
          }}>Treningskalender</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 12, color: "#7a9a8e", paddingLeft: 2 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="user" size={12} color="#7a9a8e" />
            <span style={{ color: "#9AB4A8" }}>Eier</span>
            <span>Magnus Kjelsrud</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="tag" size={12} color="#7a9a8e" />
            <span style={{ color: "#9AB4A8" }}>Fokus</span>
            <span style={{
              padding: "1px 7px", borderRadius: 4,
              background: "rgba(209,248,67,0.12)", color: akC.accent,
              fontWeight: 500,
            }}>Turnering-prep</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="users" size={12} color="#7a9a8e" />
            <span style={{ color: "#9AB4A8" }}>Delt med</span>
            <span>Andreas Berg (coach)</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="plus" size={12} color="#5A7267" />
            <span style={{ color: "#5A7267" }}>Legg til egenskap</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function NotionChromeBtn({ icon, label }) {
  return (
    <button style={{
      background: "transparent", border: "none",
      padding: label ? "5px 10px" : "5px 6px",
      borderRadius: 5, cursor: "pointer",
      color: "#CBD9D1", fontSize: 12,
      display: "flex", alignItems: "center", gap: 4,
      ...akFont,
    }}>
      {icon && <LucideIcon name={icon} size={14} color="#9AB4A8" />}
      {label}
    </button>
  );
}

/* ─── VIEW SWITCHER (Notion inline tabs) ──────────────────── */
function NotionViewSwitcher({ view, onChange }) {
  const views = [
    { id: "month",   icon: "calendar-days",   label: "Måned" },
    { id: "week",    icon: "columns",         label: "Uke" },
    { id: "day",     icon: "calendar",        label: "Dag" },
    { id: "agenda",  icon: "list",            label: "Agenda" },
    { id: "board",   icon: "kanban",          label: "Board" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "0 40px",
      borderBottom: "1px solid #122A21",
      background: akC.dark,
      gap: 2,
      ...akFont,
    }}>
      {views.map(v => {
        const active = v.id === view;
        return (
          <button key={v.id}
            onClick={() => onChange(v.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 12px",
              borderRadius: 0,
              border: "none", background: "transparent", cursor: "pointer",
              color: active ? "#fff" : "#9AB4A8",
              fontSize: 13, fontWeight: active ? 600 : 400,
              borderBottom: active ? "2px solid #fff" : "2px solid transparent",
              marginBottom: -1,
              ...akFont,
            }}>
            <LucideIcon name={v.icon} size={13} color={active ? "#fff" : "#9AB4A8"} />
            {v.label}
          </button>
        );
      })}
      <button style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "10px 10px", border: "none", background: "transparent",
        color: "#5A7267", fontSize: 13, cursor: "pointer",
        ...akFont,
      }}>
        <LucideIcon name="plus" size={12} color="#5A7267" />
        Legg til visning
      </button>
    </div>
  );
}

/* ─── FILTER BAR (Notion chips + actions) ─────────────────── */
function NotionFilterBar({ onPrev, onNext, onToday, title, rightSlot }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 40px",
      background: akC.dark,
      gap: 12,
      ...akFont,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onToday} style={chipBtn()}>I dag</button>
        <div style={{ display: "flex", gap: 1 }}>
          <button onClick={onPrev} style={{ ...chipBtn(), padding: "6px 8px", borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            <LucideIcon name="chevron-left" size={13} color="#CBD9D1" />
          </button>
          <button onClick={onNext} style={{ ...chipBtn(), padding: "6px 8px", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            <LucideIcon name="chevron-right" size={13} color="#CBD9D1" />
          </button>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginLeft: 6, letterSpacing: "-.01em" }}>{title}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {rightSlot}
        <button style={filterChip()}>
          <LucideIcon name="filter" size={12} color="#9AB4A8" />
          Filter
        </button>
        <button style={filterChip(true)}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: akC.accent }} />
          Fokus: Alle
          <LucideIcon name="chevron-down" size={11} color="#9AB4A8" />
        </button>
        <button style={filterChip()}>
          <LucideIcon name="arrow-up-down" size={12} color="#9AB4A8" />
          Sorter
        </button>
        <button style={filterChip()}>
          <LucideIcon name="search" size={12} color="#9AB4A8" />
        </button>
        <div style={{ width: 1, height: 16, background: "#1e3a2d", margin: "0 4px" }} />
        <button style={{
          ...filterChip(),
          background: akC.accent, color: akC.dark,
          fontWeight: 600, border: "none",
        }}>
          <LucideIcon name="plus" size={12} color={akC.dark} strokeWidth={2.5} />
          Ny økt
        </button>
      </div>
    </div>
  );
}

function chipBtn() {
  return {
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", borderRadius: 5,
    background: "transparent", border: "1px solid #1e3a2d",
    color: "#CBD9D1", fontSize: 12, fontWeight: 500, cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  };
}
function filterChip(active) {
  return {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 10px", borderRadius: 5,
    background: active ? "rgba(209,248,67,0.07)" : "transparent",
    border: `1px solid ${active ? "rgba(209,248,67,0.22)" : "#1e3a2d"}`,
    color: "#CBD9D1", fontSize: 12, cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  };
}

Object.assign(window, { NotionSidebar, NotionPageHeader, NotionViewSwitcher, NotionFilterBar });
