/* Kalender-visninger: Uke (kompakt liste per dag) + Dag (detaljert) + Pyramide-fokus */

function statusColor(status) {
  if (status === "done") return AK.success;
  if (status === "today") return AK.accent;
  return AK.muted;
}

function SessionCard({ okt, theme, compact, useColors = true, onClick, draggable = true }) {
  const T = useTheme(theme);
  const p = PYR[okt.level];
  const color = useColors ? p.color : (theme === "dark" ? AK.muted : AK.lightMuted);
  const isDone = okt.status === "done";
  const isToday = okt.status === "today";

  return (
    <div
      onClick={onClick}
      style={{
        background: theme === "dark" ? AK.card : AK.lightCard,
        border: isToday ? `1.5px solid ${AK.accent}55` : `1px solid ${T.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: compact ? "8px 10px" : "10px 12px",
        boxShadow: isToday ? `0 0 16px ${AK.accent}1A` : "none",
        cursor: "pointer",
        position: "relative",
        opacity: isDone ? 0.78 : 1,
        ...akFont,
        transition: "all 150ms ease",
      }}
    >
      {/* Drag handle (Notion-style) */}
      {draggable && (
        <div style={{
          position: "absolute", left: -2, top: "50%", transform: "translateY(-50%)",
          width: 16, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
          color: T.muted, opacity: 0.35, cursor: "grab",
        }}>
          <Icon name="grip" size={14} />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: T.muted, fontVariantNumeric: "tabular-nums",
            }}>{okt.tid}</span>
            {useColors && <PyrBadge level={okt.level} size="sm" />}
            {!useColors && (
              <span style={{
                fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: 0.4,
                padding: "2px 6px", borderRadius: 4, background: theme === "dark" ? "#ffffff10" : "#00000008",
              }}>{p.short}</span>
            )}
            {isDone && <Icon name="check" size={11} color={AK.success} />}
          </div>
          <div style={{
            fontSize: compact ? 12 : 13, fontWeight: 600, color: T.text,
            lineHeight: 1.3, marginBottom: 4, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: compact ? "nowrap" : "normal",
          }}>{okt.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: T.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Icon name="clock" size={10} /> {okt.duration} min
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Icon name="dumbbell" size={10} /> {okt.exercises}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Uke-visning — 7 kolonner, kompakt liste per dag */
function WeekView({ theme, density, useColors, dropTarget, setDropTarget }) {
  const T = useTheme(theme);
  const dates = [13, 14, 15, 16, 17, 18, 19];
  const todayIdx = 2; // ons
  const colHeight = density === "compact" ? 460 : 600;

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        {UKEDAGER.map((d, i) => {
          const isToday = i === todayIdx;
          const dayCount = UKE_OKTER.filter(o => o.dag === i).length;
          return (
            <div key={d} style={{
              padding: "12px 14px",
              borderRight: i < 6 ? `1px solid ${T.border}` : "none",
              background: isToday ? (theme === "dark" ? AK.cardHover + "55" : AK.lightSubtle) : "transparent",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                  color: isToday ? AK.accent : T.muted, ...akFont, textTransform: "uppercase",
                }}>{d}</span>
                <span style={{ fontSize: 10, color: T.muted, ...akFont }}>{dayCount}</span>
              </div>
              <div style={{
                fontSize: 18, fontWeight: 800, color: isToday ? AK.accent : T.text,
                ...akFont, fontVariantNumeric: "tabular-nums",
              }}>{dates[i]}</div>
            </div>
          );
        })}
      </div>

      {/* Day columns */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        flex: 1, minHeight: colHeight,
      }}>
        {UKEDAGER.map((d, i) => {
          const okter = UKE_OKTER.filter(o => o.dag === i).sort((a, b) => a.tid.localeCompare(b.tid));
          const isToday = i === todayIdx;
          const isDrop = dropTarget === i;
          return (
            <div key={d}
              onDragOver={(e) => { e.preventDefault(); setDropTarget(i); }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={() => setDropTarget(null)}
              style={{
                borderRight: i < 6 ? `1px solid ${T.border}` : "none",
                padding: 8, display: "flex", flexDirection: "column", gap: 6,
                background: isDrop
                  ? (theme === "dark" ? AK.accent + "10" : AK.accent + "20")
                  : (isToday ? (theme === "dark" ? AK.cardHover + "30" : AK.lightSubtle + "80") : "transparent"),
                position: "relative",
              }}>
              {okter.length === 0 && (
                <div style={{
                  flex: 1, border: `1.5px dashed ${T.border}`, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.muted, fontSize: 11, ...akFont, padding: 12, textAlign: "center",
                  minHeight: 80,
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="plus" size={11} /> Dra økt hit
                  </span>
                </div>
              )}
              {okter.map(o => (
                <SessionCard key={o.id} okt={o} theme={theme}
                  compact={density === "compact"} useColors={useColors} />
              ))}
              {okter.length > 0 && (
                <div style={{
                  marginTop: "auto", padding: 8, borderRadius: 8,
                  border: `1px dashed ${T.border}`, color: T.muted,
                  fontSize: 11, textAlign: "center", cursor: "pointer", ...akFont,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}>
                  <Icon name="plus" size={11} /> Legg til
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Dag-visning — detaljert tidslinje */
function DayView({ theme, useColors }) {
  const T = useTheme(theme);
  const dayIdx = 2; // ons
  const okter = UKE_OKTER.filter(o => o.dag === dayIdx).sort((a, b) => a.tid.localeCompare(b.tid));
  const hours = Array.from({ length: 14 }, (_, i) => 6 + i); // 06–19
  const slotH = 56;

  function tidToY(tid) {
    const [h, m] = tid.split(":").map(Number);
    return (h - 6) * slotH + (m / 60) * slotH;
  }

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: AK.accent, fontWeight: 700, letterSpacing: 0.5, ...akFont }}>I DAG</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, ...akFont, marginTop: 2 }}>
            Onsdag, 22. april
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: T.muted, ...akFont }}>
          <div><span style={{ color: T.text, fontWeight: 700 }}>{okter.length}</span> økter</div>
          <div><span style={{ color: T.text, fontWeight: 700 }}>{okter.reduce((s, o) => s + o.duration, 0)}</span> min totalt</div>
          <div><span style={{ color: AK.accent, fontWeight: 700 }}>1</span> fullført</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "auto", maxHeight: 600 }}>
        {/* Time column */}
        <div style={{ width: 64, flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
          {hours.map(h => (
            <div key={h} style={{
              height: slotH, padding: "4px 8px", color: T.muted, fontSize: 10,
              ...akFont, fontVariantNumeric: "tabular-nums", textAlign: "right",
              borderBottom: `1px solid ${T.border}40`,
            }}>{String(h).padStart(2, "0")}:00</div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, position: "relative" }}>
          {hours.map((h, i) => (
            <div key={h} style={{
              height: slotH, borderBottom: `1px solid ${T.border}40`,
            }} />
          ))}
          {/* Now line */}
          <div style={{
            position: "absolute", left: 0, right: 12,
            top: tidToY("14:30"), height: 2, background: AK.accent, borderRadius: 1,
            zIndex: 5,
          }}>
            <div style={{
              position: "absolute", left: -6, top: -4,
              width: 10, height: 10, borderRadius: "50%", background: AK.accent,
            }} />
            <div style={{
              position: "absolute", right: 0, top: -18, fontSize: 10, fontWeight: 700,
              color: AK.accent, ...akFont, fontVariantNumeric: "tabular-nums",
            }}>Nå · 14:30</div>
          </div>

          {okter.map(o => {
            const top = tidToY(o.tid);
            const height = (o.duration / 60) * slotH;
            const p = PYR[o.level];
            const color = useColors ? p.color : T.muted;
            const isDone = o.status === "done";
            const isToday = o.status === "today";
            return (
              <div key={o.id} style={{
                position: "absolute", left: 12, right: 16,
                top, height: Math.max(height - 4, 32),
                background: theme === "dark" ? AK.cardHover : "#FFFFFF",
                border: isToday ? `1.5px solid ${AK.accent}` : `1px solid ${T.border}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: 10, padding: "8px 12px",
                boxShadow: isToday ? `0 0 20px ${AK.accent}25` : "0 2px 6px rgba(0,0,0,0.08)",
                opacity: isDone ? 0.7 : 1,
                cursor: "pointer", display: "flex", flexDirection: "column", gap: 4,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: T.muted, fontWeight: 600, fontVariantNumeric: "tabular-nums", ...akFont }}>
                    {o.tid} – {addMinutes(o.tid, o.duration)}
                  </span>
                  {useColors && <PyrBadge level={o.level} size="sm" />}
                  {isDone && <Icon name="check" size={12} color={AK.success} />}
                  {isToday && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: AK.accent, letterSpacing: 0.4, ...akFont }}>NÅ</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, ...akFont }}>{o.title}</div>
                <div style={{ fontSize: 11, color: T.muted, ...akFont }}>
                  {o.exercises} øvelser · {o.duration} min
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function addMinutes(tid, mins) {
  const [h, m] = tid.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/* Pyramide-fokus visning */
function PyramidView({ theme, useColors }) {
  const T = useTheme(theme);
  const totalMins = UKE_OKTER.reduce((s, o) => s + o.duration, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Pyramid visualization */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24,
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 0.5, ...akFont, marginBottom: 4 }}>TRENINGSPYRAMIDEN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, ...akFont }}>Ukens fordeling</div>
          <div style={{ fontSize: 12, color: T.muted, ...akFont, marginTop: 4 }}>{totalMins} min totalt over {UKE_OKTER.length} økter</div>
        </div>

        {/* Pyramid stack */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 24 }}>
          {[
            { level: "TURN",  pct: 5,  width: 30 },
            { level: "SPILL", pct: 15, width: 50 },
            { level: "SLAG",  pct: 30, width: 70 },
            { level: "TEK",   pct: 22, width: 85 },
            { level: "FYS",   pct: 28, width: 100 },
          ].map(p => {
            const c = useColors ? PYR[p.level].color : (theme === "dark" ? AK.cardHover : AK.lightSubtle);
            const fg = useColors ? "#fff" : T.text;
            return (
              <div key={p.level} style={{
                width: p.width + "%", height: 48,
                background: c, color: fg,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 18px", borderRadius: 6,
                border: useColors ? "none" : `1px solid ${T.border}`,
                ...akFont,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.5 }}>{PYR[p.level].short}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{p.pct}%</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: T.muted, ...akFont, textAlign: "center", lineHeight: 1.6 }}>
          Pyramiden viser balansen mellom de fem treningstypene.<br/>
          Bredden indikerer ukens faktiske fordeling.
        </div>
      </div>

      {/* Level breakdown */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24,
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 0.5, ...akFont, marginBottom: 4 }}>FAKTISK VS MÅL</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, ...akFont }}>Per nivå</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PYRAMIDE_DATA.map(p => {
            const meta = PYR[p.level];
            const color = useColors ? meta.color : T.text;
            const diff = p.actual - p.target;
            const diffColor = Math.abs(diff) <= 3 ? AK.success : (diff < 0 ? AK.warning : AK.danger);
            return (
              <div key={p.level}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text, ...akFont }}>{meta.label}</span>
                    <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 0.4, ...akFont }}>{meta.short}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, ...akFont, fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{p.actual}%</span>
                    <span style={{ fontSize: 11, color: T.muted }}>/ {p.target}%</span>
                    <span style={{ fontSize: 11, color: diffColor, fontWeight: 700, minWidth: 30, textAlign: "right" }}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  </div>
                </div>
                <div style={{ position: "relative", height: 8, background: theme === "dark" ? "#0A1F1880" : AK.lightSubtle, borderRadius: 4, overflow: "hidden" }}>
                  {/* Target marker */}
                  <div style={{
                    position: "absolute", left: p.target + "%", top: -2, bottom: -2, width: 2,
                    background: T.muted, opacity: 0.5,
                  }} />
                  {/* Actual */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: p.actual + "%", background: color, borderRadius: 4,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SessionCard, WeekView, DayView, PyramidView, addMinutes });
