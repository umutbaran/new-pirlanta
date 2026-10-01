import { parseSafeNumber } from './utils';

/**
 * Altın ve döviz kurları.
 *
 * Kaynak, GOLD_PROVIDER ortam değişkeniyle seçilir (varsayılan: "truncgil").
 * Resmî/ücretli bir sağlayıcıya (ör. Harem Altın) geçmek için:
 *   1. Aşağıdaki PROVIDERS nesnesine o sağlayıcının verisini `RateSource[]` biçimine
 *      çeviren bir fonksiyon ekleyin (API anahtarı process.env'den okunur).
 *   2. Vercel'de GOLD_PROVIDER ve anahtar değişkenlerini tanımlayın.
 * Sitenin geri kalanı (üst bar, piyasa sayfası) değişiklik gerektirmez.
 */

export type RateKey = 'GRAM' | 'HAS' | 'AYAR22' | 'AYAR14' | 'CEYREK' | 'USD' | 'EUR';

export interface Rate {
  key: RateKey;
  name: string;
  buy: number;
  sell: number;
  changePercent: number | null; // Günlük değişim (%); kaynak vermiyorsa null
}

export interface RatesResult {
  source: string;
  updatedAt: string | null;
  rates: Rate[];
}

const NAMES: Record<RateKey, string> = {
  GRAM: 'Gram Altın',
  HAS: 'Has Altın',
  AYAR22: '22 Ayar',
  AYAR14: '14 Ayar',
  CEYREK: 'Çeyrek Altın',
  USD: 'Dolar',
  EUR: 'Euro',
};

type Provider = () => Promise<RatesResult>;

// --- Truncgil (ücretsiz piyasa verisi) ---
const truncgil: Provider = async () => {
  const res = await fetch('https://finans.truncgil.com/today.json', { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Truncgil HTTP ${res.status}`);
  const data = await res.json() as Record<string, Record<string, string>>;

  const map: [string, RateKey][] = [
    ['gram-altin', 'GRAM'], ['gram-has-altin', 'HAS'], ['22-ayar-bilezik', 'AYAR22'],
    ['14-ayar-altin', 'AYAR14'], ['ceyrek-altin', 'CEYREK'], ['USD', 'USD'], ['EUR', 'EUR'],
  ];
  const rates = map
    .filter(([src]) => data[src]?.['Satış'])
    .map(([src, key]) => ({
      key,
      name: NAMES[key],
      buy: parseSafeNumber(data[src]['Alış']),
      sell: parseSafeNumber(data[src]['Satış']),
      changePercent: data[src]['Değişim'] ? parseSafeNumber(data[src]['Değişim'].replace('%', '')) : null,
    }));

  return { source: 'truncgil', updatedAt: (data['Update_Date'] as unknown as string) || null, rates };
};

const PROVIDERS: Record<string, Provider> = {
  truncgil,
  // harem: async () => { ... resmî API anahtarı alındığında eklenecek ... },
};

export async function getRates(): Promise<RatesResult> {
  const name = process.env.GOLD_PROVIDER || 'truncgil';
  const provider = PROVIDERS[name];
  if (!provider) throw new Error(`Bilinmeyen altın veri sağlayıcısı: ${name}`);
  const result = await provider();
  if (result.rates.length === 0) throw new Error('Kaynak boş veri döndürdü (format değişmiş olabilir)');
  return result;
}

/** Türk Lirası biçimi: 6.593,62 */
export function formatRate(value: number): string {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
