// Views: Pipeline kanban, Player profile, Bench compare

const { useState: useStateV, useMemo: useMemoV, useEffect: useEffectV } = React;
const { Icon: IconV, fmt: fmtV, PipelineRail: PRail, SgDelta: SgD, SourceBadge: SrcB } = window.PIPELINE_UI;
const { STAGES: STG, PLAYERS: PLY, TIMELINE: TML } = window.PIPELINE_DATA;

/* ─── PIPELINE KANBAN ──────────────────────────────────── */
function PipelineView({ tweaks, onPlayer }) {
  const [activeStage, setActiveStage] = useStateV(3);

  const filteredPlayers = useMemoV(() => {
    let p = PLY;
    if (tweaks.kohort === '2004-2006') p = p.filter(x => x.born >= 2004 && x.born <= 2006);
    else if (tweaks.kohort === '2007-2009') p = p.filter(x => x.born >= 2007 && x.born <= 2009);
    else if (tweaks.kohort === '2010+') p = p.filter(x => x.born >= 2010);
    if (tweaks.showReadyOnly) p = p.filter(x => x.ready);
    return p;
  }, [tweaks.kohort, tweaks.showReadyOnly]);

  const playersAtStage = useMemoV(() => filteredPlayers.filter(p => p.stage === activeStage), [filteredPlayers, activeStage]);
  const stage = STG.find(s => s.id === activeStage);
  const readyCount = filteredPlayers.filter(p => p.stage === activeStage && p.ready).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '24px 32px' }}>
      {/* Stage rail */}
      <div>
        <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          UTVIKLINGSSTIGE
        </div>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 11, top: 14, bottom: 14, width: 2,
            background: '#e0e8e5',
          }} />
          {STG.map((s, i) => {
            const isActive = s.id === activeStage;
            const stageCount = filteredPlayers.filter(p => p.stage === s.id).length;
            return (
              <button key={s.id} onClick={() => setActiveStage(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '10px 12px', marginBottom: 4,
                  background: isActive ? '#E8F5EF' : 'transparent',
                  border: isActive ? '1.5px solid rgba(209,248,67,0.25)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 24px rgba(209,248,67,0.10)' : 'none',
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  position: 'relative', transition: 'all 150ms ease',
                }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: isActive ? '#D1F843' : '#FFFFFF',
                  border: '1.5px solid ' + (isActive ? '#D1F843' : '#e0e8e5'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, flexShrink: 0,
                  fontSize: 10, fontWeight: 700, color: isActive ? '#324D45' : '#A5B2AD',
                }}>{s.id}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: isActive ? '#324D45' : '#5b6e67', lineHeight: 1.2,
                  }}>{s.name}</div>
                </div>
                <div style={{
                  fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
                  color: isActive ? '#D1F843' : '#A5B2AD', fontWeight: 600,
                }}>{stageCount}</div>
              </button>
            );
          })}
        </div>

        {/* Stage summary */}
        <div style={{
          marginTop: 24, padding: 16, borderRadius: 12,
          background: '#FFFFFF', border: '1px solid #1a4a3a',
        }}>
          <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
            REFERANSE FOR {stage.short.toUpperCase()}
          </div>
          <div style={{ fontSize: 13, color: '#324D45', lineHeight: 1.45 }}>
            Alle SG-tall vises som delta mot <b style={{ color: '#D1F843' }}>{stage.ref}</b>.
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' }}>
              TRINN {stage.id}
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: '#324D45', margin: '4px 0 0',
              letterSpacing: '-0.02em', lineHeight: 1,
            }}>{stage.name} <span style={{ color: '#A5B2AD', fontWeight: 500 }}>· {playersAtStage.length}</span></h1>
          </div>
          {tweaks.showAlgoFlags && readyCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg, #005840, #0d6b51)',
              border: '1.5px solid rgba(209,248,67,0.3)',
            }}>
              <Icon name="sparkle" size={14} color="#D1F843" />
              <div>
                <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>
                  {readyCount} {readyCount === 1 ? 'spiller klar' : 'spillere klare'} for opprykk
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>benchmarks passert · ML-flagg</div>
              </div>
              <Icon name="arrowR" size={14} color="#D1F843" />
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(' + (tweaks.compactCards ? 220 : 280) + 'px, 1fr))',
          gap: 14,
        }}>
          {playersAtStage.map(p => (
            <PlayerCard key={p.id} player={p} stage={stage}
              compact={tweaks.compactCards}
              onClick={() => onPlayer(p)} />
          ))}
          {playersAtStage.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', padding: 40, textAlign: 'center',
              color: 'rgba(255,255,255,0.7)', fontSize: 13,
            }}>Ingen spillere matcher filtrene</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, stage, compact, onClick }) {
  const isReady = player.ready;
  return (
    <button onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: isReady ? '#E8F5EF' : '#FFFFFF',
        border: '1.5px solid ' + (isReady ? 'rgba(209,248,67,0.25)' : '#e0e8e5'),
        boxShadow: isReady ? '0 0 24px rgba(209,248,67,0.10)' : 'none',
        borderRadius: 14,
        padding: compact ? 14 : 18,
        display: 'flex', flexDirection: 'column', gap: compact ? 10 : 14,
        transition: 'all 150ms ease',
        color: 'inherit', font: 'inherit',
      }}
      onMouseEnter={e => { if (!isReady) e.currentTarget.style.background = '#E8F5EF'; }}
      onMouseLeave={e => { if (!isReady) e.currentTarget.style.background = '#FFFFFF'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#005840', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 600, fontSize: 11,
        }}>{player.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#324D45', lineHeight: 1.2 }}>
            {player.name}
          </div>
          <div style={{ fontSize: 11, color: '#A5B2AD', marginTop: 2 }}>
            {player.age} år · {player.club}
          </div>
        </div>
        {isReady && (
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'rgba(209,248,67,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="flag" size={11} color="#D1F843" />
          </div>
        )}
      </div>

      {/* Pipeline progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 9.5, color: '#A5B2AD', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace' }}>PIPELINE</span>
          <span style={{ fontSize: 10, color: '#5b6e67', fontFamily: 'JetBrains Mono, monospace' }}>{player.stage}/6</span>
        </div>
        <PRail progress={player.progress} />
      </div>

      {/* SG (proff) ELLER Score (norske amatører/junior) */}
      {player.hasSG ? (
        <div>
          <div style={{ fontSize: 9.5, color: '#A5B2AD', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
            STROKES GAINED
          </div>
          <SgD value={player.sg} vsRef={stage.short} size="md" />
          <div style={{ fontSize: 10, color: '#A5B2AD', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            delta {fmtV.sg(player.sgDelta)} fra ifjor
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 9.5, color: '#A5B2AD', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
            SNITT BRUTTO
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontFamily: 'JetBrains Mono, monospace' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#324D45', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {fmtV.score(player.avgScore)}
            </span>
            <span style={{ fontSize: 9.5, color: '#A5B2AD', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {fmtV.toPar(player.toPar)} til par
            </span>
          </span>
          <div style={{ fontSize: 10, color: '#A5B2AD', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            {player.scoreDelta !== undefined ? fmtV.scoreDelta(player.scoreDelta) + ' fra ifjor · ' : ''}{player.rounds || '—'} rnd
          </div>
        </div>
      )}

      {!compact && player.hasSG && (
        <div style={{ display: 'flex', gap: 14, paddingTop: 4, borderTop: '1px solid #f0f3f1' }}>
          <MiniStat label="WAGR" value={'#' + player.wagr} delta={player.wagrDelta} reverse />
          <MiniStat label="PUTT" value={fmtV.sg(player.putt)} positive={player.putt >= 0} />
          <MiniStat label="APP" value={fmtV.sg(player.app)} positive={player.app >= 0} />
        </div>
      )}
      {!compact && !player.hasSG && (
        <div style={{ display: 'flex', gap: 14, paddingTop: 4, borderTop: '1px solid #f0f3f1' }}>
          <MiniStat label="WAGR" value={'#' + player.wagr} delta={player.wagrDelta} reverse />
          <MiniStat label="BEST" value={player.bestScore} />
          <MiniStat label="VS FELT" value={fmtV.scoreDelta(player.scoreVsField || 0)} positive={(player.scoreVsField || 0) <= 0} />
        </div>
      )}
    </button>
  );
}

function MiniStat({ label, value, delta, reverse, positive }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: '#A5B2AD', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
      <div style={{ fontSize: 12, color: '#324D45', fontWeight: 600, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 9.5, color: (reverse ? -delta : delta) >= 0 ? '#D1F843' : '#B84233', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>
          {fmtV.delta(delta)}
        </div>
      )}
    </div>
  );
}

/* ─── PLAYER PROFILE OVERLAY ───────────────────────────── */
function PlayerProfile({ player, onClose }) {
  useEffectV(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!player) return null;
  const stage = STG.find(s => s.id === player.stage);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(50,77,69,0.35)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '40px 24px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 920,
        background: '#FFFFFF', borderRadius: 16, border: '1px solid #1a4a3a',
        overflow: 'hidden', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 2,
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.18)', color: 'white',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="x" size={16} /></button>

        {/* Hero header */}
        <div style={{
          padding: '32px 32px 28px',
          background: 'radial-gradient(ellipse at top right, rgba(209,248,67,0.12), transparent 50%), linear-gradient(180deg, #0d6b51, #0D2E23)',
          borderBottom: '1px solid #1a4a3a',
        }}>
          <div style={{ fontSize: 10, color: '#D1F843', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 12 }}>
            SPILLERLOGG · {stage.name.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 22, border: '2px solid #D1F843',
            }}>{player.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 36, fontWeight: 800, color: 'white', margin: 0,
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>{player.name}</h2>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>
                {player.age} år · {player.club} · WAGR <b style={{ color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>#{player.wagr}</b>
                <span style={{ color: player.wagrDelta < 0 ? '#D1F843' : '#B84233', marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>
                  {player.wagrDelta < 0 ? '↑' : player.wagrDelta > 0 ? '↓' : '→'} {Math.abs(player.wagrDelta)}
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>PIPELINE</div>
              <PRail progress={player.progress} size="lg" />
              <div style={{ fontSize: 11, color: '#D1F843', marginTop: 6, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                {player.stage}/6 · {stage.name}
              </div>
            </div>
          </div>
        </div>

        {/* SG breakdown */}
        <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 14 }}>
              STROKES GAINED · 2026
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <SgD value={player.sg} vsRef={stage.short} size="lg" />
              <span style={{ color: '#A5B2AD', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                Δ ifjor {fmtV.sg(player.sgDelta)}
              </span>
              <SrcB src="DG" />
            </div>
            <SgRow label="Putting"     value={player.putt}   max={Math.max(0.7, player.putt)} />
            <SgRow label="Approach"    value={player.app}    max={Math.max(0.7, player.app)} />
            <SgRow label="Tee-to-green" value={player.tee}    max={Math.max(0.7, player.tee)} />
            <SgRow label="Around-green" value={player.around} max={Math.max(0.7, player.around, 0.2)} />
          </div>

          {/* Career arc */}
          <div>
            <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 14 }}>
              KARRIEREBUE · SG vs PGA-SNITT
            </div>
            <CareerArc />
            <div style={{
              marginTop: 16, padding: 14, borderRadius: 10,
              background: '#F4F7F5', border: '1px solid #1a4a3a',
              fontSize: 12.5, color: '#5b6e67', lineHeight: 1.55,
            }}>
              <span style={{ color: '#D1F843', fontWeight: 600 }}>Sammendrag.</span> {player.name.split(' ')[0]} rykket opp fra Trinn {player.stage - 1} i {2026 - Math.floor(player.progress * 6)} etter sesonger med stigende SG. Sterk på <b style={{ color: '#324D45' }}>putting</b> og <b style={{ color: '#324D45' }}>approach</b>; svakere på <b style={{ color: '#324D45' }}>tee-to-green</b>.
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 32px 32px' }}>
          <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 14 }}>
            TIDSAKSE
          </div>
          <Timeline />
        </div>
      </div>
    </div>
  );
}

function SgRow({ label, value, max }) {
  const w = Math.min(100, Math.abs(value) / max * 100);
  const positive = value >= 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#324D45', fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: positive ? '#005840' : '#B84233',
        }}>{fmtV.sg(value)}</span>
      </div>
      <div style={{ height: 6, background: '#e0e8e5', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: positive ? '50%' : 'auto', right: positive ? 'auto' : '50%',
          top: 0, bottom: 0,
          width: w / 2 + '%',
          background: positive ? 'linear-gradient(90deg, #005840, #D1F843)' : 'linear-gradient(90deg, #B84233, #E8A199)',
          borderRadius: 3,
        }}/>
        <div style={{ position: 'absolute', left: '50%', top: -1, bottom: -1, width: 1, background: '#FFFFFF' }}/>
      </div>
    </div>
  );
}

function CareerArc() {
  const points = [
    [0, 80], [15, 75], [30, 65], [45, 50], [60, 35], [75, 25], [90, 18], [100, 14],
  ];
  const cohort = [
    [0, 82], [15, 78], [30, 70], [45, 60], [60, 52], [75, 45], [90, 40], [100, 38],
  ];
  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const cohortPath = cohort.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: 140 }}>
      {/* Grid */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="#1a4a3a" strokeWidth="0.3" strokeDasharray="1 2" />
      <text x="2" y="48" fontSize="3" fill="#7a9a8e" fontFamily="JetBrains Mono">+0,5</text>

      {/* Cohort spøkelse */}
      <path d={cohortPath} stroke="#7a9a8e" strokeWidth="0.6" fill="none" strokeDasharray="1.5 1.5" opacity="0.5"/>
      <text x="100" y="40" fontSize="3" fill="#7a9a8e" textAnchor="end" fontFamily="JetBrains Mono">kohort-median</text>

      {/* Player line */}
      <path d={path} stroke="#D1F843" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Promotion markers */}
      <circle cx="30" cy="65" r="2.2" fill="#D1F843" stroke="#0D2E23" strokeWidth="0.4"/>
      <circle cx="60" cy="35" r="2.2" fill="#D1F843" stroke="#0D2E23" strokeWidth="0.4"/>

      {/* Year axis */}
      <line x1="0" y1="92" x2="100" y2="92" stroke="#1a4a3a" strokeWidth="0.3"/>
      {[[0,'2018'],[25,'2020'],[50,'2022'],[75,'2024'],[100,'2026']].map(([x, y]) => (
        <text key={y} x={x} y="98" fontSize="3" fill="#7a9a8e" fontFamily="JetBrains Mono"
          textAnchor={x === 0 ? 'start' : x === 100 ? 'end' : 'middle'}>{y}</text>
      ))}
    </svg>
  );
}

function Timeline() {
  return (
    <div style={{ position: 'relative', paddingLeft: 28 }}>
      <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: '#e0e8e5' }}/>
      {TML.map((e, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: 14, paddingBottom: 4 }}>
          <div style={{
            position: 'absolute', left: -23, top: 6, width: 12, height: 12, borderRadius: '50%',
            background: e.kind === 'promotion' ? '#D1F843' : e.kind === 'now' ? '#fff' : '#e0e8e5',
            border: '2px solid ' + (e.kind === 'promotion' ? '#005840' : e.kind === 'now' ? '#D1F843' : '#FFFFFF'),
            boxShadow: e.kind === 'promotion' ? '0 0 12px rgba(209,248,67,0.4)' : 'none',
          }} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
              color: '#324D45', minWidth: 44,
            }}>{e.year}</span>
            <span style={{ fontSize: 13, color: e.kind === 'promotion' ? '#D1F843' : 'white', fontWeight: 600 }}>{e.title}</span>
            <span style={{ fontSize: 12, color: '#A5B2AD' }}>— {e.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── BENCH (compare) ──────────────────────────────────── */
function BenchView({ tweaks, onPlayer }) {
  const [picked, setPicked] = useStateV(['mk', 'sl', 'ib']);
  const players = picked.map(id => PLY.find(p => p.id === id)).filter(Boolean);
  const available = PLY.filter(p => !picked.includes(p.id));

  const colors = ['#D1F843', '#0d6b51', '#5b6e67'];

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' }}>
            BENK
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#324D45', margin: '4px 0 0', letterSpacing: '-0.02em' }}>
            College 2007-kullet
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnGhost}>Lagre benk</button>
          <button style={btnGhost}><Icon name="download" size={13} /> PDF</button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + Math.max(players.length, 1) + ', 1fr)',
        gap: 14, marginBottom: 16,
      }}>
        {players.map((p, i) => {
          const stage = STG.find(s => s.id === p.stage);
          const isLeader = (metric) => Math.max(...players.map(x => x[metric])) === p[metric];
          return (
            <div key={p.id} style={{
              background: '#FFFFFF', borderRadius: 14, border: '1px solid #1a4a3a',
              overflow: 'hidden',
            }}>
              <div style={{ height: 4, background: colors[i] }}/>
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#e0e8e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#324D45', fontWeight: 600, fontSize: 12,
                  }}>{p.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#324D45' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#A5B2AD', marginTop: 2 }}>{p.age} år · {p.club}</div>
                  </div>
                  <button onClick={() => setPicked(picked.filter(x => x !== p.id))}
                    style={{ background: 'transparent', border: 'none', color: '#A5B2AD', cursor: 'pointer' }}>
                    <Icon name="x" size={14} />
                  </button>
                </div>

                {p.hasSG ? (
                  <>
                    <CompareMetric label="SG total"      value={p.sg}   leader={isLeader('sg')} />
                    <CompareMetric label="Putting"       value={p.putt} leader={isLeader('putt')} />
                    <CompareMetric label="Approach"      value={p.app}  leader={isLeader('app')} />
                    <CompareMetric label="Tee-to-green"  value={p.tee}  leader={isLeader('tee')} />
                  </>
                ) : (
                  <>
                    <ScoreMetric label="Snitt brutto" value={p.avgScore} suffix="" />
                    <ScoreMetric label="Til par"      value={p.toPar} signed />
                    <ScoreMetric label="Best brutto"  value={p.bestScore} />
                    <ScoreMetric label="Vs felt"      value={p.scoreVsField} signed />
                  </>
                )}

                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #1a4a3a' }}>
                  <div style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                    PIPELINE
                  </div>
                  <PRail progress={p.progress} />
                  <div style={{ fontSize: 11, color: '#5b6e67', marginTop: 6 }}>
                    {p.stage}/6 · {stage.name} · WAGR #{p.wagr}
                  </div>
                </div>

                <button onClick={() => onPlayer(p)} style={{
                  marginTop: 14, width: '100%', padding: '8px 12px',
                  background: 'transparent', border: '1px solid #1a4a3a',
                  borderRadius: 8, color: '#5b6e67', cursor: 'pointer', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>Åpne logg <Icon name="arrowR" size={11} /></button>
              </div>
            </div>
          );
        })}
        {players.length < 6 && (
          <button onClick={() => available[0] && setPicked([...picked, available[0].id])}
            style={{
              border: '2px dashed #1a4a3a', borderRadius: 14,
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, color: '#A5B2AD', minHeight: 280,
            }}>
            <Icon name="plus" size={24} />
            <span style={{ fontSize: 12 }}>Legg til spiller</span>
          </button>
        )}
      </div>

      {/* Shelf */}
      <div style={{
        background: '#FFFFFF', border: '1px dashed #1a4a3a',
        borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 10, color: '#A5B2AD', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
          SHELF
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {available.slice(0, 8).map(p => (
            <button key={p.id}
              onClick={() => players.length < 6 && setPicked([...picked, p.id])}
              style={{
                padding: '5px 10px', borderRadius: 12,
                background: '#e0e8e5', border: 'none',
                color: '#324D45', fontSize: 11, cursor: 'pointer',
              }}>
              {p.name.split(' ')[0]} {p.name.split(' ')[1][0]}.
            </button>
          ))}
          <span style={{ fontSize: 11, color: '#A5B2AD', alignSelf: 'center', marginLeft: 4 }}>
            + {available.length - 8} til
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreMetric({ label, value, signed }) {
  if (value == null) return null;
  const display = signed
    ? (value < 0 ? '−' : value > 0 ? '+' : '') + Math.abs(value).toFixed(1).replace('.', ',')
    : (typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1).replace('.', ',') : value);
  const good = signed ? value <= 0 : true;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#A5B2AD', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: signed ? (good ? '#005840' : '#B84233') : '#324D45',
        }}>{display}</span>
      </div>
    </div>
  );
}

function CompareMetric({ label, value, leader }) {
  const positive = value >= 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#A5B2AD', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: '#324D45',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {fmtV.sg(value)}
          {leader && <Icon name="star" size={10} color="#D1F843" />}
        </span>
      </div>
      <div style={{ height: 5, background: '#e0e8e5', borderRadius: 2.5, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: Math.min(100, Math.abs(value) * 80) + '%',
          background: positive ? '#005840' : '#B84233',
          borderLeft: leader ? '2px solid #D1F843' : 'none',
          borderRadius: 2.5,
        }}/>
      </div>
    </div>
  );
}

const btnGhost = {
  height: 32, padding: '0 14px', borderRadius: 8,
  background: 'transparent', border: '1px solid #1a4a3a',
  color: '#5b6e67', fontSize: 12, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};

window.PIPELINE_VIEWS = { PipelineView, PlayerProfile, BenchView };
