/* Main calendar composer — wires sidebar + header + view switcher + filter bar
   + view body + peek drawer. */

function CalendarScreen() {
  const [events, setEvents] = React.useState(CAL_SEED_EVENTS);
  const [view, setView] = React.useState("week"); // month · week · day · agenda · board
  const [peekId, setPeekId] = React.useState(null);
  const [focusFilter, setFocusFilter] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const filteredEvents = React.useMemo(() => {
    if (!search) return events;
    const s = search.toLowerCase();
    return events.filter(e => e.title.toLowerCase().includes(s));
  }, [events, search]);

  const handleMove = React.useCallback((id, patch) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  }, []);
  const handleUpdate = handleMove;
  const handleDelete = React.useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setPeekId(null);
  }, []);

  const peekEvent = events.find(e => e.id === peekId);

  const titleByView = {
    month:  "April 2026",
    week:   "Uke 17 · 20.–26. april 2026",
    day:    "Torsdag 23. april 2026",
    agenda: "April 2026",
    board:  "April 2026",
  };

  return (
    <div data-screen-label="Treningskalender — Notion"
      style={{
        position: "relative", width: "100%", height: "100%",
        background: akC.dark, color: "#E6EFEA",
        display: "flex", flexDirection: "row",
        overflow: "hidden",
        ...akFont,
      }}>
      <style>{`
        @keyframes slide-in { from { transform: translateX(20px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .ak-cal-btn { transition: background .12s ease }
        .ak-cal-btn:hover { background: rgba(255,255,255,0.04) }
        ::selection { background: ${akC.accent}44 }
      `}</style>

      {/* Sidebar */}
      <NotionSidebar />

      {/* Main column */}
      <div style={{
        flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
        background: akC.dark, overflow: "hidden",
      }}>
        <NotionPageHeader />
        <NotionViewSwitcher view={view} onChange={setView} />
        <NotionFilterBar title={titleByView[view]} />

        {/* View body */}
        {view === "month" && (
          <CalendarMonth events={filteredEvents} onMoveEvent={handleMove}
            onPeek={setPeekId} filter={focusFilter} />
        )}
        {view === "week" && (
          <CalendarWeek events={filteredEvents} onMoveEvent={handleMove}
            onPeek={setPeekId} filter={focusFilter} />
        )}
        {view === "day" && (
          <CalendarDay events={filteredEvents} onMoveEvent={handleMove}
            onPeek={setPeekId} filter={focusFilter} />
        )}
        {view === "agenda" && (
          <CalendarAgenda events={filteredEvents} onPeek={setPeekId} filter={focusFilter} />
        )}
        {view === "board" && (
          <CalendarBoard events={filteredEvents} onPeek={setPeekId} filter={focusFilter} />
        )}
      </div>

      <CalendarPeek
        event={peekEvent}
        onClose={() => setPeekId(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

/* ─── Day view ────────────────────────────────────────────── */
function CalendarDay({ events, onPeek, filter }) {
  const today = CAL_WEEK_DATES.find(d => d.isToday) || CAL_WEEK_DATES[3];
  const dayEvents = events.filter(e =>
    e.date === today.date && e.month === today.month &&
    (!filter.length || filter.includes(e.focus))
  ).sort((a,b) => (a.startH*60+a.startM) - (b.startH*60+b.startM));

  const hours = [];
  for (let h = CAL_TIME.start; h <= CAL_TIME.end; h++) hours.push(h);

  return (
    <div style={{
      padding: "0 40px 24px", background: akC.dark, flex: 1,
      display: "flex", flexDirection: "column", minHeight: 0, ...akFont,
    }}>
      <div style={{
        padding: "14px 0", borderBottom: "1px solid #1e3a2d",
        display: "flex", alignItems: "baseline", gap: 14,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#F0F5F2", letterSpacing: "-.01em" }}>
          {today.dayLong}
        </div>
        <div style={{ fontSize: 13, color: "#7a9a8e" }}>
          {today.date}. april · {dayEvents.length} økter
        </div>
        {today.isToday && (
          <span style={{
            padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
            background: `${akC.accent}22`, color: akC.accent,
            letterSpacing: ".04em", textTransform: "uppercase",
          }}>I dag</span>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", minHeight: 0, paddingTop: 12 }}>
        <div style={{
          display: "grid", gridTemplateColumns: `56px 1fr`, position: "relative",
          minHeight: (CAL_TIME.end - CAL_TIME.start + 1) * CAL_TIME.hourH + 20,
        }}>
          <div style={{ position: "relative", borderRight: "1px solid #122A21" }}>
            {hours.map(h => (
              <div key={h} style={{
                position: "absolute", top: calPosY(h, 0), right: 6,
                transform: "translateY(-50%)", fontSize: 10, color: "#5A7267",
                fontVariantNumeric: "tabular-nums",
              }}>{String(h).padStart(2,"0")}:00</div>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            {hours.map(h => (
              <div key={h} style={{
                position: "absolute", left: 0, right: 0, top: calPosY(h, 0),
                borderTop: "1px solid #0F2219",
              }} />
            ))}
            {dayEvents.map(e => {
              const color = CAL_FOCUS[e.focus];
              const top = calPosY(e.startH, e.startM);
              const height = Math.max(30, (e.duration / 60) * CAL_TIME.hourH - 2);
              return (
                <div key={e.id} onClick={() => onPeek(e.id)} style={{
                  position: "absolute", left: 8, right: 8, top, height,
                  background: color.bg, borderLeft: `3px solid ${color.line}`,
                  color: color.fg, borderRadius: 6, padding: "8px 12px",
                  fontSize: 13, cursor: "pointer", overflow: "hidden",
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}>{e.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>
                    {String(e.startH).padStart(2,"0")}:{String(e.startM).padStart(2,"0")} · {e.duration} min
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Agenda view ─────────────────────────────────────────── */
function CalendarAgenda({ events, onPeek, filter }) {
  const sorted = React.useMemo(() => {
    return [...events]
      .filter(e => !filter.length || filter.includes(e.focus))
      .sort((a,b) => (a.month*100 + a.date) - (b.month*100 + b.date)
                  || (a.startH*60+a.startM) - (b.startH*60+b.startM));
  }, [events, filter]);

  const groups = {};
  sorted.forEach(e => {
    const monthName = e.month === 2 ? "mars" : e.month === 3 ? "april" : "mai";
    const key = `${e.date}. ${monthName}`;
    (groups[key] ||= []).push(e);
  });

  return (
    <div style={{ padding: "0 40px 24px", background: akC.dark, flex: 1, overflow: "auto", ...akFont }}>
      {Object.entries(groups).map(([day, items]) => (
        <div key={day} style={{ marginBottom: 20 }}>
          <div style={{
            position: "sticky", top: 0, background: akC.dark, zIndex: 2,
            padding: "10px 0", fontSize: 11, fontWeight: 600, color: "#7a9a8e",
            letterSpacing: ".06em", textTransform: "uppercase",
            borderBottom: "1px solid #1e3a2d", marginBottom: 4,
          }}>
            {day} <span style={{ color: "#5a7267", fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 8 }}>{items.length} {items.length === 1 ? "økt" : "økter"}</span>
          </div>

          {items.map(e => {
            const color = CAL_FOCUS[e.focus];
            return (
              <div key={e.id} onClick={() => onPeek(e.id)} className="ak-cal-btn" style={{
                display: "grid", gridTemplateColumns: "80px 10px 1fr 130px 100px",
                alignItems: "center", gap: 14, padding: "10px 8px", borderRadius: 6,
                cursor: "pointer", fontSize: 13,
              }}>
                <div style={{ color: "#D8E4DD", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                  {String(e.startH).padStart(2,"0")}:{String(e.startM).padStart(2,"0")}
                </div>
                <div style={{ width: 4, height: 24, background: color.line, borderRadius: 2 }} />
                <div>
                  <div style={{ color: "#F0F5F2", fontWeight: 500, letterSpacing: "-.005em" }}>
                    {e.title}
                  </div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "2px 10px", borderRadius: 4, justifySelf: "start",
                  background: color.bg, color: color.fg, fontSize: 11, fontWeight: 500,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color.line }} />
                  {CAL_FOCUS[e.focus].label}
                </div>
                <div style={{ color: "#7a9a8e", fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {e.duration} min
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Board view (Kanban by focus) ────────────────────────── */
function CalendarBoard({ events, onPeek, filter }) {
  const cols = Object.keys(CAL_FOCUS);
  return (
    <div style={{
      flex: 1, overflow: "auto", padding: "16px 40px 24px",
      background: akC.dark, ...akFont,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {cols.map(key => {
          const color = CAL_FOCUS[key];
          const items = events
            .filter(e => e.focus === key && (!filter.length || filter.includes(e.focus)))
            .sort((a,b) => (a.month*100 + a.date) - (b.month*100 + b.date));
          return (
            <div key={key} style={{
              width: 260, flexShrink: 0, borderRadius: 6,
              background: "#0E231B", padding: 10,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "2px 4px 10px",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color.line }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F0F5F2" }}>{color.label}</span>
                <span style={{ fontSize: 11, color: "#7a9a8e", marginLeft: "auto" }}>{items.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map(e => {
                  const monthName = e.month === 2 ? "mars" : e.month === 3 ? "april" : "mai";
                  return (
                    <div key={e.id} onClick={() => onPeek(e.id)} style={{
                      padding: "8px 10px", borderRadius: 5,
                      background: "#122A21", cursor: "pointer",
                      border: `1px solid ${color.line}22`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#F0F5F2", marginBottom: 4 }}>{e.title}</div>
                      <div style={{ fontSize: 10, color: "#7a9a8e", display: "flex", gap: 8 }}>
                        <span>{e.date}. {monthName}</span>
                        <span>·</span>
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>
                          {String(e.startH).padStart(2,"0")}:{String(e.startM).padStart(2,"0")}
                        </span>
                        <span>·</span>
                        <span>{e.duration}m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { CalendarScreen, CalendarDay, CalendarAgenda, CalendarBoard });
