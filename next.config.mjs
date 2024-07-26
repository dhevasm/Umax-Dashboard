/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.tailgrids.com',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./i18n.js');

export default withNextIntl(nextConfig);
