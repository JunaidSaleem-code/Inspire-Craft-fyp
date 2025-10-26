import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  
  // Remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;

