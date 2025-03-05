/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RPC_URL: process.env.RPC_URL,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'arweave.net', 'www.arweave.net', 'icons.llamao.fi'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
}

module.exports = nextConfig