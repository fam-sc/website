import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  redirects: () =>
    Promise.resolve([
      { source: '/u', destination: '/u/info', permanent: true },
    ]),
  serverExternalPackages: ['knex'],
};

export default nextConfig;
