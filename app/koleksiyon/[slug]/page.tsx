import { getProducts } from '@/lib/db'; 
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

const categoryConfig: Record<string, { title: string, desc: string, image: string }> = {
  'pirlanta': {
    title: 'Pırlanta Koleksiyonu',
    desc: 'Sonsuz aşkın ve zarafetin simgesi, sertifikalı pırlantalar.',
    image: 'https://images.unsplash.com/photo-1546167889-0b4d5ff97885?q=80&w=2070'
  },
  'altin-22': {
    title: '22 Ayar Altın',
    desc: 'Yatırımın en şık hali. Geleneksel işlemeler, modern dokunuşlar.',
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2070'
  },
  'altin-14': {
    title: '14 Ayar Altın',
    desc: 'Günlük şıklığınızı tamamlayan modern altın tasarımlar.',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070'
  },
  'sarrafiye': {
    title: 'Sarrafiye & Yatırım',
    desc: 'Güvenli liman altın yatırımlarınız için doğru adres.',
    image: 'https://images.unsplash.com/photo-1610375460969-d941b7416972?q=80&w=2070'
  },
  'yeni': {
    title: 'Yeni Gelenler',
    desc: 'Sezonun en trend parçaları ve en yeni tasarımları.',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070'
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = categoryConfig[slug] || { title: 'Koleksiyon', desc: '' };
  return {
    title: `${config.title} | New Pırlanta`,
    description: config.desc,
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  
  const config = categoryConfig[slug] || { 
    title: 'Koleksiyon', 
    desc: 'Özel tasarım mücevherler.', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80' 
  };
  
  const products = await getProducts();
  
  // FİLTRELEME MANTIĞI
  let categoryProducts = products.filter(p => p.category === slug || (slug === 'yeni' && p.isNew));
  
  // 1. Alt Kategori (Yüzük, Kolye vb.)
  if (resolvedSearchParams.subCategory) {
    categoryProducts = categoryProducts.filter(p => p.subCategory === resolvedSearchParams.subCategory);
  }

  // 2. Renk (Sarı, Beyaz vb.)
  if (resolvedSearchParams.renk) {
    categoryProducts = categoryProducts.filter(p => p.details?.renk?.includes(resolvedSearchParams.renk!));
  }

  // 3. Fiyat Aralığı
  if (resolvedSearchParams.min) {
    categoryProducts = categoryProducts.filter(p => p.price >= Number(resolvedSearchParams.min));
  }
  if (resolvedSearchParams.max) {
    categoryProducts = categoryProducts.filter(p => p.price <= Number(resolvedSearchParams.max));
  }

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO HEADER */}
      <div className="relative h-[30vh] md:h-[40vh] bg-black overflow-hidden flex items-center justify-center text-center">
         <div className="absolute inset-0 opacity-60">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={config.image} alt={config.title} className="w-full h-full object-cover" />
         </div>
         <div className="relative z-20 px-4 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 md:mb-4">{config.title}</h1>
            <p className="text-gray-200 text-sm md:text-lg font-light max-w-2xl mx-auto">{config.desc}</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
           
           {/* SOL SÜTUN: FİLTRELER */}
           <aside className="md:w-64 flex-shrink-0">
              <ProductFilters />
           </aside>

           {/* SAĞ SÜTUN: ÜRÜNLER */}
           <div className="flex-1">
              
              {/* Üst Bilgi Barı */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                 <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                    {categoryProducts.length} Tasarım
                 </span>
                 <div className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer hover:text-[#D4AF37] transition-colors">
                    <span>Sıralama</span>
                    <ChevronDown className="h-4 w-4" />
                 </div>
              </div>

              {/* Ürün Listesi */}
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                   <p className="text-xl font-serif text-gray-400 mb-2">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                   <p className="text-sm text-gray-500">Filtreleri temizleyerek tekrar deneyebilirsiniz.</p>
                </div>
              )}

           </div>

        </div>
      </div>
    </div>
  );
}
