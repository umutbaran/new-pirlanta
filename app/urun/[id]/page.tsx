import { getProducts, getSettings } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Phone, ShieldCheck, Truck, Share2, Star, MessageSquareQuote } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewForm from '@/components/ReviewForm';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return { title: 'Ürün Bulunamadı' };
  return { title: `${product.name} | New Pırlanta`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts(); 
  const settings = await getSettings();
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  const phone = settings.phoneNumber?.replace(/\D/g, '') || '905555555555';
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(`Merhaba, "${product.name}" hakkında bilgi almak istiyorum.`)}`;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#D4AF37]">
      
      <div className="container mx-auto px-4 md:px-12 pt-0 pb-10">
        
        {/* Breadcrumb - Boşluğu iyice daraltıldı */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 pt-2 mb-2 lg:mb-4">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href={`/koleksiyon/${product.category}`} className="hover:text-black transition-colors">{product.category.replace('-', ' ')}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* SOL TARAF: Fotoğraf (Tepeye iyice yaklaştırıldı) */}
          <div className="space-y-16">
             <div className="w-full lg:-mt-2">
                <ProductGallery images={product.images} productName={product.name} />
             </div>

             {/* Müşteri Deneyimleri */}
             <div className="pt-12 border-t border-gray-100 space-y-10">
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-gray-900">Müşteri Deneyimleri</h2>
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-widest font-bold">Müşteri Memnuniyeti</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-center py-16 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                        <MessageSquareQuote className="h-8 w-8 text-gray-200 mx-auto mb-4" />
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Henüz bir değerlendirme yapılmamış</p>
                    </div>

                    <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
                        <h3 className="text-sm font-serif text-gray-900 mb-6 border-b border-gray-50 pb-4">Deneyiminizi Paylaşın</h3>
                        <ReviewForm />
                    </div>
                </div>
             </div>
          </div>

          {/* SAĞ TARAF: Ürün Bilgileri */}
          <div className="flex flex-col space-y-8">
             
             <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight tracking-tight">
                        {product.name}
                    </h1>
                    <button className="text-gray-300 hover:text-black p-2"><Share2 className="h-4 w-4" /></button>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-700 text-[10px] font-bold tracking-[0.2em] bg-green-50 px-2 py-1 rounded">
                        <span className="h-1 w-1 rounded-full bg-green-500"></span>
                        STOKTA HAZIR
                    </div>
                    <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">Sertifikalı Ürün</span>
                </div>
             </div>

             <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed border-l-2 border-[#D4AF37]/20 pl-6">
                {product.description}
             </p>

             <div className="py-8 border-y border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1 font-bold">Koleksiyon Fiyatı</span>
                    <span className="text-3xl font-serif text-gray-900">Fiyat Alın</span>
                </div>
                <FavoriteButton product={product} />
             </div>

             <div className="space-y-4">
                <a href={whatsappLink} target="_blank" className="w-full bg-black text-white py-5 flex items-center justify-center gap-4 hover:bg-[#111] transition-all rounded-sm shadow-lg shadow-black/5 group">
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase">WhatsApp&apos;tan Bilgi Al</span>
                    <Phone className="h-4 w-4" />
                </a>
                <button className="w-full border border-gray-100 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all rounded-sm">
                    Mağazadan Teslim Al
                </button>
             </div>

             <div className="pt-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-black pb-2 inline-block">Teknik Özellikler</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { label: "Stok Kodu", value: product.sku },
                            { label: "Materyal", value: product.details?.materyal },
                            { label: "Renk", value: product.details?.renk },
                            { label: "Ağırlık", value: product.details?.agirlik },
                            ...(product.details?.tas_bilgisi ? [
                                { label: "Karat", value: product.details.tas_bilgisi.karat },
                                { label: "Berraklık", value: product.details.tas_bilgisi.berraklik }
                            ] : []),
                        ].filter(i => i.value).map((spec, i) => (
                            <div key={i} className="flex justify-between text-[10px] uppercase tracking-wider pb-2 border-b border-gray-50">
                                <span className="text-gray-400 font-medium">{spec.label}</span>
                                <span className="text-gray-900 font-bold">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-black pb-2 inline-block">Hizmetlerimiz</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 items-center">
                            <Truck className="h-5 w-5 text-[#D4AF37] shrink-0" />
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ücretsiz Sigortalı Gönderim</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <ShieldCheck className="h-5 w-5 text-[#D4AF37] shrink-0" />
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Uluslararası Mücevher Sertifikası</p>
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