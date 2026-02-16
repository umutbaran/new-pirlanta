import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';

const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal('')).transform(val => val || ''),
  phoneNumber: z.string().optional().transform(val => val || ''),
  address: z.string().optional().transform(val => val || ''),
  currency: z.string(),
  goldPriceMargin: z.number().min(0)
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
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
    const validation = settingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz ayar verisi', details: validation.error.format() }, { status: 400 });
    }

    await saveSettings(validation.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 });
  }
}
