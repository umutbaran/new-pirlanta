import { getProductById, getSettings } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Phone, ShieldCheck, Truck, Share2, Star, MessageSquareQuote, MapPin } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewForm from '@/components/ReviewForm';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Ürün Bulunamadı' };
  return { title: `${product.name} | New Pırlanta`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  const settings = await getSettings();

  if (!product) notFound();

  const phone = settings.phoneNumber?.replace(/\D/g, '') || '905555555555';
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(`Merhaba, "${product.name}" hakkında bilgi almak istiyorum.`)}`;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#D4AF37]">
      
      <div className="container mx-auto px-4 md:px-8 pt-4 pb-12">
        
        {/* Breadcrumb - Daha zarif */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-6 lg:mb-8">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href={`/koleksiyon/${product.category}`} className="hover:text-black transition-colors">{product.category.replace('-', ' ')}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* SOL TARAF: Fotoğraf (Ekrana daha iyi oturması için 7/12 oran) */}
          <div className="lg:col-span-7 space-y-12">
             <div className="w-full">
                <ProductGallery images={product.images} productName={product.name} />
             </div>

             {/* Müşteri Deneyimleri - Daha kompakt */}
             <div className="pt-8 border-t border-gray-100 space-y-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-serif text-gray-900">Müşteri Deneyimleri</h2>
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
                        <span className="text-[9px] text-gray-400 ml-2 uppercase tracking-widest font-bold">Müşteri Memnuniyeti</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="text-center py-10 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                        <MessageSquareQuote className="h-6 w-6 text-gray-200 mx-auto mb-3" />
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Henüz bir değerlendirme yapılmamış</p>
                    </div>

                    <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                        <h3 className="text-xs font-serif text-gray-900 mb-4 border-b border-gray-50 pb-3">Deneyiminizi Paylaşın</h3>
                        <ReviewForm />
                    </div>
                </div>
             </div>
          </div>

          {/* SAĞ TARAF: Ürün Bilgileri (5/12 oran) */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-32">
             
             <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight tracking-tight">
                        {product.name}
                    </h1>
                    <button className="text-gray-300 hover:text-black p-1 shrink-0"><Share2 className="h-4 w-4" /></button>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-700 text-[9px] font-bold tracking-[0.2em] bg-green-50 px-2 py-0.5 rounded">
                        <span className="h-1 w-1 rounded-full bg-green-500"></span>
                        STOKTA HAZIR
                    </div>
                    <span className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold">Sertifikalı Ürün</span>
                </div>
             </div>

             <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed border-l-2 border-[#D4AF37]/20 pl-4">
                {product.description}
             </p>

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
                <a href={whatsappLink} target="_blank" className="w-full bg-[#25D366] text-white py-4 flex items-center justify-center gap-3 hover:bg-[#1fb356] transition-all rounded-sm shadow-lg shadow-green-500/10 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                    <Phone className="h-4 w-4 fill-current" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">WhatsApp&apos;tan Bilgi Al</span>
                </a>
                <button className="w-full border border-gray-100 py-3.5 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all rounded-sm flex items-center justify-center gap-2">
                    <MapPin className="h-3 w-3" /> Mağazadan Teslim Al
                </button>
             </div>

             <div className="pt-4 space-y-8">
                <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                       <div className="h-1 w-1 rounded-full bg-[#D4AF37]" /> Teknik Özellikler
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {(() => {
                            const details = product.details as Record<string, unknown>;
                            const tasBilgisi = details?.tas_bilgisi as Record<string, string> | undefined;
                            
                            return [
                                { label: "Stok Kodu", value: product.sku },
                                { label: "Materyal", value: details?.materyal as string },
                                { label: "Renk", value: details?.renk as string },
                                { label: "Ağırlık", value: details?.agirlik as string },
                                ...(tasBilgisi ? [
                                    { label: "Karat", value: tasBilgisi.karat },
                                    { label: "Berraklık", value: tasBilgisi.berraklik }
                                ] : []),
                            ];
                        })().filter(i => i.value).map((spec, i) => (
                            <div key={i} className="flex justify-between items-center text-[9px] uppercase tracking-wider pb-2 border-b border-gray-100/50 last:border-0 last:pb-0">
                                <span className="text-gray-400 font-bold">{spec.label}</span>
                                <span className="text-gray-900 font-black">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm shrink-0">
                               <Truck className="h-4 w-4 text-[#D4AF37]" />
                            </div>
                            <div>
                               <p className="text-[9px] text-gray-900 font-black uppercase tracking-widest mb-0.5">Sigortalı Gönderim</p>
                               <p className="text-[8px] text-gray-400 leading-relaxed uppercase tracking-tighter">Ücretsiz ve tam sigortalı.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                             <div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm shrink-0">
                               <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                            </div>
                            <div>
                               <p className="text-[9px] text-gray-900 font-black uppercase tracking-widest mb-0.5">Sertifika</p>
                               <p className="text-[8px] text-gray-400 leading-relaxed uppercase tracking-tighter">Uluslararası standartlarda.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}