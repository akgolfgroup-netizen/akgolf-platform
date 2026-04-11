"use client";

import Link from "next/link";
import { PlusCircle, Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    label: "Logg trening",
    href: "/portal/dagbok",
    icon: PlusCircle,
    gradient: "from-[var(--color-grey-900)] to-[var(--color-grey-700)]",
  },
  {
    label: "Se statistikk",
    href: "/portal/statistikk",
    icon: Heart,
    gradient: "from-[var(--color-grey-800)] to-[var(--color-grey-600)]",
  },
  {
    label: "Se kalender",
    href: "/portal/kalender",
    icon: Calendar,
    gradient: "from-[var(--color-warning)] to-[var(--color-error)]",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export function QuickActions() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-3 gap-3"
    >
      {actions.map((action) => (
        <motion.div key={action.href} variants={itemVariants}>
          <Link
            href={action.href}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--portal-card-border)] bg-[var(--portal-card-bg-solid)] hover:border-[var(--color-grey-200)] transition-colors"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient}`}
            >
              <action.icon className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-sm font-medium text-[var(--portal-text-primary)]">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
