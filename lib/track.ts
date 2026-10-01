import type { AnalyticsEventType } from './db';

/**
 * Anonim istatistik olayı gönderir. sendBeacon, ziyaretçi sayfadan ayrılırken
 * (ör. WhatsApp'a geçerken) bile isteğin tamamlanmasını sağlar.
 */
export function track(type: AnalyticsEventType, data: { productId?: string; value?: string } = {}) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({ type, ...data });
  try {
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return;
  } catch {
    // sendBeacon desteklenmiyorsa fetch'e düş
  }
  fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
}
