/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/backend/api/:path*',
        destination: 'http://127.0.0.1:8000/backend/api/:path*',
      },
    ];
  },
};

export default nextConfig;
