import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    // 1. DÜZELTİLMİŞ RAPIDAPI (Harem Altın)
    const hRes = await fetch('https://gold-price-data.p.rapidapi.com/prices', {
      headers: {
        'x-rapidapi-key': '4ef94eee73msh7dbdb669c30e224p1a8e11jsn85a76dff2e8b',
        'x-rapidapi-host': 'gold-price-data.p.rapidapi.com'
      },
      cache: 'no-store'
    });

    if (hRes.ok) {
      const result = await hRes.json();
      const d = result.data || result;
      if (d.ALTIN) {
        console.log("✅ HAREM RAPID SUCCESS");
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

    // 2. TRUNCGİL (Eğer RapidAPI patlarsa)
    const tRes = await fetch('https://finans.truncgil.com/today.json', { cache: 'no-store' });
    const tData = await tRes.json();
    
    // Değerleri güvenli bir şekilde sayıya çevir
    const getVal = (v: any) => {
        if (!v) return 0;
        const s = String(v).replace(/\./g, '').replace(',', '.');
        return parseFloat(s) || 0;
    };

    const usd = getVal(tData["ABD Doları"]?.Satış || tData["USD"]?.Satış || "34.78");
    const ons = getVal(tData["Ons Altın"]?.Satış || tData["ONS"]?.Satış || "2735");
    
    // HAS ALTIN HESABI (Piyasa Primiyle beraber 7200-7500 bandı)
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
    console.error("Gold API Error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: false, data: FALLBACK_DATA });
  }
}
