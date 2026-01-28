import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';

const BASE_URL = 'https://newpirlanta.com'; // Burası canlıya geçince güncellenecek

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  // Statik Sayfalar
  const routes = [
    '',
    '/iletisim',
    '/subelerimiz',
    '/koleksiyon/pirlanta',
    '/koleksiyon/altin-22',
    '/koleksiyon/altin-14',
    '/koleksiyon/sarrafiye',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dinamik Ürün Sayfaları
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/urun/${product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...productRoutes];
}
