/**
 * AK Golf Brand System v5.0 - Design Tokens (Brand Guide 2026)
 * Single source of truth for all design values
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // Primære brand-farger (Brand Guide 2026 — Monokrom + Signal)
  primary: {
    midnightNavy: '#1D1D1F',
    navyLight: '#6E6E73',
    navyDark: '#1D1D1F',
    softGold: '#1D1D1F',
    goldLight: '#6E6E73',
    goldDark: '#1D1D1F',
    goldMuted: '#86868B',
    goldText: '#1D1D1F',
    snow: '#F5F5F5',
    deepInk: '#1D1D1F',
  },

  // Ink-skala (nøytral grå)
  ink: {
    5: '#F5F5F5',
    10: '#E8E8ED',
    20: '#D2D2D7',
    30: '#AEAEB2',
    40: '#86868B',
    50: '#6E6E73',
    60: '#48484A',
    70: '#3A3A3C',
    80: '#2C2C2E',
    90: '#1D1D1F',
    100: '#000000',
  },

  // Overflater
  surface: {
    warm: '#F5F5F5',
    cream: '#F5F5F7',
    warmNeutral: '#E8E8ED',
    lightGray: '#D2D2D7',
    snow: '#F5F5F7',
  },

  // Sub-brand farger
  subBrand: {
    academy: '#1D1D1F',
    academyLight: '#6E6E73',
    academyDark: '#1D1D1F',
    junior: '#3B82F6',
    juniorLight: '#60A5FA',
    juniorDark: '#2563EB',
    software: '#8B5CF6',
    softwareLight: '#A78BFA',
    softwareDark: '#7C3AED',
    utvikling: '#22C55E',
    utviklingLight: '#4ADE80',
    utviklingDark: '#16A34A',
  },

  // Semantiske farger
  semantic: {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    vipps: '#FF5B24',
  },

  // Ikoner og tekst
  icon: {
    gray: '#64748B',
    muted: '#9BA5B2',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ACCENT COLORS (for Tailwind classes)
// ═══════════════════════════════════════════════════════════════════════════════

export const ACCENT_COLORS = {
  academy: 'bg-academy',
  junior: 'bg-junior', 
  software: 'bg-software',
  utvikling: 'bg-utvikling',
  gold: 'bg-gold',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.6,
    relaxed: 1.7,
  },

  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.06em',
    wider: '0.12em',
  },

  // Preset kombinasjoner fra Brand System
  presets: {
    hero: {
      fontSize: '3.75rem', // 60px
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.4,
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.7,
    },
    bodySmall: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.6,
    },
    label: {
      fontSize: '0.75rem', // 12px
      fontWeight: 600,
      letterSpacing: '0.12em',
      lineHeight: 1.5,
      textTransform: 'uppercase' as const,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.5,
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════════════════════════════

export const spacing = {
  // Base scale (4px grid)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px

  // Seksjons-spacing (responsivt)
  section: {
    mobile: '5rem',
    tablet: '6rem',
    desktop: '7rem',
    large: '10rem',
  },

  // Container
  container: {
    maxWidth: '1120px',
    padding: {
      mobile: '1rem',
      tablet: '1.5rem',
      desktop: '2rem',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION (fra Brand System Motion-kit)
// ═══════════════════════════════════════════════════════════════════════════════

export const motion = {
  // Easing functions
  ease: {
    // Standard UI transitions
    premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Exits and dismissals
    outExpo: 'cubic-bezier(0, 0.55, 0.45, 1)',
    // Playful, bouncy effects
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Entrances
    inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
    // Micro-interactions
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },

  // Durations
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Preset animations
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
    stagger: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },

  // Hover effects
  hover: {
    scale: 'scale(1.02)',
    scaleStrong: 'scale(1.05)',
    lift: 'translateY(-2px)',
    duration: '300ms',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// FRAMER MOTION EASING (array format for Framer Motion)
// ═══════════════════════════════════════════════════════════════════════════════

export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════════════════════

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.06)',
  lg: '0 12px 40px rgba(0, 0, 0, 0.08)',
  gold: '0 12px 40px rgba(29, 29, 31, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
  goldSm: '0 4px 20px rgba(29, 29, 31, 0.12)',
  goldLg: '0 8px 30px rgba(29, 29, 31, 0.16)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BORDERS & RADIUS
// ═══════════════════════════════════════════════════════════════════════════════

export const borders = {
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },

  color: {
    default: 'rgba(29, 29, 31, 0.08)',
    light: 'rgba(29, 29, 31, 0.05)',
    gold: 'rgba(29, 29, 31, 0.2)',
    goldMuted: 'rgba(29, 29, 31, 0.1)',
  },

  radius: {
    none: '0',
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    '3xl': '2.5rem',// 40px
    full: '9999px',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// Z-INDEX SCALE
// ═══════════════════════════════════════════════════════════════════════════════

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  nav: 50,
  overlay: 60,
  modal: 70,
  popover: 80,
  tooltip: 90,
  loader: 100,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND ASSETS
// ═══════════════════════════════════════════════════════════════════════════════

export const assets = {
  // Logo paths
  logo: {
    svg: '/images/logo/ak-logo-master.svg',
    png: {
      small: '/images/logo/ak-logo-512x447.png',
      medium: '/images/logo/ak-logo-1024x894.png',
      large: '/images/logo/ak-logo-2048x1789.png',
    },
    favicon: '/images/logo/ak-logo-favicon-128.png',
    social: '/images/logo/ak-logo-social-hvit-bg.png',
  },

  // Branding bilder
  images: {
    branding: '/images/branding/',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Formater pris i norske kroner (fra øre til kr)
 */
export function formatPrice(ore: number): string {
  const kr = ore / 100;
  return kr.toLocaleString('nb-NO', { minimumFractionDigits: 0 }) + ' kr';
}

/**
 * Formater pris med valutasymbol
 */
export function formatCurrency(amount: number, currency: 'NOK' | 'EUR' | 'USD' = 'NOK'): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / (currency === 'NOK' ? 100 : 1));
}

/**
 * Get sub-brand color
 */
export function getSubBrandColor(brand: 'academy' | 'junior' | 'software' | 'utvikling'): string {
  return colors.subBrand[brand];
}

/**
 * Get responsive spacing value
 */
export function getResponsiveSpacing(
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large'
): string {
  return spacing.section[breakpoint];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCENT COLORS (text variants)
// ═══════════════════════════════════════════════════════════════════════════════

export const ACCENT_TEXT_COLORS = {
  academy: "text-academy",
  junior: "text-junior",
  software: "text-software", 
  utvikling: "text-utvikling",
  gold: "text-gold",
} as const;

export type Accent = keyof typeof ACCENT_COLORS;

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION SHORTCUTS (for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

// Note: EASE_ENTRANCE is defined above as array for Framer Motion
export const EASE_PREMIUM = motion.ease.premium;
export const EASE_SPRING = motion.ease.spring;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Motion = typeof motion;
export type Shadows = typeof shadows;
export type Borders = typeof borders;
export type ZIndex = typeof zIndex;
export type Breakpoints = typeof breakpoints;
export type Assets = typeof assets;
