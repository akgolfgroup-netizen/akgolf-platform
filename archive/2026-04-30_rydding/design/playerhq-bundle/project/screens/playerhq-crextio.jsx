/* PlayerHQ — Crextio-replika med lime bakgrunn, for AK Golf Group.
   Strukturerer seg i samme 3-rad rytme som originalen:
     - Hero: hilsen + KPI-pills + 3 stats
     - Rad 1: profilkort · fremdrift · økt-tracker · form
     - Rad 2: liste · kalenderstrimmel · dagens oppgaver (mørkt kort)                   */

const phqC = {
  limeBg:        "#E8F4A8",   // lysere enn brand #D1F843 — dominerende BG
  limeBgSoft:    "#F1F8C6",   // enda lysere variant for gradient
  limeAccent:    "#D1F843",   // brand-aksent (fyllt)
  limeAccentDk:  "#B9E034",   // litt mørkere for hover/ring
  card:          "#D8E49A",   // kort-bg — tintet/shadet lime-mose
  cardSoft:      "#E2ECB2",   // litt lysere variant
  cardBorder:    "rgba(10,31,24,0.14)",
  ink:           "#0A1F18",   // primær tekst
  inkSoft:       "#324D45",
  muted:         "#6E8478",
  dark:          "#0A1F18",
  darkCard:      "#132B21",
  darkInk:       "#EDF5DA",
  darkMuted:     "#9AB4A8",
  danger:        "#B84233",
  success:       "#2A7D5A",
};

const phqFont = { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" };

function PlayerHQCrextio() {
  return (
    <div data-screen-label="01 PlayerHQ Crextio-replika" style={{
      width: 1240,
      background: `linear-gradient(180deg, ${phqC.limeBgSoft} 0%, ${phqC.limeBg} 45%, ${phqC.limeBgSoft} 100%)`,
      borderRadius: 28,
      padding: "22px 28px 28px",
      boxShadow: "0 30px 80px rgba(10,31,24,0.18), 0 2px 0 rgba(255,255,255,0.6) inset",
      color: phqC.ink,
      ...phqFont,
    }}>
      <PhqTopNav />
      <PhqHero />
      <PhqRowOne />
      <PhqRowTwo />
    </div>
  );
}

/* ─── Top navigation ──────────────────────────────────────── */
function PhqTopNav() {
  const links = ["Dashboard", "Runder", "Statistikk", "Trening", "Helse", "Kalender", "Coach"];
  const active = "Dashboard";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18,
      padding: "6px 0 26px",
    }}>
      {/* Logo-pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "9px 22px", borderRadius: 999,
        border: `1.5px solid ${phqC.ink}`,
        background: "transparent",
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: 3,
          background: phqC.ink, color: phqC.limeAccent,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, letterSpacing: "-.05em",
        }}>P</span>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.02em", color: phqC.ink }}>
          PlayerHQ
        </span>
      </div>

      {/* Nav links (Dashboard is a dark pill) */}
      <nav style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        {links.map(l => {
          const isActive = l === active;
          return (
            <button key={l} style={{
              padding: isActive ? "9px 20px" : "9px 14px",
              borderRadius: 999, border: "none", cursor: "pointer",
              background: isActive ? phqC.ink : "transparent",
              color: isActive ? "#fff" : phqC.ink,
              fontSize: 13, fontWeight: isActive ? 600 : 500,
              letterSpacing: "-.005em", ...phqFont,
            }}>{l}</button>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={phqPillBtn()}>
          <LucideIcon name="settings" size={13} color={phqC.ink} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Innstillinger</span>
        </button>
        <button style={phqIconBtn()}>
          <LucideIcon name="bell" size={14} color={phqC.ink} />
          <span style={{
            position: "absolute", top: 6, right: 6, width: 6, height: 6,
            background: phqC.danger, borderRadius: "50%",
            border: `1.5px solid ${phqC.limeBg}`,
          }} />
        </button>
        <button style={phqIconBtn()}>
          <LucideIcon name="user" size={14} color={phqC.ink} />
        </button>
      </div>
    </div>
  );
}

function phqPillBtn() {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "9px 14px", borderRadius: 999,
    background: "transparent", border: `1px solid ${phqC.ink}`,
    color: phqC.ink, cursor: "pointer", ...phqFont,
  };
}
function phqIconBtn() {
  return {
    position: "relative",
    width: 36, height: 36, borderRadius: "50%",
    background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  };
}

/* ─── Hero (welcome + KPI row + right stats) ──────────────── */
function PhqHero() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "end", gap: 40, paddingBottom: 22,
    }}>
      {/* Left — headline + KPI pills */}
      <div>
        <h1 style={{
          fontSize: 56, fontWeight: 500, letterSpacing: "-.035em",
          margin: "0 0 18px", color: phqC.ink, lineHeight: 1.02,
        }}>Velkommen tilbake, <em style={{ fontStyle: "italic", fontWeight: 500 }}>Magnus</em></h1>

        {/* Progress pills row — fairways / GIR / scramble / scoring */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PhqKpiPill label="Fairways"       value="58%" tone="dark"    size={0.58} />
          <PhqKpiPill label="GIR"            value="52%" tone="accent"  size={0.52} />
          <PhqKpiPill label="Scrambling"     value="41%" tone="hatch"   size={0.41} />
          <PhqKpiPill label="Scoring avg"    value="74.2" tone="outline" size={0.74} wide />
        </div>
      </div>

      {/* Right — 3 headline stats */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, paddingBottom: 4 }}>
        <PhqHeadlineStat icon="flag" value="14" label="Runder" />
        <PhqHeadlineStat icon="dumbbell" value="56" label="Økter" />
        <PhqHeadlineStat icon="trending-down" value="−2.4" label="HCP ↓" accent />
      </div>
    </div>
  );
}

function PhqKpiPill({ label, value, tone, size, wide }) {
  // "tone" controls the visual language: dark pill, accent pill, hatched pill, outline-with-bar
  const baseW = wide ? 260 : 170;

  if (tone === "dark") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 2,
        padding: "8px 16px", borderRadius: 999,
        background: phqC.ink, color: "#fff",
        minWidth: baseW,
      }}>
        <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.65, textTransform: "lowercase", letterSpacing: "-.005em" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
    );
  }

  if (tone === "accent") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 2,
        padding: "8px 16px", borderRadius: 999,
        background: phqC.limeAccent, color: phqC.ink,
        minWidth: baseW,
      }}>
        <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.65, letterSpacing: "-.005em" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
    );
  }

  if (tone === "hatch") {
    return (
      <div style={{
        position: "relative", display: "flex", flexDirection: "column", gap: 2,
        padding: "8px 16px", borderRadius: 999,
        background: `repeating-linear-gradient(135deg, ${phqC.ink}22 0 1.5px, transparent 1.5px 9px), ${phqC.cardSoft}`,
        minWidth: baseW, overflow: "hidden",
      }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: phqC.inkSoft, letterSpacing: "-.005em" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: phqC.ink, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
    );
  }

  // outline with inner fill
  return (
    <div style={{
      position: "relative", display: "flex", flexDirection: "column", gap: 2,
      padding: "8px 16px", borderRadius: 999,
      background: phqC.cardSoft,
      border: `1px solid ${phqC.cardBorder}`,
      minWidth: baseW, overflow: "hidden",
    }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: phqC.inkSoft, letterSpacing: "-.005em" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: phqC.ink, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function PhqHeadlineStat({ icon, value, label, accent }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 10,
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: "50%",
        background: accent ? phqC.limeAccent : "rgba(10,31,24,0.08)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        alignSelf: "flex-end", marginBottom: 10,
      }}>
        <LucideIcon name={icon} size={13} color={phqC.ink} />
      </span>
      <div>
        <div style={{
          fontSize: 46, fontWeight: 500, letterSpacing: "-.03em",
          color: phqC.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums",
        }}>{value}</div>
        <div style={{
          fontSize: 11, color: phqC.inkSoft, marginTop: 2,
          fontWeight: 500, letterSpacing: "-.005em",
        }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Row 1: profile · progress · time tracker · onboarding ─ */
function PhqRowOne() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1.2fr 1fr 1fr",
      gap: 14, paddingBottom: 14,
    }}>
      <PhqProfileCard />
      <PhqProgressCard />
      <PhqTimeTrackerCard />
      <PhqFormCard />
    </div>
  );
}

function PhqProfileCard() {
  return (
    <div style={{
      position: "relative",
      height: 320, borderRadius: 20, overflow: "hidden",
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
    }}>
      {/* Portrait fills the card */}
      <img src={window.__resources?.profileMagnus || "assets/profile-magnus.jpeg"}
        alt="Magnus Kjelsrud"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "50% 18%",
          filter: "saturate(1.05) contrast(1.02)",
        }}
      />
      {/* Bottom gradient */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "52%",
        background: "linear-gradient(180deg, rgba(10,31,24,0) 0%, rgba(10,31,24,0.55) 55%, rgba(10,31,24,0.85) 100%)",
      }} />
      {/* Bottom content — name + HCP pill */}
      <div style={{
        position: "absolute", left: 16, right: 16, bottom: 16,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 10,
      }}>
        <div>
          <div style={{
            fontSize: 18, fontWeight: 600, color: "#fff",
            letterSpacing: "-.02em", lineHeight: 1.1,
          }}>Magnus Kjelsrud</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>
            Pro · AK Golf Group
          </div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 999,
          background: "rgba(255,255,255,0.92)", color: phqC.ink,
          fontSize: 12, fontWeight: 600,
        }}>
          <span style={{ color: phqC.muted, fontSize: 10, fontWeight: 500 }}>HCP</span>
          +1.2
        </div>
      </div>
    </div>
  );
}

function PhqProgressCard() {
  // Bar chart: avg slag per runde per dag (S M T O T F L)
  const bars = [
    { d: "S", v: 0.50 },
    { d: "M", v: 0.72 },
    { d: "T", v: 0.68 },
    { d: "O", v: 0.44 },
    { d: "T", v: 0.81 },
    { d: "F", v: 0.95, peak: true },
    { d: "L", v: 0.60 },
  ];
  return (
    <div style={{
      height: 320, borderRadius: 20, padding: 22,
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: phqC.ink, letterSpacing: "-.01em" }}>
            Fremdrift
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
            <span style={{
              fontSize: 46, fontWeight: 500, letterSpacing: "-.03em",
              color: phqC.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums",
            }}>6.1<span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-.02em" }}>t</span></span>
            <span style={{ fontSize: 11, color: phqC.inkSoft, lineHeight: 1.25, paddingBottom: 3 }}>
              Treningstid<br/>denne uken
            </span>
          </div>
        </div>
        <button style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "transparent", border: `1px solid ${phqC.cardBorder}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <LucideIcon name="arrow-up-right" size={13} color={phqC.ink} />
        </button>
      </div>

      {/* Bar chart */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: `repeat(${bars.length}, 1fr)`,
        alignItems: "end", gap: 10, paddingTop: 18, position: "relative",
      }}>
        {bars.map((b, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            position: "relative",
          }}>
            {b.peak && (
              <span style={{
                position: "absolute", top: -4, transform: "translateY(-100%)",
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 9px", borderRadius: 999,
                background: phqC.limeAccent, color: phqC.ink,
                fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
              }}>
                <LucideIcon name="flame" size={10} color={phqC.ink} />
                1t 35m
              </span>
            )}
            <div style={{
              width: b.peak ? 20 : 6,
              height: `${b.v * 140}px`,
              background: b.peak ? phqC.limeAccent : phqC.ink,
              borderRadius: 99,
            }} />
            <span style={{ fontSize: 10, color: phqC.muted, fontWeight: 500 }}>{b.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhqTimeTrackerCard() {
  // Ring: 02:35 trening fullført av 04:00 plan
  const total = 360; // circumference
  const pct = 0.64;
  return (
    <div style={{
      height: 320, borderRadius: 20, padding: 22,
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: phqC.ink, letterSpacing: "-.01em" }}>
          Økt-tracker
        </div>
        <button style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "transparent", border: `1px solid ${phqC.cardBorder}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <LucideIcon name="arrow-up-right" size={13} color={phqC.ink} />
        </button>
      </div>

      {/* Ring + center */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg width={170} height={170} viewBox="0 0 170 170" style={{ display: "block" }}>
          {/* Tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const r1 = 78, r2 = i % 5 === 0 ? 68 : 72;
            const x1 = 85 + Math.cos(a) * r1, y1 = 85 + Math.sin(a) * r1;
            const x2 = 85 + Math.cos(a) * r2, y2 = 85 + Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={phqC.ink} strokeOpacity={i % 5 === 0 ? 0.55 : 0.22}
              strokeWidth={i % 5 === 0 ? 1.4 : 1} strokeLinecap="round" />;
          })}
          {/* Arc — lime fill for completed portion */}
          <circle cx={85} cy={85} r={60}
            fill="none" stroke={phqC.limeAccent} strokeWidth={14}
            strokeDasharray={`${2*Math.PI*60*pct} ${2*Math.PI*60}`}
            strokeDashoffset={2*Math.PI*60*0.25}
            strokeLinecap="round"
            transform="rotate(-90 85 85)"
          />
          {/* Remaining outline */}
          <circle cx={85} cy={85} r={60}
            fill="none" stroke={phqC.ink} strokeOpacity={0.12} strokeWidth={14}
            strokeDasharray={`${2*Math.PI*60*(1-pct)} ${2*Math.PI*60}`}
            strokeDashoffset={-2*Math.PI*60*pct + 2*Math.PI*60*0.25}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontSize: 32, fontWeight: 500, letterSpacing: "-.03em",
            color: phqC.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1,
          }}>02:35</div>
          <div style={{ fontSize: 10, color: phqC.inkSoft, marginTop: 4 }}>Dagens trening</div>
        </div>
      </div>

      {/* Play bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "transparent", border: `1px solid ${phqC.cardBorder}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <LucideIcon name="play" size={12} color={phqC.ink} />
          </button>
          <button style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "transparent", border: `1px solid ${phqC.cardBorder}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <LucideIcon name="pause" size={12} color={phqC.ink} />
          </button>
        </div>
        <button style={{
          width: 28, height: 28, borderRadius: "50%",
          background: phqC.ink, border: "none",
          display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <LucideIcon name="square" size={11} color="#fff" />
        </button>
      </div>
    </div>
  );
}

function PhqFormCard() {
  // "Formsjekk 68%" + 3 progress bars: Fysisk / Mental / Teknisk
  const bars = [
    { label: "Fysisk",   pct: 0.82, tone: "accent" },
    { label: "Mental",   pct: 0.64, tone: "dark" },
    { label: "Teknisk",  pct: 0.41, tone: "muted" },
  ];
  return (
    <div style={{
      height: 320, borderRadius: 20, padding: 22,
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: phqC.ink, letterSpacing: "-.01em" }}>
          Formsjekk
        </div>
        <div style={{
          fontSize: 24, fontWeight: 500, letterSpacing: "-.02em",
          color: phqC.ink, fontVariantNumeric: "tabular-nums",
        }}>68%</div>
      </div>

      {/* Horizontal bar meter (proportion) — mirrors "task/pending/done" pattern */}
      <div style={{ display: "flex", gap: 3, alignItems: "center", marginTop: 18, marginBottom: 16 }}>
        <div style={{
          height: 26, borderRadius: 999,
          background: phqC.limeAccent, flex: 82,
          position: "relative",
        }}>
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, fontWeight: 600, color: phqC.ink,
          }}>82%</span>
        </div>
        <div style={{ height: 26, borderRadius: 999, background: phqC.ink, flex: 64 }} />
        <div style={{ height: 26, borderRadius: 999, background: "rgba(10,31,24,0.15)", flex: 41 }} />
      </div>

      {/* Legend rows with sparkline-style indicator */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 10, height: 10, borderRadius: 3,
              background: b.tone === "accent" ? phqC.limeAccent
                        : b.tone === "dark"    ? phqC.ink
                        : "rgba(10,31,24,0.15)",
            }} />
            <span style={{ fontSize: 12, color: phqC.ink, flex: 1, fontWeight: 500 }}>{b.label}</span>
            <span style={{ fontSize: 11, color: phqC.inkSoft, fontVariantNumeric: "tabular-nums" }}>
              {Math.round(b.pct * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "auto", paddingTop: 12,
        borderTop: `1px dashed ${phqC.cardBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 11, color: phqC.inkSoft,
      }}>
        <span>Siste vurdering</span>
        <span>21. april · +4 pts</span>
      </div>
    </div>
  );
}

/* ─── Row 2: equipment/list · calendar · today's tasks ──── */
function PhqRowTwo() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1.6fr 1.1fr",
      gap: 14,
    }}>
      <PhqListCard />
      <PhqCalendarCard />
      <PhqTasksCard />
    </div>
  );
}

function PhqListCard() {
  // Accordion-style list like Crextio's "Pension / Devices / Compensation"
  const groups = [
    { label: "Statistikk-sammendrag",  open: false },
    { label: "Utstyr", open: true, items: [
      { icon: "flag",    name: "Driver", detail: "Ping G430 LST" },
      { icon: "target",  name: "Putter",  detail: "Scotty Cameron Phantom X" },
    ]},
    { label: "Mål & milepæler", open: false },
    { label: "Helsestatus",      open: false },
  ];
  return (
    <div style={{
      borderRadius: 20, padding: "10px 0",
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
      overflow: "hidden",
    }}>
      {groups.map((g, i) => (
        <div key={i} style={{
          borderBottom: i < groups.length - 1 ? `1px dashed ${phqC.cardBorder}` : "none",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 22px", cursor: "pointer",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: phqC.ink }}>{g.label}</span>
            <LucideIcon name={g.open ? "chevron-up" : "chevron-down"} size={14} color={phqC.inkSoft} />
          </div>
          {g.open && g.items && (
            <div style={{ padding: "0 22px 14px" }}>
              {g.items.map((it, k) => (
                <div key={k} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "6px 0",
                }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: phqC.limeBg,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <LucideIcon name={it.icon} size={15} color={phqC.ink} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: phqC.ink }}>{it.name}</div>
                    <div style={{ fontSize: 10, color: phqC.muted, marginTop: 1 }}>{it.detail}</div>
                  </div>
                  <LucideIcon name="more-vertical" size={13} color={phqC.muted} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PhqCalendarCard() {
  // Crextio-style week strip (Mon–Sat) with two event chips
  const days = [
    { d: "Man", n: 21 },
    { d: "Tir", n: 22 },
    { d: "Ons", n: 23, active: true },
    { d: "Tor", n: 24 },
    { d: "Fre", n: 25 },
    { d: "Lør", n: 26 },
  ];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

  return (
    <div style={{
      borderRadius: 20, padding: "16px 22px",
      background: phqC.card, border: `1px solid ${phqC.cardBorder}`,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Header: prev-month · current · next-month */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: phqC.muted }}>Mars</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: phqC.ink, letterSpacing: "-.01em" }}>
          April 2026
        </span>
        <span style={{ fontSize: 11, color: phqC.muted }}>Mai</span>
      </div>

      {/* Day columns header */}
      <div style={{
        display: "grid", gridTemplateColumns: "56px repeat(6, 1fr)",
        alignItems: "center", gap: 6, padding: "2px 0 6px",
      }}>
        <div />
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: phqC.muted, fontWeight: 500 }}>{d.d}</div>
            <div style={{
              fontSize: 15, fontWeight: 600,
              color: d.active ? phqC.ink : phqC.inkSoft,
              marginTop: 2,
            }}>{d.n}</div>
          </div>
        ))}
      </div>

      {/* Timeline rows */}
      <div style={{ position: "relative", minHeight: 144 }}>
        {hours.map((h, i) => (
          <div key={h} style={{
            display: "grid", gridTemplateColumns: "56px 1fr",
            alignItems: "center", height: 28,
            borderTop: i === 0 ? "none" : `1px dashed ${phqC.cardBorder}`,
          }}>
            <span style={{ fontSize: 10, color: phqC.muted }}>{h}</span>
            <div />
          </div>
        ))}

        {/* Event 1: 09:15 — Teamsync (dark pill) */}
        <div style={{
          position: "absolute", top: 32, left: 62, width: "55%",
          display: "flex", alignItems: "center", gap: 10,
          padding: "7px 12px", borderRadius: 999,
          background: phqC.ink, color: "#fff",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Coaching — Andreas</div>
            <div style={{ fontSize: 9, opacity: 0.65 }}>Videoanalyse, range</div>
          </div>
          <div style={{ display: "flex" }}>
            {["#E8F4A8", "#AFE3CC", "#F5D28F"].map((c, i) => (
              <span key={i} style={{
                width: 18, height: 18, borderRadius: "50%",
                background: c, border: `1.5px solid ${phqC.ink}`,
                marginLeft: i === 0 ? 0 : -6,
              }} />
            ))}
          </div>
        </div>

        {/* Event 2: 10:30 — Range session (lime pill) */}
        <div style={{
          position: "absolute", top: 92, left: "42%", width: "48%",
          display: "flex", alignItems: "center", gap: 10,
          padding: "7px 12px", borderRadius: 999,
          background: phqC.limeAccent, color: phqC.ink,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700 }}>Range · driver-konsistens</div>
            <div style={{ fontSize: 9, opacity: 0.75 }}>75 min · Trackman</div>
          </div>
          <div style={{ display: "flex" }}>
            {["#0A1F18", "#324D45"].map((c, i) => (
              <span key={i} style={{
                width: 18, height: 18, borderRadius: "50%",
                background: c, border: `1.5px solid ${phqC.limeAccent}`,
                marginLeft: i === 0 ? 0 : -6,
                color: "#fff", fontSize: 8, fontWeight: 700,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{i === 0 ? "M" : "A"}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhqTasksCard() {
  // Dark "Onboarding"-style card — shows today's training tasks.
  const tasks = [
    { icon: "flame",        label: "Oppvarming",          time: "08:00", done: true  },
    { icon: "dumbbell",     label: "Styrke · underkropp", time: "08:15", done: true  },
    { icon: "target",       label: "Putting · 2–4 meter", time: "11:00", done: false },
    { icon: "video",        label: "Coaching — Andreas",  time: "14:30", done: false },
    { icon: "flag",         label: "9 hull · oppvarming", time: "16:00", done: false },
  ];
  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div style={{
      borderRadius: 20, padding: 22,
      background: phqC.darkCard, color: phqC.darkInk,
      display: "flex", flexDirection: "column",
      boxShadow: "inset 0 0 0 1px rgba(237,245,218,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-.01em" }}>
          Dagens plan
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: "#fff",
          fontVariantNumeric: "tabular-nums",
        }}>{doneCount}/{tasks.length}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "9px 10px", borderRadius: 12,
            background: "rgba(237,245,218,0.04)",
            opacity: t.done ? 0.55 : 1,
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: 7,
              background: "rgba(237,245,218,0.08)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <LucideIcon name={t.icon} size={14} color={phqC.limeAccent} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#fff",
                textDecoration: t.done ? "line-through" : "none",
                textDecorationColor: "rgba(255,255,255,0.3)",
              }}>{t.label}</div>
              <div style={{
                fontSize: 10, color: phqC.darkMuted, marginTop: 2,
                fontVariantNumeric: "tabular-nums",
              }}>23. april · {t.time}</div>
            </div>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: t.done ? phqC.limeAccent : "transparent",
              border: t.done ? "none" : "1.5px solid rgba(237,245,218,0.25)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {t.done && <LucideIcon name="check" size={11} color={phqC.ink} strokeWidth={3} />}
            </span>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: 12, padding: "10px 12px", borderRadius: 12,
        background: phqC.limeAccent, color: phqC.ink, border: "none",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        ...phqFont,
      }}>
        <LucideIcon name="play" size={12} color={phqC.ink} strokeWidth={2.5} />
        Start første økt
      </button>
    </div>
  );
}

Object.assign(window, { PlayerHQCrextio });
