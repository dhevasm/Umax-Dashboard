/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.js
module.exports = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://umaxxxxx-1-r8435045.deta.app',
          },
        ]
      },
  };

export default nextConfig;
