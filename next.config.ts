import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS } from "./lib/images";

const nextConfig: NextConfig = {
  // Yerel testlerde çalışan "npm run dev" ile çakışmamak için ayrı derleme klasörü seçilebilir (varsayılan .next)
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map(hostname => ({ protocol: 'https' as const, hostname })),
  },
  serverExternalPackages: ['@prisma/client'],
  // Eski "Piyasa Analiz" adresi yeni piyasa sayfasına kalıcı olarak yönlenir
  async redirects() {
    return [{ source: '/bulten', destination: '/piyasa', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
