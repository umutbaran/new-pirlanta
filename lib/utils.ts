import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind class birleştirme yardımcısı
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Metni URL uyumlu (slug) hale getirir
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o'
  };
  
  let str = text || "";
  for (const key in trMap) {
    str = str.replace(new RegExp(key, 'g'), trMap[key]);
  }
  
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * API'den gelen karmaşık sayı formatlarını (3.145,20 veya 3145.20) parse eder
 */
export function parseSafeNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const s = String(v).replace(/\s/g, '');
  // Eğer hem nokta hem virgül varsa (3.145,20)
  if (s.includes(',') && s.includes('.')) {
    return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
  }
  // Sadece virgül varsa (3145,20)
  if (s.includes(',')) {
    return parseFloat(s.replace(',', '.')) || 0;
  }
  return parseFloat(s) || 0;
}

/**
 * Telefon numarasını WhatsApp'ın beklediği uluslararası formata çevirir (ör. "0552 787 35 13" -> "905527873513")
 */
export function toWhatsAppNumber(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = '90' + digits.slice(1);
  else if (digits.length === 10 && digits.startsWith('5')) digits = '90' + digits;
  return digits;
}

/**
 * Hazır mesajlı WhatsApp sohbet linki oluşturur
 */
export function whatsappLink(number: string, message?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * "tel:" linki için numarayı temizler
 */
export function telHref(phone: string): string {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
}

/**
 * Başarısız bir API yanıtından kullanıcıya gösterilecek hata mesajını çıkarır
 */
export async function getApiError(res: Response, fallback: string): Promise<string> {
  if (res.status === 401) return 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
  try {
    const data = await res.json() as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}
