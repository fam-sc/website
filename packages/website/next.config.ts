import type { NextConfig } from 'next';
import path from 'path';

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
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
