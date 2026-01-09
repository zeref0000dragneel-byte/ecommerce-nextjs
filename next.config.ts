import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
      },
    ],
  },
  // Next.js 16: eslint config movido a experimental
  experimental: {
    // Deshabilitar TypeScript y ESLint en builds
    typedRoutes: false,
  },
  // Next.js 16: typescript config sigue funcionando
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;