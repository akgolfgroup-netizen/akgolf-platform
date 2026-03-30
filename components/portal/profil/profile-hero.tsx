"use client";

import { motion } from "framer-motion";
import { SkillLevelBadge } from "@/components/portal/statistikk/skill-level-badge";

interface ProfileHeroProps {
  name: string | null;
  image: string | null;
  role: string;
  subscriptionTier: string;
  currentHandicap: number | null;
}

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrator",
  INSTRUCTOR: "Instruktør",
  STUDENT: "Spiller",
};

const tierConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  FREE: { label: "Free", color: "#8a9bb0", bg: "rgba(138,155,176,0.1)", border: "rgba(138,155,176,0.2)" },
  PRO: { label: "Pro", color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
  ELITE: { label: "Elite", color: "#B07D4F", bg: "var(--color-grey-200)", border: "var(--color-grey-200)" },
};

export function ProfileHero({ name, image, role, subscriptionTier, currentHandicap }: ProfileHeroProps) {
  const tier = tierConfig[subscriptionTier] ?? tierConfig.FREE;
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: "var(--color-grey-100)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      {/* Subtle gold accent line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-grey-200), transparent)" }}
      />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with animated ring */}
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black"
            style={{ background: "linear-gradient(135deg, #c9a96e 0%, #B07D4F 100%)", color: "#0A1929" }}
          >
            {image ? (
              <img src={image} alt={name ?? ""} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {/* Ring overlay on hover via parent */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "0 0 0 2px var(--color-grey-200)" }}
          />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            {/* Role badge */}
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
              style={{ background: "var(--color-grey-200)", color: "var(--color-grey-900)", border: "1px solid var(--color-grey-200)" }}
            >
              {roleLabelMap[role] ?? role}
            </span>
            {/* Tier badge */}
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}
            >
              {tier.label}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-grey-900)] leading-tight mt-1">
            {name ?? "—"}
          </h1>
        </div>

        {/* Handicap badge */}
        {currentHandicap !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl px-6 py-4"
            style={{
              background: "linear-gradient(135deg, var(--color-grey-200) 0%, var(--color-grey-200) 100%)",
              border: "1px solid var(--color-grey-200)",
              minWidth: "100px",
            }}
          >
            <p className="text-[10px] font-semibold text-[var(--color-grey-400)] uppercase tracking-widest mb-0.5">
              Handicap
            </p>
            <p className="text-3xl font-black" style={{ color: "var(--color-grey-900)" }}>
              {currentHandicap.toFixed(1)}
            </p>
            <div className="mt-1">
              <SkillLevelBadge handicap={currentHandicap} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
