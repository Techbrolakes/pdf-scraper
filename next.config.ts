import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_STRIPE_PRICE_BASIC: process.env.STRIPE_PRICE_BASIC,
    NEXT_PUBLIC_STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO,
  },
  // Removed canvas and sharp - not needed for text-only PDF extraction
  turbopack: {},
};

export default nextConfig;
