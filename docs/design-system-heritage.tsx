/**
 * AK Sports OS — Design System v3.0 (Heritage Tech)
 * "Luxury meets Precision" — Premium Sports Technology Platform
 * 
 * Brand DNA: Heritage Tech — Deep forest greens meet electric precision
 * 
 * Color Palette: "Heritage Grid"
 * - Deep Moss Green: #2D5A27 (Primary heritage)
 * - Heritage Dark: #1A3520 (Deep backgrounds)
 * - Heritage Light: #3D7A37 (Accents)
 * - Electric Lime: #DFFF00 (CTAs, highlights)
 * - Warm Cream: #F5F1E8 (Light surfaces)
 * - Technical Grey: #2A2D2A (Dark surfaces)
 * 
 * Typography:
 * - Headlines: Badoney Pixel Family (Heritage serif)
 * - Body/UI: Inter (Technical precision)
 * 
 * UI Philosophy: Bento-grid system, dark mode default
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// HERITAGE TECH COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageColors = {
  // Heritage Greens (Primary)
  heritage: {
    deep: '#2D5A27',           // Primary heritage green
    darker: '#1A3520',         // Deep backgrounds
    dark: '#1E4A1A',           // Dark surfaces
    base: '#2D5A27',           // Main brand
    light: '#3D7A37',          // Light accents
    lighter: '#4A9A42',        // Hover states
    muted: '#2D5A2720',        // 12% opacity for backgrounds
    subtle: '#2D5A2710',       // 6% opacity
  },

  // Electric Lime (Accent/CTA)
  lime: {
    base: '#DFFF00',           // Primary CTA
    dark: '#B8D400',           // Hover states
    light: '#E8FF4D',          // Glow effects
    muted: '#DFFF0030',        // 19% opacity backgrounds
    subtle: '#DFFF0015',       // 8% opacity
  },

  // Neutral Heritage (Surfaces)
  neutral: {
    cream: '#F5F1E8',          // Light mode background
    creamDark: '#E8E4DB',      // Secondary surfaces
    warmGrey: '#8A8680',       // Muted text
    charcoal: '#3A3D3A',       // Dark mode cards
    graphite: '#2A2D2A',       // Dark mode background
    ink: '#1A1D1A',            // Deepest dark
    pure: '#0A0D0A',           // Near black
  },

  // Functional Colors
  functional: {
    success: '#00C853',
    successMuted: '#00C85320',
    error: '#FF3D71',
    errorMuted: '#FF3D7120',
    warning: '#FFB800',
    warningMuted: '#FFB80020',
    info: '#00D4FF',
    infoMuted: '#00D4FF20',
  },

  // Gradients
  gradients: {
    heritage: 'linear-gradient(135deg, #2D5A27 0%, #1A3520 100%)',
    heritageGlow: 'linear-gradient(135deg, #2D5A27 0%, #3D7A37 50%, #1A3520 100%)',
    limeBurst: 'linear-gradient(135deg, #DFFF00 0%, #B8D400 100%)',
    darkSurface: 'linear-gradient(180deg, #2A2D2A 0%, #1A1D1A 100%)',
    cardElevation: 'linear-gradient(180deg, #3A3D3A 0%, #2A2D2A 100%)',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DERIVED GRADIENTS (for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageGradients = heritageColors.gradients;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageTypography = {
  // Font Families
  fontFamily: {
    // Heritage serif for headlines (Badoney Pixel Family inspired)
    headline: '"Playfair Display", "Georgia", "Times New Roman", serif',
    // Technical sans-serif for UI
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
  },

  // Font Weights
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  // Type Scale (Heritage sizing)
  size: {
    hero: 'clamp(4rem, 10vw, 7.5rem)',      // 64-120px
    h1: 'clamp(3rem, 6vw, 4.5rem)',         // 48-72px
    h2: 'clamp(2.25rem, 4vw, 3rem)',        // 36-48px
    h3: 'clamp(1.75rem, 3vw, 2.25rem)',     // 28-36px
    h4: '1.5rem',                            // 24px
    h5: '1.25rem',                           // 20px
    h6: '1.125rem',                          // 18px
    lead: '1.25rem',                         // 20px body
    body: '1rem',                            // 16px
    bodySmall: '0.875rem',                   // 14px
    caption: '0.75rem',                      // 12px
    micro: '0.6875rem',                      // 11px
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    heritage: '0.15em',  // Special heritage spacing
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING & LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageSpacing = {
  // Heritage spacing scale (8pt base)
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  2: '0.5rem',       // 8px
  3: '0.75rem',      // 12px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  8: '2rem',         // 32px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
  40: '10rem',       // 160px
  48: '12rem',       // 192px
} as const;

// Bento Grid System
export const bentoGrid = {
  gap: '1rem',
  gapLarge: '1.5rem',
  columns: 12,
  
  // Common bento patterns
  patterns: {
    hero: 'grid-cols-1 lg:grid-cols-12 lg:grid-rows-2',
    stats: 'grid-cols-2 lg:grid-cols-4',
    features: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    dashboard: 'grid-cols-1 lg:grid-cols-12',
  },
  
  // Cell sizes
  cells: {
    full: 'col-span-12',
    half: 'col-span-12 lg:col-span-6',
    third: 'col-span-12 md:col-span-6 lg:col-span-4',
    quarter: 'col-span-6 lg:col-span-3',
    twoThirds: 'col-span-12 lg:col-span-8',
    oneThird: 'col-span-12 lg:col-span-4',
    featured: 'col-span-12 lg:col-span-8 lg:row-span-2',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOWS & EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageShadows = {
  // Dark mode shadows (colored for depth)
  sm: '0 1px 2px rgba(223, 255, 0, 0.05)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(223, 255, 0, 0.05)',
  lg: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(45, 90, 39, 0.2)',
  xl: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(223, 255, 0, 0.1)',
  
  // Glow effects (lime accent)
  glow: '0 0 20px rgba(223, 255, 0, 0.3)',
  glowStrong: '0 0 40px rgba(223, 255, 0, 0.4)',
  glowHeritage: '0 0 30px rgba(45, 90, 39, 0.4)',
  
  // Card elevations
  card: '0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(223, 255, 0, 0.1)',
  cardElevated: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(45, 90, 39, 0.2)',
  
  // Inset
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BORDER & RADIUS
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  '3xl': '1.5rem',   // 24px
  '4xl': '2rem',     // 32px
  full: '9999px',
  
  // Heritage specific
  heritage: '0.75rem',
  card: '1rem',
  button: '0.5rem',
  chip: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageComponents = {
  // Buttons
  button: {
    primary: {
      background: heritageColors.lime.base,
      color: heritageColors.neutral.pure,
      border: 'none',
      borderRadius: heritageRadius.button,
      padding: `${heritageSpacing[3]} ${heritageSpacing[6]}`,
      fontWeight: heritageTypography.weight.semibold,
      fontSize: heritageTypography.size.body,
      boxShadow: heritageShadows.glow,
      hover: {
        background: heritageColors.lime.dark,
        boxShadow: heritageShadows.glowStrong,
        transform: 'translateY(-2px)',
      },
    },
    secondary: {
      background: 'transparent',
      color: heritageColors.lime.base,
      border: `1px solid ${heritageColors.lime.base}`,
      borderRadius: heritageRadius.button,
      padding: `${heritageSpacing[3]} ${heritageSpacing[6]}`,
      fontWeight: heritageTypography.weight.medium,
      hover: {
        background: heritageColors.lime.muted,
        boxShadow: heritageShadows.glow,
      },
    },
    heritage: {
      background: heritageColors.heritage.base,
      color: heritageColors.neutral.cream,
      border: 'none',
      borderRadius: heritageRadius.button,
      padding: `${heritageSpacing[3]} ${heritageSpacing[6]}`,
      fontWeight: heritageTypography.weight.medium,
      hover: {
        background: heritageColors.heritage.light,
        boxShadow: heritageShadows.glowHeritage,
      },
    },
    ghost: {
      background: 'transparent',
      color: heritageColors.neutral.warmGrey,
      border: 'none',
      borderRadius: heritageRadius.button,
      padding: `${heritageSpacing[3]} ${heritageSpacing[6]}`,
      hover: {
        color: heritageColors.neutral.cream,
        background: 'rgba(255, 255, 255, 0.05)',
      },
    },
  },

  // Cards (Bento style)
  card: {
    default: {
      background: heritageColors.neutral.charcoal,
      border: `1px solid rgba(255, 255, 255, 0.06)`,
      borderRadius: heritageRadius.card,
      padding: heritageSpacing[6],
      boxShadow: heritageShadows.card,
    },
    elevated: {
      background: heritageGradients.cardElevation,
      border: `1px solid rgba(223, 255, 0, 0.1)`,
      borderRadius: heritageRadius.card,
      padding: heritageSpacing[6],
      boxShadow: heritageShadows.cardElevated,
    },
    feature: {
      background: heritageColors.neutral.graphite,
      border: `1px solid ${heritageColors.heritage.base}40`,
      borderRadius: heritageRadius['2xl'],
      padding: heritageSpacing[8],
      boxShadow: `${heritageShadows.lg}, ${heritageShadows.glowHeritage}`,
    },
    lime: {
      background: heritageColors.lime.muted,
      border: `1px solid ${heritageColors.lime.base}40`,
      borderRadius: heritageRadius.card,
      padding: heritageSpacing[6],
    },
  },

  // Inputs (Dark mode focused)
  input: {
    background: heritageColors.neutral.ink,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: heritageRadius.lg,
    padding: `${heritageSpacing[3]} ${heritageSpacing[4]}`,
    color: heritageColors.neutral.cream,
    fontSize: heritageTypography.size.body,
    placeholder: heritageColors.neutral.warmGrey,
    focus: {
      borderColor: heritageColors.lime.base,
      boxShadow: `0 0 0 3px ${heritageColors.lime.muted}`,
    },
  },

  // Badges
  badge: {
    lime: {
      background: heritageColors.lime.muted,
      color: heritageColors.lime.base,
      borderRadius: heritageRadius.chip,
      padding: `${heritageSpacing[1]} ${heritageSpacing[3]}`,
      fontSize: heritageTypography.size.caption,
      fontWeight: heritageTypography.weight.semibold,
    },
    heritage: {
      background: heritageColors.heritage.muted,
      color: heritageColors.heritage.light,
      borderRadius: heritageRadius.chip,
      padding: `${heritageSpacing[1]} ${heritageSpacing[3]}`,
      fontSize: heritageTypography.size.caption,
      fontWeight: heritageTypography.weight.semibold,
    },
    neutral: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: heritageColors.neutral.warmGrey,
      borderRadius: heritageRadius.chip,
      padding: `${heritageSpacing[1]} ${heritageSpacing[3]}`,
      fontSize: heritageTypography.size.caption,
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const heritageMotion = {
  // Easing
  easing: {
    heritage: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    precise: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    heritage: '1000ms',
  },

  // Keyframe animations
  keyframes: {
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(223, 255, 0, 0.3); }
        50% { box-shadow: 0 0 40px rgba(223, 255, 0, 0.5); }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,
    pulseLime: `
      @keyframes pulseLime {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface HeritageProviderProps {
  children: React.ReactNode;
  mode?: 'dark' | 'light';
}

/**
 * Heritage Design System Provider
 * Wraps app with Heritage Tech CSS variables
 */
export const HeritageProvider: React.FC<HeritageProviderProps> = ({
  children,
  mode = 'dark',
}) => {
  const isDark = mode === 'dark';
  
  const style: React.CSSProperties = {
    // Heritage colors
    '--heritage-deep': heritageColors.heritage.deep,
    '--heritage-darker': heritageColors.heritage.darker,
    '--heritage-base': heritageColors.heritage.base,
    '--heritage-light': heritageColors.heritage.light,
    '--heritage-muted': heritageColors.heritage.muted,
    
    // Lime accents
    '--lime-base': heritageColors.lime.base,
    '--lime-dark': heritageColors.lime.dark,
    '--lime-muted': heritageColors.lime.muted,
    
    // Surfaces
    '--surface-bg': isDark ? heritageColors.neutral.graphite : heritageColors.neutral.cream,
    '--surface-card': isDark ? heritageColors.neutral.charcoal : heritageColors.neutral.creamDark,
    '--surface-elevated': isDark ? heritageColors.neutral.ink : heritageColors.neutral.cream,
    
    // Text
    '--text-primary': isDark ? heritageColors.neutral.cream : heritageColors.neutral.pure,
    '--text-secondary': heritageColors.neutral.warmGrey,
    '--text-muted': 'rgba(138, 134, 128, 0.7)',
    
    // Fonts
    '--font-headline': heritageTypography.fontFamily.headline,
    '--font-body': heritageTypography.fontFamily.body,
    '--font-mono': heritageTypography.fontFamily.mono,
    
    // Spacing
    '--bento-gap': bentoGrid.gap,
    '--radius-heritage': heritageRadius.heritage,
    '--radius-card': heritageRadius.card,
  } as React.CSSProperties;

  return (
    <div 
      style={style} 
      className={`heritage-design-system ${isDark ? 'heritage-dark' : 'heritage-light'}`}
    >
      {children}
    </div>
  );
};

// Subscription Card Component (20-min coaching concept)
interface CoachingSubscriptionCardProps {
  title: string;
  price: number;
  sessionsPerMonth: number;
  features: string[];
  isPopular?: boolean;
}

export const CoachingSubscriptionCard: React.FC<CoachingSubscriptionCardProps> = ({
  title,
  price,
  sessionsPerMonth,
  features,
  isPopular = false,
}) => {
  return (
    <div
      style={{
        background: isPopular ? heritageGradients.heritageGlow : heritageColors.neutral.charcoal,
        border: `1px solid ${isPopular ? heritageColors.lime.base : 'rgba(255, 255, 255, 0.06)'}`,
        borderRadius: heritageRadius['2xl'],
        padding: heritageSpacing[8],
        boxShadow: isPopular ? heritageShadows.glow : heritageShadows.card,
      }}
    >
      {isPopular && (
        <span
          style={{
            background: heritageColors.lime.base,
            color: heritageColors.neutral.pure,
            padding: `${heritageSpacing[1]} ${heritageSpacing[3]}`,
            borderRadius: heritageRadius.chip,
            fontSize: heritageTypography.size.caption,
            fontWeight: heritageTypography.weight.semibold,
          }}
        >
          Mest populær
        </span>
      )}
      
      <h3
        style={{
          fontFamily: heritageTypography.fontFamily.headline,
          fontSize: heritageTypography.size.h3,
          color: heritageColors.neutral.cream,
          marginTop: heritageSpacing[4],
          marginBottom: heritageSpacing[2],
        }}
      >
        {title}
      </h3>
      
      <div style={{ marginBottom: heritageSpacing[6] }}>
        <span
          style={{
            fontFamily: heritageTypography.fontFamily.headline,
            fontSize: heritageTypography.size.hero,
            color: isPopular ? heritageColors.lime.base : heritageColors.neutral.cream,
          }}
        >
          {price.toLocaleString('no-NO')}
        </span>
        <span style={{ color: heritageColors.neutral.warmGrey }}> kr/mnd</span>
      </div>
      
      <div
        style={{
          background: heritageColors.heritage.muted,
          borderRadius: heritageRadius.lg,
          padding: heritageSpacing[4],
          marginBottom: heritageSpacing[6],
        }}
      >
        <span style={{ color: heritageColors.lime.base, fontWeight: heritageTypography.weight.semibold }}>
          {sessionsPerMonth} × 20 minutter
        </span>
        <span style={{ color: heritageColors.neutral.warmGrey, display: 'block', fontSize: heritageTypography.size.bodySmall }}>
          coaching per måned
        </span>
      </div>
      
      <ul style={{ marginBottom: heritageSpacing[8] }}>
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: heritageSpacing[3],
              color: heritageColors.neutral.cream,
              fontSize: heritageTypography.size.bodySmall,
              marginBottom: heritageSpacing[3],
            }}
          >
            <span style={{ color: heritageColors.lime.base }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        style={{
          width: '100%',
          background: isPopular ? heritageColors.lime.base : 'transparent',
          color: isPopular ? heritageColors.neutral.pure : heritageColors.lime.base,
          border: isPopular ? 'none' : `1px solid ${heritageColors.lime.base}`,
          borderRadius: heritageRadius.button,
          padding: `${heritageSpacing[4]} ${heritageSpacing[6]}`,
          fontWeight: heritageTypography.weight.semibold,
          cursor: 'pointer',
        }}
      >
        Velg abonnement
      </button>
    </div>
  );
};

export default {
  colors: heritageColors,
  typography: heritageTypography,
  spacing: heritageSpacing,
  bentoGrid,
  shadows: heritageShadows,
  radius: heritageRadius,
  components: heritageComponents,
  motion: heritageMotion,
  HeritageProvider,
  CoachingSubscriptionCard,
};
