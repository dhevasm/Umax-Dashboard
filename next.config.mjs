/** @type {import('next').NextConfig} */
const nextConfig = {
    beforeFiles: [
        {
        source: '/backend/:path*',
        destination: 'https://umaxxxxx-1-r8435045.deta.app/:path*',
        },
    ],
};

export default nextConfig;
