/* Month view — Notion-style grid. DnD between days via HTML5 drag API. */

function CalendarMonth({ events, onMoveEvent, onPeek, onDayClick, filter }) {
  const cells = React.useMemo(() => buildMonthMatrix(), []);
  const [dragId, setDragId] = React.useState(null);
  const [hoverKey, setHoverKey] = React.useState(null);

  const eventsByCell = React.useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (filter && !filter.includes(e.focus)) return;
      const k = `${e.month}-${e.date}`;
      (map[k] ||= []).push(e);
    });
    Object.values(map).forEach(arr => arr.sort((a,b) => (a.startH*60+a.startM) - (b.startH*60+b.startM)));
    return map;
  }, [events, filter]);

  return (
    <div style={{
      padding: "0 40px 32px",
      background: akC.dark,
      flex: 1, display: "flex", flexDirection: "column",
      ...akFont,
    }}>
      {/* Weekday header row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        borderBottom: "1px solid #1e3a2d",
      }}>
        {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((d, i) => (
          <div key={i} style={{
            padding: "10px 10px",
            fontSize: 11, fontWeight: 600, color: "#7a9a8e",
            textTransform: "uppercase", letterSpacing: ".08em",
            borderLeft: i ? "1px solid #122A21" : "none",
          }}>{d}</div>
        ))}
      </div>

      {/* Grid of day cells */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        borderLeft: "1px solid #122A21",
      }}>
        {cells.map((cell, idx) => {
          const k = `${cell.month}-${cell.date}`;
          const dayEvents = eventsByCell[k] || [];
          const isWeekStart = idx % 7 === 0;
          const row = Math.floor(idx / 7);
          const isDragOver = hoverKey === k && dragId;
          return (
            <div key={idx}
              onDragOver={(e) => { e.preventDefault(); setHoverKey(k); }}
              onDragLeave={() => setHoverKey(h => h === k ? null : h)}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) onMoveEvent(dragId, { date: cell.date, month: cell.month });
                setHoverKey(null); setDragId(null);
              }}
              onClick={() => onDayClick && onDayClick(cell)}
              style={{
                borderTop: row ? "1px solid #122A21" : "none",
                borderRight: "1px solid #122A21",
                borderBottom: "1px solid #122A21",
                padding: 6,
                minHeight: 118,
                position: "relative",
                background: isDragOver ? "rgba(209,248,67,0.05)"
                          : cell.isToday ? "rgba(209,248,67,0.025)"
                          : cell.inMonth ? "transparent" : "rgba(0,0,0,0.15)",
                transition: "background .12s ease",
                cursor: "pointer",
              }}
              className="ak-month-cell"
            >
              {/* Date label */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 4, minHeight: 20,
              }}>
                {cell.isToday ? (
                  <div style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: "50%",
                    background: akC.accent, color: akC.dark,
                    fontSize: 12, fontWeight: 700, letterSpacing: "-.01em",
                  }}>{cell.date}</div>
                ) : (
                  <span style={{
                    fontSize: 13, fontWeight: 500,
                    color: cell.inMonth ? "#CBD9D1" : "#4a6257",
                    padding: "2px 6px",
                  }}>
                    {isWeekStart || cell.date === 1
                      ? (cell.date === 1
                          ? `${cell.date}. ${["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"][cell.month]}`
                          : cell.date)
                      : cell.date}
                  </span>
                )}
                {/* + button on hover */}
                <button className="ak-month-add" onClick={(e) => e.stopPropagation()} style={{
                  width: 18, height: 18, borderRadius: 4, border: "none",
                  background: "rgba(255,255,255,0.08)", color: "#9AB4A8",
                  fontSize: 12, cursor: "pointer", opacity: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <LucideIcon name="plus" size={11} color="#9AB4A8" />
                </button>
              </div>

              {/* Event chips */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {dayEvents.slice(0, 3).map(ev => (
                  <MonthEventChip key={ev.id} event={ev}
                    onDragStart={() => setDragId(ev.id)}
                    onDragEnd={() => { setDragId(null); setHoverKey(null); }}
                    onClick={(e) => { e.stopPropagation(); onPeek(ev); }}
                    dimmed={dragId === ev.id}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div style={{
                    fontSize: 11, color: "#7a9a8e", padding: "2px 6px",
                    cursor: "pointer",
                  }}>
                    {dayEvents.length - 3} til…
                  </div>
                )}
              </div>

              {/* Drop-highlight ring */}
              {isDragOver && (
                <div style={{
                  position: "absolute", inset: 2,
                  border: `1.5px dashed ${akC.accent}`,
                  borderRadius: 6,
                  pointerEvents: "none",
                }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .ak-month-cell:hover { background: rgba(255,255,255,0.012) !important; }
        .ak-month-cell:hover .ak-month-add { opacity: 1; }
      `}</style>
    </div>
  );
}

function MonthEventChip({ event, onDragStart, onDragEnd, onClick, dimmed }) {
  const f = CAL_FOCUS[event.focus];
  const isAllDay = event.focus === "REST" && event.duration === 0;
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", event.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "2px 6px",
        borderRadius: 4,
        background: f.bg,
        borderLeft: `2px solid ${f.dot}`,
        cursor: "grab",
        opacity: dimmed ? 0.35 : 1,
        fontSize: 11, color: f.ink,
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        transition: "opacity .12s ease",
        ...akFont,
      }}
    >
      {!isAllDay && (
        <span style={{ fontVariantNumeric: "tabular-nums", color: f.ink, opacity: 0.75, fontWeight: 400 }}>
          {calFmtTime(event.startH, event.startM)}
        </span>
      )}
      <span style={{
        overflow: "hidden", textOverflow: "ellipsis",
        color: "#E6EFEA", fontWeight: 500,
      }}>{event.title}</span>
    </div>
  );
}

Object.assign(window, { CalendarMonth });
