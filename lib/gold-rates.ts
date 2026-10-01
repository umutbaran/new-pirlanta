import { parseSafeNumber } from './utils';

/**
 * Altın, değerli maden ve döviz kurları.
 *
 * Kaynak, GOLD_PROVIDER ortam değişkeniyle seçilir (varsayılan: "truncgil").
 * Resmî/ücretli bir sağlayıcıya (ör. Harem Altın) geçmek için:
 *   1. Aşağıdaki PROVIDERS nesnesine o sağlayıcının verisini `RateSource[]` biçimine
 *      çeviren bir fonksiyon ekleyin (API anahtarı process.env'den okunur).
 *   2. Vercel'de GOLD_PROVIDER ve anahtar değişkenlerini tanımlayın.
 * Sitenin geri kalanı (üst bar, piyasa sayfası, hesaplayıcı) değişiklik gerektirmez.
 */

export type RateGroup = 'altin' | 'maden' | 'doviz';

export interface RateDefinition {
  key: string;
  name: string;
  group: RateGroup;
  unit: 'gram' | 'adet' | 'ons' | 'birim';
  currency: 'TRY' | 'USD';
  sourceKey: string; // Truncgil anahtarı
}

/** Gösterilen kalemler ve sırası */
export const RATE_DEFINITIONS: RateDefinition[] = [
  { key: 'GRAM', name: 'Gram Altın', group: 'altin', unit: 'gram', currency: 'TRY', sourceKey: 'gram-altin' },
  { key: 'HAS', name: 'Has Altın', group: 'altin', unit: 'gram', currency: 'TRY', sourceKey: 'gram-has-altin' },
  { key: 'CEYREK', name: 'Çeyrek Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'ceyrek-altin' },
  { key: 'YARIM', name: 'Yarım Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'yarim-altin' },
  { key: 'TAM', name: 'Tam Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'tam-altin' },
  { key: 'CUMHURIYET', name: 'Cumhuriyet Altını', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'cumhuriyet-altini' },
  { key: 'ATA', name: 'Ata Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'ata-altin' },
  { key: 'RESAT', name: 'Reşat Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'resat-altin' },
  { key: 'IKIBUCUK', name: 'İkibuçuk Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'ikibucuk-altin' },
  { key: 'BESLI', name: 'Beşli Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'besli-altin' },
  { key: 'GREMSE', name: 'Gremse Altın', group: 'altin', unit: 'adet', currency: 'TRY', sourceKey: 'gremse-altin' },
  { key: 'AYAR22', name: '22 Ayar Bilezik', group: 'altin', unit: 'gram', currency: 'TRY', sourceKey: '22-ayar-bilezik' },
  { key: 'AYAR18', name: '18 Ayar Altın', group: 'altin', unit: 'gram', currency: 'TRY', sourceKey: '18-ayar-altin' },
  { key: 'AYAR14', name: '14 Ayar Altın', group: 'altin', unit: 'gram', currency: 'TRY', sourceKey: '14-ayar-altin' },
  { key: 'ONS', name: 'Ons Altın', group: 'altin', unit: 'ons', currency: 'USD', sourceKey: 'ons' },
  { key: 'GUMUS', name: 'Gram Gümüş', group: 'maden', unit: 'gram', currency: 'TRY', sourceKey: 'gumus' },
  { key: 'PLATIN', name: 'Gram Platin', group: 'maden', unit: 'gram', currency: 'TRY', sourceKey: 'gram-platin' },
  { key: 'PALADYUM', name: 'Gram Paladyum', group: 'maden', unit: 'gram', currency: 'TRY', sourceKey: 'gram-paladyum' },
  { key: 'USD', name: 'Dolar', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'USD' },
  { key: 'EUR', name: 'Euro', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'EUR' },
  { key: 'GBP', name: 'Sterlin', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'GBP' },
  { key: 'CHF', name: 'İsviçre Frangı', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'CHF' },
  { key: 'SAR', name: 'Suudi Riyali', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'SAR' },
  { key: 'AED', name: 'BAE Dirhemi', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'AED' },
  { key: 'CAD', name: 'Kanada Doları', group: 'doviz', unit: 'birim', currency: 'TRY', sourceKey: 'CAD' },
];

export type RateKey = string;

export interface Rate {
  key: RateKey;
  name: string;
  group: RateGroup;
  unit: RateDefinition['unit'];
  currency: RateDefinition['currency'];
  buy: number;
  sell: number;
  changePercent: number | null; // Günlük değişim (%); kaynak vermiyorsa null
}

export interface RatesResult {
  source: string;
  updatedAt: string | null;
  rates: Rate[];
}

type Provider = () => Promise<RatesResult>;

/** "$4.177,85" veya "6.586,13" gibi değerlerden para birimi işaretlerini temizleyip sayıya çevirir */
const toNumber = (v: unknown) => parseSafeNumber(String(v ?? '').replace(/[^\d.,-]/g, ''));

// --- Truncgil (ücretsiz piyasa verisi) ---
const truncgil: Provider = async () => {
  const res = await fetch('https://finans.truncgil.com/today.json', { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Truncgil HTTP ${res.status}`);
  const data = await res.json() as Record<string, Record<string, string>>;

  const rates = RATE_DEFINITIONS
    .filter(def => data[def.sourceKey]?.['Satış'])
    .map(def => {
      const src = data[def.sourceKey];
      return {
        key: def.key,
        name: def.name,
        group: def.group,
        unit: def.unit,
        currency: def.currency,
        buy: toNumber(src['Alış']),
        sell: toNumber(src['Satış']),
        changePercent: src['Değişim'] ? toNumber(src['Değişim']) : null,
      };
    })
    .filter(r => r.sell > 0);

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

/** Fiyat biçimi: 6.593,62 (küçük değerlerde 4 ondalık) */
export function formatRate(value: number): string {
  const digits = Math.abs(value) < 10 ? 4 : 2;
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

export const currencySymbol = (c: RateDefinition['currency']) => (c === 'USD' ? '$' : '₺');
