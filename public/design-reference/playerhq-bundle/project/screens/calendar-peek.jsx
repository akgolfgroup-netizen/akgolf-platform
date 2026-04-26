/* Peek panel — Notion's signature side-drawer for event detail. */

function CalendarPeek({ event, onClose, onUpdate, onDelete }) {
  if (!event) return null;
  const color = CAL_FOCUS[event.focus];
  const endH = event.startH + Math.floor((event.startM + event.duration) / 60);
  const endM = (event.startM + event.duration) % 60;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)",
        zIndex: 20, animation: "fade-in .15s ease",
      }} />
      {/* Drawer */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 440,
        background: akC.dark, borderLeft: "1px solid #1e3a2d",
        zIndex: 21, display: "flex", flexDirection: "column",
        animation: "slide-in .2s ease", ...akFont,
        boxShadow: "-12px 0 40px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderBottom: "1px solid #1e3a2d", color: "#7a9a8e",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <button onClick={onClose} style={peekBtn}>
              <LucideIcon name="x" size={14} color="#7a9a8e" />
            </button>
            <button style={peekBtn}>
              <LucideIcon name="chevron-up" size={14} color="#7a9a8e" />
            </button>
            <button style={peekBtn}>
              <LucideIcon name="chevron-down" size={14} color="#7a9a8e" />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={peekBtn}>
              <LucideIcon name="external-link" size={14} color="#7a9a8e" />
              <span style={{ fontSize: 12, marginLeft: 4 }}>Åpne</span>
            </button>
            <button style={peekBtn}>
              <LucideIcon name="more-horizontal" size={14} color="#7a9a8e" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 40px" }}>
          {/* Focus pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px", borderRadius: 4,
            background: color.bg, color: color.fg,
            fontSize: 12, fontWeight: 500, marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color.line }} />
            {event.focus}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 30, fontWeight: 700, margin: 0, color: "#F0F5F2",
            letterSpacing: "-.02em", lineHeight: 1.2,
          }}>{event.title}</h1>

          {/* Prop rows (Notion style) */}
          <div style={{ marginTop: 20, marginBottom: 24 }}>
            <PropRow icon="calendar" label="Dato">
              <span style={{ color: "#D8E4DD", fontSize: 13 }}>
                {CAL_WEEK_DATES.find(d => d.date === event.date && d.month === event.month)?.dayLong}, {event.date}. {event.month === 3 ? "mars" : "april"}
              </span>
            </PropRow>
            <PropRow icon="clock" label="Tid">
              <span style={{
                padding: "2px 8px", background: "#122A21", borderRadius: 4,
                fontSize: 12, color: "#D8E4DD", fontVariantNumeric: "tabular-nums",
              }}>
                {String(event.startH).padStart(2,"0")}:{String(event.startM).padStart(2,"0")} – {String(endH).padStart(2,"0")}:{String(endM).padStart(2,"0")}
              </span>
              <span style={{ fontSize: 11, color: "#5a7267" }}>· {event.duration} min</span>
            </PropRow>
            <PropRow icon="map-pin" label="Sted">
              <span style={{ color: "#D8E4DD", fontSize: 13 }}>{event.location || "—"}</span>
            </PropRow>
            <PropRow icon="user" label="Coach">
              {event.coach ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: `radial-gradient(circle at 30% 25%, ${akC.accent}55, ${akC.primary} 80%)`,
                    color: akC.accent, fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{event.coach.split(" ").map(p=>p[0]).join("")}</div>
                  <span style={{ color: "#D8E4DD", fontSize: 13 }}>{event.coach}</span>
                </div>
              ) : <span style={{ color: "#5a7267", fontSize: 13 }}>Ingen</span>}
            </PropRow>
            <PropRow icon="target" label="Intensitet">
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width: 14, height: 6, borderRadius: 2,
                    background: i <= (event.intensity || 0) ? color.line : "#122A21",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: "#5a7267" }}>{event.intensity}/5</span>
            </PropRow>
            <PropRow icon="check-circle" label="Status">
              <button onClick={() => onUpdate(event.id, { completed: !event.completed })}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "3px 10px", borderRadius: 4, border: "none",
                  background: event.completed ? `${akC.success}22` : "#122A21",
                  color: event.completed ? akC.success : "#7a9a8e",
                  fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}>
                <LucideIcon name={event.completed ? "check-circle" : "circle"} size={12}
                  color={event.completed ? akC.success : "#7a9a8e"} />
                {event.completed ? "Fullført" : "Planlagt"}
              </button>
            </PropRow>
          </div>

          <div style={{ borderTop: "1px solid #1e3a2d", paddingTop: 20 }}>
            <div style={{ fontSize: 12, color: "#7a9a8e", fontWeight: 500, marginBottom: 8 }}>Øvelser</div>
            {(event.exercises || []).length === 0 ? (
              <div style={{ fontSize: 13, color: "#5a7267" }}>Ingen øvelser lagt til</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {event.exercises.map((ex, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "6px 8px", borderRadius: 4,
                    fontSize: 13, color: "#D8E4DD",
                    transition: "background .1s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#122A21"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 3,
                      border: `1.5px solid #3a5a4d`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }} />
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #1e3a2d", paddingTop: 20, marginTop: 20 }}>
            <div style={{ fontSize: 12, color: "#7a9a8e", fontWeight: 500, marginBottom: 8 }}>Notat</div>
            <div style={{ fontSize: 13, color: "#D8E4DD", lineHeight: 1.5, textWrap: "pretty" }}>
              {event.notes || <span style={{ color: "#5a7267" }}>Legg til et notat…</span>}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          display: "flex", gap: 8, padding: "12px 14px",
          borderTop: "1px solid #1e3a2d",
        }}>
          <button onClick={() => onDelete(event.id)} style={{
            padding: "7px 12px", border: "1px solid #1e3a2d",
            background: "transparent", color: akC.danger,
            borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <LucideIcon name="trash-2" size={12} color={akC.danger} /> Slett
          </button>
          <button style={{
            marginLeft: "auto",
            padding: "7px 14px", border: "none",
            background: akC.accent, color: akC.dark,
            borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <LucideIcon name="play" size={12} color={akC.dark} /> Start økt
          </button>
        </div>
      </div>
    </>
  );
}

function PropRow({ icon, label, children }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "140px 1fr",
      alignItems: "center", padding: "5px 0", fontSize: 13,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7a9a8e", fontSize: 12 }}>
        <LucideIcon name={icon} size={13} color="#7a9a8e" />
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

const peekBtn = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 28, height: 28, borderRadius: 4, border: "none",
  background: "transparent", cursor: "pointer",
  transition: "background .1s",
};

Object.assign(window, { CalendarPeek });
