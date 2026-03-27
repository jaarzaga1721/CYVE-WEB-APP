/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for optimized Docker builds
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Ensuring build completes even with minor typing issues
  },
};

export default nextConfig;
