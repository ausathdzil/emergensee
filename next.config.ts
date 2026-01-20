import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    cacheComponents: true,
    ppr: true,
  },
};

export default nextConfig;
