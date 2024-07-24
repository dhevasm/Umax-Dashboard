/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig = {};

const withNextIntl = createNextIntlPlugin(
    './i18n.js'
)

export default withNextIntl(nextConfig);
