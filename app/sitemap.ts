// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newpirlanta.com";

function toISODate(d: unknown): Date {
  // next metadata route Date bekler; db string gelebilir
  const date = d ? new Date(d as any) : new Date();
  return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar (değişim sıklığına göre ayarladım)
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/subelerimiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Koleksiyonlar genelde daha sık güncellenir
    { url: `${siteUrl}/koleksiyon/pirlanta`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/altin-22`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/altin-14`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/sarrafiye`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Ürünler (DB hata verirse sitemap gene çalışsın)
  let products: any[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    // slug varsa SEO için daha iyi: /urun/slug
    const slugOrId = product?.slug ?? product?.id;

    return {
      url: `${siteUrl}/urun/${slugOrId}`,
      lastModified: toISODate(product?.updatedAt ?? product?.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...productRoutes];
}
