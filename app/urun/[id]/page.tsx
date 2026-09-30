import { cache } from 'react';
import { getProductById, getSettings, getCategories } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import FavoriteButton from '@/components/FavoriteButton';
import ShareButton from '@/components/ShareButton';
import { whatsappLink, telHref } from '@/lib/utils';

// Aynı istek içinde metadata ve sayfa için ürünü bir kez çek
const getProduct = cache(getProductById);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Ürün Bulunamadı' };
  return {
    title: product.name, // Marka adı layout'taki title şablonuyla eklenir
    description: product.description || `${product.name} - New Pırlanta mücevher koleksiyonu.`,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, settings, categories] = await Promise.all([getProduct(id), getSettings(), getCategories()]);

  if (!product) notFound();

  const categoryName = categories.find(c => c.slug === product.category)?.name || product.category.replace(/-/g, ' ');
  const whatsappUrl = whatsappLink(settings.whatsappNumber, `Merhaba, "${product.name}"${product.sku ? ` (${product.sku})` : ''} hakkında bilgi almak istiyorum.`);

  const details = (product.details || {}) as Record<string, unknown>;
  const tasBilgisi = details.tas_bilgisi as Record<string, string> | undefined;
  const specs = [
    { label: "Stok Kodu", value: product.sku },
    { label: "Materyal", value: details.materyal as string },
    { label: "Renk", value: details.renk as string },
    { label: "Ağırlık", value: details.agirlik as string },
    { label: "Sertifika", value: details.sertifika as string },
    ...(tasBilgisi ? [
      { label: "Karat", value: tasBilgisi.karat },
      { label: "Berraklık", value: tasBilgisi.berraklik }
    ] : []),
  ].filter(spec => spec.value);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#D4AF37]">

      <div className="container mx-auto px-4 md:px-8 pt-4 pb-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-6 lg:mb-8">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href={`/koleksiyon/${product.category}`} className="hover:text-black transition-colors">{categoryName}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* SOL TARAF: Fotoğraf */}
          <div className="lg:col-span-7">
             <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* SAĞ TARAF: Ürün Bilgileri */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-32">

             <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight tracking-tight">
                        {product.name}
                    </h1>
                    <ShareButton title={product.name} />
                </div>

                {(product.subCategory || typeof details.sertifika === 'string') && (
                  <div className="flex items-center gap-4">
                      {product.subCategory && (
                        <span className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold">{product.subCategory}</span>
                      )}
                      {typeof details.sertifika === 'string' && details.sertifika && (
                        <span className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase font-bold">{details.sertifika}</span>
                      )}
                  </div>
                )}
             </div>

             {product.description && (
               <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed border-l-2 border-[#D4AF37]/20 pl-4 whitespace-pre-line">
                  {product.description}
               </p>
             )}

             <div className="py-6 border-y border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1 font-bold">Koleksiyon Fiyatı</span>
                    {product.price > 0 ? (
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-serif text-gray-900">{product.price.toLocaleString('tr-TR')}</span>
                           <span className="text-xs font-serif text-gray-500">₺</span>
                           {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-xs text-gray-400 line-through ml-2">{product.oldPrice.toLocaleString('tr-TR')} ₺</span>
                           )}
                        </div>
                    ) : (
                        <span className="text-2xl font-serif text-gray-900">Fiyat Alın</span>
                    )}
                </div>
                <FavoriteButton product={product} />
             </div>

             <div className="space-y-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-4 flex items-center justify-center gap-3 hover:bg-[#1fb356] transition-all rounded-sm shadow-lg shadow-green-500/10 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">WhatsApp&apos;tan Bilgi Al</span>
                </a>
                <div className="grid grid-cols-2 gap-3">
                    <a href={telHref(settings.phoneNumber)} className="border border-gray-200 py-3.5 text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all rounded-sm flex items-center justify-center gap-2">
                        <Phone className="h-3 w-3" /> Hemen Ara
                    </a>
                    <Link href="/subelerimiz" className="border border-gray-200 py-3.5 text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all rounded-sm flex items-center justify-center gap-2">
                        <MapPin className="h-3 w-3" /> Mağazada İnceleyin
                    </Link>
                </div>
             </div>

             {specs.length > 0 && (
               <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <div className="h-1 w-1 rounded-full bg-[#D4AF37]" /> Teknik Özellikler
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                      {specs.map((spec) => (
                          <div key={spec.label} className="flex justify-between items-center text-[9px] uppercase tracking-wider pb-2 border-b border-gray-100/50 last:border-0 last:pb-0">
                              <span className="text-gray-400 font-bold">{spec.label}</span>
                              <span className="text-gray-900 font-black">{spec.value}</span>
                          </div>
                      ))}
                  </div>
               </div>
             )}

             <p className="text-[10px] text-gray-400 leading-relaxed">
                Ürün hakkında detaylı bilgi, güncel fiyat ve rezervasyon için WhatsApp veya telefon ile bize ulaşabilir, ürünlerimizi mağazalarımızda yakından inceleyebilirsiniz.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
