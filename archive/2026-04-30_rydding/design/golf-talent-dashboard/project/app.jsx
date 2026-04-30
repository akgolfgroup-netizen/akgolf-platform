// Golf Talent Dashboard — interaktiv prototype
// Konsept 01 (Pipeline) som primær. Tweaks bytter konsept-modus.

const { useState, useMemo, useEffect, useRef } = React;

/* ─── DATA ──────────────────────────────────────────────── */
const STAGES = [
  { id: 6, name: 'PGA Tour',         short: 'PGA',       count: 3,   ref: 'PGA-snitt' },
  { id: 5, name: 'Korn Ferry',       short: 'KF',        count: 7,   ref: 'KF-snitt' },
  { id: 4, name: 'Challenge / Nordic', short: 'Challenge', count: 12,  ref: 'Challenge' },
  { id: 3, name: 'College / Amatør', short: 'College',   count: 60,  ref: 'College-snitt' },
  { id: 2, name: 'Norgescup / Elite', short: 'Elite',     count: 142, ref: 'Norge-elite' },
  { id: 1, name: 'Junior',            short: 'Junior',    count: 701, ref: 'Junior-snitt' },
];

// hasSG: true kun for proff (T4-6, DataGolf-data). For T1-3 (norske amatører/junior) har vi kun score-data.
const PLAYERS = [
  // Trinn 6 — PGA (DataGolf SG)
  { id: 'kt', name: 'Kristoffer Ventura', age: 30, stage: 6, club: 'PGA Tour', wagr: 142, wagrDelta: -8, hasSG: true, sg: 0.81, sgDelta: -0.20, putt: 0.12, app: 0.45, tee: 0.18, around: 0.06, avgScore: 70.2, bestScore: 64, toPar: -0.1, progress: 0.95, ready: false, region: 'Internasjonal', born: 1995 },
  { id: 'vh', name: 'Viktor Hovland',     age: 28, stage: 6, club: 'PGA Tour', wagr: 11,  wagrDelta: 1,  hasSG: true, sg: 1.84, sgDelta: 0.40, putt: 0.31, app: 0.92, tee: 0.51, around: 0.10, avgScore: 69.4, bestScore: 61, toPar: -2.1, progress: 1.0, ready: false, region: 'Internasjonal', born: 1997 },
  { id: 'kr', name: 'Kris Kim',           age: 27, stage: 6, club: 'PGA Tour', wagr: 198, wagrDelta: 12, hasSG: true, sg: 0.42, sgDelta: -0.05, putt: 0.05, app: 0.20, tee: 0.12, around: 0.05, avgScore: 70.5, bestScore: 65, toPar: 0.2, progress: 0.92, ready: false, region: 'Internasjonal', born: 1998 },
  // Trinn 5 — KF (DataGolf SG)
  { id: 'sg', name: 'Sigurd Grip',        age: 26, stage: 5, club: 'Korn Ferry', wagr: 244, wagrDelta: -18, hasSG: true, sg: 0.62, sgDelta: 0.15, putt: 0.18, app: 0.30, tee: 0.10, around: 0.04, avgScore: 70.0, bestScore: 64, toPar: -0.4, progress: 0.78, ready: true, region: 'Sør', born: 1999 },
  { id: 'jh', name: 'Jens Halland',       age: 25, stage: 5, club: 'Korn Ferry', wagr: 312, wagrDelta: 4,  hasSG: true, sg: 0.34, sgDelta: 0.05, putt: 0.10, app: 0.18, tee: 0.04, around: 0.02, avgScore: 70.6, bestScore: 65, toPar: 0.1, progress: 0.71, ready: false, region: 'Øst', born: 2000 },
  // Trinn 4 — Challenge (DataGolf SG)
  { id: 'el', name: 'Eirik Langeland',    age: 24, stage: 4, club: 'Challenge Tour', wagr: 421, wagrDelta: 22, hasSG: true, sg: 0.88, sgDelta: 0.22, putt: 0.22, app: 0.40, tee: 0.20, around: 0.06, avgScore: 70.1, bestScore: 64, toPar: -0.5, progress: 0.62, ready: true, region: 'Vest', born: 2001 },
  { id: 'ts', name: 'Tobias Strand',      age: 23, stage: 4, club: 'Nordic Tour',    wagr: 567, wagrDelta: -12, hasSG: true, sg: 0.41, sgDelta: -0.08, putt: 0.05, app: 0.20, tee: 0.10, around: 0.06, avgScore: 70.7, bestScore: 65, toPar: 0.4, progress: 0.55, ready: false, region: 'Midt', born: 2002 },
  { id: 'ah', name: 'Anders Heldal',      age: 22, stage: 4, club: 'Nordic Tour',    wagr: 612, wagrDelta: 8, hasSG: true, sg: 0.28, sgDelta: 0.10, putt: 0.02, app: 0.12, tee: 0.10, around: 0.04, avgScore: 71.0, bestScore: 66, toPar: 0.6, progress: 0.51, ready: false, region: 'Nord', born: 2003 },
  // Trinn 3 — College (KUN score, ingen SG)
  { id: 'mk', name: 'Magnus Kristoffersen', age: 21, stage: 3, club: 'Arizona State',  wagr: 147, wagrDelta: 22, hasSG: false, avgScore: 70.4, bestScore: 64, toPar: -1.2, scoreDelta: -1.4, scoreVsField: -1.8, rounds: 64, progress: 0.48, ready: true, region: 'Øst', born: 2004 },
  { id: 'sl', name: 'Sondre Larsen',      age: 20, stage: 3, club: 'Texas A&M',      wagr: 312, wagrDelta: 0,  hasSG: false, avgScore: 71.8, bestScore: 67, toPar: 0.2, scoreDelta: 0.1, scoreVsField: -0.4, rounds: 58, progress: 0.42, ready: false, region: 'Sør', born: 2005 },
  { id: 'ib', name: 'Ingrid Berg',        age: 19, stage: 3, club: 'Stanford',       wagr: 84,  wagrDelta: 8,  hasSG: false, avgScore: 71.2, bestScore: 65, toPar: -0.6, scoreDelta: -0.8, scoreVsField: -1.4, rounds: 52, progress: 0.46, ready: true, region: 'Vest', born: 2006 },
  { id: 'eh', name: 'Eirik Hansen',       age: 20, stage: 3, club: 'Oklahoma',       wagr: 245, wagrDelta: -10, hasSG: false, avgScore: 71.6, bestScore: 67, toPar: -0.1, scoreDelta: -0.3, scoreVsField: -0.7, rounds: 48, progress: 0.40, ready: false, region: 'Midt', born: 2005 },
  { id: 'as', name: 'Anna Solheim',       age: 21, stage: 3, club: 'Wake Forest',    wagr: 178, wagrDelta: -4, hasSG: false, avgScore: 71.4, bestScore: 66, toPar: -0.4, scoreDelta: -0.5, scoreVsField: -1.1, rounds: 56, progress: 0.45, ready: false, region: 'Vest', born: 2004 },
  { id: 'ts2', name: 'Tobias Sørli',      age: 19, stage: 3, club: 'Florida State',  wagr: 268, wagrDelta: 14, hasSG: false, avgScore: 71.5, bestScore: 66, toPar: -0.2, scoreDelta: -0.6, scoreVsField: -0.9, rounds: 50, progress: 0.43, ready: false, region: 'Sør', born: 2006 },
  // Trinn 2 — Elite (KUN score, Norgescup/Srixon)
  { id: 'jr', name: 'Jonas Rian',         age: 23, stage: 2, club: 'Bærum GK',       wagr: 1240, wagrDelta: 80, hasSG: false, avgScore: 71.6, bestScore: 66, toPar: 0.0, scoreDelta: -0.9, scoreVsField: -1.2, rounds: 38, progress: 0.32, ready: true, region: 'Øst', born: 2002 },
  { id: 'mh', name: 'Mathilde Hauge',     age: 22, stage: 2, club: 'Stavanger GK',   wagr: 1480, wagrDelta: 22, hasSG: false, avgScore: 72.4, bestScore: 67, toPar: 0.6, scoreDelta: -0.2, scoreVsField: -0.5, rounds: 34, progress: 0.28, ready: false, region: 'Sør', born: 2003 },
  { id: 'pl', name: 'Petter Lindh',       age: 24, stage: 2, club: 'Oslo GK',        wagr: 1650, wagrDelta: -120, hasSG: false, avgScore: 73.1, bestScore: 68, toPar: 1.2, scoreDelta: 0.4, scoreVsField: 0.2, rounds: 32, progress: 0.30, ready: false, region: 'Øst', born: 2001 },
  // Trinn 1 — Junior (KUN score, OLYO/Srixon Junior)
  { id: 'em', name: 'Emil Mortensen',     age: 16, stage: 1, club: 'Larvik GK',      wagr: 3210, wagrDelta: 480, hasSG: false, avgScore: 73.2, bestScore: 68, toPar: 1.4, scoreDelta: -1.8, scoreVsField: -2.1, rounds: 28, progress: 0.18, ready: true, region: 'Sør', born: 2009 },
  { id: 'sb', name: 'Selma Bjørke',       age: 15, stage: 1, club: 'Trondheim GK',   wagr: 4120, wagrDelta: 220, hasSG: false, avgScore: 74.6, bestScore: 70, toPar: 2.4, scoreDelta: -1.2, scoreVsField: -1.4, rounds: 22, progress: 0.15, ready: false, region: 'Midt', born: 2010 },
  { id: 'ok', name: 'Oskar Kvam',         age: 17, stage: 1, club: 'Bergen GK',      wagr: 2890, wagrDelta: -180, hasSG: false, avgScore: 73.8, bestScore: 69, toPar: 1.8, scoreDelta: 0.2, scoreVsField: -0.6, rounds: 26, progress: 0.20, ready: false, region: 'Vest', born: 2008 },
];

// Career events for the focal player (Magnus K.)
const TIMELINE = [
  { year: 2026, kind: 'now',       title: 'I dag', detail: 'WAGR #147 · Arizona State · snitt 70,4 (NCAA)' },
  { year: 2025, kind: 'milestone', title: '★ Topp-150 WAGR', detail: 'Første norske college-spiller i 2025-kohorten' },
  { year: 2024, kind: 'promotion', title: 'Trinn 2 → 3', detail: 'Debut Arizona State · Pac-12 freshman of the year-nominasjon' },
  { year: 2023, kind: 'event',     title: 'Norgescup-vinner', detail: 'Holtsmark · −14 totalt · 1,4 slag under feltsnitt' },
  { year: 2022, kind: 'event',     title: 'EM Lag-Junior',   detail: '5. plass · individuell topp-20' },
  { year: 2021, kind: 'promotion', title: 'Trinn 1 → 2', detail: 'Srixon Tour 4 år · vunnet Region Øst sammenlagt' },
  { year: 2018, kind: 'start',     title: 'OLYO Region Øst', detail: '13 år · første registrerte resultat' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "concept": "pipeline",
  "showReadyOnly": false,
  "kohort": "alle",
  "compactCards": false,
  "showAlgoFlags": true,
  "metric": "sg"
}/*EDITMODE-END*/;

/* ─── ICONS (lucide-aktig inline) ──────────────────────── */
const Icon = ({ name, size = 16, color = 'currentColor', stroke = 2 }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round'
  };
  const paths = {
    home:    <><path d="M3 12L12 3l9 9"/><path d="M5 10v10h14V10"/></>,
    users:   <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M14 19c.5-2 2-3.5 4.5-3.5S22 17 22 19"/></>,
    target:  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    layers:  <><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></>,
    book:    <><path d="M4 4h12a3 3 0 013 3v13H7a3 3 0 01-3-3V4z"/><path d="M4 17a3 3 0 013-3h12"/></>,
    archive: <><rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8"/><path d="M10 12h4"/></>,
    folder:  <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    arrowUp: <><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>,
    arrowDn: <><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>,
    arrowR:  <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    minus:   <><path d="M5 12h14"/></>,
    search:  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    download:<><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    flag:    <><path d="M5 3v18"/><path d="M5 4h13l-2 4 2 4H5"/></>,
    star:    <><path d="M12 3l2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17.4l-5.5 2.9 1-6.3L3 9.6l6.3-.9L12 3z"/></>,
    x:       <><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>,
    chev:    <><path d="M6 9l6 6 6-6"/></>,
    plus:    <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    sparkle: <><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M5.6 18.4l2.8-2.8"/><path d="M15.6 8.4l2.8-2.8"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    list:    <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    line:    <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

/* ─── SHARED ATOMS ──────────────────────────────────────── */
const fmt = {
  sg: (v) => (v == null || isNaN(v)) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2).replace('.', ','),
  delta: (v, suffix = '') => (v > 0 ? '↑ ' + v : v < 0 ? '↓ ' + Math.abs(v) : '→ 0') + suffix,
  score: (v) => (typeof v === 'number' ? v.toFixed(1).replace('.', ',') : '—'),
  toPar: (v) => v == null ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1).replace('.', ','),
  // for score-deltas: lower is better, so positive delta is bad (red)
  scoreDelta: (v) => (v < 0 ? '−' : v > 0 ? '+' : '') + Math.abs(v).toFixed(1).replace('.', ','),
};

function PipelineRail({ progress, size = 'sm' }) {
  const segments = 6;
  const filled = Math.round(progress * segments);
  const w = size === 'sm' ? 10 : 14;
  const gap = 3;
  return (
    <div style={{ display: 'flex', gap, alignItems: 'center' }}>
      {Array.from({ length: segments }).map((_, i) => {
        const isFilled = i < filled - 1;
        const isCurrent = i === filled - 1;
        return (
          <div key={i} style={{
            width: w,
            height: size === 'sm' ? 4 : 6,
            borderRadius: 1,
            background: isCurrent ? '#D1F843' : isFilled ? '#005840' : '#e0e8e5',
            boxShadow: isCurrent ? '0 0 8px rgba(209,248,67,0.5)' : 'none',
          }} />
        );
      })}
    </div>
  );
}

function SgDelta({ value, vsRef = 'PGA', size = 'md' }) {
  const positive = value >= 0;
  const fontSize = size === 'lg' ? 22 : size === 'md' ? 14 : 11;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontFamily: 'JetBrains Mono, monospace' }}>
      <span style={{
        fontSize, fontWeight: 700,
        color: positive ? '#005840' : '#B84233',
        letterSpacing: '-0.01em', lineHeight: 1
      }}>{fmt.sg(value)}</span>
      <span style={{ fontSize: 9.5, color: '#A5B2AD', textTransform: 'uppercase', letterSpacing: '0.08em' }}>vs {vsRef}</span>
    </span>
  );
}

function SourceBadge({ src }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, padding: '1px 5px',
      borderRadius: 3, background: '#ECF0EF', color: '#5b6e67',
      letterSpacing: '0.05em',
    }}>{src}</span>
  );
}

/* ─── SIDEBAR ───────────────────────────────────────────── */
function Sidebar({ activeView, onSelect }) {
  const items = [
    { id: 'dashboard', icon: 'home',   label: 'Oversikt' },
    { id: 'pipeline', icon: 'layers',  label: 'Pipeline' },
    { id: 'players',  icon: 'users',   label: 'Spillere' },
    { id: 'bench',    icon: 'grid',    label: 'Benk' },
    { id: 'juniors',  icon: 'star',    label: 'Juniorer' },
    { id: 'log',      icon: 'book',    label: 'Spillerlogg' },
    { id: 'bench-mark', icon: 'target', label: 'Benchmarks' },
    { id: 'data',     icon: 'line',    label: 'DataGolf' },
    { id: 'files',    icon: 'folder',  label: 'Filer' },
  ];
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 56,
      background: '#005840', borderRight: '1px solid #00432f',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 0', gap: 4, zIndex: 10,
    }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#005840',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: 'white' }}>a</span>
        <span style={{ fontWeight: 800, fontSize: 14, color: '#D1F843' }}>·</span>
      </div>
      {items.map(it => (
        <button key={it.id}
          onClick={() => onSelect(it.id)}
          title={it.label}
          style={{
            width: 36, height: 36, borderRadius: 8, border: 'none',
            background: activeView === it.id ? 'rgba(209,248,67,0.15)' : 'transparent',
            color: activeView === it.id ? '#D1F843' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 150ms ease',
          }}>
          <Icon name={it.icon} size={18} />
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button style={{
        width: 36, height: 36, borderRadius: 8, border: 'none',
        background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon name="settings" size={18} />
      </button>
    </aside>
  );
}

/* ─── TOP BAR ───────────────────────────────────────────── */
function TopBar({ stageName, totalCount, season, onSeason, kohort, onKohort, onExport, onSearch }) {
  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 24px',
      borderBottom: '1px solid #e0e8e5', background: '#FFFFFF',
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#324D45', letterSpacing: '-0.01em' }}>
          Pipeline · <span style={{ color: '#A5B2AD', fontWeight: 500 }}>{stageName}</span>
        </div>
        <div style={{ fontSize: 11, color: '#A5B2AD', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
          {totalCount} norske spillere · 5 datakilder
        </div>
      </div>
      <div style={{ flex: 1 }} />

      <button onClick={onSearch} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 32, padding: '0 12px', borderRadius: 16,
        border: '1px solid #e0e8e5', background: '#ECF0EF',
        color: '#A5B2AD', fontSize: 12, cursor: 'pointer', minWidth: 220,
      }}>
        <Icon name="search" size={14} />
        Søk spiller, klubb, turnering…
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#A5B2AD' }}>⌘K</span>
      </button>

      <Pill value={kohort} options={[
        { v: 'alle', label: 'Alle aldre' },
        { v: '2004-2006', label: 'Født 2004–2006' },
        { v: '2007-2009', label: 'Født 2007–2009' },
        { v: '2010+', label: 'Født 2010+' },
      ]} onChange={onKohort} />

      <Pill value={season} options={[
        { v: '2026', label: '2026' },
        { v: '2025', label: '2025' },
        { v: '5y',   label: 'Siste 5 år' },
      ]} onChange={onSeason} />

      <button onClick={onExport} style={{
        height: 32, padding: '0 16px', borderRadius: 16,
        background: '#D1F843', color: '#0A1F18', fontWeight: 600, fontSize: 12,
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="download" size={13} stroke={2.4} />
        Eksporter
      </button>
    </header>
  );
}

function Pill({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const cur = options.find(o => o.v === value) || options[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 32, padding: '0 12px', borderRadius: 16,
        border: '1px solid #e0e8e5', background: '#FFFFFF',
        color: '#324D45', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {cur.label}
        <span style={{ color: '#A5B2AD', fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8 }} />
          <div style={{
            position: 'absolute', top: 38, right: 0, zIndex: 9,
            background: '#FFFFFF', border: '1px solid #e0e8e5', borderRadius: 10,
            padding: 4, minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}>
            {options.map(o => (
              <button key={o.v}
                onClick={() => { onChange(o.v); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  background: o.v === value ? '#E8F5EF' : 'transparent',
                  color: o.v === value ? '#005840' : '#324D45',
                  fontSize: 12, cursor: 'pointer',
                }}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

window.PIPELINE_DATA = { STAGES, PLAYERS, TIMELINE, TWEAK_DEFAULTS };
window.PIPELINE_UI = { Icon, fmt, PipelineRail, SgDelta, SourceBadge, Sidebar, TopBar };
