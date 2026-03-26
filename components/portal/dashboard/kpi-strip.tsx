"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/animated-number";

interface KpiItem {
  label: string;
  value: number;
  icon: LucideIcon;
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
      {items.map((item) => (
        <motion.div key={item.label} variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="kpi-card gradient-border-soft p-4 rounded-xl"
          >
            <div className={`${item.bg} p-2 rounded-lg w-fit`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <AnimatedNumber
              value={item.value}
              suffix={item.suffix}
              className="text-2xl font-bold text-[#171717] mt-2 block"
            />
            <p className="text-sm text-[#737373]">{item.label}</p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
