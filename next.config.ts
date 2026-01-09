import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dominios permitidos para imagens externas com otimizacoes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
      },
    ],
    // Formatos modernos para melhor compressao
    formats: ['image/avif', 'image/webp'],
    // Cache de 30 dias para imagens otimizadas
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Tamanhos de dispositivo para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  async headers() {
    return [
      {
        source: "/((?!admin).*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com",
              "media-src 'self' https://videos.pexels.com https://res.cloudinary.com",
              "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
              "frame-src https://www.youtube.com https://player.vimeo.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
