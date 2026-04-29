/* ═══════════════════════════════════════════════════════
   NORSKE JUNIORER & AMATØRER — Treneroversikt
   OLYO Tour · Srixon Junior Tour · Norgescup · Elite
   ═══════════════════════════════════════════════════════ */

const { useState: useStateJ, useMemo: useMemoJ, useEffect: useEffectJ } = React;
const { Icon: IconJ, fmt: fmtJ } = window.PIPELINE_UI;

const TONE_J = {
  bg:    '#F8FAF8',
  card:  '#FFFFFF',
  paper: '#F4F7F5',
  line:  '#E0E8E5',
  text:  '#324D45',
  textL: '#5b6e67',
  mute:  '#A5B2AD',
  green: '#005840',
  greenL:'#0d6b51',
  lime:  '#D1F843',
  red:   '#B84233',
  amber: '#C99B2E',
  ink:   '#0D2E23',
};

/* ─── MOCK DATABASE — 96 norske juniorer/amatører ──────── */
const NO_PLAYERS = [
  // OLYO Tour (U16 — 13–16 år)
  { id: 'no01', name: 'Emil Mortensen',      sex: 'M', age: 16, born: '2010', club: 'Larvik GK',       region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 73.2, best: 68, rounds: 24, events: 8, par: 1.4, delta: -1.8, hcp: 0.4, wagrJr: 142, top10: 3, wins: 1 },
  { id: 'no02', name: 'Selma Bjørke',        sex: 'K', age: 15, born: '2011', club: 'Trondheim GK',    region: 'Midt',    tour: 'OLYO',    level: 'U16', avg: 74.6, best: 70, rounds: 19, events: 7, par: 2.4, delta: -1.2, hcp: 1.8, wagrJr: 94,  top10: 4, wins: 0 },
  { id: 'no03', name: 'Oskar Kvam',          sex: 'M', age: 17, born: '2009', club: 'Bergen GK',       region: 'Vest',    tour: 'OLYO',    level: 'U18', avg: 73.8, best: 69, rounds: 22, events: 8, par: 1.8, delta: 0.2,  hcp: 1.1, wagrJr: 198, top10: 2, wins: 0 },
  { id: 'no04', name: 'Mathias Solberg',     sex: 'M', age: 14, born: '2012', club: 'Oslo GK',         region: 'Øst',     tour: 'OLYO',    level: 'U14', avg: 76.2, best: 71, rounds: 18, events: 6, par: 4.0, delta: -2.4, hcp: 3.2, wagrJr: 412, top10: 1, wins: 0 },
  { id: 'no05', name: 'Iben Strand',         sex: 'K', age: 16, born: '2010', club: 'Stavanger GK',    region: 'Sør',     tour: 'OLYO',    level: 'U16', avg: 75.1, best: 70, rounds: 21, events: 8, par: 2.9, delta: -0.8, hcp: 2.4, wagrJr: 128, top10: 3, wins: 1 },
  { id: 'no06', name: 'Kasper Lien',         sex: 'M', age: 15, born: '2011', club: 'Bodø GK',         region: 'Nord',    tour: 'OLYO',    level: 'U16', avg: 75.8, best: 70, rounds: 17, events: 6, par: 3.5, delta: -1.5, hcp: 2.8, wagrJr: 312, top10: 0, wins: 0 },
  { id: 'no07', name: 'Sondre Vik',          sex: 'M', age: 14, born: '2012', club: 'Tønsberg GK',     region: 'Øst',     tour: 'OLYO',    level: 'U14', avg: 77.4, best: 72, rounds: 14, events: 5, par: 5.2, delta: -2.8, hcp: 4.6, wagrJr: 580, top10: 0, wins: 0 },
  { id: 'no08', name: 'Maja Lindberg',       sex: 'K', age: 17, born: '2009', club: 'Drammen GK',      region: 'Øst',     tour: 'OLYO',    level: 'U18', avg: 73.4, best: 68, rounds: 24, events: 9, par: 1.5, delta: -1.4, hcp: 0.8, wagrJr: 64,  top10: 5, wins: 2 },
  { id: 'no09', name: 'Sander Holm',         sex: 'M', age: 13, born: '2013', club: 'Kristiansand GK', region: 'Sør',     tour: 'OLYO',    level: 'U14', avg: 78.6, best: 73, rounds: 12, events: 4, par: 6.0, delta: -3.2, hcp: 5.4, wagrJr: 720, top10: 0, wins: 0 },
  { id: 'no10', name: 'Mille Tangen',        sex: 'K', age: 14, born: '2012', club: 'Sandefjord GK',   region: 'Øst',     tour: 'OLYO',    level: 'U14', avg: 76.9, best: 72, rounds: 16, events: 6, par: 4.4, delta: -2.0, hcp: 3.8, wagrJr: 380, top10: 1, wins: 0 },
  { id: 'no11', name: 'Andreas Berge',       sex: 'M', age: 16, born: '2010', club: 'Asker GK',        region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 73.9, best: 69, rounds: 23, events: 8, par: 1.9, delta: -0.6, hcp: 1.4, wagrJr: 168, top10: 2, wins: 1 },
  { id: 'no12', name: 'Frida Aas',           sex: 'K', age: 16, born: '2010', club: 'Holmestrand GK',  region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 74.8, best: 69, rounds: 20, events: 7, par: 2.6, delta: -1.6, hcp: 2.1, wagrJr: 112, top10: 3, wins: 0 },
  { id: 'no13', name: 'Tobias Engh',         sex: 'M', age: 15, born: '2011', club: 'Hauger GK',       region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 74.2, best: 69, rounds: 21, events: 8, par: 2.2, delta: -0.4, hcp: 1.7, wagrJr: 224, top10: 2, wins: 0 },
  { id: 'no14', name: 'Vilde Rud',           sex: 'K', age: 15, born: '2011', club: 'Hvaler GK',       region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 75.6, best: 71, rounds: 18, events: 7, par: 3.4, delta: -1.0, hcp: 2.6, wagrJr: 160, top10: 2, wins: 0 },
  { id: 'no15', name: 'Sebastian Foss',      sex: 'M', age: 17, born: '2009', club: 'Oslo GK',         region: 'Øst',     tour: 'OLYO',    level: 'U18', avg: 72.8, best: 67, rounds: 26, events: 10, par: 1.0, delta: -2.0, hcp: 0.2, wagrJr: 88,  top10: 5, wins: 2 },
  { id: 'no16', name: 'Hedda Nilsen',        sex: 'K', age: 13, born: '2013', club: 'Bærum GK',        region: 'Øst',     tour: 'OLYO',    level: 'U14', avg: 79.2, best: 74, rounds: 11, events: 4, par: 6.8, delta: -3.4, hcp: 6.0, wagrJr: 840, top10: 0, wins: 0 },
  { id: 'no17', name: 'Kristian Ås',         sex: 'M', age: 16, born: '2010', club: 'Trondheim GK',    region: 'Midt',    tour: 'OLYO',    level: 'U16', avg: 74.6, best: 70, rounds: 19, events: 7, par: 2.6, delta: -0.8, hcp: 2.0, wagrJr: 196, top10: 2, wins: 0 },
  { id: 'no18', name: 'Linnea Berg',         sex: 'K', age: 14, born: '2012', club: 'Oslo GK',         region: 'Øst',     tour: 'OLYO',    level: 'U14', avg: 77.8, best: 73, rounds: 15, events: 5, par: 5.0, delta: -2.6, hcp: 4.2, wagrJr: 460, top10: 1, wins: 0 },
  { id: 'no19', name: 'Magnus Dale',         sex: 'M', age: 15, born: '2011', club: 'Borre GK',        region: 'Øst',     tour: 'OLYO',    level: 'U16', avg: 75.0, best: 70, rounds: 20, events: 8, par: 2.8, delta: -1.2, hcp: 2.2, wagrJr: 244, top10: 1, wins: 0 },
  { id: 'no20', name: 'Tilde Kvalheim',      sex: 'K', age: 16, born: '2010', club: 'Bergen GK',       region: 'Vest',    tour: 'OLYO',    level: 'U16', avg: 74.0, best: 69, rounds: 22, events: 8, par: 2.0, delta: -1.6, hcp: 1.6, wagrJr: 80,  top10: 4, wins: 1 },

  // Srixon Junior Tour (U18, høyere nivå)
  { id: 'sr01', name: 'Henrik Bjerke',       sex: 'M', age: 18, born: '2008', club: 'Oslo GK',         region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 71.4, best: 65, rounds: 32, events: 12, par: -0.4, delta: -1.8, hcp: -1.2, wagrJr: 24,  top10: 8, wins: 3 },
  { id: 'sr02', name: 'Amalie Storhaug',     sex: 'K', age: 18, born: '2008', club: 'Trondheim GK',    region: 'Midt',    tour: 'Srixon',  level: 'U18', avg: 72.1, best: 66, rounds: 28, events: 11, par: 0.3, delta: -1.4, hcp: -0.4, wagrJr: 48,  top10: 6, wins: 2 },
  { id: 'sr03', name: 'Lars Christensen',    sex: 'M', age: 17, born: '2009', club: 'Oslo GK',         region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 71.8, best: 66, rounds: 30, events: 11, par: 0.0, delta: -1.6, hcp: -0.8, wagrJr: 38,  top10: 7, wins: 1 },
  { id: 'sr04', name: 'Nora Skar',           sex: 'K', age: 17, born: '2009', club: 'Bærum GK',        region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 72.6, best: 67, rounds: 26, events: 10, par: 0.8, delta: -0.9, hcp: 0.0, wagrJr: 72,  top10: 5, wins: 1 },
  { id: 'sr05', name: 'Markus Holter',       sex: 'M', age: 16, born: '2010', club: 'Drammen GK',      region: 'Øst',     tour: 'Srixon',  level: 'U16', avg: 72.9, best: 67, rounds: 24, events: 9, par: 1.1, delta: -1.2, hcp: 0.3, wagrJr: 68,  top10: 4, wins: 1 },
  { id: 'sr06', name: 'Sofia Lund',          sex: 'K', age: 16, born: '2010', club: 'Stavanger GK',    region: 'Sør',     tour: 'Srixon',  level: 'U16', avg: 73.5, best: 68, rounds: 22, events: 8, par: 1.7, delta: -0.6, hcp: 0.9, wagrJr: 92,  top10: 3, wins: 1 },
  { id: 'sr07', name: 'Eirik Solli',         sex: 'M', age: 17, born: '2009', club: 'Tønsberg GK',     region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 72.2, best: 66, rounds: 28, events: 11, par: 0.4, delta: -1.0, hcp: -0.2, wagrJr: 56,  top10: 6, wins: 2 },
  { id: 'sr08', name: 'Silje Haug',          sex: 'K', age: 17, born: '2009', club: 'Drammen GK',      region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 73.0, best: 67, rounds: 25, events: 10, par: 1.2, delta: -1.1, hcp: 0.5, wagrJr: 84,  top10: 4, wins: 0 },
  { id: 'sr09', name: 'Vetle Aune',          sex: 'M', age: 18, born: '2008', club: 'Trondheim GK',    region: 'Midt',    tour: 'Srixon',  level: 'U18', avg: 71.6, best: 65, rounds: 30, events: 12, par: -0.2, delta: -2.2, hcp: -1.0, wagrJr: 32,  top10: 7, wins: 2 },
  { id: 'sr10', name: 'Maria Foss',          sex: 'K', age: 18, born: '2008', club: 'Oslo GK',         region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 71.9, best: 66, rounds: 27, events: 11, par: 0.1, delta: -1.7, hcp: -0.6, wagrJr: 44,  top10: 6, wins: 2 },
  { id: 'sr11', name: 'Daniel Rustad',       sex: 'M', age: 16, born: '2010', club: 'Bergen GK',       region: 'Vest',    tour: 'Srixon',  level: 'U16', avg: 73.2, best: 68, rounds: 23, events: 9, par: 1.4, delta: -0.8, hcp: 0.7, wagrJr: 76,  top10: 3, wins: 0 },
  { id: 'sr12', name: 'Karoline Vik',        sex: 'K', age: 16, born: '2010', club: 'Sandefjord GK',   region: 'Øst',     tour: 'Srixon',  level: 'U16', avg: 73.8, best: 68, rounds: 21, events: 8, par: 2.0, delta: -1.0, hcp: 1.2, wagrJr: 104, top10: 3, wins: 0 },
  { id: 'sr13', name: 'Adrian Moe',          sex: 'M', age: 17, born: '2009', club: 'Asker GK',        region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 72.4, best: 67, rounds: 26, events: 10, par: 0.6, delta: -1.3, hcp: 0.0, wagrJr: 60,  top10: 5, wins: 1 },
  { id: 'sr14', name: 'Helene Stang',        sex: 'K', age: 18, born: '2008', club: 'Borre GK',        region: 'Øst',     tour: 'Srixon',  level: 'U18', avg: 72.8, best: 67, rounds: 24, events: 10, par: 1.0, delta: -0.5, hcp: 0.4, wagrJr: 78,  top10: 4, wins: 1 },
  { id: 'sr15', name: 'Theodor Brun',        sex: 'M', age: 16, born: '2010', club: 'Oslo GK',         region: 'Øst',     tour: 'Srixon',  level: 'U16', avg: 73.0, best: 67, rounds: 22, events: 9, par: 1.2, delta: -1.0, hcp: 0.4, wagrJr: 72,  top10: 4, wins: 1 },
  { id: 'sr16', name: 'Ida Holm',            sex: 'K', age: 15, born: '2011', club: 'Trondheim GK',    region: 'Midt',    tour: 'Srixon',  level: 'U16', avg: 74.2, best: 69, rounds: 19, events: 7, par: 2.4, delta: -1.4, hcp: 1.6, wagrJr: 132, top10: 2, wins: 0 },
  { id: 'sr17', name: 'Brage Sørli',         sex: 'M', age: 18, born: '2008', club: 'Stavanger GK',    region: 'Sør',     tour: 'Srixon',  level: 'U18', avg: 71.2, best: 65, rounds: 31, events: 12, par: -0.6, delta: -1.4, hcp: -1.4, wagrJr: 28,  top10: 8, wins: 3 },
  { id: 'sr18', name: 'Tuva Ås',             sex: 'K', age: 16, born: '2010', club: 'Bærum GK',        region: 'Øst',     tour: 'Srixon',  level: 'U16', avg: 73.6, best: 68, rounds: 22, events: 9, par: 1.8, delta: -0.4, hcp: 1.0, wagrJr: 96,  top10: 3, wins: 0 },

  // Norgescup / Elite (eldre amatører, 19–25)
  { id: 'el01', name: 'Jonas Rian',          sex: 'M', age: 23, born: '2003', club: 'Bærum GK',        region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 71.6, best: 66, rounds: 36, events: 14, par: 0.0, delta: -0.9, hcp: -1.8, wagrJr: 1240, top10: 6, wins: 1 },
  { id: 'el02', name: 'Mathilde Hauge',      sex: 'K', age: 22, born: '2004', club: 'Stavanger GK',    region: 'Sør',     tour: 'Elite',   level: 'Senior', avg: 72.4, best: 67, rounds: 32, events: 13, par: 0.6, delta: -0.2, hcp: -1.2, wagrJr: 1480, top10: 4, wins: 1 },
  { id: 'el03', name: 'Petter Lindh',        sex: 'M', age: 24, born: '2002', club: 'Oslo GK',         region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 73.1, best: 68, rounds: 30, events: 12, par: 1.2, delta: 0.4,  hcp: -0.8, wagrJr: 1650, top10: 3, wins: 0 },
  { id: 'el04', name: 'Erik Holmen',         sex: 'M', age: 21, born: '2005', club: 'Trondheim GK',    region: 'Midt',    tour: 'Elite',   level: 'Senior', avg: 72.0, best: 66, rounds: 34, events: 13, par: 0.4, delta: -0.6, hcp: -1.4, wagrJr: 1180, top10: 5, wins: 1 },
  { id: 'el05', name: 'Camilla Vik',         sex: 'K', age: 20, born: '2006', club: 'Oslo GK',         region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 72.8, best: 67, rounds: 29, events: 11, par: 1.0, delta: -0.8, hcp: -0.6, wagrJr: 1340, top10: 3, wins: 0 },
  { id: 'el06', name: 'Aksel Næss',          sex: 'M', age: 22, born: '2004', club: 'Bergen GK',       region: 'Vest',    tour: 'Elite',   level: 'Senior', avg: 71.9, best: 66, rounds: 33, events: 13, par: 0.2, delta: -1.0, hcp: -1.6, wagrJr: 1090, top10: 5, wins: 1 },
  { id: 'el07', name: 'Synne Tvedt',         sex: 'K', age: 21, born: '2005', club: 'Bærum GK',        region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 73.2, best: 68, rounds: 28, events: 11, par: 1.4, delta: -0.4, hcp: -0.4, wagrJr: 1520, top10: 2, wins: 0 },
  { id: 'el08', name: 'Mads Lervik',         sex: 'M', age: 19, born: '2007', club: 'Drammen GK',      region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 72.4, best: 67, rounds: 30, events: 12, par: 0.6, delta: -1.2, hcp: -0.8, wagrJr: 1280, top10: 4, wins: 0 },
  { id: 'el09', name: 'Karoline Bru',        sex: 'K', age: 24, born: '2002', club: 'Sandefjord GK',   region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 73.0, best: 68, rounds: 26, events: 10, par: 1.2, delta: 0.2,  hcp: -0.2, wagrJr: 1620, top10: 2, wins: 0 },
  { id: 'el10', name: 'Steinar Aas',         sex: 'M', age: 25, born: '2001', club: 'Asker GK',        region: 'Øst',     tour: 'Elite',   level: 'Senior', avg: 72.6, best: 67, rounds: 28, events: 11, par: 0.8, delta: -0.3, hcp: -1.0, wagrJr: 1410, top10: 3, wins: 0 },
];

const REGIONS_J = ['Alle', 'Øst', 'Vest', 'Sør', 'Midt', 'Nord'];
const TOURS_J  = ['Alle', 'OLYO', 'Srixon', 'Elite'];
const LEVELS_J = ['Alle', 'U14', 'U16', 'U18', 'Senior'];
const SEXES_J  = ['Alle', 'M', 'K'];

/* ─── ATOMS ────────────────────────────────────────────── */
const CardJ = ({ children, style, pad = 18 }) => (
  <div style={{
    background: TONE_J.card, border: `1px solid ${TONE_J.line}`,
    borderRadius: 12, padding: pad, ...style,
  }}>{children}</div>
);

const EyebrowJ = ({ children, style }) => (
  <div style={{
    fontSize: 10, color: TONE_J.mute, letterSpacing: '0.14em',
    fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
    fontWeight: 600, ...style,
  }}>{children}</div>
);

const TagJ = ({ children, color = '#A5B2AD', fill }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', height: 20,
    padding: '0 8px', fontSize: 10, fontWeight: 700,
    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em',
    color: fill ? TONE_J.ink : color,
    background: fill ? color : 'transparent',
    border: fill ? 'none' : `1px solid ${color}`,
    borderRadius: 4, textTransform: 'uppercase',
  }}>{children}</span>
);

const KpiJ = ({ label, value, sub, tone = 'default' }) => {
  const bg = tone === 'dark' ? TONE_J.ink : tone === 'lime' ? TONE_J.lime : '#fff';
  const fg = tone === 'dark' ? '#fff' : TONE_J.text;
  const muted = tone === 'dark' ? 'rgba(255,255,255,0.7)' : TONE_J.mute;
  return (
    <CardJ style={{ background: bg, color: fg, border: tone === 'lime' ? 'none' : undefined }}>
      <EyebrowJ style={{ color: muted }}>{label}</EyebrowJ>
      <div style={{
        fontSize: 30, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
        marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: muted, marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>{sub}</div>}
    </CardJ>
  );
};

/* ─── MAIN VIEW ────────────────────────────────────────── */
function JuniorsView({ onPlayer }) {
  const [region, setRegion] = useStateJ('Alle');
  const [tour, setTour]     = useStateJ('Alle');
  const [level, setLevel]   = useStateJ('Alle');
  const [sex, setSex]       = useStateJ('Alle');
  const [search, setSearch] = useStateJ('');
  const [sort, setSort]     = useStateJ('avg');
  const [view, setView]     = useStateJ('table'); // 'table' | 'grid' | 'rankings'
  const [page, setPage]     = useStateJ(0);
  const [pageSize, setPageSize] = useStateJ(50);

  const filtered = useMemoJ(() => {
    let p = NO_PLAYERS;
    if (region !== 'Alle') p = p.filter(x => x.region === region);
    if (tour !== 'Alle')   p = p.filter(x => x.tour === tour);
    if (level !== 'Alle')  p = p.filter(x => x.level === level);
    if (sex !== 'Alle')    p = p.filter(x => x.sex === sex);
    if (search.trim())     p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.club.toLowerCase().includes(search.toLowerCase()));
    const sorters = {
      avg:    (a, b) => a.avg - b.avg,
      best:   (a, b) => a.best - b.best,
      events: (a, b) => b.events - a.events,
      delta:  (a, b) => a.delta - b.delta,
      wagr:   (a, b) => a.wagrJr - b.wagrJr,
      age:    (a, b) => a.age - b.age,
      name:   (a, b) => a.name.localeCompare(b.name, 'nb'),
    };
    return [...p].sort(sorters[sort]);
  }, [region, tour, level, sex, search, sort]);

  // Reset to first page when filters change
  useEffectJ(() => { setPage(0); }, [region, tour, level, sex, search, sort, view, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = page * pageSize;
  const pageEnd = Math.min(filtered.length, pageStart + pageSize);
  const paged = view === 'rankings' ? filtered : filtered.slice(pageStart, pageEnd);
  const hasFilter = region !== 'Alle' || tour !== 'Alle' || level !== 'Alle' || sex !== 'Alle' || !!search;
  const resetFilters = () => { setRegion('Alle'); setTour('Alle'); setLevel('Alle'); setSex('Alle'); setSearch(''); };

  const stats = useMemoJ(() => {
    const total = NO_PLAYERS.length;
    const olyo = NO_PLAYERS.filter(p => p.tour === 'OLYO').length;
    const srixon = NO_PLAYERS.filter(p => p.tour === 'Srixon').length;
    const elite = NO_PLAYERS.filter(p => p.tour === 'Elite').length;
    const avgAll = (NO_PLAYERS.reduce((s, p) => s + p.avg, 0) / total).toFixed(1);
    const improving = NO_PLAYERS.filter(p => p.delta < -0.5).length;
    return { total, olyo, srixon, elite, avgAll, improving };
  }, []);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <EyebrowJ>NORSKE JUNIORER &amp; AMATØRER · 2026</EyebrowJ>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TONE_J.text, margin: '4px 0 0', letterSpacing: '-0.02em' }}>
            Treneroversikt <span style={{ color: TONE_J.mute, fontWeight: 500 }}>OLYO · Srixon · Elite</span>
          </h1>
          <div style={{ fontSize: 12, color: TONE_J.mute, marginTop: 6 }}>
            Komplett database. Søk, filtrer på alder/nivå/region/klubb. Sortér på snitt brutto, beste runde, progresjon.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'table',    icon: 'list',     label: 'Tabell' },
            { id: 'grid',     icon: 'users',    label: 'Kort' },
            { id: 'rankings', icon: 'trophy',   label: 'Rangering' },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', fontSize: 12, fontWeight: 600,
              border: `1px solid ${view === v.id ? TONE_J.green : TONE_J.line}`,
              background: view === v.id ? TONE_J.green : '#fff',
              color: view === v.id ? '#fff' : TONE_J.text,
              borderRadius: 6, cursor: 'pointer',
            }}>
              <IconJ name={v.icon} size={14} stroke={2} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <KpiJ label="Totalt registrert" value={stats.total} sub="aktive 2026" />
        <KpiJ label="OLYO Tour" value={stats.olyo} sub="U14 · U16 · U18" />
        <KpiJ label="Srixon Junior" value={stats.srixon} sub="invitasjon · høyt nivå" tone="dark" />
        <KpiJ label="Elite Senior" value={stats.elite} sub="Norgescup · 19–25 år" />
        <KpiJ label="Sterk progresjon" value={stats.improving} sub="Δ snitt < -0,5 vs ifjor" tone="lime" />
      </div>

      {/* Filter row */}
      <CardJ pad={14} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px', minWidth: 240,
          background: TONE_J.paper, padding: '8px 12px', borderRadius: 8 }}>
          <IconJ name="search" size={14} color={TONE_J.mute} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Søk navn eller klubb…"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: 13, color: TONE_J.text, fontFamily: 'inherit',
            }}
          />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: TONE_J.mute, fontSize: 14 }}>×</button>}
        </div>
        <FilterPills label="Tour" value={tour} options={TOURS_J} onChange={setTour} />
        <FilterPills label="Nivå" value={level} options={LEVELS_J} onChange={setLevel} />
        <FilterPills label="Region" value={region} options={REGIONS_J} onChange={setRegion} />
        <FilterPills label="Kjønn" value={sex} options={SEXES_J} onChange={setSex} />
      </CardJ>

      {/* Result count + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 13, color: TONE_J.textL }}>
          <b style={{ color: TONE_J.text, fontWeight: 700 }}>{filtered.length}</b> spillere
          {(region !== 'Alle' || tour !== 'Alle' || level !== 'Alle' || sex !== 'Alle' || search) && (
            <span style={{ marginLeft: 8, color: TONE_J.mute }}>· filter aktiv</span>
          )}
        </div>
        {view === 'table' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: TONE_J.mute }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>SORTÉR</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              padding: '5px 8px', border: `1px solid ${TONE_J.line}`, borderRadius: 6,
              fontSize: 12, color: TONE_J.text, background: '#fff', fontFamily: 'inherit',
            }}>
              <option value="avg">Snitt brutto (lav→høy)</option>
              <option value="best">Beste runde (lav→høy)</option>
              <option value="events">Antall turneringer</option>
              <option value="delta">Progresjon (best→sist)</option>
              <option value="wagr">WAGR Junior</option>
              <option value="age">Alder</option>
              <option value="name">Navn</option>
            </select>
          </div>
        )}
      </div>

      {/* Main content */}
      {filtered.length === 0 ? (
        <EmptyState hasFilter={hasFilter} onReset={resetFilters} />
      ) : (
        <>
          {view === 'table'    && <PlayersTable players={paged} pageStart={pageStart} onPlayer={onPlayer} sort={sort} setSort={setSort} />}
          {view === 'grid'     && <PlayersGrid  players={paged} onPlayer={onPlayer} />}
          {view === 'rankings' && <RankingsView  players={filtered} onPlayer={onPlayer} />}
          {view !== 'rankings' && filtered.length > pageSize && (
            <Pagination
              page={page} setPage={setPage}
              totalPages={totalPages}
              pageSize={pageSize} setPageSize={setPageSize}
              start={pageStart + 1} end={pageEnd} total={filtered.length}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ─── EMPTY STATE ──────────────────────────────────────── */
function EmptyState({ hasFilter, onReset }) {
  return (
    <CardJ pad={48} style={{ textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: TONE_J.paper,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <IconJ name="search" size={24} color={TONE_J.mute} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: TONE_J.text, marginBottom: 6 }}>
        {hasFilter ? 'Ingen spillere matcher filtrene' : 'Ingen spillere registrert ennå'}
      </div>
      <div style={{ fontSize: 13, color: TONE_J.textL, maxWidth: 360, margin: '0 auto 16px' }}>
        {hasFilter
          ? 'Prøv å fjerne ett eller flere filter, eller juster søket.'
          : 'Spillere fra OLYO Tour, Srixon Junior og Norgescup vil dukke opp her etter hvert som de registreres.'}
      </div>
      {hasFilter && (
        <button onClick={onReset} style={{
          padding: '9px 18px', borderRadius: 6, border: 'none',
          background: TONE_J.green, color: '#fff', fontWeight: 600, fontSize: 13,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Nullstill filter</button>
      )}
    </CardJ>
  );
}

/* ─── PAGINATION ───────────────────────────────────────── */
function Pagination({ page, setPage, totalPages, pageSize, setPageSize, start, end, total }) {
  const pages = [];
  // window of 5 around current page
  const winStart = Math.max(0, Math.min(page - 2, totalPages - 5));
  const winEnd = Math.min(totalPages, winStart + 5);
  for (let i = winStart; i < winEnd; i++) pages.push(i);

  const NavBtn = ({ children, disabled, onClick, active }) => (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 32, height: 32, padding: '0 10px',
      border: `1px solid ${active ? TONE_J.green : TONE_J.line}`,
      background: active ? TONE_J.green : '#fff',
      color: active ? '#fff' : disabled ? TONE_J.mute : TONE_J.text,
      borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
      opacity: disabled ? 0.4 : 1,
    }}>{children}</button>
  );

  return (
    <CardJ pad={14} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ fontSize: 12, color: TONE_J.textL, fontFamily: 'JetBrains Mono, monospace' }}>
        Viser <b style={{ color: TONE_J.text }}>{start}–{end}</b> av <b style={{ color: TONE_J.text }}>{total}</b>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavBtn disabled={page === 0} onClick={() => setPage(0)}>«</NavBtn>
        <NavBtn disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Forrige</NavBtn>
        {winStart > 0 && <span style={{ padding: '0 4px', color: TONE_J.mute }}>…</span>}
        {pages.map(i => (
          <NavBtn key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</NavBtn>
        ))}
        {winEnd < totalPages && <span style={{ padding: '0 4px', color: TONE_J.mute }}>…</span>}
        <NavBtn disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Neste ›</NavBtn>
        <NavBtn disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</NavBtn>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: TONE_J.mute }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>PER SIDE</span>
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={{
          padding: '5px 8px', border: `1px solid ${TONE_J.line}`, borderRadius: 6,
          fontSize: 12, color: TONE_J.text, background: '#fff', fontFamily: 'inherit',
        }}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
        </select>
      </div>
    </CardJ>
  );
}

/* ─── FILTER PILLS ─────────────────────────────────────── */
function FilterPills({ label, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 600 }}>
        {label.toUpperCase()}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            padding: '5px 10px', fontSize: 11, fontWeight: 600,
            border: `1px solid ${value === o ? TONE_J.green : TONE_J.line}`,
            background: value === o ? TONE_J.green : '#fff',
            color: value === o ? '#fff' : TONE_J.textL,
            borderRadius: 4, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── PLAYERS TABLE ────────────────────────────────────── */
function PlayersTable({ players, onPlayer, sort, setSort, pageStart = 0 }) {
  return (
    <CardJ pad={0}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: TONE_J.paper, borderBottom: `2px solid ${TONE_J.line}` }}>
            <ThJ>#</ThJ>
            <ThJ sortKey="name" sort={sort} setSort={setSort}>Spiller</ThJ>
            <ThJ sortKey="age" sort={sort} setSort={setSort}>Alder</ThJ>
            <ThJ>Klubb · Region</ThJ>
            <ThJ>Tour · Nivå</ThJ>
            <ThJ sortKey="avg" sort={sort} setSort={setSort} num>Snitt</ThJ>
            <ThJ sortKey="best" sort={sort} setSort={setSort} num>Best</ThJ>
            <ThJ num>HCP</ThJ>
            <ThJ sortKey="events" sort={sort} setSort={setSort} num>Turn.</ThJ>
            <ThJ num>T10 · W</ThJ>
            <ThJ sortKey="delta" sort={sort} setSort={setSort} num>Δ '25</ThJ>
            <ThJ sortKey="wagr" sort={sort} setSort={setSort} num>WAGR-Jr</ThJ>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.id} onClick={() => onPlayer && onPlayer(p)}
                style={{
                  borderBottom: `1px solid ${TONE_J.line}`,
                  cursor: 'pointer',
                  background: i % 2 === 0 ? '#fff' : '#FAFCFB',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F4F2'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFCFB'}>
              <TdJ mono color={TONE_J.mute}>{pageStart + i + 1}</TdJ>
              <TdJ>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={p.name} sex={p.sex} />
                  <div>
                    <div style={{ fontWeight: 700, color: TONE_J.text, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 10.5, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace' }}>{p.born} · {p.sex}</div>
                  </div>
                </div>
              </TdJ>
              <TdJ mono>{p.age}</TdJ>
              <TdJ>
                <div style={{ fontSize: 12 }}>{p.club}</div>
                <div style={{ fontSize: 10, color: TONE_J.mute }}>{p.region}</div>
              </TdJ>
              <TdJ>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TourBadge tour={p.tour} />
                  <span style={{ fontSize: 10, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace' }}>{p.level}</span>
                </div>
              </TdJ>
              <TdJ mono num bold color={TONE_J.text} size={14}>{p.avg.toFixed(1).replace('.', ',')}</TdJ>
              <TdJ mono num color={TONE_J.green} bold>{p.best}</TdJ>
              <TdJ mono num color={p.hcp <= 0 ? TONE_J.green : TONE_J.text}>{p.hcp >= 0 ? '+' : ''}{p.hcp.toFixed(1).replace('.', ',')}</TdJ>
              <TdJ mono num>{p.events}</TdJ>
              <TdJ mono num>
                <span style={{ color: TONE_J.text, fontWeight: 600 }}>{p.top10}</span>
                <span style={{ color: TONE_J.mute, margin: '0 4px' }}>·</span>
                <span style={{ color: p.wins > 0 ? TONE_J.green : TONE_J.mute, fontWeight: 700 }}>{p.wins}</span>
              </TdJ>
              <TdJ mono num>
                <span style={{ color: p.delta < 0 ? TONE_J.green : p.delta > 0 ? TONE_J.red : TONE_J.mute, fontWeight: 700 }}>
                  {p.delta < 0 ? '↓' : p.delta > 0 ? '↑' : '→'} {Math.abs(p.delta).toFixed(1).replace('.', ',')}
                </span>
              </TdJ>
              <TdJ mono num color={TONE_J.textL}>#{p.wagrJr}</TdJ>
            </tr>
          ))}
        </tbody>
      </table>
    </CardJ>
  );
}

const ThJ = ({ children, sortKey, sort, setSort, num }) => (
  <th onClick={sortKey ? () => setSort(sortKey) : undefined}
    style={{
      padding: '12px 14px', textAlign: num ? 'right' : 'left',
      fontSize: 10, color: sort === sortKey ? TONE_J.green : TONE_J.mute,
      fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      fontWeight: 700, cursor: sortKey ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
    }}>
    {children}
    {sort === sortKey && <span style={{ marginLeft: 4 }}>↓</span>}
  </th>
);

const TdJ = ({ children, mono, num, bold, color, size = 12 }) => (
  <td style={{
    padding: '10px 14px', textAlign: num ? 'right' : 'left',
    fontSize: size, color: color || TONE_J.textL,
    fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
    fontWeight: bold ? 700 : 400,
    whiteSpace: 'nowrap',
  }}>{children}</td>
);

function Avatar({ name, sex }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const bg = sex === 'M' ? '#0d6b51' : '#9C5BAB';
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.04em', flexShrink: 0,
    }}>{initials}</div>
  );
}

function TourBadge({ tour }) {
  const colors = {
    OLYO:   { bg: '#E0F0DC', fg: '#2D6B25', label: 'OLYO' },
    Srixon: { bg: '#0D2E23', fg: '#D1F843', label: 'Srixon' },
    Elite:  { bg: '#FFF6E0', fg: '#9C7A2E', label: 'Elite' },
  }[tour] || { bg: '#f0f3f1', fg: '#5b6e67', label: tour };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px',
      fontSize: 9.5, fontWeight: 700,
      fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em',
      background: colors.bg, color: colors.fg,
      borderRadius: 3, textTransform: 'uppercase', width: 'fit-content',
    }}>{colors.label}</span>
  );
}

/* ─── PLAYERS GRID (cards) ─────────────────────────────── */
function PlayersGrid({ players, onPlayer }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {players.map(p => (
        <button key={p.id} onClick={() => onPlayer && onPlayer(p)} style={{
          textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0,
          background: 'transparent', fontFamily: 'inherit',
        }}>
          <CardJ style={{ transition: 'all .15s', height: '100%' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = TONE_J.green; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = TONE_J.line; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Avatar name={p.name} sex={p.sex} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: TONE_J.text }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                    {p.born} · {p.age} år · {p.sex}
                  </div>
                </div>
              </div>
              <TourBadge tour={p.tour} />
            </div>
            <div style={{ fontSize: 11.5, color: TONE_J.textL, marginBottom: 12 }}>{p.club} <span style={{ color: TONE_J.mute }}>· {p.region}</span></div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              <CardCellJ label="SNITT"  value={p.avg.toFixed(1).replace('.', ',')} accent={TONE_J.text} />
              <CardCellJ label="BEST"   value={p.best} accent={TONE_J.green} />
              <CardCellJ label="HCP"    value={(p.hcp >= 0 ? '+' : '') + p.hcp.toFixed(1).replace('.', ',')} accent={p.hcp <= 0 ? TONE_J.green : TONE_J.text} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
              <CardCellJ label="TURN."  value={p.events} accent={TONE_J.text} small />
              <CardCellJ label="T10"    value={p.top10}  accent={TONE_J.text} small />
              <CardCellJ label="W"      value={p.wins}   accent={p.wins > 0 ? TONE_J.green : TONE_J.mute} small />
            </div>

            {/* Progression bar */}
            <div style={{
              padding: '8px 10px', background: TONE_J.paper, borderRadius: 6,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>VS 2025</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: p.delta < 0 ? TONE_J.green : p.delta > 0 ? TONE_J.red : TONE_J.mute,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {p.delta < 0 ? '↓' : p.delta > 0 ? '↑' : '→'} {Math.abs(p.delta).toFixed(1).replace('.', ',')} slag
              </span>
            </div>
          </CardJ>
        </button>
      ))}
    </div>
  );
}

const CardCellJ = ({ label, value, accent, small }) => (
  <div style={{ background: TONE_J.paper, padding: small ? '6px 8px' : '8px 10px', borderRadius: 6 }}>
    <div style={{ fontSize: 9, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{label}</div>
    <div style={{ fontSize: small ? 13 : 16, fontWeight: 700, color: accent, fontFamily: 'JetBrains Mono, monospace', marginTop: 2, letterSpacing: '-0.02em' }}>{value}</div>
  </div>
);

/* ─── RANKINGS VIEW ────────────────────────────────────── */
function RankingsView({ players, onPlayer }) {
  const byAvg    = [...players].sort((a, b) => a.avg - b.avg).slice(0, 10);
  const byBest   = [...players].sort((a, b) => a.best - b.best).slice(0, 10);
  const byProg   = [...players].filter(p => p.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 10);
  const byWagr   = [...players].sort((a, b) => a.wagrJr - b.wagrJr).slice(0, 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      <RankList title="Snitt brutto · topp 10"      players={byAvg}   onPlayer={onPlayer} fmt={p => p.avg.toFixed(1).replace('.', ',')} unit="slag" />
      <RankList title="Beste runde · topp 10"        players={byBest}  onPlayer={onPlayer} fmt={p => p.best} unit="" hl />
      <RankList title="Sterkest progresjon · vs '25" players={byProg}  onPlayer={onPlayer} fmt={p => '↓ ' + Math.abs(p.delta).toFixed(1).replace('.', ',')} unit="slag" prog />
      <RankList title="WAGR Junior · topp 10"        players={byWagr}  onPlayer={onPlayer} fmt={p => '#' + p.wagrJr} unit="" />
    </div>
  );
}

function RankList({ title, players, onPlayer, fmt, unit, hl, prog }) {
  return (
    <CardJ>
      <EyebrowJ style={{ marginBottom: 14 }}>{title}</EyebrowJ>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {players.map((p, i) => (
          <button key={p.id} onClick={() => onPlayer && onPlayer(p)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: i === players.length - 1 ? 'none' : `1px solid ${TONE_J.line}`,
            background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit',
          }}>
            <div style={{
              width: 24, fontSize: 11,
              color: i < 3 ? TONE_J.green : TONE_J.mute,
              fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'right',
            }}>{i + 1}</div>
            <Avatar name={p.name} sex={p.sex} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TONE_J.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', display: 'flex', gap: 6 }}>
                <span>{p.age} år</span>
                <span>·</span>
                <span>{p.club}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: hl ? 18 : 14, fontWeight: 700,
                color: prog ? TONE_J.green : (hl ? TONE_J.green : TONE_J.text),
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em',
              }}>{fmt(p)}</div>
              {unit && <div style={{ fontSize: 9.5, color: TONE_J.mute, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{unit}</div>}
            </div>
          </button>
        ))}
      </div>
    </CardJ>
  );
}

/* ─── EXPORT ───────────────────────────────────────────── */
window.PIPELINE_JUNIORS = { JuniorsView, NO_PLAYERS };
