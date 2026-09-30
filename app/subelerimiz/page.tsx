import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getUiConfig } from '@/lib/db';
import { telHref } from '@/lib/utils';

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
    <div className="bg-white min-h-screen">

       {/* HEADER */}
       <div className="py-24 text-center bg-gray-50">
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6">Mağazalarımız</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed px-4">
             Dijital dünyada varız ama köklerimiz hala sıcak bir kahvenin hatırında.
             Ürünlerimizi yakından incelemek, denemek ve uzman ekibimizle tanışmak için sizi bekliyoruz.
          </p>
       </div>

       {stores.length === 0 && (
          <p className="text-center text-gray-400 py-24">Mağaza bilgileri yakında eklenecek.</p>
       )}

       {stores.map((store, index) => {
          const dark = index % 2 === 1;
          const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${store.title} ${store.address}`)}`;
          return (
            <section key={store.id} className={dark ? 'py-24 bg-[#121212] text-white' : 'py-24'}>
               <div className="container mx-auto px-4">
                  <div className={`flex flex-col items-center gap-16 ${dark ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                     <div className="w-full md:w-1/2 h-[400px] md:h-[500px] relative">
                        <div className={`absolute inset-0 transform scale-95 ${dark ? 'border border-white/20 rotate-2' : 'bg-gray-200 -rotate-2'}`} />
                        <Image
                           src={store.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                           alt={store.title}
                           fill
                           sizes="(max-width: 768px) 100vw, 50vw"
                           className="relative z-10 object-cover shadow-2xl"
                        />
                     </div>
                     <div className="w-full md:w-1/2 space-y-8">
                        {store.badge && <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase block">{store.badge}</span>}
                        <h2 className={`text-4xl font-serif ${dark ? 'text-white' : 'text-gray-900'}`}>{store.title}</h2>
                        <div className={`h-[1px] w-24 ${dark ? 'bg-white/20' : 'bg-gray-200'}`} />

                        <div className={`space-y-6 font-light ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                           {store.address && (
                              <div className="flex gap-4">
                                 <MapPin className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                                 <p className="whitespace-pre-line">{store.address}</p>
                              </div>
                           )}
                           {store.phone && (
                              <div className="flex gap-4">
                                 <Phone className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                                 <a href={telHref(store.phone)} className="hover:text-[#D4AF37] transition-colors">{store.phone}</a>
                              </div>
                           )}
                           {store.hours && (
                              <div className="flex gap-4">
                                 <Clock className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                                 <p className="whitespace-pre-line">{store.hours}</p>
                              </div>
                           )}
                        </div>

                        {store.address && (
                           <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 border-b pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors uppercase text-xs font-bold tracking-widest mt-4 ${dark ? 'text-white border-white' : 'text-black border-black'}`}>
                              Yol Tarifi Al <ArrowRight className="h-4 w-4" />
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
