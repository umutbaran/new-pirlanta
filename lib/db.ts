import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { parseSafeNumber } from './utils';
import { deleteStorageFiles } from './supabase';
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
export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {})
    });
    return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
  } catch (err) {
    console.error('Database error [getProducts]:', err);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    return product ? mapPrismaToProduct(product as Record<string, unknown>) : null;
  } catch (err) {
    console.error('Database error [getProductById]:', err);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } }
    });
    return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
  } catch (err) {
    console.error('Database error [getProductsByIds]:', err);
    return [];
  }
}

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
  address: "Tatvan, Bitlis",
  currency: "TRY"
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) return FALLBACK_SETTINGS;
    return {
      siteTitle: settings.siteTitle,
      contactEmail: settings.contactEmail || FALLBACK_SETTINGS.contactEmail,
      phoneNumber: settings.phoneNumber || FALLBACK_SETTINGS.phoneNumber,
      whatsappNumber: settings.whatsappNumber || FALLBACK_SETTINGS.whatsappNumber,
      address: settings.address || FALLBACK_SETTINGS.address,
      currency: settings.currency
    };
  } catch (err) {
    console.error('Database error [getSettings]:', err);
    return FALLBACK_SETTINGS;
  }
}

// --- UI Config ---
const FALLBACK_UI_CONFIG: UiConfig = {
  heroSlides: [
    {
      id: "slide_1",
      image: "https://images.unsplash.com/photo-1599643478514-4a4e98f6d654?q=80&w=2000&auto=format&fit=crop",
      title: "Eşsiz Pırlanta Koleksiyonu",
      subtitle: "Işıltınızı yansıtacak en özel parçalar",
      buttonText: "Koleksiyonu Keşfet",
      buttonLink: "/koleksiyon/pirlanta"
    },
    {
      id: "slide_2",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1573408301145-b98c414a0d92?q=80&w=1000&auto=format&fit=crop",
        title: "Pırlanta Tasarımlar",
        subtitle: "PREMIUM SELECT",
        link: "/koleksiyon/pirlanta",
        buttonText: "Koleksiyonu Keşfet"
      },
      {
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=800&auto=format&fit=crop",
        title: "Pırlanta Rehberi",
        description: "4C kuralı (Kesim, Karat, Renk, Berraklık) hakkında bilmeniz gereken her şey.",
        buttonText: "İncele",
        link: "#"
      },
      {
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
        title: "Yüzük Ölçüsü",
        description: "Evde kolayca yüzük ölçünüzü nasıl alabileceğinizi öğrenin.",
        buttonText: "Hesapla",
        link: "#"
      },
      {
        image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop",
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
      { label: "Piyasa Analiz", url: "/bulten" }
    ],
    customerServiceLinks: []
  }
};

export async function getUiConfig(): Promise<UiConfig> {
  try {
    const data = await prisma.uiConfig.findFirst({ where: { id: 1 } });
    if (!data) return FALLBACK_UI_CONFIG;
    return data.config as unknown as UiConfig;
  } catch (err) {
    console.error('Database error [getUiConfig]:', err);
    return FALLBACK_UI_CONFIG;
  }
}

export async function saveUiConfig(u: UiConfig) {
  return prisma.uiConfig.upsert({
    where: { id: 1 },
    update: { config: u as unknown as Prisma.InputJsonValue },
    create: { id: 1, config: u as unknown as Prisma.InputJsonValue }
  });
}

// --- Categories ---
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return cats.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
      isSpecial: c.isSpecial,
      subCategories: (c.subCategories as {name: string, slug: string}[]) || []
    }));
  } catch (err) {
    console.error('Database error [getCategories]:', err);
    return [];
  }
}

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

export async function getCatalogProducts(filters: CatalogFilters): Promise<Product[]> {
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

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {})
    });
    return products.map((p) => mapPrismaToProduct(p as Record<string, unknown>));
  } catch (err) {
    console.error('Database error [getCatalogProducts]:', err);
    return [];
  }
}

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
