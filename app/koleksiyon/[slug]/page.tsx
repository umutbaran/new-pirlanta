import { getProducts, getCategories } from '@/lib/db'; 
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Image from 'next/image';
import { slugify } from '@/lib/utils';

// Statik konfigürasyon (resimler ve açıklamalar için)
const categoryConfig: Record<string, { title?: string, desc?: string, image?: string }> = {
  'pirlanta': {
    title: 'Pırlanta Koleksiyonu',
    desc: 'Sonsuz aşkın ve zarafetin simgesi, sertifikalı pırlantalar.',
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e98f6d654?q=80&w=2070&auto=format&fit=crop'
  },
  'altin-22': {
    title: '22 Ayar Altın',
    desc: 'Yatırımın en şık hali. Geleneksel işlemeler, modern dokunuşlar.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'
  },
  'altin-14': {
    title: '14 Ayar Altın',
    desc: 'Günlük şıklığınızı tamamlayan modern altın tasarımlar.',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop'
  },
  'sarrafiye': {
    title: 'Sarrafiye & Yatırım',
    desc: 'Güvenli liman altın yatırımlarınız için doğru adres.',
    image: 'https://images.unsplash.com/photo-1610375460969-d941b7416972?q=80&w=2070&auto=format&fit=crop'
  },
  'yeni': {
    title: 'Yeni Gelenler',
    desc: 'Sezonun en trend parçaları ve en yeni tasarımları.',
    image: 'https://images.unsplash.com/photo-1573408301145-b98c414a0d92?q=80&w=2070&auto=format&fit=crop'
  }
};

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  
  const products = await getProducts();
  const categories = await getCategories();

  // O anki kategoriyi bul
  const currentCategory = categories.find(c => c.slug === slug || slugify(c.name) === slug);
  const subCategories = currentCategory?.subCategories || [];
  
  // Başlık ve resim belirleme
  const config = categoryConfig[slug] || {};
  const pageTitle = config.title || currentCategory?.name || 'Koleksiyon';
  const pageDesc = config.desc || 'Özel tasarım mücevherler.';
  const pageImage = config.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80';
  
  // --- FİLTRELEME MANTIĞI ---
  let filtered = products.filter(p => {
    // Kategori eşleşmesi (Slug üzerinden)
    const pSlug = slugify(p.category);
    const isMainCat = pSlug === slug;
    const isYeni = slug === 'yeni' && p.isNew;
    return isMainCat || isYeni;
  });
  
  // Alt Kategori Filtresi
  if (resolvedSearchParams.subCategory) {
    const subSlug = resolvedSearchParams.subCategory;
    filtered = filtered.filter(p => slugify(p.subCategory || "") === subSlug);
  }

  // Renk Filtresi
  if (resolvedSearchParams.renk) {
    const colorQ = resolvedSearchParams.renk.toLowerCase();
    filtered = filtered.filter(p => {
      const details = p.details as Record<string, unknown>;
      return String(details?.renk || "").toLowerCase().includes(colorQ);
    });
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[30vh] md:h-[40vh] bg-black overflow-hidden flex items-center justify-center text-center">
         <div className="absolute inset-0 opacity-60">
            <Image src={pageImage} alt={pageTitle} fill priority className="object-cover" />
         </div>
         <div className="relative z-20 px-4 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 md:mb-4">{pageTitle}</h1>
            <p className="text-gray-200 text-sm md:text-lg font-light max-w-2xl mx-auto">{pageDesc}</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
           <aside className="md:w-64 flex-shrink-0">
              <ProductFilters availableSubCategories={subCategories} />
           </aside>

           <div className="flex-1">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                 <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                    {filtered.length} Tasarım
                 </span>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                   <p className="text-xl font-serif text-gray-400">Ürün bulunamadı.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
