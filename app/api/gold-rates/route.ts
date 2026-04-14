import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 dakikada bir sunucu tarafında güncellenir

const FALLBACK_DATA = [
  { key: "HAS ALTIN", name: "Has Altın", buy: "3.145,20", sell: "3.172,50", trend: "up" },
  { key: "GRAM ALTIN", name: "Gram Altın", buy: "3.125,10", sell: "3.158,40", trend: "up" },
  { key: "22 AYAR", name: "22 Ayar", buy: "2.860,00", sell: "2.995,00", trend: "down" },
  { key: "14 AYAR", name: "14 Ayar", buy: "1.835,00", sell: "1.965,00", trend: "steady" },
  { key: "USD/TRY", name: "Dolar", buy: "34,68", sell: "34,78", trend: "up" },
  { key: "EUR/TRY", name: "Euro", buy: "36,85", sell: "36,98", trend: "up" }
];

export async function GET() {
  try {
    // 1. RAPIDAPI (Harem Altın) - Cache'li istek
    const hRes = await fetch('https://gold-price-data.p.rapidapi.com/prices', {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'gold-price-data.p.rapidapi.com'
      },
      next: { revalidate: 300 }
    });

    if (hRes.ok) {
      const result = await hRes.json();
      const d = result.data || result;
      if (d.ALTIN) {
        return NextResponse.json({
          success: true,
          data: [
            { key: "HAS ALTIN", name: "Has Altın", buy: d.ALTIN.has_altin?.alis, sell: d.ALTIN.has_altin?.satis, trend: "up" },
            { key: "GRAM ALTIN", name: "Gram Altın", buy: d.ALTIN.gram_altin?.alis, sell: d.ALTIN.gram_altin?.satis, trend: "up" },
            { key: "22 AYAR", name: "22 Ayar", buy: d.ALTIN.ayar22?.alis, sell: d.ALTIN.ayar22?.satis, trend: "up" },
            { key: "14 AYAR", name: "14 Ayar", buy: d.ALTIN.ayar14?.alis, sell: d.ALTIN.ayar14?.satis, trend: "up" },
            { key: "USD/TRY", name: "Dolar", buy: d.DOVIZ?.USD?.alis, sell: d.DOVIZ?.USD?.satis, trend: "up" },
            { key: "EUR/TRY", name: "Euro", buy: d.DOVIZ?.EUR?.alis, sell: d.DOVIZ?.EUR?.satis, trend: "up" }
          ]
        });
      }
    }

    // 2. TRUNCGİL (Yedek) - Cache'li istek
    const tRes = await fetch('https://finans.truncgil.com/today.json', { 
      next: { revalidate: 300 } 
    });
    const tData = await tRes.json();
    
    const safeParseNumber = (v: unknown): number => {
        if (typeof v === 'number') return v;
        if (!v) return 0;
        const s = String(v).replace(/\s/g, '');
        if (s.includes(',') && s.includes('.')) {
            return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
        }
        if (s.includes(',')) {
            return parseFloat(s.replace(',', '.')) || 0;
        }
        return parseFloat(s) || 0;
    };

    const usd = safeParseNumber(tData["ABD Doları"]?.Satış || tData["USD"]?.Satış || "34.78");
    const ons = safeParseNumber(tData["Ons Altın"]?.Satış || tData["ONS"]?.Satış || "2735");
    const calculatedHas = (ons / 31.1034768) * usd * 1.05; 

    return NextResponse.json({
      success: true,
      data: [
        { key: "HAS ALTIN", name: "Has Altın", buy: (calculatedHas * 0.998).toLocaleString('tr-TR'), sell: calculatedHas.toLocaleString('tr-TR'), trend: "up" },
        { key: "GRAM ALTIN", name: "Gram Altın", buy: (calculatedHas * 0.995).toLocaleString('tr-TR'), sell: (calculatedHas * 1.025).toLocaleString('tr-TR'), trend: "up" },
        { key: "22 AYAR", name: "22 Ayar", buy: (calculatedHas * 0.916).toLocaleString('tr-TR'), sell: (calculatedHas * 0.926).toLocaleString('tr-TR'), trend: "up" },
        { key: "14 AYAR", name: "14 Ayar", buy: (calculatedHas * 0.58).toLocaleString('tr-TR'), sell: (calculatedHas * 0.585).toLocaleString('tr-TR'), trend: "up" },
        { key: "USD/TRY", name: "Dolar", buy: (usd * 0.999).toLocaleString('tr-TR'), sell: usd.toLocaleString('tr-TR'), trend: "up" },
        { key: "EUR/TRY", name: "Euro", buy: tData["Euro"]?.Alış || "36.80", sell: tData["Euro"]?.Satış || "36.95", trend: "up" }
      ]
    });
  } catch (err: unknown) {
    console.error("Gold API Error:", err);
    return NextResponse.json({ success: false, data: FALLBACK_DATA });
  }
}
