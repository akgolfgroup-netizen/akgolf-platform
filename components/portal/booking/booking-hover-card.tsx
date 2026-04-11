"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

/**
 * BookingHoverCard — Aceternity-inspirert hover-glow effekt.
 *
 * Wrapper som viser en subtil grønn glow bak kortet ved hover.
 * Brukes rundt booking-kort for premium-feel.
 */

interface BookingHoverCardProps {
  children: React.ReactNode;
  className?: string;
  /** Indeks i listen — brukes for staggered animation */
  index?: number;
}

export function BookingHoverCardGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <BookingHoverContext.Provider value={{ hoveredIndex, setHoveredIndex }}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </BookingHoverContext.Provider>
  );
}

const BookingHoverContext = React.createContext<{
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}>({
  hoveredIndex: null,
  setHoveredIndex: () => {},
});

export function BookingHoverCard({
  children,
  className,
  index = 0,
}: BookingHoverCardProps) {
  const { hoveredIndex, setHoveredIndex } =
    React.useContext(BookingHoverContext);

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Glow-bakgrunn */}
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.div
            className="absolute -inset-px rounded-[26px] bg-primary/[0.06] z-0"
            layoutId="booking-hover-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Kort-innhold */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
