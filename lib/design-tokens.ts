/**
 * AK Golf Brand System — Design Tokens (Brand Guide V2.0 · 2026)
 * Single source of truth for all design values
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS — Brand Guide V2.0
// ═══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // Kjernefarger (Brand Guide V2.0 §03)
  primary: {
    main: '#005840',       // --akgolf-primary
    accent: '#D1F843',     // --akgolf-accent (CTA, uthevinger)
    surface: '#ECF0EF',    // --akgolf-surface
    text: '#324D45',       // --akgolf-text
    muted: '#A5B2AD',      // --akgolf-muted
    white: '#FFFFFF',
    dark: '#0A1F18',       // Morkeste grønn (dark bg)
  },

  // Grå-skala (brand-avledet, grønn-tonet)
  ink: {
    5: '#ECF0EF',
    10: '#D5DFDB',
    20: '#A5B2AD',
    30: '#7A8C85',
    40: '#5A6E66',
    50: '#3D5249',
    60: '#324D45',
    70: '#1A3529',
    80: '#0A1F18',
    90: '#0A1F18',
    100: '#000000',
  },

  // Alias for backwards compatibility
  grey: {
    50: '#F5F8F7',
    100: '#ECF0EF',
    200: '#D5DFDB',
    300: '#A5B2AD',
    400: '#7A8C85',
    500: '#5A6E66',
    600: '#3D5249',
    700: '#324D45',
    800: '#1A3529',
    900: '#0A1F18',
  },

  // Overflater
  surface: {
    warm: '#FFFFFF',
    cream: '#ECF0EF',
    warmNeutral: '#D5DFDB',
    lightGray: '#A5B2AD',
    snow: '#ECF0EF',
  },

  // Sub-brand farger
  subBrand: {
    academy: '#005840',
    academyLight: '#ECF0EF',
    academyDark: '#0A1F18',
    junior: '#3B82F6',
    juniorLight: '#60A5FA',
    juniorDark: '#2563EB',
    software: '#8B5CF6',
    softwareLight: '#A78BFA',
    softwareDark: '#7C3AED',
    utvikling: '#005840',
    utviklingLight: '#2A7D5A',
    utviklingDark: '#0A1F18',
  },

  // Semantiske farger (Brand Guide V2.0 §04)
  semantic: {
    success: '#2A7D5A',
    successLight: '#E8F5EF',
    successText: '#1A4D36',
    error: '#B84233',
    errorLight: '#FCEAE8',
    errorText: '#7A2C22',
    warning: '#C48A32',
    warningLight: '#FDF4E4',
    warningText: '#7A5520',
    info: '#007AFF',
    infoLight: '#EFF6FF',
    infoText: '#1E40AF',
    vipps: '#FF5B24',
  },

  // Data Visualization Palette
  data: {
    sage: '#2A7D5A',
    sageLight: '#E8F5EF',
    coral: '#E85D4E',
    coralLight: '#FCEAE8',
    blue: '#007AFF',
    blueLight: '#EFF6FF',
    lime: '#D1F843',
    limeSoft: 'rgba(209, 248, 67, 0.20)',
  },

  // AI accent — purple (beholdt fra etablert portal-design)
  ai: {
    primary: '#AF52DE',
    light: '#FAF5FF',
    text: '#6B21A8',
  },

  // Ikoner og tekst
  icon: {
    gray: '#5A6E66',
    muted: '#A5B2AD',
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

export const EASE_ENTRANCE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    default: 'rgba(0, 88, 64, 0.08)',
    light: 'rgba(0, 88, 64, 0.05)',
    strong: 'rgba(0, 88, 64, 0.2)',
    muted: 'rgba(0, 88, 64, 0.1)',
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
