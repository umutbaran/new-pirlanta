import { getProducts, getSettings } from '@/lib/db'; // AYARLARI EKLEDİK
import { notFound } from 'next/navigation';
import { Phone, ShieldCheck, Truck, ShoppingBag, Heart, Check, Box, Info } from 'lucide-react';
import { Metadata } from 'next';

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
  const settings = await getSettings(); // AYARLARI ÇEKTİK
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const phone = settings.phoneNumber.replace(/\D/g, ''); // Sadece rakamları al
  const whatsappMessage = `Merhaba, New Pırlanta web sitesinden "${product.name}" (Stok Kodu: ${product.sku}) hakkında detaylı bilgi ve özel fiyat teklifi almak istiyorum.`;
  const whatsappLink = `https://wa.me/${phone || '905555555555'}?text=${encodeURIComponent(whatsappMessage)}`;

  const specs = [
     { label: 'Materyal', value: product.details.materyal },
     { label: 'Renk', value: product.details.renk },
     { label: 'Ağırlık', value: product.details.agirlik },
     { label: 'Garanti', value: product.details.garanti },
     { label: 'Sertifika', value: product.details.sertifika },
  ];

  if (product.details.tas_bilgisi) {
     specs.push(
        { label: 'Taş Tipi', value: product.details.tas_bilgisi.tip },
        { label: 'Karat', value: product.details.tas_bilgisi.karat },
        { label: 'Renk', value: product.details.tas_bilgisi.renk },
        { label: 'Berraklık', value: product.details.tas_bilgisi.berraklik },
        { label: 'Kesim', value: product.details.tas_bilgisi.kesim }
     );
  }

  return (
    <div className="bg-white pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 py-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
           <span className="hover:text-black cursor-pointer">Anasayfa</span> 
           <span className="mx-2 text-gray-300">/</span>
           <span className="hover:text-black cursor-pointer">Koleksiyon</span>
           <span className="mx-2 text-gray-300">/</span>
           <span className="text-black font-bold">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: GALLERY */}
          <div className="lg:w-3/5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.images.map((img, idx) => (
                   <div key={idx} className={`relative bg-gray-50 aspect-square overflow-hidden group ${idx === 0 ? 'md:col-span-2 aspect-[4/3]' : ''}`}>
                      <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={product.name} />
                   </div>
                ))}
             </div>
          </div>

          {/* RIGHT: INFO & ACTIONS */}
          <div className="lg:w-2/5 sticky top-32 h-fit">
             <div className="mb-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
                {product.sku}
             </div>
             <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-6 leading-tight">
                {product.name}
             </h1>

             {/* Info Block (Fiyat Yerine) */}
             <div className="mb-8 pb-8 border-b border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                   <Check className="h-4 w-4" />
                   <span>Mağaza Stoğunda Mevcut</span>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                   <Info className="h-4 w-4 inline mr-2 text-[#D4AF37]" />
                   Bu ürün kişiye özel ölçü ve tasarım seçenekleriyle sunulmaktadır. Güncel fiyat ve detaylı bilgi için lütfen iletişime geçiniz.
                </div>
             </div>

             {/* Description Short */}
             <p className="text-gray-600 font-light leading-relaxed mb-8">
                {product.description}
             </p>

             {/* ACTIONS */}
             <div className="space-y-4 mb-10">
                <div className="flex gap-4">
                   <button className="flex-1 bg-white border border-black text-black py-4 font-bold text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 group">
                      <ShoppingBag className="h-4 w-4 group-hover:text-white" />
                      Mağazadan Teslim Al
                   </button>
                   <button className="w-14 border border-gray-200 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                      <Heart className="h-5 w-5" />
                   </button>
                </div>
                <a 
                   href={whatsappLink} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block w-full bg-[#121212] text-white py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#D4AF37] transition-colors text-center shadow-lg"
                >
                   WhatsApp ile Fiyat Al
                </a>
             </div>

             {/* Trust Badges */}
             <div className="grid grid-cols-2 gap-y-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                   <span>Sertifikalı Ürün</span>
                </div>
                <div className="flex items-center gap-3">
                   <Box className="h-5 w-5 text-[#D4AF37]" />
                   <span>Özel Hediye Kutusu</span>
                </div>
                <div className="flex items-center gap-3">
                   <Truck className="h-5 w-5 text-[#D4AF37]" />
                   <span>Sigortalı Teslimat</span>
                </div>
                <div className="flex items-center gap-3">
                   <Check className="h-5 w-5 text-[#D4AF37]" />
                   <span>Ömür Boyu Bakım</span>
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM: TABS (Details) */}
        <div className="mt-24 max-w-4xl mx-auto">
           <div className="flex justify-center gap-12 border-b border-gray-200 mb-12">
              <button className="pb-4 border-b-2 border-black font-bold text-sm tracking-widest uppercase">Ürün Özellikleri</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-black font-bold text-sm tracking-widest uppercase transition-colors">Teslimat & İade</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-black font-bold text-sm tracking-widest uppercase transition-colors">Bakım</button>
           </div>

           <div className="bg-gray-50 p-8 md:p-12">
              <h3 className="font-serif text-2xl mb-8 text-center">Teknik Detaylar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                 {specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-3 border-b border-gray-200">
                       <span className="text-gray-500 font-medium">{spec.label}</span>
                       <span className="text-gray-900">{spec.value}</span>
                    </div>
                 ))}
              </div>
              <div className="mt-8 text-center text-xs text-gray-400 italic">
                 * Ürün ağırlıklarında el işçiliğinden kaynaklı ±%5 sapma olabilir.
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}