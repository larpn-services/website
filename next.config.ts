import type { NextConfig } from "next";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Content Security Policy.
//   - default-src 'self'       — only same-origin by default
//   - script-src 'unsafe-inline' — Next.js inlines a small bootstrap script and
//                                  framer-motion writes inline style attributes;
//                                  matching style-src below.
//   - connect-src includes Supabase (for FAQ submissions/likes) and Spline's
//     CDN (for the hero scene .splinecode fetch).
//   - img-src allows the Unsplash + Pinterest CDNs already on the
//     `images.remotePatterns` allowlist, plus inline data: URLs (used for the
//     SVG grain texture in globals.css).
//   - frame-ancestors 'none' is redundant with X-Frame-Options: DENY but
//     stops modern clickjacking attempts that ignore the legacy header.
const cspParts = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://prod.spline.design",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://i.pinimg.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://prod.spline.design https://formsubmit.co",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS — instruct browsers to only contact larpn over HTTPS for the next
  // two years, including subdomains, and allow Chrome preloading. Vercel
  // terminates TLS so this is safe to enable.
  {
    key: "Strict-Transport-Security",
    value: `max-age=${ONE_YEAR * 2}; includeSubDomains; preload`,
  },
  // Cross-origin isolation — prevents popups we open from sharing a
  // browsing context. `same-origin-allow-popups` keeps third-party OAuth /
  // share popups (none right now, but doesn't break future work) functional.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Content-Security-Policy", value: cspParts.join("; ") },
];

const nextConfig: NextConfig = {
  // Strip the "X-Powered-By: Next.js" fingerprint header.
  poweredByHeader: false,
  // Default is already true on prod; explicit so we never accidentally regress.
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  transpilePackages: ["@splinetool/react-spline"],
  // Pin Turbopack's workspace root to this project. Without this Next walks up
  // and picks the user's home folder when it finds a stray lockfile there,
  // which breaks the dev cache on Windows.
  turbopack: {
    root: process.cwd(),
  },
  // Tree-shake heavy barrel imports — Next will rewrite `import { X } from "lucide-react"`
  // to a direct file import so we don't ship the whole icon set.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Serve AVIF first, fall back to WebP, then original. AVIF is ~30% smaller.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images on disk for a month.
    minimumCacheTTL: 2678400,
    // Allowlist — Next 16 requires this; we only use 75 today.
    qualities: [50, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
  async headers() {
    return [
      // Security headers on every response.
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Long-lived immutable cache for hashed build assets.
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      // Optimized images: a month at the edge, allow stale-while-revalidate.
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400, stale-while-revalidate=86400",
          },
        ],
      },
      // Static logo / favicon — fingerprinted by file name, safe to cache hard.
      {
        source: "/larpn.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
