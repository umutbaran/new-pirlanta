import { NextResponse } from 'next/server';

interface GoldRateItem {
  key: string;
  name: string;
  buy: string;
  sell: string;
  degisim: string;
}

interface GoldRateResponse {
  data: GoldRateItem[];
  meta: {
    time: string;
    source: string;
  };
}

// Basit in-memory cache (Serverless ortamda container yaşadığı sürece çalışır)
let cachedData: GoldRateResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

const FALLBACK_DATA: GoldRateResponse = {
  "data": [
    { "key": "GRAM ALTIN", "name": "Gram Altın", "buy": "2.950,45", "sell": "3.010,20", "degisim": "0,15" },
    { "key": "HAS ALTIN", "name": "Has Altın", "buy": "2.980,00", "sell": "3.020,00", "degisim": "0,10" },
    { "key": "22 AYAR", "name": "22 Ayar Altın", "buy": "2.720,00", "sell": "2.850,00", "degisim": "-0,05" },
    { "key": "14 AYAR", "name": "14 Ayar Altın", "buy": "1.700,00", "sell": "1.850,00", "degisim": "0,00" },
    { "key": "ONS", "name": "Ons Altın", "buy": "2.630,00", "sell": "2.631,00", "degisim": "0,12" },
    { "key": "USD/TRY", "name": "Dolar", "buy": "34,15", "sell": "34,25", "degisim": "0,02" },
    { "key": "EUR/TRY", "name": "Euro", "buy": "37,10", "sell": "37,25", "degisim": "-0,08" }
  ],
  "meta": { "time": new Date().toISOString(), "source": "fallback" }
};

export async function GET() {
  const url = process.env.RAPIDAPI_URL;
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  // 1. Cache Kontrolü
  const now = Date.now();
  if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
    return NextResponse.json(cachedData);
  }

  // 2. Konfigürasyon Kontrolü
  if (!url || !apiKey || !apiHost) {
    console.warn("API config missing, using fallback.");
    return NextResponse.json(FALLBACK_DATA);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      next: { revalidate: 300 } // Next.js cache (5 dk)
    });

    if (response.status === 429) {
      console.warn("API Rate Limit (429) hit. Using fallback data.");
      return NextResponse.json(cachedData || FALLBACK_DATA);
    }

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache'i güncelle
    cachedData = data;
    lastFetchTime = now;

    return NextResponse.json(data);

  } catch (error) {
    console.error('Gold Rate Fetch Error:', error);
    // Hata durumunda (internet yok, API bozuk vs.) cache varsa onu, yoksa fallback'i dön
    return NextResponse.json(cachedData || FALLBACK_DATA);
  }
}