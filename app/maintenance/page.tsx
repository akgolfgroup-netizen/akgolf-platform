"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { AKLogo } from "@/components/website/AKLogo";


// Heritage Tech Design Tokens
const heritage = {
  colors: {
    deep: "#154212",
    darker: "#0f2f0c",
    base: "#2D5A27",
    light: "#3D7A37",
    lime: "#DFFF00",
    limeDark: "#B8D400",
    limeMuted: "rgba(223, 255, 0, 0.15)",
    graphite: "#1A1D1A",
    charcoal: "#2A2D2A",
    ink: "#0D0F0D",
    pure: "#050705",
    cream: "#F5F1E8",
    surface: "#0D120C",
    surfaceRaised: "#141914",
  },
};

export default function MaintenancePage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: heritage.colors.ink }}
    >
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${heritage.colors.base}40, transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, ${heritage.colors.deep}30, transparent)
          `,
        }}
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${heritage.colors.lime} 1px, transparent 1px),
            linear-gradient(90deg, ${heritage.colors.lime} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-lg w-full"
      >
        {/* Card */}
        <div 
          className="rounded-2xl p-8 md:p-12 border backdrop-blur-sm"
          style={{ 
            backgroundColor: `${heritage.colors.graphite}80`,
            borderColor: `${heritage.colors.lime}20`,
          }}
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: heritage.colors.deep }}
            >
              <AKLogo variant="academy" size={48} />
            </div>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{ backgroundColor: heritage.colors.limeMuted }}
            >
              <Icon name="build" 
                className="w-8 h-8 animate-pulse" 
                style={{ color: heritage.colors.lime }} />
              {/* Pulse ring */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: heritage.colors.lime }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: heritage.colors.cream }}
          >
            Vi oppgraderer
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8 leading-relaxed"
            style={{ color: `${heritage.colors.cream}99` }}
          >
            AK Golf Academy er midlertidig nede for vedlikehold. 
            Vi jobber med å forbedre opplevelsen din og er snart tilbake.
          </motion.p>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 mb-8"
          >
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: heritage.colors.surfaceRaised }}
            >
              <Icon name="schedule" className="w-5 h-5 flex-shrink-0" style={{ color: heritage.colors.lime }} />
              <span style={{ color: `${heritage.colors.cream}CC` }}>
                Forventet ferdig: <span className="font-semibold" style={{ color: heritage.colors.cream }}>Snart</span>
              </span>
            </div>
            
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: heritage.colors.surfaceRaised }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: heritage.colors.lime }}
              />
              <span style={{ color: `${heritage.colors.cream}CC` }}>
                Status: <span className="font-semibold" style={{ color: heritage.colors.lime }}>Pågår</span>
              </span>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center pt-6 border-t"
            style={{ borderColor: `${heritage.colors.lime}15` }}
          >
            <p className="text-sm mb-3" style={{ color: `${heritage.colors.cream}80` }}>
              Spørsmål? Kontakt oss
            </p>
            <a 
              href="mailto:post@akgolf.no"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: heritage.colors.lime,
                color: heritage.colors.ink,
              }}
            >
              <Icon name="mail" className="w-4 h-4" />
              post@akgolf.no
              <Icon name="arrow_forward" className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-6"
          style={{ color: `${heritage.colors.cream}40` }}
        >
          © {new Date().getFullYear()} AK Golf Academy. Alle rettigheter reservert.
        </motion.p>
      </motion.div>
    </div>
  );
}
