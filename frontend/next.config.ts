import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
