"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useInView,
  useTransform,
  motion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  /** Target value to animate to */
  value: number;
  /** Direction of counting */
  direction?: "up" | "down";
  /** Decimal places to display */
  decimalPlaces?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Starting value */
  startValue?: number;
  /** Optional className */
  className?: string;
  /** Prefix (e.g. "+" or "-") */
  prefix?: string;
  /** Suffix (e.g. "%" or "kr") */
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  decimalPlaces = 0,
  delay = 0,
  startValue,
  className,
  prefix,
  suffix,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const defaultStart = direction === "down" ? value : 0;
  const start = startValue ?? defaultStart;

  const motionValue = useMotionValue(start);

  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });

  const display = useTransform(springValue, (current) =>
    Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(current.toFixed(decimalPlaces))),
  );

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      motionValue.set(value);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay, motionValue]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
