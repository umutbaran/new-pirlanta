import prisma from './prisma';
import { Product as ProductType } from '@/data/products';

// Re-export interfaces for consistent usage
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

export interface BulletinItem {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  importance: 1 | 2 | 3;
  impact: 'up' | 'down' | 'neutral';
  description?: string;
}

// Reuse interfaces from your existing types
export type { HeroSlide, MosaicItem, InfoCard, StoreItem, FooterLink, UiConfig } from './db_interfaces';

// --- Products ---
export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addProduct(p: any) {
  return prisma.product.create({
    data: {
      sku: p.sku,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      isNew: p.isNew || false,
      description: p.description,
      images: p.images || [],
      details: p.details || {}
    }
  });
}

export async function updateProduct(id: string, p: any) {
  return prisma.product.update({
    where: { id },
    data: {
      sku: p.sku,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      isNew: p.isNew || false,
      description: p.description,
      images: p.images || [],
      details: p.details || {}
    }
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  return true;
}

// --- Settings ---
export async function getSettings(): Promise<SiteSettings> {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    return {
      siteTitle: "New Pırlanta",
      contactEmail: "info@newpirlanta.com",
      phoneNumber: "905555555555",
      address: "",
      currency: "TRY",
      goldPriceMargin: 0.05
    };
  }
  return {
    siteTitle: settings.siteTitle,
    contactEmail: settings.contactEmail || "",
    phoneNumber: settings.phoneNumber || "",
    address: settings.address || "",
    currency: settings.currency,
    goldPriceMargin: settings.goldPriceMargin
  };
}

export async function saveSettings(s: SiteSettings) {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: s,
    create: { ...s, id: 1 }
  });
}

// --- Categories ---
export async function getCategories() {
  return prisma.category.findMany();
}

export async function saveCategories(categories: CategoryData[]) {
  // Basitlik için mevcutları silip yenileri ekleyebiliriz veya teker teker upsert yapabiliriz
  // Şimdilik toplu kayıt için işlem (transaction) kullanalım
  return prisma.$transaction(
    categories.map(cat => prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: cat.subCategories as any
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: cat.subCategories as any
      }
    }))
  );
}

// --- UI Config ---
export async function getUiConfig() {
  const data = await prisma.uiConfig.findFirst({ where: { id: 1 } });
  return (data?.config as any) || {};
}

export async function saveUiConfig(u: any) {
  return prisma.uiConfig.upsert({
    where: { id: 1 },
    update: { config: u },
    create: { id: 1, config: u }
  });
}

// --- Bulletin ---
// Bülten modelini schema'ya eklememiştik, onu da JSON config içinde tutalım şimdilik
export async function getBulletins() {
  const config = await getUiConfig();
  return config.bulletins || [];
}

export async function saveBulletins(b: any[]) {
  const config = await getUiConfig();
  return saveUiConfig({ ...config, bulletins: b });
}
