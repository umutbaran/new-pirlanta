import { NextResponse } from 'next/server';
import { parseSafeNumber } from '@/lib/utils';

const SOURCE_URL = 'https://finans.truncgil.com/today.json';

// Gösterilecek kalemler: [kaynaktaki anahtar, bizim anahtarımız, görünen isim]
const RATE_KEYS: [string, string, string][] = [
  ['gram-has-altin', 'HAS ALTIN', 'Has Altın'],
  ['gram-altin', 'GRAM ALTIN', 'Gram Altın'],
  ['22-ayar-bilezik', '22 AYAR', '22 Ayar'],
  ['14-ayar-altin', '14 AYAR', '14 Ayar'],
  ['USD', 'USD/TRY', 'Dolar'],
  ['EUR', 'EUR/TRY', 'Euro'],
];

interface SourceRate {
  'Alış'?: string;
  'Satış'?: string;
  'Değişim'?: string;
}

function trendFromChange(change: string | undefined): 'up' | 'down' | 'steady' {
  const value = parseSafeNumber(String(change || '').replace('%', ''));
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'steady';
}

export async function GET() {
  try {
    // Kaynak veri sunucu tarafında 5 dakika önbelleklenir
    const res = await fetch(SOURCE_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Kaynak HTTP ${res.status}`);
    const source = await res.json() as Record<string, SourceRate>;

    const data = RATE_KEYS
      .filter(([sourceKey]) => source[sourceKey]?.['Satış'])
      .map(([sourceKey, key, name]) => {
        const rate = source[sourceKey];
        return {
          key,
          name,
          buy: rate['Alış'] || '-',
          sell: rate['Satış'] || '-',
          change: rate['Değişim'] || '',
          trend: trendFromChange(rate['Değişim']),
        };
      });

    if (data.length === 0) throw new Error('Kaynak veri formatı değişmiş olabilir');

    return NextResponse.json({ success: true, updatedAt: source['Update_Date'] || null, data });
  } catch (err: unknown) {
    console.error('Gold API Error:', err);
    // Eski/uydurma fiyat göstermek yerine boş veri döner; arayüz şeridi gizler
    return NextResponse.json({ success: false, data: [] }, { status: 503 });
  }
}
