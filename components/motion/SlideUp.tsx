"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export function SlideUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
  distance = 30,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0, 0.55, 0.45, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
