/**
 * AK Golf Group & Academy — Design System v2.0
 * "Quiet Luxury" Digital Ecosystem
 * 
 * Brand Concept: "Aktiv livet ut" (Active for Life)
 * Visual Style: Clean, minimalist, high-tech
 * 
 * Typography:
 * - Headlines: Shippori Mincho (Serif) — Premium, intellectual feel
 * - Body/UI: DM Sans (Light 200) — Technical precision, readability
 * 
 * Color Palettes:
 * - Palette 01 (Institutional): Deep Navy #0A1F44, Classic White #FFFFFF, Silver #C0C0C0
 * - Palette 02 (Academy/Performance): Forest Green #1B4D3E, Gold #D4AF37, Cool Grey #8E9091
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // Palette 01: Institutional (AK Golf Group)
  institutional: {
    deepNavy: '#0A1F44',           // Primary institutional
    deepNavyLight: '#1A3A6B',      // Hover states
    deepNavyDark: '#05142E',       // Deep backgrounds
    classicWhite: '#FFFFFF',       // Primary background
    silver: '#C0C0C0',             // Secondary accents
    silverLight: '#E8E8E8',        // Borders, dividers
    silverDark: '#8A8A8A',         // Muted text
  },

  // Palette 02: Academy/Performance (AK Golf Academy)
  academy: {
    forestGreen: '#1B4D3E',        // Primary academy
    forestGreenLight: '#2D6A4F',   // Hover states
    forestGreenDark: '#0F2E26',    // Deep backgrounds
    forestGreenMuted: '#EDF5F0',   // Light backgrounds
    gold: '#D4AF37',               // CTAs, highlights
    goldLight: '#E8D991',          // Hover gold
    goldDark: '#B8941F',           // Active states
    coolGrey: '#8E9091',           // Secondary text
    coolGreyLight: '#B8B9BA',      // Borders
    coolGreyDark: '#5A5B5C',       // Body text
  },

  // Semantic Colors
  semantic: {
    success: '#34C759',
    successLight: '#F0FDF4',
    successDark: '#166534',
    error: '#FF3B30',
    errorLight: '#FEF2F2',
    errorDark: '#991B1B',
    warning: '#FF9500',
    warningLight: '#FFFBEB',
    warningDark: '#92400E',
    info: '#007AFF',
    infoLight: '#EFF6FF',
    infoDark: '#1E40AF',
  },

  // Neutral Scale
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F7',
    200: '#E8E8ED',
    300: '#D2D2D7',
    400: '#86868B',
    500: '#6E6E73',
    600: '#48484A',
    700: '#3A3A3C',
    800: '#2C2C2E',
    900: '#1D1D1F',
    950: '#0A0A0A',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const typography = {
  // Font Families
  fontFamily: {
    headline: '"Shippori Mincho", Georgia, "Times New Roman", serif',
    body: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  // Font Weights
  weight: {
    light: 200,        // DM Sans Light for body
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Type Scale
  size: {
    hero: 'clamp(3.5rem, 8vw, 6rem)',        // 56-96px
    h1: 'clamp(2.5rem, 5vw, 3.5rem)',        // 40-56px
    h2: 'clamp(2rem, 4vw, 2.5rem)',          // 32-40px
    h3: 'clamp(1.5rem, 3vw, 2rem)',          // 24-32px
    h4: '1.5rem',                             // 24px
    h5: '1.25rem',                            // 20px
    h6: '1.125rem',                           // 18px
    bodyLarge: '1.125rem',                    // 18px
    body: '1rem',                             // 16px
    bodySmall: '0.875rem',                    // 14px
    caption: '0.75rem',                       // 12px
    micro: '0.6875rem',                       // 11px
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,      // Headlines
    snug: 1.25,      // Subheadings
    normal: 1.5,     // Body text
    relaxed: 1.7,    // Reading text
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.12em',  // Labels, captions
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const spacing = {
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const shadows = {
  sm: '0 1px 2px rgba(10, 31, 68, 0.04)',
  md: '0 4px 12px rgba(10, 31, 68, 0.06)',
  lg: '0 12px 40px rgba(10, 31, 68, 0.08)',
  xl: '0 24px 60px rgba(10, 31, 68, 0.12)',
  card: '0 1px 3px rgba(10, 31, 68, 0.04), 0 4px 8px rgba(10, 31, 68, 0.02)',
  cardHover: '0 4px 12px rgba(10, 31, 68, 0.08), 0 8px 24px rgba(10, 31, 68, 0.04)',
  elevated: '0 20px 60px rgba(10, 31, 68, 0.12)',
  gold: '0 4px 20px rgba(212, 175, 55, 0.25)',
  green: '0 4px 20px rgba(27, 77, 62, 0.2)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BORDER RADIUS TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const radius = {
  none: '0',
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  '3xl': '1.5rem',   // 24px
  full: '9999px',    // Pill/circle
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITION TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    out: 'cubic-bezier(0, 0.55, 0.45, 1)',
    in: 'cubic-bezier(0.55, 0, 1, 0.45)',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BREAKPOINT TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
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
// COMPONENT STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const componentStyles = {
  // Button Variants
  button: {
    primary: {
      background: colors.academy.forestGreen,
      color: colors.institutional.classicWhite,
      border: 'none',
      borderRadius: radius.full,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontWeight: typography.weight.medium,
      fontSize: typography.size.body,
      boxShadow: shadows.green,
      hover: {
        background: colors.academy.forestGreenLight,
        transform: 'translateY(-2px)',
      },
    },
    secondary: {
      background: 'transparent',
      color: colors.institutional.deepNavy,
      border: `1px solid ${colors.institutional.silverLight}`,
      borderRadius: radius.full,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontWeight: typography.weight.medium,
      hover: {
        background: colors.neutral[50],
        borderColor: colors.institutional.silver,
      },
    },
    gold: {
      background: colors.academy.gold,
      color: colors.institutional.deepNavy,
      border: 'none',
      borderRadius: radius.full,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontWeight: typography.weight.semibold,
      boxShadow: shadows.gold,
      hover: {
        background: colors.academy.goldLight,
        transform: 'translateY(-2px)',
      },
    },
    ghost: {
      background: 'transparent',
      color: colors.academy.forestGreen,
      border: 'none',
      borderRadius: radius.full,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontWeight: typography.weight.medium,
      hover: {
        background: colors.academy.forestGreenMuted,
      },
    },
  },

  // Card Variants
  card: {
    default: {
      background: colors.institutional.classicWhite,
      border: `1px solid ${colors.institutional.silverLight}`,
      borderRadius: radius['2xl'],
      padding: spacing[6],
      boxShadow: shadows.card,
    },
    elevated: {
      background: colors.institutional.classicWhite,
      border: `1px solid ${colors.institutional.silverLight}`,
      borderRadius: radius['2xl'],
      padding: spacing[6],
      boxShadow: shadows.lg,
    },
    academy: {
      background: colors.academy.forestGreenMuted,
      border: `1px solid ${colors.academy.forestGreen}`,
      borderRadius: radius['2xl'],
      padding: spacing[6],
    },
    institutional: {
      background: colors.institutional.deepNavy,
      color: colors.institutional.classicWhite,
      border: 'none',
      borderRadius: radius['2xl'],
      padding: spacing[6],
    },
  },

  // Input Styles
  input: {
    background: colors.institutional.classicWhite,
    border: `1px solid ${colors.institutional.silverLight}`,
    borderRadius: radius.lg,
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.size.body,
    focus: {
      borderColor: colors.academy.forestGreen,
      boxShadow: `0 0 0 3px ${colors.academy.forestGreenMuted}`,
    },
  },

  // Badge Styles
  badge: {
    default: {
      background: colors.neutral[100],
      color: colors.neutral[700],
      borderRadius: radius.full,
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
    },
    gold: {
      background: colors.academy.goldLight,
      color: colors.academy.goldDark,
      borderRadius: radius.full,
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
    },
    forest: {
      background: colors.academy.forestGreenMuted,
      color: colors.academy.forestGreen,
      borderRadius: radius.full,
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const layout = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1400px',
  },
  sidebar: {
    width: '280px',
    widthCollapsed: '72px',
  },
  header: {
    height: '72px',
  },
  grid: {
    gap: spacing[6],
    columns: 12,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a CSS variable string from a color token
 */
export const cssVar = (name: string, value: string): string => `--ak-${name}: ${value};`;

/**
 * Generate all CSS custom properties
 */
export const generateCSSVariables = (): string => {
  const variables: string[] = [];
  
  // Add color variables
  Object.entries(colors.institutional).forEach(([key, value]) => {
    variables.push(cssVar(`color-institutional-${key}`, value));
  });
  
  Object.entries(colors.academy).forEach(([key, value]) => {
    variables.push(cssVar(`color-academy-${key}`, value));
  });
  
  Object.entries(colors.semantic).forEach(([key, value]) => {
    variables.push(cssVar(`color-semantic-${key}`, value));
  });
  
  return variables.join('\n');
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENTS (Basic Examples)
// ═══════════════════════════════════════════════════════════════════════════════

interface DesignSystemProviderProps {
  children: React.ReactNode;
  variant?: 'institutional' | 'academy';
}

/**
 * Design System Provider — Wraps the app with CSS variables
 */
export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  children,
  variant = 'academy',
}) => {
  const style: React.CSSProperties = {
    '--ak-primary': variant === 'academy' ? colors.academy.forestGreen : colors.institutional.deepNavy,
    '--ak-primary-light': variant === 'academy' ? colors.academy.forestGreenLight : colors.institutional.deepNavyLight,
    '--ak-primary-dark': variant === 'academy' ? colors.academy.forestGreenDark : colors.institutional.deepNavyDark,
    '--ak-accent': colors.academy.gold,
    '--ak-accent-light': colors.academy.goldLight,
    '--ak-background': colors.institutional.classicWhite,
    '--ak-surface': colors.neutral[50],
    '--ak-text-primary': colors.institutional.deepNavy,
    '--ak-text-secondary': colors.academy.coolGreyDark,
    '--ak-text-muted': colors.academy.coolGrey,
    '--ak-border': colors.institutional.silverLight,
    '--ak-font-headline': typography.fontFamily.headline,
    '--ak-font-body': typography.fontFamily.body,
  } as React.CSSProperties;

  return (
    <div style={style} className="ak-design-system">
      {children}
    </div>
  );
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  radius,
  transitions,
  breakpoints,
  zIndex,
  componentStyles,
  layout,
  generateCSSVariables,
  DesignSystemProvider,
};
