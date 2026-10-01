import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, ArrowRight } from 'lucide-react';
import { getUiConfig, getCategories } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import SmartImage from '@/components/SmartImage';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Baran Kuyumculuk güvencesiyle New Pırlanta pırlanta ve altın koleksiyonları.',
};

export default async function HakkimizdaPage() {
  const [uiConfig, categories] = await Promise.all([getUiConfig(), getCategories()]);
  const stores = uiConfig.storeSection?.stores || [];
  const collections = categories.filter(c => c.isActive && !c.isSpecial);

  return (
    <div>
      <PageHeader title="Hakkımızda" description="Baran Kuyumculuk'un pırlanta ve altın mücevher markası." />

      <section className="container-lux py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
            <SmartImage
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80"
              alt="Mücevher koleksiyonu"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-gold-deep mb-5">New Pırlanta</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-ink">Işıltıyı birlikte seçmenin zarafeti</h2>
            <span className="block h-px w-16 bg-gold my-8" aria-hidden />
            <div className="space-y-5 text-ink-soft leading-relaxed">
              <p>
                New Pırlanta, Baran Kuyumculuk&apos;un pırlanta ve altın mücevher markasıdır. Bu sitede koleksiyonlarımızı inceleyebilir,
                beğendiğiniz ürünler hakkında bilgi ve güncel fiyat almak için bize WhatsApp veya telefon ile ulaşabilirsiniz.
              </p>
              <p>
                Ürünlerimizi yakından görmek, denemek ve size en uygun parçayı birlikte seçmek için sizi mağazalarımıza bekliyoruz.
              </p>
            </div>

            {collections.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow text-muted mb-4">Koleksiyonlarımız</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map(c => (
                    <Link key={c.id} href={`/koleksiyon/${c.slug}`} className="border border-line px-4 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {stores.length > 0 && (
        <section className="bg-ivory">
          <div className="container-lux py-16 md:py-24">
            <h2 className="font-display text-4xl md:text-5xl text-ink text-center">Mağazalarımız</h2>
            <div className="mt-12 grid gap-px bg-line border border-line sm:grid-cols-2 max-w-4xl mx-auto">
              {stores.map(store => (
                <div key={store.id} className="bg-white p-8 flex gap-4">
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-1" strokeWidth={1.2} />
                  <div>
                    <p className="font-display text-2xl text-ink">{store.title}</p>
                    <p className="text-ink-soft text-sm whitespace-pre-line mt-2 leading-relaxed">{store.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/subelerimiz" className="link-underline text-ink">
                Adres ve Çalışma Saatleri <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
