"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedNumber({
  value,
  className,
  duration = 1500,
  suffix = "",
  prefix = "",
}: AnimatedNumberProps) {
  const { count, ref } = useAnimatedCounter(value, duration, true);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
