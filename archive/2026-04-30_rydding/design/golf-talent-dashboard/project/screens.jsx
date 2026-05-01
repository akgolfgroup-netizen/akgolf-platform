// Screens: Main Dashboard (Oversikt) + Full Player Profile page
// Reuses atoms from window.PIPELINE_UI to stay token-efficient.

const { useState: useStateS, useMemo: useMemoS } = React;
const { Icon: IconS, fmt: fmtS, PipelineRail: PRailS, SgDelta: SgDS, SourceBadge: SrcBS } = window.PIPELINE_UI;
const { STAGES: STG_S, PLAYERS: PLY_S, TIMELINE: TML_S } = window.PIPELINE_DATA;
const DgSgTabS = (props) => {
  const C = window.PIPELINE_DG && window.PIPELINE_DG.DgSgTab;
  return C ? <C {...props} /> : null;
};

/* ─── Shared chrome ────────────────────────────────────── */
const Card = ({ children, style, pad = 18 }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 14, border: '1px solid #e0e8e5',
    padding: pad, ...style,
  }}>{children}</div>
);

const Eyebrow = ({ children, style }) => (
  <div style={{
    fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em',
    fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', ...style,
  }}>{children}</div>
);

const KPI = ({ label, value, delta, sub, tone = 'default' }) => {
  const bg = tone === 'dark' ? '#0D2E23' : tone === 'accent' ? '#D1F843' : '#FFFFFF';
  const fg = tone === 'dark' ? '#FFFFFF' : '#324D45';
  const muted = tone === 'dark' ? 'rgba(255,255,255,0.7)' : '#A5B2AD';
  return (
    <Card style={{ background: bg, color: fg, border: tone === 'accent' ? 'none' : undefined }}>
      <Eyebrow style={{ color: muted }}>{label}</Eyebrow>
      <div style={{
        fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1,
        marginTop: 10, fontFamily: 'JetBrains Mono, monospace',
      }}>{value}</div>
      {(delta !== undefined || sub) && (
        <div style={{ fontSize: 11, marginTop: 8, color: muted, fontFamily: 'JetBrains Mono, monospace' }}>
          {delta !== undefined && (
            <span style={{ color: delta >= 0 ? (tone === 'dark' ? '#D1F843' : '#005840') : '#B84233', fontWeight: 600, marginRight: 8 }}>
              {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}
            </span>
          )}
          {sub}
        </div>
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════
   DASHBOARD — Oversikt
   ═══════════════════════════════════════════════════════ */
function DashboardView({ onPlayer }) {
  const totalPlayers = PLY_S.length;
  const ready = PLY_S.filter(p => p.ready);
  const readyCount = ready.length;
  const sgPool = PLY_S.filter(p => p.hasSG && typeof p.sg === 'number');
  const avgSg = sgPool.length ? (sgPool.reduce((s, p) => s + p.sg, 0) / sgPool.length) : 0;
  const climbing = PLY_S.filter(p => (p.sgDelta || 0) > 0.1).length;
  const rising = [...PLY_S]
    .filter(p => typeof p.sgDelta === 'number')
    .sort((a, b) => b.sgDelta - a.sgDelta)
    .slice(0, 5);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Eyebrow>OVERSIKT · 2026</Eyebrow>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#324D45', margin: '4px 0 0', letterSpacing: '-0.02em' }}>
            Norsk golftalent <span style={{ color: '#A5B2AD', fontWeight: 500 }}>i tall</span>
          </h1>
          <div style={{ fontSize: 12, color: '#A5B2AD', marginTop: 6 }}>
            5 datakilder · oppdatert 26.04 kl. 06:00 · neste sync 27.04
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btn}>Ukerapport</button>
          <button style={{ ...btn, background: '#D1F843', color: '#0A1F18', border: 'none', fontWeight: 600 }}>
            <IconS name="download" size={13} /> Eksporter
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KPI label="Totalt i pipeline" value={totalPlayers.toLocaleString('nb-NO')} delta={+18} sub="vs. forrige måned" />
        <KPI label="Klare for opprykk" value={readyCount} sub="ML-flagg + benchmarks passert" tone="accent" />
        <KPI label="SG-snitt vs. trinn-ref" value={fmtS.sg(avgSg)} delta={+0.12} sub="hele kohorten" />
        <KPI label="Sterk progresjon" value={climbing} sub={`av ${totalPlayers} (${Math.round(climbing/totalPlayers*100)} %)`} tone="dark" />
      </div>

      {/* Pipeline funnel + Movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <Card pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <Eyebrow>UTVIKLINGSSTIGE · ANTALL PR. TRINN</Eyebrow>
            <span style={{ fontSize: 11, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>logaritmisk</span>
          </div>
          <Funnel />
        </Card>

        <Card pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Eyebrow>STERKEST FREMGANG · SG Δ</Eyebrow>
            <span style={{ fontSize: 11, color: '#A5B2AD' }}>siden ifjor</span>
          </div>
          {rising.map((p, i) => (
            <button key={p.id} onClick={() => onPlayer(p)} style={moverRow(i === rising.length - 1)}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#A5B2AD', width: 16 }}>{i+1}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#324D45' }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>
                  T{p.stage} · {p.club}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#005840', fontFamily: 'JetBrains Mono, monospace' }}>
                  {fmtS.sg(p.sgDelta)}
                </div>
                <SparkBar value={p.sgDelta} max={0.5} />
              </div>
            </button>
          ))}
        </Card>
      </div>

      {/* Ready list + Regional + Source health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 14 }}>
        <Card pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <Eyebrow>KLARE FOR OPPRYKK</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#324D45', marginTop: 4 }}>
                {readyCount} spillere passerer benchmarks
              </div>
            </div>
            <span style={{
              fontSize: 10, padding: '4px 8px', borderRadius: 4,
              background: 'rgba(209,248,67,0.18)', color: '#005840',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.08em',
            }}>ML-FLAGG</span>
          </div>
          {ready.slice(0, 5).map(p => (
            <button key={p.id} onClick={() => onPlayer(p)} style={readyRow}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#005840',
                color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{p.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#324D45' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#A5B2AD' }}>
                  T{p.stage} → T{p.stage+1} · {p.club}
                </div>
              </div>
              <div style={{ width: 90 }}><PRailS progress={p.progress} /></div>
              <div style={{
                fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                color: '#005840', fontWeight: 700, minWidth: 50, textAlign: 'right',
              }}>{fmtS.sg(p.sg)}</div>
              <IconS name="arrowR" size={14} color="#A5B2AD" />
            </button>
          ))}
        </Card>

        <Card pad={20}>
          <Eyebrow style={{ marginBottom: 14 }}>REGIONAL FORDELING</Eyebrow>
          <RegionMap />
        </Card>

        <Card pad={20}>
          <Eyebrow style={{ marginBottom: 14 }}>DATAKILDER</Eyebrow>
          {[
            { src: 'DataGolf',   tag: 'DG',  rounds: '13 188', state: 'ok',   ago: '2t' },
            { src: 'WAGR',       tag: 'WAGR',rounds: '4 412',  state: 'ok',   ago: '6t' },
            { src: 'Srixon Tour',tag: 'SRX', rounds: '2 940',  state: 'ok',   ago: '1d' },
            { src: 'NCAA / Clippd', tag: 'NCAA', rounds: '1 821', state: 'warn', ago: '3d' },
            { src: 'OLYO Region', tag: 'OLYO', rounds: '821',  state: 'ok',   ago: '1d' },
          ].map((s, i) => (
            <div key={s.src} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: i < 4 ? '1px solid #f0f3f1' : 'none',
            }}>
              <SrcBS src={s.tag} />
              <div style={{ flex: 1, fontSize: 12, color: '#324D45' }}>{s.src}</div>
              <span style={{ fontSize: 11, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>{s.rounds}</span>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: s.state === 'ok' ? '#2A7D5A' : '#C48A32',
              }}/>
              <span style={{ fontSize: 10, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace', width: 24, textAlign: 'right' }}>{s.ago}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Cohort heatmap */}
      <Card pad={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <Eyebrow>KOHORT × TRINN</Eyebrow>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#324D45', marginTop: 4 }}>
              Hvor er talenten fordelt — og hvor er hullene?
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>
            <span>0</span>
            <div style={{ width: 80, height: 8, background: 'linear-gradient(90deg, #ECF0EF, #005840)', borderRadius: 2 }}/>
            <span>50+</span>
          </div>
        </div>
        <CohortHeatmap />
      </Card>
    </div>
  );
}

function Funnel() {
  const max = STG_S[STG_S.length - 1].count;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {STG_S.map(s => {
        const w = Math.max(8, Math.log10(s.count + 1) / Math.log10(max + 1) * 100);
        const isElite = s.id >= 5;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 90, fontSize: 12, color: '#324D45',
              fontWeight: s.id === 3 ? 700 : 500, textAlign: 'right',
            }}>{s.name}</div>
            <div style={{ flex: 1, height: 22, background: '#f4f7f5', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: w + '%',
                background: isElite ? '#005840' : '#0d6b51',
                borderRight: '2px solid #D1F843',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                padding: '0 8px', color: 'white', fontSize: 11, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
              }}>{s.count}</div>
            </div>
            <div style={{ width: 30, fontSize: 10, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>T{s.id}</div>
          </div>
        );
      })}
    </div>
  );
}

function SparkBar({ value, max }) {
  const w = Math.min(60, Math.abs(value) / max * 60);
  return (
    <div style={{ height: 3, width: 60, background: '#f0f3f1', borderRadius: 1.5, marginTop: 4, marginLeft: 'auto' }}>
      <div style={{ height: '100%', width: w + 'px', background: value >= 0 ? '#005840' : '#B84233', borderRadius: 1.5 }} />
    </div>
  );
}

function RegionMap() {
  const regions = [
    { name: 'Øst',   count: 320, top: 'Magnus K.' },
    { name: 'Vest',  count: 198, top: 'Ingrid B.' },
    { name: 'Sør',   count: 215, top: 'Sigurd G.' },
    { name: 'Midt',  count: 142, top: 'Anders H.' },
    { name: 'Nord',  count: 50,  top: 'Tove L.' },
  ];
  const total = regions.reduce((s, r) => s + r.count, 0);
  return (
    <div>
      {regions.map(r => {
        const pct = r.count / total * 100;
        return (
          <div key={r.name} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: '#324D45', fontWeight: 500 }}>{r.name}</span>
              <span style={{ color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>{r.count}</span>
            </div>
            <div style={{ height: 5, background: '#f0f3f1', borderRadius: 2.5 }}>
              <div style={{ height: '100%', width: pct + '%', background: '#005840', borderRadius: 2.5 }}/>
            </div>
            <div style={{ fontSize: 10, color: '#A5B2AD', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
              ★ {r.top}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CohortHeatmap() {
  const cohorts = ['2010+', '2007–09', '2004–06', '2001–03', '1998–00', '<1998'];
  const stages = STG_S.slice().reverse();
  // Simple distribution: bias junior toward young cohorts, PGA toward old
  const cell = (ci, si) => {
    // ci low = young; si high index = senior stage in reversed array
    const sIdx = stages[si].id; // 1..6
    const youngBias = Math.max(0, 6 - ci);
    const seniorBias = sIdx;
    let v = (youngBias <= 2 && seniorBias <= 2) ? 40 + Math.random()*15 :
            (youngBias >= 4 && seniorBias <= 2) ? 25 + Math.random()*10 :
            (youngBias <= 2 && seniorBias >= 4) ? 0 :
            Math.max(0, 20 - Math.abs(youngBias - seniorBias)*4) + Math.random()*8;
    return Math.round(v);
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 4 }}>
      <div></div>
      {stages.map(s => (
        <div key={s.id} style={{ fontSize: 11, color: '#A5B2AD', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{s.short}</div>
      ))}
      {cohorts.map((c, ci) => (
        <React.Fragment key={c}>
          <div style={{ fontSize: 11, color: '#324D45', textAlign: 'right', alignSelf: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{c}</div>
          {stages.map((s, si) => {
            const v = cell(ci, si);
            const intensity = Math.min(1, v / 50);
            return (
              <div key={s.id} style={{
                height: 36, borderRadius: 4,
                background: v === 0 ? '#f4f7f5' : `rgba(0, 88, 64, ${0.1 + intensity * 0.85})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: intensity > 0.5 ? 'white' : '#324D45',
                fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
              }}>{v || ''}</div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FULL PLAYER PROFILE PAGE
   ═══════════════════════════════════════════════════════ */
function FullPlayerProfile({ player, onBack, onPlayer }) {
  const stage = STG_S.find(s => s.id === player.stage);
  const [tab, setTab] = useStateS('overview');
  const hasSG = player.hasSG;

  // Derived demo data
  const yearly = [
    { year: 2021, sg: -0.3, rounds: 32, avg: 73.4, best: 67, score: 'Junior' },
    { year: 2022, sg: -0.05, rounds: 41, avg: 72.1, best: 65, score: 'Junior/Elite' },
    { year: 2023, sg: 0.34, rounds: 58, avg: 71.0, best: 64, score: 'Elite' },
    { year: 2024, sg: 0.62, rounds: 64, avg: 70.4, best: 63, score: 'College fr.' },
    { year: 2025, sg: 0.91, rounds: 71, avg: 69.8, best: 62, score: 'College so.' },
    { year: 2026, sg: player.hasSG ? player.sg : 0, rounds: 28, avg: player.avgScore || 69.4, best: 62, score: 'College jr.' },
  ];

  const recent = [
    { date: '14.04.26', tournament: 'Pac-12 Championship', course: 'Pasatiempo GC',  pos: 4,  total: 285, par: -7, sg: 1.42, src: 'NCAA' },
    { date: '01.04.26', tournament: 'The Goodwin',         course: 'Stanford GC',     pos: 11, total: 213, par: -3, sg: 0.89, src: 'NCAA' },
    { date: '15.03.26', tournament: 'Hayt Collegiate',     course: 'Sawgrass CC',     pos: 18, total: 220, par: +4, sg: -0.12, src: 'NCAA' },
    { date: '02.03.26', tournament: 'Cabo Collegiate',     course: 'Diamante DC',     pos: 7,  total: 207, par: -9, sg: 1.18, src: 'NCAA' },
    { date: '12.02.26', tournament: 'ASU Thunderbird',     course: 'Papago GC',       pos: 2,  total: 204, par: -12,sg: 1.84, src: 'NCAA' },
    { date: '24.01.26', tournament: 'Farmers Insurance Am.',course: 'Torrey Pines',   pos: 32, total: 219, par: +3, sg: -0.34, src: 'WAGR' },
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#A5B2AD' }}>
        <button onClick={onBack} style={crumb}>Pipeline</button>
        <span>/</span>
        <button onClick={onBack} style={crumb}>{stage.name}</button>
        <span>/</span>
        <span style={{ color: '#324D45', fontWeight: 500 }}>{player.name}</span>
        <span style={{ flex: 1 }} />
        <button style={btn}><IconS name="download" size={12}/> PDF-mappe</button>
        <button style={btn}>Del med team</button>
      </div>

      {/* Hero */}
      <Card pad={0} style={{
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top right, rgba(209,248,67,0.15), transparent 50%), linear-gradient(180deg, #0d6b51, #0D2E23)',
        color: 'white', border: 'none',
      }}>
        <div style={{ padding: '28px 28px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
          <div>
            <Eyebrow style={{ color: '#D1F843' }}>SPILLERLOGG · {stage.name.toUpperCase()}</Eyebrow>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', marginTop: 14 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: '2px solid #D1F843',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 22,
              }}>{player.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
              <div>
                <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {player.name}
                </h1>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>
                  {player.age} år · f. {player.born} · {player.club} · {player.region}
                </div>
              </div>
            </div>

            {/* Pill stats */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {(hasSG ? [
                { label: 'WAGR', value: '#' + player.wagr, delta: -player.wagrDelta },
                { label: 'SG vs ' + stage.short, value: fmtS.sg(player.sg), delta: player.sgDelta },
                { label: 'TRINN', value: player.stage + '/6' },
                { label: 'DG-skill', value: '+1,4' },
                { label: 'Talent-score', value: '87' },
              ] : [
                { label: 'NORSK RANK', value: '#' + (player.norskRank || '—'), delta: player.norskRankDelta },
                { label: 'SNITT BRUTTO', value: (player.avgScore || 72.4).toFixed(1).replace('.', ',') },
                { label: 'TIL PAR', value: (player.toPar > 0 ? '+' : '') + (player.toPar || 0.4).toFixed(1).replace('.', ',') },
                { label: 'TRINN', value: player.stage + '/6' },
                { label: 'Talent-score', value: '74' },
              ]).map(s => (
                <div key={s.label} style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    {s.value}
                    {s.delta !== undefined && (
                      <span style={{ fontSize: 11, color: s.delta >= 0 ? '#D1F843' : '#FFAB91', marginLeft: 6 }}>
                        {s.delta >= 0 ? '↑' : '↓'} {Math.abs(s.delta).toFixed(s.delta % 1 === 0 ? 0 : 2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline rail vertical */}
          <div style={{ minWidth: 200 }}>
            <Eyebrow style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>PIPELINE</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STG_S.slice().reverse().map(s => {
                const passed = s.id < player.stage;
                const current = s.id === player.stage;
                return (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 10px', borderRadius: 6,
                    background: current ? 'rgba(209,248,67,0.15)' : 'transparent',
                    border: '1px solid ' + (current ? 'rgba(209,248,67,0.4)' : 'transparent'),
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: current ? '#D1F843' : passed ? '#0d6b51' : 'rgba(255,255,255,0.1)',
                      border: '1.5px solid ' + (current ? '#D1F843' : passed ? '#D1F843' : 'rgba(255,255,255,0.3)'),
                    }}/>
                    <span style={{
                      fontSize: 12, color: current ? '#D1F843' : passed ? 'white' : 'rgba(255,255,255,0.5)',
                      fontWeight: current ? 600 : 400, flex: 1,
                    }}>{s.name}</span>
                    {current && <span style={{ fontSize: 10, color: '#D1F843', fontFamily: 'JetBrains Mono, monospace' }}>NÅ</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', padding: '0 14px' }}>
          {(hasSG ? ['overview', 'sg', 'results', 'progression', 'about'] : ['overview', 'results', 'progression', 'about']).map(t => {
            const labels = { overview: 'Oversikt', sg: 'Strokes Gained', results: 'Resultater', progression: 'Progresjon', about: 'Spillerinfo' };
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t ? '#D1F843' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: tab === t ? 600 : 500,
                borderBottom: tab === t ? '2px solid #D1F843' : '2px solid transparent',
                marginBottom: -1,
              }}>{labels[t]}</button>
            );
          })}
        </div>
      </Card>

      {tab === 'overview' && <OverviewTab player={player} stage={stage} yearly={yearly} recent={recent} onPlayer={onPlayer} />}
      {tab === 'sg' && (player.hasSG
        ? <DgSgTabS player={player} />
        : <SgTab player={player} />)}
      {tab === 'results' && <ResultsTab recent={recent} />}
      {tab === 'progression' && <ProgressionTab yearly={yearly} />}
      {tab === 'about' && <AboutTab player={player} />}
    </div>
  );
}

/* ─── OVERVIEW TAB ─────────────────────────────────────── */
function OverviewTab({ player, stage, yearly, recent, onPlayer }) {
  const hasSG = player.hasSG;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {hasSG ? (
        <Card>
          <Eyebrow style={{ marginBottom: 14 }}>STROKES GAINED · 2026</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
            <SgDS value={player.sg} vsRef={stage.short} size="lg" />
            <span style={{ fontSize: 11, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>
              Δ ifjor {fmtS.sg(player.sgDelta)}
            </span>
            <SrcBS src="DG" />
            <span style={{ flex: 1 }}/>
            <span style={{ fontSize: 11, color: '#A5B2AD' }}>n=64 runder</span>
          </div>
          <SgRowF label="Putting"      value={player.putt} />
          <SgRowF label="Approach"     value={player.app} />
          <SgRowF label="Tee-to-green" value={player.tee} />
          <SgRowF label="Around-green" value={player.around} />
        </Card>
        ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Eyebrow>SCORE-PROFIL · 2026</Eyebrow>
            <span style={{ fontSize: 10, color: '#9C7A2E', fontFamily: 'JetBrains Mono, monospace',
              background: '#FFF6E0', padding: '3px 7px', borderRadius: 4, border: '1px solid #F0D584' }}>
              INGEN SG-DATA · NGF-resultater
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { l: 'Snitt brutto', v: (player.avgScore || 72.4).toFixed(1).replace('.',','), sub: '24 runder' },
              { l: 'Til par',      v: ((player.toPar || 0.4) > 0 ? '+' : '') + (player.toPar || 0.4).toFixed(1).replace('.', ','), sub: 'snitt' },
              { l: 'Best brutto',  v: (player.bestScore || 67), sub: 'sesong' },
              { l: 'Vs felt',      v: ((player.scoreVsField || -0.8) > 0 ? '+' : '−') + Math.abs(player.scoreVsField || -0.8).toFixed(1).replace('.',','), sub: 'snitt slag' },
            ].map(m => (
              <div key={m.l} style={{ padding: 12, background: '#f4f7f5', borderRadius: 8 }}>
                <div style={{ fontSize: 9.5, color: '#A5B2AD', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>{m.l.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#324D45', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{m.v}</div>
                <div style={{ fontSize: 10, color: '#A5B2AD', marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 12, background: 'linear-gradient(135deg, #fff8e0, #fef0c8)',
            border: '1px solid #F0D584', borderRadius: 8, fontSize: 11.5, color: '#5b4a1f', lineHeight: 1.5 }}>
            <b>Hvorfor ikke SG?</b> Spilleren har ennå ikke spilt på baner med shotlink/DG-dekning.
            Score relativt til feltet brukes som proxy. Anbefales: rekrutter til turnering med SG-måling for fullt bilde.
          </div>
        </Card>
        )}

        {/* Trend chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Eyebrow>{hasSG ? 'SG-UTVIKLING · 6 SESONGER' : 'SCORE-UTVIKLING · 6 SESONGER'}</Eyebrow>
            <span style={{ fontSize: 11, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>{hasSG ? 'vs PGA-snitt' : 'snitt brutto'}</span>
          </div>
          <TrendChart yearly={yearly} hasSG={hasSG} />
        </Card>

        {/* Recent results */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Eyebrow>SISTE RESULTATER</Eyebrow>
            <span style={{ fontSize: 11, color: '#A5B2AD' }}>{recent.length} av 28 i sesongen</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 10, color: '#A5B2AD', textAlign: 'left', letterSpacing: '0.1em' }}>
                <th style={th}>DATO</th>
                <th style={th}>TURNERING</th>
                <th style={{ ...th, textAlign: 'right' }}>POS</th>
                <th style={{ ...th, textAlign: 'right' }}>TOTAL</th>
                <th style={{ ...th, textAlign: 'right' }}>SG</th>
                <th style={{ ...th, textAlign: 'right' }}>KILDE</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f3f1' }}>
                  <td style={td}>{r.date}</td>
                  <td style={{ ...td, color: '#324D45', fontWeight: 500 }}>
                    {r.tournament}
                    <div style={{ fontSize: 10.5, color: '#A5B2AD', marginTop: 2 }}>{r.course}</div>
                  </td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>
                    {r.pos <= 3 && <IconS name="star" size={10} color="#D1F843" />} {r.pos}.
                  </td>
                  <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>
                    {r.total} <span style={{ color: r.par < 0 ? '#005840' : '#B84233' }}>({r.par > 0 ? '+' : ''}{r.par})</span>
                  </td>
                  <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                    color: hasSG && r.sg >= 0 ? '#005840' : hasSG ? '#B84233' : '#A5B2AD' }}>
                    {hasSG ? fmtS.sg(r.sg) : '—'}
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}><SrcBS src={r.src} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Right rail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ background: 'linear-gradient(135deg, #005840, #0d6b51)', color: 'white', border: 'none' }}>
          <Eyebrow style={{ color: '#D1F843' }}>ML-VURDERING</Eyebrow>
          <div style={{ fontSize: 22, fontWeight: 700, margin: '8px 0 6px', lineHeight: 1.2 }}>
            {hasSG ? 'Klar for opprykk' : 'Trenger SG-data'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
            {hasSG
              ? `Passerer 4 av 5 benchmarks for trinn ${player.stage + 1}. Sterk på putting; snitter +1,24 SG over 28 runder.`
              : `Score-data tyder på solid utvikling, men ML-modell krever SG-runder for å vurdere opprykk. Foreslår rekruttering til turnering med shotlink.`}
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace' }}>BENCHMARKS</div>
            {(hasSG ? [
              { l: 'SG vs trinn-ref ≥ +0,6', ok: true, v: '+1,24' },
              { l: 'Min. 30 SG-runder',       ok: true, v: '64' },
              { l: 'WAGR < #200',             ok: true, v: '#147' },
              { l: 'Putting ≥ +0,3',          ok: true, v: '+0,42' },
              { l: 'Tee-to-green ≥ +0,5',     ok: false, v: '+0,36' },
            ] : [
              { l: 'Snitt brutto < 73',       ok: true,  v: (player.avgScore || 72.4).toFixed(1).replace('.',',') },
              { l: 'Min. 20 turn.runder',     ok: true,  v: '24' },
              { l: 'Norsk rank topp 50',      ok: true,  v: '#' + (player.norskRank || 32) },
              { l: 'SG-runder ≥ 30',          ok: false, v: '0' },
              { l: 'Vs felt < −1,0',          ok: false, v: ((player.scoreVsField || -0.8)).toFixed(1).replace('.',',') },
            ]).map(b => (
              <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12 }}>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: b.ok ? '#D1F843' : 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#0D2E23', fontWeight: 800,
                }}>{b.ok ? '✓' : ''}</span>
                <span style={{ flex: 1, color: 'rgba(255,255,255,0.9)' }}>{b.l}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: b.ok ? '#D1F843' : 'rgba(255,255,255,0.6)' }}>{b.v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Eyebrow style={{ marginBottom: 12 }}>LIKER & ULIKER</Eyebrow>
          <div style={{ fontSize: 11, color: '#A5B2AD', marginBottom: 10 }}>{hasSG ? 'Spillere på samme trinn med liknende SG-profil' : 'Andre spillere på samme trinn'}</div>
          {PLY_S.filter(p => p.stage === player.stage && p.id !== player.id).slice(0, 3).map(p => (
            <button key={p.id} onClick={() => onPlayer(p)} style={peerRow}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#e0e8e5',
                color: '#324D45', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{p.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#324D45' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#A5B2AD' }}>{p.club}</div>
              </div>
              <span style={{
                fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                color: p.hasSG ? (p.sg >= 0 ? '#005840' : '#B84233') : '#A5B2AD',
              }}>{p.hasSG ? fmtS.sg(p.sg) : '—'}</span>
            </button>
          ))}
        </Card>

        <Card>
          <Eyebrow style={{ marginBottom: 12 }}>NESTE KAMP</Eyebrow>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#324D45' }}>NCAA Regional · Tucson</div>
          <div style={{ fontSize: 11, color: '#A5B2AD', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            13.05.2026 · Tucson National GC · 54 hull
          </div>
          <div style={{ marginTop: 12, padding: 10, background: '#f4f7f5', borderRadius: 8, fontSize: 12, color: '#5b6e67' }}>
            Banens vanskelighetsgrad: <b style={{ color: '#324D45' }}>+1,8</b> over PGA-snitt. Krever stabil tee-to-green.
          </div>
        </Card>
      </div>
    </div>
  );
}

function SgRowF({ label, value }) {
  const max = 1.0;
  const w = Math.min(100, Math.abs(value) / max * 100);
  const positive = value >= 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: '#324D45', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: positive ? '#005840' : '#B84233' }}>{fmtS.sg(value)}</span>
      </div>
      <div style={{ height: 6, background: '#f0f3f1', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: positive ? '50%' : 'auto', right: positive ? 'auto' : '50%',
          top: 0, bottom: 0, width: w / 2 + '%',
          background: positive ? 'linear-gradient(90deg, #005840, #D1F843)' : 'linear-gradient(90deg, #B84233, #E8A199)',
          borderRadius: 3,
        }}/>
        <div style={{ position: 'absolute', left: '50%', top: -1, bottom: -1, width: 1, background: '#A5B2AD' }}/>
      </div>
    </div>
  );
}

function TrendChart({ yearly, hasSG = true }) {
  const W = 520, H = 180, PAD = 28;
  const max = hasSG ? 1.5 : 76, min = hasSG ? -0.5 : 68;
  const accessor = hasSG ? (d => d.sg) : (d => d.avg);
  const x = i => PAD + i * (W - PAD * 2) / (yearly.length - 1);
  const y = v => PAD + (1 - (v - min) / (max - min)) * (H - PAD * 2);
  const path = yearly.map((d, i) => (i === 0 ? 'M' : 'L') + x(i) + ',' + y(accessor(d))).join(' ');
  const baseline = hasSG ? 0 : 72;
  const area = path + ' L' + x(yearly.length - 1) + ',' + y(baseline) + ' L' + x(0) + ',' + y(baseline) + ' Z';
  const ticks = hasSG ? [-0.5, 0, 0.5, 1.0, 1.5] : [68, 70, 72, 74, 76];
  const fmtTick = v => hasSG ? (v >= 0 ? '+' : '') + v.toFixed(1).replace('.', ',') : v.toString();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200 }}>
      {/* y grid */}
      {ticks.map(v => (
        <g key={v}>
          <line x1={PAD} y1={y(v)} x2={W-PAD} y2={y(v)} stroke="#f0f3f1" strokeWidth="1" />
          <text x={PAD-6} y={y(v)+3} fontSize="9" fill="#A5B2AD" textAnchor="end" fontFamily="JetBrains Mono">
            {fmtTick(v)}
          </text>
        </g>
      ))}
      {/* baseline emphasized */}
      <line x1={PAD} y1={y(baseline)} x2={W-PAD} y2={y(baseline)} stroke="#A5B2AD" strokeWidth="1" strokeDasharray="2 2"/>
      {/* area + line */}
      <path d={area} fill="rgba(0,88,64,0.08)" />
      <path d={path} stroke="#005840" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* points */}
      {yearly.map((d, i) => (
        <g key={d.year}>
          <circle cx={x(i)} cy={y(accessor(d))} r="3.5" fill="#D1F843" stroke="#005840" strokeWidth="1.5"/>
          <text x={x(i)} y={H-8} fontSize="10" fill="#A5B2AD" textAnchor="middle" fontFamily="JetBrains Mono">{d.year}</text>
        </g>
      ))}
      {/* label last */}
      <text x={x(yearly.length-1)} y={y(accessor(yearly[yearly.length-1]))-10}
        fontSize="11" fill="#005840" textAnchor="end" fontWeight="700" fontFamily="JetBrains Mono">
        {hasSG ? fmtS.sg(yearly[yearly.length-1].sg) : yearly[yearly.length-1].avg.toFixed(1).replace('.', ',')}
      </text>
    </svg>
  );
}

/* ─── SG TAB ───────────────────────────────────────────── */
function SgTab({ player }) {
  const cats = [
    { key: 'putt',   label: 'Putting',     v: player.putt,   ref: 0.20, peer: 0.32, runs: '+0,02' },
    { key: 'app',    label: 'Approach',    v: player.app,    ref: 0.25, peer: 0.18, runs: '−0,04' },
    { key: 'tee',    label: 'Tee-to-green',v: player.tee,    ref: 0.30, peer: 0.22, runs: '+0,12' },
    { key: 'around', label: 'Around-green',v: player.around, ref: 0.10, peer: 0.08, runs: '−0,01' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <Eyebrow style={{ marginBottom: 14 }}>SG-PROFIL · RADAR</Eyebrow>
        <Radar player={player} />
        <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11, color: '#5b6e67' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 2, background: '#005840', verticalAlign: 'middle', marginRight: 4 }}/>Spiller</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 2, background: '#A5B2AD', borderTop: '2px dashed #A5B2AD', verticalAlign: 'middle', marginRight: 4 }}/>Trinn-ref</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 2, background: '#D1F843', verticalAlign: 'middle', marginRight: 4 }}/>Topp-peer</span>
        </div>
      </Card>

      <Card>
        <Eyebrow style={{ marginBottom: 14 }}>KOMPONENT-DETALJ</Eyebrow>
        {cats.map(c => (
          <div key={c.key} style={{ padding: '12px 0', borderBottom: '1px solid #f0f3f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#324D45' }}>{c.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: c.v >= 0 ? '#005840' : '#B84233', fontFamily: 'JetBrains Mono, monospace' }}>
                {fmtS.sg(c.v)}
              </span>
            </div>
            <div style={{ height: 5, background: '#f0f3f1', borderRadius: 2.5, marginBottom: 6, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '50%', top: -1, bottom: -1, width: 1, background: '#A5B2AD' }}/>
              <div style={{
                height: '100%', width: Math.min(50, Math.abs(c.v) * 50) + '%',
                marginLeft: c.v >= 0 ? '50%' : `${50 - Math.min(50, Math.abs(c.v) * 50)}%`,
                background: c.v >= 0 ? '#005840' : '#B84233', borderRadius: 2.5,
              }}/>
              {/* peer marker */}
              <div style={{
                position: 'absolute', left: `${50 + c.peer * 50}%`, top: -3, width: 2, height: 11,
                background: '#D1F843',
              }} title="Topp-peer"/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#A5B2AD', fontFamily: 'JetBrains Mono, monospace' }}>
              <span>Trinn-ref {fmtS.sg(c.ref)}</span>
              <span>Topp-peer {fmtS.sg(c.peer)}</span>
              <span>Δ siste 8 runder {c.runs}</span>
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ gridColumn: '1 / -1' }}>
        <Eyebrow style={{ marginBottom: 14 }}>PER-RUNDE SG · SISTE 30 RUNDER</Eyebrow>
        <SgBars />
      </Card>
    </div>
  );
}

function Radar({ player }) {
  const cats = ['Putt', 'App', 'Tee', 'Around'];
  const vals = [player.putt, player.app, player.tee, player.around];
  const ref  = [0.20, 0.25, 0.30, 0.10];
  const peer = [0.32, 0.18, 0.22, 0.08];
  const cx = 130, cy = 130, R = 90;
  const poly = (arr) => arr.map((v, i) => {
    const a = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
    const r = Math.max(10, Math.min(R, R * (v + 0.3) / 1.3));
    return (cx + Math.cos(a) * r) + ',' + (cy + Math.sin(a) * r);
  }).join(' ');
  return (
    <svg viewBox="0 0 260 260" style={{ width: '100%', maxHeight: 260 }}>
      {[0.25, 0.5, 0.75, 1].map(t => (
        <polygon key={t} points={cats.map((_, i) => {
          const a = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
          return (cx + Math.cos(a) * R * t) + ',' + (cy + Math.sin(a) * R * t);
        }).join(' ')} fill="none" stroke="#f0f3f1" strokeWidth="1" />
      ))}
      <polygon points={poly(ref)} fill="none" stroke="#A5B2AD" strokeDasharray="3 3" strokeWidth="1.5"/>
      <polygon points={poly(peer)} fill="rgba(209,248,67,0.1)" stroke="#D1F843" strokeWidth="1.5"/>
      <polygon points={poly(vals)} fill="rgba(0,88,64,0.18)" stroke="#005840" strokeWidth="2"/>
      {cats.map((c, i) => {
        const a = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <text key={c} x={cx + Math.cos(a) * (R + 18)} y={cy + Math.sin(a) * (R + 18) + 4}
            fontSize="11" fill="#324D45" textAnchor="middle" fontWeight="600">{c}</text>
        );
      })}
    </svg>
  );
}

function SgBars() {
  const data = Array.from({ length: 30 }).map(() => (Math.random() - 0.35) * 2.5);
  const max = Math.max(...data.map(Math.abs));
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 100, gap: 3, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: '#A5B2AD' }}/>
      {data.map((v, i) => {
        const h = Math.abs(v) / max * 45;
        return (
          <div key={i} style={{
            flex: 1, height: h + '%',
            alignSelf: v >= 0 ? 'flex-end' : 'flex-start',
            marginTop: v >= 0 ? 50 - h + '%' : '50%',
            marginBottom: v < 0 ? 50 - h + '%' : '50%',
            background: v >= 0 ? '#005840' : '#B84233',
            borderRadius: 1,
          }}/>
        );
      })}
    </div>
  );
}

/* ─── RESULTS TAB ──────────────────────────────────────── */
function ResultsTab({ recent }) {
  const all = [...recent, ...recent.map(r => ({ ...r, date: r.date.replace('26', '25') }))];
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <Eyebrow>ALLE RESULTATER · 28 i 2026 · 71 i 2025</Eyebrow>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Alle', 'NCAA', 'WAGR', 'Norge'].map((f, i) => (
            <button key={f} style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 11,
              border: '1px solid #e0e8e5', background: i === 0 ? '#005840' : '#FFF',
              color: i === 0 ? '#FFF' : '#324D45', cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ fontSize: 10, color: '#A5B2AD', textAlign: 'left', letterSpacing: '0.1em' }}>
            <th style={th}>DATO</th>
            <th style={th}>TURNERING / BANE</th>
            <th style={{ ...th, textAlign: 'right' }}>POS</th>
            <th style={{ ...th, textAlign: 'right' }}>R1 / R2 / R3 / R4</th>
            <th style={{ ...th, textAlign: 'right' }}>TOTAL</th>
            <th style={{ ...th, textAlign: 'right' }}>SG</th>
            <th style={{ ...th, textAlign: 'right' }}>FELT</th>
            <th style={{ ...th, textAlign: 'right' }}>KILDE</th>
          </tr>
        </thead>
        <tbody>
          {all.slice(0, 10).map((r, i) => {
            const r1 = 70 + Math.floor(Math.random()*8 - 4);
            const r2 = 70 + Math.floor(Math.random()*8 - 4);
            const r3 = 70 + Math.floor(Math.random()*8 - 4);
            const r4 = r.total - r1 - r2 - r3;
            return (
              <tr key={i} style={{ borderTop: '1px solid #f0f3f1' }}>
                <td style={td}>{r.date}</td>
                <td style={{ ...td, color: '#324D45', fontWeight: 500 }}>
                  {r.tournament}
                  <div style={{ fontSize: 10.5, color: '#A5B2AD', marginTop: 2 }}>{r.course}</div>
                </td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>
                  {r.pos <= 3 && <IconS name="star" size={10} color="#D1F843" />} {r.pos}.
                </td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#5b6e67' }}>
                  {r1} · {r2} · {r3} · {r4 > 0 ? r4 : '—'}
                </td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {r.total} <span style={{ color: r.par < 0 ? '#005840' : '#B84233' }}>({r.par > 0 ? '+' : ''}{r.par})</span>
                </td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                  color: r.sg >= 0 ? '#005840' : '#B84233' }}>{fmtS.sg(r.sg)}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#A5B2AD' }}>
                  {72 + Math.floor(Math.random()*40)}
                </td>
                <td style={{ ...td, textAlign: 'right' }}><SrcBS src={r.src} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* ─── PROGRESSION TAB ──────────────────────────────────── */
function ProgressionTab({ yearly }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
      <Card>
        <Eyebrow style={{ marginBottom: 14 }}>TIDSAKSE</Eyebrow>
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: '#e0e8e5' }}/>
          {TML_S.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 18 }}>
              <div style={{
                position: 'absolute', left: -23, top: 6, width: 12, height: 12, borderRadius: '50%',
                background: e.kind === 'promotion' ? '#D1F843' : e.kind === 'now' ? '#FFF' : '#e0e8e5',
                border: '2px solid ' + (e.kind === 'promotion' ? '#005840' : e.kind === 'now' ? '#005840' : '#FFF'),
                boxShadow: e.kind === 'promotion' ? '0 0 12px rgba(209,248,67,0.4)' : 'none',
              }} />
              <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#324D45', minWidth: 44 }}>{e.year}</span>
                <span style={{ fontSize: 13, color: e.kind === 'promotion' ? '#005840' : '#324D45', fontWeight: 600 }}>{e.title}</span>
              </div>
              <div style={{ fontSize: 12, color: '#A5B2AD', marginTop: 3, marginLeft: 58 }}>{e.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow style={{ marginBottom: 14 }}>ÅRLIG SAMMENDRAG</Eyebrow>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: 10, color: '#A5B2AD', textAlign: 'left', letterSpacing: '0.1em' }}>
              <th style={th}>ÅR</th>
              <th style={{ ...th, textAlign: 'right' }}>RND</th>
              <th style={{ ...th, textAlign: 'right' }}>SNITT</th>
              <th style={{ ...th, textAlign: 'right' }}>BEST</th>
              <th style={{ ...th, textAlign: 'right' }}>SG</th>
            </tr>
          </thead>
          <tbody>
            {yearly.slice().reverse().map(y => (
              <tr key={y.year} style={{ borderTop: '1px solid #f0f3f1' }}>
                <td style={{ ...td, fontWeight: 600 }}>{y.year}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{y.rounds}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{y.avg.toString().replace('.', ',')}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#005840', fontWeight: 600 }}>{y.best}</td>
                <td style={{ ...td, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                  color: y.sg >= 0 ? '#005840' : '#B84233' }}>{fmtS.sg(y.sg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ─── ABOUT TAB ────────────────────────────────────────── */
function AboutTab({ player }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <Card>
        <Eyebrow style={{ marginBottom: 12 }}>SPILLERINFO</Eyebrow>
        <InfoRow k="Født" v={player.born + ' (' + player.age + ' år)'} />
        <InfoRow k="Klubb" v={player.club} />
        <InfoRow k="Region" v={player.region} />
        <InfoRow k="Trinn" v={player.stage + '/6'} />
        <InfoRow k="Klasser" v="Junior, Elite, College" />
      </Card>
      <Card>
        <Eyebrow style={{ marginBottom: 12 }}>KILDER MED DATA</Eyebrow>
        <InfoRow k="DataGolf" v="142 runder" />
        <InfoRow k="WAGR" v="58 turneringer" />
        <InfoRow k="NCAA / Clippd" v="64 runder" />
        <InfoRow k="Srixon Tour" v="32 starter" />
        <InfoRow k="OLYO Region Øst" v="14 starter (2018–2021)" />
      </Card>
      <Card>
        <Eyebrow style={{ marginBottom: 12 }}>NOTATER</Eyebrow>
        <div style={{ fontSize: 12, color: '#5b6e67', lineHeight: 1.6 }}>
          Sterk progresjon siste 18 mnd. ML-modell flagger som <b style={{ color: '#005840' }}>Klar for opprykk</b> til Trinn 4. Trener: P. Olsen. Coach-samtale 02.05.
        </div>
        <button style={{ ...btn, marginTop: 12, width: '100%' }}>+ Legg til notat</button>
      </Card>
    </div>
  );
}

const InfoRow = ({ k, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f3f1', fontSize: 12 }}>
    <span style={{ color: '#A5B2AD' }}>{k}</span>
    <span style={{ color: '#324D45', fontWeight: 500 }}>{v}</span>
  </div>
);

/* ─── styles ───────────────────────────────────────────── */
const btn = {
  height: 32, padding: '0 14px', borderRadius: 8,
  background: '#FFF', border: '1px solid #e0e8e5',
  color: '#324D45', fontSize: 12, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};
const crumb = {
  background: 'transparent', border: 'none', color: '#A5B2AD',
  fontSize: 12, cursor: 'pointer', padding: 0,
};
const th = { padding: '8px 10px', fontWeight: 500, fontSize: 10 };
const td = { padding: '12px 10px', fontSize: 12, color: '#5b6e67' };
const moverRow = (last) => ({
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '8px 0', width: '100%', cursor: 'pointer',
  background: 'transparent', border: 'none',
  borderBottom: last ? 'none' : '1px solid #f0f3f1',
});
const readyRow = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '10px 8px', width: '100%', cursor: 'pointer',
  background: 'transparent', border: 'none', borderRadius: 8,
  borderBottom: '1px solid #f0f3f1',
};
const peerRow = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 0', width: '100%', cursor: 'pointer',
  background: 'transparent', border: 'none',
  borderBottom: '1px solid #f0f3f1',
};

window.PIPELINE_SCREENS = { DashboardView, FullPlayerProfile };
