"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";

// ─── TYPES ──────────────────────────────────────────────────────────
interface V2Exercise {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  cs: string | null;
  m: string | null;
  pr: string | null;
  pFrom: string | null;
  pTo: string | null;
  slagFocus: string[];
  baller: number;
  bevegelser: number;
}

interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  exercises: V2Exercise[];
  done: boolean;
}

interface V2Template {
  id: string;
  title: string;
  dur: number;
  focus: string;
  exercises: V2Exercise[];
}

interface LiveSession {
  id: string;
  title: string;
  focus: string | null;
  startedAt: number;
  paused: boolean;
  pausedElapsed: number;
  _ps?: number;
  exercises: V2Exercise[];
}

interface RefItem {
  code: string;
  name?: string;
  desc?: string;
  pct?: string;
  icon?: string;
}

export interface TrainingPlannerV2Props {
  events: V2Event[];
  templates: V2Template[];
  planId: string | null;
  onSaveEvent?: (event: V2Event) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  onMoveEvent?: (eventId: string, date: string, startH: number, startM: number) => Promise<void>;
  onResizeEvent?: (eventId: string, durationMinutes: number) => Promise<void>;
  onSaveLiveSession?: (data: {
    durationMinutes: number;
    focusArea: string | null;
    exercises: V2Exercise[];
  }) => Promise<void>;
}

// Inline hex for JS operations where CSS vars don't work
const PYRAMID_HEX: Record<string, string> = {
  FYS: "#B84233",
  TEK: "#C48A32",
  SLAG: "#0A1F18",
  SPILL: "#007AFF",
  TURN: "#AF52DE",
};

const focColor = (f: string): string => PYRAMID_HEX[f] || "#0A1F18";

// ─── AK REFERENCE DATA ────────────────────���─────────────────────
const L_PHASES: RefItem[] = [
  { code: "L-KROPP", name: "Kropp", desc: "Kun kroppsbevegelse uten kolle/ball. Fole riktig bevegelsesmonster." },
  { code: "L-ARM", name: "Arm", desc: "Kropp + armer, uten kolle/ball. Koordinasjon kropp-armer." },
  { code: "L-KOLLE", name: "Kolle", desc: "Kropp + armer + kolle, ingen ball. Sakte med posisjonsfokus." },
  { code: "L-BALL", name: "Ball", desc: "Alt inkludert, lav hastighet. Fokus pa folelse, ikke resultat." },
  { code: "L-AUTO", name: "Auto", desc: "Full hastighet, automatisert. Teknikken kjores pa autopilot." },
];

const CS_LEVELS: RefItem[] = [
  { code: "CS0", pct: "0%", desc: "Ingen sving — FYS, L-KROPP, L-ARM." },
  { code: "CS20", pct: "20%", desc: "Posisjonskontroll. Svaert langsom." },
  { code: "CS30", pct: "30%", desc: "Langsom oving med sekvensfokus." },
  { code: "CS40", pct: "40%", desc: "Koordinasjon. Start av L-BALL." },
  { code: "CS50", pct: "50%", desc: "Minimum for balltrening." },
  { code: "CS60", pct: "60%", desc: "Konsistens. Balanse kontroll/hastighet." },
  { code: "CS70", pct: "70%", desc: "Konkurranselignende hastighet." },
  { code: "CS80", pct: "80%", desc: "Hoy intensitet. Tester teknikk." },
  { code: "CS90", pct: "90%", desc: "Naer-maksimal. Breaking point." },
  { code: "CS100", pct: "100%", desc: "Maksimal. Kun L-AUTO." },
];

const M_ENVS: RefItem[] = [
  { code: "M0", name: "Off-course", desc: "Gym, hjemme." },
  { code: "M1", name: "Innendors", desc: "Simulator, TrackMan." },
  { code: "M2", name: "Range", desc: "Utendors driving range." },
  { code: "M3", name: "Ovingsfelt", desc: "Kortbane, putting green." },
  { code: "M4", name: "Bane trening", desc: "Treningsrunde." },
  { code: "M5", name: "Bane turnering", desc: "Turneringsrunde." },
];

const PR_LEVELS: RefItem[] = [
  { code: "PR1", name: "Ingen press", desc: "Utforskende, ingen konsekvens." },
  { code: "PR2", name: "Selvmonitorering", desc: "Tracking, ingen sosial." },
  { code: "PR3", name: "Sosial", desc: "Med andre, observert." },
  { code: "PR4", name: "Konkurranse", desc: "Mot andre med innsats." },
  { code: "PR5", name: "Turnering", desc: "Resultat teller." },
];

const P_POS: RefItem[] = [
  { code: "P1.0", name: "Address" }, { code: "P2.0", name: "Takeaway" },
  { code: "P3.0", name: "Mid-Backswing" }, { code: "P4.0", name: "Topp" },
  { code: "P4.5", name: "Transition midt" }, { code: "P5.0", name: "Transition" },
  { code: "P5.5", name: "Shallowed" }, { code: "P6.0", name: "Delivery" },
  { code: "P6.1", name: "Release-punkt" }, { code: "P6.5", name: "Pre-impact" },
  { code: "P7.0", name: "Impact" }, { code: "P8.0", name: "Release" },
  { code: "P9.0", name: "Follow-through" }, { code: "P10.0", name: "Finish" },
];

const SLAG_FOCUS: { code: string; name: string; desc: string; icon: string }[] = [
  { code: "BALL", name: "Ballstart", desc: "Startretning — avvik fra siktelinje.", icon: "◎" },
  { code: "SKRU", name: "Skru", desc: "Sidespin, draw/fade-kontroll.", icon: "↻" },
  { code: "LENGDE", name: "Lengdekontroll", desc: "Differanse onsket vs faktisk carry.", icon: "↕" },
  { code: "SPRED", name: "Spredning", desc: "Gruppering, 80%-sirkel radius.", icon: "◉" },
];

const PYRAMID = [
  { key: "FYS", label: "FYS", full: "Fysisk", color: PYRAMID_HEX.FYS, w: 100 },
  { key: "TEK", label: "TEK", full: "Teknikk", color: PYRAMID_HEX.TEK, w: 82 },
  { key: "SLAG", label: "SLAG", full: "Slagtrening", color: PYRAMID_HEX.SLAG, w: 64 },
  { key: "SPILL", label: "SPILL", full: "Spill", color: PYRAMID_HEX.SPILL, w: 46 },
  { key: "TURN", label: "TURN", full: "Turnering", color: PYRAMID_HEX.TURN, w: 28 },
];

const AREAS: Record<string, { code: string; name: string }[]> = {
  FYS: [{ code: "STYRKE", name: "Styrke" }, { code: "MOBILITET", name: "Mobilitet" }, { code: "POWER", name: "Power" }],
  TEK: [
    { code: "TEE", name: "Tee / Utslag" }, { code: "INN200", name: "Innspill 200+" },
    { code: "INN150", name: "Innspill 150-200" }, { code: "INN100", name: "Innspill 100-150" },
    { code: "INN50", name: "Innspill 50-100" }, { code: "CHIP", name: "Chip" },
    { code: "PITCH", name: "Pitch" }, { code: "LOB", name: "Lob" },
    { code: "BUNKER", name: "Bunker" }, { code: "PUTT0-3", name: "Putt 0-3 ft" },
    { code: "PUTT3-5", name: "Putt 3-5 ft" }, { code: "PUTT5-10", name: "Putt 5-10 ft" },
    { code: "PUTT10-15", name: "Putt 10-15 ft" }, { code: "PUTT15-25", name: "Putt 15-25 ft" },
    { code: "PUTT25-40", name: "Putt 25-40 ft" }, { code: "PUTT40+", name: "Putt 40+ ft" },
  ],
  SLAG: [
    { code: "TEE", name: "Tee" }, { code: "INN200", name: "Innspill 200+" },
    { code: "INN150", name: "Innspill 150-200" }, { code: "INN100", name: "Innspill 100-150" },
    { code: "INN50", name: "Innspill 50-100" }, { code: "CHIP", name: "Chip" },
    { code: "PITCH", name: "Pitch" }, { code: "LOB", name: "Lob" },
    { code: "BUNKER", name: "Bunker" }, { code: "PUTT5-10", name: "Putt 5-10 ft" },
  ],
  SPILL: [{ code: "TRENING_9", name: "9 hull" }, { code: "TRENING_18", name: "18 hull" }, { code: "MATCH", name: "Matchplay" }],
  TURN: [{ code: "RES", name: "Resultat" }, { code: "UTV", name: "Utvikling" }],
};

function autoFill(pyr: string, area: string | null): Partial<V2Exercise> {
  if (pyr === "FYS") return { lPhase: "L-KROPP", cs: "CS0", m: "M0", pr: "PR1", pFrom: null, pTo: null, slagFocus: [] };
  if (pyr === "TURN") return { lPhase: null, cs: null, m: "M5", pr: "PR5", pFrom: null, pTo: null, slagFocus: [] };
  if (pyr === "SPILL") return { lPhase: null, cs: null, m: "M4", pr: "PR3", pFrom: null, pTo: null, slagFocus: [] };
  if (pyr === "SLAG") return { lPhase: null, cs: null, m: area?.startsWith("PUTT") ? "M3" : "M2", pr: "PR2", pFrom: null, pTo: null, slagFocus: ["BALL", "LENGDE"] };
  const ip = area?.startsWith("PUTT");
  return { lPhase: "L-BALL", cs: "CS60", m: ip ? "M3" : "M2", pr: "PR2", pFrom: "P6.0", pTo: "P7.0", slagFocus: [] };
}

function formulaStr(ex: V2Exercise): string {
  const p: string[] = [ex.pyramid, ex.area];
  if (ex.pyramid === "SLAG") {
    if (ex.slagFocus?.length) p.push(ex.slagFocus.join("+"));
  } else {
    if (ex.lPhase) p.push(ex.lPhase);
    if (ex.cs && ex.cs !== "—") p.push(ex.cs);
  }
  if (ex.m) p.push(ex.m);
  if (ex.pr) p.push(ex.pr);
  if (ex.pyramid === "TEK" && ex.pFrom && ex.pTo) p.push(`${ex.pFrom}-${ex.pTo}`);
  return p.join("_");
}

// ─── HELPERS ─────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const SH = 5, EH = 22, TH = 17, HH = 64, SM = 15, GH = TH * HH;
const DN = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
const DF = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lordag", "Sondag"];
const MN = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const MS = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
const t2y = (h: number, m: number) => ((h - SH) + m / 60) * HH;
const y2t = (y: number) => { const t = Math.round(((y / HH) * 60 + SH * 60) / SM) * SM; return { h: Math.floor(t / 60), m: t % 60 }; };
const fmt = (h: number, m: number) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
const dk = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const isTodayFn = (d: Date) => dk(d) === dk(new Date());
const getMon = (d: Date) => { const dt = new Date(d); const day = dt.getDay(); dt.setDate(dt.getDate() - (day === 0 ? 6 : day - 1)); dt.setHours(0, 0, 0, 0); return dt; };
const addD = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const wkN = (d: Date) => { const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dy = dt.getUTCDay() || 7; dt.setUTCDate(dt.getUTCDate() + 4 - dy); const y0 = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1)); return Math.ceil(((dt.getTime() - y0.getTime()) / 864e5 + 1) / 7); };
const eTime = (ev: V2Event) => { const t = ev.startH * 60 + ev.startM + ev.dur; return { h: Math.floor(t / 60), m: t % 60 }; };
const fmtEl = (ms: number) => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; };

// ─── DEFAULT TEMPLATES ────────────���─────────────────────────────
const DEFAULT_TEMPLATES: V2Template[] = [
  { id: "t1", title: "Putting-drill", dur: 20, focus: "TEK", exercises: [] },
  { id: "t2", title: "Short game", dur: 30, focus: "SLAG", exercises: [] },
  { id: "t3", title: "Driving range", dur: 45, focus: "SLAG", exercises: [] },
  { id: "t4", title: "Styrke-okt", dur: 50, focus: "FYS", exercises: [] },
  { id: "t5", title: "Spill 9 hull", dur: 120, focus: "SPILL", exercises: [] },
  { id: "t6", title: "Svinganalyse", dur: 40, focus: "TEK", exercises: [] },
];

// ═══ SHARED UI COMPONENTS ════════════════��══════════════════════

function HelpBtn({ title, items, color }: { title: string; items: RefItem[]; color?: string }) {
  const [open, setOpen] = useState(false);
  const btnColor = color || "#7A8C85";
  return (
    <span className="relative inline-flex">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-bold cursor-pointer bg-transparent flex-shrink-0"
        style={{ borderColor: btnColor, color: btnColor }}
      >?</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-[998]" />
          <div onClick={(e) => e.stopPropagation()} className="absolute top-6 -left-2.5 w-[280px] bg-white rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,.18)] z-[999] p-3.5 border border-grey-200">
            <div className="flex justify-between mb-2">
              <div className="text-[13px] font-bold">{title}</div>
              <button onClick={() => setOpen(false)} className="bg-transparent border-none cursor-pointer text-base text-grey-400">x</button>
            </div>
            <div className="max-h-[220px] overflow-y-auto">
              {items.map((it, i) => (
                <div key={i} className={`py-1.5 ${i > 0 ? "border-t border-black/4" : ""}`}>
                  <div className="text-[11px] font-bold" style={{ color: btnColor }}>
                    {it.code}{it.pct ? ` (${it.pct})` : ""}{it.name && it.code !== it.name ? ` — ${it.name}` : ""}
                  </div>
                  <div className="text-[10px] text-grey-400 mt-0.5 leading-[1.4]">{it.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </span>
  );
}

function ParamPick({ label, helpTitle, helpItems, options, value, onChange, color, compact }: {
  label: string; helpTitle: string; helpItems: RefItem[]; options: RefItem[];
  value: string | null; onChange: (v: string) => void; color: string; compact?: boolean;
}) {
  return (
    <div className={compact ? "mb-2" : "mb-3"}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">{label}</div>
        <HelpBtn title={helpTitle} items={helpItems} color={color} />
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => {
          const code = opt.code;
          const sel = value === code;
          return (
            <button key={code} onClick={() => onChange(code)}
              className="cursor-pointer transition-all duration-150 rounded-lg"
              style={{
                padding: compact ? "3px 8px" : "5px 12px",
                fontSize: compact ? 10 : 11,
                fontWeight: sel ? 700 : 500,
                background: sel ? `${color}15` : "#F5F8F7",
                color: sel ? color : "#324D45",
                border: sel ? `2px solid ${color}` : "2px solid transparent",
              }}
            >{code}</button>
          );
        })}
      </div>
    </div>
  );
}

function SlagFocusPick({ selected, onChange, color, compact }: {
  selected: string[]; onChange: (v: string[]) => void; color: string; compact?: boolean;
}) {
  const toggle = (c: string) => {
    const n = selected.includes(c) ? selected.filter((x) => x !== c) : [...selected, c];
    onChange(n);
  };
  return (
    <div className={compact ? "mb-2" : "mb-3"}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">Slagfokus</div>
        <HelpBtn title="Slagkvalitet" items={SLAG_FOCUS.map((sf) => ({ code: sf.code, name: sf.name, desc: sf.desc }))} color={color} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {SLAG_FOCUS.map((sf) => {
          const sel = selected.includes(sf.code);
          return (
            <button key={sf.code} onClick={() => toggle(sf.code)}
              className="text-left cursor-pointer transition-all duration-150 rounded-[10px]"
              style={{
                padding: compact ? "6px 8px" : "10px 12px",
                background: sel ? `${color}12` : "#F5F8F7",
                border: sel ? `2px solid ${color}` : "2px solid #F5F8F7",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{sf.icon}</span>
                <div className="text-[11px] font-bold" style={{ color: sel ? color : "#0A1F18" }}>{sf.name}</div>
                {sel && (
                  <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: color }}>
                    <span className="text-white text-[9px] font-bold">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PPosPick({ from, to, onChange, color }: {
  from: string | null; to: string | null; onChange: (f: string | null, t: string | null) => void; color: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">P-Posisjon</div>
        <HelpBtn title="P-Posisjoner" items={P_POS.map((p) => ({ code: p.code, name: p.name, desc: `Svingposisjon: ${p.name}` }))} color={color} />
      </div>
      {([["Fra", from, (v: string) => onChange(v, to)] as const, ["Til", to, (v: string) => onChange(from, v)] as const]).map(([l, val, set]) => (
        <div key={l} className="flex items-center gap-1.5 mb-1">
          <div className="text-[10px] text-grey-400 font-semibold w-6">{l}</div>
          <div className="flex flex-wrap gap-1">
            {P_POS.map((p) => {
              const sel = val === p.code;
              return (
                <button key={p.code} onClick={() => set(p.code)}
                  className="cursor-pointer rounded-[5px]"
                  style={{
                    padding: "2px 5px", fontSize: 9, fontWeight: sel ? 700 : 500,
                    background: sel ? `${color}15` : "#F5F8F7",
                    color: sel ? color : "#7A8C85",
                    border: sel ? `1.5px solid ${color}` : "1.5px solid transparent",
                  }}
                >{p.code}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExerciseParams({ ex, onChange, compact }: {
  ex: V2Exercise; onChange: (patch: Partial<V2Exercise>) => void; compact?: boolean;
}) {
  const color = focColor(ex.pyramid);
  const isSlag = ex.pyramid === "SLAG";
  const isTek = ex.pyramid === "TEK";
  const isFys = ex.pyramid === "FYS";
  return (
    <div className="p-3 bg-grey-50 rounded-[10px]">
      {isTek && (
        <>
          <ParamPick label="L-Fase" helpTitle="Laeringsfaser" helpItems={L_PHASES} options={L_PHASES} value={ex.lPhase} onChange={(v) => onChange({ lPhase: v })} color={color} compact={compact} />
          <ParamPick label="Club Speed" helpTitle="CS-nivaer" helpItems={CS_LEVELS} options={CS_LEVELS} value={ex.cs} onChange={(v) => onChange({ cs: v })} color={color} compact={compact} />
          <PPosPick from={ex.pFrom} to={ex.pTo} onChange={(f, t) => onChange({ pFrom: f, pTo: t })} color={color} />
        </>
      )}
      {isFys && <ParamPick label="L-Fase" helpTitle="Laeringsfaser" helpItems={L_PHASES} options={L_PHASES.slice(0, 2)} value={ex.lPhase} onChange={(v) => onChange({ lPhase: v })} color={color} compact={compact} />}
      {isSlag && <SlagFocusPick selected={ex.slagFocus || []} onChange={(v) => onChange({ slagFocus: v })} color={color} compact={compact} />}
      <ParamPick label="Miljo (M)" helpTitle="Treningsmiljo" helpItems={M_ENVS} options={M_ENVS} value={ex.m} onChange={(v) => onChange({ m: v })} color={color} compact={compact} />
      <ParamPick label="Press (PR)" helpTitle="Pressniva" helpItems={PR_LEVELS} options={PR_LEVELS} value={ex.pr} onChange={(v) => onChange({ pr: v })} color={color} compact={compact} />
    </div>
  );
}

// ═══ EXERCISE ADD FLOW ═════════════════════════════════════════
function ExerciseAddFlow({ onAdd, onClose }: { onAdd: (ex: V2Exercise) => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [pyr, setPyr] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [params, setParams] = useState<Partial<V2Exercise>>({});
  const pickArea = (code: string) => {
    setArea(code);
    const a = (AREAS[pyr!] || []).find((x) => x.code === code);
    setName(a?.name || code);
    setParams(autoFill(pyr!, code));
    setStep(2);
  };
  const confirm = () => {
    onAdd({
      id: uid(), name: name.trim() || `${pyr} ${area}`, pyramid: pyr!,
      area: area!, lPhase: null, cs: null, m: null, pr: null, pFrom: null,
      pTo: null, slagFocus: [], baller: 0, bevegelser: 0, ...params,
    } as V2Exercise);
    onClose();
  };
  const color = pyr ? focColor(pyr) : "#0A1F18";

  return (
    <div>
      {step === 0 && (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">1. Pyramideniva</div>
          <div className="grid grid-cols-5 gap-1.5">
            {PYRAMID.map((p) => (
              <button key={p.key} onClick={() => { setPyr(p.key); setStep(1); }}
                className="py-3 rounded-[10px] cursor-pointer text-center"
                style={{ border: `2px solid ${p.color}30`, background: `${p.color}08` }}
              >
                <div className="text-xs font-extrabold" style={{ color: p.color }}>{p.label}</div>
                <div className="text-[9px] text-grey-400 mt-0.5">{p.full}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && pyr && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-grey-400 border-none cursor-pointer">&#8592;</button>
            <span className="text-xs font-bold" style={{ color }}>{pyr}</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">2. Treningsomrade</div>
          <div className="grid grid-cols-3 gap-1.5 max-h-[200px] overflow-y-auto">
            {(AREAS[pyr] || []).map((a) => (
              <button key={a.code} onClick={() => pickArea(a.code)}
                className="py-2 px-1.5 rounded-lg border border-grey-200 bg-white cursor-pointer text-center text-[11px] font-semibold hover:bg-grey-50 transition-colors"
              >{a.name}</button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && pyr && area && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-grey-400 border-none cursor-pointer">&#8592;</button>
            <span className="text-xs font-bold" style={{ color }}>{pyr} · {area}</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">3. Konfigurer</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ovelsesnavn"
            className="w-full py-2.5 px-3.5 rounded-[10px] border border-grey-200 text-sm outline-none mb-3 box-border bg-white"
          />
          <ExerciseParams
            ex={{ pyramid: pyr, area, lPhase: null, cs: null, m: null, pr: null, pFrom: null, pTo: null, slagFocus: [], ...params } as V2Exercise}
            onChange={(patch) => setParams((p) => ({ ...p, ...patch }))}
          />
          <button onClick={confirm}
            className="w-full mt-2 py-3 rounded-full bg-accent-cta text-black text-sm font-bold border-none cursor-pointer hover:opacity-85 transition-opacity"
          >Legg til</button>
        </div>
      )}
    </div>
  );
}

// ═══ EXERCISE CARD ══════════════════════════════════════════════
function ExerciseCard({ ex, onRemove, onUpdate, showReps, editId, setEditId }: {
  ex: V2Exercise; onRemove: (id: string) => void; onUpdate: (id: string, patch: Partial<V2Exercise>) => void;
  showReps?: boolean; editId: string | null; setEditId: (id: string | null) => void;
}) {
  const isEdit = editId === ex.id;
  const ec = focColor(ex.pyramid);
  const tags = ex.pyramid === "SLAG"
    ? (ex.slagFocus || []).map((sf) => { const o = SLAG_FOCUS.find((s) => s.code === sf); return o ? `${o.icon} ${o.name}` : sf; })
    : [ex.lPhase, ex.cs, ex.pFrom && ex.pTo && `${ex.pFrom}-${ex.pTo}`].filter(Boolean) as string[];

  return (
    <div className="bg-white rounded-xl shadow-card p-3.5 mb-2 relative"
      style={{ borderLeft: `4px solid ${ec}` }}
    >
      <button onClick={() => onRemove(ex.id)} className="absolute top-2 right-2.5 bg-transparent border-none cursor-pointer text-base text-grey-400 hover:text-error transition-colors">x</button>
      <div className="flex items-center gap-1.5 mb-0.5 pr-5">
        <div className="text-[13px] font-bold flex-1 text-black">{ex.name}</div>
        <button onClick={() => setEditId(isEdit ? null : ex.id)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold cursor-pointer border-none transition-colors"
          style={{ background: isEdit ? `${ec}15` : "#F5F8F7", color: isEdit ? ec : "#7A8C85" }}
        >{isEdit ? "Skjul" : "Rediger"}</button>
      </div>
      <div className="text-[10px] font-mono mb-1.5" style={{ color: ec }}>{formulaStr(ex)}</div>

      {!isEdit && tags.length > 0 && (
        <div className={`flex flex-wrap gap-1 ${showReps ? "mb-2.5" : ""}`}>
          {tags.map((v, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: `${ec}10`, color: ec }}>{v}</span>
          ))}
          {[ex.m, ex.pr].filter(Boolean).map((v, i) => (
            <span key={`mp${i}`} className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: `${ec}10`, color: ec }}>{v}</span>
          ))}
        </div>
      )}
      {isEdit && <div className={showReps ? "mb-2.5" : ""}><ExerciseParams ex={ex} onChange={(patch) => onUpdate(ex.id, patch)} compact /></div>}

      {showReps && (
        <div className="flex gap-2.5">
          <div className="flex-1 bg-success/5 rounded-xl py-2 text-center border border-success/20">
            <div className="text-[9px] font-bold text-success uppercase tracking-[0.08em] mb-1">Baller</div>
            <div className="flex items-center justify-center gap-2.5">
              <button onClick={() => onUpdate(ex.id, { baller: Math.max(0, ex.baller - 1) })}
                className="w-[30px] h-[30px] rounded-full border border-grey-200 bg-white cursor-pointer text-base font-bold text-grey-400 flex items-center justify-center"
              >-</button>
              <div className="text-[26px] font-extrabold tabular-nums min-w-[36px]">{ex.baller}</div>
              <button onClick={() => onUpdate(ex.id, { baller: ex.baller + 1 })}
                className="w-11 h-11 rounded-full border-none bg-success cursor-pointer text-xl font-bold text-white flex items-center justify-center shadow-[0_2px_8px_rgba(26,77,54,.25)]"
              >+</button>
            </div>
          </div>
          <div className="flex-1 bg-black/5 rounded-xl py-2 text-center border border-black/15">
            <div className="text-[9px] font-bold text-black uppercase tracking-[0.08em] mb-1">Bevegelser</div>
            <div className="flex items-center justify-center gap-2.5">
              <button onClick={() => onUpdate(ex.id, { bevegelser: Math.max(0, ex.bevegelser - 1) })}
                className="w-[30px] h-[30px] rounded-full border border-grey-200 bg-white cursor-pointer text-base font-bold text-grey-400 flex items-center justify-center"
              >-</button>
              <div className="text-[26px] font-extrabold tabular-nums min-w-[36px]">{ex.bevegelser}</div>
              <button onClick={() => onUpdate(ex.id, { bevegelser: ex.bevegelser + 1 })}
                className="w-11 h-11 rounded-full border-none bg-black cursor-pointer text-xl font-bold text-white flex items-center justify-center shadow-[0_2px_8px_rgba(10,31,24,.18)]"
              >+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════��══════════════
// LIVE TRACKER
// ═════════════════════════════════════════════════════════════════
function LiveTracker({ session, setSession, onEnd, onSaveLive }: {
  session: LiveSession;
  setSession: (s: LiveSession | ((prev: LiveSession) => LiveSession)) => void;
  onEnd: () => void;
  onSaveLive?: TrainingPlannerV2Props["onSaveLiveSession"];
}) {
  const [elapsed, setElapsed] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (session.paused) return;
    const iv = setInterval(() => setElapsed(Date.now() - session.startedAt - session.pausedElapsed), 200);
    return () => clearInterval(iv);
  }, [session.startedAt, session.paused, session.pausedElapsed]);

  const togglePause = () => {
    if (session.paused) setSession({ ...session, paused: false, pausedElapsed: session.pausedElapsed + (Date.now() - (session._ps || 0)) });
    else setSession({ ...session, paused: true, _ps: Date.now() });
  };
  const updateEx = (id: string, patch: Partial<V2Exercise>) => setSession((s: LiveSession) => ({ ...s, exercises: s.exercises.map((e) => e.id === id ? { ...e, ...patch } : e) }));
  const removeEx = (id: string) => { setSession((s: LiveSession) => ({ ...s, exercises: s.exercises.filter((e) => e.id !== id) })); setEditId(null); };
  const addEx = (ex: V2Exercise) => setSession((s: LiveSession) => ({ ...s, focus: s.focus || ex.pyramid, exercises: [...s.exercises, ex] }));
  const totalB = session.exercises.reduce((a, e) => a + e.baller, 0);
  const totalM = session.exercises.reduce((a, e) => a + e.bevegelser, 0);

  const handleSaveAndClose = async () => {
    if (onSaveLive) {
      await onSaveLive({
        durationMinutes: Math.round(elapsed / 60000),
        focusArea: session.focus,
        exercises: session.exercises,
      });
    }
    onEnd();
  };

  if (showSummary) return (
    <div className="max-w-[600px] mx-auto p-6">
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="text-center mb-5">
          <div className="text-[13px] font-bold text-success uppercase tracking-[0.1em]">Okt fullfort</div>
          <div className="text-[44px] font-extrabold tabular-nums mt-2 text-black">{fmtEl(elapsed)}</div>
        </div>
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center"><div className="text-[32px] font-extrabold">{totalB}</div><div className="text-[11px] text-grey-400">Baller</div></div>
          <div className="text-center"><div className="text-[32px] font-extrabold">{totalM}</div><div className="text-[11px] text-grey-400">Bevegelser</div></div>
        </div>
        {session.exercises.map((ex) => (
          <div key={ex.id} className="py-2.5 border-t border-black/4">
            <div className="flex justify-between">
              <div className="text-sm font-semibold">{ex.name}</div>
              <div className="text-sm font-bold tabular-nums">{ex.baller}B + {ex.bevegelser}M</div>
            </div>
            <div className="text-[10px] font-mono mt-1" style={{ color: focColor(ex.pyramid) }}>{formulaStr(ex)}</div>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button onClick={handleSaveAndClose}
            className="px-8 py-3 rounded-full bg-accent-cta text-black text-[15px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity"
          >Lagre og lukk</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto px-4 pt-4 pb-[120px]">
      <div className="bg-white rounded-xl shadow-card text-center mb-4 relative overflow-hidden p-5">
        {session.focus && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: focColor(session.focus) }} />}
        <div className="text-[52px] font-extrabold tabular-nums tracking-tight leading-none mt-2"
          style={{ color: session.paused ? "#7A8C85" : "#0A1F18" }}
        >{fmtEl(elapsed)}</div>
        <div className="text-[11px] text-grey-400 mt-1">{session.paused ? "PAUSET" : "AKTIV OKT"}</div>
        <div className="flex justify-center gap-7 mt-3">
          <div><div className="text-[22px] font-extrabold tabular-nums text-success">{totalB}</div><div className="text-[9px] text-grey-400 uppercase">Baller</div></div>
          <div><div className="text-[22px] font-extrabold tabular-nums">{totalM}</div><div className="text-[9px] text-grey-400 uppercase">Beveg.</div></div>
          <div><div className="text-[22px] font-extrabold tabular-nums">{session.exercises.length}</div><div className="text-[9px] text-grey-400 uppercase">Ovelser</div></div>
        </div>
        <div className="flex justify-center gap-2 mt-3 pb-1">
          <button onClick={togglePause}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer"
            style={{ background: session.paused ? "#D1F843" : "#F5F8F7", color: session.paused ? "#0A1F18" : "#324D45" }}
          >{session.paused ? "Fortsett" : "Pause"}</button>
          <button onClick={() => setShowSummary(true)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-error border-none cursor-pointer"
          >Avslutt</button>
        </div>
      </div>
      {session.exercises.map((ex) => (
        <ExerciseCard key={ex.id} ex={ex} onRemove={removeEx} onUpdate={updateEx} showReps editId={editId} setEditId={setEditId} />
      ))}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}
          className="w-full mt-2 py-3.5 rounded-[14px] border-2 border-dashed border-grey-200 bg-transparent cursor-pointer text-sm font-semibold text-grey-400 hover:bg-grey-50 transition-colors"
        >+ Legg til ovelse</button>
      ) : (
        <div className="bg-white rounded-xl shadow-card mt-2 p-4">
          <div className="flex justify-between mb-3">
            <div className="text-sm font-bold">Ny ovelse</div>
            <button onClick={() => setShowAdd(false)} className="bg-transparent border-none cursor-pointer text-lg text-grey-400">x</button>
          </div>
          <ExerciseAddFlow onAdd={addEx} onClose={() => setShowAdd(false)} />
        </div>
      )}
    </div>
  );
}

// ════════��═════════════════════��═════════════════════════════════���
// PLAN SESSION PANEL
// ════════════════════════════════════════════��════════════════════
function PlanPanel({ initial, onSave, onCancel }: {
  initial: Partial<V2Event> | null;
  onSave: (data: Omit<V2Event, "id" | "date" | "done">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [startH, setStartH] = useState(initial?.startH ?? 9);
  const [startM, setStartM] = useState(initial?.startM ?? 0);
  const [dur, setDur] = useState(initial?.dur ?? 60);
  const [exercises, setExercises] = useState<V2Exercise[]>(initial?.exercises || []);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const focus = exercises.length > 0 ? exercises[0].pyramid : "TEK";

  const updateEx = (id: string, patch: Partial<V2Exercise>) => setExercises((ex) => ex.map((e) => e.id === id ? { ...e, ...patch } : e));
  const removeEx = (id: string) => { setExercises((ex) => ex.filter((e) => e.id !== id)); setEditId(null); };

  const save = () => {
    onSave({ title: title || (exercises.length > 0 ? exercises[0].name : "Ny okt"), startH, startM, dur, focus, exercises });
  };

  const hours = Array.from({ length: EH - SH }, (_, i) => SH + i);
  const durations = [15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180];

  return (
    <div className="max-w-[600px] mx-auto px-4 pt-4 pb-[100px]">
      <div className="bg-white rounded-xl shadow-card p-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold">{initial?.id ? "Rediger okt" : "Planlegg okt"}</div>
          <button onClick={onCancel} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-grey-400 border-none cursor-pointer">Avbryt</button>
        </div>
        <div className="mb-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">Oktnavn</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="F.eks. TEK Innspill 150m"
            className="w-full py-2.5 px-3.5 rounded-[10px] border border-grey-200 text-sm outline-none box-border bg-white"
          />
        </div>
        <div className="flex gap-3 mb-3.5">
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">Starttid</div>
            <div className="flex gap-1">
              <select value={startH} onChange={(e) => setStartH(+e.target.value)} className="flex-1 py-2 px-2.5 rounded-lg border border-grey-200 text-sm bg-white outline-none">
                {hours.map((h) => <option key={h} value={h}>{fmt(h, 0)}</option>)}
              </select>
              <select value={startM} onChange={(e) => setStartM(+e.target.value)} className="w-[70px] py-2 px-2.5 rounded-lg border border-grey-200 text-sm bg-white outline-none">
                {[0, 15, 30, 45].map((m) => <option key={m} value={m}>:{String(m).padStart(2, "0")}</option>)}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">Varighet</div>
            <div className="flex flex-wrap gap-1">
              {durations.map((d) => (
                <button key={d} onClick={() => setDur(d)}
                  className="py-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-colors"
                  style={{
                    fontWeight: dur === d ? 700 : 500,
                    background: dur === d ? "#F5F8F7" : "#F5F8F7",
                    color: dur === d ? "#0A1F18" : "#324D45",
                    border: dur === d ? "2px solid #0A1F18" : "2px solid transparent",
                  }}
                >{d}m</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[15px] font-bold">Ovelser ({exercises.length})</div>
        </div>
        {exercises.map((ex) => (
          <ExerciseCard key={ex.id} ex={ex} onRemove={removeEx} onUpdate={updateEx} showReps={false} editId={editId} setEditId={setEditId} />
        ))}
      </div>

      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="w-full py-3.5 rounded-[14px] border-2 border-dashed border-grey-200 bg-transparent cursor-pointer text-sm font-semibold text-grey-400 mb-4 hover:bg-grey-50 transition-colors">+ Legg til ovelse</button>
      ) : (
        <div className="bg-white rounded-xl shadow-card p-4 mb-4">
          <div className="flex justify-between mb-3">
            <div className="text-sm font-bold">Ny ovelse</div>
            <button onClick={() => setShowAdd(false)} className="bg-transparent border-none cursor-pointer text-lg text-grey-400">x</button>
          </div>
          <ExerciseAddFlow onAdd={(ex) => setExercises((e) => [...e, ex])} onClose={() => setShowAdd(false)} />
        </div>
      )}

      <button onClick={save}
        className="w-full py-3.5 rounded-full bg-accent-cta text-black text-[15px] font-bold border-none cursor-pointer shadow-[0_2px_8px_rgba(10,31,24,.15)] hover:opacity-85 transition-opacity"
      >{initial?.id ? "Oppdater okt" : "Lagre til kalender"}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════���═════════════════
// PLANNER (Calendar)
// ═════════════════════════════════════════���═══════════════════════
function Planner({ events: initialEvents, templates, startLive, onSaveEvent, onDeleteEvent, onMoveEvent, onResizeEvent }: {
  events: V2Event[];
  templates: V2Template[];
  startLive: (ev: V2Event | null) => void;
  onSaveEvent?: TrainingPlannerV2Props["onSaveEvent"];
  onDeleteEvent?: TrainingPlannerV2Props["onDeleteEvent"];
  onMoveEvent?: TrainingPlannerV2Props["onMoveEvent"];
  onResizeEvent?: TrainingPlannerV2Props["onResizeEvent"];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [planning, setPlanning] = useState<null | { date: string; startH: number; startM: number } | string>(null);
  const monday = getMon(baseDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addD(monday, i));
  const nav = (dir: number) => setBaseDate((d) => {
    const n = new Date(d);
    if (view === "day") n.setDate(n.getDate() + dir);
    else if (view === "week") n.setDate(n.getDate() + dir * 7);
    else n.setMonth(n.getMonth() + dir);
    return n;
  });
  const updateEvent = useCallback((id: string, p: Partial<V2Event>) => setEvents((ev) => ev.map((e) => e.id === id ? { ...e, ...p } : e)), []);
  const addEvent = useCallback((e: V2Event) => setEvents((ev) => [...ev, e]), []);
  const removeEvent = useCallback((id: string) => { setEvents((ev) => ev.filter((e) => e.id !== id)); setSelected(null); if (onDeleteEvent) onDeleteEvent(id); }, [onDeleteEvent]);
  const headerTitle = useMemo(() => {
    if (view === "day") { const di = baseDate.getDay() === 0 ? 6 : baseDate.getDay() - 1; return `${DF[di]} ${baseDate.getDate()}. ${MN[baseDate.getMonth()]}`; }
    if (view === "week") return `Uke ${wkN(monday)} · ${weekDates[0].getDate()}. ${MS[weekDates[0].getMonth()]} - ${weekDates[6].getDate()}. ${MS[weekDates[6].getMonth()]}`;
    return `${MN[baseDate.getMonth()].charAt(0).toUpperCase() + MN[baseDate.getMonth()].slice(1)} ${baseDate.getFullYear()}`;
  }, [view, baseDate, monday, weekDates]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{
    mode: "move" | "resize"; id: string; startY: number;
    origH: number; origM: number; origDur: number; dur: number;
  } | null>(null);
  const [nowY, setNowY] = useState(0);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = t2y(6, 30); }, [view]);
  useEffect(() => { const t = () => { const n = new Date(); setNowY(t2y(n.getHours(), n.getMinutes())); }; t(); const iv = setInterval(t, 30000); return () => clearInterval(iv); }, []);
  const dates = useMemo(() => view === "day" ? [baseDate] : weekDates, [view, baseDate, weekDates]);
  const getDateIdx = useCallback((x: number) => { if (!colsRef.current) return 0; const r = colsRef.current.getBoundingClientRect(); return clamp(Math.floor((x - r.left) / (r.width / dates.length)), 0, dates.length - 1); }, [dates]);

  useEffect(() => {
    if (!drag) return;
    const onM = (e: MouseEvent) => {
      const dy = e.clientY - drag.startY;
      if (drag.mode === "resize") {
        const dm = Math.round(((dy / HH) * 60) / SM) * SM;
        updateEvent(drag.id, { dur: clamp(drag.origDur + dm, SM, (EH * 60) - (drag.origH * 60 + drag.origM)) });
      } else {
        const dm = Math.round(((dy / HH) * 60) / SM) * SM;
        const tm = clamp(drag.origH * 60 + drag.origM + dm, SH * 60, EH * 60 - drag.dur);
        updateEvent(drag.id, { startH: Math.floor(tm / 60), startM: tm % 60, date: dk(dates[getDateIdx(e.clientX)]) });
      }
    };
    const onU = () => {
      // Persist drag result
      const ev = events.find((ev) => ev.id === drag.id);
      if (ev) {
        if (drag.mode === "resize" && onResizeEvent) onResizeEvent(ev.id, ev.dur);
        else if (drag.mode === "move" && onMoveEvent) onMoveEvent(ev.id, ev.date, ev.startH, ev.startM);
      }
      setDrag(null);
    };
    window.addEventListener("mousemove", onM);
    window.addEventListener("mouseup", onU);
    return () => { window.removeEventListener("mousemove", onM); window.removeEventListener("mouseup", onU); };
  }, [drag, updateEvent, getDateIdx, dates, events, onMoveEvent, onResizeEvent]);

  const ev = selected ? events.find((e) => e.id === selected) : null;

  if (planning !== null) {
    const isEdit = typeof planning === "string";
    const editEv = isEdit ? events.find((e) => e.id === planning) : null;
    const initial = isEdit ? editEv : { startH: (planning as { startH: number }).startH, startM: (planning as { startM: number }).startM, dur: 60, title: "", exercises: [] };
    return (
      <PlanPanel
        initial={initial as Partial<V2Event>}
        onSave={async (data) => {
          if (isEdit) {
            updateEvent(planning as string, data);
            const updated = { ...editEv!, ...data };
            if (onSaveEvent) await onSaveEvent(updated);
          } else {
            const newEv: V2Event = { id: uid(), date: (planning as { date: string }).date, ...data, done: false };
            addEvent(newEv);
            if (onSaveEvent) await onSaveEvent(newEv);
          }
          setPlanning(null);
        }}
        onCancel={() => setPlanning(null)}
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-53px)] overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-black/4 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => nav(-1)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-black border-none cursor-pointer">&#8592;</button>
            <button onClick={() => nav(1)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-black border-none cursor-pointer">&#8594;</button>
            <button onClick={() => setBaseDate(new Date())} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-cta text-black border-none cursor-pointer">I dag</button>
            <span className="text-[17px] font-bold ml-2 tracking-tight">{headerTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPlanning({ date: dk(new Date()), startH: 9, startM: 0 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/10 text-black border-none cursor-pointer hover:bg-black/15 transition-colors"
            >+ Planlegg okt</button>
            <div className="flex gap-1 bg-grey-50 rounded-lg p-[3px]">
              {([["day", "Dag"], ["week", "Uke"], ["month", "Maned"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setView(k)} className="py-1.5 px-3.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all"
                  style={{ background: view === k ? "white" : "transparent", color: view === k ? "#0A1F18" : "#324D45", boxShadow: view === k ? "0 1px 2px rgba(0,0,0,.06)" : "none" }}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>

        {view === "month" ? (
          <MonthView baseDate={baseDate} events={events} onSelect={setSelected} setView={setView} setBaseDate={setBaseDate} />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Day headers */}
            <div className="flex bg-white border-b border-grey-200 flex-shrink-0">
              <div className="w-[50px] flex-shrink-0" />
              <div className="flex flex-1">
                {dates.map((d, i) => {
                  const td = isTodayFn(d);
                  const di = d.getDay() === 0 ? 6 : d.getDay() - 1;
                  return (
                    <div key={i} className={`flex-1 text-center py-1.5 ${i > 0 ? "border-l border-black/4" : ""}`}>
                      <div className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${td ? "text-black" : "text-grey-400"}`}>{DN[di]}</div>
                      <div className={`text-lg font-bold w-7 h-7 rounded-full inline-flex items-center justify-center mt-0.5 tabular-nums ${td ? "bg-black text-white" : "text-black"}`}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Time grid */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <div className="flex" style={{ minHeight: GH, userSelect: drag ? "none" : "auto" }}>
                <div className="w-[50px] flex-shrink-0">
                  {Array.from({ length: TH }, (_, i) => (
                    <div key={i} className="flex items-start justify-end pr-1.5" style={{ height: HH }}>
                      <span className="text-[10px] text-grey-400 tabular-nums -translate-y-1.5">{fmt(SH + i, 0)}</span>
                    </div>
                  ))}
                </div>
                <div ref={colsRef} className="flex flex-1">
                  {dates.map((date, di) => {
                    const d = dk(date);
                    const dayEv = events.filter((e) => e.date === d);
                    const td = isTodayFn(date);
                    return (
                      <div key={di} className={`flex-1 relative ${di > 0 ? "border-l border-black/4" : ""}`}
                        onDoubleClick={(e) => {
                          if (e.target !== e.currentTarget && !(e.target as HTMLElement).dataset.grid) return;
                          const scrollTop = scrollRef.current?.scrollTop || 0;
                          const containerTop = scrollRef.current?.getBoundingClientRect().top || 0;
                          const y = e.clientY - containerTop + scrollTop;
                          const t = y2t(y);
                          setPlanning({ date: dk(dates[di]), startH: t.h, startM: t.m });
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const scrollTop = scrollRef.current?.scrollTop || 0;
                          const containerTop = scrollRef.current?.getBoundingClientRect().top || 0;
                          const y = e.clientY - containerTop + scrollTop;
                          const t = y2t(y);
                          const tR = e.dataTransfer.getData("template");
                          if (tR) {
                            const tpl = JSON.parse(tR) as V2Template;
                            const newEv: V2Event = { id: uid(), date: dk(dates[di]), startH: t.h, startM: t.m, dur: tpl.dur, title: tpl.title, focus: tpl.focus, exercises: [], done: false };
                            addEvent(newEv);
                            if (onSaveEvent) onSaveEvent(newEv);
                          }
                        }}
                      >
                        {/* Grid lines */}
                        {Array.from({ length: TH }, (_, i) => (
                          <div key={i} data-grid="true" className="absolute left-0 right-0 border-t border-black/4 pointer-events-none" style={{ top: i * HH, height: HH }}>
                            <div data-grid="true" className="absolute left-0 right-0 border-t border-dashed border-black/4" style={{ top: HH / 2 }} />
                          </div>
                        ))}
                        <div style={{ height: GH }} data-grid="true" />
                        {/* Now line */}
                        {td && nowY > 0 && nowY < GH && (
                          <div className="absolute left-0 right-0 z-[12] pointer-events-none" style={{ top: nowY }}>
                            <div className="w-2 h-2 rounded-full bg-error absolute -left-1 -top-1" />
                            <div className="h-0.5 bg-error ml-1" />
                          </div>
                        )}
                        {/* Events */}
                        {dayEv.map((ev) => {
                          const top = t2y(ev.startH, ev.startM);
                          const h = Math.max((ev.dur / 60) * HH, 22);
                          const c = focColor(ev.focus);
                          const sel = selected === ev.id;
                          const dg = drag?.id === ev.id;
                          const et = eTime(ev);
                          const exCount = ev.exercises?.length || 0;
                          return (
                            <div key={ev.id} className="absolute rounded-[7px] overflow-hidden"
                              style={{
                                top, left: 3, right: 3, height: h,
                                background: ev.done ? `${c}10` : `${c}14`,
                                border: `1.5px solid ${sel ? c : `${c}40`}`,
                                borderLeft: `4px solid ${c}`,
                                padding: "3px 7px",
                                cursor: dg ? "grabbing" : "grab",
                                zIndex: dg ? 40 : sel ? 15 : 5,
                                boxShadow: dg ? "0 6px 20px rgba(0,0,0,.15)" : "0 1px 2px rgba(0,0,0,.04)",
                                opacity: ev.done ? 0.6 : 1,
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault(); e.stopPropagation(); setSelected(ev.id);
                                setDrag({ mode: "move", id: ev.id, startY: e.clientY, origH: ev.startH, origM: ev.startM, dur: ev.dur, origDur: ev.dur });
                              }}
                              onClick={(e) => { e.stopPropagation(); setSelected(ev.id); }}
                            >
                              <div className="text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={{ textDecoration: ev.done ? "line-through" : "none" }}>{ev.title}</div>
                              {h > 28 && <div className="text-[9px] text-grey-400 tabular-nums">{fmt(ev.startH, ev.startM)}-{fmt(et.h, et.m)}</div>}
                              {h > 42 && <div className="text-[9px] font-bold" style={{ color: c }}>{ev.focus}·{ev.dur}m{exCount > 0 ? ` · ${exCount} ov` : ""}</div>}
                              <div
                                onMouseDown={(e) => {
                                  e.preventDefault(); e.stopPropagation();
                                  setDrag({ mode: "resize", id: ev.id, startY: e.clientY, origDur: ev.dur, origH: ev.startH, origM: ev.startM, dur: ev.dur });
                                }}
                                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex justify-center items-center"
                              >
                                <div className="w-6 h-[3px] rounded-sm" style={{ background: `${c}50` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <div className="w-[260px] border-l border-grey-200 bg-white overflow-y-auto p-3.5 flex flex-col gap-3.5 flex-shrink-0">
        {ev && (() => {
          const et = eTime(ev);
          const exCount = ev.exercises?.length || 0;
          return (
            <div className="bg-grey-50 rounded-xl p-3" style={{ border: `2px solid ${focColor(ev.focus)}30` }}>
              <div className="text-sm font-bold">{ev.title}</div>
              <div className="text-[11px] text-grey-400 mt-0.5">{fmt(ev.startH, ev.startM)} - {fmt(et.h, et.m)} · {ev.dur} min</div>
              {exCount > 0 && (
                <div className="mt-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">{exCount} ovelser planlagt</div>
                  {ev.exercises.map((ex) => (
                    <div key={ex.id} className="py-1 border-b border-black/4">
                      <div className="text-xs font-semibold">{ex.name}</div>
                      <div className="text-[9px] font-mono" style={{ color: focColor(ex.pyramid) }}>{formulaStr(ex)}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                <button onClick={() => startLive(ev)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-cta text-black border-none cursor-pointer">Start</button>
                <button onClick={() => setPlanning(ev.id)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/10 text-black border-none cursor-pointer">Rediger</button>
                <button onClick={() => updateEvent(ev.id, { done: !ev.done })}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer"
                  style={{ background: ev.done ? "#F5F8F7" : "#E8F5EF", color: ev.done ? "#324D45" : "#1A4D36" }}
                >{ev.done ? "Angre" : "Fullfort"}</button>
                <button onClick={() => removeEvent(ev.id)} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-grey-50 text-error border-none cursor-pointer">Slett</button>
              </div>
            </div>
          );
        })()}

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">Standard okter</div>
          {(templates.length > 0 ? templates : DEFAULT_TEMPLATES).map((t) => (
            <div key={t.id} draggable onDragStart={(e) => e.dataTransfer.setData("template", JSON.stringify(t))}
              className="py-2 px-2.5 rounded-lg bg-grey-50 border border-black/4 cursor-grab mb-1 hover:bg-grey-50 transition-colors"
            >
              <div className="text-xs font-semibold">{t.title}</div>
              <div className="text-[10px] font-bold" style={{ color: focColor(t.focus) }}>{t.focus}·{t.dur}m</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">Pyramiden</div>
          <div className="flex flex-col items-center gap-1">
            {[...PYRAMID].reverse().map((p) => (
              <div key={p.key} className="py-1 rounded-md text-center text-[10px] font-extrabold tracking-[0.1em]"
                style={{ width: `${p.w}%`, background: `${p.color}18`, color: p.color }}
              >{p.label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════���═══════════════
// MONTH VIEW
// ══════════════════════════════════════��══════════════════════════
function MonthView({ baseDate, events, onSelect, setView, setBaseDate }: {
  baseDate: Date; events: V2Event[];
  onSelect: (id: string) => void;
  setView: (v: "day" | "week" | "month") => void;
  setBaseDate: (d: Date) => void;
}) {
  const year = baseDate.getFullYear(), month = baseDate.getMonth();
  const f1 = new Date(year, month, 1);
  const so = (f1.getDay() + 6) % 7;
  const dim = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inM: boolean }[] = [];
  for (let i = 0; i < so; i++) cells.push({ date: addD(f1, i - so), inM: false });
  for (let i = 1; i <= dim; i++) cells.push({ date: new Date(year, month, i), inM: true });
  while (cells.length % 7) cells.push({ date: addD(new Date(year, month, dim), cells.length - so - dim + 1), inM: false });

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-7 bg-white rounded-[14px] overflow-hidden border border-black/4">
        {DN.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold text-grey-400 uppercase border-b border-black/4">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const d = dk(cell.date);
          const de = events.filter((e) => e.date === d);
          const td = isTodayFn(cell.date);
          return (
            <div key={i} onClick={() => { setBaseDate(cell.date); setView("day"); }}
              className="min-h-[80px] p-1.5 cursor-pointer hover:bg-grey-50/50 transition-colors"
              style={{
                borderRight: (i + 1) % 7 ? "1px solid rgba(0,0,0,0.04)" : "none",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                background: td ? "#F5F8F7" : "transparent",
                opacity: cell.inM ? 1 : 0.35,
              }}
            >
              <div className={`text-xs w-6 h-6 rounded-full inline-flex items-center justify-center tabular-nums ${td ? "font-bold bg-black text-white" : "font-medium text-black"}`}>{cell.date.getDate()}</div>
              {de.slice(0, 2).map((ev) => (
                <div key={ev.id} onClick={(e) => { e.stopPropagation(); onSelect(ev.id); }}
                  className="text-[9px] font-semibold px-1 py-0.5 rounded-sm mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ background: `${focColor(ev.focus)}18`, color: focColor(ev.focus), borderLeft: `2px solid ${focColor(ev.focus)}` }}
                >{ev.title}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════���══════════════════════════���══════════════
// ANALYSE VIEW
// ═════════════════════════════════════════════════════════════════
function AnalyseView() {
  return (
    <div className="p-6 overflow-y-auto max-w-[1200px] mx-auto">
      <div className="text-[22px] font-bold tracking-tight mb-6">Treningsanalyse</div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{ l: "SNITT SCORE", v: "78.4" }, { l: "HANDICAP", v: "6.3" }, { l: "RUNDER", v: "14" }, { l: "SG TOTAL", v: "+1.8" }].map((k) => (
          <div key={k.l} className="bg-white rounded-xl shadow-card p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-1.5">{k.l}</div>
            <div className="text-4xl font-bold tabular-nums text-black leading-none">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-3">Strokes Gained</div>
          {([["Tee", 0.6], ["Approach", 0.8], ["Short Game", -0.2], ["Putting", 0.6]] as const).map(([l, v]) => {
            const p = Math.min(Math.abs(v) / 1.5 * 100, 100);
            return (
              <div key={l} className="mb-2.5">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold">{l}</span>
                  <span className={`text-xs font-bold ${v >= 0 ? "text-success" : "text-error"}`}>{v >= 0 ? "+" : ""}{v.toFixed(1)}</span>
                </div>
                <div className="h-[7px] bg-grey-50 rounded-full relative overflow-hidden">
                  {v >= 0 ? (
                    <div className="absolute left-1/2 h-full rounded-r-full bg-success" style={{ width: `${p / 2}%` }} />
                  ) : (
                    <div className="absolute right-1/2 h-full rounded-l-full bg-error" style={{ width: `${p / 2}%` }} />
                  )}
                  <div className="absolute left-1/2 top-0 w-px h-full bg-surface-container-high" />
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-3">Score-trend</div>
          <Spark data={[82, 80, 79, 81, 78, 77, 80, 78, 76, 79, 78, 77]} w={440} h={80} color="#0A1F18" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-3">HCP 12 mnd</div>
        <Spark data={[8.1, 7.8, 7.5, 7.6, 7.2, 7.0, 6.9, 7.1, 6.8, 6.5, 6.4, 6.3]} w={1100} h={60} color="#1A4D36" />
      </div>
    </div>
  );
}

function Spark({ data, w = 160, h = 40, color = "#0A1F18" }: { data: number[]; w?: number; h?: number; color?: string }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - mn) / r) * (h - 8) - 4]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const gradId = `g${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={color} />}
    </svg>
  );
}

// ══════════════════════════���═════════════════════════��════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════════
export function TrainingPlannerV2({
  events: initialEvents,
  templates,

  onSaveEvent,
  onDeleteEvent,
  onMoveEvent,
  onResizeEvent,
  onSaveLiveSession,
}: TrainingPlannerV2Props) {
  const [tab, setTab] = useState<"planner" | "live" | "analyse">("planner");
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);

  const startLive = (ev: V2Event | null) => {
    setLiveSession({
      id: uid(),
      title: ev?.title || "",
      focus: ev?.focus || null,
      startedAt: Date.now(),
      paused: false,
      pausedElapsed: 0,
      exercises: ev?.exercises?.map((e) => ({ ...e, id: uid(), baller: 0, bevegelser: 0 })) || [],
    });
    setTab("live");
  };

  return (
    <div className="bg-grey-50 min-h-screen text-black text-sm font-sans">
      {/* Tab bar (integrated with portal design) */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-grey-200">
        <div className="flex gap-1 bg-grey-50 rounded-[10px] p-[3px]">
          {([["planner", "Planlegger"], ["analyse", "Analyse"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="py-1.5 px-4 rounded-[7px] text-[13px] font-semibold cursor-pointer border-none transition-all"
              style={{
                background: tab === k ? "white" : "transparent",
                color: tab === k ? "#0A1F18" : "#324D45",
                boxShadow: tab === k ? "0 1px 3px rgba(0,0,0,.08)" : "none",
              }}
            >{l}</button>
          ))}
        </div>
        {!liveSession ? (
          <button onClick={() => startLive(null)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold bg-accent-cta text-black border-none cursor-pointer hover:opacity-85 transition-opacity"
          >Start okt</button>
        ) : (
          <button onClick={() => setTab("live")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold bg-error text-white border-none cursor-pointer"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
            Live
          </button>
        )}
      </div>

      {tab === "live" && liveSession ? (
        <LiveTracker
          session={liveSession}
          setSession={setLiveSession as (s: LiveSession | ((prev: LiveSession) => LiveSession)) => void}
          onEnd={() => { setLiveSession(null); setTab("planner"); }}
          onSaveLive={onSaveLiveSession}
        />
      ) : tab === "planner" ? (
        <Planner
          events={initialEvents}
          templates={templates}
          startLive={startLive}
          onSaveEvent={onSaveEvent}
          onDeleteEvent={onDeleteEvent}
          onMoveEvent={onMoveEvent}
          onResizeEvent={onResizeEvent}
        />
      ) : (
        <AnalyseView />
      )}
    </div>
  );
}
