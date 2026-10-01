import { NextResponse } from 'next/server';
import { z } from 'zod';
import { recordEvent, ANALYTICS_EVENT_TYPES } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

const eventSchema = z.object({
  type: z.enum(ANALYTICS_EVENT_TYPES),
  productId: z.string().max(64).optional(),
  value: z.string().max(120).optional(),
});

// Arama motoru botları, önizleme servisleri ve otomatik testler sayılmaz
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|curl|wget/i;

// Tek bir kaynaktan gelen sahte/aşırı kayıtları sınırla (bellek içi, sunucu örneği başına)
const MAX_EVENTS_PER_MINUTE = 60;
const recentByIp = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = recentByIp.get(ip);
  if (!entry || now - entry.windowStart > 60_000) {
    recentByIp.set(ip, { count: 1, windowStart: now });
    if (recentByIp.size > 5000) recentByIp.clear(); // Bellek büyümesini engelle
    return false;
  }
  entry.count++;
  return entry.count > MAX_EVENTS_PER_MINUTE;
}

export async function POST(request: Request) {
  // Hata durumunda bile ziyaretçiye hep 204 dönülür; istatistik kaydı siteyi etkilememeli
  const noContent = new NextResponse(null, { status: 204 });

  // Yerel geliştirme (npm run dev) sırasındaki gezintiler canlı istatistiklere yazılmasın
  if (process.env.NODE_ENV === 'development') return noContent;

  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent || BOT_PATTERN.test(userAgent)) return noContent;

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) return noContent;

  try {
    const parsed = eventSchema.safeParse(await request.json());
    if (!parsed.success) return noContent;

    // Admin'in kendi gezintileri istatistikleri şişirmesin
    if (await isAdmin()) return noContent;

    const { type, productId, value } = parsed.data;
    const normalizedValue = type === 'search' ? value?.trim().toLocaleLowerCase('tr') : value;
    await recordEvent(type, productId, normalizedValue);
  } catch {
    // Geçersiz gövde vb. sessizce yok sayılır
  }
  return noContent;
}
