'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { track } from '@/lib/track';

/**
 * Sitedeki tüm WhatsApp (wa.me) ve telefon (tel:) linklerine yapılan tıklamaları tek yerden kaydeder.
 * Tıklanan link bir `data-product-id` alanının içindeyse ürün bilgisi de eklenir.
 * Ayrıca genel trafik için Vercel Web Analytics'i (çerezsiz) yükler; admin sayfaları sayılmaz.
 */
export default function AnalyticsTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith('/admin')) return;
      const link = (e.target as Element | null)?.closest?.('a');
      const href = link?.getAttribute('href') || '';

      const type = href.startsWith('https://wa.me/') ? 'whatsapp_click'
        : href.startsWith('tel:') ? 'phone_click'
        : null;
      if (!type) return;

      const productId = link?.closest<HTMLElement>('[data-product-id]')?.dataset.productId;
      track(type, { productId, value: window.location.pathname });
    };

    // Capture aşamasında dinlenir; link yeni sekme açsa veya sayfadan ayrılsa bile kayıt gönderilir
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return <Analytics beforeSend={(event) => (new URL(event.url).pathname.startsWith('/admin') ? null : event)} />;
}

/** Ürün sayfası görüntülenmesini kaydeder */
export function TrackProductView({ productId }: { productId: string }) {
  useEffect(() => {
    track('product_view', { productId });
  }, [productId]);

  return null;
}
