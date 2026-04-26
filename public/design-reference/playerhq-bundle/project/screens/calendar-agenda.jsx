/* Agenda view — Notion-style list grouped by day. Simple, no DnD. */

function CalendarAgenda({ events, onPeek, filter }) {
  const grouped = React.useMemo(() => {
    const byKey = {};
    events.forEach(e => {
      if (filter && !filter.includes(e.focus)) return;
      const k = `${e.month}-${String(e.date).padStart(2, "0")}`;
      (byKey[k] ||= []).push(e);
    });
    Object.values(byKey).forEach(arr => arr.sort((a,b) => (a.startH*60+a.startM) - (b.startH*60+b.startM)));
    return byKey;
  }, [events, filter]);

  const keys = Object.keys(grouped).sort();

  return (
    <div style={{
      flex: 1, overflow: "auto", padding: "0 40px 40px",
      background: akC.dark, ...akFont,
    }}>
      {keys.map(k => {
        const [m, d] = k.split("-").map(Number);
        const date = d;
        const isToday = date === CAL_TODAY.date && m === CAL_TODAY.month;
        const weekday = dayOfWeekApril2026(date, m);
        return (
          <section key={k} style={{ marginTop: 22 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              paddingBottom: 8, borderBottom: "1px solid #122A21",
              marginBottom: 4,
            }}>
              <span style={{
                fontSize: 18, fontWeight: 700, color: isToday ? akC.accent : "#fff",
                letterSpacing: "-.01em", fontVariantNumeric: "tabular-nums",
              }}>{date}</span>
              <span style={{
                fontSize: 11, color: isToday ? akC.accent : "#7a9a8e",
                fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em",
              }}>{weekday} · {m === 3 ? "april" : m === 2 ? "mars" : "mai"}</span>
              {isToday && (
                <span style={{
                  padding: "1px 7px", borderRadius: 3,
                  background: akC.accent, color: akC.dark,
                  fontSize: 10, fontWeight: 700, letterSpacing: ".04em",
                }}>I DAG</span>
              )}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: "#7a9a8e" }}>
                {grouped[k].length} økt{grouped[k].length !== 1 ? "er" : ""} ·{" "}
                {grouped[k].reduce((s, e) => s + e.duration, 0)} min
              </span>
            </div>
            <div>
              {grouped[k].map(ev => {
                const f = CAL_FOCUS[ev.focus];
                const end = calEndTime(ev);
                return (
                  <div key={ev.id}
                    onClick={() => onPeek(ev)}
                    className="ak-agenda-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 120px 1fr 120px",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 8px",
                      borderBottom: "1px solid #0F241B",
                      cursor: "pointer",
                      transition: "background .12s ease",
                    }}>
                    <span style={{
                      fontSize: 12, color: "#CBD9D1",
                      fontVariantNumeric: "tabular-nums",
                    }}>{calFmtTime(ev.startH, ev.startM)}–{calFmtTime(end.h, end.m)}</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "2px 9px", borderRadius: 4,
                      background: f.bg, color: f.ink,
                      fontSize: 11, fontWeight: 500, justifySelf: "start",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.dot }} />
                      {f.label}
                    </span>
                    <span style={{ fontSize: 14, color: "#E6EFEA", fontWeight: 500 }}>{ev.title}</span>
                    <span style={{
                      fontSize: 11, color: "#7a9a8e", textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}>{ev.duration} min</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      <style>{`
        .ak-agenda-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
}

function dayOfWeekApril2026(date, month) {
  // April 1 2026 = Wednesday (index 2, Mon-first)
  const dayIdx = month === 3
    ? (date - 1 + 2) % 7
    : month === 2
    ? (date - 1 + 6) % 7  // March 30 = Mon(0), 31 = Tue(1)
    : (date - 1 + 4) % 7;  // May 1 = Fri
  return ["Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag","Søndag"][dayIdx];
}

Object.assign(window, { CalendarAgenda });
