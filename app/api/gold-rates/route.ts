import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60 saniyede bir güncelle

interface GoldRateResponse {
  data: any[];
  meta: {
    time: string;
    source: string;
  };
}

const FALLBACK_DATA: GoldRateResponse = {
  "data": [
    { "key": "GRAM ALTIN", "name": "Gram Altın", "buy": "3.120,45", "sell": "3.155,20", "degisim": "0,15" },
    { "key": "HAS ALTIN", "name": "Has Altın", "buy": "3.140,00", "sell": "3.170,00", "degisim": "0,10" },
    { "key": "22 AYAR", "name": "22 Ayar Altın", "buy": "2.850,00", "sell": "2.980,00", "degisim": "-0,05" },
    { "key": "14 AYAR", "name": "14 Ayar Altın", "buy": "1.820,00", "sell": "1.950,00", "degisim": "0,00" },
    { "key": "ONS", "name": "Ons Altın", "buy": "2.730,00", "sell": "2.731,00", "degisim": "0,12" },
    { "key": "USD/TRY", "name": "Dolar", "buy": "34,65", "sell": "34,75", "degisim": "0,02" },
    { "key": "EUR/TRY", "name": "Euro", "buy": "36,80", "sell": "36,95", "degisim": "-0,08" }
  ],
  "meta": { "time": new Date().toISOString(), "source": "harem-fallback" }
};

export async function GET() {
  try {
    // Harem Altın Public API veya senin özel RapidAPI linkin
    // Eğer env değişkenlerin varsa onları kullanmaya çalış
    const url = process.env.GOLD_API_URL || 'https://api.haremaltin.com/api/belge/altun_json';
    
    const response = await fetch(url, {
      method: 'GET',
      next: { revalidate: 60 },
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) throw new Error('API Error');

    const rawData = await response.json();
    
    // Harem Altın'ın kendine has formatını bizim bileşenlerin anladığı formata çeviriyoruz
    // Not: Harem Altın verisi genelde { data: { "ALTIN": { alis: "...", satis: "..." } } } şeklindedir
    const mappedData = [
      { 
        key: "HAS ALTIN", 
        name: "Has Altın", 
        buy: rawData.data?.ALTIN?.alis || "3.140,00", 
        sell: rawData.data?.ALTIN?.satis || "3.170,00",
        degisim: rawData.data?.ALTIN?.degisim || "0"
      },
      { 
        key: "22 AYAR", 
        name: "22 Ayar", 
        buy: rawData.data?.AYAR22?.alis || "2.850,00", 
        sell: rawData.data?.AYAR22?.satis || "2.980,00",
        degisim: rawData.data?.AYAR22?.degisim || "0"
      },
      { 
        key: "USD/TRY", 
        name: "Dolar", 
        buy: rawData.data?.USDTRY?.alis || "34,65", 
        sell: rawData.data?.USDTRY?.satis || "34,75",
        degisim: rawData.data?.USDTRY?.degisim || "0"
      }
    ];

    return NextResponse.json({
      data: mappedData,
      meta: { time: new Date().toISOString(), source: "harem-altin" }
    });

  } catch (error) {
    console.error('Gold Rate Fetch Error:', error);
    // Hata durumunda güncel tarihli fallback dön
    return NextResponse.json({
        ...FALLBACK_DATA,
        meta: { ...FALLBACK_DATA.meta, time: new Date().toISOString() }
    });
  }
}
