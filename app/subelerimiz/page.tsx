import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { getUiConfig } from '@/lib/db';
import { telHref } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import SmartImage from '@/components/SmartImage';

export const metadata: Metadata = {
  title: 'Mağazalarımız',
  description: 'Mağazalarımızın adres, telefon ve çalışma saatleri.',
};

// Admin panelinden görsel yüklenmemiş şubeler için sırayla kullanılan varsayılan görseller
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80',
];

export default async function BranchesPage() {
  const { storeSection } = await getUiConfig();
  const stores = storeSection?.stores || [];

  return (
    <div>
      <PageHeader
        title="Mağazalarımız"
        description="Ürünlerimizi yakından incelemek, denemek ve uzman ekibimizle tanışmak için sizi mağazalarımıza bekliyoruz."
      />

      {stores.length === 0 && (
        <p className="text-center text-muted py-24">Mağaza bilgileri yakında eklenecek.</p>
      )}

      {stores.map((store, index) => {
        const reversed = index % 2 === 1;
        const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${store.title} ${store.address}`)}`;
        return (
          <section key={store.id} className={reversed ? 'bg-ivory' : ''}>
            <div className="container-lux py-16 md:py-24">
              <div className={`grid md:grid-cols-2 gap-10 md:gap-20 items-center ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-ivory">
                  <SmartImage
                    src={store.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={store.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  {store.badge && <p className="eyebrow text-gold-deep mb-4">{store.badge}</p>}
                  <h2 className="font-display text-4xl md:text-5xl text-ink">{store.title}</h2>
                  <span className="block h-px w-16 bg-gold my-8" aria-hidden />

                  <dl className="space-y-6 text-ink-soft">
                    {store.address && (
                      <div className="flex gap-4">
                        <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" strokeWidth={1.2} />
                        <div><dt className="sr-only">Adres</dt><dd className="whitespace-pre-line leading-relaxed">{store.address}</dd></div>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex gap-4">
                        <Phone className="h-5 w-5 text-gold shrink-0" strokeWidth={1.2} />
                        <div><dt className="sr-only">Telefon</dt><dd><a href={telHref(store.phone)} className="hover:text-ink transition-colors">{store.phone}</a></dd></div>
                      </div>
                    )}
                    {store.hours && (
                      <div className="flex gap-4">
                        <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" strokeWidth={1.2} />
                        <div><dt className="sr-only">Çalışma saatleri</dt><dd className="whitespace-pre-line leading-relaxed">{store.hours}</dd></div>
                      </div>
                    )}
                  </dl>

                  {store.address && (
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-10">
                      Yol Tarifi Al <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
