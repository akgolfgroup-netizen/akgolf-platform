"use client";

import { useState, useEffect } from "react";

/**
 * Hook som detekterer om brukeren foretrekker redusert bevegelse.
 * Respekterer system-innstillingen "Reduce motion" (macOS/iOS/Windows).
 *
 * @returns true hvis brukeren foretrekker redusert bevegelse
 *
 * @example
 * const prefersReduced = useReducedMotion();
 * if (prefersReduced) {
 *   // Skip animasjoner eller bruk instant transitions
 * }
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Returnerer animasjons-props for Framer Motion basert på reduced-motion preferanse.
 * Bruk dette for å enkelt disable animasjoner.
 *
 * @example
 * const motionProps = useMotionProps();
 * <motion.div {...motionProps.fadeIn}>Content</motion.div>
 */
export function useMotionProps() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return {
      fadeIn: { initial: {}, animate: {}, transition: { duration: 0 } },
      slideUp: { initial: {}, animate: {}, transition: { duration: 0 } },
      scale: { whileHover: {}, whileTap: {} },
    };
  }

  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    scale: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
  };
}
