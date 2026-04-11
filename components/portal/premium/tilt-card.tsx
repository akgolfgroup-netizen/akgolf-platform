"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Styrke pa 3D-tilt (deg). Default 8 */
  tiltStrength?: number;
}

/**
 * 3D tilt-kort som folger musen. Bruk pa premium-stat-kort og hero-kort.
 */
export function TiltCard({ children, className, tiltStrength = 8 }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mxs = useSpring(x, { stiffness: 200, damping: 20 });
  const mys = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mys, [-0.5, 0.5], [`${tiltStrength}deg`, `-${tiltStrength}deg`]);
  const rotateY = useTransform(mxs, [-0.5, 0.5], [`-${tiltStrength}deg`, `${tiltStrength}deg`]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shimmer — wipe-effekt ved hover. Bruk inne i .group-element.
 */
export function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
