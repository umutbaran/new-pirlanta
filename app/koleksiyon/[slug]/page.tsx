import { getCategories, getCatalogProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';

const ALL_PRODUCTS_SLUG = 'tum-urunler';

function parsePriceParam(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

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
  'tum-urunler': {
    title: 'Tüm Ürünler',
    desc: 'Pırlantadan altına tüm koleksiyonlarımız tek bir yerde.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop'
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
  const { search, renk, min, max, ...rest } = await searchParams;
  // Eski linklerle uyumluluk için '?sub=' de kabul edilir
  const subCategory = rest.subCategory || rest.sub;

  const categories = await getCategories();

  // O anki kategoriyi bul ('yeni' ve 'tum-urunler' özel sayfalardır)
  const isSpecialPage = slug === 'yeni' || slug === ALL_PRODUCTS_SLUG;
  // Özel sayfalar kategori eşleşmesinden önceliklidir; kategori aranırken önce tam slug eşleşmesi denenir
  const currentCategory = isSpecialPage
    ? undefined
    : categories.find(c => c.slug === slug) ?? categories.find(c => slugify(c.name) === slug);
  if (!isSpecialPage && !currentCategory) notFound();

  const subCategories = currentCategory?.subCategories || [];
  const searchQuery = search?.trim() || undefined;

  // Kategori, arama ve fiyat filtreleri veritabanında uygulanır
  const products = await getCatalogProducts({
    category: currentCategory?.slug,
    search: searchQuery,
    minPrice: parsePriceParam(min),
    maxPrice: parsePriceParam(max),
    limit: slug === 'yeni' ? 20 : undefined,
  });

  const config = categoryConfig[slug] || {};
  const pageTitle = searchQuery ? `"${searchQuery}" için sonuçlar` : (config.title || currentCategory?.name || 'Koleksiyon');
  const pageDesc = config.desc || 'Özel tasarım mücevherler.';
  const pageImage = config.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80';

  const hasActiveFilters = !!(searchQuery || subCategory || renk || min || max);
  let filtered = products;

  // Alt kategori ve renk, ürünlerde serbest metin olarak tutulduğu için bellekte (slug karşılaştırmasıyla) filtrelenir
  if (subCategory) {
    const subQ = slugify(subCategory);
    filtered = filtered.filter(p => slugify(p.subCategory || "") === subQ);
  }

  if (renk) {
    const colorQ = slugify(renk);
    filtered = filtered.filter(p => {
      const details = p.details as Record<string, unknown>;
      return slugify(String(details?.renk || "")).includes(colorQ);
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
                    {filtered.length} Tasarım Bulundu
                 </span>
                 {hasActiveFilters && (
                    <Link href={`/koleksiyon/${slug}`} scroll={false} className="text-xs font-bold tracking-widest uppercase text-[#D4AF37] hover:text-black transition-colors">
                       Filtreleri Temizle
                    </Link>
                 )}
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : hasActiveFilters ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                   <p className="text-xl font-serif text-gray-400 mb-2">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                   <p className="text-sm text-gray-500">Filtreleri değiştirmeyi veya <Link href={`/koleksiyon/${ALL_PRODUCTS_SLUG}`} className="underline hover:text-[#D4AF37]">tüm ürünlere</Link> göz atmayı deneyin.</p>
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                   <p className="text-xl font-serif text-gray-400 mb-2">Bu kategoride henüz ürün bulunmuyor.</p>
                   <p className="text-sm text-gray-500">Kategoriler üzerinde çalışmalarımız devam ediyor.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
