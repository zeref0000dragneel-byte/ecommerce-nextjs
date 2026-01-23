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
        hostname: '**.mlstatic.com', // MercadoLibre (wildcard)
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ✅ Unsplash (NUEVO)
      },
    ],
  },
};

module.exports = nextConfig;