import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Ensure CSS is properly processed
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
