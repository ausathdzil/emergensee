import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    dynamicIO: true,
    ppr: true,
    nodeMiddleware: true,
    viewTransition: true,
  },
};

export default nextConfig;
