import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Exclude stitch-export from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  distDir: '.next',
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    // Next.js 16 krever eksplisitt liste over tillatte quality-verdier.
    // Inkluder vanlige verdier brukt i komponenter (75 default, 78 for hero, 85 for galleri).
    qualities: [60, 70, 75, 78, 80, 85, 90, 95, 100],
  },
  // Enable compression
  compress: true,
  // Security headers
  async headers() {
    return [
      {
        // Design-reference: ingen X-Frame-Options (statiske mockups, kun for preview)
        source: "/design-reference/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        // Alt annet: DENY iframes (ekskluderer design-reference via negative lookahead)
        source: "/((?!design-reference).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Redirects for old URLs
  async redirects() {
    return [];
  },
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
