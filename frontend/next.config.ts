import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
