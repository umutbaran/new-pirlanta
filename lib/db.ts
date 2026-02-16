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
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error('Database error [getProducts]:', err);
    return [];
  }
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
  const fallbackSettings = {
    siteTitle: "New Pırlanta",
    contactEmail: "info@newpirlanta.com",
    phoneNumber: "905555555555",
    address: "",
    currency: "TRY",
    goldPriceMargin: 0.05
  };

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
export async function getCategories(): Promise<any[]> {
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
  try {
    const data = await prisma.uiConfig.findFirst({ where: { id: 1 } });
    return (data?.config as any) || {};
  } catch (err) {
    console.error('Database error [getUiConfig]:', err);
    return {};
  }
}

export async function saveUiConfig(u: any) {
  return prisma.uiConfig.upsert({
    where: { id: 1 },
    update: { config: u },
    create: { id: 1, config: u }
  });
}

// --- Bulletin ---
export async function getBulletins(): Promise<BulletinItem[]> {
  try {
    const config = await getUiConfig();
    return (config.bulletins as BulletinItem[]) || [];
  } catch (err) {
    console.error('Database error [getBulletins]:', err);
    return [];
  }
}

export async function saveBulletins(b: BulletinItem[]) {
  const config = await getUiConfig();
  return saveUiConfig({ ...config, bulletins: b });
}
