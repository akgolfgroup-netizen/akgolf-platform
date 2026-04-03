"use client";

import { motion } from "framer-motion";

interface WelcomeHeaderProps {
  firstName: string;
  dateString: string;
}

export function WelcomeHeader({ firstName, dateString }: WelcomeHeaderProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "God morgen" : hour < 18 ? "God dag" : "God kveld";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-1"
    >
      <p className="text-xs font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
        {dateString}
      </p>
      <h1 className="text-3xl font-bold text-[var(--portal-text-primary)]">
        {greeting},{" "}
        <span className="text-[var(--portal-text-primary)]">{firstName}</span>
      </h1>
    </motion.div>
  );
}
