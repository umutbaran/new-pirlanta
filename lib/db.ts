import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { parseSafeNumber } from './utils';
import { deleteStorageFiles } from './supabase';
import { unstable_cache } from 'next/cache';

/** Tüm site verisi bu etiketle önbelleklenir; admin kayıtlarında revalidateTag ile temizlenir */
export const SITE_CACHE_TAG = 'site';

/**
 * Okuma sorgularını sunucu tarafında önbellekler (veritabanı gecikmesi ~400ms olduğu için).
 * Sorgu hata verirse yedek değer döner ama önbelleğe yazılmaz; bir sonraki istekte tekrar denenir.
 */
function cachedQuery<A extends unknown[], R>(name: string, query: (...args: A) => Promise<R>, fallback: R) {
  const cached = unstable_cache(query, ['db', name], { tags: [SITE_CACHE_TAG], revalidate: 3600 });
  return async (...args: A): Promise<R> => {
    try {
      return await cached(...args);
    } catch (err) {
      console.error(`Database error [${name}]:`, err);
      return fallback;
    }
  };
}
import type { 
  HeroSlide, MosaicItem, InfoCard, StoreItem, 
  FooterLink, UiConfig, BulletinItem 
} from './db_interfaces';

// --- Re-exports ---
export type { 
  HeroSlide, MosaicItem, InfoCard, StoreItem, 
  FooterLink, UiConfig, BulletinItem 
};

// --- Interfaces ---
export interface SiteSettings {
  siteTitle: string;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  showPrices: boolean; // false ise ürün fiyatları sitede gösterilmez
  address: string;
  currency: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isSpecial?: boolean;
  subCategories: { name: string; slug: string }[];
}

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  category: string;
  subCategory: string | null;
  price: number;
  oldPrice?: number | null;
  isNew?: boolean;
  description: string | null;
  images: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  details: Record<string, unknown> | null;
}

// --- Mapper ---
function mapPrismaToProduct(p: Record<string, unknown>): Product {
  return {
    ...p,
    price: parseSafeNumber(p.price),
    oldPrice: p.oldPrice ? parseSafeNumber(p.oldPrice) : null,
    details: p.details || {}
  } as Product;
}

// --- Products ---
export const getProducts = cachedQuery('getProducts', async (limit?: number): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {})
  });
  return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
}, []);

export const getProductById = cachedQuery('getProductById', async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? mapPrismaToProduct(product as Record<string, unknown>) : null;
}, null);

export const getProductsByIds = cachedQuery('getProductsByIds', async (ids: string[]): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    where: { id: { in: ids } }
  });
  return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
}, []);

export async function addProduct(p: Record<string, unknown>) {
  return prisma.product.create({
    data: {
      sku: (p.sku as string) || null,
      name: p.name as string,
      category: p.category as string,
      subCategory: (p.subCategory as string) || null,
      price: parseSafeNumber(p.price),
      oldPrice: p.oldPrice ? parseSafeNumber(p.oldPrice) : null,
      isNew: !!p.isNew,
      description: (p.description as string) || null,
      images: (p.images as string[]) || [],
      details: (p.details as Prisma.InputJsonValue) || {}
    }
  });
}

// --- Settings ---
const FALLBACK_SETTINGS: SiteSettings = {
  siteTitle: "New Pırlanta",
  contactEmail: "info@newpirlanta.com",
  phoneNumber: "+90 552 280 6513",
  whatsappNumber: "905527873513",
  showPrices: false,
  address: "Tatvan, Bitlis",
  currency: "TRY"
};

export const getSettings = cachedQuery('getSettings', async (): Promise<SiteSettings> => {
  const settings = await prisma.settings.findFirst();
  if (!settings) return FALLBACK_SETTINGS;
  return {
    siteTitle: settings.siteTitle,
    contactEmail: settings.contactEmail || FALLBACK_SETTINGS.contactEmail,
    phoneNumber: settings.phoneNumber || FALLBACK_SETTINGS.phoneNumber,
    whatsappNumber: settings.whatsappNumber || FALLBACK_SETTINGS.whatsappNumber,
    showPrices: settings.showPrices,
    address: settings.address || FALLBACK_SETTINGS.address,
    currency: settings.currency
  };
}, FALLBACK_SETTINGS);

// --- UI Config ---
const FALLBACK_UI_CONFIG: UiConfig = {
  heroSlides: [
    {
      id: "slide_1",
      image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/hero-pirlanta.webp",
      title: "Eşsiz Pırlanta Koleksiyonu",
      subtitle: "Işıltınızı yansıtacak en özel parçalar",
      buttonText: "Koleksiyonu Keşfet",
      buttonLink: "/koleksiyon/pirlanta"
    },
    {
      id: "slide_2",
      image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/hero-altin.webp",
      title: "Yeni Sezon Altınlar",
      subtitle: "Modern tasarımlarla geleneği keşfedin",
      buttonText: "Alışverişe Başla",
      buttonLink: "/koleksiyon/altin-14"
    }
  ],
  collectionMosaic: {
    mainTitle: "Mücevher Sanatı",
    description: "Her parçasında ayrı bir hikaye barındıran eşsiz tasarımlar.",
    items: [
      {
        image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/koleksiyon-pirlanta.webp",
        title: "Pırlanta Tasarımlar",
        subtitle: "PREMIUM SELECT",
        link: "/koleksiyon/pirlanta",
        buttonText: "Koleksiyonu Keşfet"
      },
      {
        image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/koleksiyon-altin.webp",
        title: "Altın Koleksiyonu",
        subtitle: "14 ve 22 Ayar Modeller",
        link: "/koleksiyon/altin-14",
        buttonText: "İncele"
      }
    ]
  },
  infoCenter: {
    title: "Mücevher Dünyası",
    subtitle: "BİLGİ MERKEZİ",
    cards: [
      {
        image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/rehber-pirlanta.webp",
        title: "Pırlanta Rehberi",
        description: "4C kuralı (Kesim, Karat, Renk, Berraklık) hakkında bilmeniz gereken her şey.",
        buttonText: "İncele",
        link: "#"
      },
      {
        image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/rehber-yuzuk.webp",
        title: "Yüzük Ölçüsü",
        description: "Evde kolayca yüzük ölçünüzü nasıl alabileceğinizi öğrenin.",
        buttonText: "Hesapla",
        link: "#"
      },
      {
        image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/rehber-hediye.webp",
        title: "Hediye Rehberi",
        description: "Sevdikleriniz için en anlamlı ve unutulmaz hediyeyi seçmenize yardımcı olalım.",
        buttonText: "Keşfet",
        link: "#"
      }
    ]
  },
  showcase: { title: "Sezonun En Gözde Parçaları", description: "Sizin için seçtiklerimiz", productIds: [] },
  storeSection: { title: "Size En Yakın Mağazamız", subtitle: "Baran Kuyumculuk İştirakleri", stores: [] },
  footer: {
    description: "Baran Kuyumculuk'un pırlanta ve altın mücevher koleksiyonları. Ürünlerimizi mağazalarımızda yakından inceleyebilirsiniz.",
    copyrightText: "Tüm hakları saklıdır.",
    socialMedia: { instagram: "", facebook: "", twitter: "" },
    corporateLinks: [
      { label: "Hakkımızda", url: "/hakkimizda" },
      { label: "Mağazalarımız", url: "/subelerimiz" },
      { label: "İletişim", url: "/iletisim" },
      { label: "Piyasa Analiz", url: "/piyasa" }
    ],
    customerServiceLinks: []
  }
};

export const getUiConfig = cachedQuery('getUiConfig', async (): Promise<UiConfig> => {
  const data = await prisma.uiConfig.findFirst({ where: { id: 1 } });
  if (!data) return FALLBACK_UI_CONFIG;
  return data.config as unknown as UiConfig;
}, FALLBACK_UI_CONFIG);

export async function saveUiConfig(u: UiConfig) {
  return prisma.uiConfig.upsert({
    where: { id: 1 },
    update: { config: u as unknown as Prisma.InputJsonValue },
    create: { id: 1, config: u as unknown as Prisma.InputJsonValue }
  });
}

// --- Categories ---
export const getCategories = cachedQuery('getCategories', async (): Promise<CategoryData[]> => {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return cats.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    isActive: c.isActive,
    isSpecial: c.isSpecial,
    subCategories: (c.subCategories as {name: string, slug: string}[]) || []
  }));
}, []);

/** Kullanıcıya gösterilebilecek (iş kuralı kaynaklı) kategori hatası */
export class CategoryRuleError extends Error {}

/**
 * Kategori listesinin tamamını kaydeder (id bazlı eşleştirme):
 * - Veritabanında olan id'ler güncellenir; slug değişirse o kategorideki ürünler de yeni slug'a taşınır.
 * - Veritabanında olmayan id'ler yeni kategori olarak eklenir.
 * - Listede olmayan kategoriler silinir; ancak içinde ürün varsa silme engellenir.
 */
export async function saveCategories(categories: CategoryData[]) {
  const slugs = categories.map(c => c.slug);
  const duplicate = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (duplicate) {
    throw new CategoryRuleError(`"${duplicate}" adresine sahip birden fazla kategori var. Kategori isimleri benzersiz olmalı.`);
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.category.findMany();
    const existingById = new Map(existing.map(c => [c.id, c]));
    const incomingIds = new Set(categories.map(c => c.id));

    // 1. Silinecek kategoriler: içinde ürün varsa engelle
    const toDelete = existing.filter(c => !incomingIds.has(c.id));
    for (const cat of toDelete) {
      const productCount = await tx.product.count({ where: { category: cat.slug } });
      if (productCount > 0) {
        throw new CategoryRuleError(`"${cat.name}" kategorisinde ${productCount} ürün var. Silmeden önce ürünleri başka bir kategoriye taşıyın.`);
      }
    }
    if (toDelete.length > 0) {
      await tx.category.deleteMany({ where: { id: { in: toDelete.map(c => c.id) } } });
    }

    // 2. Güncelle veya ekle
    for (const cat of categories) {
      const data = {
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: cat.subCategories as Prisma.InputJsonValue
      };
      const current = existingById.get(cat.id);

      if (current) {
        await tx.category.update({ where: { id: cat.id }, data });
        // Kategori adı (slug) değiştiyse ürünleri yeni slug'a taşı
        if (current.slug !== cat.slug) {
          await tx.product.updateMany({ where: { category: current.slug }, data: { category: cat.slug } });
        }
      } else {
        await tx.category.create({ data });
      }
    }
  });
}

// --- Updates & Deletes (Products) ---
export async function updateProduct(id: string, p: Record<string, unknown>) {
  return prisma.product.update({
    where: { id },
    data: {
      sku: (p.sku as string) || null,
      name: p.name as string,
      category: p.category as string,
      subCategory: (p.subCategory as string) || null,
      price: parseSafeNumber(p.price),
      oldPrice: p.oldPrice ? parseSafeNumber(p.oldPrice) : null,
      isNew: !!p.isNew,
      description: (p.description as string) || null,
      images: (p.images as string[]) || [],
      details: (p.details as Prisma.InputJsonValue) || {}
    }
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } });
  // Ürüne ait görselleri Supabase Storage'dan da temizle
  await deleteStorageFiles(product.images);
  return product;
}

export interface CatalogFilters {
  category?: string;   // Kategori slug'ı; verilmezse tüm kategoriler
  search?: string;     // Ürün adı, stok kodu veya açıklamada aranır
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export const getCatalogProducts = cachedQuery('getCatalogProducts', async (filters: CatalogFilters): Promise<Product[]> => {
  const { category, search, minPrice, maxPrice, limit } = filters;
  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Fiyat filtresi varsa "Fiyat Alın" (0 TL) ürünleri hariç tut
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      gt: 0,
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {})
  });
  return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
}, []);

// --- Save Settings ---
export async function saveSettings(s: SiteSettings) {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: s,
    create: { ...s, id: 1 }
  });
}

// --- Bulletin ---
export async function getBulletins(): Promise<BulletinItem[]> {
  try {
    const config = await getUiConfig();
    return config.bulletins || [];
  } catch (err) {
    console.error('Database error [getBulletins]:', err);
    return [];
  }
}

export async function saveBulletins(b: BulletinItem[]) {
  const config = await getUiConfig();
  return saveUiConfig({ ...config, bulletins: b });
}

// --- Analytics (anonim istatistik) ---
export const ANALYTICS_EVENT_TYPES = ['product_view', 'whatsapp_click', 'phone_click', 'search'] as const;
export type AnalyticsEventType = typeof ANALYTICS_EVENT_TYPES[number];

export async function recordEvent(type: AnalyticsEventType, productId?: string | null, value?: string | null) {
  try {
    await prisma.analyticsEvent.create({ data: { type, productId: productId || null, value: value || null } });
  } catch (err) {
    // İstatistik kaydı başarısız olsa bile ziyaretçi deneyimi etkilenmemeli
    console.error('Database error [recordEvent]:', err);
  }
}

export interface ProductStat {
  product: Pick<Product, 'id' | 'name' | 'images' | 'category'>;
  views: number;
  whatsappClicks: number;
}

export interface AnalyticsSummary {
  days: number;
  totals: Record<AnalyticsEventType, number>;
  daily: { date: string; views: number; whatsappClicks: number }[];
  topProducts: ProductStat[];
  topSearches: { query: string; count: number }[];
  whatsappSources: { page: string; count: number }[];
}

export async function getAnalyticsSummary(days: number): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const inRange = { createdAt: { gte: since } };

  const [totalsRaw, viewsByProduct, clicksByProduct, searches, sources, dailyRaw] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ['type'], where: inRange, _count: { _all: true } }),
    prisma.analyticsEvent.groupBy({
      by: ['productId'], where: { ...inRange, type: 'product_view', productId: { not: null } },
      _count: { _all: true }, orderBy: { _count: { productId: 'desc' } }, take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['productId'], where: { ...inRange, type: 'whatsapp_click', productId: { not: null } },
      _count: { _all: true }, orderBy: { _count: { productId: 'desc' } }, take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['value'], where: { ...inRange, type: 'search', value: { not: null } },
      _count: { _all: true }, orderBy: { _count: { value: 'desc' } }, take: 15,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['value'], where: { ...inRange, type: 'whatsapp_click' },
      _count: { _all: true }, orderBy: { _count: { value: 'desc' } }, take: 10,
    }),
    // Günlük seri Türkiye saatine göre gruplanır (createdAt UTC tutulur)
    prisma.$queryRaw<{ day: Date; type: string; count: bigint }[]>`
      SELECT date_trunc('day', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul') AS day, "type", COUNT(*) AS count
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since} AND "type" IN ('product_view', 'whatsapp_click')
      GROUP BY 1, 2 ORDER BY 1`,
  ]);

  const totals = Object.fromEntries(ANALYTICS_EVENT_TYPES.map(t => [t, 0])) as Record<AnalyticsEventType, number>;
  for (const row of totalsRaw) {
    if ((ANALYTICS_EVENT_TYPES as readonly string[]).includes(row.type)) totals[row.type as AnalyticsEventType] = row._count._all;
  }

  // Görüntülenme ve WhatsApp tıklamalarını ürün bazında birleştir (silinmiş ürünler atlanır)
  const views = new Map(viewsByProduct.map(r => [r.productId!, r._count._all]));
  const clicks = new Map(clicksByProduct.map(r => [r.productId!, r._count._all]));
  const productIds = [...new Set([...views.keys(), ...clicks.keys()])];
  const products = productIds.length ? await getProductsByIds(productIds) : [];
  const topProducts = products
    .map(p => ({
      product: { id: p.id, name: p.name, images: p.images, category: p.category },
      views: views.get(p.id) || 0,
      whatsappClicks: clicks.get(p.id) || 0,
    }))
    .sort((a, b) => b.whatsappClicks - a.whatsappClicks || b.views - a.views)
    .slice(0, 15);

  // Boş günler de grafikte görünsün diye tüm günleri doldur
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const dailyMap = new Map<string, { views: number; whatsappClicks: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(d); // YYYY-MM-DD
    dailyMap.set(key, { views: 0, whatsappClicks: 0 });
  }
  for (const row of dailyRaw) {
    const entry = dailyMap.get(dayKey(row.day));
    if (!entry) continue;
    if (row.type === 'product_view') entry.views = Number(row.count);
    else entry.whatsappClicks = Number(row.count);
  }

  return {
    days,
    totals,
    daily: [...dailyMap.entries()].map(([date, v]) => ({ date, ...v })),
    topProducts,
    topSearches: searches.map(s => ({ query: s.value!, count: s._count._all })),
    whatsappSources: sources.map(s => ({ page: s.value || 'Bilinmiyor', count: s._count._all })),
  };
}
