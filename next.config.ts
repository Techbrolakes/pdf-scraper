import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_STRIPE_PRICE_BASIC: process.env.STRIPE_PRICE_BASIC,
    NEXT_PUBLIC_STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO,
  },
  // Configure external packages for serverless compatibility
  serverExternalPackages: ['canvas', 'sharp'],
  webpack: (config) => {
    // Canvas and sharp are native modules that need special handling
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'commonjs canvas',
      sharp: 'commonjs sharp',
    });
    
    // Handle pdfjs-dist for client-side
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['pdfjs-dist'] = 'pdfjs-dist/legacy/build/pdf.mjs';
    
    return config;
  },
  turbopack: {},
};

export default nextConfig;
