"use client";

import { motion } from "framer-motion";

interface VisualCardProps {
  imageSrc: string;
  tag: string;
  title: string;
  meta: string;
  delay?: number;
}

export function VisualCard({
  imageSrc,
  tag,
  title,
  meta,
  delay = 0,
}: VisualCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className="group relative h-[180px] overflow-hidden rounded-2xl border border-black/[0.06]"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02)",
      }}
    >
      <img
        src={imageSrc}
        alt=""
        className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-success)]">
          {tag}
        </p>
        <p className="mt-1 text-[15px] font-semibold leading-tight tracking-[-0.02em] text-[#F5F5F7]">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-white/60">{meta}</p>
      </div>
    </motion.div>
  );
}
