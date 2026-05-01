/* Hero + Nav + main composition */

function Nav({ accent }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#playerhq", label: "PlayerHQ" },
    { href: "#coaching", label: "Coaching" },
    { href: "#pricing",  label: "Pakker" },
    { href: "#footer",   label: "Kontakt" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "22px 40px",
      background: scrolled ? "rgba(10,15,12,0.55)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
      transition: "all 250ms ease",
    }}>
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        {/* logo */}
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", textDecoration: "none" }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            border: "1.5px solid #fff", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>
            ak golf
          </span>
        </a>

        {/* center links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              color: "rgba(255,255,255,0.85)", textDecoration: "none",
              fontSize: 14, fontWeight: 400, letterSpacing: "-0.005em",
              transition: "color 150ms ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            >{l.label}</a>
          ))}
        </div>

        {/* right: mini toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 6px", borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", paddingRight: 8 }}>No</span>
          </div>
          <button style={{
            padding: "10px 22px", borderRadius: 999,
            background: "rgba(255,255,255,0.12)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
          }}>Book prøvetime</button>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════ HERO — Golfair-style full-bleed photo ═══════════ */
function Hero({ accent, motionLevel, tiltEnabled, currentScreen, setCurrentScreen, scrollTilt }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <section data-screen-label="Hero" style={{
      position: "relative", height: "100vh", minHeight: 720,
      overflow: "hidden", background: "#0A0F0C",
    }}>
      {/* Full-bleed golf photo background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2400&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center 55%",
        transform: `scale(${1.05 + scrollTilt * 0.05}) translateY(${scrollTilt * 30}px)`,
        transition: "transform 100ms linear",
        filter: "brightness(0.85)",
      }} />
      {/* dark gradient overlay for legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          linear-gradient(180deg, rgba(10,15,12,0.55) 0%, rgba(10,15,12,0.15) 30%, rgba(10,15,12,0) 55%, rgba(10,15,12,0.75) 100%),
          linear-gradient(90deg, rgba(10,15,12,0.65) 0%, rgba(10,15,12,0.25) 40%, rgba(10,15,12,0) 70%)
        `,
      }} />
      {/* subtle grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.3, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
      }} />

      {/* Floating "I dag" events card (top right) */}
      <div style={{
        position: "absolute", top: 110, right: 48, zIndex: 5,
        width: 360, padding: 20, borderRadius: 22,
        background: "rgba(15,20,18,0.55)", backdropFilter: "blur(28px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 700ms ease 300ms, transform 700ms cubic-bezier(0.2,0.8,0.2,1) 300ms",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>I dag · events</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>+ Neste event</span>
        </div>

        {[
          { time: "10:00", title: "Helge-turnering 9 hull", sub: "Turnering", avatars: ["MK","NB","AK"], count: "+2" },
          { time: "16:30", title: "Kveldens golf-lounge", sub: "Workshop", avatars: ["TL","NB"], count: "+5" },
        ].map((e, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "10px 0", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", minWidth: 70 }}>
              {e.time}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{e.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{e.sub}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {e.avatars.map((a, ai) => (
                <div key={ai} style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: `hsl(${140 + ai * 30}, 45%, 50%)`,
                  border: "1.5px solid rgba(15,20,18,0.9)",
                  marginLeft: ai === 0 ? 0 : -6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 700, color: "#fff",
                }}>{a}</div>
              ))}
              <div style={{
                marginLeft: 6, fontSize: 10, color: "rgba(255,255,255,0.6)",
                padding: "2px 6px", borderRadius: 8, background: "rgba(255,255,255,0.08)",
              }}>{e.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Rotating badge — center-ish */}
      <div style={{
        position: "absolute", left: "48%", top: "46%",
        width: 110, height: 110, zIndex: 4,
        opacity: mounted ? 1 : 0,
        transition: "opacity 1000ms ease 600ms",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }} />
        <svg viewBox="0 0 110 110" style={{
          position: "absolute", inset: 0,
          animation: motionLevel !== "subtle" ? "rotate 16s linear infinite" : "none",
        }}>
          <defs>
            <path id="circTxt" d="M 55 55 m -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" />
          </defs>
          <text fill="rgba(255,255,255,0.9)" style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: "0.28em" }}>
            <textPath href="#circTxt">SPILLE SMARTERE · TRENE BEDRE · </textPath>
          </text>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0A0F0C", fontSize: 16,
          }}>▸</div>
        </div>
      </div>

      {/* Headline bottom-left */}
      <div style={{
        position: "absolute", left: 48, bottom: 100, zIndex: 4,
        maxWidth: 640,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 900ms ease 150ms, transform 900ms cubic-bezier(0.2,0.8,0.2,1) 150ms",
      }}>
        <h1 style={{
          fontSize: "clamp(52px, 6vw, 96px)", fontWeight: 400,
          letterSpacing: "-0.03em", lineHeight: 1.0, margin: "0 0 24px",
          color: "#fff", textWrap: "balance",
        }}>
          Spill smartere på<br />
          <span style={{ fontStyle: "italic", fontWeight: 300 }}>grønne greener.</span>
        </h1>

        <p style={{
          fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,0.75)",
          maxWidth: 480, margin: "0 0 36px", textWrap: "pretty",
        }}>
          Personlig coaching og PlayerHQ-appen som samler TrackMan, HCP og
          restitusjon i ett. Du spiller, vi måler, sammen trener vi smartere.
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 28px", borderRadius: 999,
            background: "#fff", color: "#0A0F0C", border: "none",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            transition: "transform 200ms ease, box-shadow 200ms ease",
            boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)"; }}
          >Last ned PlayerHQ</button>
          <button style={{
            padding: "14px 28px", borderRadius: 999,
            background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            transition: "background 150ms ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >Utforsk coaching</button>
        </div>
      </div>

      {/* Scroll down indicator bottom right */}
      <div style={{
        position: "absolute", right: 48, bottom: 48, zIndex: 4,
        fontSize: 11, color: "rgba(255,255,255,0.6)",
        letterSpacing: "0.15em", textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>Scroll ned</span>
        <span style={{ fontSize: 14 }}>↓</span>
      </div>
    </section>
  );
}

function FloatingBadge({ style, icon, label, value, accent, trend }) {
  return null; // unused after golfair redesign
}

/* ═══════════ PHONE SHOWCASE SECTION (Golfair-inspired, floating card + phone) ═══════════ */
function PhoneShowcase({ accent, motionLevel, tiltEnabled, currentScreen, setCurrentScreen }) {
  const ref = React.useRef(null);
  const [localTilt, setLocalTilt] = React.useState(0);
  const inView = useInView(ref, { margin: "0px" });

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top enters viewport bottom, 1 when section bottom leaves top
      const progress = 1 - (r.top + r.height / 2) / vh;
      setLocalTilt(Math.max(-0.5, Math.min(1, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const screens = [
    { key: "dashboard", label: "Dashboard" },
    { key: "trackman",  label: "TrackMan" },
    { key: "handicap",  label: "HCP" },
    { key: "sleep",     label: "Søvn" },
  ];

  return (
    <section ref={ref} id="app" data-screen-label="PhoneShowcase" style={{
      position: "relative", padding: "140px 48px",
      background: "#0A0F0C", overflow: "hidden",
    }}>
      {/* soft green glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 50% 60% at 30% 50%, ${accent}08, transparent 70%)`,
      }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
      }}>
        {/* LEFT — copy */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-24px)",
          transition: "opacity 800ms ease, transform 800ms cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          <div style={{
            display: "inline-block", padding: "6px 12px", borderRadius: 999,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em",
            textTransform: "uppercase", marginBottom: 28,
          }}>PlayerHQ · Spillerportalen</div>

          <h2 style={{
            fontSize: "clamp(40px, 4.5vw, 64px)", fontWeight: 400,
            letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 24px", color: "#fff",
          }}>
            Hele spillet ditt,<br />
            <span style={{ fontStyle: "italic", fontWeight: 300, opacity: 0.85 }}>i én app.</span>
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", margin: "0 0 32px", maxWidth: 440 }}>
            Runder, TrackMan-data, HCP-utvikling og restitusjon samlet. Coachen din sender øvelser direkte til appen — du gjennomfører og får tilbakemelding.
          </p>

          {/* Screen switcher pills (segmented) */}
          <div style={{
            display: "inline-flex", gap: 4, padding: 4, borderRadius: 999,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 32,
          }}>
            {screens.map(s => (
              <button key={s.key} onClick={() => setCurrentScreen(s.key)}
                style={{
                  padding: "8px 18px", borderRadius: 999,
                  background: currentScreen === s.key ? "#fff" : "transparent",
                  color: currentScreen === s.key ? "#0A0F0C" : "rgba(255,255,255,0.7)",
                  border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                  fontFamily: "Inter, system-ui, sans-serif",
                  transition: "all 200ms ease",
                }}>{s.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 440 }}>
            {[
              ["4,8★", "App Store-vurdering"],
              ["−2,3", "Snitt HCP-kutt/år"],
              ["340+", "Aktive spillere"],
              ["12 400", "Slag registrert i 2025"],
            ].map(([v, l]) => (
              <div key={l} style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — phone */}
        <div style={{
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 740,
        }}>
          <div style={{
            position: "absolute", width: 480, height: 480, borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}18, transparent 65%)`,
            filter: "blur(40px)", pointerEvents: "none",
          }} />
          <PhoneMockup
            screenKey={currentScreen}
            tiltEnabled={tiltEnabled}
            scrollTilt={tiltEnabled ? localTilt : 0}
            accent={accent}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ APP ═══════════ */
function App() {
  const [tw, setTw] = useTweaks(/*EDITMODE-BEGIN*/{
    "accent": "#D1F843",
    "motionLevel": "rich",
    "tiltEnabled": true,
    "screen": "dashboard"
  }/*EDITMODE-END*/);

  const [scrollTilt, setScrollTilt] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = window.innerHeight * 0.9;
      setScrollTilt(Math.max(0, Math.min(1, y / max)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setCurrentScreen = (s) => setTw("screen", s);

  return (
    <div id="top" style={{
      background: "#0A0F0C", color: "#fff", minHeight: "100vh",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <Nav accent={tw.accent} />

      <Hero
        accent={tw.accent}
        motionLevel={tw.motionLevel}
        tiltEnabled={tw.tiltEnabled}
        currentScreen={tw.screen}
        setCurrentScreen={setCurrentScreen}
        scrollTilt={tw.tiltEnabled ? scrollTilt : 0}
      />

      <PhoneShowcase
        accent={tw.accent}
        motionLevel={tw.motionLevel}
        tiltEnabled={tw.tiltEnabled}
        currentScreen={tw.screen}
        setCurrentScreen={setCurrentScreen}
      />

      <FeaturesSection accent={tw.accent} motionLevel={tw.motionLevel} />
      <LiveStatsSection accent={tw.accent} />
      <CoachesSection accent={tw.accent} />
      <PricingSection accent={tw.accent} />
      <FooterCTA accent={tw.accent} />

      <TweaksPanel>
        <TweakSection label="Merkevare" />
        <TweakColor label="Aksentfarge" value={tw.accent} onChange={v => setTw("accent", v)} />
        <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap", paddingLeft: 2 }}>
          {[
            { c: "#D1F843", n: "Lime" },
            { c: "#FFB800", n: "Gul" },
            { c: "#00D9A6", n: "Mynte" },
            { c: "#FF6B4A", n: "Oransje" },
            { c: "#A78BFA", n: "Lilla" },
          ].map(p => (
            <button key={p.c} onClick={() => setTw("accent", p.c)}
              title={p.n}
              style={{
                width: 24, height: 24, borderRadius: 6,
                background: p.c, cursor: "pointer",
                border: tw.accent === p.c ? "2px solid #29261b" : "1px solid rgba(0,0,0,0.15)",
              }} />
          ))}
        </div>

        <TweakSection label="Motion" />
        <TweakRadio
          label="Intensitet"
          value={tw.motionLevel}
          onChange={v => setTw("motionLevel", v)}
          options={[
            { label: "Subtil", value: "subtle" },
            { label: "Moderat", value: "moderate" },
            { label: "Rik",     value: "rich" },
            { label: "Maks",     value: "max" },
          ]}
        />
        <TweakToggle
          label="Telefon-tilt"
          value={tw.tiltEnabled}
          onChange={v => setTw("tiltEnabled", v)}
        />

        <TweakSection label="Mockup" />
        <TweakRadio
          label="App-skjerm"
          value={tw.screen}
          onChange={v => setTw("screen", v)}
          options={[
            { label: "Dash", value: "dashboard" },
            { label: "Track",  value: "trackman" },
            { label: "HCP",       value: "handicap" },
            { label: "Søvn",      value: "sleep" },
          ]}
        />
      </TweaksPanel>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes floatBounce {
          0%, 100% { transform: translate(-50%, 0); }
          50%      { transform: translate(-50%, 6px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0A0F0C; }
        *::selection { background: ${tw.accent}; color: #0A1F18; }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
