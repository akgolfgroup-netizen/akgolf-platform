/**
 * Felles motion-presets for AK Golf-spillerportalen.
 *
 * Bruk disse i Framer Motion-komponenter for konsistent rytme og easing
 * pa tvers av portalen. Variantene er bevisst rolige (300-600ms) og
 * Apple-aktige — ingen sprett, ingen overshoot.
 */

/** Standard easing — Material/Apple-inspirert ease-in-out. */
export const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Ekspressiv ease-out — bra for hero-elementer som "lander". */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fader inn fra 20px ned. Default for headere og hero-blokker. */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Ren fade — bruk for bakgrunner og overlay-lag. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

/** Slider inn fra hoyre — bruk for sidepaneler og kort som kommer "fra siden". */
export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Subtil scale-in — bra for modaler, popovers og fokus-kort. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Container som staggrer barn-animasjoner sekvensielt. */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
