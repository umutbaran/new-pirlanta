import { z } from 'zod';

// --- Ürün Şemaları ---
export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  category: z.string(),
  subCategory: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable().default(0),
  oldPrice: z.number().optional().nullable(),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  images: z.array(z.string().url("Geçerli bir resim URL'si giriniz")).optional().default([]),
  isNew: z.boolean().optional().default(false),
  details: z.record(z.string(), z.any()).optional().default({}),
}).passthrough();

// --- UI Konfigürasyon Şemaları ---
export const heroSlideSchema = z.object({
  id: z.string(),
  image: z.string().url(),
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonLink: z.string(),
});

export const mosaicItemSchema = z.object({
  image: z.string().url(),
  title: z.string(),
  subtitle: z.string(),
  link: z.string(),
  buttonText: z.string(),
});

export const infoCardSchema = z.object({
  image: z.string().url(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  link: z.string(),
});

export const storeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  badge: z.string(),
  address: z.string(),
  phone: z.string(),
  image: z.string().url().optional().nullable(),
});

export const footerLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const uiConfigSchema = z.object({
  heroSlides: z.array(heroSlideSchema),
  collectionMosaic: z.object({
    mainTitle: z.string(),
    description: z.string(),
    items: z.array(mosaicItemSchema),
  }),
  infoCenter: z.object({
    title: z.string(),
    subtitle: z.string(),
    cards: z.array(infoCardSchema),
  }),
  showcase: z.object({
    title: z.string(),
    description: z.string(),
    productIds: z.array(z.string()),
  }),
  storeSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    stores: z.array(storeItemSchema),
  }),
  footer: z.object({
    description: z.string(),
    copyrightText: z.string(),
    socialMedia: z.object({
      instagram: z.string(),
      facebook: z.string(),
      twitter: z.string(),
    }),
    corporateLinks: z.array(footerLinkSchema),
    customerServiceLinks: z.array(footerLinkSchema),
  }),
  bulletins: z.array(z.any()).optional().default([]),
}).passthrough();

// --- Ayarlar Şeması ---
export const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  contactEmail: z.string().email().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  currency: z.string().default("TRY"),
  goldPriceMargin: z.number().min(0).max(1).default(0.05),
});
