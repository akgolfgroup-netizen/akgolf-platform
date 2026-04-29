/* AK Golf — Spillerportalen sales deck
   Light theme · 1920×1080 · Norwegian bokmål */

const TYPE_SCALE = { title: 64, subtitle: 44, body: 34, small: 28, kpi: 140, kpiSmall: 96 };
const SPACING = {
  paddingTop: 100,
  paddingBottom: 80,
  paddingX: 120,
  titleGap: 52,
  itemGap: 28,
};

const AK = {
  primary: '#005840',
  accent: '#D1F843',
  accentDeep: '#B8DF2E',
  surface: '#ECF0EF',
  surfaceAlt: '#F5F8F6',
  text: '#324D45',
  textDeep: '#0A1F18',
  muted: '#A5B2AD',
  border: '#E0E8E5',
  borderDeep: '#C9D4CE',
  success: '#2A7D5A',
  warning: '#C48A32',
  danger:  '#B84233',
  dark:    '#0A1F18',
  cardDark:'#0D2E23',
};

// Accent tweak — read by the deck for section-header slides.
const ACCENT_OPTIONS = {
  lime:    { name: 'Lime',     color: '#D1F843', textOn: '#0A1F18' },
  pine:    { name: 'Pine',     color: '#005840', textOn: '#FFFFFF' },
  sand:    { name: 'Sand',     color: '#E9DFC8', textOn: '#0A1F18' },
};

// ─── Shared primitives ───────────────────────────────────────────
const Frame = ({ bg = '#FFFFFF', children, style = {} }) => (
  <div style={{
    width: '100%', height: '100%',
    background: bg,
    padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
    display: 'flex', flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: AK.textDeep,
    position: 'relative',
    ...style,
  }}>{children}</div>
);

const Eyebrow = ({ children, color = AK.primary }) => (
  <div style={{
    fontSize: TYPE_SCALE.small, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color, marginBottom: 24,
  }}>{children}</div>
);

const Title = ({ children, style = {} }) => (
  <h1 style={{
    margin: 0, fontSize: TYPE_SCALE.title, fontWeight: 800,
    letterSpacing: '-0.02em', lineHeight: 1.05, color: AK.textDeep,
    ...style,
  }}>{children}</h1>
);

const Body = ({ children, style = {} }) => (
  <p style={{
    margin: 0, fontSize: TYPE_SCALE.body, fontWeight: 400,
    lineHeight: 1.5, color: AK.text, ...style,
  }}>{children}</p>
);

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{
    background: '#FFFFFF',
    border: glow ? '1.5px solid rgba(209,248,67,0.55)' : `1px solid ${AK.border}`,
    borderRadius: 20,
    boxShadow: glow ? '0 0 32px rgba(209,248,67,0.22), 0 4px 20px rgba(0,0,0,0.05)'
                    : '0 4px 20px rgba(0,0,0,0.05)',
    padding: 36,
    ...style,
  }}>{children}</div>
);

const Pill = ({ children, active = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 22px', borderRadius: 999,
    fontSize: TYPE_SCALE.small, fontWeight: 600,
    background: active ? AK.accent : '#FFFFFF',
    color: active ? AK.textDeep : AK.text,
    border: active ? 'none' : `1px solid ${AK.border}`,
  }}>{children}</span>
);

const Dot = ({ c = AK.accent, s = 10 }) => (
  <span style={{ display: 'inline-block', width: s, height: s, borderRadius: '50%', background: c }} />
);

const Footer = ({ n, total, label }) => (
  <div style={{
    position: 'absolute', left: SPACING.paddingX, right: SPACING.paddingX,
    bottom: 44, display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', fontSize: 20, color: AK.muted, fontWeight: 500,
    letterSpacing: '0.04em',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src="assets/logos/ak-golf-logo-primary-on-light.svg" style={{ height: 28 }} alt="" />
      <span>Spillerportalen · Salgspresentasjon 2026</span>
    </div>
    <div>{label} · {String(n).padStart(2,'0')} / {String(total).padStart(2,'0')}</div>
  </div>
);

// ─── 01 · Cover ──────────────────────────────────────────────────
const SlideCover = ({ total, variant = 'split' }) => {
  // variant: 'split' | 'center' | 'banner'
  if (variant === 'center') {
    return (
      <Frame bg={AK.surface}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <img src="assets/logos/ak-golf-logo-primary-on-light.svg"
               style={{ height: 88, marginBottom: 80 }} alt="" />
          <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: AK.primary, marginBottom: 32 }}>
            Salgspresentasjon · Våren 2026
          </div>
          <h1 style={{ margin: 0, fontSize: 128, fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 0.95, color: AK.textDeep, maxWidth: 1400 }}>
            Spillerportalen<br/>
            <span style={{ color: AK.primary }}>for klubber</span>
          </h1>
          <div style={{ marginTop: 48, fontSize: TYPE_SCALE.body, color: AK.text, maxWidth: 1100 }}>
            Én plattform for medlemmer, trenere og administrasjon
          </div>
        </div>
        <Footer n={1} total={total} label="Introduksjon" />
      </Frame>
    );
  }
  if (variant === 'banner') {
    return (
      <Frame bg="#FFFFFF" style={{ padding: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div style={{ background: AK.primary, display: 'flex', alignItems: 'flex-end',
            padding: `${SPACING.paddingX}px` }}>
            <img src="assets/logos/ak-golf-logo-white-on-green.svg" style={{ height: 96 }} alt="" />
          </div>
          <div style={{ background: AK.accent, display: 'flex', alignItems: 'flex-start',
            padding: `80px ${SPACING.paddingX}px` }}>
            <div>
              <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: AK.textDeep, marginBottom: 28, opacity: 0.8 }}>
                Salgspresentasjon · Våren 2026
              </div>
              <h1 style={{ margin: 0, fontSize: 132, fontWeight: 800, letterSpacing: '-0.03em',
                lineHeight: 0.95, color: AK.textDeep }}>
                Spillerportalen<br/>for klubber
              </h1>
            </div>
          </div>
        </div>
        <Footer n={1} total={total} label="Introduksjon" />
      </Frame>
    );
  }
  // split — default
  return (
    <Frame bg="#FFFFFF" style={{ padding: 0 }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr' }}>
        <div style={{
          padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <img src="assets/logos/ak-golf-logo-primary-on-light.svg" style={{ height: 72 }} alt="" />
          <div>
            <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: AK.primary, marginBottom: 40 }}>
              Salgspresentasjon · Våren 2026
            </div>
            <h1 style={{ margin: 0, fontSize: 128, fontWeight: 800, letterSpacing: '-0.03em',
              lineHeight: 0.92, color: AK.textDeep }}>
              Spillerportalen<br/>
              <span style={{ color: AK.primary }}>for klubber</span>
            </h1>
            <Body style={{ marginTop: 44, fontSize: 38, maxWidth: 780 }}>
              Én plattform for medlemmer, trenere og administrasjon.
              Bygget i Norge, for norske klubber.
            </Body>
          </div>
          <div style={{ fontSize: 22, color: AK.muted, letterSpacing: '0.02em' }}>
            AK Golf Group AS · Fredrikstad
          </div>
        </div>
        <div style={{
          background: `radial-gradient(circle at 30% 20%, ${AK.accent}30 0%, transparent 55%), linear-gradient(145deg, ${AK.primary} 0%, ${AK.dark} 100%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <CoverDashPreview />
        </div>
      </div>
    </Frame>
  );
};

// A stylized mini-dashboard for the cover right panel
const CoverDashPreview = () => (
  <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex',
    flexDirection: 'column', gap: 22 }}>
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(209,248,67,0.18)',
      borderRadius: 20, padding: 28, color: '#fff',
    }}>
      <div style={{ fontSize: 22, color: AK.accent, fontWeight: 600, marginBottom: 10,
        letterSpacing: '0.08em', textTransform: 'uppercase' }}>Din runde · onsdag</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>78</div>
        <div style={{ fontSize: 24, color: AK.accent, fontWeight: 600 }}>slag</div>
        <div style={{ marginLeft: 'auto', fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>Gamle Fredrikstad GK</div>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 22, fontSize: 22, color: 'rgba(255,255,255,0.85)' }}>
        <span>32 putts</span>
        <span>11 GIR</span>
        <span>HCP 15,9</span>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, flex: 1 }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', color: '#fff',
      }}>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: 14 }}>Treningsstreak</div>
        <div style={{ fontSize: 72, fontWeight: 800, color: AK.accent, lineHeight: 1 }}>12</div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>dager</div>
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(14,1fr)', gap: 4 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const lev = [0,0.2,0.4,0.6,0.9][Math.floor(Math.random()*5)];
            return <div key={i} style={{
              aspectRatio: '1/1',
              background: lev ? `rgba(209,248,67,${lev})` : 'rgba(255,255,255,0.05)',
              borderRadius: 3,
            }} />;
          })}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 24, color: '#fff',
      }}>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: 14 }}>Denne uken</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
          {[0.4,0.65,0.5,0.8,0.95,0.6,0.55].map((h,i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', background: i===4 ? AK.accent : 'rgba(209,248,67,0.30)',
                height: `${h*100}%`, borderRadius: '3px 3px 0 0' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 14,
          color: 'rgba(255,255,255,0.5)' }}>
          {['Man','Tir','Ons','Tor','Fre','Lør','Søn'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>
    </div>
  </div>
);

// ─── 02 · Agenda ──────────────────────────────────────────────────
const SlideAgenda = ({ total }) => {
  const items = [
    ['01', 'Hvor norsk golf står i dag', 'Tall, medlemsutvikling og forventninger'],
    ['02', 'Hva Spillerportalen er', 'Dashbord, handicap, trening — i én app'],
    ['03', 'Hvordan det ser ut for klubben', 'Administrasjon, eierskap, integrasjoner'],
    ['04', 'Pakker og oppstart', 'Priser, implementering og kontakt'],
  ];
  return (
    <Frame bg="#FFFFFF">
      <Eyebrow>Agenda</Eyebrow>
      <Title>Fire deler · 20 minutter</Title>
      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {items.map(([n, t, d]) => (
          <div key={n} style={{ display: 'flex', gap: 32, alignItems: 'flex-start',
            padding: '32px 36px', background: AK.surfaceAlt, border: `1px solid ${AK.border}`,
            borderRadius: 20 }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: AK.primary, lineHeight: 1,
              letterSpacing: '-0.02em', minWidth: 110 }}>{n}</div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: AK.textDeep,
                marginBottom: 10, letterSpacing: '-0.01em' }}>{t}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: AK.text, lineHeight: 1.5 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer n={2} total={total} label="Agenda" />
    </Frame>
  );
};

// ─── 03 · Section header: Marked ──────────────────────────────────
const SectionHeader = ({ n, total, label, kicker, title, accent }) => {
  const bg = accent.color;
  const fg = accent.textOn;
  return (
    <Frame bg={bg} style={{ padding: 0 }}>
      <div style={{ flex: 1, padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: fg, opacity: 0.55 }}>{kicker}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: fg, opacity: 0.55,
            letterSpacing: '0.04em' }}>Del {String(n).padStart(2,'0')}</div>
        </div>
        <div>
          <div style={{ fontSize: 280, fontWeight: 800, color: fg, lineHeight: 0.9,
            letterSpacing: '-0.04em', opacity: 0.1 }}>{String(n).padStart(2,'0')}</div>
          <h1 style={{ margin: '20px 0 0 0', fontSize: 128, fontWeight: 800,
            letterSpacing: '-0.025em', lineHeight: 0.95, color: fg, maxWidth: 1400 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          fontSize: 22, color: fg, opacity: 0.6 }}>
          <span>AK Golf Group · Spillerportalen</span>
          <span>{String(n).padStart(2,'0')} / 04</span>
        </div>
      </div>
    </Frame>
  );
};

// ─── 04 · Norwegian golf market ──────────────────────────────────
const SlideMarket = ({ total }) => {
  const kpis = [
    { v: '127.000', l: 'Aktive medlemmer i Norges Golfforbund', s: '+4,2 % i 2025' },
    { v: '177', l: 'Registrerte klubber i Norge', s: 'Fordelt på 19 fylker' },
    { v: '62 %', l: 'Av medlemmer er over 55 år', s: 'Yngre segmenter vokser raskest' },
    { v: '18,4', l: 'Gjennomsnittlig HCP', s: 'Stabilt siste fem år' },
  ];
  return (
    <Frame bg="#FFFFFF">
      <Eyebrow>Marked · Norge 2025</Eyebrow>
      <Title>Norsk golf vokser — og blir yngre i kantene</Title>
      <Body style={{ marginTop: 28, maxWidth: 1400 }}>
        Etter flere års stagnasjon er medlemstallene på vei opp. Veksten kommer i hovedsak
        fra juniorer og spillere mellom 25–40 år — og de forventer digitale flater.
      </Body>
      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: AK.surfaceAlt, border: `1px solid ${AK.border}`,
            borderRadius: 20, padding: 36,
          }}>
            <div style={{ fontSize: 88, fontWeight: 800, color: AK.primary, lineHeight: 1,
              letterSpacing: '-0.03em' }}>{k.v}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: AK.textDeep,
              marginTop: 18, lineHeight: 1.3 }}>{k.l}</div>
            <div style={{ fontSize: 20, color: AK.muted, marginTop: 14, letterSpacing: '0.02em' }}>
              {k.s}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, fontSize: 18, color: AK.muted, letterSpacing: '0.02em' }}>
        Kilde: Norges Golfforbund, årsrapport 2025. Illustrative tall for presentasjonen.
      </div>
      <Footer n={3} total={total} label="Marked" />
    </Frame>
  );
};

// ─── 05 · Expectations have changed ──────────────────────────────
const SlideExpectations = ({ total }) => {
  const rows = [
    { then: 'Ringer proshopen for tee-tid', now: 'Booker via app, 24/7' },
    { then: 'Venter på HCP-oppdatering i posten', now: 'Ser ny handicap samme kveld' },
    { then: 'Skriver scorecard for hånd', now: 'Registrerer runden digitalt — og får analyse' },
    { then: 'Finner info i medlemsavisen', now: 'Sjekker klubben sin i lommen' },
  ];
  return (
    <Frame bg={AK.surfaceAlt}>
      <Eyebrow>Medlemmene</Eyebrow>
      <Title>Forventningene har endret seg raskere enn verktøyene</Title>
      <div style={{ marginTop: 72, background: '#FFFFFF', border: `1px solid ${AK.border}`,
        borderRadius: 24, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          padding: '28px 48px', borderBottom: `1px solid ${AK.border}`,
          fontSize: 22, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: AK.muted }}>
          <div>Før</div><div>Nå</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            padding: '36px 48px',
            borderBottom: i < rows.length - 1 ? `1px solid ${AK.border}` : 'none',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 30, color: AK.muted, textDecoration: 'line-through',
              textDecorationThickness: 1, textDecorationColor: AK.borderDeep }}>{r.then}</div>
            <div style={{ fontSize: 32, color: AK.textDeep, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 20 }}>
              <Dot c={AK.primary} s={12} /> {r.now}
            </div>
          </div>
        ))}
      </div>
      <Footer n={4} total={total} label="Marked" />
    </Frame>
  );
};

// ─── 06 · What is Spillerportalen ─────────────────────────────────
const SlideWhatIs = ({ total }) => {
  const blocks = [
    { t: 'For medlemmet', d: 'Handicap, runder, trening og klubbinfo samlet i én app — iOS og Android.', color: AK.primary },
    { t: 'For treneren', d: 'Treningsplaner, oppfølging og video-feedback direkte til spillerens app.', color: AK.primary },
    { t: 'For klubben', d: 'Medlemsdata, kommunikasjon og booking i ett administrasjonspanel.', color: AK.primary },
  ];
  return (
    <Frame bg="#FFFFFF">
      <Eyebrow>Produkt</Eyebrow>
      <Title>Én plattform, tre brukere</Title>
      <Body style={{ marginTop: 28, maxWidth: 1400 }}>
        Spillerportalen kobler sammen medlemmet, treneren og klubbadministrasjonen
        i samme datamodell. Én innlogging, én sannhet.
      </Body>
      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28 }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            background: i === 2 ? AK.primary : '#FFFFFF',
            color: i === 2 ? '#FFFFFF' : AK.textDeep,
            border: i === 2 ? 'none' : `1px solid ${AK.border}`,
            borderRadius: 24, padding: 48,
            minHeight: 380, display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: i === 2 ? AK.accent : AK.primary,
              marginBottom: 28 }}>0{i+1}</div>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em',
              marginBottom: 24, lineHeight: 1.1 }}>{b.t}</div>
            <div style={{ fontSize: TYPE_SCALE.small, lineHeight: 1.5,
              color: i === 2 ? 'rgba(255,255,255,0.85)' : AK.text }}>{b.d}</div>
          </div>
        ))}
      </div>
      <Footer n={5} total={total} label="Produkt" />
    </Frame>
  );
};

// Export globals
Object.assign(window, {
  TYPE_SCALE, SPACING, AK, ACCENT_OPTIONS,
  Frame, Eyebrow, Title, Body, Card, Pill, Dot, Footer,
  SlideCover, SlideAgenda, SectionHeader, SlideMarket,
  SlideExpectations, SlideWhatIs,
});
