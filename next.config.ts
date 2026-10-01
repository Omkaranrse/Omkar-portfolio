import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 80, 82, 88, 90, 100],
  },
  devIndicators: false,
  allowedDevOrigins: [
    'localhost:3000',
    'localhost:3001',
    'localhost:3002',
    'localhost:3003',
    'localhost:3004',
    'localhost:3005',
    '127.0.0.1:3000',
    '127.0.0.1:3001',
    '127.0.0.1:3002',
    '127.0.0.1:3003',
    '127.0.0.1:3004',
    '127.0.0.1:3005',
    '192.168.0.102:3000',
    '192.168.0.102:3001',
    '192.168.0.102:3002',
    '192.168.0.102:3003',
  ],
};

export default nextConfig;
