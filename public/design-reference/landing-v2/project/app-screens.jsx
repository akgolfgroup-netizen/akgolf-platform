/* Inline mini-versions of the Spillerportal screens, tuned for an iPhone viewport (ca. 320x640).
   These are used inside the 3D phone mockup and the screen-cycle tweak. */

const AK = {
  bg: "#0A1F18",
  card: "#0D2E23",
  cardHi: "#133A2D",
  border: "#1a4a3a",
  accent: "#D1F843",
  primary: "#005840",
  white: "#FFFFFF",
  muted: "#7a9a8e",
  mutedLight: "#A5B2AD",
  danger: "#E85D4A",
  green: "#4ADE80",
  yellow: "#FACC15",
};

const iFont = { fontFamily: "Inter, system-ui, sans-serif" };

/* ── tiny building blocks, smaller than the full kit for phone-scale ── */

function PDot({ c = AK.accent, s = 6 }) {
  return <div style={{ width: s, height: s, borderRadius: "50%", background: c, flexShrink: 0 }} />;
}

function PCard({ children, glow, style = {} }) {
  return (
    <div style={{
      background: AK.card,
      borderRadius: 14,
      padding: 12,
      border: glow ? `1.2px solid ${AK.accent}35` : `1px solid ${AK.border}`,
      boxShadow: glow ? `0 0 18px ${AK.accent}22` : "none",
      ...style,
    }}>{children}</div>
  );
}

/* ── Top status bar for iPhone ── */
function PhoneStatusBar() {
  return (
    <div style={{
      height: 44, display: "flex", alignItems: "flex-end", padding: "0 22px 6px",
      justifyContent: "space-between", color: AK.white, fontSize: 14, fontWeight: 600, ...iFont,
    }}>
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </g></svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 10.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM4.3 7.2c1-1 2.3-1.6 3.7-1.6s2.8.6 3.7 1.6l.9-.9c-1.3-1.3-3-2-4.6-2s-3.4.7-4.6 2l.9.9zM1.5 4.5c1.8-1.8 4.1-2.8 6.5-2.8s4.7 1 6.5 2.8l.9-.9C13.4 1.5 10.8.3 8 .3s-5.4 1.2-7.4 3.3l.9.9z"/>
        </svg>
        {/* battery */}
        <svg width="27" height="11" viewBox="0 0 27 11">
          <rect x="0.5" y="0.5" width="22" height="10" rx="2" fill="none" stroke="currentColor" opacity="0.5"/>
          <rect x="24" y="3.5" width="2" height="4" rx="0.8" fill="currentColor" opacity="0.5"/>
          <rect x="2" y="2" width="18" height="7" rx="1" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════ SCREEN 1 — Dashboard / Hjem ═══════════ */
function DashboardScreen() {
  return (
    <div style={{
      width: "100%", height: "100%", background: AK.bg, color: AK.white,
      display: "flex", flexDirection: "column", ...iFont,
    }}>
      <PhoneStatusBar />

      {/* header */}
      <div style={{ padding: "6px 18px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: AK.muted, letterSpacing: "0.02em" }}>Onsdag, 9. april</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>Hei, Magnus</div>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg, ${AK.accent}, ${AK.primary})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: AK.bg, fontWeight: 800, fontSize: 13,
        }}>MK</div>
      </div>

      {/* streak pill */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{
          padding: "8px 12px", borderRadius: 10,
          background: `${AK.accent}15`, border: `1px solid ${AK.accent}30`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <PDot c={AK.accent} s={7} />
          <span style={{ fontSize: 11, color: AK.accent, fontWeight: 600 }}>12-dagers treningsstreak</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: AK.muted }}>↗</span>
        </div>
      </div>

      {/* grid: hcp + siste runde */}
      <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <PCard glow>
          <div style={{ fontSize: 10, color: AK.accent, fontWeight: 600, marginBottom: 8 }}>HANDICAP</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>15,9</div>
          <div style={{ fontSize: 10, color: AK.muted, marginTop: 4 }}>-0,3 siste mnd</div>
          <div style={{
            marginTop: 10, height: 5, borderRadius: 3,
            background: `linear-gradient(90deg, ${AK.green}, ${AK.yellow}, ${AK.danger})`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", left: "42%", top: -3,
              width: 11, height: 11, borderRadius: "50%",
              background: AK.white, border: `2px solid ${AK.bg}`, transform: "translateX(-50%)",
            }} />
          </div>
        </PCard>
        <PCard>
          <div style={{ fontSize: 10, color: AK.muted, fontWeight: 600, marginBottom: 8 }}>SISTE RUNDE</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>78
            <span style={{ fontSize: 12, fontWeight: 400, color: AK.muted, marginLeft: 3 }}>slag</span>
          </div>
          <div style={{ fontSize: 10, color: AK.muted, marginTop: 4 }}>Gamle Fredrikstad GK</div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, fontSize: 10, color: AK.white }}>
            <span><span style={{ color: AK.accent }}>●</span> 32 putts</span>
            <span><span style={{ color: AK.green }}>●</span> Bra</span>
          </div>
        </PCard>
      </div>

      {/* aktivitet */}
      <div style={{ padding: "10px 18px 0" }}>
        <PCard>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Aktivitet · uke</span>
            <span style={{ fontSize: 10, color: AK.accent, fontWeight: 600 }}>4t 15m</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56 }}>
            {[[15,20],[25,18],[10,22],[30,28],[18,35],[8,12],[22,15]].map((p, i) => (
              <div key={i} style={{ flex: 1, display: "flex", gap: 2, alignItems: "flex-end", height: "100%" }}>
                <div style={{ flex: 1, background: `${AK.accent}55`, height: `${(p[0]/40)*100}%`, borderRadius: "2px 2px 0 0" }} />
                <div style={{ flex: 1, background: AK.accent, height: `${(p[1]/40)*100}%`, borderRadius: "2px 2px 0 0" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: AK.muted }}>
            {["Man","Tir","Ons","I dag","Tor","Fre","Lør"].map(d => <span key={d}>{d}</span>)}
          </div>
        </PCard>
      </div>

      {/* bottom tab bar */}
      <div style={{ marginTop: "auto", padding: "10px 18px 18px", display: "flex", justifyContent: "space-around",
        borderTop: `1px solid ${AK.border}`, background: AK.bg }}>
        {[
          { i: "⌂", label: "Hjem", active: true },
          { i: "◎", label: "Runder" },
          { i: "◐", label: "Trening" },
          { i: "☰", label: "Mer" },
        ].map(t => (
          <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 16, color: t.active ? AK.accent : AK.muted }}>{t.i}</span>
            <span style={{ fontSize: 9, color: t.active ? AK.accent : AK.muted, fontWeight: 600 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════ SCREEN 2 — TrackMan ═══════════ */
function TrackmanScreen() {
  const bars = Array.from({length: 40}, (_,i) => {
    const s = (i * 9301 + 49297) % 233280 / 233280;
    return 8 + s * 40;
  });
  return (
    <div style={{ width: "100%", height: "100%", background: AK.bg, color: AK.white,
      display: "flex", flexDirection: "column", ...iFont }}>
      <PhoneStatusBar />
      <div style={{ padding: "6px 18px 14px" }}>
        <div style={{ fontSize: 11, color: AK.muted }}>Økt · 11:32</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>TrackMan Data</div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <PCard glow>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: AK.muted, fontWeight: 600, letterSpacing: "0.05em" }}>DRIVER</span>
            <span style={{ fontSize: 10, color: AK.accent, fontWeight: 600 }}>+5 m vs snitt</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>245</span>
            <span style={{ fontSize: 14, color: AK.muted }}>m</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 52, marginTop: 10 }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                flex: 1, height: h,
                background: i >= 14 && i < 20 ? AK.danger : i % 3 === 0 ? `${AK.accent}55` : AK.accent,
                borderRadius: 1,
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: AK.muted }}>
            <span>9:00</span><span>10:00</span><span>11:00</span>
          </div>
        </PCard>
      </div>

      <div style={{ padding: "10px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Ballhastighet", v: "68,4", u: "m/s" },
          { l: "Spinn", v: "2430", u: "rpm" },
          { l: "Launch", v: "12,8°", u: "" },
          { l: "Smash", v: "1,48", u: "" },
        ].map(s => (
          <PCard key={s.l}>
            <div style={{ fontSize: 10, color: AK.muted, fontWeight: 600, marginBottom: 6 }}>{s.l.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {s.v}<span style={{ fontSize: 11, color: AK.muted, marginLeft: 3 }}>{s.u}</span>
            </div>
          </PCard>
        ))}
      </div>

      {/* spredning viz */}
      <div style={{ padding: "10px 18px" }}>
        <PCard>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>Spredning · siste 20 slag</div>
          <div style={{ position: "relative", height: 90, background: `${AK.primary}20`, borderRadius: 8, overflow: "hidden" }}>
            {/* fairway lines */}
            <div style={{ position: "absolute", left: "30%", top: 0, bottom: 0, width: 1, background: `${AK.accent}30` }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${AK.accent}60` }} />
            <div style={{ position: "absolute", left: "70%", top: 0, bottom: 0, width: 1, background: `${AK.accent}30` }} />
            {/* dots */}
            {Array.from({length: 20}, (_, i) => {
              const s1 = (i * 9301 + 49297) % 233280 / 233280;
              const s2 = (i * 49297 + 9301) % 233280 / 233280;
              return (
                <div key={i} style={{
                  position: "absolute",
                  left: `${30 + s1 * 45}%`,
                  top: `${15 + s2 * 65}%`,
                  width: 5, height: 5, borderRadius: "50%",
                  background: AK.accent, opacity: 0.85,
                }} />
              );
            })}
          </div>
        </PCard>
      </div>
    </div>
  );
}

/* ═══════════ SCREEN 3 — Søvn ═══════════ */
function SleepScreen() {
  const stages = ["Våken", "REM", "Lett", "Dyp"];
  const colors = [AK.danger, AK.accent, `${AK.accent}70`, AK.yellow];
  const pattern = (() => {
    const pts = []; let y = 2; let s = 17;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 80; i++) {
      if (rng() > 0.82) y = Math.max(0, Math.min(3, y + Math.floor(rng() * 3) - 1));
      pts.push(y);
    }
    return pts;
  })();
  return (
    <div style={{ width: "100%", height: "100%", background: AK.bg, color: AK.white,
      display: "flex", flexDirection: "column", ...iFont }}>
      <PhoneStatusBar />
      <div style={{ padding: "6px 18px 14px" }}>
        <div style={{ fontSize: 11, color: AK.muted }}>I natt</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>Søvnscore</div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <PCard glow>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>8,5</div>
              <div style={{ fontSize: 11, color: AK.accent, fontWeight: 600, marginTop: 4 }}>● Bra restitusjon</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: AK.muted }}>VARIGHET</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>7t 45m</div>
            </div>
          </div>

          <div style={{ position: "relative", height: 96 }}>
            {stages.map((s, row) => (
              <div key={s} style={{ position: "absolute", left: 0, right: 0, top: row * 24, height: 22, display: "flex", alignItems: "center" }}>
                <span style={{ width: 38, fontSize: 9, color: AK.muted, textAlign: "right", paddingRight: 6 }}>{s}</span>
                <div style={{ flex: 1, height: 16, display: "flex", gap: 0.5 }}>
                  {pattern.map((v, i) => (
                    <div key={i} style={{ flex: 1, background: v === row ? colors[row] : "transparent", borderRadius: 1, opacity: v === row ? 0.85 : 0 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PCard>
      </div>

      <div style={{ padding: "10px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { l: "HJERTERATE", v: "52", u: "bpm" },
          { l: "HRV", v: "68", u: "ms" },
          { l: "TEMP", v: "+0,2", u: "°C" },
        ].map(s => (
          <PCard key={s.l} style={{ padding: 10 }}>
            <div style={{ fontSize: 8, color: AK.muted, fontWeight: 600, marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {s.v}<span style={{ fontSize: 9, color: AK.muted, marginLeft: 2 }}>{s.u}</span>
            </div>
          </PCard>
        ))}
      </div>
    </div>
  );
}

/* ═══════════ SCREEN 4 — Handicap / Progresjon ═══════════ */
function HandicapScreen() {
  const data = [22, 21, 20.4, 19.8, 19.5, 18.9, 18.2, 17.8, 17.3, 16.8, 16.4, 15.9];
  const mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - mn) / (mx - mn)) * 100;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + `${p[0]} ${p[1]}`).join(" ");
  const area = path + ` L 100 100 L 0 100 Z`;

  return (
    <div style={{ width: "100%", height: "100%", background: AK.bg, color: AK.white,
      display: "flex", flexDirection: "column", ...iFont }}>
      <PhoneStatusBar />
      <div style={{ padding: "6px 18px 14px" }}>
        <div style={{ fontSize: 11, color: AK.muted }}>Siste 12 mnd</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>HCP-progresjon</div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <PCard glow>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>15,9</div>
              <div style={{ fontSize: 10, color: AK.accent, fontWeight: 600, marginTop: 4 }}>−6,1 siden start</div>
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 10, background: `${AK.accent}15`,
              color: AK.accent, fontSize: 10, fontWeight: 700,
            }}>MÅL: 12,0</div>
          </div>

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 110, marginTop: 6 }}>
            <defs>
              <linearGradient id="hcpArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={AK.accent} stopOpacity="0.35" />
                <stop offset="100%" stopColor={AK.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#hcpArea)" />
            <path d={path} fill="none" stroke={AK.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2 : 0.8} fill={AK.accent} />
            ))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: AK.muted }}>
            <span>Mai</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Jan</span><span>Apr</span>
          </div>
        </PCard>
      </div>

      <div style={{ padding: "10px 18px" }}>
        <PCard>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>Siste runder</div>
          {[
            { d: "9. apr", c: "Gamle Fredrikstad GK", s: 78, diff: "-1,2" },
            { d: "4. apr", c: "Onsøy GK", s: 82, diff: "+0,4" },
            { d: "28. mar", c: "Gamle Fredrikstad GK", s: 76, diff: "-2,1" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: i < 2 ? `1px solid ${AK.border}` : "none",
            }}>
              <div style={{ width: 38, fontSize: 10, color: AK.muted, fontWeight: 600 }}>{r.d}</div>
              <div style={{ flex: 1, fontSize: 11 }}>{r.c}</div>
              <div style={{ fontSize: 14, fontWeight: 700, width: 26, textAlign: "right" }}>{r.s}</div>
              <div style={{
                fontSize: 9, fontWeight: 700, color: r.diff.startsWith("-") ? AK.accent : AK.danger,
                width: 34, textAlign: "right",
              }}>{r.diff}</div>
            </div>
          ))}
        </PCard>
      </div>
    </div>
  );
}

Object.assign(window, {
  DashboardScreen, TrackmanScreen, SleepScreen, HandicapScreen, AK, iFont, PhoneStatusBar,
});
