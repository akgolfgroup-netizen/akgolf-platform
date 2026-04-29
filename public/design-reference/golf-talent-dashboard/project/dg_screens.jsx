/* ═══════════════════════════════════════════════════════
   DATAGOLF SG HUB
   Deep skill-diagnostic dashboard. Two surfaces:
   - DgSgTab(player)         — replaces SgTab inside FullPlayerProfile
   - DgExplorerView({onPlayer}) — top-level page (sidebar entry)
   ═══════════════════════════════════════════════════════ */

const { useState: useStateD, useMemo: useMemoD } = React;
const { PLAYERS: PLY_D, STAGES: STG_D } = window.PIPELINE_DATA;
const { Icon: IconD } = window.PIPELINE_UI;

const fmtD = {
  sg:    v => v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2).replace('.', ','),
  sg1:   v => v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1).replace('.', ','),
  pct:   v => Math.round(v) + '%',
  yd:    v => v.toFixed(1).replace('.', ',') + ' yd',
  dist:  v => Math.round(v) + ' yd',
  num1:  v => v.toFixed(1).replace('.', ','),
};

const TONE = {
  ink:   '#0D2E23',
  green: '#005840',
  greenL:'#0d6b51',
  lime:  '#D1F843',
  paper: '#F2F4F0',
  bone:  '#E8EBE3',
  red:   '#B84233',
  redL:  '#E8A199',
  amber: '#D89A3A',
  mute:  '#A5B2AD',
  text:  '#324D45',
  textL: '#5b6e67',
  line:  '#f0f3f1',
};

/* ─── ATOMS ─────────────────────────────────────────────── */
const CardD = ({ children, style, hero }) => (
  <div style={{
    background: hero ? 'linear-gradient(135deg, #0D2E23 0%, #16463A 100%)' : '#fff',
    color: hero ? 'white' : TONE.text,
    border: hero ? 'none' : '1px solid ' + TONE.line,
    borderRadius: 14, padding: 20,
    ...(style || {}),
  }}>{children}</div>
);

const EyebrowD = ({ children, white, style }) => (
  <div style={{
    fontSize: 10, color: white ? 'rgba(255,255,255,0.65)' : TONE.mute,
    letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
    textTransform: 'uppercase',
    ...(style || {}),
  }}>{children}</div>
);

const StatD = ({ label, value, sub, accent, big }) => (
  <div>
    <div style={{ fontSize: 9.5, color: TONE.mute, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{label}</div>
    <div style={{
      fontSize: big ? 30 : 22, fontWeight: 700, color: accent || TONE.text,
      fontFamily: 'JetBrains Mono, monospace', marginTop: 4, lineHeight: 1.05,
      letterSpacing: '-0.02em',
    }}>{value}</div>
    {sub && <div style={{ fontSize: 10.5, color: TONE.mute, marginTop: 3 }}>{sub}</div>}
  </div>
);

const Pill = ({ children, active, onClick, color }) => (
  <button onClick={onClick} style={{
    padding: '6px 11px', borderRadius: 6, border: '1px solid ' + (active ? TONE.green : TONE.line),
    background: active ? TONE.green : '#fff',
    color: active ? '#fff' : TONE.textL,
    fontSize: 11, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
    transition: 'all 120ms',
  }}>{children}</button>
);

const TagD = ({ children, color = TONE.green, fill }) => (
  <span style={{
    display: 'inline-block', padding: '3px 7px', borderRadius: 4,
    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
    fontFamily: 'JetBrains Mono, monospace',
    color: fill ? '#fff' : color,
    background: fill ? color : color + '15',
    border: fill ? 'none' : '1px solid ' + color + '40',
  }}>{children}</span>
);

/* ─── COMPARISON / WINDOW SWITCHER (shared header) ───── */
function FilterBar({ comp, setComp, win, setWin, density, setDensity, hideDensity }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '12px 16px', background: TONE.paper, borderRadius: 12,
      border: '1px solid ' + TONE.line, marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>VS</span>
        {[
          { id: 'pga',    label: 'PGA-snitt' },
          { id: 'peer',   label: 'Topp-peer' },
          { id: 'leader', label: 'Tour-leder' },
        ].map(o => <Pill key={o.id} active={comp === o.id} onClick={() => setComp(o.id)}>{o.label}</Pill>)}
      </div>
      <div style={{ width: 1, height: 22, background: TONE.line }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>VINDU</span>
        {[
          { id: '8',      label: 'L8' },
          { id: '24',     label: 'L24' },
          { id: '64',     label: 'L64' },
          { id: 'season', label: 'Sesong' },
          { id: 'career', label: 'Karriere' },
        ].map(o => <Pill key={o.id} active={win === o.id} onClick={() => setWin(o.id)}>{o.label}</Pill>)}
      </div>
      {!hideDensity && (
        <>
          <div style={{ width: 1, height: 22, background: TONE.line }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>TETTHET</span>
            {[
              { id: 'compact',     label: '·' },
              { id: 'comfortable', label: '··' },
              { id: 'spacious',    label: '···' },
            ].map(o => <Pill key={o.id} active={density === o.id} onClick={() => setDensity(o.id)}>{o.label}</Pill>)}
          </div>
        </>
      )}
      <span style={{ flex: 1 }}/>
      <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>
        kilde: <b style={{ color: TONE.text }}>DataGolf</b> · oppd. 14.04.26
      </span>
    </div>
  );
}

/* ─── REFERENCE VALUES (depend on comp) ────────────────── */
function getRef(player, comp) {
  if (comp === 'pga') {
    return { sg: 0, putt: 0, app: 0, tee: 0, around: 0, label: 'PGA-snitt',
      drive: 297, acc: 60, prox: { p1: 25, p2: 35, p3: 48, p4: 65 },
      putting: { p1: 75, p2: 50, p3: 18, p4: 8 },
      trueSG: 0, sd: 1.8 };
  }
  if (comp === 'peer') {
    // top peer at same stage
    return { sg: 1.4, putt: 0.32, app: 0.55, tee: 0.42, around: 0.11, label: 'Topp-peer',
      drive: 305, acc: 64, prox: { p1: 22, p2: 31, p3: 42, p4: 58 },
      putting: { p1: 78, p2: 55, p3: 22, p4: 11 },
      trueSG: 1.2, sd: 1.5 };
  }
  return { sg: 2.5, putt: 0.50, app: 0.92, tee: 0.62, around: 0.18, label: 'Scheffler',
    drive: 309, acc: 66, prox: { p1: 19, p2: 28, p3: 38, p4: 52 },
    putting: { p1: 82, p2: 60, p3: 28, p4: 14 },
    trueSG: 2.3, sd: 1.3 };
}

/* ═══════════════════════════════════════════════════════
   1)  RICH SG TAB  (replaces existing SgTab)
   ═══════════════════════════════════════════════════════ */
function DgSgTab({ player, embedded }) {
  const [comp, setComp] = useStateD('pga');
  const [win, setWin] = useStateD('64');
  const [density, setDensity] = useStateD('comfortable');
  const [chartStyle, setChartStyle] = useStateD('signature');
  const ref = useMemoD(() => getRef(player, comp), [comp]);

  const gap = density === 'compact' ? 12 : density === 'spacious' ? 22 : 16;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      <FilterBar
        comp={comp} setComp={setComp}
        win={win} setWin={setWin}
        density={density} setDensity={setDensity}
      />

      {/* Hero — skill snapshot */}
      <SkillSnapshot player={player} ref_={ref} win={win} />

      {/* Long game vs short game decomposition */}
      <DecompositionRow player={player} ref_={ref} chartStyle={chartStyle} setChartStyle={setChartStyle} />

      {/* Approach by distance band */}
      <ApproachBands player={player} ref_={ref} />

      {/* Putting by distance */}
      <PuttingBands player={player} ref_={ref} />

      {/* Driving — distance × accuracy */}
      <DrivingMatrix player={player} ref_={ref} />

      {/* True SG vs raw + volatility */}
      <TrueSgRow player={player} ref_={ref} />

      {/* Course fit + Live predictions */}
      <FitAndPredict player={player} />

      {/* Round-by-round strip + recent shot data */}
      <RoundStrip player={player} />
    </div>
  );
}

/* ─── SECTION 1 · SKILL SNAPSHOT ───────────────────────── */
function SkillSnapshot({ player, ref_, win }) {
  const winLabel = { '8': 'siste 8 runder', '24': 'siste 24 runder', '64': 'siste 64 runder', season: 'sesong 2026', career: 'karriere' }[win];
  const skillEst = player.sg + 0.06; // age-adjusted projection
  return (
    <CardD hero>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 28, alignItems: 'center' }}>
        <div>
          <EyebrowD white>SG: TOTAL · {winLabel.toUpperCase()}</EyebrowD>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
            <span style={{
              fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em',
              color: TONE.lime, fontFamily: 'JetBrains Mono, monospace',
            }}>{fmtD.sg(player.sg)}</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>strokes/round</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <TagD color={TONE.lime} fill>VS {ref_.label.toUpperCase()} · {fmtD.sg(player.sg - ref_.sg)}</TagD>
            <TagD color="#A5B2AD">N=64 RUNDER</TagD>
            <TagD color="#A5B2AD">DG SKILL ESTIMATE +{skillEst.toFixed(2).replace('.', ',')}</TagD>
          </div>
        </div>

        {[
          { l: 'SG: PUTTING',         k: 'putt' },
          { l: 'SG: APPROACH',        k: 'app' },
          { l: 'SG: OFF-THE-TEE',     k: 'tee' },
        ].map(s => {
          const delta = player[s.k] - ref_[s.k];
          return (
            <div key={s.l} style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 22 }}>
              <EyebrowD white>{s.l}</EyebrowD>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono, monospace', marginTop: 6, letterSpacing: '-0.02em' }}>
                {fmtD.sg(player[s.k])}
              </div>
              <div style={{ fontSize: 11, marginTop: 4, fontFamily: 'JetBrains Mono, monospace',
                color: delta >= 0 ? TONE.lime : '#FFAB91' }}>
                {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(2).replace('.', ',')} vs {ref_.label}
              </div>
            </div>
          );
        })}
      </div>
    </CardD>
  );
}

/* ─── SECTION 2 · LONG GAME / SHORT GAME DECOMPOSITION ─── */
function DecompositionRow({ player, ref_, chartStyle, setChartStyle }) {
  const longGame = player.tee + player.app;
  const shortGame = player.around + player.putt;
  const refLong = ref_.tee + ref_.app;
  const refShort = ref_.around + ref_.putt;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
      <CardD>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <EyebrowD>LONG GAME · SHORT GAME · DECOMPOSITION</EyebrowD>
          <div style={{ display: 'flex', gap: 4 }}>
            {['signature', 'bars', 'split'].map(s => (
              <button key={s} onClick={() => setChartStyle(s)} style={{
                width: 22, height: 22, borderRadius: 4, border: '1px solid ' + TONE.line,
                background: chartStyle === s ? TONE.green : '#fff',
                color: chartStyle === s ? '#fff' : TONE.mute,
                fontSize: 9, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              }}>{s === 'signature' ? '◊' : s === 'bars' ? '||' : '⫶'}</button>
            ))}
          </div>
        </div>
        {chartStyle === 'signature' && <SignatureChart player={player} ref_={ref_} />}
        {chartStyle === 'bars' && <DiamondBars player={player} ref_={ref_} />}
        {chartStyle === 'split' && <SplitProfile player={player} ref_={ref_} />}
      </CardD>

      <CardD>
        <EyebrowD>LONG VS SHORT</EyebrowD>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: TONE.text, fontWeight: 600 }}>Long game (Off-the-tee + Approach)</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: longGame >= 0 ? TONE.green : TONE.red, fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtD.sg(longGame)}
            </span>
          </div>
          <DualBar value={longGame} ref_={refLong} max={1.5} />
          <div style={{ fontSize: 10.5, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
            Δ vs {ref_.label} {fmtD.sg(longGame - refLong)}
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: TONE.text, fontWeight: 600 }}>Short game (Around-the-green + Putting)</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: shortGame >= 0 ? TONE.green : TONE.red, fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtD.sg(shortGame)}
            </span>
          </div>
          <DualBar value={shortGame} ref_={refShort} max={1.0} />
          <div style={{ fontSize: 10.5, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
            Δ vs {ref_.label} {fmtD.sg(shortGame - refShort)}
          </div>
        </div>
        <div style={{ marginTop: 18, padding: 12, background: TONE.paper, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>PROFIL-TYPE</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: TONE.text, marginTop: 4 }}>
            {longGame > shortGame + 0.3 ? 'Ball-striker' : shortGame > longGame + 0.3 ? 'Short-game spesialist' : 'Balansert profil'}
          </div>
          <div style={{ fontSize: 11, color: TONE.textL, marginTop: 4, lineHeight: 1.5 }}>
            {longGame > shortGame + 0.3 && 'Sterk fra tee-til-green; rom for forbedring i ARG/putt.'}
            {shortGame > longGame + 0.3 && 'Spiller scoren ned via short game; long game holder ikke følge.'}
            {Math.abs(longGame - shortGame) <= 0.3 && 'Jevn fordeling — ingen åpenbar svakhet eller over-avhengighet.'}
          </div>
        </div>
      </CardD>
    </div>
  );
}

/* Signature chart: novel quadrant view, player point + ref point */
function SignatureChart({ player, ref_ }) {
  const W = 480, H = 240;
  const longGame = player.tee + player.app;
  const shortGame = player.around + player.putt;
  const refLong = ref_.tee + ref_.app;
  const refShort = ref_.around + ref_.putt;
  // map x: long game (-0.6..1.5), y: short game (-0.5..1.0)
  const xRange = [-0.6, 1.6];
  const yRange = [-0.5, 1.0];
  const x = v => 60 + (v - xRange[0]) / (xRange[1] - xRange[0]) * (W - 90);
  const y = v => H - 35 - (v - yRange[0]) / (yRange[1] - yRange[0]) * (H - 60);
  const x0 = x(0), y0 = y(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }}>
      {/* quadrant fills */}
      <rect x={x0} y={25} width={W-90 - (x0-60)} height={y0-25} fill="rgba(0,88,64,0.05)" />
      <rect x={60} y={25} width={x0-60} height={y0-25} fill="rgba(184,66,51,0.04)" />
      <rect x={x0} y={y0} width={W-90 - (x0-60)} height={H-35-y0} fill="rgba(0,88,64,0.03)" />
      <rect x={60} y={y0} width={x0-60} height={H-35-y0} fill="rgba(184,66,51,0.06)" />
      {/* axes */}
      <line x1={60} y1={y0} x2={W-30} y2={y0} stroke={TONE.mute} strokeWidth="1"/>
      <line x1={x0} y1={25} x2={x0} y2={H-35} stroke={TONE.mute} strokeWidth="1"/>
      {/* axis labels */}
      <text x={W-32} y={y0-6} fontSize="10" fill={TONE.text} textAnchor="end" fontWeight="700" fontFamily="JetBrains Mono">LONG GAME →</text>
      <text x={x0+6} y={32} fontSize="10" fill={TONE.text} fontWeight="700" fontFamily="JetBrains Mono">↑ SHORT GAME</text>
      {/* quadrant labels */}
      <text x={W-32} y={45} fontSize="9" fill={TONE.green} textAnchor="end" fontFamily="JetBrains Mono">Komplett</text>
      <text x={62} y={45} fontSize="9" fill={TONE.red} fontFamily="JetBrains Mono">Bare putt/chip</text>
      <text x={W-32} y={H-38} fontSize="9" fill={TONE.greenL} textAnchor="end" fontFamily="JetBrains Mono">Ball-striker</text>
      <text x={62} y={H-38} fontSize="9" fill={TONE.red} fontFamily="JetBrains Mono">Sliter</text>
      {/* gridlines */}
      {[-0.5, 0.5, 1.0].map(v => v !== 0 && (
        <line key={'gx'+v} x1={x(v)} y1={25} x2={x(v)} y2={H-35} stroke={TONE.line} strokeWidth="0.5" strokeDasharray="2 3"/>
      ))}
      {/* connection line */}
      <line x1={x(refLong)} y1={y(refShort)} x2={x(longGame)} y2={y(shortGame)}
        stroke={TONE.green} strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      {/* ref dot */}
      <circle cx={x(refLong)} cy={y(refShort)} r="6" fill="#fff" stroke={TONE.mute} strokeWidth="1.5"/>
      <text x={x(refLong)} y={y(refShort)-12} fontSize="10" fill={TONE.mute} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="600">{ref_.label}</text>
      {/* player dot */}
      <circle cx={x(longGame)} cy={y(shortGame)} r="11" fill={TONE.green} stroke={TONE.lime} strokeWidth="3"/>
      <circle cx={x(longGame)} cy={y(shortGame)} r="3" fill={TONE.lime}/>
      <text x={x(longGame)} y={y(shortGame)-18} fontSize="11" fill={TONE.green} textAnchor="middle" fontWeight="700" fontFamily="JetBrains Mono">
        {player.name.split(' ')[0]}
      </text>
    </svg>
  );
}

function DiamondBars({ player, ref_ }) {
  const cats = [
    { label: 'Off-the-tee',     v: player.tee,    r: ref_.tee },
    { label: 'Approach',        v: player.app,    r: ref_.app },
    { label: 'Around-the-green',v: player.around, r: ref_.around },
    { label: 'Putting',         v: player.putt,   r: ref_.putt },
  ];
  const max = 1.0;
  return (
    <div style={{ marginTop: 8 }}>
      {cats.map(c => {
        const w = Math.min(50, Math.abs(c.v) / max * 50);
        const rW = Math.min(50, Math.abs(c.r) / max * 50);
        return (
          <div key={c.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: TONE.text, fontWeight: 600 }}>{c.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: c.v >= 0 ? TONE.green : TONE.red, fontWeight: 700 }}>
                {fmtD.sg(c.v)}
              </span>
            </div>
            <div style={{ position: 'relative', height: 12, background: TONE.line, borderRadius: 2 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: TONE.mute }}/>
              <div style={{
                position: 'absolute', top: 1, bottom: 1,
                left: c.v >= 0 ? '50%' : (50 - w) + '%',
                width: w + '%',
                background: c.v >= 0 ? TONE.green : TONE.red, borderRadius: 1,
              }}/>
              {/* ref tick */}
              <div style={{
                position: 'absolute', top: -2, bottom: -2,
                left: (50 + (c.r >= 0 ? rW : -rW)) + '%',
                width: 2, background: TONE.lime,
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SplitProfile({ player, ref_ }) {
  // Tee/App on left, ARG/Putt on right, mirrored from center
  const cats = [
    { label: 'Putting',          v: player.putt,   r: ref_.putt,   side: 'r' },
    { label: 'Around-the-green', v: player.around, r: ref_.around, side: 'r' },
    { label: 'Approach',         v: player.app,    r: ref_.app,    side: 'l' },
    { label: 'Off-the-tee',      v: player.tee,    r: ref_.tee,    side: 'l' },
  ];
  return (
    <div style={{ marginTop: 8 }}>
      {cats.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 11 }}>
          <span style={{ width: 36, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', textAlign: c.side === 'l' ? 'right' : 'left' }}>
            {c.side === 'l' && c.label}
          </span>
          <div style={{ flex: 1, height: 8, background: TONE.line, borderRadius: 4, position: 'relative' }}>
            {c.side === 'l' && (
              <div style={{ position: 'absolute', right: '50%', top: 0, bottom: 0, width: Math.abs(c.v) * 50 + '%',
                background: TONE.greenL, borderRadius: '4px 0 0 4px' }}/>
            )}
            {c.side === 'r' && (
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: Math.abs(c.v) * 50 + '%',
                background: TONE.green, borderRadius: '0 4px 4px 0' }}/>
            )}
            <div style={{ position: 'absolute', left: '50%', top: -2, bottom: -2, width: 1, background: TONE.text }}/>
          </div>
          <span style={{ width: 36, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', textAlign: c.side === 'r' ? 'left' : 'right' }}>
            {c.side === 'r' && c.label}
          </span>
          <span style={{ width: 50, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: c.v >= 0 ? TONE.green : TONE.red, textAlign: 'right' }}>
            {fmtD.sg(c.v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DualBar({ value, ref_, max }) {
  const w = Math.min(50, Math.abs(value) / max * 50);
  const rW = Math.min(50, Math.abs(ref_) / max * 50);
  return (
    <div style={{ position: 'relative', height: 10, background: TONE.line, borderRadius: 2 }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: TONE.mute }}/>
      <div style={{
        position: 'absolute', top: 1, bottom: 1,
        left: value >= 0 ? '50%' : (50 - w) + '%',
        width: w + '%',
        background: value >= 0 ? TONE.green : TONE.red, borderRadius: 1,
      }}/>
      <div style={{
        position: 'absolute', top: -2, bottom: -2,
        left: (50 + (ref_ >= 0 ? rW : -rW)) + '%',
        width: 2, background: TONE.lime,
      }}/>
    </div>
  );
}

/* ─── SECTION 3 · APPROACH BY DISTANCE BAND ─────────────── */
function ApproachBands({ player, ref_ }) {
  const bands = [
    { label: '50–125 yd',  key: 'p1', n: 142, sg: 0.18 },
    { label: '125–175 yd', key: 'p2', n: 218, sg: 0.34 },
    { label: '175–225 yd', key: 'p3', n: 156, sg: 0.21 },
    { label: '225+ yd',    key: 'p4', n: 64,  sg: -0.08 },
  ];
  // proximity in feet (player) — synthesized
  const playerProx = { p1: 23, p2: 32, p3: 45, p4: 71 };

  return (
    <CardD>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <EyebrowD>SG: APPROACH · PROXIMITY BY DISTANCE BAND</EyebrowD>
        <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>n=580 skudd · vinkel: gjennomsnittlig hole-out</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {bands.map(b => {
          const refProx = ref_.prox[b.key];
          const better = playerProx[b.key] < refProx;
          return (
            <div key={b.key} style={{
              padding: 14, background: TONE.paper, borderRadius: 10,
              border: '1px solid ' + (better ? '#0d6b51' : TONE.line),
            }}>
              <EyebrowD>{b.label}</EyebrowD>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: TONE.text, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                  {playerProx[b.key]}
                </span>
                <span style={{ fontSize: 11, color: TONE.mute }}>ft</span>
              </div>
              <div style={{ fontSize: 10.5, marginTop: 6, fontFamily: 'JetBrains Mono, monospace', color: better ? TONE.green : TONE.red }}>
                {better ? '↑' : '↓'} {Math.abs(playerProx[b.key] - refProx)} ft vs {ref_.label}
              </div>
              <ProxBar player={playerProx[b.key]} ref_={refProx} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TONE.mute, marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>
                <span>{b.n} skudd</span>
                <span style={{ color: b.sg >= 0 ? TONE.green : TONE.red, fontWeight: 700 }}>SG {fmtD.sg(b.sg)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CardD>
  );
}

function ProxBar({ player, ref_ }) {
  const max = 90;
  const pW = Math.min(100, player / max * 100);
  const rW = Math.min(100, ref_ / max * 100);
  const better = player < ref_;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ height: 5, background: '#fff', borderRadius: 2.5, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: pW + '%',
          background: better ? TONE.green : TONE.red, borderRadius: 2.5 }}/>
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: rW + '%',
          width: 2, background: TONE.amber }}/>
      </div>
      <div style={{ fontSize: 9, color: TONE.mute, marginTop: 3, fontFamily: 'JetBrains Mono, monospace' }}>
        ref-snitt {ref_} ft (gult merke)
      </div>
    </div>
  );
}

/* ─── SECTION 4 · PUTTING BY DISTANCE ─────────────────── */
function PuttingBands({ player, ref_ }) {
  const bands = [
    { label: '3–6 ft',   key: 'p1', n: 412, made: 88, sg: 0.18 },
    { label: '6–10 ft',  key: 'p2', n: 218, made: 58, sg: 0.12 },
    { label: '10–20 ft', key: 'p3', n: 184, made: 24, sg: 0.08 },
    { label: '20+ ft',   key: 'p4', n: 142, made: 9,  sg: 0.04 },
  ];
  return (
    <CardD>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <EyebrowD>SG: PUTTING · MAKE % PR. AVSTAND</EyebrowD>
        <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>956 putts · sesong 2026</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'flex-start' }}>
        {/* Curve chart */}
        <div>
          <PuttCurve player={[88, 58, 24, 9]} ref_={[ref_.putting.p1, ref_.putting.p2, ref_.putting.p3, ref_.putting.p4]} refLabel={ref_.label} />
        </div>

        <div>
          {bands.map(b => {
            const r = ref_.putting[b.key];
            const delta = b.made - r;
            return (
              <div key={b.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid ' + TONE.line }}>
                <div style={{ width: 70 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TONE.text }}>{b.label}</div>
                  <div style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{b.n} putts</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: TONE.text, fontWeight: 700 }}>{b.made}%</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: delta >= 0 ? TONE.green : TONE.red }}>
                      {delta >= 0 ? '+' : ''}{delta} pp
                    </span>
                  </div>
                  <div style={{ height: 5, background: TONE.paper, borderRadius: 2.5, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: b.made + '%', background: TONE.green, borderRadius: 2.5 }}/>
                    <div style={{ position: 'absolute', top: -2, bottom: -2, left: r + '%', width: 2, background: TONE.amber }}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CardD>
  );
}

function PuttCurve({ player, ref_, refLabel }) {
  const W = 360, H = 200, PAD = 36;
  const pts = [3, 8, 15, 25]; // representative midpoints in ft
  const x = i => PAD + i * (W - PAD * 2) / (pts.length - 1);
  const y = v => PAD + (1 - v / 100) * (H - PAD * 1.4);
  const playerPath = player.map((v, i) => (i === 0 ? 'M' : 'L') + x(i) + ',' + y(v)).join(' ');
  const refPath = ref_.map((v, i) => (i === 0 ? 'M' : 'L') + x(i) + ',' + y(v)).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220 }}>
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={PAD} y1={y(v)} x2={W-PAD/2} y2={y(v)} stroke={TONE.line} strokeWidth="1"/>
          <text x={PAD-6} y={y(v)+3} fontSize="9" fill={TONE.mute} textAnchor="end" fontFamily="JetBrains Mono">{v}%</text>
        </g>
      ))}
      {/* x labels */}
      {['3–6', '6–10', '10–20', '20+'].map((l, i) => (
        <text key={l} x={x(i)} y={H-12} fontSize="10" fill={TONE.mute} textAnchor="middle" fontFamily="JetBrains Mono">{l}</text>
      ))}
      {/* ref */}
      <path d={refPath} stroke={TONE.amber} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      {ref_.map((v, i) => <circle key={'r'+i} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke={TONE.amber} strokeWidth="1.5"/>)}
      {/* player */}
      <path d={playerPath} stroke={TONE.green} strokeWidth="2.5" fill="none"/>
      {player.map((v, i) => (
        <g key={'p'+i}>
          <circle cx={x(i)} cy={y(v)} r="5" fill={TONE.green} stroke={TONE.lime} strokeWidth="2"/>
          <text x={x(i)} y={y(v)-10} fontSize="10" fill={TONE.green} textAnchor="middle" fontWeight="700" fontFamily="JetBrains Mono">{v}%</text>
        </g>
      ))}
      {/* legend */}
      <g transform={`translate(${PAD}, 16)`}>
        <line x1={0} y1={0} x2={14} y2={0} stroke={TONE.green} strokeWidth="2.5"/>
        <text x={20} y={3} fontSize="10" fill={TONE.text} fontFamily="JetBrains Mono">Spiller</text>
        <line x1={70} y1={0} x2={84} y2={0} stroke={TONE.amber} strokeWidth="2" strokeDasharray="3 2"/>
        <text x={90} y={3} fontSize="10" fill={TONE.text} fontFamily="JetBrains Mono">{refLabel}</text>
      </g>
    </svg>
  );
}

/* ─── SECTION 5 · DRIVING MATRIX ──────────────────────── */
function DrivingMatrix({ player, ref_ }) {
  const drive = 304;
  const acc = 62;
  return (
    <CardD>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <EyebrowD>SG: OFF-THE-TEE · DISTANCE × ACCURACY</EyebrowD>
        <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>n=448 driver-skudd</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 22, alignItems: 'stretch' }}>
        {/* Scatter quadrant */}
        <DriveScatter playerD={drive} playerA={acc} ref_={ref_} />
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <StatD label="LENGDE" value={drive + ' yd'} sub={`${drive - ref_.drive >= 0 ? '+' : ''}${drive - ref_.drive} vs ${ref_.label}`} accent={drive - ref_.drive >= 0 ? TONE.green : TONE.red} />
            <StatD label="FAIRWAY %" value={acc + '%'} sub={`${acc - ref_.acc >= 0 ? '+' : ''}${acc - ref_.acc} pp vs ${ref_.label}`} accent={acc - ref_.acc >= 0 ? TONE.green : TONE.red} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { l: 'Smash factor',   v: '1,49',   r: '1,48' },
              { l: 'Ball speed',     v: '174 mph', r: '171 mph' },
              { l: 'Spin axis (avg)', v: '+1,8°', r: '±2,0°' },
              { l: 'Carry std.dev',  v: '7,2 yd', r: '8,1 yd' },
              { l: 'Penalty %',      v: '3,1%',   r: '4,8%' },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '7px 10px',
                background: TONE.paper, borderRadius: 6 }}>
                <span style={{ color: TONE.text, fontWeight: 500 }}>{r.l}</span>
                <span style={{ display: 'flex', gap: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ color: TONE.mute }}>{r.r}</span>
                  <span style={{ color: TONE.text, fontWeight: 700, minWidth: 50, textAlign: 'right' }}>{r.v}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardD>
  );
}

function DriveScatter({ playerD, playerA, ref_ }) {
  const W = 380, H = 280;
  // x: distance 270..320, y: accuracy 40..80
  const x = v => 50 + (v - 270) / 50 * (W - 70);
  const y = v => H - 40 - (v - 40) / 40 * (H - 70);
  const x0 = x(ref_.drive), y0 = y(ref_.acc);

  // synthetic peer cloud
  const cloud = [[286,55],[295,58],[298,62],[301,55],[294,68],[289,71],[306,49],[283,67],[300,60],[308,53],[291,64],[296,72],[280,68],[302,57]];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 280 }}>
      {/* quadrant fills */}
      <rect x={x0} y={20} width={W-50-(x0-50)} height={y0-20} fill="rgba(0,88,64,0.05)"/>
      <rect x={50} y={20} width={x0-50} height={y0-20} fill="rgba(216,154,58,0.04)"/>
      <rect x={x0} y={y0} width={W-50-(x0-50)} height={H-40-y0} fill="rgba(184,66,51,0.03)"/>
      <rect x={50} y={y0} width={x0-50} height={H-40-y0} fill="rgba(184,66,51,0.05)"/>
      {/* axes */}
      <line x1={50} y1={y0} x2={W-20} y2={y0} stroke={TONE.mute} strokeWidth="1"/>
      <line x1={x0} y1={20} x2={x0} y2={H-40} stroke={TONE.mute} strokeWidth="1"/>
      {/* axis labels */}
      <text x={W-22} y={H-22} fontSize="10" fill={TONE.text} textAnchor="end" fontWeight="700" fontFamily="JetBrains Mono">LENGDE (yd) →</text>
      <text x={54} y={26} fontSize="10" fill={TONE.text} fontWeight="700" fontFamily="JetBrains Mono">↑ NØYAKTIGHET (%)</text>
      {/* tick labels */}
      {[280, 290, 300, 310].map(v => (
        <text key={v} x={x(v)} y={H-26} fontSize="9" fill={TONE.mute} textAnchor="middle" fontFamily="JetBrains Mono">{v}</text>
      ))}
      {[50, 60, 70].map(v => (
        <text key={v} x={42} y={y(v)+3} fontSize="9" fill={TONE.mute} textAnchor="end" fontFamily="JetBrains Mono">{v}%</text>
      ))}
      {/* quadrant labels */}
      <text x={W-22} y={36} fontSize="10" fill={TONE.green} textAnchor="end" fontFamily="JetBrains Mono" fontWeight="700">Bombarder</text>
      <text x={54} y={36} fontSize="10" fill={TONE.amber} fontFamily="JetBrains Mono" fontWeight="700">Pinpoint</text>
      <text x={W-22} y={H-46} fontSize="10" fill={TONE.red} textAnchor="end" fontFamily="JetBrains Mono">Lang og vill</text>
      {/* peer cloud */}
      {cloud.map((p, i) => (
        <circle key={i} cx={x(p[0])} cy={y(p[1])} r="3" fill={TONE.mute} opacity="0.4"/>
      ))}
      {/* ref dot */}
      <circle cx={x(ref_.drive)} cy={y(ref_.acc)} r="6" fill="#fff" stroke={TONE.amber} strokeWidth="2"/>
      <text x={x(ref_.drive)} y={y(ref_.acc)-12} fontSize="9.5" fill={TONE.amber} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700">{ref_.label}</text>
      {/* player */}
      <circle cx={x(playerD)} cy={y(playerA)} r="11" fill={TONE.green} stroke={TONE.lime} strokeWidth="3"/>
      <circle cx={x(playerD)} cy={y(playerA)} r="3" fill={TONE.lime}/>
    </svg>
  );
}

/* ─── SECTION 6 · TRUE SG vs RAW + VOLATILITY ─────────── */
function TrueSgRow({ player, ref_ }) {
  const trueSG = player.sg - 0.18; // adj for course/field strength
  const adjustment = -0.18;
  const sd = 1.6;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <CardD>
        <EyebrowD>TRUE SG · COURSE/FIELD-ADJUSTED</EyebrowD>
        <div style={{ marginTop: 14, padding: 14, background: TONE.paper, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: TONE.text, fontWeight: 600 }}>Raw SG</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: TONE.text, fontFamily: 'JetBrains Mono, monospace' }}>{fmtD.sg(player.sg)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#fff', borderRadius: 6, fontSize: 11, color: TONE.textL }}>
            <IconD name="trending" size={14} color={TONE.amber}/>
            <span>Bane- og feltkorreksjon</span>
            <span style={{ flex: 1 }}/>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: TONE.amber, fontWeight: 700 }}>{fmtD.sg(adjustment)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '12px 0', borderTop: '2px solid ' + TONE.green }}>
            <span style={{ fontSize: 12, color: TONE.green, fontWeight: 700 }}>True SG</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: TONE.green, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>{fmtD.sg(trueSG)}</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: TONE.textL, marginTop: 12, lineHeight: 1.55 }}>
          <b>Hva betyr dette?</b> Spilte hovedsakelig på enklere baner / svakere felt — DG justerer ned True SG med {Math.abs(adjustment).toFixed(2).replace('.',',')} for å reflektere reell ferdighet.k True SG for sammenligning på tvers av tour.
        </div>
      </CardD>

      <CardD>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <EyebrowD>RUNDE-VOLATILITET</EyebrowD>
          <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>siste 64 runder</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <StatD label="STD.AVVIK" value={sd.toFixed(1).replace('.',',')} sub={`vs ${ref_.label} ${ref_.sd.toFixed(1).replace('.',',')}`} accent={sd < ref_.sd ? TONE.green : TONE.amber}/>
          <StatD label="HØY-RUNDE %" value="22%" sub="≥ +2,0 SG"/>
          <StatD label="LAV-RUNDE %" value="14%" sub="≤ −1,0 SG"/>
          <StatD label="SPREDNING" value="−2,1 → +3,4" sub="min → max" />
        </div>
        <Distribution sd={sd} mean={player.sg}/>
      </CardD>
    </div>
  );
}

function Distribution({ sd, mean }) {
  // approx normal dist
  const W = 400, H = 90, PAD = 20;
  const xRange = [-3, 5];
  const x = v => PAD + (v - xRange[0]) / (xRange[1] - xRange[0]) * (W - PAD * 2);
  const pdf = v => Math.exp(-Math.pow(v - mean, 2) / (2 * sd * sd));
  const pts = Array.from({ length: 80 }, (_, i) => {
    const v = xRange[0] + i / 79 * (xRange[1] - xRange[0]);
    return [x(v), H - 10 - pdf(v) * (H - 25)];
  });
  const path = 'M' + pts.map(p => p.join(',')).join(' L') + ` L${x(xRange[1])},${H-10} L${x(xRange[0])},${H-10} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 100 }}>
      <line x1={PAD} y1={H-10} x2={W-PAD} y2={H-10} stroke={TONE.line} strokeWidth="1"/>
      <path d={path} fill="rgba(0,88,64,0.18)" stroke={TONE.green} strokeWidth="1.5"/>
      <line x1={x(0)} y1={20} x2={x(0)} y2={H-10} stroke={TONE.mute} strokeWidth="1" strokeDasharray="2 2"/>
      <line x1={x(mean)} y1={H-10-pdf(mean)*(H-25)} x2={x(mean)} y2={H-10} stroke={TONE.green} strokeWidth="2"/>
      {[-2, 0, 2, 4].map(v => (
        <text key={v} x={x(v)} y={H-2} fontSize="9" fill={TONE.mute} textAnchor="middle" fontFamily="JetBrains Mono">
          {v >= 0 ? '+' : ''}{v}
        </text>
      ))}
      <circle cx={x(mean)} cy={H-10-pdf(mean)*(H-25)} r="4" fill={TONE.lime} stroke={TONE.green} strokeWidth="2"/>
    </svg>
  );
}

/* ─── SECTION 7 · COURSE FIT + LIVE PREDICTIONS ───────── */
function FitAndPredict({ player }) {
  const event = { name: 'NCAA Regional · Tucson', course: 'Tucson National GC', date: '13.05.2026' };
  const fit = +0.34;
  const traits = [
    { label: 'Lang carry', match: 0.85,  why: 'Bombarder-rute, krever 290+' },
    { label: 'Kort approach (≤175)', match: 0.78, why: 'Avg approach 162 yd' },
    { label: 'Bermuda greens', match: 0.42, why: 'Begrenset historikk' },
    { label: 'Vind ≥ 12 mph', match: 0.58, why: 'Snitt på blåsige dager' },
    { label: 'Par-5 scoring', match: 0.92, why: '−0,68 pr. par-5 sesong' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
      <CardD>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <EyebrowD>BANE-FIT · NESTE KAMP</EyebrowD>
          <TagD color={TONE.green}>{fit >= 0 ? '+' : ''}{fit.toFixed(2).replace('.', ',')} SG-FIT</TagD>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: TONE.text, marginTop: 8 }}>{event.name}</div>
        <div style={{ fontSize: 11, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{event.course} · {event.date}</div>
        <div style={{ marginTop: 16 }}>
          {traits.map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid ' + TONE.line }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: TONE.text, fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: TONE.mute, marginTop: 1 }}>{t.why}</div>
              </div>
              <div style={{ width: 100, height: 6, background: TONE.paper, borderRadius: 3, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0,
                  width: t.match * 100 + '%',
                  background: t.match > 0.7 ? TONE.green : t.match > 0.5 ? TONE.amber : TONE.red,
                  borderRadius: 3,
                }}/>
              </div>
              <span style={{ width: 32, textAlign: 'right', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: TONE.text, fontWeight: 700 }}>
                {Math.round(t.match * 100)}
              </span>
            </div>
          ))}
        </div>
      </CardD>

      <CardD>
        <EyebrowD>LIVE-MODELL · FOR EVENT</EyebrowD>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 14 }}>
          <PredictDial label="Vinn" value={4.2} max={20}/>
          <PredictDial label="Topp 10" value={31}  max={100}/>
          <PredictDial label="Topp 25" value={58} max={100}/>
          <PredictDial label="Cut" value={92} max={100}/>
        </div>
        <div style={{ marginTop: 14, padding: 10, background: TONE.paper, borderRadius: 8, fontSize: 11, color: TONE.textL, lineHeight: 1.5 }}>
          Modell oppdatert <b>14.04.26 06:00</b>. Inputs: skill (+1,46), bane-fit (+0,34), feltstyrke (#42 av 84), historikk (3 starts).
        </div>
      </CardD>
    </div>
  );
}

function PredictDial({ label, value, max }) {
  const pct = value / max;
  const R = 38, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} fill="none" stroke={TONE.line} strokeWidth="6"/>
        <circle cx="40" cy="40" r={R} fill="none"
          stroke={TONE.green} strokeWidth="6"
          strokeDasharray={`${pct * C} ${C}`}
          transform="rotate(-90 40 40)" strokeLinecap="round"/>
        <text x="40" y="38" fontSize="14" fill={TONE.text} textAnchor="middle" fontWeight="700" fontFamily="JetBrains Mono">{value}</text>
        <text x="40" y="52" fontSize="9" fill={TONE.mute} textAnchor="middle" fontFamily="JetBrains Mono">%</text>
      </svg>
      <div>
        <div style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{label.toUpperCase()}</div>
        <div style={{ fontSize: 10, color: TONE.textL, marginTop: 2 }}>p({label.toLowerCase()})</div>
      </div>
    </div>
  );
}

/* ─── SECTION 8 · ROUND-BY-ROUND STRIP ────────────────── */
function RoundStrip({ player }) {
  // 30 runder, hver med 4 SG-komponenter
  const rounds = useMemoD(() => Array.from({ length: 30 }).map((_, i) => {
    const seed = i * 31 + 7;
    const r = (n) => ((Math.sin(seed * (n+1)) + 1) / 2 - 0.4) * 1.5;
    return {
      i, putt: r(1), app: r(2), tee: r(3), around: r(4),
      total: r(1) + r(2) + r(3) + r(4),
      event: ['NCAA','NCAA','NCAA','Pac-12','NCAA','NCAA'][i % 6],
      pos: 1 + Math.floor(((Math.sin(seed) + 1) / 2) * 35),
    };
  }), []);

  return (
    <CardD>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <EyebrowD>RUNDE-FOR-RUNDE · STRIP</EyebrowD>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: TONE.mute }}>
          <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#0d6b51', verticalAlign: 'middle', marginRight: 4, borderRadius: 2 }}/>Putting</span>
          <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#16463A', verticalAlign: 'middle', marginRight: 4, borderRadius: 2 }}/>Approach</span>
          <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#005840', verticalAlign: 'middle', marginRight: 4, borderRadius: 2 }}/>Off-the-tee</span>
          <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#A5B2AD', verticalAlign: 'middle', marginRight: 4, borderRadius: 2 }}/>ARG</span>
        </div>
      </div>

      <StackedStrip rounds={rounds}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace' }}>
        <span>R30 (eldst)</span>
        <span>R1 (siste)</span>
      </div>
    </CardD>
  );
}

function StackedStrip({ rounds }) {
  const W = 980, H = 180, PAD = 28;
  const max = 3.5;
  const bw = (W - PAD * 2) / rounds.length;
  const y = v => PAD + (1 - (v + max) / (max * 2)) * (H - PAD * 2);
  const y0 = y(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200 }}>
      {[-2, 0, 2].map(v => (
        <g key={v}>
          <line x1={PAD} y1={y(v)} x2={W-PAD} y2={y(v)} stroke={TONE.line} strokeWidth="1"/>
          <text x={PAD-6} y={y(v)+3} fontSize="9" fill={TONE.mute} textAnchor="end" fontFamily="JetBrains Mono">
            {v >= 0 ? '+' : ''}{v}
          </text>
        </g>
      ))}
      <line x1={PAD} y1={y0} x2={W-PAD} y2={y0} stroke={TONE.text} strokeWidth="1"/>

      {rounds.map((r, i) => {
        const xc = PAD + i * bw + bw / 2;
        const w = bw * 0.62;
        const components = [
          { v: r.tee, c: '#005840' },
          { v: r.app, c: '#16463A' },
          { v: r.around, c: '#A5B2AD' },
          { v: r.putt, c: '#0d6b51' },
        ];
        // stack positives upward, negatives downward
        let posOff = 0, negOff = 0;
        return (
          <g key={i}>
            {components.map((c, idx) => {
              const h = Math.abs(c.v) / max * (H - PAD * 2) / 2;
              if (c.v >= 0) {
                const top = y0 - posOff - h;
                posOff += h;
                return <rect key={idx} x={xc - w/2} y={top} width={w} height={h} fill={c.c} rx="1"/>;
              } else {
                const top = y0 + negOff;
                negOff += h;
                return <rect key={idx} x={xc - w/2} y={top} width={w} height={h} fill={c.c} opacity="0.55" rx="1"/>;
              }
            })}
            {/* total dot */}
            <circle cx={xc} cy={y(r.total)} r="2.5" fill={TONE.lime} stroke={TONE.green} strokeWidth="1"/>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   GLOBAL DATAGOLF DATABASE — pros worldwide w/ SG
   ═══════════════════════════════════════════════════════ */
const DG_GLOBAL = [
  // PGA Tour — top
  { id: 'dg_scheffler', name: 'Scottie Scheffler',  country: 'USA', tour: 'PGA',  dg: 1, owgr: 1,   sg: 2.84, sgDelta: 0.10,  putt: 0.42, app: 1.32, tee: 0.68, around: 0.42 },
  { id: 'dg_mcilroy',   name: 'Rory McIlroy',       country: 'NIR', tour: 'PGA',  dg: 2, owgr: 2,   sg: 2.14, sgDelta: 0.05,  putt: 0.18, app: 0.78, tee: 0.94, around: 0.24 },
  { id: 'dg_schauffele',name: 'Xander Schauffele',  country: 'USA', tour: 'PGA',  dg: 3, owgr: 3,   sg: 1.96, sgDelta: -0.08, putt: 0.38, app: 0.84, tee: 0.52, around: 0.22 },
  { id: 'dg_morikawa',  name: 'Collin Morikawa',    country: 'USA', tour: 'PGA',  dg: 4, owgr: 4,   sg: 1.88, sgDelta: 0.12,  putt: 0.06, app: 1.18, tee: 0.42, around: 0.22 },
  { id: 'dg_aberg',     name: 'Ludvig Åberg',       country: 'SWE', tour: 'PGA',  dg: 5, owgr: 6,   sg: 1.90, sgDelta: 0.18,  putt: 0.14, app: 0.78, tee: 0.78, around: 0.20 },
  { id: 'dg_hovland',   name: 'Viktor Hovland',     country: 'NOR', tour: 'PGA',  dg: 6, owgr: 11,  sg: 1.84, sgDelta: 0.40,  putt: 0.31, app: 0.92, tee: 0.51, around: 0.10 },
  { id: 'dg_cantlay',   name: 'Patrick Cantlay',    country: 'USA', tour: 'PGA',  dg: 7, owgr: 7,   sg: 1.74, sgDelta: -0.04, putt: 0.32, app: 0.82, tee: 0.42, around: 0.18 },
  { id: 'dg_thomas',    name: 'Justin Thomas',      country: 'USA', tour: 'PGA',  dg: 8, owgr: 9,   sg: 1.72, sgDelta: 0.06,  putt: 0.18, app: 0.92, tee: 0.42, around: 0.20 },
  { id: 'dg_finau',     name: 'Tony Finau',         country: 'USA', tour: 'PGA',  dg: 9, owgr: 14,  sg: 1.42, sgDelta: -0.10, putt: -0.04, app: 0.74, tee: 0.62, around: 0.10 },
  { id: 'dg_spieth',    name: 'Jordan Spieth',      country: 'USA', tour: 'PGA',  dg: 10, owgr: 16, sg: 1.38, sgDelta: -0.18, putt: 0.42, app: 0.48, tee: 0.28, around: 0.20 },
  { id: 'dg_homa',      name: 'Max Homa',           country: 'USA', tour: 'PGA',  dg: 11, owgr: 12, sg: 1.36, sgDelta: 0.02,  putt: 0.22, app: 0.66, tee: 0.34, around: 0.14 },
  { id: 'dg_clark',     name: 'Wyndham Clark',      country: 'USA', tour: 'PGA',  dg: 12, owgr: 8,  sg: 1.62, sgDelta: 0.18,  putt: 0.18, app: 0.62, tee: 0.68, around: 0.14 },
  { id: 'dg_burns',     name: 'Sam Burns',          country: 'USA', tour: 'PGA',  dg: 13, owgr: 13, sg: 1.32, sgDelta: -0.06, putt: 0.42, app: 0.48, tee: 0.32, around: 0.10 },
  { id: 'dg_fitz',      name: 'Matt Fitzpatrick',   country: 'ENG', tour: 'PGA',  dg: 14, owgr: 10, sg: 1.42, sgDelta: 0.04,  putt: 0.22, app: 0.62, tee: 0.38, around: 0.20 },
  { id: 'dg_henley',    name: 'Russell Henley',     country: 'USA', tour: 'PGA',  dg: 15, owgr: 17, sg: 1.28, sgDelta: 0.14,  putt: 0.18, app: 0.72, tee: 0.22, around: 0.16 },
  { id: 'dg_young',     name: 'Cameron Young',      country: 'USA', tour: 'PGA',  dg: 16, owgr: 18, sg: 1.26, sgDelta: -0.04, putt: -0.02, app: 0.52, tee: 0.62, around: 0.14 },
  { id: 'dg_straka',    name: 'Sepp Straka',        country: 'AUT', tour: 'PGA',  dg: 17, owgr: 19, sg: 1.24, sgDelta: 0.18,  putt: 0.12, app: 0.72, tee: 0.28, around: 0.12 },
  { id: 'dg_theegala',  name: 'Sahith Theegala',    country: 'USA', tour: 'PGA',  dg: 18, owgr: 20, sg: 1.22, sgDelta: -0.02, putt: 0.32, app: 0.48, tee: 0.32, around: 0.10 },
  { id: 'dg_matsuyama', name: 'Hideki Matsuyama',   country: 'JPN', tour: 'PGA',  dg: 19, owgr: 15, sg: 1.46, sgDelta: 0.12,  putt: -0.04, app: 0.92, tee: 0.42, around: 0.16 },
  { id: 'dg_horschel',  name: 'Billy Horschel',     country: 'USA', tour: 'PGA',  dg: 20, owgr: 22, sg: 1.10, sgDelta: -0.08, putt: 0.18, app: 0.46, tee: 0.34, around: 0.12 },
  { id: 'dg_im',        name: 'Sungjae Im',         country: 'KOR', tour: 'PGA',  dg: 21, owgr: 24, sg: 1.04, sgDelta: 0.04,  putt: 0.08, app: 0.52, tee: 0.32, around: 0.12 },
  { id: 'dg_glover',    name: 'Lucas Glover',       country: 'USA', tour: 'PGA',  dg: 22, owgr: 30, sg: 0.98, sgDelta: -0.12, putt: 0.22, app: 0.42, tee: 0.22, around: 0.12 },
  { id: 'dg_ncox',      name: 'Nick Taylor',        country: 'CAN', tour: 'PGA',  dg: 23, owgr: 32, sg: 0.96, sgDelta: 0.06,  putt: 0.32, app: 0.32, tee: 0.20, around: 0.12 },
  { id: 'dg_pendrith',  name: 'Taylor Pendrith',    country: 'CAN', tour: 'PGA',  dg: 24, owgr: 28, sg: 1.02, sgDelta: 0.10,  putt: 0.04, app: 0.42, tee: 0.42, around: 0.14 },
  { id: 'dg_pavon',     name: 'Matthieu Pavon',     country: 'FRA', tour: 'PGA',  dg: 25, owgr: 27, sg: 1.04, sgDelta: 0.12,  putt: 0.18, app: 0.46, tee: 0.30, around: 0.10 },
  { id: 'dg_lowry',     name: 'Shane Lowry',        country: 'IRL', tour: 'PGA',  dg: 26, owgr: 21, sg: 1.16, sgDelta: 0.04,  putt: 0.26, app: 0.52, tee: 0.22, around: 0.16 },
  { id: 'dg_hatton',    name: 'Tyrrell Hatton',     country: 'ENG', tour: 'PGA',  dg: 27, owgr: 23, sg: 1.08, sgDelta: -0.04, putt: 0.18, app: 0.52, tee: 0.24, around: 0.14 },
  { id: 'dg_fleetwood', name: 'Tommy Fleetwood',    country: 'ENG', tour: 'PGA',  dg: 28, owgr: 25, sg: 1.06, sgDelta: 0.02,  putt: 0.04, app: 0.62, tee: 0.26, around: 0.14 },
  { id: 'dg_rahm',      name: 'Jon Rahm',           country: 'ESP', tour: 'LIV',  dg: 29, owgr: 5,  sg: 1.94, sgDelta: 0.08,  putt: 0.18, app: 0.86, tee: 0.62, around: 0.28 },
  { id: 'dg_dechambeau',name: 'Bryson DeChambeau',  country: 'USA', tour: 'LIV',  dg: 30, owgr: 26, sg: 1.78, sgDelta: 0.20,  putt: 0.22, app: 0.62, tee: 0.78, around: 0.16 },
  { id: 'dg_koepka',    name: 'Brooks Koepka',      country: 'USA', tour: 'LIV',  dg: 31, owgr: 35, sg: 1.42, sgDelta: -0.04, putt: 0.04, app: 0.62, tee: 0.58, around: 0.18 },
  { id: 'dg_smith',     name: 'Cameron Smith',      country: 'AUS', tour: 'LIV',  dg: 32, owgr: 33, sg: 1.32, sgDelta: 0.08,  putt: 0.52, app: 0.42, tee: 0.20, around: 0.18 },
  { id: 'dg_day',       name: 'Jason Day',          country: 'AUS', tour: 'PGA',  dg: 33, owgr: 31, sg: 1.18, sgDelta: -0.06, putt: 0.22, app: 0.52, tee: 0.32, around: 0.12 },
  { id: 'dg_woods',     name: 'Tiger Woods',        country: 'USA', tour: 'PGA',  dg: 34, owgr: 980, sg: 0.84, sgDelta: -0.20, putt: 0.32, app: 0.32, tee: 0.10, around: 0.10 },
  { id: 'dg_dahmen',    name: 'Joel Dahmen',        country: 'USA', tour: 'PGA',  dg: 35, owgr: 62, sg: 0.78, sgDelta: -0.04, putt: 0.18, app: 0.32, tee: 0.18, around: 0.10 },
  { id: 'dg_griffin',   name: 'Ben Griffin',        country: 'USA', tour: 'PGA',  dg: 36, owgr: 38, sg: 0.92, sgDelta: 0.18,  putt: 0.22, app: 0.42, tee: 0.20, around: 0.08 },
  { id: 'dg_potgieter', name: 'Aldrich Potgieter',  country: 'RSA', tour: 'PGA',  dg: 37, owgr: 86, sg: 0.86, sgDelta: 0.32,  putt: 0.04, app: 0.32, tee: 0.42, around: 0.08 },
  { id: 'dg_griffin2',  name: 'Davis Thompson',     country: 'USA', tour: 'PGA',  dg: 38, owgr: 36, sg: 0.94, sgDelta: 0.06,  putt: 0.22, app: 0.36, tee: 0.24, around: 0.12 },
  // DP World Tour
  { id: 'dg_meronk',    name: 'Adrian Meronk',      country: 'POL', tour: 'DPW',  dg: 39, owgr: 41, sg: 0.88, sgDelta: 0.04,  putt: 0.10, app: 0.44, tee: 0.22, around: 0.12 },
  { id: 'dg_hojgaard',  name: 'Nicolai Højgaard',   country: 'DEN', tour: 'DPW',  dg: 40, owgr: 29, sg: 1.00, sgDelta: 0.06,  putt: 0.04, app: 0.52, tee: 0.32, around: 0.12 },
  { id: 'dg_hojgaard2', name: 'Rasmus Højgaard',    country: 'DEN', tour: 'DPW',  dg: 41, owgr: 47, sg: 0.84, sgDelta: 0.08,  putt: 0.08, app: 0.42, tee: 0.22, around: 0.12 },
  { id: 'dg_olesen',    name: 'Thorbjørn Olesen',   country: 'DEN', tour: 'DPW',  dg: 42, owgr: 52, sg: 0.78, sgDelta: 0.02,  putt: 0.18, app: 0.36, tee: 0.16, around: 0.08 },
  { id: 'dg_neergaard', name: 'Niklas Nørgaard',    country: 'DEN', tour: 'DPW',  dg: 43, owgr: 58, sg: 0.74, sgDelta: 0.04,  putt: 0.06, app: 0.38, tee: 0.22, around: 0.08 },
  { id: 'dg_lawrence',  name: 'Thriston Lawrence',  country: 'RSA', tour: 'DPW',  dg: 44, owgr: 49, sg: 0.78, sgDelta: 0.06,  putt: 0.12, app: 0.36, tee: 0.22, around: 0.08 },
  { id: 'dg_macintyre', name: 'Robert MacIntyre',   country: 'SCO', tour: 'DPW',  dg: 45, owgr: 34, sg: 0.96, sgDelta: 0.10,  putt: 0.18, app: 0.42, tee: 0.26, around: 0.10 },
  { id: 'dg_jaeger',    name: 'Stephan Jaeger',     country: 'GER', tour: 'PGA',  dg: 46, owgr: 39, sg: 0.90, sgDelta: 0.08,  putt: 0.18, app: 0.40, tee: 0.22, around: 0.10 },
  { id: 'dg_kitayama',  name: 'Kurt Kitayama',      country: 'USA', tour: 'PGA',  dg: 47, owgr: 42, sg: 0.86, sgDelta: -0.02, putt: 0.04, app: 0.42, tee: 0.32, around: 0.08 },
  { id: 'dg_kim',       name: 'Tom Kim',            country: 'KOR', tour: 'PGA',  dg: 48, owgr: 37, sg: 0.92, sgDelta: -0.06, putt: 0.32, app: 0.32, tee: 0.20, around: 0.08 },
  { id: 'dg_an',        name: 'Byeong Hun An',      country: 'KOR', tour: 'PGA',  dg: 49, owgr: 40, sg: 0.88, sgDelta: 0.04,  putt: 0.04, app: 0.46, tee: 0.30, around: 0.08 },
  { id: 'dg_zalatoris', name: 'Will Zalatoris',     country: 'USA', tour: 'PGA',  dg: 50, owgr: 50, sg: 0.82, sgDelta: -0.04, putt: -0.08, app: 0.62, tee: 0.20, around: 0.08 },
  { id: 'dg_taylor',    name: 'Nick Dunlap',        country: 'USA', tour: 'PGA',  dg: 51, owgr: 44, sg: 0.84, sgDelta: 0.10,  putt: 0.12, app: 0.42, tee: 0.22, around: 0.08 },
  { id: 'dg_eckroat',   name: 'Austin Eckroat',     country: 'USA', tour: 'PGA',  dg: 52, owgr: 51, sg: 0.80, sgDelta: 0.04,  putt: 0.18, app: 0.36, tee: 0.18, around: 0.08 },
  { id: 'dg_hadley',    name: 'Chesson Hadley',     country: 'USA', tour: 'PGA',  dg: 53, owgr: 84, sg: 0.66, sgDelta: -0.08, putt: 0.18, app: 0.32, tee: 0.10, around: 0.06 },
  { id: 'dg_bradley',   name: 'Keegan Bradley',     country: 'USA', tour: 'PGA',  dg: 54, owgr: 43, sg: 0.86, sgDelta: 0.04,  putt: 0.22, app: 0.36, tee: 0.20, around: 0.08 },
  { id: 'dg_riley',     name: 'Davis Riley',        country: 'USA', tour: 'PGA',  dg: 55, owgr: 60, sg: 0.74, sgDelta: -0.08, putt: 0.10, app: 0.34, tee: 0.22, around: 0.08 },
  // Norske / Hovland-tier
  { id: 'dg_ventura',   name: 'Kristoffer Ventura', country: 'NOR', tour: 'PGA',  dg: 142, owgr: 142, sg: 0.81, sgDelta: -0.20, putt: 0.12, app: 0.45, tee: 0.18, around: 0.06 },
  { id: 'dg_kim2',      name: 'Kris Kim',           country: 'KOR', tour: 'PGA',  dg: 198, owgr: 198, sg: 0.42, sgDelta: -0.05, putt: 0.05, app: 0.20, tee: 0.12, around: 0.05 },
  // KF / Challenge
  { id: 'dg_grip',      name: 'Sigurd Grip',        country: 'NOR', tour: 'KF',   dg: 244, owgr: 244, sg: 0.62, sgDelta: 0.15,  putt: 0.18, app: 0.30, tee: 0.10, around: 0.04 },
  { id: 'dg_halland',   name: 'Jens Halland',       country: 'NOR', tour: 'KF',   dg: 312, owgr: 312, sg: 0.34, sgDelta: 0.05,  putt: 0.10, app: 0.18, tee: 0.04, around: 0.02 },
  { id: 'dg_lange',     name: 'Eirik Langeland',    country: 'NOR', tour: 'CHA',  dg: 421, owgr: 421, sg: 0.88, sgDelta: 0.22,  putt: 0.22, app: 0.40, tee: 0.20, around: 0.06 },
  { id: 'dg_strand',    name: 'Tobias Strand',      country: 'NOR', tour: 'NOR',  dg: 567, owgr: 567, sg: 0.41, sgDelta: -0.08, putt: 0.05, app: 0.20, tee: 0.10, around: 0.06 },
  { id: 'dg_heldal',    name: 'Anders Heldal',      country: 'NOR', tour: 'NOR',  dg: 612, owgr: 612, sg: 0.28, sgDelta: 0.10,  putt: 0.02, app: 0.12, tee: 0.10, around: 0.04 },
];

// Merge each DG entry with default profile-shape so DgSgTab works
const DG_PLAYERS = DG_GLOBAL.map(p => ({
  ...p,
  hasSG: true,
  stage: p.tour === 'PGA' || p.tour === 'LIV' ? 6 : p.tour === 'KF' ? 5 : p.tour === 'CHA' || p.tour === 'DPW' ? 4 : 3,
  club:  p.tour === 'PGA' ? 'PGA Tour' : p.tour === 'LIV' ? 'LIV Golf' : p.tour === 'DPW' ? 'DP World Tour' : p.tour === 'KF' ? 'Korn Ferry' : p.tour === 'CHA' ? 'Challenge Tour' : 'Nordic Tour',
  age: 28, born: 1998, region: 'Internasjonal',
  avgScore: +(70.0 + (1 - p.sg / 3) * 1.5).toFixed(1),
  bestScore: 64, toPar: -((p.sg / 3).toFixed(1)),
  progress: 1.0, ready: false, wagr: p.owgr, wagrDelta: 0,
}));

const COUNTRIES_DG = ['Alle', ...Array.from(new Set(DG_PLAYERS.map(p => p.country))).sort()];
const TOURS_DG = ['Alle', 'PGA', 'LIV', 'DPW', 'KF', 'CHA', 'NOR'];

/* ═══════════════════════════════════════════════════════
   2)  TOP-LEVEL DATAGOLF EXPLORER
   ═══════════════════════════════════════════════════════ */
function DgExplorerView({ onPlayer }) {
  const [search, setSearch] = useStateD('');
  const [country, setCountry] = useStateD('Alle');
  const [tour, setTour] = useStateD('Alle');
  const [sel, setSel] = useStateD(DG_PLAYERS.find(p => p.id === 'dg_hovland') || DG_PLAYERS[0]);

  const filtered = useMemoD(() => {
    let p = DG_PLAYERS;
    if (country !== 'Alle') p = p.filter(x => x.country === country);
    if (tour !== 'Alle')    p = p.filter(x => x.tour === tour);
    if (search.trim())      p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    return p.sort((a, b) => b.sg - a.sg);
  }, [search, country, tour]);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DgExplorerHero count={DG_PLAYERS.length} />
      <DgFilterBar
        search={search} setSearch={setSearch}
        country={country} setCountry={setCountry}
        tour={tour} setTour={setTour}
        resultCount={filtered.length}
      />
      <DgPlayerGrid players={filtered} selected={sel} onSelect={setSel} />
      <DgSgTab player={sel} embedded />
    </div>
  );
}

function DgFilterBar({ search, setSearch, country, setCountry, tour, setTour, resultCount }) {
  return (
    <div style={{
      padding: 14, background: '#fff', borderRadius: 12, border: '1px solid ' + TONE.line,
      display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px', minWidth: 220,
        background: TONE.paper, padding: '8px 12px', borderRadius: 8 }}>
        <IconD name="search" size={14} color={TONE.mute} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Søk DataGolf-database (Scheffler, McIlroy, Hovland…)"
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: 13, color: TONE.text, fontFamily: 'inherit' }} />
        {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: TONE.mute, fontSize: 14 }}>×</button>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 600 }}>TOUR</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {TOURS_DG.map(t => (
            <button key={t} onClick={() => setTour(t)} style={{
              padding: '5px 9px', fontSize: 10.5, fontWeight: 700,
              border: `1px solid ${tour === t ? TONE.green : TONE.line}`,
              background: tour === t ? TONE.green : '#fff',
              color: tour === t ? '#fff' : TONE.textL,
              borderRadius: 4, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
            }}>{t}</button>
          ))}
        </div>
      </div>
      <select value={country} onChange={e => setCountry(e.target.value)} style={{
        padding: '6px 10px', border: `1px solid ${TONE.line}`, borderRadius: 6,
        fontSize: 12, color: TONE.text, background: '#fff', fontFamily: 'inherit',
      }}>
        {COUNTRIES_DG.map(c => <option key={c} value={c}>{c === 'Alle' ? 'Alle land' : c}</option>)}
      </select>
      <span style={{ fontSize: 11, color: TONE.mute, fontFamily: 'JetBrains Mono, monospace', marginLeft: 'auto' }}>
        {resultCount} treff
      </span>
    </div>
  );
}

function DgPlayerGrid({ players, selected, onSelect }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 8, maxHeight: 280, overflowY: 'auto',
      padding: 12, background: '#fff', borderRadius: 12, border: '1px solid ' + TONE.line,
    }}>
      {players.map(p => {
        const active = p.id === selected.id;
        return (
          <button key={p.id} onClick={() => onSelect(p)} style={{
            padding: '10px 12px', borderRadius: 8,
            border: '1px solid ' + (active ? TONE.green : TONE.line),
            background: active ? TONE.green : '#fff',
            color: active ? '#fff' : TONE.text,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: active ? 'rgba(255,255,255,0.2)' : '#e0e8e5',
              color: active ? '#fff' : TONE.text,
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{p.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 9.5, opacity: active ? 0.9 : 0.6, fontFamily: 'JetBrains Mono, monospace', display: 'flex', gap: 4, marginTop: 1 }}>
                <span>{p.country}</span>
                <span>·</span>
                <span>{p.tour}</span>
                <span>·</span>
                <span style={{ fontWeight: 700 }}>{fmtD.sg(p.sg)}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DgExplorerHero({ count }) {
  return (
    <div style={{
      padding: 22, borderRadius: 14,
      background: 'linear-gradient(135deg, #0D2E23 0%, #16463A 60%, #1f5a48 100%)',
      color: 'white', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
        <div>
          <EyebrowD white>DATAGOLF HUB</EyebrowD>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>
            Strokes Gained &amp; ferdighetsestimater
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', maxWidth: 560, lineHeight: 1.5 }}>
            Velg en spiller for å utforske komplett DG-profil: skill estimates, true SG, distansebånd-nærhet,
            putting-kurver, driving-matrix, bane-fit og live prediksjoner.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <HeroStat label="SG-DEKKEDE" value={count}/>
          <HeroStat label="SHOTLINK-RUNDER" value="2 184"/>
          <HeroStat label="SISTE OPPD." value="14.04"/>
        </div>
      </div>
      {/* decorative */}
      <svg style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.08, zIndex: 1 }} width="280" height="280" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="12" fill="white"/>
      </svg>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.18)', paddingLeft: 16 }}>
      <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'white', fontFamily: 'JetBrains Mono, monospace', marginTop: 4, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function PlayerSelector({ players, selected, onSelect }) {
  return (
    <div style={{
      padding: 14, background: '#fff', borderRadius: 12, border: '1px solid ' + TONE.line,
      display: 'flex', alignItems: 'center', gap: 14, overflowX: 'auto',
    }}>
      <span style={{ fontSize: 10, color: TONE.mute, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, whiteSpace: 'nowrap' }}>SPILLER →</span>
      {players.map(p => {
        const stage = STG_D.find(s => s.id === p.stage);
        const active = p.id === selected.id;
        return (
          <button key={p.id} onClick={() => onSelect(p)} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid ' + (active ? TONE.green : TONE.line),
            background: active ? TONE.green : '#fff',
            color: active ? '#fff' : TONE.text,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
            fontFamily: 'inherit', transition: 'all 120ms',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: active ? 'rgba(255,255,255,0.2)' : '#e0e8e5',
              color: active ? '#fff' : TONE.text,
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{p.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 9.5, opacity: 0.7, fontFamily: 'JetBrains Mono, monospace' }}>
                {stage.short} · SG {fmtD.sg(p.sg)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

window.PIPELINE_DG = { DgSgTab, DgExplorerView };
