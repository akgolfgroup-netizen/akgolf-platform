"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  variant?: "primary" | "secondary" | "accent";
  delay?: number;
}

const variants = {
  primary: {
    bg: "bg-[#154212]",
    text: "text-white",
    hover: "hover:bg-[#0d2e0c]",
    iconBg: "bg-white/20",
  },
  secondary: {
    bg: "bg-white",
    text: "text-[#1c1c16]",
    hover: "hover:bg-[#f7f3ea]",
    iconBg: "bg-[#f7f3ea]",
    border: "border border-[#c2c9bb]/50",
  },
  accent: {
    bg: "bg-[#d2f000]",
    text: "text-[#1c1c16]",
    hover: "hover:bg-[#b8d600]",
    iconBg: "bg-[#1c1c16]/10",
  },
};

export function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  variant = "secondary",
  delay = 0,
}: QuickActionProps) {
  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
          style.bg,
          style.text,
          style.hover,
          "border" in style && style.border,
          "hover:shadow-md"
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            style.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{label}</p>
          {description && (
            <p className={cn("text-xs mt-0.5", variant === "primary" ? "text-white/70" : "text-[#6b7366]")}>
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
