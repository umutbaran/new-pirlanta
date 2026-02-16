import { BulletinItem } from './db';

const API_URL = process.env.INVESTING_API_URL || 'https://investing-com-economic-calendar.p.rapidapi.com/calendar';
const API_KEY = process.env.INVESTING_API_KEY || '';

// Ülke Kısaltmaları Eşleştirmesi
const countryMap: Record<string, string> = {
  'USD': 'ABD',
  'EUR': 'Avrupa',
  'TRY': 'Türkiye',
  'GBP': 'İngiltere',
  'CNY': 'Çin',
  'JPY': 'Çin',
  'GOLD': 'Global',
};

export async function fetchEconomicCalendar(): Promise<BulletinItem[]> {
  if (!API_KEY) {
    console.warn('INVESTING_API_KEY tanımlı değil. Otomatik senkronizasyon atlanıyor.');
    return [];
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'investing-com-economic-calendar.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Gelen veriyi bizim formatımıza çevir
    // NOT: API'den dönen veri yapısına göre burayı güncellememiz gerekebilir.
    // Şimdilik standart bir yapı varsayıyoruz.
    const bulletins: BulletinItem[] = data.map((item: any) => {
      // Önem derecesini 1-3 arasına çevir
      let importance: 1 | 2 | 3 = 1;
      if (item.importance === 'high' || item.volatility === 3) importance = 3;
      else if (item.importance === 'medium' || item.volatility === 2) importance = 2;

      // Ülke ismini belirle
      const country = countryMap[item.currency] || item.country || item.currency || 'Global';

      return {
        id: `auto_${item.id || Math.random().toString(36).substr(2, 9)}`,
        date: item.date || new Date().toISOString().split('T')[0], // YYYY-MM-DD
        time: item.time || '00:00',
        country: country,
        event: item.event || item.name,
        importance: importance,
        impact: 'neutral', // Varsayılan nötr, admin bunu güncelleyebilir
        description: `Beklenti: ${item.forecast || '-'} / Önceki: ${item.previous || '-'}`
      };
    });

    // Sadece önemli (2 ve 3 yıldız) ve Türkiye/ABD/Avrupa verilerini filtrele (Gürültüyü azaltmak için)
    const filtered = bulletins.filter(b => 
      b.importance >= 2 && 
      ['ABD', 'Türkiye', 'Avrupa', 'Global'].includes(b.country)
    );

    return filtered;

  } catch (error) {
    console.error('Investing Fetch Error:', error);
    throw error;
  }
}
