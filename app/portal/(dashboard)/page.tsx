"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingDown,
  TrendingUp,
  Flame,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sun,
  Wind,
  Droplets,
  Sparkles,
  Target,
  BookOpen,
  Trophy,
  ArrowRight,
  Play,
  Check,
} from "lucide-react";

// Apple Design System Components
import {
  BentoGrid,
  BentoCard,
  StatCard,
  AppleButton,
  AppleBadge,
} from "@/components/portal/apple";

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

// Mock data - replace with real data fetching
const userData = {
  firstName: "Anders",
  handicap: 12.4,
  handicapTrend: -1.2,
  streak: 5,
  sessionsThisMonth: 8,
  achievements: 7,
  totalAchievements: 24,
};

const nextSession = {
  id: "1",
  title: "Putting & Naerspill",
  date: "29",
  month: "mar",
  time: "14:00",
  instructor: "Anders K.",
  location: "Sarpsborg GK",
  daysUntil: 1,
};

const weekData = [
  { day: "Man", date: 24, trained: true, coaching: false },
  { day: "Tir", date: 25, trained: true, coaching: false },
  { day: "Ons", date: 26, trained: false, coaching: false },
  { day: "Tor", date: 27, trained: true, coaching: false },
  { day: "Fre", date: 28, trained: false, coaching: false, isToday: true },
  { day: "Lor", date: 29, trained: false, coaching: true },
  { day: "Son", date: 30, trained: false, coaching: false, isRest: true },
];

const insights = [
  { id: 1, type: "tip", text: "Spillere med HCP 10-15 sparer flest slag pa putting. Prioriter dette!", icon: Target },
  { id: 2, type: "streak", text: "5 dager i rad! 2 dager til for a sla din personlige rekord.", icon: Flame },
];

const quickActions = [
  { href: "/portal/dagbok", label: "Logg okt", icon: BookOpen, accent: true },
  { href: "/portal/bookinger/ny", label: "Book time", icon: Calendar, accent: false },
  { href: "/portal/statistikk", label: "Statistikk", icon: TrendingUp, accent: false },
];

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "God morgen" : hour < 17 ? "God ettermiddag" : "God kveld";
  const date = new Date().toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--apple-gray-50)] via-white to-[var(--apple-gold-50)]/30">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[var(--apple-gold-200)]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-200/15 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-8 pb-12"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[2.5rem] font-light tracking-tight text-[var(--apple-gray-950)]">
              {greeting}, <span className="font-semibold">{userData.firstName}</span>
            </h1>
            <p className="text-base text-[var(--apple-gray-500)] mt-1 capitalize font-light">{date}</p>
          </div>
          <div className="flex items-center gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <AppleButton
                  variant={action.accent ? "gold" : "secondary"}
                  size="md"
                  icon={action.icon}
                >
                  {action.label}
                </AppleButton>
              </Link>
            ))}
          </div>
        </motion.header>

        {/* Bento Grid */}
        <BentoGrid gap="md">
          {/* Handicap Card - Large feature */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 row-span-2 max-lg:col-span-6 max-md:col-span-1">
            <div className="relative h-full rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/50 p-8 overflow-hidden group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-emerald-300/20 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-200/30 blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.2em]">
                    Handicap Index
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-[5rem] font-extralight text-[var(--apple-gray-950)] leading-none tracking-tighter">
                    {userData.handicap.toFixed(1)}
                  </span>
                </div>

                {userData.handicapTrend !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AppleBadge
                      variant={userData.handicapTrend < 0 ? "success" : "error"}
                      size="lg"
                      icon={userData.handicapTrend < 0 ? TrendingDown : TrendingUp}
                      className="mt-4"
                    >
                      {Math.abs(userData.handicapTrend).toFixed(1)} siste 30 dager
                    </AppleBadge>
                  </motion.div>
                )}

                <div className="mt-8 pt-6 border-t border-emerald-200/50">
                  <p className="text-sm text-[var(--apple-gray-500)] mb-2">Mal: HCP 10.0</p>
                  <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((24 - userData.handicap) / (24 - 10)) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="col-span-6 lg:col-span-2 max-md:col-span-1">
            <StatCard
              label="Streak"
              value={userData.streak}
              icon={Flame}
              iconColor="text-orange-500"
              iconBg="bg-orange-50"
              className="h-full"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-6 lg:col-span-2 max-md:col-span-1">
            <StatCard
              label="Mars"
              value={userData.sessionsThisMonth}
              icon={Target}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
              className="h-full"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 max-lg:col-span-6 max-md:col-span-1">
            <BentoCard
              span={4}
              variant="glass"
              icon={Trophy}
              iconColor="text-amber-500"
              className="h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs uppercase tracking-wider text-[var(--apple-gray-500)] font-medium">Achievements</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-light text-[var(--apple-gray-950)]">{userData.achievements}</p>
                  <p className="text-sm text-[var(--apple-gray-500)] mt-1">av {userData.totalAchievements}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < 3 ? "bg-amber-400" : "bg-[var(--apple-gray-200)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Next Session Card */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 max-lg:col-span-6 max-md:col-span-1">
            <Link href={`/portal/bookinger/${nextSession.id}`} className="block group">
              <BentoCard
                span={4}
                variant="gradient"
                hover={false}
                className="relative overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-[var(--apple-gold-300)]/20 via-transparent to-transparent" />

                <div className="relative flex items-start gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--apple-gold-100)] flex flex-col items-center justify-center">
                    <span className="text-3xl font-light text-[var(--apple-gold-600)]">{nextSession.date}</span>
                    <span className="text-xs text-[var(--apple-gold-500)] uppercase">{nextSession.month}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-[var(--apple-gold-600)] uppercase tracking-[0.15em]">
                        Neste time
                      </span>
                      {nextSession.daysUntil <= 1 && (
                        <AppleBadge variant="gold" size="sm">
                          I morgen
                        </AppleBadge>
                      )}
                    </div>
                    <h3 className="text-xl font-medium text-[var(--apple-gray-900)] mb-3">{nextSession.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--apple-gray-500)]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {nextSession.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {nextSession.location}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[var(--apple-gold-400)] group-hover:text-[var(--apple-gold-600)] group-hover:translate-x-1 transition-all" />
                </div>
              </BentoCard>
            </Link>
          </motion.div>

          {/* Week Overview */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 max-lg:col-span-6 max-md:col-span-1">
            <BentoCard span={8} variant="glass">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[var(--apple-gray-700)] uppercase tracking-wider">Denne uken</h2>
                <Link href="/portal/kalender" className="text-xs text-[var(--apple-gray-500)] hover:text-[var(--apple-gray-900)] transition-colors">
                  Se kalender
                </Link>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, idx) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className={`relative text-center py-4 px-3 rounded-2xl transition-all ${
                      day.isToday
                        ? "bg-[var(--apple-gold-100)] ring-2 ring-[var(--apple-gold-400)]"
                        : day.trained
                        ? "bg-emerald-50"
                        : day.coaching
                        ? "bg-blue-50"
                        : "bg-[var(--apple-gray-50)]"
                    }`}
                  >
                    <p className={`text-[10px] uppercase tracking-wider mb-2 ${
                      day.isToday ? "text-[var(--apple-gold-600)]" : "text-[var(--apple-gray-400)]"
                    }`}>
                      {day.day}
                    </p>
                    <p className={`text-xl font-light ${day.isToday ? "text-[var(--apple-gold-600)]" : "text-[var(--apple-gray-800)]"}`}>
                      {day.date}
                    </p>
                    <div className="mt-3 h-6 flex items-center justify-center">
                      {day.trained && <Check className="w-4 h-4 text-emerald-500" />}
                      {day.coaching && <Calendar className="w-4 h-4 text-blue-500" />}
                      {day.isToday && !day.trained && <Play className="w-4 h-4 text-[var(--apple-gold-500)]" />}
                      {day.isRest && <span className="text-xs text-[var(--apple-gray-300)]">Hvile</span>}
                    </div>
                    {day.coaching && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
                    )}
                  </motion.div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-6 max-lg:col-span-6 max-md:col-span-1">
            <BentoCard
              span={6}
              variant="glass"
              className="bg-gradient-to-br from-purple-50/70 via-white/70 to-blue-50/70 border-purple-200/30"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--apple-gray-900)]">Personlige innsikter</h2>
                  <p className="text-[10px] text-[var(--apple-gray-500)] uppercase tracking-wider">AI-drevet</p>
                </div>
              </div>

              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 hover:bg-white/80 transition-colors border border-white/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <insight.icon className={`w-4 h-4 ${insight.type === "streak" ? "text-orange-500" : "text-blue-500"}`} />
                    </div>
                    <p className="text-sm text-[var(--apple-gray-700)] leading-relaxed">{insight.text}</p>
                  </motion.div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Weather Card */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-6 max-lg:col-span-6 max-md:col-span-1">
            <BentoCard
              span={6}
              variant="glass"
              className="bg-gradient-to-br from-sky-50/70 via-white/70 to-cyan-50/70 border-sky-200/30"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] text-[var(--apple-gray-500)] uppercase tracking-wider mb-2">Golfvar i dag</p>
                  <div className="flex items-center gap-3">
                    <Sun className="w-10 h-10 text-amber-400" />
                    <div>
                      <span className="text-4xl font-light text-[var(--apple-gray-950)]">14°</span>
                      <p className="text-sm text-[var(--apple-gray-500)]">Delvis skyet</p>
                    </div>
                  </div>
                </div>
                <AppleBadge variant="success" size="md">
                  Perfekt golfvar
                </AppleBadge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-white/60 border border-white/50">
                  <Wind className="w-4 h-4 text-[var(--apple-gray-400)] mb-2" />
                  <p className="text-lg font-light text-[var(--apple-gray-900)]">12</p>
                  <p className="text-xs text-[var(--apple-gray-500)]">km/t vind</p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 border border-white/50">
                  <Droplets className="w-4 h-4 text-[var(--apple-gray-400)] mb-2" />
                  <p className="text-lg font-light text-[var(--apple-gray-900)]">20%</p>
                  <p className="text-xs text-[var(--apple-gray-500)]">nedbor</p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 border border-white/50">
                  <Clock className="w-4 h-4 text-[var(--apple-gray-400)] mb-2" />
                  <p className="text-lg font-light text-[var(--apple-gray-900)]">Hele dagen</p>
                  <p className="text-xs text-[var(--apple-gray-500)]">beste tid</p>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="col-span-12">
            <div className="flex items-center justify-center gap-6 py-4">
              {[
                { href: "/portal/treningsplan", label: "Treningsplan", icon: Target },
                { href: "/portal/statistikk", label: "Strokes Gained", icon: TrendingUp },
                { href: "/portal/coaching-historikk", label: "Coaching-historikk", icon: BookOpen },
                { href: "/portal/profil", label: "Min profil", icon: Trophy },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 px-4 py-2 text-sm text-[var(--apple-gray-500)] hover:text-[var(--apple-gray-900)] transition-colors"
                >
                  <link.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>
        </BentoGrid>
      </motion.div>
    </div>
  );
}
