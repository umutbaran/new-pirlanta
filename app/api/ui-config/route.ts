import { NextResponse } from 'next/server';
import { getUiConfig, saveUiConfig } from '@/lib/db';
import { UiConfig } from '@/lib/db_interfaces';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uiConfigSchema } from '@/lib/schemas';

export async function GET() {
  const config = await getUiConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  // 1. Yetki Kontrolü (Role-based)
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim - Sadece adminler bu işlemi yapabilir' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Merkezi Şema ile Doğrulama
    const validation = uiConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Geçersiz konfigürasyon verisi', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    await saveUiConfig(validation.data as unknown as UiConfig);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('UI Config Update Error:', err);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 });
  }
}
