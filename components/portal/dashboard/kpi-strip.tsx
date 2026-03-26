"use client";

import { motion } from "framer-motion";
import { Target, Flame, Activity, Trophy, LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/animated-number";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Flame,
  Activity,
  Trophy,
};

interface KpiItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
  suffix?: string;
}

interface KpiStripProps {
  items: KpiItem[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {items.map((item) => {
        const Icon = iconMap[item.icon] || Target;
        return (
        <motion.div key={item.label} variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="portal-card p-4 rounded-xl"
          >
            <div className={`${item.bg} p-2 rounded-lg w-fit`}>
              <Icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <AnimatedNumber
              value={item.value}
              suffix={item.suffix}
              className="text-2xl font-bold text-[var(--portal-text-primary)] mt-2 block"
            />
            <p className="text-sm text-[var(--portal-text-muted)]">{item.label}</p>
          </motion.div>
        </motion.div>
        );
      })}
    </motion.div>
  );
}
