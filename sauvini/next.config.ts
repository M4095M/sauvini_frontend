import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // API proxy configuration to route requests to Rust backend
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1/:path*',
      },
    ];
  },
  
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
};

export default nextConfig;
