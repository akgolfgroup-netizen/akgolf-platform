/* Below-fold sections: Features, LiveStats, Coaches, Pricing, Footer. */

/* ── Count-up hook ── */
function useCountUp(target, { duration = 1400, decimals = 0, trigger = true } = {}) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!trigger) return;
    let start = null;
    let raf;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return val.toFixed(decimals);
}

/* Intersection observer hook to trigger once on view */
function useInView(ref, { margin = "-15%" } = {}) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: margin, threshold: 0.1 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, margin]);
  return seen;
}

/* ── Magnetic button ── */
function MagneticButton({ children, primary, accent, motionLevel = "rich", onClick, style = {}, ...rest }) {
  const ref = React.useRef(null);
  const [t, setT] = React.useState({ x: 0, y: 0 });
  const intensity = motionLevel === "max" ? 0.5 : motionLevel === "rich" ? 0.35 : motionLevel === "moderate" ? 0.18 : 0;

  const onMove = (e) => {
    if (!intensity) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setT({ x: dx * intensity, y: dy * intensity });
  };
  const onLeave = () => setT({ x: 0, y: 0 });

  const bg = primary ? accent : "transparent";
  const color = primary ? "#0A1F18" : "#fff";
  const border = primary ? "none" : `1px solid ${accent}66`;

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "14px 26px", borderRadius: 999,
        background: bg, color, border,
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: 700, fontSize: 15, cursor: "pointer",
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: "transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1), background 200ms ease",
        boxShadow: primary ? `0 8px 30px ${accent}55, 0 0 0 0 ${accent}` : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Section heading ── */
function SectionHeading({ eyebrow, title, sub, accent, align = "left" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 40, maxWidth: 680, margin: align === "center" ? "0 auto 40px" : "0 0 40px" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 14px", borderRadius: 999,
        background: `${accent}15`, border: `1px solid ${accent}35`,
        color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: 18,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
        {eyebrow}
      </div>
      <h2 style={{
        fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em",
        lineHeight: 1.05, margin: "0 0 16px", color: "#fff",
      }}>{title}</h2>
      {sub && <p style={{ fontSize: 17, lineHeight: 1.6, color: "#A5B2AD", margin: 0, textWrapPretty: "pretty" }}>{sub}</p>}
    </div>
  );
}

/* ═══════════ FEATURES SECTION (PlayerHQ) ═══════════ */
function FeaturesSection({ accent, motionLevel }) {
  const features = [
    {
      n: "01",
      title: "Live TrackMan-data",
      desc: "Alle slag, alle økter. Ballhastighet, spinn, smash-factor og spredning — synkronisert direkte fra TrackMan til lommen din.",
      tag: "Radar",
    },
    {
      n: "02",
      title: "HCP-tracking som faktisk forklarer",
      desc: "Ikke bare et tall. Se hvilke deler av spillet som trekker handicap opp — putting, jernspill, short game — og hva du bør trene på neste uke.",
      tag: "Analyse",
    },
    {
      n: "03",
      title: "Søvn og treningsstatus",
      desc: "Restitusjonsdata kobles til rundescorene dine. Du ser når du er klar for hard trening og når kroppen trenger å hente seg inn.",
      tag: "Restitusjon",
    },
    {
      n: "04",
      title: "Treningsplan fra coachen din",
      desc: "Coachen sender øvelser direkte til appen. Du gjennomfører, registrerer, får tilbakemelding. Ingen mellomledd.",
      tag: "Coaching",
    },
  ];

  return (
    <section id="playerhq" data-screen-label="Features" style={{ padding: "120px 48px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="PlayerHQ"
          title="Hele spillet ditt, i én app."
          sub="Spillerportalen samler runder, TrackMan, restitusjon og coach-planer. Du slipper å flytte data mellom fem verktøy — du spiller, appen husker."
          accent={accent}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <FeatureCard key={f.n} {...f} accent={accent} delay={i * 80} motionLevel={motionLevel} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ n, title, desc, tag, accent, delay, motionLevel }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);
  const [hover, setHover] = React.useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#133A2D" : "#0D2E23",
        border: `1px solid ${hover ? accent + "40" : "#1a4a3a"}`,
        borderRadius: 16, padding: 28, position: "relative",
        transition: "background 250ms ease, border 250ms ease, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 600ms ease",
        transitionDelay: `${delay}ms`,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        opacity: inView ? 1 : 0,
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 18, right: 18,
        fontSize: 11, color: "#7a9a8e", fontWeight: 700, letterSpacing: "0.08em",
      }}>{tag.toUpperCase()}</div>
      <div style={{
        fontSize: 13, color: accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 24,
      }}>{n}</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#A5B2AD", margin: 0 }}>{desc}</p>
      {/* corner accent */}
      <div style={{
        position: "absolute", bottom: -60, right: -60,
        width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}25, transparent 70%)`,
        opacity: hover ? 1 : 0.3, transition: "opacity 300ms ease",
      }} />
    </div>
  );
}

/* ═══════════ LIVE STATS SHOWCASE ═══════════ */
function LiveStatsSection({ accent }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);

  const stats = [
    { v: 12400, d: 0, suffix: "+", label: "Slag registrert i 2025" },
    { v: 2.3, d: 1, suffix: " år", label: "Gj.sn. HCP-reduksjon i programmet" },
    { v: 94, d: 0, suffix: "%", label: "Spillere som fullfører sesongen" },
    { v: 340, d: 0, suffix: "", label: "Aktive medlemmer i Spillerportalen" },
  ];

  return (
    <section id="data" data-screen-label="LiveStats" ref={ref} style={{
      padding: "100px 48px",
      background: `linear-gradient(180deg, transparent 0%, ${accent}08 50%, transparent 100%)`,
      borderTop: "1px solid #1a4a3a", borderBottom: "1px solid #1a4a3a",
      position: "relative", overflow: "hidden",
    }}>
      {/* drifting radial */}
      <div style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: "90%", height: "200%",
        background: `radial-gradient(ellipse, ${accent}10, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          {stats.map((s, i) => <StatBlock key={i} {...s} accent={accent} inView={inView} delay={i * 120} />)}
        </div>
      </div>
    </section>
  );
}

function StatBlock({ v, d, suffix, label, accent, inView, delay }) {
  const [trigger, setTrigger] = React.useState(false);
  React.useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setTrigger(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);
  const val = useCountUp(v, { duration: 1600, decimals: d, trigger });

  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
    }}>
      <div style={{
        fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800,
        letterSpacing: "-0.03em", lineHeight: 1, color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        {d === 0 ? Math.round(val).toLocaleString("nb-NO") : val.replace(".", ",")}
        <span style={{ color: accent }}>{suffix}</span>
      </div>
      <div style={{
        marginTop: 12, fontSize: 13, color: "#A5B2AD", lineHeight: 1.4,
        maxWidth: 200, textWrapPretty: "pretty",
      }}>{label}</div>
    </div>
  );
}

/* ═══════════ COACHES ═══════════ */
function CoachesSection({ accent }) {
  const coaches = [
    {
      name: "Aksel Kristoffersen",
      role: "Head Coach · PGA Pro",
      bio: "20+ år som coach. Fokus på biomekanikk og data-drevet teknikkutvikling.",
      stats: [["Spillere", "48"], ["Snitt HCP-kutt", "−3,2"], ["Sesonger", "12"]],
      initials: "AK",
      hue: 150,
    },
    {
      name: "Nora Berg",
      role: "Junior Academy Lead",
      bio: "Spesialisert på aldersgruppen 12–18. Tidligere landslagsspiller.",
      stats: [["Juniorer", "32"], ["Nasjonale mesterskap", "7"], ["Sesonger", "8"]],
      initials: "NB",
      hue: 75,
    },
    {
      name: "Tobias Lunde",
      role: "Short Game Specialist",
      bio: "Putting, chipping, bunker. Bruker TrackMan og force plate som standard.",
      stats: [["Økter/uke", "24"], ["HCP-snitt elever", "8,4"], ["Sesonger", "6"]],
      initials: "TL",
      hue: 170,
    },
  ];

  return (
    <section id="coaching" data-screen-label="Coaches" style={{ padding: "120px 48px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Coaching"
          title="Coacher som faktisk kjenner spillet ditt."
          sub="Treningen starter med data, ikke magefølelse. Hver coach jobber direkte i PlayerHQ så du alltid vet hva du skal trene på neste uke."
          accent={accent}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {coaches.map((c, i) => <CoachCard key={c.name} {...c} accent={accent} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function CoachCard({ name, role, bio, stats, initials, hue, accent, idx }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);
  const [hover, setHover] = React.useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#0D2E23",
        border: `1px solid ${hover ? accent + "40" : "#1a4a3a"}`,
        borderRadius: 20, overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms ease ${idx * 120}ms, transform 700ms cubic-bezier(0.2,0.8,0.2,1) ${idx * 120}ms, border 250ms ease`,
      }}
    >
      {/* portrait placeholder: gradient blob + initials */}
      <div style={{
        height: 240, position: "relative", overflow: "hidden",
        background: `
          radial-gradient(ellipse at 30% 40%, hsla(${hue}, 70%, 55%, 0.5), transparent 60%),
          radial-gradient(ellipse at 70% 80%, ${accent}35, transparent 60%),
          linear-gradient(135deg, #0D2E23, #003E2D)
        `,
      }}>
        {/* contour lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }}>
          {Array.from({length: 6}).map((_, i) => (
            <ellipse key={i} cx="50%" cy="50%" rx={80 + i*30} ry={50 + i*20}
              fill="none" stroke={accent} strokeWidth="0.5" strokeDasharray="3 4"
              transform={`rotate(${-15 + i * 6} 150 120)`} />
          ))}
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 110, fontWeight: 800, color: "#fff", opacity: 0.9,
          letterSpacing: "-0.04em", textShadow: `0 0 40px ${accent}55`,
          transform: hover ? "scale(1.05)" : "scale(1)",
          transition: "transform 400ms cubic-bezier(0.2,0.8,0.2,1)",
        }}>{initials}</div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>
          {role.toUpperCase()}
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", color: "#fff", letterSpacing: "-0.01em" }}>{name}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#A5B2AD", margin: "0 0 18px" }}>{bio}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingTop: 16, borderTop: "1px solid #1a4a3a" }}>
          {stats.map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{v}</div>
              <div style={{ fontSize: 10, color: "#7a9a8e", marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ PRICING ═══════════ */
function PricingSection({ accent }) {
  const plans = [
    {
      name: "Spiller",
      price: "249",
      period: "mnd",
      desc: "For deg som vil trene smartere på egenhånd.",
      features: [
        "Full tilgang til PlayerHQ-appen",
        "TrackMan-data og HCP-tracking",
        "Treningsbibliotek med 120+ øvelser",
        "Community og leaderboard",
      ],
      cta: "Start gratis prøve",
    },
    {
      name: "Academy",
      price: "1 490",
      period: "mnd",
      desc: "Personlig coaching + PlayerHQ inkludert.",
      features: [
        "Alt i Spiller-pakken",
        "2 coach-økter per måned",
        "Individuell treningsplan",
        "TrackMan-session månedlig",
        "Videoanalyse og tilbakemelding",
      ],
      cta: "Book prøvetime",
      featured: true,
    },
    {
      name: "Elite",
      price: "3 200",
      period: "mnd",
      desc: "For spillere som sikter høyt.",
      features: [
        "Alt i Academy",
        "Ukentlige coach-økter",
        "Fysisk trener og ernæring",
        "Mental coaching",
        "Turneringsstøtte",
      ],
      cta: "Ta kontakt",
    },
  ];

  return (
    <section id="pricing" data-screen-label="Pricing" style={{ padding: "120px 48px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Pakker"
          title="Velg det nivået du trener på."
          sub="Alle pakker inkluderer tilgang til PlayerHQ. Si opp eller bytt når du vil — ingen bindingstid."
          accent={accent}
          align="center"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {plans.map((p, i) => <PricingCard key={p.name} {...p} accent={accent} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ name, price, period, desc, features, cta, featured, accent, idx }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      style={{
        background: featured ? `linear-gradient(160deg, ${accent}15, #0D2E23 60%)` : "#0D2E23",
        border: `${featured ? "1.5px" : "1px"} solid ${featured ? accent + "55" : "#1a4a3a"}`,
        borderRadius: 20, padding: 32, position: "relative",
        boxShadow: featured ? `0 0 60px ${accent}15` : "none",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `opacity 700ms ease ${idx * 100}ms, transform 700ms cubic-bezier(0.2,0.8,0.2,1) ${idx * 100}ms`,
      }}
    >
      {featured && (
        <div style={{
          position: "absolute", top: -12, left: 24,
          padding: "4px 12px", borderRadius: 999,
          background: accent, color: "#0A1F18",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
        }}>MEST POPULÆR</div>
      )}
      <div style={{ fontSize: 12, color: accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>{name.toUpperCase()}</div>
      <p style={{ fontSize: 13, color: "#A5B2AD", margin: "0 0 24px", lineHeight: 1.5 }}>{desc}</p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
        <span style={{ fontSize: 14, color: "#A5B2AD" }}>kr</span>
        <span style={{ fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</span>
        <span style={{ fontSize: 14, color: "#A5B2AD" }}>/ {period}</span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "#fff", lineHeight: 1.5 }}>
            <span style={{ color: accent, flexShrink: 0 }}>→</span>{f}
          </li>
        ))}
      </ul>

      <button style={{
        width: "100%", padding: "14px",
        background: featured ? accent : "transparent",
        color: featured ? "#0A1F18" : "#fff",
        border: featured ? "none" : `1px solid ${accent}55`,
        borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "Inter, system-ui, sans-serif",
        transition: "transform 150ms ease, box-shadow 200ms ease",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      >{cta}</button>
    </div>
  );
}

/* ═══════════ FOOTER CTA ═══════════ */
function FooterCTA({ accent }) {
  return (
    <section id="footer" data-screen-label="Footer" style={{
      padding: "120px 48px 80px",
      background: `
        radial-gradient(ellipse at 50% 0%, ${accent}22, transparent 60%),
        linear-gradient(180deg, #0A1F18, #050F0B)
      `,
      borderTop: "1px solid #1a4a3a",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: "clamp(42px, 6vw, 84px)", fontWeight: 800, letterSpacing: "-0.03em",
          lineHeight: 1, margin: "0 0 24px", color: "#fff",
        }}>
          Klar for bedre<br />golf i 2026?
        </h2>
        <p style={{ fontSize: 18, color: "#A5B2AD", margin: "0 0 40px", lineHeight: 1.5 }}>
          Book en gratis prøvetime eller last ned PlayerHQ og begynn å spore i dag.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <MagneticButton primary accent={accent}>Last ned PlayerHQ →</MagneticButton>
          <MagneticButton accent={accent}>Book prøvetime</MagneticButton>
        </div>

        <div style={{
          marginTop: 96, paddingTop: 32, borderTop: "1px solid #1a4a3a",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
          fontSize: 12, color: "#7a9a8e",
        }}>
          <div>© 2026 AK Golf Group AS · Fredrikstad, Norge</div>
          <div style={{ display: "flex", gap: 24 }}>
            <span>Personvern</span>
            <span>Vilkår</span>
            <span>Kontakt</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  FeaturesSection, LiveStatsSection, CoachesSection, PricingSection, FooterCTA,
  MagneticButton, SectionHeading, useCountUp, useInView,
});
