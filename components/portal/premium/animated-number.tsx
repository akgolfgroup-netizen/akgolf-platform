"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * Spring physics counter som animerer fra 0 til verdien.
 * Starter når elementet kommer i viewport.
 */
export function AnimatedNumber({
  value,
  duration = 1500,
  decimals = 0,
  className,
  suffix,
  prefix,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
    duration,
  });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        const formatted = decimals > 0
          ? latest.toFixed(decimals).replace(".", ",")
          : Math.round(latest).toLocaleString("nb-NO");
        ref.current.textContent =
          (prefix ?? "") + formatted + (suffix ?? "");
      }
    });
  }, [spring, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix ?? ""}
      {decimals > 0 ? "0,0" : "0"}
      {suffix ?? ""}
    </span>
  );
}
