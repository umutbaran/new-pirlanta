import { NextResponse } from 'next/server';
import { getBulletins, saveBulletins, BulletinItem } from '@/lib/db';
import { fetchEconomicCalendar } from '@/lib/investing';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  // 1. Yetki Kontrolü
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    // 2. Dışarıdan Veriyi Çek
    const newItems = await fetchEconomicCalendar();
    
    // 3. Mevcut Verilerle Birleştir (Çakışmaları önleyerek)
    const currentBulletins = await getBulletins();
    const existingIds = new Set(currentBulletins.map((b: BulletinItem) => b.id));
    
    const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
    
    if (uniqueNewItems.length === 0) {
      return NextResponse.json({ success: true, message: 'Yeni veri bulunamadı.', count: 0 });
    }

    const updatedBulletins = [...uniqueNewItems, ...currentBulletins]
      // Tarihe göre yeniden sırala (Yeniler üstte)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // Son 50 veriyi tut (Dosya şişmesin)
      .slice(0, 50);

    await saveBulletins(updatedBulletins);

    return NextResponse.json({ success: true, message: `${uniqueNewItems.length} yeni olay eklendi.`, count: uniqueNewItems.length });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Senkronizasyon hatası' }, { status: 500 });
  }
}
