import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Admin ve API'yi botlardan gizle
    },
    sitemap: 'https://newpirlanta.com/sitemap.xml', // Canlıya geçince burası güncellenecek
  };
}
