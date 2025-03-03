/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RPC_URL: process.env.RPC_URL,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'arweave.net', 'www.arweave.net'],
  },
}

module.exports = nextConfig