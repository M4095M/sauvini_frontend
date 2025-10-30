import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Produce a smaller, self-contained build ideal for Docker/servers
  output: "standalone",

  // Allow production builds to complete even with ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow production builds to complete even with TS errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // API proxy in development only; in production use absolute API URLs
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/api/v1/:path*",
      },
    ];
  },

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    NEXT_PUBLIC_JITSI_DOMAIN:
      process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si",
  },

  // Image configuration - allow images from backend server
  images: {
    remotePatterns: (() => {
      const patterns = [
        {
          protocol: "http",
          hostname: "127.0.0.1",
          port: "9000",
          pathname: "/**",
        },
        {
          protocol: "http",
          hostname: "localhost",
          port: "9000",
          pathname: "/**",
        },
      ];
      const extra = (process.env.NEXT_IMAGE_DOMAINS || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      for (const domain of extra) {
        patterns.push({
          protocol: "https",
          hostname: domain,
          pathname: "/**",
        } as any);
      }
      return patterns;
    })(),
  },

  // Add basic security headers and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=()" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).(svg|png|jpg|jpeg|gif|webp|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
