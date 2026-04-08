"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  iconColor = "#154212",
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 shadow-sm",
        "hover:shadow-md hover:border-[#c2c9bb] transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7366]">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#1c1c16] mt-2 tabular-nums">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.value < 0 ? "text-[#22c55e]" : "text-[#ef4444]"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-xs text-[#8a9385]">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </motion.div>
  );
}
