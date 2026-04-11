"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Target,
  BarChart3,
  Flag,
  Trophy,
  Sparkles,
  Settings,
  Bell,
  Search,
  TrendingDown,
  TrendingUp,
  Circle,
  ChevronRight,
  MapPin,
  Clock,
  User,
  Zap,
} from "lucide-react";

/**
 * AK Golf Spillerportal — Ron Design Lab-inspirert prototype
 *
 * Interaktiv mockup med:
 * - Glassmorphism-kort over bilde
 * - Neon lime aksenter (#D1F843)
 * - Overlappende lag
 * - Hover-animasjoner
 * - Tab-switching med state
 * - Live count-opp for stats
 */
export default function RonPreviewPage() {
  const [activeTab, setActiveTab] = useState<"oversikt" | "statistikk" | "trening">("oversikt");
  const [handicap, setHandicap] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Animert count-opp ved mount
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const interval = duration / steps;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      const p = i / steps;
      setHandicap(Number((14.2 * p).toFixed(1)));
      setRounds(Math.round(24 * p));
      setBestScore(Math.round(78 * p));
      if (i >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F3F2] text-[#0F1F1A] font-[Inter] overflow-hidden">
      {/* ═══════ HERO BACKGROUND ═══════ */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#DBE5DF] via-[#F0F3F2] to-[#E8EEE9]" />
        {/* Radial golf course gradient */}
        <div
          className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full blur-3xl opacity-30"
          style={{
            background: "radial-gradient(circle, #005840 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #D1F843 0%, transparent 60%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0F1F1A 1px, transparent 1px), linear-gradient(90deg, #0F1F1A 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="fixed left-0 top-0 h-full w-[72px] z-50 flex flex-col items-center py-6 backdrop-blur-xl bg-white/40 border-r border-[#0F1F1A]/5">
        <div className="w-11 h-11 rounded-[14px] bg-[#0F1F1A] flex items-center justify-center mb-10 shadow-lg">
          <span className="text-[#D1F843] font-black text-sm tracking-tight">AK</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: CalendarDays },
            { icon: Target },
            { icon: BarChart3 },
            { icon: Flag },
            { icon: Trophy },
            { icon: Sparkles },
          ].map(({ icon: Icon, active }, i) => (
            <button
              key={i}
              className={`group relative w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-300 cursor-pointer ${
                active
                  ? "bg-[#0F1F1A] shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                  : "hover:bg-white/80"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors ${
                  active ? "text-[#D1F843]" : "text-[#0F1F1A]/40 group-hover:text-[#0F1F1A]"
                }`}
                strokeWidth={1.8}
              />
              {active && (
                <span className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-[#D1F843]" />
              )}
            </button>
          ))}
        </nav>
        <button className="w-12 h-12 rounded-[14px] flex items-center justify-center hover:bg-white/80 transition cursor-pointer">
          <Settings className="w-[18px] h-[18px] text-[#0F1F1A]/40" strokeWidth={1.8} />
        </button>
      </aside>

      {/* ═══════ MAIN ═══════ */}
      <main className="ml-[72px] min-h-screen">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#F0F3F2]/70 border-b border-[#0F1F1A]/5">
          <div className="flex items-center justify-between px-10 h-[72px]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F1F1A]/40" />
                <input
                  type="text"
                  placeholder="Søk..."
                  className="w-[260px] h-10 pl-10 pr-4 rounded-full bg-white/60 backdrop-blur-sm border border-[#0F1F1A]/8 text-sm outline-none focus:border-[#005840] focus:bg-white transition-all placeholder:text-[#0F1F1A]/30"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 h-10 rounded-full bg-white/70 border border-[#0F1F1A]/8 flex items-center gap-2 text-[13px] font-medium hover:bg-white transition cursor-pointer">
                <CalendarDays className="w-4 h-4" strokeWidth={1.8} />
                Kalender
              </button>
              <button className="px-4 h-10 rounded-full bg-[#0F1F1A] text-white flex items-center gap-2 text-[13px] font-semibold hover:bg-[#1a2d27] transition cursor-pointer">
                <Sparkles className="w-4 h-4 text-[#D1F843]" strokeWidth={2} />
                AI Coach
              </button>
              <button className="relative w-10 h-10 rounded-full bg-white/70 border border-[#0F1F1A]/8 flex items-center justify-center hover:bg-white transition cursor-pointer">
                <Bell className="w-[18px] h-[18px] text-[#0F1F1A]/60" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D1F843] ring-2 ring-[#F0F3F2]" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005840] to-[#0F1F1A] ring-2 ring-[#D1F843]/60 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-10 pt-10 pb-20 max-w-[1600px] mx-auto">
          {/* ═══ HERO HEADLINE ═══ */}
          <div className="mb-12 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#0F1F1A]/40 mb-3">
                Fredag 11. april 2026
              </p>
              <h1 className="text-[88px] leading-[0.9] font-black tracking-[-0.04em] text-[#0F1F1A]">
                Hei, Erik.
              </h1>
              <p className="text-[22px] leading-snug text-[#0F1F1A]/50 mt-4 max-w-xl font-light">
                Neste coaching om{" "}
                <span className="text-[#005840] font-semibold">4 dager</span>. Du har 2 økter
                igjen i{" "}
                <span className="text-[#005840] font-semibold">Performance Pro</span>.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#0F1F1A]/8">
              {(["oversikt", "statistikk", "trening"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-full text-[12px] font-semibold capitalize transition-all cursor-pointer ${
                    activeTab === t
                      ? "bg-[#0F1F1A] text-white shadow-md"
                      : "text-[#0F1F1A]/50 hover:text-[#0F1F1A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ BENTO GRID ═══ */}
          <div className="grid grid-cols-12 gap-5">
            {/* HERO CARD — Neste coaching (spans 7) */}
            <div className="col-span-7 row-span-2 group relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0F1F1A] via-[#1a3b30] to-[#005840] p-10 min-h-[420px] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,40,28,0.25)] cursor-pointer">
              {/* Glow bg */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 bg-[#D1F843]" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 bg-white" />

              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />

              <div className="relative h-full flex flex-col justify-between">
                {/* Top: Badge + status */}
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D1F843] text-[#0F1F1A] text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-[#D1F843]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F1F1A] animate-pulse" />
                    Neste coaching
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#D1F843] group-hover:translate-x-1 transition-all" />
                </div>

                {/* Middle: Date + info */}
                <div>
                  <p className="text-[14px] text-[#D1F843]/80 font-semibold uppercase tracking-[0.1em] mb-2">
                    #PF-PRO-041526
                  </p>
                  <h2 className="text-[56px] leading-[1] font-black text-white tracking-[-0.03em] mb-1">
                    Tirsdag
                  </h2>
                  <h2 className="text-[56px] leading-[1] font-black text-white tracking-[-0.03em]">
                    15. april
                  </h2>
                  <div className="flex items-center gap-5 mt-6 text-white/60 text-[13px]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D1F843]" strokeWidth={2} />
                      <span>10:00 — 10:20</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D1F843]" strokeWidth={2} />
                      <span>Gamle Fredrikstad GK</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Coach + CTA */}
                <div className="flex items-end justify-between pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D1F843] to-[#005840] p-[2px]">
                      <div className="w-full h-full rounded-full bg-[#0F1F1A] flex items-center justify-center">
                        <span className="text-[#D1F843] font-bold text-sm">AK</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wide font-semibold">
                        Hovedtrener
                      </p>
                      <p className="text-white text-[15px] font-semibold">
                        Anders Kristiansen
                      </p>
                    </div>
                  </div>
                  <button className="px-6 h-12 rounded-full bg-[#D1F843] text-[#0F1F1A] text-[13px] font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-[#D1F843]/30 cursor-pointer">
                    Se i kalender
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* HANDICAP RING CARD */}
            <div className="col-span-3 relative rounded-[28px] backdrop-blur-xl bg-white/70 border border-[#0F1F1A]/5 p-7 overflow-hidden hover:bg-white/90 transition-all cursor-pointer group">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#D1F843]/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F1F1A]/40">
                    Handicap
                  </p>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#005840]/10 text-[#005840] text-[10px] font-bold">
                    <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                    -1.2
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[64px] font-black leading-none tracking-[-0.04em] text-[#0F1F1A] tabular-nums">
                    {handicap.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-[#0F1F1A]/40 mt-3">Fra 18.5 i april 2025</p>
                {/* Sparkline */}
                <svg className="w-full h-12 mt-4" viewBox="0 0 200 48" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#005840" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#005840" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,10 C30,12 60,18 90,24 C120,30 150,38 180,42 L200,44"
                    fill="none"
                    stroke="#005840"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,10 C30,12 60,18 90,24 C120,30 150,38 180,42 L200,44 L200,48 L0,48 Z"
                    fill="url(#sg)"
                  />
                  <circle cx="200" cy="44" r="4" fill="#D1F843" stroke="#005840" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* ROUNDS CARD */}
            <div className="col-span-2 relative rounded-[28px] backdrop-blur-xl bg-white/70 border border-[#0F1F1A]/5 p-7 hover:bg-white/90 transition-all cursor-pointer group">
              <Flag className="w-5 h-5 text-[#0F1F1A]/30 mb-3" strokeWidth={1.5} />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F1F1A]/40 mb-2">
                Runder
              </p>
              <div className="text-[48px] font-black leading-none tracking-[-0.04em] text-[#0F1F1A] tabular-nums">
                {rounds}
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3 text-[#005840]" strokeWidth={2.5} />
                <span className="text-[11px] font-semibold text-[#005840]">+6 denne måneden</span>
              </div>
            </div>

            {/* TRACKMAN LIVE CARD */}
            <div className="col-span-3 relative rounded-[28px] bg-[#0F1F1A] p-7 overflow-hidden group cursor-pointer hover:shadow-[0_24px_60px_rgba(0,40,28,0.3)] transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#D1F843]/10 border border-[#D1F843]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1F843] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#D1F843]">
                  Live
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 mb-3">
                TrackMan Session
              </p>
              <div className="text-[42px] font-black leading-none text-white tabular-nums">
                142
                <span className="text-[18px] font-normal text-white/50 ml-1">mph</span>
              </div>
              <p className="text-[11px] text-white/40 mt-2">Ballhastighet · Driver</p>

              {/* Wave visualization */}
              <div className="flex items-end gap-[2px] h-12 mt-5">
                {Array.from({ length: 50 }).map((_, i) => {
                  const h = 20 + Math.sin(i * 0.3) * 30 + Math.random() * 20;
                  const isCenter = i > 15 && i < 35;
                  return (
                    <div
                      key={i}
                      className="w-[2px] rounded-full flex-1"
                      style={{
                        height: `${h}%`,
                        background: isCenter ? "#D1F843" : "rgba(209,248,67,0.2)",
                        transition: "height 0.3s",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* BEST SCORE CARD */}
            <div className="col-span-2 relative rounded-[28px] backdrop-blur-xl bg-white/70 border border-[#0F1F1A]/5 p-7 hover:bg-white/90 transition-all cursor-pointer group">
              <Trophy className="w-5 h-5 text-[#0F1F1A]/30 mb-3" strokeWidth={1.5} />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F1F1A]/40 mb-2">
                Beste score
              </p>
              <div className="text-[48px] font-black leading-none tracking-[-0.04em] text-[#0F1F1A] tabular-nums">
                {bestScore}
              </div>
              <p className="text-[11px] text-[#0F1F1A]/40 mt-3">Gamle Fredrikstad · +6</p>
            </div>

            {/* AI INSIGHT CARD — full width */}
            <div className="col-span-7 relative rounded-[28px] backdrop-blur-xl bg-white/70 border border-[#0F1F1A]/5 p-8 overflow-hidden hover:bg-white/90 transition-all cursor-pointer group">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-600" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-purple-600">
                      AI-innsikt
                    </span>
                  </div>
                  <h3 className="text-[24px] font-bold text-[#0F1F1A] tracking-tight leading-tight mb-2">
                    Kort spill er ditt største potensial
                  </h3>
                  <p className="text-[14px] text-[#0F1F1A]/60 leading-relaxed mb-5 max-w-xl">
                    Chip shots fra 20-40 meter er 2.1 slag under snitt for din kategori. Fokuser
                    på dette området denne uken for størst effekt på handicap.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10">
                      <span className="text-[11px] font-bold text-purple-600">SG Kort spill</span>
                      <span className="text-[14px] font-black text-purple-600 tabular-nums">-2.1</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#005840]/10">
                      <span className="text-[11px] font-bold text-[#005840]">SG Driving</span>
                      <span className="text-[14px] font-black text-[#005840] tabular-nums">+1.4</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#005840]/10">
                      <span className="text-[11px] font-bold text-[#005840]">SG Putting</span>
                      <span className="text-[14px] font-black text-[#005840] tabular-nums">+0.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRAINING WEEK CARD */}
            <div className="col-span-5 relative rounded-[28px] backdrop-blur-xl bg-white/70 border border-[#0F1F1A]/5 p-7 hover:bg-white/90 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F1F1A]/40">
                    Treningsplan — Uke 16
                  </p>
                  <p className="text-[13px] font-semibold text-[#0F1F1A] mt-1">3 av 5 fullført</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-8 h-1.5 rounded-full bg-[#005840]" />
                  <div className="w-8 h-1.5 rounded-full bg-[#005840]" />
                  <div className="w-8 h-1.5 rounded-full bg-[#005840]" />
                  <div className="w-8 h-1.5 rounded-full bg-[#0F1F1A]/10" />
                  <div className="w-8 h-1.5 rounded-full bg-[#0F1F1A]/10" />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Putting drill — 10-footer", duration: "20 min", done: true, day: "Man" },
                  { name: "Approach 50-100m", duration: "15 min", done: true, day: "Tir" },
                  { name: "Driving range — tempo", duration: "30 min", done: true, day: "Ons" },
                  { name: "Chip shots 20-40m", duration: "20 min", done: false, day: "I dag", active: true },
                  { name: "9 hull — Gamle Fredrikstad", duration: "90 min", done: false, day: "Lør" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      item.active
                        ? "bg-[#D1F843]/20 border border-[#D1F843]/40"
                        : item.done
                        ? "bg-[#0F1F1A]/5 opacity-50"
                        : "hover:bg-[#0F1F1A]/5"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                        item.done
                          ? "bg-[#005840]"
                          : item.active
                          ? "bg-white border-2 border-[#005840]"
                          : "bg-white border border-[#0F1F1A]/20"
                      }`}
                    >
                      {item.done && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" strokeWidth="3" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#0F1F1A]">{item.name}</p>
                      <p className="text-[11px] text-[#0F1F1A]/40">{item.duration}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        item.active ? "text-[#005840]" : "text-[#0F1F1A]/30"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
