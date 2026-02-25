// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/db";

import { Product } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newpirlanta.com";

function toISODate(d: unknown): Date {
  if (!d) return new Date();
  const date = new Date(d as string);
  return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // ... (staticRoutes aynı kalıyor)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/subelerimiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/koleksiyon/pirlanta`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/altin-22`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/altin-14`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/koleksiyon/sarrafiye`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  let products: Product[] = [];
  try {
    products = await getProducts() as Product[];
  } catch {
    products = [];
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    const slugOrId = product?.id; // ID bazlı yönlendirme

    return {
      url: `${siteUrl}/urun/${slugOrId}`,
      lastModified: toISODate(product?.updatedAt ?? product?.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...productRoutes];
}
