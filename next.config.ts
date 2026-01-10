import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  compiler: {
    // Remove console logs in production for smaller bundle
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];

    // Tree shake Three.js modules for smaller bundle
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': 'three/build/three.module.js'
      };
    }

    return config;
  },
};

export default nextConfig;
