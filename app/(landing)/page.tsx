/**
 * AK Sports OS — Heritage Tech Landing Page
 * "Luxury meets Precision" — Premium Sports Technology Platform
 * 
 * Brand: Heritage Tech — Deep forest greens (#2D5A27) + Electric lime (#DFFF00)
 * UI: Bento-grid system, dark mode default, clinical data precision
 * 
 * Concept: 20-min coaching subscription model
 * Pricing: 2 000 kr/mnd for 4×20 min coaching + full portal access
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Zap, 
  Target, 
  BarChart3, 
  Users,
  Clock,
  Crown,
  ChevronRight,
  Play,
  Sparkles,
  Trophy,
  Calendar,
  MapPin,
  Mail,
  Instagram,
  Check,
  TrendingUp,
  Activity
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// HERITAGE TECH DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const heritage = {
  colors: {
    // Heritage Greens
    deep: '#2D5A27',
    darker: '#1A3520',
    base: '#2D5A27',
    light: '#3D7A37',
    
    // Electric Lime
    lime: '#DFFF00',
    limeDark: '#B8D400',
    limeMuted: 'rgba(223, 255, 0, 0.15)',
    
    // Dark surfaces
    graphite: '#2A2D2A',
    charcoal: '#3A3D3A',
    ink: '#1A1D1A',
    pure: '#0A0D0A',
    
    // Light
    cream: '#F5F1E8',
    warmGrey: '#8A8680',
  },
  
  fonts: {
    headline: 'font-[family-name:var(--font-playfair)]',
    body: 'font-[family-name:var(--font-inter)]',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(223, 255, 0, 0.3)',
      '0 0 40px rgba(223, 255, 0, 0.5)',
      '0 0 20px rgba(223, 255, 0, 0.3)'
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const Navigation = () => (
  <motion.nav
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    className="fixed top-0 left-0 right-0 z-50"
    style={{ 
      backgroundColor: 'rgba(10, 13, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(223, 255, 0, 0.1)'
    }}
  >
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: heritage.colors.deep,
              boxShadow: '0 0 20px rgba(45, 90, 39, 0.5)'
            }}
          >
            <Crown className="w-5 h-5" style={{ color: heritage.colors.lime }} />
          </div>
          <div>
            <span className={`${heritage.fonts.headline} text-lg font-semibold text-white tracking-tight`}>
              AK Sports
            </span>
            <span className="block text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: heritage.colors.lime }}>
              OS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Plattform", "Coaching", "Wang Hub", "Facility", "Priser"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
          style={{ 
            backgroundColor: heritage.colors.lime,
            color: heritage.colors.pure,
            boxShadow: '0 0 20px rgba(223, 255, 0, 0.3)'
          }}
        >
          <Zap className="w-4 h-4" />
          Kom i gang
        </button>
      </div>
    </div>
  </motion.nav>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const HeroSection = () => (
  <section 
    className="relative min-h-screen flex items-center overflow-hidden pt-20"
    style={{ backgroundColor: heritage.colors.pure }}
  >
    {/* Background Effects */}
    <div className="absolute inset-0">
      {/* Gradient mesh */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, ${heritage.colors.deep}40 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, ${heritage.colors.lime}10 0%, transparent 50%)
          `
        }}
      />
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${heritage.colors.lime} 1px, transparent 1px),
            linear-gradient(90deg, ${heritage.colors.lime} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>

    <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl"
      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ 
            backgroundColor: heritage.colors.limeMuted,
            border: `1px solid ${heritage.colors.lime}30`
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: heritage.colors.lime }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: heritage.colors.lime }}>
            Norges ledende idrettsplattform
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeInUp}
          className={`${heritage.fonts.headline} text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[0.95] tracking-tight mb-8`}
          style={{ color: heritage.colors.cream }}
        >
          Heritage
          <span 
            className="block mt-2"
            style={{ 
              background: `linear-gradient(135deg, ${heritage.colors.lime} 0%, ${heritage.colors.limeDark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            meets Precision
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className={`${heritage.fonts.body} text-lg sm:text-xl font-light leading-relaxed mb-12 max-w-2xl`}
          style={{ color: heritage.colors.warmGrey }}
        >
          AK Sports OS forener tre kraftsentre: spillerutvikling, multi-sport 
          organisering og anleggsdrift. Én plattform. Ubegrensede muligheter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all"
            style={{ 
              backgroundColor: heritage.colors.lime,
              color: heritage.colors.pure,
              boxShadow: '0 0 30px rgba(223, 255, 0, 0.4)'
            }}
          >
            Utforsk plattformen
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl font-medium border flex items-center gap-3 transition-all hover:bg-white/5"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: heritage.colors.cream }}
          >
            <Play className="w-5 h-5" />
            Se demonstrasjon
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: "132", label: "Database-modeller", suffix: "" },
            { value: "11", label: "Idretter støttet", suffix: "" },
            { value: "20", label: "Minutters coaching", suffix: "" },
            { value: "3", label: "Integrerte pilarer", suffix: "" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="p-6 rounded-2xl"
              style={{ 
                backgroundColor: 'rgba(58, 61, 58, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div className="flex items-baseline gap-1">
                <span 
                  className={`${heritage.fonts.headline} text-3xl lg:text-4xl font-semibold`}
                  style={{ color: heritage.colors.lime }}
                >
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span style={{ color: heritage.colors.lime }}>{stat.suffix}</span>
                )}
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: heritage.colors.warmGrey }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 20-MIN COACHING SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const CoachingSection = () => {
  const features = [
    "Full tilgang til AI-IUP",
    "Strokes Gained analyse",
    "12-ukers treningsplaner",
    "TrackMan-data synkronisering",
    "CoachNow notatdeling",
    "Ubegrenset portal-tilgang"
  ];

  return (
    <section 
      id="coaching"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: heritage.colors.ink }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${heritage.colors.deep} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Concept explanation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span 
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: heritage.colors.lime }}
            >
              Revolusjonær modell
            </span>
            <h2 
              className={`${heritage.fonts.headline} text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-6`}
              style={{ color: heritage.colors.cream }}
            >
              20-minutters
              <span style={{ color: heritage.colors.lime }}> transformasjon</span>
            </h2>
            <p 
              className="text-lg font-light leading-relaxed mb-8"
              style={{ color: heritage.colors.warmGrey }}
            >
              Vi forlater den utdaterte modellen med 50-minutters enkelttimer. 
              I stedet får du fire fokuserte 20-minutters sesjoner per måned — 
              presis coaching støttet av AI og sanntidsdata.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: heritage.colors.limeMuted }}
                  >
                    <Check className="w-4 h-4" style={{ color: heritage.colors.lime }} />
                  </div>
                  <span className="font-medium" style={{ color: heritage.colors.cream }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div 
              className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
              style={{ backgroundColor: heritage.colors.deep }}
            />
            
            <div 
              className="relative p-8 lg:p-10 rounded-3xl"
              style={{ 
                background: `linear-gradient(135deg, ${heritage.colors.charcoal} 0%, ${heritage.colors.graphite} 100%)`,
                border: `1px solid ${heritage.colors.lime}40`,
                boxShadow: `0 0 60px rgba(223, 255, 0, 0.15)`
              }}
            >
              {/* Popular badge */}
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                style={{ backgroundColor: heritage.colors.lime }}
              >
                <Crown className="w-4 h-4" style={{ color: heritage.colors.pure }} />
                <span className="text-xs font-bold uppercase" style={{ color: heritage.colors.pure }}>
                  Mest populær
                </span>
              </div>

              <h3 
                className={`${heritage.fonts.headline} text-2xl font-medium mb-2`}
                style={{ color: heritage.colors.cream }}
              >
                Premium Coaching
              </h3>
              <p className="text-sm mb-8" style={{ color: heritage.colors.warmGrey }}>
                Komplett utviklingspakke
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8">
                <span 
                  className={`${heritage.fonts.headline} text-6xl lg:text-7xl font-semibold`}
                  style={{ color: heritage.colors.lime }}
                >
                  2 000
                </span>
                <div>
                  <span className="text-2xl font-medium" style={{ color: heritage.colors.cream }}>kr</span>
                  <span className="block text-sm" style={{ color: heritage.colors.warmGrey }}>/mnd</span>
                </div>
              </div>

              {/* Sessions highlight */}
              <div 
                className="p-4 rounded-xl mb-8"
                style={{ backgroundColor: heritage.colors.limeMuted }}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" style={{ color: heritage.colors.lime }} />
                  <div>
                    <span className="font-semibold" style={{ color: heritage.colors.lime }}>
                      4 × 20 minutter
                    </span>
                    <span className="block text-sm" style={{ color: heritage.colors.warmGrey }}>
                      coaching per måned
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                className="w-full py-4 rounded-xl font-semibold transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: heritage.colors.lime,
                  color: heritage.colors.pure,
                  boxShadow: '0 0 30px rgba(223, 255, 0, 0.4)'
                }}
              >
                Start din transformasjon
              </button>

              <p className="text-center text-xs mt-4" style={{ color: heritage.colors.warmGrey }}>
                Ingen binding. Oppsigelse når som helst.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THREE PILLARS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const PillarsSection = () => {
  const pillars = [
    {
      icon: Target,
      title: "Academy",
      subtitle: "Spillerutvikling",
      description: "Kodifisert metodikk i 132 database-modeller. Strokes Gained-motor med PGA Tour-benchmarks. AI-coach som justerer treningsplaner etter hver sesjon.",
      features: ["132 modeller", "AI-coach (Claude 4.5)", "TrackMan integrasjon"],
      color: heritage.colors.lime
    },
    {
      icon: Users,
      title: "Wang Hub",
      subtitle: "Multi-sport",
      description: "Multi-tenant arkitektur som støtter 11 idretter. Avansert belastningsstyring og integrasjon mot skoleverkets kompetansemål.",
      features: ["11 idretter", "Multi-tenant", "Skoleintegrasjon"],
      color: heritage.colors.deep
    },
    {
      icon: BarChart3,
      title: "Facility OS",
      subtitle: "Infrastruktur",
      description: "B2B SaaS-modul med GIS-kartintegrasjon for banedrift. Sponsor-CRM og automatiserte HMS-systemer for profesjonell anleggsdrift.",
      features: ["GIS-integrasjon", "Sponsor-CRM", "HMS-automasjon"],
      color: heritage.colors.light
    }
  ];

  return (
    <section 
      id="plattform"
      className="py-24 lg:py-32"
      style={{ backgroundColor: heritage.colors.pure }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span 
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: heritage.colors.lime }}
          >
            Tre pilarer — én plattform
          </span>
          <h2 
            className={`${heritage.fonts.headline} text-4xl sm:text-5xl lg:text-6xl font-medium`}
            style={{ color: heritage.colors.cream }}
          >
            AK Sports OS
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ 
                backgroundColor: heritage.colors.charcoal,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${pillar.color}20`,
                  boxShadow: `0 0 30px ${pillar.color}30`
                }}
              >
                <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
              </div>

              <span 
                className="text-xs font-semibold tracking-wider uppercase mb-2 block"
                style={{ color: pillar.color }}
              >
                {pillar.subtitle}
              </span>

              <h3 
                className={`${heritage.fonts.headline} text-2xl font-medium mb-4`}
                style={{ color: heritage.colors.cream }}
              >
                {pillar.title}
              </h3>

              <p 
                className="text-sm leading-relaxed mb-6"
                style={{ color: heritage.colors.warmGrey }}
              >
                {pillar.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {pillar.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: heritage.colors.warmGrey
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROI / EXIT STRATEGY SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ValueSection = () => (
  <section 
    className="py-24 lg:py-32 relative overflow-hidden"
    style={{ backgroundColor: heritage.colors.darker }}
  >
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span 
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: heritage.colors.lime }}
          >
            Verdiskaping
          </span>
          <h2 
            className={`${heritage.fonts.headline} text-4xl sm:text-5xl font-medium leading-tight mb-6`}
            style={{ color: heritage.colors.cream }}
          >
            Fra timepris til
            <span style={{ color: heritage.colors.lime }}> verdi-multiple</span>
          </h2>
          <p 
            className="text-lg font-light leading-relaxed mb-8"
            style={{ color: heritage.colors.warmGrey }}
          >
            Målet om 5 millioner kroner i overskudd nås gjennom skalerbare 
            SaaS-inntekter og redusert personavhengighet. Med en estimert 
            EBITDA på 6 millioner NOK og en SaaS-multiple på 12x gir dette 
            en selskapsverdi på 72 millioner NOK.
          </p>

          {/* Comparison table */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div 
              className="grid grid-cols-3 gap-4 p-4 text-sm font-semibold"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <span style={{ color: heritage.colors.warmGrey }}>Modell</span>
              <span style={{ color: heritage.colors.warmGrey }}>Multiple</span>
              <span style={{ color: heritage.colors.warmGrey }}>Verdi-driver</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 text-sm border-t border-white/10">
              <span style={{ color: heritage.colors.cream }}>Enkelttimer</span>
              <span style={{ color: heritage.colors.warmGrey }}>1.5x – 3x</span>
              <span style={{ color: heritage.colors.warmGrey }}>Personlig tid</span>
            </div>
            <div 
              className="grid grid-cols-3 gap-4 p-4 text-sm border-t border-white/10"
              style={{ backgroundColor: heritage.colors.limeMuted }}
            >
              <span className="font-semibold" style={{ color: heritage.colors.lime }}>AK Sports OS</span>
              <span className="font-semibold" style={{ color: heritage.colors.lime }}>8x – 15x</span>
              <span style={{ color: heritage.colors.lime }}>ARR + IP + Brand</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Value visualization */}
          <div 
            className="p-8 rounded-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${heritage.colors.deep}40 0%, ${heritage.colors.ink} 100%)`,
              border: `1px solid ${heritage.colors.lime}30`
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-medium" style={{ color: heritage.colors.warmGrey }}>
                Estimert selskapsverdi
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: heritage.colors.lime, color: heritage.colors.pure }}
              >
                2026 Mål
              </span>
            </div>
            
            <div 
              className={`${heritage.fonts.headline} text-6xl lg:text-7xl font-semibold mb-4`}
              style={{ color: heritage.colors.lime }}
            >
              72M
              <span className="text-3xl ml-2" style={{ color: heritage.colors.cream }}>NOK</span>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: heritage.colors.warmGrey }}>EBITDA estimat</span>
                <span className="font-semibold" style={{ color: heritage.colors.cream }}>6M NOK</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: heritage.colors.warmGrey }}>SaaS Multiple</span>
                <span className="font-semibold" style={{ color: heritage.colors.cream }}>12x</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden mt-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '75%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${heritage.colors.lime} 0%, ${heritage.colors.limeDark} 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ROADMAP SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const RoadmapSection = () => {
  const quarters = [
    {
      quarter: "Q2 2026",
      title: "Visual Rebrand",
      description: "Implementere 'Heritage Green'-paletten på alle flater (web, portal, app).",
      status: "current"
    },
    {
      quarter: "Q3 2026",
      title: "20-min Concept Launch",
      description: "Full konvertering av GFGK-medlemmer til den nye abonnementsmodellen.",
      status: "upcoming"
    },
    {
      quarter: "Q4 2026",
      title: "Beta-lansering (Club OS)",
      description: "Pilotere plattformen for de første 100 eksterne idrettslagene i Norge.",
      status: "upcoming"
    }
  ];

  return (
    <section 
      className="py-24 lg:py-32"
      style={{ backgroundColor: heritage.colors.pure }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span 
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: heritage.colors.lime }}
          >
            Kritisk veikart 2026
          </span>
          <h2 
            className={`${heritage.fonts.headline} text-4xl sm:text-5xl font-medium`}
            style={{ color: heritage.colors.cream }}
          >
            Veien fremover
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {quarters.map((item, index) => (
            <motion.div
              key={item.quarter}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative p-8 rounded-3xl"
              style={{ 
                backgroundColor: item.status === 'current' ? heritage.colors.limeMuted : heritage.colors.charcoal,
                border: `1px solid ${item.status === 'current' ? heritage.colors.lime : 'rgba(255, 255, 255, 0.06)'}`,
              }}
            >
              {item.status === 'current' && (
                <div 
                  className="absolute -top-3 left-8 px-3 py-1 rounded-full text-xs font-bold uppercase"
                  style={{ backgroundColor: heritage.colors.lime, color: heritage.colors.pure }}
                >
                  Nå
                </div>
              )}
              
              <span 
                className="text-sm font-bold tracking-wider mb-4 block"
                style={{ color: item.status === 'current' ? heritage.colors.lime : heritage.colors.warmGrey }}
              >
                {item.quarter}
              </span>
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: heritage.colors.cream }}
              >
                {item.title}
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: heritage.colors.warmGrey }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const CTASection = () => (
  <section 
    className="py-24 lg:py-32 relative overflow-hidden"
    style={{ backgroundColor: heritage.colors.deep }}
  >
    {/* Background effects */}
    <div 
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 50% 50% at 50% 100%, ${heritage.colors.lime}20 0%, transparent 70%),
          radial-gradient(ellipse 80% 50% at 50% 0%, ${heritage.colors.darker} 0%, transparent 50%)
        `
      }}
    />

    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 
          className={`${heritage.fonts.headline} text-4xl sm:text-5xl lg:text-6xl font-medium mb-6`}
          style={{ color: heritage.colors.cream }}
        >
          Klar for fremtidens
          <span style={{ color: heritage.colors.lime }}> idrett?</span>
        </h2>
        <p 
          className="text-lg font-light max-w-2xl mx-auto mb-10"
          style={{ color: heritage.colors.warmGrey }}
        >
          Bli med på reisen fra tradisjonell coaching til teknologidrevet 
          prestasjonskultur. AK Sports OS — der arv møter presisjon.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all hover:scale-105"
            style={{ 
              backgroundColor: heritage.colors.lime,
              color: heritage.colors.pure,
              boxShadow: '0 0 40px rgba(223, 255, 0, 0.4)'
            }}
          >
            <Zap className="w-5 h-5" />
            Bli med nå
          </button>
          <button
            className="px-8 py-4 rounded-xl font-medium border transition-all hover:bg-white/5"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: heritage.colors.cream }}
          >
            Kontakt salg
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════

const Footer = () => (
  <footer style={{ backgroundColor: heritage.colors.ink }}>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: heritage.colors.deep }}
            >
              <Crown className="w-6 h-6" style={{ color: heritage.colors.lime }} />
            </div>
            <div>
              <span className={`${heritage.fonts.headline} text-xl font-semibold text-white`}>
                AK Sports
              </span>
              <span className="block text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: heritage.colors.lime }}>
                OS
              </span>
            </div>
          </div>
          <p 
            className="text-sm leading-relaxed mb-6 max-w-sm"
            style={{ color: heritage.colors.warmGrey }}
          >
            Norges ledende idretts- og utviklingsplattform. 
            Heritage Tech — der luksus møter presisjon.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 
            className="text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ color: heritage.colors.lime }}
          >
            Plattform
          </h4>
          <ul className="space-y-3">
            {["Academy", "Wang Hub", "Facility OS", "AI Coach"].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: heritage.colors.warmGrey }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 
            className="text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ color: heritage.colors.lime }}
          >
            Kontakt
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: heritage.colors.warmGrey }} />
              <span className="text-sm" style={{ color: heritage.colors.warmGrey }}>
                post@aksports.no
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: heritage.colors.warmGrey }} />
              <span className="text-sm" style={{ color: heritage.colors.warmGrey }}>
                Østfold, Norge
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div 
        className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <p className="text-xs" style={{ color: heritage.colors.warmGrey }}>
          © 2026 AK Sports OS. Alle rettigheter reservert.
        </p>
        <div className="flex gap-6">
          {["Personvern", "Vilkår", "Cookies"].map((item) => (
            <a 
              key={item}
              href="#" 
              className="text-xs transition-colors hover:text-white"
              style={{ color: heritage.colors.warmGrey }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HeritageLandingPage() {
  return (
    <main 
      className="min-h-screen"
      style={{ backgroundColor: heritage.colors.pure }}
    >
      <Navigation />
      <HeroSection />
      <CoachingSection />
      <PillarsSection />
      <ValueSection />
      <RoadmapSection />
      <CTASection />
      <Footer />
    </main>
  );
}
