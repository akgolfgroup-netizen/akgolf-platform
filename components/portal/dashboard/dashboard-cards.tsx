"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface DashboardCard {
  label: string;
  value: string;
  sub: string;
  color: string;
  href: string;
}

const THEME = {
  bg: "#FFFFFF",
  text: "#02060D",
  textSecondary: "#64748B",
  border: "#EBE5DA",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {cards.map((card) => (
        <motion.div key={card.label} variants={cardVariant}>
          <Link href={card.href} className="group block h-full">
            <div
              className="relative h-full rounded-2xl p-6 transition-all duration-300 overflow-hidden"
              style={{
                background: THEME.bg,
                border: `1px solid ${THEME.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at 100% 0%, ${card.color}10 0%, transparent 60%)`,
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
              />

              <div className="relative">
                {/* Label row */}
                <div className="flex items-start justify-between mb-4">
                  <p 
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: THEME.textSecondary }}
                  >
                    {card.label}
                  </p>
                  <ArrowUpRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                    style={{ color: card.color }}
                  />
                </div>

                {/* Value */}
                <p 
                  className="text-lg font-semibold line-clamp-2 leading-snug mb-3 transition-colors"
                  style={{ color: THEME.text }}
                >
                  {card.value}
                </p>

                {/* Sub + color dot */}
                <div className="flex items-center gap-2 mt-auto">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.color }}
                  />
                  <p 
                    className="text-sm truncate"
                    style={{ color: THEME.textSecondary }}
                  >
                    {card.sub}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
