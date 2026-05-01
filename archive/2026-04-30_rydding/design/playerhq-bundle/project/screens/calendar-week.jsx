/* Week view — Notion-style day columns with hour grid. DnD day+time snap.
   Events positioned absolutely. 15-min snap. Now-line on today. */

function CalendarWeek({ events, onMoveEvent, onPeek, filter }) {
  const scrollRef = React.useRef(null);
  const [dragId, setDragId] = React.useState(null);
  const [dragOffsetY, setDragOffsetY] = React.useState(0);
  const [dropTarget, setDropTarget] = React.useState(null);

  const hours = React.useMemo(() => {
    const arr = [];
    for (let h = CAL_TIME.start; h <= CAL_TIME.end; h++) arr.push(h);
    return arr;
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = calPosY(8, 0) - 40;
  }, []);

  const todayIdx = CAL_WEEK_DATES.findIndex(d => d.isToday);
  const nowPx = calPosY(10, 12);

  const eventsByDay = React.useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (filter && filter.length && !filter.includes(e.focus)) return;
      const idx = CAL_WEEK_DATES.findIndex(d => d.date === e.date && d.month === e.month);
      if (idx < 0) return;
      (map[idx] ||= []).push(e);
    });
    return map;
  }, [events, filter]);

  const handleDragOver = (dayIdx, e, colRect) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const y = e.clientY - colRect.top + scrollRef.current.scrollTop - dragOffsetY;
    const totalMin = Math.max(0, Math.round(y / CAL_TIME.hourH * 60 / 15) * 15);
    const slotMin = Math.min(totalMin + CAL_TIME.start * 60, (CAL_TIME.end + 1) * 60 - 15);
    setDropTarget({ dayIdx, slotMin });
  };

  const handleDrop = (dayIdx) => {
    if (!dragId || !dropTarget) return;
    const d = CAL_WEEK_DATES[dayIdx];
    const h = Math.floor(dropTarget.slotMin / 60);
    const m = dropTarget.slotMin % 60;
    onMoveEvent(dragId, { date: d.date, month: d.month, startH: h, startM: m });
    setDragId(null); setDropTarget(null);
  };

  return (
    <div style={{
      padding: "0 40px 24px", background: akC.dark, flex: 1,
      display: "flex", flexDirection: "column", minHeight: 0, ...akFont,
    }}>
      {/* Header row */}
      <div style={{
        display: "grid", gridTemplateColumns: `56px repeat(7, 1fr)`,
        borderBottom: "1px solid #1e3a2d",
      }}>
        <div />
        {CAL_WEEK_DATES.map((d, i) => (
          <div key={i} style={{
            padding: "10px 12px", borderLeft: "1px solid #122A21",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600, color: d.isToday ? akC.accent : "#7a9a8e",
              textTransform: "uppercase", letterSpacing: ".08em",
            }}>{d.dayShort}</span>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: d.isToday ? 22 : 18, height: 22,
              borderRadius: d.isToday ? "50%" : 0,
              background: d.isToday ? akC.accent : "transparent",
              color: d.isToday ? akC.dark : "#E6EFEA",
              fontSize: d.isToday ? 12 : 14, fontWeight: d.isToday ? 700 : 500,
              letterSpacing: "-.01em", padding: d.isToday ? "0 6px" : 0,
            }}>{d.date}</span>
          </div>
        ))}
      </div>

      {/* Scroll area */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <div style={{
          display: "grid", gridTemplateColumns: `56px repeat(7, 1fr)`,
          position: "relative", minHeight: (CAL_TIME.end - CAL_TIME.start + 1) * CAL_TIME.hourH + 20,
        }}>
          {/* Gutter */}
          <div style={{ position: "relative", borderRight: "1px solid #122A21" }}>
            {hours.map(h => (
              <div key={h} style={{
                position: "absolute", top: calPosY(h, 0), right: 6,
                transform: "translateY(-50%)",
                fontSize: 10, color: "#5A7267", fontVariantNumeric: "tabular-nums",
              }}>{String(h).padStart(2,"0")}:00</div>
            ))}
          </div>

          {CAL_WEEK_DATES.map((d, dayIdx) => (
            <WeekDayColumn key={dayIdx}
              dayIdx={dayIdx} dayMeta={d}
              events={eventsByDay[dayIdx] || []}
              hours={hours}
              dragId={dragId}
              dropTarget={dropTarget && dropTarget.dayIdx === dayIdx ? dropTarget : null}
              nowPx={d.isToday ? nowPx : null}
              onDragStartEvent={(id, offset) => { setDragId(id); setDragOffsetY(offset); }}
              onDragEndEvent={() => { setDragId(null); setDropTarget(null); }}
              onDragOverCol={(e, rect) => handleDragOver(dayIdx, e, rect)}
              onDragLeaveCol={() => setDropTarget(null)}
              onDropCol={() => handleDrop(dayIdx)}
              onPeek={onPeek}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekDayColumn({ dayIdx, dayMeta, events, hours, dragId, dropTarget, nowPx,
                        onDragStartEvent, onDragEndEvent, onDragOverCol, onDragLeaveCol, onDropCol, onPeek }) {
  const colRef = React.useRef(null);
  const [hoverTime, setHoverTime] = React.useState(null);

  return (
    <div ref={colRef}
      onDragOver={(e) => onDragOverCol(e, colRef.current.getBoundingClientRect())}
      onDragLeave={onDragLeaveCol}
      onDrop={onDropCol}
      onMouseMove={(e) => {
        if (!colRef.current) return;
        const rect = colRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const totalMin = Math.round(y / CAL_TIME.hourH * 60 / 15) * 15;
        setHoverTime(totalMin + CAL_TIME.start * 60);
      }}
      onMouseLeave={() => setHoverTime(null)}
      style={{
        position: "relative", borderLeft: "1px solid #122A21",
        background: dayMeta.isToday ? "rgba(209,248,67,0.025)" : "transparent",
      }}>
      {/* Hour lines */}
      {hours.map(h => (
        <div key={h} style={{
          position: "absolute", left: 0, right: 0, top: calPosY(h, 0),
          borderTop: "1px solid #0F2219",
        }} />
      ))}
      {/* Half-hour dotted */}
      {hours.slice(0, -1).map(h => (
        <div key={`hh-${h}`} style={{
          position: "absolute", left: 0, right: 0, top: calPosY(h, 30),
          borderTop: "1px dashed rgba(15,34,25,0.8)",
        }} />
      ))}

      {/* Hover time indicator */}
      {hoverTime !== null && !dragId && (
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: ((hoverTime - CAL_TIME.start*60) / 60) * CAL_TIME.hourH,
          height: CAL_TIME.hourH * 0.25,
          background: "rgba(209,248,67,0.04)",
          borderLeft: `2px solid ${akC.accent}44`,
          pointerEvents: "none",
        }} />
      )}

      {/* Drop indicator */}
      {dropTarget && dragId && (
        <div style={{
          position: "absolute", left: 4, right: 4,
          top: ((dropTarget.slotMin - CAL_TIME.start*60) / 60) * CAL_TIME.hourH,
          height: 3,
          background: akC.accent,
          boxShadow: `0 0 10px ${akC.accent}, 0 0 2px ${akC.accent}`,
          borderRadius: 2, pointerEvents: "none", zIndex: 5,
        }}>
          <div style={{
            position: "absolute", left: -4, top: -3, width: 10, height: 10,
            borderRadius: "50%", background: akC.accent,
          }} />
          <div style={{
            position: "absolute", right: 4, top: -16,
            fontSize: 10, fontWeight: 700, color: akC.accent,
            fontVariantNumeric: "tabular-nums", letterSpacing: ".02em",
          }}>{String(Math.floor(dropTarget.slotMin/60)).padStart(2,"0")}:{String(dropTarget.slotMin%60).padStart(2,"0")}</div>
        </div>
      )}

      {/* Now line */}
      {nowPx !== null && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: nowPx,
          borderTop: `1.5px solid ${akC.danger}`, zIndex: 4, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", left: -5, top: -5,
            width: 10, height: 10, borderRadius: "50%", background: akC.danger,
          }} />
        </div>
      )}

      {/* Events */}
      {events.map(e => (
        <WeekEvent key={e.id} event={e}
          onDragStart={(offsetY) => onDragStartEvent(e.id, offsetY)}
          onDragEnd={onDragEndEvent}
          isDragging={dragId === e.id}
          onPeek={() => onPeek(e.id)}
        />
      ))}
    </div>
  );
}

function WeekEvent({ event, onDragStart, onDragEnd, isDragging, onPeek }) {
  const top = calPosY(event.startH, event.startM);
  const height = Math.max(22, (event.duration / 60) * CAL_TIME.hourH - 2);
  const color = CAL_FOCUS[event.focus];
  const endH = event.startH + Math.floor((event.startM + event.duration) / 60);
  const endM = (event.startM + event.duration) % 60;

  return (
    <div
      draggable
      onDragStart={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        onDragStart(offsetY);
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", event.id); } catch (_) {}
      }}
      onDragEnd={onDragEnd}
      onClick={onPeek}
      style={{
        position: "absolute", left: 4, right: 4, top, height,
        background: color.bg,
        borderLeft: `3px solid ${color.line}`,
        color: color.fg,
        borderRadius: 6,
        padding: height > 40 ? "6px 8px" : "3px 8px",
        fontSize: 11, fontWeight: 500, lineHeight: 1.3,
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : (event.completed ? 0.65 : 1),
        overflow: "hidden",
        zIndex: 2,
        transition: isDragging ? "none" : "opacity .15s, transform .15s",
        textDecoration: event.completed ? "line-through" : "none",
      }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        fontWeight: 600, fontSize: 11, letterSpacing: "-.005em",
      }}>
        {event.completed && <LucideIcon name="check" size={10} color={color.fg} />}
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {event.title}
        </span>
      </div>
      {height > 40 && (
        <div style={{
          fontSize: 10, color: color.fg, opacity: 0.75, marginTop: 2,
          fontVariantNumeric: "tabular-nums",
        }}>
          {String(event.startH).padStart(2,"0")}:{String(event.startM).padStart(2,"0")}
          {" – "}
          {String(endH).padStart(2,"0")}:{String(endM).padStart(2,"0")}
        </div>
      )}
      {height > 65 && event.exercises && (
        <div style={{
          fontSize: 10, color: color.fg, opacity: 0.6, marginTop: 4,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <LucideIcon name="list" size={9} color={color.fg} />
          {event.exercises.length} øvelser
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CalendarWeek });
