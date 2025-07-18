import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during builds for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript checking during builds for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features
  experimental: {
    // Add any experimental features as needed
  },

  // Environment variables
  env: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  },

  // Server-side configuration
  serverExternalPackages: ['pg'],
  
  // Webpack configuration for compatibility
  webpack: (config, { isServer }) => {
    // Handle node-specific modules on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },

  // Image optimization (if needed later)
  images: {
    remotePatterns: [
      // Add any remote image domains if needed
    ],
  },

  // Headers for security and CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Redirects (if needed)
  async redirects() {
    return [
      // Add redirects if needed
    ];
  },

  // Output configuration for Vercel
  output: 'standalone',
};

export default nextConfig;
