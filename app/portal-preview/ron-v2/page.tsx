"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Play,
  Flame,
  Target,
  Users,
  Home,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Trophy,
  Zap,
  Activity,
} from "lucide-react";

/**
 * Spillerportal v2 — bygget med 21st.dev-inspirerte komponenter
 * Ekte physics-animasjoner via Framer Motion useSpring
 * 3D tilt-effekter, shimmer, staggered entrance
 *
 * Rute: /portal-preview/ron-v2
 */

// ════════════════════════════════════════════════════════════
// ANIMATED NUMBER — spring physics counter (fra 21st.dev)
// ════════════════════════════════════════════════════════════
function AnimatedNumber({
  value,
  duration = 1500,
  decimals = 0,
  className,
  suffix,
  prefix,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
    duration,
  });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          (prefix ?? "") +
          latest.toFixed(decimals) +
          (suffix ?? "");
      }
    });
  }, [spring, decimals, prefix, suffix]);

  return <span ref={ref} className={className}>{prefix ?? ""}0{suffix ?? ""}</span>;
}

// ════════════════════════════════════════════════════════════
// TILT CARD — 3D perspective mouse-tracking
// ════════════════════════════════════════════════════════════
function TiltCard({
  children,
  className = "",
  tiltStrength = 8,
}: {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mxs = useSpring(x, { stiffness: 200, damping: 20 });
  const mys = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mys, [-0.5, 0.5], [`${tiltStrength}deg`, `-${tiltStrength}deg`]);
  const rotateY = useTransform(mxs, [-0.5, 0.5], [`-${tiltStrength}deg`, `${tiltStrength}deg`]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// SHIMMER — wipe effect on hover
// ════════════════════════════════════════════════════════════
function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STAGGERED REVEAL — fade-up on inview
// ════════════════════════════════════════════════════════════
const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  }),
};

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function RonV2Preview() {
  const [activeTab, setActiveTab] = useState<"oversikt" | "trening" | "statistikk" | "sesjoner">("oversikt");
  const [selectedDay, setSelectedDay] = useState(11);
  const [countdown, setCountdown] = useState({ days: 4, hours: 14, minutes: 32 });
  const [now, setNow] = useState("09:41");

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((p) => {
        const m = p.minutes - 1;
        if (m < 0) {
          const h = p.hours - 1;
          if (h < 0) return { days: p.days - 1, hours: 23, minutes: 59 };
          return { ...p, hours: h, minutes: 59 };
        }
        return { ...p, minutes: m };
      });
      const d = new Date();
      setNow(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#ECF0EF] relative overflow-x-hidden">
      {/* ═══ ATMOSPHERIC BACKGROUND — aurora + grain ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,88,64,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(209,248,67,0.12) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grain noise */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <aside className="fixed left-0 top-0 bottom-0 w-[72px] bg-[#0A1F18] z-50 flex flex-col items-center py-6 gap-1">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
          className="w-11 h-11 rounded-2xl bg-[#D1F843] flex items-center justify-center mb-8 shadow-[0_8px_24px_rgba(209,248,67,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
        >
          <span className="text-[#0A1F18] font-black text-sm tracking-[-0.04em]">AK</span>
        </motion.div>

        <nav className="flex flex-col gap-1 w-full px-3 flex-1">
          {[
            { icon: Home, active: true },
            { icon: Calendar },
            { icon: Target },
            { icon: BarChart3 },
            { icon: Trophy },
            { icon: Users },
            { icon: Activity },
          ].map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              className={`relative w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors duration-200 group ${
                item.active
                  ? "text-[#D1F843]"
                  : "text-white/25 hover:text-white/70"
              }`}
            >
              {item.active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/[0.07] rounded-[14px]"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              {item.active && (
                <div className="absolute left-0 w-[3px] h-6 bg-[#D1F843] rounded-r-full" />
              )}
              <item.icon className="w-[18px] h-[18px] relative z-10" strokeWidth={1.75} />
            </motion.button>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <button className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white/25 hover:text-white/70 transition-colors">
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </button>
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-full cursor-pointer relative p-[2px]"
            style={{
              background: "conic-gradient(from 0deg, #D1F843, #2A7D5A, #0A1F18, #D1F843)",
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#005840] to-[#0A1F18] flex items-center justify-center text-white text-[10px] font-bold">
              EH
            </div>
          </motion.div>
        </div>
      </aside>

      {/* ═══ TOPBAR ═══ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="fixed top-0 left-[72px] right-0 h-14 z-40 backdrop-blur-2xl bg-[#ECF0EF]/60 border-b border-white/40"
      >
        <div className="h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#A5B2AD]" />
              <input
                type="text"
                placeholder="Sok etter runder, drills, notater..."
                className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-full h-8 pl-9 pr-4 text-[11px] w-80 focus:outline-none focus:ring-2 focus:ring-[#005840]/20 placeholder:text-[#A5B2AD] text-[#324D45]"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#324D45]/5 text-[#A5B2AD] border border-[#A5B2AD]/20">
                ⌘K
              </kbd>
            </div>

            <nav className="flex gap-0.5 bg-white/60 backdrop-blur-xl p-0.5 rounded-full border border-white/70">
              {(
                [
                  { id: "oversikt", label: "Oversikt" },
                  { id: "trening", label: "Trening" },
                  { id: "statistikk", label: "Statistikk" },
                  { id: "sesjoner", label: "Sesjoner" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-1.5 rounded-full text-[11px] font-semibold transition-colors duration-300 ${
                    activeTab === tab.id ? "text-white" : "text-[#5A6E66] hover:text-[#324D45]"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-[#0A1F18] rounded-full shadow-md"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-white/60 backdrop-blur-xl border border-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2A7D5A] shadow-[0_0_6px_#2A7D5A]" />
              <span className="text-[10px] font-semibold text-[#324D45]">Live</span>
              <span className="text-[10px] text-[#A5B2AD] tabular-nums">{now}</span>
            </div>

            <button className="relative w-8 h-8 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <Bell className="w-[14px] h-[14px] text-[#324D45]" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D1F843] rounded-full border border-white" />
            </button>

            <div
              className="w-8 h-8 rounded-full cursor-pointer p-[1.5px]"
              style={{
                background: "conic-gradient(from 0deg, #D1F843, #2A7D5A, #0A1F18, #D1F843)",
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#005840] to-[#0A1F18] flex items-center justify-center text-white text-[9px] font-bold">
                EH
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ═══ MAIN ═══ */}
      <main className="ml-[72px] pt-14 relative z-10">
        <div className="max-w-[1600px] mx-auto px-10 pt-12 pb-20">
          {/* ═══ HERO ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] font-bold tracking-[0.22em] text-[#A5B2AD] uppercase mb-4 flex items-center gap-2"
              >
                <span className="w-6 h-px bg-[#A5B2AD]" />
                Fredag 11. april 2026
              </motion.p>
              <h1 className="text-[88px] leading-[0.85] font-[300] text-[#0A1F18] tracking-[-0.055em]">
                Hei,{" "}
                <span className="font-serif italic text-[#005840] font-normal">Erik</span>
                <span className="text-[#D1F843]">.</span>
              </h1>
              <p className="text-[14px] text-[#5A6E66] mt-5 max-w-lg leading-relaxed">
                Neste coaching om{" "}
                <span className="font-semibold text-[#0A1F18] tabular-nums">
                  {countdown.days}d {countdown.hours}t {countdown.minutes}m
                </span>
                . Kort spill er fortsatt ditt storste potensial.
              </p>
            </div>
            <div className="flex gap-2.5">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="h-11 px-6 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#324D45] text-[11px] font-semibold hover:bg-white transition-colors shadow-sm"
              >
                Logg runde
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative h-11 px-6 rounded-full bg-[#D1F843] text-[#0A1F18] text-[11px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
              >
                <Shimmer />
                <Play className="w-3 h-3 fill-[#0A1F18] relative z-10" />
                <span className="relative z-10">Start okt</span>
              </motion.button>
            </div>
          </motion.div>

          {/* ═══ BENTO GRID ═══ */}
          <div className="grid grid-cols-12 gap-4" style={{ perspective: 1200 }}>
            {/* ═══ PROFILE CARD — col 1-4, row 1-2 (tall) ═══ */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-4 row-span-2 relative rounded-[32px] overflow-hidden min-h-[380px] shadow-[0_20px_60px_-20px_rgba(10,31,24,0.25)] group"
            >
              {/* Background — gradient mesh */}
              <div className="absolute inset-0 bg-[#0A1F18]" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(42,125,90,0.5), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(209,248,67,0.15), transparent 60%)",
                }}
              />
              {/* Grain on top */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Top section: Profile photo with gradient ring */}
              <div className="relative p-7 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D1F843]/[0.12] border border-[#D1F843]/25 backdrop-blur-xl"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D1F843]" />
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#D1F843] uppercase">
                      Performance Pro
                    </span>
                  </motion.div>
                  <button className="w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition-colors">
                    <Settings className="w-3.5 h-3.5 text-white/50" strokeWidth={1.8} />
                  </button>
                </div>

                {/* Avatar with orbiting ring */}
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.4 }}
                    className="relative"
                  >
                    {/* Rotating conic ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-6px] rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #D1F843 0%, #2A7D5A 25%, transparent 50%, #D1F843 100%)",
                      }}
                    />
                    <div className="absolute inset-[-2px] rounded-full bg-[#0A1F18]" />

                    {/* Avatar */}
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#005840] to-[#003025] flex items-center justify-center text-[#D1F843] text-[36px] font-[300] tracking-[-0.04em] overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
                      <span className="relative z-10">EH</span>
                      {/* Inner gloss */}
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background:
                            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3), transparent 50%)",
                        }}
                      />
                    </div>

                    {/* Online dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#2A7D5A] border-2 border-[#0A1F18] shadow-[0_0_8px_#2A7D5A]">
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#2A7D5A]"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Name & role */}
                <div className="text-center mb-5">
                  <h3 className="text-[28px] font-[300] text-white tracking-[-0.03em] leading-none">
                    Erik{" "}
                    <span className="font-serif italic text-[#D1F843]">Hansen</span>
                  </h3>
                  <p className="text-[10px] text-white/40 mt-2 tracking-[0.08em]">
                    Medlem siden januar 2025
                  </p>
                </div>

                {/* Stats grid 2x2 */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
                    <div className="flex items-baseline gap-1">
                      <AnimatedNumber
                        value={14.2}
                        decimals={1}
                        className="text-[24px] font-[300] text-white tabular-nums tracking-[-0.03em]"
                      />
                    </div>
                    <p className="text-[8px] text-white/35 uppercase tracking-[0.15em] mt-0.5">
                      Handicap
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
                    <AnimatedNumber
                      value={24}
                      className="text-[24px] font-[300] text-white tabular-nums tracking-[-0.03em] block"
                    />
                    <p className="text-[8px] text-white/35 uppercase tracking-[0.15em] mt-0.5">
                      Runder i 2026
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
                    <AnimatedNumber
                      value={78}
                      className="text-[24px] font-[300] text-[#D1F843] tabular-nums tracking-[-0.03em] block"
                    />
                    <p className="text-[8px] text-white/35 uppercase tracking-[0.15em] mt-0.5">
                      Beste score
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[24px] font-[300] text-white leading-none">+</span>
                      <AnimatedNumber
                        value={3.5}
                        decimals={1}
                        className="text-[24px] font-[300] text-white tabular-nums tracking-[-0.03em]"
                      />
                    </div>
                    <p className="text-[8px] text-white/35 uppercase tracking-[0.15em] mt-0.5">
                      Strokes Gained
                    </p>
                  </div>
                </div>

                {/* Club info footer */}
                <div className="mt-auto pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#D1F843]" strokeWidth={2} />
                      <span className="text-[10px] text-white/60 font-medium">
                        Gamle Fredrikstad GK
                      </span>
                    </div>
                    <button className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#D1F843] hover:text-[#D1F843]/80 transition-colors inline-flex items-center gap-1">
                      Se profil
                      <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HERO CARD — Neste coaching (col 5-9, row 1-2) */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-5 row-span-2 relative rounded-[32px] overflow-hidden min-h-[380px] group cursor-pointer shadow-[0_20px_60px_-20px_rgba(10,31,24,0.3)]"
            >
              {/* Golf course photo */}
              <motion.img
                src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=900&fit=crop&q=85"
                alt="Gamle Fredrikstad GK"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Dark gradient overlay — preserve readability */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1F18] via-[#0A1F18]/85 to-[#0A1F18]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F18] via-transparent to-transparent" />

              {/* Lime spotlight mix */}
              <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 80% at 70% 20%, rgba(209,248,67,0.3), transparent 60%), radial-gradient(ellipse 80% 60% at 30% 100%, rgba(42,125,90,0.5), transparent 60%)",
                }}
              />

              {/* Mesh grid */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.06]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Lime spotlight glow */}
              <div
                className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(209,248,67,0.4) 0%, transparent 50%)",
                  filter: "blur(50px)",
                }}
              />

              {/* Film grain */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nf)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Content */}
              <div className="relative h-full p-10 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#D1F843]/[0.12] border border-[#D1F843]/25 backdrop-blur-xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#D1F843] shadow-[0_0_8px_#D1F843]"
                    />
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#D1F843] uppercase">
                      Neste coaching-time
                    </span>
                  </motion.div>

                  {/* Countdown chips */}
                  <div className="flex gap-1.5">
                    {[
                      { val: countdown.days, label: "DGR" },
                      { val: countdown.hours, label: "TMR" },
                      { val: countdown.minutes, label: "MIN" },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="min-w-[56px] px-3 py-2 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-center"
                      >
                        <div className="text-[22px] font-[300] text-white leading-none tabular-nums tracking-tight">
                          {String(c.val).padStart(2, "0")}
                        </div>
                        <div className="text-[7px] tracking-[0.15em] text-white/40 mt-1">
                          {c.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-3">
                      Tirsdag 15. april
                    </p>
                    <h2 className="text-[56px] leading-[0.9] font-[200] text-white tracking-[-0.045em] mb-1">
                      10:00 <span className="text-white/25">—</span> 10:20
                    </h2>
                  </motion.div>

                  <div className="flex items-center gap-5 mt-5 text-[12px] text-white/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.8} />
                      Gamle Fredrikstad GK
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                      Performance Pro — 20 min
                    </div>
                  </div>

                  {/* Coach pill */}
                  <div className="flex items-center justify-between mt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center gap-3 p-1 pr-5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1]"
                    >
                      <div
                        className="w-10 h-10 rounded-full p-[1.5px]"
                        style={{
                          background:
                            "conic-gradient(from 0deg, #D1F843, #2A7D5A, #0A1F18, #D1F843)",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#005840] to-[#0A1F18] flex items-center justify-center text-[#D1F843] text-[10px] font-bold">
                          AK
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-white">
                          Anders Kristiansen
                        </p>
                        <p className="text-[9px] text-white/40 tracking-wide">
                          Hovedtrener
                        </p>
                      </div>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-11 h-11 rounded-full bg-[#D1F843] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-[0_8px_24px_rgba(209,248,67,0.4)]"
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#0A1F18]" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HCP CARD with 3D tilt */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-3"
            >
              <TiltCard className="h-full group relative rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/90 p-7 transition-colors hover:bg-white cursor-pointer shadow-[0_12px_40px_-12px_rgba(10,31,24,0.15)]">
                <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#A5B2AD] uppercase">
                      Handicap
                    </span>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#E8F5EF] text-[#2A7D5A]">
                      <TrendingDown className="w-2.5 h-2.5" strokeWidth={3} />
                      <span className="text-[9px] font-bold">-1.2</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <AnimatedNumber
                      value={14.2}
                      decimals={1}
                      className="text-[72px] leading-none font-[200] text-[#0A1F18] tracking-[-0.05em] tabular-nums"
                    />
                    <span className="text-[12px] text-[#A5B2AD] font-semibold tracking-wider">
                      HCP
                    </span>
                  </div>

                  {/* Sparkline */}
                  <div className="mt-5 flex items-end gap-[2px] h-9">
                    {[62, 68, 65, 72, 68, 78, 72, 82, 78, 88, 82, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          delay: 0.5 + i * 0.04,
                          type: "spring",
                          damping: 15,
                        }}
                        className="flex-1 rounded-t-sm origin-bottom"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 11
                              ? "#D1F843"
                              : i > 8
                                ? "#2A7D5A"
                                : "#A5B2AD",
                          opacity: i > 8 ? 1 : 0.25 + (i / 11) * 0.5,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-[#A5B2AD] mt-2 tracking-wide">
                    Fra 18.5 i april 2025
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* STREAK CARD — dark with flame */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-3"
            >
              <TiltCard className="h-full group relative rounded-[28px] bg-[#0A1F18] text-white p-7 overflow-hidden cursor-pointer shadow-[0_12px_40px_-12px_rgba(10,31,24,0.3)]">
                <div
                  className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(209,248,67,0.4) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Flame className="w-7 h-7 text-[#D1F843] mb-4" strokeWidth={1.5} />
                  </motion.div>
                  <AnimatedNumber
                    value={21}
                    className="text-[56px] leading-none font-[200] tracking-[-0.04em] tabular-nums block"
                  />
                  <p className="text-[9px] text-white/35 uppercase tracking-[0.18em] mt-2">
                    Dagers streak
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* TRAINING PLAN CARD */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-5 group relative rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/90 p-7 hover:bg-white transition-colors shadow-[0_12px_40px_-12px_rgba(10,31,24,0.12)]"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.18em] text-[#A5B2AD] uppercase mb-1">
                    Treningsplan
                  </p>
                  <h3 className="text-[20px] font-[300] text-[#0A1F18] tracking-[-0.02em]">
                    Uke 16 —{" "}
                    <span className="font-semibold text-[#005840]">3 av 5 fullfort</span>
                  </h3>
                </div>
                <button className="text-[10px] font-semibold text-[#5A6E66] hover:text-[#0A1F18] flex items-center gap-1">
                  Se alle <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Week */}
              <div className="flex gap-1.5 mb-5">
                {["M", "T", "O", "T", "F", "L", "S"].map((d, i) => {
                  const day = i + 7;
                  const done = i < 3;
                  const today = day === selectedDay;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative ${
                        today
                          ? "bg-[#0A1F18] text-white shadow-[0_8px_20px_-6px_rgba(10,31,24,0.5)]"
                          : done
                            ? "bg-[#D1F843]/20 text-[#0A1F18]"
                            : "bg-white/70 text-[#A5B2AD] hover:bg-white"
                      }`}
                    >
                      <span className="text-[9px] font-bold opacity-60">{d}</span>
                      <span className="text-[15px] font-bold tabular-nums">{day}</span>
                      {done && (
                        <div className="w-1 h-1 rounded-full bg-[#2A7D5A] mt-0.5" />
                      )}
                      {today && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D1F843]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Today's session */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#D1F843]/25 via-[#D1F843]/10 to-transparent border border-[#D1F843]/40 overflow-hidden">
                <Shimmer />
                <div className="flex items-center justify-between relative">
                  <div>
                    <p className="text-[9px] font-bold text-[#005840] tracking-[0.18em] uppercase">
                      I dag
                    </p>
                    <h4 className="text-[16px] font-semibold text-[#0A1F18] mt-1 tracking-tight">
                      Chip shots 20-40m
                    </h4>
                    <p className="text-[10px] text-[#5A6E66] mt-1">
                      20 min — AI-anbefalt fokusomrade
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-[#0A1F18] text-[#D1F843] flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(10,31,24,0.5)]"
                  >
                    <Play className="w-4 h-4 fill-[#D1F843]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* TRACKMAN CARD */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-4 rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/90 p-7 hover:bg-white transition-colors shadow-[0_12px_40px_-12px_rgba(10,31,24,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#005840]/10 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#D1F843] shadow-[0_0_8px_#D1F843]"
                    />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.18em] text-[#A5B2AD] uppercase">
                    TrackMan
                  </span>
                </div>
                <span className="text-[9px] text-[#A5B2AD] tabular-nums">
                  Driver — 8. april
                </span>
              </div>

              {/* Audio wave */}
              <div className="flex items-center gap-[2px] h-16 mb-4">
                {Array.from({ length: 52 }).map((_, i) => {
                  const seed = Math.sin(i * 0.5) * Math.cos(i * 0.3);
                  const h = 15 + Math.abs(seed) * 60 + (i % 5) * 8;
                  const isCenter = i > 15 && i < 36;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6 + i * 0.015, type: "spring", damping: 12 }}
                      className="flex-1 rounded-full origin-center"
                      style={{
                        height: `${Math.min(h, 95)}%`,
                        background: isCenter ? "#005840" : "#A5B2AD",
                        opacity: isCenter ? 0.75 + ((seed + 1) / 2) * 0.25 : 0.2,
                      }}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#A5B2AD]/15">
                {[
                  { v: 142, u: "mph", l: "Ball speed" },
                  { v: 245, u: "m", l: "Carry" },
                  { v: 2.1, u: "k rpm", l: "Spin", d: 1 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-1">
                      <AnimatedNumber
                        value={s.v}
                        decimals={s.d ?? 0}
                        className="text-[22px] font-[300] text-[#0A1F18] tabular-nums tracking-tight"
                      />
                      <span className="text-[9px] font-medium text-[#A5B2AD]">{s.u}</span>
                    </div>
                    <div className="text-[9px] text-[#A5B2AD] uppercase tracking-[0.12em] mt-0.5">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI INSIGHT */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="col-span-3 group relative rounded-[28px] overflow-hidden p-7 bg-gradient-to-br from-[#F5EEFF] via-white to-white border border-[#AF52DE]/20 shadow-[0_12px_40px_-12px_rgba(175,82,222,0.2)]"
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, rgba(175,82,222,0.3) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#AF52DE]/15 border border-[#AF52DE]/25 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-[#AF52DE]" strokeWidth={2.5} />
                  </motion.div>
                  <span className="text-[9px] font-bold text-[#AF52DE] uppercase tracking-[0.15em]">
                    AI-innsikt
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0A1F18] leading-snug mb-2 tracking-tight">
                  Kort spill er ditt storste potensial
                </h3>
                <p className="text-[11px] text-[#5A6E66] leading-relaxed mb-5">
                  Chip shots 20-40m er 2.1 slag under snitt.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[28px] font-[200] text-[#AF52DE] tracking-[-0.02em] tabular-nums">
                        -
                      </span>
                      <AnimatedNumber
                        value={2.1}
                        decimals={1}
                        className="text-[28px] font-[200] text-[#AF52DE] tracking-[-0.02em] tabular-nums"
                      />
                    </div>
                    <div className="text-[9px] text-[#A5B2AD] uppercase tracking-[0.15em] mt-0.5">
                      SG kort spill
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 45 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-[#AF52DE] text-white flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(175,82,222,0.5)]"
                  >
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* STATS STRIP — 4 stat cards */}
            {[
              { label: "Strokes Gained", value: 3.5, decimals: 1, prefix: "+", trend: "+0.4", up: true },
              { label: "Fairway %", value: 64, decimals: 0, suffix: "%", trend: "+8%", up: true },
              { label: "GIR %", value: 61, decimals: 0, suffix: "%", trend: "+5%", up: true },
              { label: "Putts/runde", value: 1.8, decimals: 1, trend: "-0.2", up: false },
            ].map((s, i) => (
              <motion.div
                key={i}
                custom={6 + i}
                initial="hidden"
                animate="visible"
                variants={revealVariants}
                className="col-span-3"
              >
                <TiltCard
                  className="h-full group relative rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/90 p-5 hover:bg-white transition-colors cursor-pointer shadow-[0_8px_24px_-8px_rgba(10,31,24,0.1)]"
                  tiltStrength={4}
                >
                  <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                    <p className="text-[9px] font-bold tracking-[0.18em] text-[#A5B2AD] uppercase mb-3">
                      {s.label}
                    </p>
                    <div className="flex items-end justify-between">
                      <AnimatedNumber
                        value={s.value}
                        decimals={s.decimals}
                        prefix={s.prefix}
                        suffix={s.suffix}
                        className="text-[36px] font-[200] text-[#0A1F18] leading-none tracking-[-0.035em] tabular-nums"
                      />
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5EF] mb-1">
                        {s.up ? (
                          <TrendingUp className="w-2.5 h-2.5 text-[#2A7D5A]" strokeWidth={3} />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 text-[#2A7D5A]" strokeWidth={3} />
                        )}
                        <span className="text-[9px] font-bold text-[#2A7D5A]">
                          {s.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* ═══ FOOTER INFO ═══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex items-center justify-between text-[9px] tracking-[0.15em] uppercase text-[#A5B2AD]"
          >
            <span>AK Golf Academy — Spillerportal v2.0</span>
            <div className="flex items-center gap-3">
              <span>Brand Guide V2.0</span>
              <span className="w-8 h-px bg-[#A5B2AD]" />
              <span>#005840 / #D1F843</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
