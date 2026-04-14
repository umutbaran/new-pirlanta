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
 * Fiyatı Türk Lirası formatında gösterir
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "Fiyat Alın";
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
}
