import { ArrowRight, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getUiConfig, InfoCard, StoreItem } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const products = await getProducts();
  const uiConfig = await getUiConfig();
  
  const showcaseProducts = products.slice(0, 4);

  // Destructure for cleaner access
  const { collectionMosaic, infoCenter, showcase, storeSection } = uiConfig;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. KOLEKSİYON MOZAİĞİ */}
      <section className="py-24 container mx-auto px-4 bg-white">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
               <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-2 block">Koleksiyonlar</span>
               <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">{collectionMosaic.mainTitle}</h2>
               <p className="text-gray-500 font-light text-lg">
                  {collectionMosaic.description}
               </p>
            </div>
            <Link href="/koleksiyon/yeni" className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold hover:text-black transition-colors flex items-center gap-2 border-b border-[#D4AF37] pb-1">
               Tümünü İncele <ArrowRight className="h-4 w-4" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Büyük Kart */}
            <Link href={collectionMosaic.items[0].link} className="md:col-span-8 relative group overflow-hidden cursor-pointer rounded-sm h-[400px] md:h-full block shadow-xl hover:shadow-2xl transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
               <Image 
                  src={collectionMosaic.items[0].image} 
                  alt={collectionMosaic.items[0].title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
               />
               <div className="absolute bottom-10 left-10 z-20">
                  <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-2 block font-bold">{collectionMosaic.items[0].subtitle}</span>
                  <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">{collectionMosaic.items[0].title}</h3>
                  <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
                     {collectionMosaic.items[0].buttonText} <ArrowRight className="h-4 w-4" />
                  </span>
               </div>
            </Link>

            {/* Yan Kart */}
            <Link href={collectionMosaic.items[1].link} className="md:col-span-4 relative group overflow-hidden cursor-pointer rounded-sm h-[400px] md:h-full block shadow-xl hover:shadow-2xl transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
               <Image 
                  src={collectionMosaic.items[1].image} 
                  alt={collectionMosaic.items[1].title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
               />
               <div className="absolute bottom-10 left-10 z-20">
                  <h3 className="text-3xl font-serif text-white mb-2">{collectionMosaic.items[1].title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{collectionMosaic.items[1].subtitle}</p>
                  <span className="text-white border-b border-white pb-1 text-xs tracking-widest uppercase group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                     {collectionMosaic.items[1].buttonText}
                  </span>
               </div>
            </Link>
         </div>
      </section>

      {/* 3. MÜCEVHER DÜNYASI & REHBERLER */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
              <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-2 block">{infoCenter.subtitle}</span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900">{infoCenter.title}</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {infoCenter.cards.map((card: InfoCard, idx: number) => (
                  <div key={idx} className="group relative h-96 overflow-hidden cursor-pointer shadow-lg">
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                     <Image 
                        src={card.image} 
                        alt={card.title} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute bottom-8 left-8 right-8 z-20 text-center">
                        <h3 className="text-2xl font-serif text-white mb-2">{card.title}</h3>
                        <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                           {card.description}
                        </p>
                        <span className="inline-block border-b border-white text-white text-xs font-bold uppercase tracking-widest pb-1">{card.buttonText}</span>
                     </div>
                  </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. ÖZEL VİTRİN */}
      <section className="bg-[#fcfbf9] py-24 border-y border-gray-100">
         <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900">{showcase.title}</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6" />
         </div>
         <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {showcaseProducts.map((product) => (
               <ProductCard key={product.id} product={product} />
            ))}
         </div>
      </section>

      {/* 5. İLETİŞİM BANNER (Dinamik Ayarlar) */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif text-gray-900 mb-4">{storeSection.title}</h2>
               <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">{storeSection.subtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
               {storeSection.stores && storeSection.stores.map((store: StoreItem) => (
                  <div key={store.id} className="flex flex-col md:flex-row items-center gap-8 p-10 border border-gray-100 rounded-sm shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/30 transition-all duration-500 group bg-gray-50/30">
                     <div className="w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform overflow-hidden relative">
                        {store.image ? (
                           <Image 
                              src={store.image} 
                              alt={store.title} 
                              fill
                              className="object-cover" 
                           />
                        ) : (
                           <MapPin className="h-8 w-8 text-[#D4AF37]" />
                        )}
                     </div>
                     <div className="text-center md:text-left flex-1">
                        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2 block">{store.badge}</span>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{store.title}</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed whitespace-pre-line">
                           {store.address}
                        </p>
                        {store.phone && (
                           <a href={`tel:${store.phone}`} className="inline-flex items-center gap-3 text-lg font-bold text-gray-900 hover:text-[#D4AF37] transition-colors border border-gray-200 bg-white px-6 py-3 rounded-full hover:shadow-md">
                              <Phone className="h-5 w-5 text-[#D4AF37]" /> {store.phone}
                           </a>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}