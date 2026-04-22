/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['172.16.0.201'],
  images: {

    qualities: [25, 50, 75, 80, 85, 100],
    formats: ['image/avif', 'image/webp'],

    remotePatterns: [],
  },
};

export default nextConfig;