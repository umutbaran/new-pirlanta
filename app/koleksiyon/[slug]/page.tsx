import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { X } from 'lucide-react';
import { getCategories, getCatalogProducts, getSettings, type CategoryData, type Product } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import ProductFilters, { MobileFilters, SortSelect } from '@/components/ProductFilters';
import { slugify, withVisiblePrices } from '@/lib/utils';

const ALL_PRODUCTS_SLUG = 'tum-urunler';

type SearchParams = { [key: string]: string | undefined };

function parsePriceParam(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

// Sayfa başlıkları ve açıklamaları (kategori adı yeterli değilse)
const categoryConfig: Record<string, { title?: string, desc?: string }> = {
  'pirlanta': { title: 'Pırlanta Koleksiyonu', desc: 'Sonsuz aşkın ve zarafetin simgesi, ışıltısı ömür boyu sürecek pırlanta tasarımlar.' },
  'altin-22': { title: '22 Ayar Altın', desc: 'Geleneksel işçilik ve modern çizgilerle 22 ayar altın koleksiyonu.' },
  'altin-14': { title: '14 Ayar Altın', desc: 'Günlük şıklığınızı tamamlayan zarif 14 ayar altın tasarımlar.' },
  'sarrafiye': { title: 'Sarrafiye', desc: 'Çeyrek, yarım ve tam altın ile güvenli yatırım seçenekleri.' },
  'tum-urunler': { title: 'Tüm Ürünler', desc: 'Pırlantadan altına tüm koleksiyonlarımız tek bir yerde.' },
  'yeni': { title: 'Yeni Gelenler', desc: 'Koleksiyonumuza en son eklenen parçalar.' },
};

async function resolvePage(slug: string) {
  const categories = await getCategories();
  const isSpecialPage = slug === 'yeni' || slug === ALL_PRODUCTS_SLUG;
  // Özel sayfalar kategori eşleşmesinden önceliklidir; kategori aranırken önce tam slug eşleşmesi denenir
  const currentCategory: CategoryData | undefined = isSpecialPage
    ? undefined
    : categories.find(c => c.slug === slug) ?? categories.find(c => slugify(c.name) === slug);
  const config = categoryConfig[slug] || {};
  return {
    isSpecialPage,
    currentCategory,
    title: config.title || currentCategory?.name || 'Koleksiyon',
    description: config.desc || 'Özel tasarım mücevherler.',
  };
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const { slug } = await params;
  const { search } = await searchParams;
  const page = await resolvePage(slug);
  if (!page.isSpecialPage && !page.currentCategory) return { title: 'Koleksiyon Bulunamadı' };
  return {
    title: search ? `"${search}" araması` : page.title,
    description: page.description,
    // Arama sonuçları ve filtrelenmiş sayfalar arama motorlarında ayrı sayfa olarak listelenmesin
    ...(search ? { robots: { index: false, follow: true } } : {}),
  };
}

function sortProducts(products: Product[], sort?: string): Product[] {
  const byPrice = (dir: 1 | -1) => [...products].sort((a, b) => {
    // Fiyatı olmayan ("iletişime geçin") ürünler her iki yönde de sonda
    if (!a.price && !b.price) return 0;
    if (!a.price) return 1;
    if (!b.price) return -1;
    return (a.price - b.price) * dir;
  });
  if (sort === 'fiyat-artan') return byPrice(1);
  if (sort === 'fiyat-azalan') return byPrice(-1);
  return products; // Önerilen ve en yeni: veritabanından en yeniden eskiye gelir
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }) {
  const { slug } = await params;
  const { showPrices } = await getSettings();
  const query = await searchParams;
  const { search, renk, ...rest } = query;
  // Fiyatlar gizliyken fiyat filtresi ve fiyat sıralaması yok sayılır (fiyat aralığı dolaylı yoldan öğrenilemesin)
  const min = showPrices ? query.min : undefined;
  const max = showPrices ? query.max : undefined;
  const sirala = showPrices || !query.sirala?.startsWith('fiyat') ? query.sirala : undefined;
  // Eski linklerle uyumluluk için '?sub=' de kabul edilir
  const subCategory = rest.subCategory || rest.sub;

  const page = await resolvePage(slug);
  if (!page.isSpecialPage && !page.currentCategory) notFound();

  const subCategories = page.currentCategory?.subCategories || [];
  const searchQuery = search?.trim() || undefined;

  // Kategori, arama ve fiyat filtreleri veritabanında uygulanır
  const products = await getCatalogProducts({
    category: page.currentCategory?.slug,
    search: searchQuery,
    minPrice: parsePriceParam(min),
    maxPrice: parsePriceParam(max),
    limit: slug === 'yeni' ? 20 : undefined,
  });

  let filtered = products;
  // Alt kategori ve renk, ürünlerde serbest metin olarak tutulduğu için bellekte (slug karşılaştırmasıyla) filtrelenir
  if (subCategory) {
    const subQ = slugify(subCategory);
    filtered = filtered.filter(p => slugify(p.subCategory || "") === subQ);
  }
  if (renk) {
    const colorQ = slugify(renk);
    filtered = filtered.filter(p => slugify(String((p.details as Record<string, unknown>)?.renk || "")).includes(colorQ));
  }
  filtered = withVisiblePrices(sortProducts(filtered, sirala), showPrices);

  // Aktif filtre etiketleri: her biri kendi parametresi kaldırılmış bir link
  const currentParams = { search, renk, min, max, sirala, subCategory };
  const removeLink = (...keys: string[]) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(currentParams)) if (v && !keys.includes(k)) p.set(k, v);
    const qs = p.toString();
    return `/koleksiyon/${slug}${qs ? `?${qs}` : ''}`;
  };
  const subName = subCategories.find(s => s.slug === subCategory)?.name || subCategory;
  const chips = [
    searchQuery && { label: `“${searchQuery}”`, href: removeLink('search') },
    subCategory && { label: subName, href: removeLink('subCategory') },
    renk && { label: renk, href: removeLink('renk') },
    (min || max) && { label: `${min ? `${Number(min).toLocaleString('tr-TR')} ₺` : '0'} – ${max ? `${Number(max).toLocaleString('tr-TR')} ₺` : '∞'}`, href: removeLink('min', 'max') },
  ].filter(Boolean) as { label: string; href: string }[];
  const activeFilterCount = chips.length;

  return (
    <div>
      {/* Başlık */}
      <header className="bg-ivory border-b border-line">
        <div className="container-lux py-12 md:py-20 text-center">
          <nav className="eyebrow !text-[10px] text-muted mb-6" aria-label="Sayfa yolu">
            <Link href="/" className="hover:text-ink">Anasayfa</Link>
            <span className="mx-3">/</span>
            <span className="text-ink-soft">{page.title}</span>
          </nav>
          <h1 className="font-display text-[44px] md:text-6xl leading-tight text-ink">
            {searchQuery ? <>“{searchQuery}”</> : page.title}
          </h1>
          <p className="mt-4 text-ink-soft max-w-xl mx-auto">
            {searchQuery ? 'Arama sonuçları' : page.description}
          </p>
        </div>
      </header>

      <div className="container-lux py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <ProductFilters availableSubCategories={subCategories} />
          </aside>

          <div>
            {/* Araç çubuğu */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-line">
              <MobileFilters availableSubCategories={subCategories} activeCount={activeFilterCount} resultCount={filtered.length} />
              <p className="hidden lg:block text-sm text-muted">{filtered.length} ürün</p>
              <SortSelect />
            </div>

            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4">
                {chips.map(chip => (
                  <Link key={chip.label} href={chip.href} scroll={false} className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-xs text-ink hover:border-ink transition-colors">
                    {chip.label} <X className="h-3 w-3" />
                  </Link>
                ))}
                <Link href={`/koleksiyon/${slug}`} scroll={false} className="text-xs text-muted underline underline-offset-4 hover:text-ink ml-1">
                  Tümünü temizle
                </Link>
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="font-display text-3xl text-ink">
                  {activeFilterCount > 0 ? 'Aradığınız kriterlere uygun ürün bulunamadı' : 'Bu koleksiyona yakında yeni parçalar eklenecek'}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  {activeFilterCount > 0 ? 'Filtreleri değiştirmeyi veya tüm ürünlere göz atmayı deneyin.' : 'Aradığınız özel bir parça varsa bize yazın, sizin için bulalım.'}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/koleksiyon/${ALL_PRODUCTS_SLUG}`} className="btn-outline">Tüm Ürünler</Link>
                  <Link href="/iletisim" className="btn-primary">Bize Ulaşın</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
