import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { parseSafeNumber } from './utils';
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
  address: string;
  currency: string;
  goldPriceMargin: number;
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
  phoneNumber: "905522806513",
  address: "Tatvan, Bitlis",
  currency: "TRY",
  goldPriceMargin: 0.05
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) return FALLBACK_SETTINGS;
    return {
      siteTitle: settings.siteTitle,
      contactEmail: settings.contactEmail || FALLBACK_SETTINGS.contactEmail,
      phoneNumber: settings.phoneNumber || FALLBACK_SETTINGS.phoneNumber,
      address: settings.address || FALLBACK_SETTINGS.address,
      currency: settings.currency,
      goldPriceMargin: settings.goldPriceMargin
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
    description: "Kapalıçarşı'nın kalbinden, en özel anlarınıza eşlik edecek eşsiz tasarımlar. Güven, kalite ve zarafetin adresi.",
    copyrightText: "Tüm hakları saklıdır.",
    socialMedia: { instagram: "", facebook: "", twitter: "" },
    corporateLinks: [],
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

export async function saveCategories(categories: CategoryData[]) {
  return prisma.$transaction(
    categories.map(cat => prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: cat.subCategories as Prisma.InputJsonValue
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: cat.subCategories as Prisma.InputJsonValue
      }
    }))
  );
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
  return prisma.product.delete({ where: { id } });
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
