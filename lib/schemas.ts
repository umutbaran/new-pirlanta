import { z } from 'zod';
import { isAllowedImageUrl, IMAGE_HOST_ERROR } from './images';

const imageUrl = z.string().refine(isAllowedImageUrl, IMAGE_HOST_ERROR);

// --- Ürün Şemaları ---
export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  category: z.string(),
  subCategory: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable().default(0),
  oldPrice: z.number().optional().nullable(),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  images: z.array(imageUrl).optional().default([]),
  isNew: z.boolean().optional().default(false),
  details: z.record(z.string(), z.any()).optional().default({}),
}).passthrough();

// --- UI Konfigürasyon Şemaları ---
export const heroSlideSchema = z.object({
  id: z.string(),
  image: imageUrl,
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonLink: z.string(),
});

export const mosaicItemSchema = z.object({
  image: imageUrl,
  title: z.string(),
  subtitle: z.string(),
  link: z.string(),
  buttonText: z.string(),
});

export const infoCardSchema = z.object({
  image: imageUrl,
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
  hours: z.string().optional(),
  image: imageUrl.optional().nullable(),
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
      tiktok: z.string().optional(),
    }),
    corporateLinks: z.array(footerLinkSchema),
    customerServiceLinks: z.array(footerLinkSchema),
  }),
  bulletins: z.array(z.any()).optional().default([]),
}).passthrough();
