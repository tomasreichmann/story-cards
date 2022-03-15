/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['images.ctfassets.net'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      dns: false,
      tls: false,
    };

    return config;
  },
};

module.exports = nextConfig;
