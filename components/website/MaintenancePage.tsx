"use client";

import { motion } from "framer-motion";
import { AKLogo } from "./AKLogo";

interface MaintenancePageProps {
  title?: string;
  message?: string;
  showContactInfo?: boolean;
}

export function MaintenancePage({
  title = "Vi oppgraderer",
  message = "Vi jobber med å gjøre opplevelsen enda bedre. Vi er snart tilbake.",
  showContactInfo = true,
}: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-[#ECF0EF] flex flex-col items-center justify-center px-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#D5DFDB] to-transparent blur-3xl opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#A5B2AD] to-transparent blur-3xl opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <AKLogo variant="black" size={80} className="mx-auto" />
        </motion.div>

        {/* Animated loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#0A1F18]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-[#0A1F18] tracking-tight mb-4"
        >
          {title}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-[#7A8C85] leading-relaxed mb-8"
        >
          {message}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-16 h-px bg-[#A5B2AD] mx-auto mb-8"
        />

        {/* Contact info */}
        {showContactInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-sm text-[#5A6E66]">
              Har du sporsmal? Ta kontakt:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="mailto:post@akgolf.no"
                className="text-[#0A1F18] font-medium hover:opacity-70 transition-opacity"
              >
                post@akgolf.no
              </a>
              <span className="hidden sm:block text-[#A5B2AD]">|</span>
              <a
                href="tel:+4745008048"
                className="text-[#0A1F18] font-medium hover:opacity-70 transition-opacity"
              >
                +47 450 08 048
              </a>
            </div>
          </motion.div>
        )}

        {/* Brand tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-xs text-[#7A8C85] uppercase tracking-widest"
        >
          AK Golf Group
        </motion.p>
      </div>
    </div>
  );
}
