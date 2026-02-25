import { Prisma } from '@prisma/client';
import prisma from './prisma';

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

// Reuse interfaces from your existing types
import type { HeroSlide, MosaicItem, InfoCard, StoreItem, FooterLink, UiConfig, BulletinItem } from './db_interfaces';
export type { HeroSlide, MosaicItem, InfoCard, StoreItem, FooterLink, UiConfig, BulletinItem };

import { Product } from '@/data/products';

// --- Products ---
export async function getProducts(limit?: number): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set, returning empty products array.');
    return [];
  }
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {})
    });
    return products as unknown as Product[];
  } catch (err) {
    console.error('Database error [getProducts]:', err);
    return [];
  }
}

export async function addProduct(p: Record<string, unknown>) {
  return prisma.product.create({
    data: {
      sku: p.sku as string | null,
      name: p.name as string,
      category: p.category as string,
      subCategory: p.subCategory as string | null,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      isNew: (p.isNew as boolean) || false,
      description: p.description as string | null,
      images: (p.images as string[]) || [],
      details: (p.details as Prisma.InputJsonValue) || {}
    }
  });
}

export async function updateProduct(id: string, p: Record<string, unknown>) {
  return prisma.product.update({
    where: { id },
    data: {
      sku: p.sku as string | null,
      name: p.name as string,
      category: p.category as string,
      subCategory: p.subCategory as string | null,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      isNew: (p.isNew as boolean) || false,
      description: p.description as string | null,
      images: (p.images as string[]) || [],
      details: (p.details as Prisma.InputJsonValue) || {}
    }
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  return true;
}

// --- Settings ---
export async function getSettings(): Promise<SiteSettings> {
  const fallbackSettings = {
    siteTitle: "New Pırlanta",
    contactEmail: "info@newpirlanta.com",
    phoneNumber: "905555555555",
    address: "",
    currency: "TRY",
    goldPriceMargin: 0.05
  };

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set, using fallback settings.');
    return fallbackSettings;
  }

  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) return fallbackSettings;
    
    return {
      siteTitle: settings.siteTitle,
      contactEmail: settings.contactEmail || "",
      phoneNumber: settings.phoneNumber || "",
      address: settings.address || "",
      currency: settings.currency,
      goldPriceMargin: settings.goldPriceMargin
    };
  } catch (err) {
    console.error('Database error [getSettings]:', err);
    return fallbackSettings;
  }
}

export async function saveSettings(s: SiteSettings) {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: s,
    create: { ...s, id: 1 }
  });
}

// --- Categories ---
export async function getCategories(): Promise<Record<string, unknown>[]> {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set, returning empty categories array.');
    return [];
  }
  try {
    return await prisma.category.findMany();
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
        subCategories: JSON.parse(JSON.stringify(cat.subCategories))
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
        isSpecial: cat.isSpecial || false,
        subCategories: JSON.parse(JSON.stringify(cat.subCategories))
      }
    }))
  );
}

// --- UI Config ---
export async function getUiConfig(): Promise<UiConfig> {
  const fallbackConfig: UiConfig = {
    heroSlides: [],
    collectionMosaic: { mainTitle: "Koleksiyonlarımız", description: "", items: [] },
    infoCenter: { title: "Mücevher Dünyası", subtitle: "Rehberler", cards: [] },
    showcase: { title: "Özel Vitrin", description: "", productIds: [] },
    storeSection: { title: "Şubelerimiz", subtitle: "Bize Ulaşın", stores: [] },
    footer: {
      description: "",
      copyrightText: " 2026 New Pırlanta. Tüm Hakları Saklıdır.",
      socialMedia: { instagram: "", facebook: "", twitter: "" },
      corporateLinks: [],
      customerServiceLinks: []
    }
  };

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set, returning fallback uiConfig.');
    return fallbackConfig;
  }
  try {
    const data = await prisma.uiConfig.findFirst({ where: { id: 1 } });
    return (data?.config as unknown as UiConfig) || fallbackConfig;
  } catch (err) {
    console.error('Database error [getUiConfig]:', err);
    return fallbackConfig;
  }
}

export async function saveUiConfig(u: UiConfig) {
  return prisma.uiConfig.upsert({
    where: { id: 1 },
    update: { config: u as unknown as Prisma.InputJsonValue },
    create: { id: 1, config: u as unknown as Prisma.InputJsonValue }
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
