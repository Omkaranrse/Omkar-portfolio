import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 88, 90, 100],
  },
  devIndicators: false,
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '192.168.0.102:3000'],
};

export default nextConfig;

