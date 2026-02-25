import { NextResponse } from 'next/server';
import { getUiConfig, saveUiConfig } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';

// Alt şemalar
const heroSlideSchema = z.object({
  id: z.string(),
  image: z.string(),
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonLink: z.string(),
});

const mosaicItemSchema = z.object({
  image: z.string(),
  title: z.string(),
  subtitle: z.string(),
  link: z.string(),
  buttonText: z.string(),
});

const infoCardSchema = z.object({
  image: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  link: z.string(),
});

const storeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  badge: z.string(),
  address: z.string(),
  phone: z.string(),
  image: z.string().optional(),
});

const footerLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

// Ana Şema
const uiConfigSchema = z.object({
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
}).passthrough();

export async function GET() {
  const config = await getUiConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  // 1. Yetki Kontrolü
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Veri Doğrulama
    const validation = uiConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz konfigürasyon verisi', details: validation.error.format() }, { status: 400 });
    }

    await saveUiConfig(validation.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 });
  }
}
