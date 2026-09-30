import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, ArrowRight } from 'lucide-react';
import { getUiConfig, getCategories } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Baran Kuyumculuk güvencesiyle New Pırlanta pırlanta ve altın koleksiyonları.',
};

export default async function HakkimizdaPage() {
  const [uiConfig, categories] = await Promise.all([getUiConfig(), getCategories()]);
  const stores = uiConfig.storeSection?.stores || [];
  const collections = categories.filter(c => c.isActive && !c.isSpecial);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight text-slate-900">Hakkımızda</h1>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80"
              alt="Mücevher koleksiyonu"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-slate-900">New Pırlanta</h2>
            <p className="text-slate-600 leading-relaxed">
              New Pırlanta, Baran Kuyumculuk&apos;un pırlanta ve altın mücevher markasıdır. Bu sitede koleksiyonlarımızı inceleyebilir,
              beğendiğiniz ürünler hakkında bilgi ve güncel fiyat almak için bize WhatsApp veya telefon ile ulaşabilirsiniz.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Ürünlerimizi yakından görmek, denemek ve size en uygun parçayı birlikte seçmek için sizi mağazalarımıza bekliyoruz.
            </p>

            {collections.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Koleksiyonlarımız</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map(c => (
                    <Link key={c.id} href={`/koleksiyon/${c.slug}`} className="px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-700 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {stores.length > 0 && (
          <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <h3 className="text-3xl md:text-4xl font-serif mb-10 relative z-10 text-center">Mağazalarımız</h3>
            <div className="grid sm:grid-cols-2 gap-8 relative z-10">
              {stores.map(store => (
                <div key={store.id} className="flex gap-4">
                  <MapPin className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-serif text-xl">{store.title}</p>
                    <p className="text-slate-400 text-sm whitespace-pre-line mt-1">{store.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 relative z-10">
              <Link href="/subelerimiz" className="inline-flex items-center gap-2 border-b border-white pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors uppercase text-xs font-bold tracking-widest">
                Adres ve Çalışma Saatleri <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
