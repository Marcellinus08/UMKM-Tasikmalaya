import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['tailwindcss'],
  // Disable CSS minification to prevent aggressive purging
  experimental: {
    optimizePackageImports: ['firebase'],
  },
};

export default nextConfig;
