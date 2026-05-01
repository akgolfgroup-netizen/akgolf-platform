/* Product-detail & close slides */

// ─── 07 · Dashboard (product screenshot-style mock) ──────────────
const SlideDashboard = ({ total }) => (
  <Frame bg={AK.surface} style={{ padding: 0 }}>
    <div style={{ padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px 40px`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <Eyebrow>Produkt · Medlem</Eyebrow>
        <Title>Dashbordet er hjemskjermen</Title>
        <Body style={{ marginTop: 20, maxWidth: 1200 }}>
          Sist runde, treningsstreak, aktivitetsuke og handicap-utvikling — alt i ett blikk.
        </Body>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Pill active>Uke</Pill><Pill>Måned</Pill><Pill>År</Pill><Pill>Totalt</Pill>
      </div>
    </div>
    <div style={{ flex: 1, padding: `0 ${SPACING.paddingX}px ${SPACING.paddingBottom}px` }}>
      <DashboardMock />
    </div>
    <Footer n={6} total={total} label="Produkt" />
  </Frame>
);

const DashboardMock = () => (
  <div style={{
    background: AK.dark, borderRadius: 24, padding: 28,
    display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gridTemplateRows: '1fr 1fr',
    gap: 16, height: '100%', boxShadow: '0 20px 60px rgba(10,31,24,0.25)',
  }}>
    {/* Hero card: Siste runde */}
    <div style={{
      gridRow: 'span 2',
      background: `radial-gradient(circle at 20% 10%, ${AK.accent}30 0%, transparent 55%), linear-gradient(145deg, ${AK.primary} 0%, ${AK.dark} 100%)`,
      borderRadius: 16, padding: 28, color: '#fff', border: '1px solid rgba(209,248,67,0.2)',
      boxShadow: '0 0 24px rgba(209,248,67,0.08)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 14, color: AK.accent, fontWeight: 600, letterSpacing: '0.14em',
        textTransform: 'uppercase' }}>Siste runde · onsdag 9. april</div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>78</div>
        <div style={{ fontSize: 18, color: AK.accent }}>slag</div>
      </div>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Gamle Fredrikstad GK</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 32 }}>
        {[['Putts','32'],['GIR','11'],['Fwy','8/14'],['Opp-ned','4/6']].map(([l,v]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{l}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: 18, background: 'rgba(255,255,255,0.06)',
        borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Scoreanalyse · hull</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
          {[0.5,0.7,0.4,0.9,0.6,0.3,0.8,0.5,0.6,0.4,0.7,0.8,0.5,0.6,0.3,0.7,0.4,0.9].map((h,i) => (
            <div key={i} style={{ flex: 1, height: `${h*100}%`,
              background: h > 0.75 ? AK.danger : h > 0.5 ? AK.accent : `${AK.accent}55`,
              borderRadius: '2px 2px 0 0' }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 13,
        color: 'rgba(255,255,255,0.5)' }}>👍 Bra runde</div>
    </div>

    {/* Aktiviteter */}
    <div style={{ background: AK.cardDark, borderRadius: 16, padding: 22, color: '#fff',
      border: `1px solid ${AK.border}` + ' ', borderColor: '#1a4a3a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Aktiviteter</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Denne uken</div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
        {[0.4,0.7,0.5,0.8,0.9,0.6,0.55].map((h,i) => (
          <div key={i} style={{ flex: 1, height: `${h*100}%`,
            background: i===4 ? AK.accent : `${AK.accent}55`, borderRadius: '3px 3px 0 0' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {['M','T','O','T','F','L','S'].map((d,i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{d}</div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800, color: '#fff' }}>4t 12m</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>treningstid totalt</div>
    </div>

    {/* HCP */}
    <div style={{ background: AK.cardDark, borderRadius: 16, padding: 22, color: '#fff',
      border: '1px solid #1a4a3a' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Handicap</div>
      <div style={{ fontSize: 72, fontWeight: 800, color: AK.accent, lineHeight: 1, marginTop: 10, letterSpacing: '-0.03em' }}>15,9</div>
      <div style={{ fontSize: 14, color: AK.accent, marginTop: 4, fontWeight: 600 }}>↘ −0,7 siden mars</div>
      <div style={{ marginTop: 18, height: 8, borderRadius: 4, overflow: 'hidden',
        background: 'linear-gradient(90deg, #2A7D5A, #D1F843, #C48A32, #B84233)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '35%', top: -4, width: 16, height: 16,
          borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,0.2)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
        <span>0</span><span>36</span>
      </div>
    </div>

    {/* Putting */}
    <div style={{ background: AK.cardDark, borderRadius: 16, padding: 22, color: '#fff',
      border: '1px solid #1a4a3a' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Putting</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 18 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(209,248,67,0.15)" strokeWidth="6"/>
          <circle cx="45" cy="45" r="38" fill="none" stroke={AK.accent} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={`${2*Math.PI*38*0.72} ${2*Math.PI*38}`}
            transform="rotate(-90 45 45)"/>
        </svg>
        <div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>1,72</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>putts / hull</div>
        </div>
      </div>
    </div>

    {/* Søvn */}
    <div style={{ background: AK.cardDark, borderRadius: 16, padding: 22, color: '#fff',
      border: '1px solid #1a4a3a' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Søvnscore</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: AK.accent, lineHeight: 1, marginTop: 10, letterSpacing: '-0.02em' }}>8,5</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>Bra · 7t 42m</div>
      <div style={{ marginTop: 14, display: 'flex', gap: 3, height: 36 }}>
        {['#6a3bce','#a26ff0','#d6c1fb','#ffffff','#ffffff','#6a3bce','#a26ff0','#d6c1fb','#6a3bce'].map((c,i) => (
          <div key={i} style={{ flex: 1, background: c, borderRadius: 2, opacity: c==='#ffffff'?0.2:0.85 }} />
        ))}
      </div>
    </div>
  </div>
);

// ─── 08 · Handicap deep-dive ─────────────────────────────────────
const SlideHandicap = ({ total }) => (
  <Frame bg="#FFFFFF">
    <Eyebrow>Produkt · Statistikk</Eyebrow>
    <Title>Handicap og statistikk spilleren faktisk forstår</Title>
    <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div>
        <Body style={{ marginBottom: 40 }}>
          Vi henter registrerte runder fra GolfBox, regner WHS-justert handicap samme kveld,
          og viser spilleren hva som faktisk drev scoren — ikke bare tallet.
        </Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            ['Slag per hull', 'Fordeling par-3 / par-4 / par-5'],
            ['Greens in Regulation', 'Utvikling over 10 runder'],
            ['Opp-ned fra bunker og kant', 'Med sammenligning mot HCP-gruppe'],
            ['Iron-spill og spredning', 'Lateral avvik fra TrackMan, når koblet'],
          ].map(([t,d],i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: AK.primary, marginTop: 14 }} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: AK.textDeep }}>{t}</div>
                <div style={{ fontSize: 22, color: AK.muted, marginTop: 4 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: AK.dark, borderRadius: 24, padding: 40, color: '#fff',
        display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>HCP-utvikling</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 14 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>15,9</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: AK.accent }}>↘ −2,3</div>
        </div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>siden sesongstart</div>
        <svg viewBox="0 0 560 220" style={{ marginTop: 32, width: '100%', flex: 1 }}>
          <defs>
            <linearGradient id="hcpFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#D1F843" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#D1F843" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[0,1,2,3].map(i => (
            <line key={i} x1="0" x2="560" y1={30+i*50} y2={30+i*50}
              stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4"/>
          ))}
          <path d="M0,60 C60,70 100,90 160,85 C220,80 260,120 320,110 C380,100 420,140 480,160 C520,175 540,170 560,180 L560,220 L0,220 Z"
            fill="url(#hcpFill)"/>
          <path d="M0,60 C60,70 100,90 160,85 C220,80 260,120 320,110 C380,100 420,140 480,160 C520,175 540,170 560,180"
            fill="none" stroke={AK.accent} strokeWidth="3" strokeLinecap="round"/>
          {[[0,60],[160,85],[320,110],[480,160],[560,180]].map(([x,y],i)=> (
            <circle key={i} cx={x} cy={y} r="5" fill={AK.accent}/>
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 14,
          color: 'rgba(255,255,255,0.45)' }}>
          <span>Mar</span><span>Apr</span><span>Mai</span><span>Jun</span><span>Jul</span>
        </div>
      </div>
    </div>
    <Footer n={7} total={total} label="Produkt" />
  </Frame>
);

// ─── 09 · Training & coaching ────────────────────────────────────
const SlideTraining = ({ total }) => (
  <Frame bg={AK.surfaceAlt}>
    <Eyebrow>Produkt · Trening</Eyebrow>
    <Title>Trening og oppfølging, delt mellom spiller og trener</Title>
    <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {[
        { t: 'Treningsplaner', d: 'Ukentlige planer fra trener, med mål og øvelser. Spilleren krysser av i appen.', pill: 'Trener → Spiller' },
        { t: 'Video-feedback', d: 'Spilleren laster opp svingvideo. Trener kommenterer direkte i tidslinjen.', pill: 'Toveis' },
        { t: 'TrackMan-integrasjon', d: 'Simulator-økter hentes automatisk, med ballflukt, spinn og spredning.', pill: 'Automatisk' },
      ].map((b, i) => (
        <Card key={i} style={{ padding: 40, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', padding: '8px 16px',
            background: AK.accent, color: AK.textDeep, borderRadius: 999,
            fontSize: 18, fontWeight: 600, marginBottom: 28,
          }}>{b.pill}</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: AK.textDeep,
            letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>{b.t}</div>
          <div style={{ fontSize: TYPE_SCALE.small, color: AK.text, lineHeight: 1.5 }}>{b.d}</div>
          <div style={{ marginTop: 'auto', paddingTop: 32 }}>
            {i === 0 && <MiniPlanWidget/>}
            {i === 1 && <MiniVideoWidget/>}
            {i === 2 && <MiniTrackmanWidget/>}
          </div>
        </Card>
      ))}
    </div>
    <Footer n={8} total={total} label="Produkt" />
  </Frame>
);

const MiniPlanWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[['Putting · 30 min', true],['Iron-spill · 45 min', true],['Spill på bane · 9 hull', false]].map(([t,done],i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 18px', background: AK.surface, borderRadius: 12 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6,
          background: done ? AK.primary : '#fff', border: `2px solid ${done ? AK.primary : AK.borderDeep}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>
          {done ? '✓' : ''}
        </div>
        <div style={{ fontSize: 20, color: done ? AK.muted : AK.textDeep,
          textDecoration: done ? 'line-through' : 'none' }}>{t}</div>
      </div>
    ))}
  </div>
);

const MiniVideoWidget = () => (
  <div style={{ background: AK.dark, borderRadius: 14, padding: 18, color: '#fff' }}>
    <div style={{ aspectRatio: '16/9', borderRadius: 8,
      background: `linear-gradient(135deg, ${AK.primary}, ${AK.dark})`,
      position: 'relative', marginBottom: 12 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: AK.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: AK.dark, fontSize: 18 }}>▸</div>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 12,
        background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: 4 }}>0:12</div>
    </div>
    <div style={{ fontSize: 14, color: AK.accent, fontWeight: 600 }}>Trener Martin, 2 min siden</div>
    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: 1.4 }}>
      «Prøv å holde venstre skulder litt lenger ned på backswing.»
    </div>
  </div>
);

const MiniTrackmanWidget = () => (
  <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: `1px solid ${AK.border}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13,
      color: AK.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
      <span>7-jern · 20 slag</span><span>I går</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
      {[['Bære','148 m'],['Spinn','6.200'],['Spredning','±5,4 m']].map(([l,v]) => (
        <div key={l}>
          <div style={{ fontSize: 11, color: AK.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: AK.primary, letterSpacing: '-0.02em' }}>{v}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── 10 · Mobile first ───────────────────────────────────────────
const SlideMobile = ({ total }) => (
  <Frame bg="#FFFFFF">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 80, flex: 1,
      alignItems: 'center' }}>
      <div>
        <Eyebrow>Produkt · Mobil</Eyebrow>
        <Title>Mobil først — fordi det er der golferen er</Title>
        <Body style={{ marginTop: 32, maxWidth: 760 }}>
          87 % av bruken skjer fra mobil. Appen er bygget som en native-feel PWA —
          ingen app-store-friksjon, men føles som en ekte app.
        </Body>
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            ['87 %', 'av økter fra mobil'],
            ['< 2 s', 'tid til første skjermbilde'],
            ['Offline', 'runden lagres og synker senere'],
            ['iOS & Android', 'samme kodebase'],
          ].map(([v,l],i) => (
            <div key={i} style={{ padding: 24, background: AK.surfaceAlt,
              border: `1px solid ${AK.border}`, borderRadius: 16 }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: AK.primary, letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ fontSize: 22, color: AK.text, marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
        <PhoneMock variant="home" />
        <PhoneMock variant="round" offset={40}/>
      </div>
    </div>
    <Footer n={9} total={total} label="Produkt" />
  </Frame>
);

const PhoneMock = ({ variant, offset = 0 }) => (
  <div style={{
    width: 340, height: 700, borderRadius: 48, background: AK.dark, padding: 14,
    boxShadow: '0 30px 80px rgba(10,31,24,0.35), 0 10px 30px rgba(0,0,0,0.15)',
    border: '3px solid #050f0b', marginTop: offset, position: 'relative', flexShrink: 0,
  }}>
    <div style={{ width: '100%', height: '100%', borderRadius: 36, background: AK.dark,
      overflow: 'hidden', color: '#fff', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        width: 100, height: 22, background: '#050f0b', borderRadius: 14, zIndex: 2 }} />
      <div style={{ padding: '44px 20px 16px', display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
        <span>09:42</span><span>●●●●● 5G</span>
      </div>
      {variant === 'home' ? <PhoneHome /> : <PhoneRound />}
    </div>
  </div>
);

const PhoneHome = () => (
  <div style={{ padding: '8px 18px 18px' }}>
    <div style={{ fontSize: 12, color: AK.accent, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Onsdag · 9. april</div>
    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>Hei, Magnus</div>
    <div style={{ marginTop: 16, padding: 16, borderRadius: 14,
      background: `linear-gradient(135deg, ${AK.primary}, ${AK.dark})`,
      border: '1px solid rgba(209,248,67,0.2)' }}>
      <div style={{ fontSize: 10, color: AK.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Siste runde</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>78</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>slag · Gamle Fredrikstad GK</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
        <span>32 putts</span><span>11 GIR</span><span>👍 Bra</span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
      <div style={{ padding: 12, background: AK.cardDark, borderRadius: 12, border: '1px solid #1a4a3a' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>HCP</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: AK.accent, lineHeight: 1, marginTop: 4 }}>15,9</div>
      </div>
      <div style={{ padding: 12, background: AK.cardDark, borderRadius: 12, border: '1px solid #1a4a3a' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Streak</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: AK.accent, lineHeight: 1, marginTop: 4 }}>12d</div>
      </div>
    </div>
    <div style={{ marginTop: 12, padding: 14, background: AK.cardDark, borderRadius: 12,
      border: '1px solid #1a4a3a' }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Denne uken</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60, marginTop: 10 }}>
        {[0.4,0.7,0.5,0.8,0.9,0.6,0.55].map((h,i) => (
          <div key={i} style={{ flex: 1, height: `${h*100}%`,
            background: i===4 ? AK.accent : `${AK.accent}55`, borderRadius: '2px 2px 0 0' }} />
        ))}
      </div>
    </div>
  </div>
);

const PhoneRound = () => (
  <div style={{ padding: '8px 18px 18px' }}>
    <div style={{ fontSize: 12, color: AK.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pågående runde</div>
    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>Gamle Fredrikstad GK</div>
    <div style={{ marginTop: 14, padding: 16, borderRadius: 14, background: AK.primary,
      border: '1px solid rgba(209,248,67,0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: AK.accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Hull 7 · par 4</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1, marginTop: 8 }}>4</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>slag så langt</div>
    </div>
    <div style={{ marginTop: 12 }}>
      {[[1,4,4],[2,5,6],[3,3,3],[4,4,5],[5,4,4],[6,5,4],[7,4,'—']].map(([h,p,s],i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr',
          padding: '8px 2px', fontSize: 13,
          borderBottom: i<6 ? '1px solid rgba(255,255,255,0.06)' : 'none', color: '#fff' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>H{h}</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>par {p}</span>
          <span style={{ fontWeight: 700, color: s==='—' ? AK.accent : '#fff' }}>{s}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── 11 · Admin panel ────────────────────────────────────────────
const SlideAdmin = ({ total }) => (
  <Frame bg={AK.surface} style={{ padding: 0 }}>
    <div style={{ padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px 40px` }}>
      <Eyebrow>Produkt · Klubbadministrasjon</Eyebrow>
      <Title>Ett administrasjonspanel for hele klubben</Title>
      <Body style={{ marginTop: 20, maxWidth: 1400 }}>
        Medlemsregister, kommunikasjon, oppgaver og betalinger — samlet i ett verktøy.
        Bygget for norske klubbstyrer, ikke for globale enterprise-team.
      </Body>
    </div>
    <div style={{ flex: 1, padding: `0 ${SPACING.paddingX}px ${SPACING.paddingBottom}px` }}>
      <AdminMock />
    </div>
    <Footer n={10} total={total} label="Produkt" />
  </Frame>
);

const AdminMock = () => (
  <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${AK.border}`,
    overflow: 'hidden', height: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
    display: 'grid', gridTemplateColumns: '220px 1fr' }}>
    {/* Sidebar */}
    <div style={{ background: AK.surfaceAlt, borderRight: `1px solid ${AK.border}`, padding: 20 }}>
      <img src="assets/logos/ak-golf-logo-primary-on-light.svg" style={{ height: 24, marginBottom: 32 }} alt="" />
      {['Oversikt','Medlemmer','Kommunikasjon','Oppgaver','Økonomi','Innstillinger'].map((l,i) => (
        <div key={l} style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 4,
          fontSize: 14, fontWeight: i===1 ? 600 : 500,
          background: i===1 ? AK.accent : 'transparent',
          color: i===1 ? AK.textDeep : AK.text }}>{l}</div>
      ))}
    </div>
    {/* Main */}
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: AK.textDeep }}>Medlemmer · 1 247</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '8px 14px', border: `1px solid ${AK.border}`, borderRadius: 8, fontSize: 13, color: AK.text }}>Filtrer</div>
          <div style={{ padding: '8px 14px', background: AK.primary, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>+ Nytt medlem</div>
        </div>
      </div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[['1 247','Aktive'],['+38','Nye i år'],['86 %','Betalt kontingent'],['412','Logget inn sist uke']].map(([v,l]) => (
          <div key={l} style={{ padding: 16, background: AK.surfaceAlt, borderRadius: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: AK.primary, letterSpacing: '-0.02em' }}>{v}</div>
            <div style={{ fontSize: 13, color: AK.muted }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Table */}
      <div style={{ border: `1px solid ${AK.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          padding: '12px 18px', background: AK.surfaceAlt, fontSize: 11,
          color: AK.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <div>Medlem</div><div>HCP</div><div>Siste runde</div><div>Kontingent</div><div>Status</div>
        </div>
        {[
          ['Magnus Andersen','15,9','9. apr','Betalt','Aktiv'],
          ['Ingrid Solberg','22,4','8. apr','Betalt','Aktiv'],
          ['Erik Lien','8,2','7. apr','Betalt','Aktiv'],
          ['Astrid Holm','31,1','—','Forfalt','Varslet'],
          ['Ola Nordby','12,7','6. apr','Betalt','Aktiv'],
          ['Kari Bakken','18,5','5. apr','Betalt','Aktiv'],
        ].map((r,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '14px 18px', borderTop: `1px solid ${AK.border}`, fontSize: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: AK.primary,
                color: AK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700 }}>{r[0].split(' ').map(s=>s[0]).join('')}</div>
              <span style={{ fontWeight: 600, color: AK.textDeep }}>{r[0]}</span>
            </div>
            <div style={{ color: AK.text, fontWeight: 600 }}>{r[1]}</div>
            <div style={{ color: AK.muted }}>{r[2]}</div>
            <div style={{ color: r[3]==='Forfalt' ? AK.danger : AK.text }}>{r[3]}</div>
            <div>
              <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: r[4]==='Aktiv' ? '#E8F5EF' : '#FDF4E4',
                color: r[4]==='Aktiv' ? AK.success : AK.warning }}>{r[4]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── 12 · Pilot results ──────────────────────────────────────────
const SlideResults = ({ total }) => (
  <Frame bg="#FFFFFF">
    <Eyebrow>Resultater · Pilot 2025</Eyebrow>
    <Title>Tre klubber, én sesong</Title>
    <Body style={{ marginTop: 24, maxWidth: 1400 }}>
      Gamle Fredrikstad, Borre og Onsøy kjørte Spillerportalen gjennom hele 2025-sesongen.
      Det ga tydelige utslag på engasjement og administrativ tidsbruk.
    </Body>
    <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {[
        { v: '+54 %', l: 'økning i registrerte runder', s: 'Vs. samme periode i 2024' },
        { v: '−38 %', l: 'mindre tid brukt på medlemsadmin', s: 'Selvrapportert av klubbstab' },
        { v: '8,7 / 10', l: 'NPS fra aktive medlemmer', s: 'N = 412 svar, høst 2025' },
      ].map((k,i) => (
        <div key={i} style={{
          background: i===0 ? AK.primary : AK.surfaceAlt,
          color: i===0 ? '#fff' : AK.textDeep,
          border: i===0 ? 'none' : `1px solid ${AK.border}`,
          borderRadius: 24, padding: 48, minHeight: 340,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em',
            color: i===0 ? AK.accent : AK.primary }}>{k.v}</div>
          <div style={{ fontSize: 28, fontWeight: 600, marginTop: 24, lineHeight: 1.3,
            color: i===0 ? '#fff' : AK.textDeep }}>{k.l}</div>
          <div style={{ fontSize: 18, marginTop: 'auto', paddingTop: 28,
            color: i===0 ? 'rgba(255,255,255,0.7)' : AK.muted }}>{k.s}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 56, padding: 40, background: AK.surfaceAlt, borderRadius: 20,
      border: `1px solid ${AK.border}`, display: 'flex', gap: 40, alignItems: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: AK.primary, color: AK.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, flexShrink: 0 }}>GF</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: AK.textDeep, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
          «Medlemmene våre har aldri brukt klubbens digitale flater så mye som nå. Og vi sparer styret for halve jobben.»
        </div>
        <div style={{ marginTop: 16, fontSize: 20, color: AK.muted }}>
          Tore Hansen, daglig leder · Gamle Fredrikstad GK
        </div>
      </div>
    </div>
    <Footer n={11} total={total} label="Bevis" />
  </Frame>
);

// ─── 13 · Pricing ────────────────────────────────────────────────
const SlidePricing = ({ total }) => {
  const tiers = [
    {
      name: 'Basis', price: '1 490', per: 'kr / mnd',
      tag: 'Inntil 400 medlemmer',
      feats: ['Medlems-app (iOS + Android)', 'Handicap og statistikk', 'Klubbinfo og nyheter', 'GolfBox-integrasjon'],
    },
    {
      name: 'Klubb', price: '2 890', per: 'kr / mnd',
      tag: 'Inntil 1 200 medlemmer', highlight: true,
      feats: ['Alt i Basis', 'Administrasjonspanel', 'Treningsplaner og video', 'Kontingent og betalinger', 'E-post og push til medlemmer'],
    },
    {
      name: 'Akademi', price: 'Etter avtale', per: '',
      tag: 'Over 1 200 medlemmer',
      feats: ['Alt i Klubb', 'TrackMan-integrasjon', 'Junior-akademi-modul', 'Egen onboarding-konsulent', 'API og datautveksling'],
    },
  ];
  return (
    <Frame bg={AK.surfaceAlt}>
      <Eyebrow>Pakker og priser</Eyebrow>
      <Title>Tre nivåer, ingen oppstartskostnad</Title>
      <Body style={{ marginTop: 20, maxWidth: 1400 }}>
        Månedlig abonnement per klubb, uten etableringsgebyr eller bindingstid utover 12 måneder.
        Alle priser er eks. mva.
      </Body>
      <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1 }}>
        {tiers.map((t, i) => (
          <div key={i} style={{
            background: t.highlight ? AK.textDeep : '#fff',
            color: t.highlight ? '#fff' : AK.textDeep,
            border: t.highlight ? '1.5px solid rgba(209,248,67,0.35)' : `1px solid ${AK.border}`,
            boxShadow: t.highlight ? '0 0 32px rgba(209,248,67,0.15)' : 'none',
            borderRadius: 24, padding: 44, display: 'flex', flexDirection: 'column',
            position: 'relative',
          }}>
            {t.highlight && (
              <div style={{ position: 'absolute', top: -16, right: 28, padding: '8px 16px',
                background: AK.accent, color: AK.textDeep, borderRadius: 999,
                fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Mest valgt
              </div>
            )}
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>{t.name}</div>
            <div style={{ fontSize: 18, color: t.highlight ? AK.accent : AK.muted, marginBottom: 28 }}>{t.tag}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 36 }}>
              <div style={{ fontSize: t.price.length > 4 ? 48 : 72, fontWeight: 800,
                letterSpacing: '-0.03em', lineHeight: 1,
                color: t.highlight ? AK.accent : AK.primary }}>{t.price}</div>
              <div style={{ fontSize: 18, color: t.highlight ? 'rgba(255,255,255,0.7)' : AK.muted }}>{t.per}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              {t.feats.map((f, j) => (
                <div key={j} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%',
                    background: t.highlight ? AK.accent : AK.primary,
                    color: t.highlight ? AK.textDeep : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, marginTop: 4, flexShrink: 0 }}>✓</div>
                  <div style={{ fontSize: 20, lineHeight: 1.4 }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer n={12} total={total} label="Pris" />
    </Frame>
  );
};

// ─── 14 · Onboarding timeline ────────────────────────────────────
const SlideOnboarding = ({ total }) => (
  <Frame bg="#FFFFFF">
    <Eyebrow>Oppstart</Eyebrow>
    <Title>Tre uker fra signering til aktive medlemmer</Title>
    <Body style={{ marginTop: 24, maxWidth: 1400 }}>
      Vi gjør tungløftet. Klubben bidrar med medlemslister og et avklart kontaktpunkt —
      resten tar vi.
    </Body>
    <div style={{ marginTop: 80, position: 'relative' }}>
      <div style={{ position: 'absolute', left: '6%', right: '6%', top: 40, height: 3,
        background: `linear-gradient(90deg, ${AK.primary} 0%, ${AK.primary} 66%, ${AK.border} 66%)`,
        borderRadius: 2 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {[
          { w: 'Uke 0', t: 'Signering og kick-off', d: 'Avtalen signeres, vi setter opp prosjektrom og avklarer kontaktpunkt.' },
          { w: 'Uke 1', t: 'Dataimport og oppsett', d: 'Medlemsliste hentes fra GolfBox. Klubbens logo, farger og kontaktinfo settes opp.' },
          { w: 'Uke 2', t: 'Testing med styret', d: 'Styret og trener-team tester full oppgavesyklus. Vi justerer.' },
          { w: 'Uke 3', t: 'Lansering til medlemmer', d: 'E-post med velkomstkode. Helpdesk bemannet første to uker.' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%',
              background: i < 3 ? AK.primary : '#fff',
              color: i < 3 ? AK.accent : AK.muted,
              border: i === 3 ? `2px dashed ${AK.borderDeep}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em',
              position: 'relative', zIndex: 1, boxShadow: i < 3 ? '0 0 0 8px #fff' : '0 0 0 8px #fff' }}>
              {i+1}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: AK.primary, letterSpacing: '0.12em',
              textTransform: 'uppercase', marginTop: 28 }}>{s.w}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: AK.textDeep, marginTop: 14,
              letterSpacing: '-0.01em', lineHeight: 1.2 }}>{s.t}</div>
            <div style={{ fontSize: 19, color: AK.text, marginTop: 14, lineHeight: 1.5,
              maxWidth: 340, margin: '14px auto 0' }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer n={13} total={total} label="Oppstart" />
  </Frame>
);

// ─── 15 · Contact close ──────────────────────────────────────────
const SlideContact = ({ total }) => (
  <Frame bg={AK.textDeep} style={{ padding: 0 }}>
    <div style={{ flex: 1, padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <img src="assets/logos/ak-golf-logo-primary-on-dark.svg" style={{ height: 60 }} alt="" />
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: AK.accent, marginBottom: 40 }}>Neste steg</div>
        <h1 style={{ margin: 0, fontSize: 160, fontWeight: 800, letterSpacing: '-0.03em',
          lineHeight: 0.95, color: '#fff', maxWidth: 1500 }}>
          La oss ta<br/>en prat.
        </h1>
        <Body style={{ marginTop: 44, fontSize: 36, color: 'rgba(255,255,255,0.75)', maxWidth: 1100 }}>
          Vi tar gjerne en 30-minutters demo med styret deres — på klubben eller digitalt.
        </Body>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40,
        paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        {[
          ['Kontaktperson', 'Anders Kristiansen', 'Grunnlegger, AK Golf Group'],
          ['E-post', 'anders@akgolfgroup.no', 'Svar innen 24 timer'],
          ['Telefon', '+47 900 12 345', 'Man–fre, 09–17'],
        ].map(([l, v, d], i) => (
          <div key={i}>
            <div style={{ fontSize: 18, color: AK.accent, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 18 }}>{l}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{v}</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

Object.assign(window, {
  SlideDashboard, SlideHandicap, SlideTraining, SlideMobile,
  SlideAdmin, SlideResults, SlidePricing, SlideOnboarding, SlideContact,
});
