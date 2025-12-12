/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ✅ Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // ✅ Placeholder (temporal)
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com', // MercadoLibre
      },
      {
        protocol: 'https',
        hostname: '**.mlstatic.com', // MercadoLibre
      },
    ],
  },
};

module.exports = nextConfig;