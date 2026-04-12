"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VisualCardProps {
  imageSrc: string;
  tag: string;
  title: string;
  meta: string;
  delay?: number;
  wide?: boolean;
}

export function VisualCard({
  imageSrc,
  tag,
  title,
  meta,
  delay = 0,
  wide = false,
}: VisualCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-black/[0.06]",
        wide ? "h-[160px]" : "h-[180px]",
      )}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02)",
      }}
    >
      <img
        src={imageSrc}
        alt=""
        className={cn(
          "h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]",
          wide && "object-[center_40%]",
        )}
      />
      <div
        className="absolute inset-0"
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)"
            : "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div
        className={cn(
          "absolute z-10",
          wide ? "bottom-0 left-0 top-0 flex flex-col justify-center p-6" : "bottom-0 left-0 right-0 p-4",
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-success)]">
          {tag}
        </p>
        <p className={cn(
          "mt-1 font-semibold leading-tight tracking-[-0.02em] text-[#F5F5F7]",
          wide ? "text-lg" : "text-[15px]",
        )}>
          {title}
        </p>
        <p className="mt-0.5 text-xs text-white/60">{meta}</p>
      </div>
    </motion.div>
  );
}
