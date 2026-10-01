import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MapPin, MessageCircle, ChevronDown, Gem, Store } from 'lucide-react';
import { getProductById, getSettings, getCategories, getCatalogProducts } from '@/lib/db';
import ProductGallery from '@/components/ProductGallery';
import ProductCard, { formatPrice } from '@/components/ProductCard';
import FavoriteButton from '@/components/FavoriteButton';
import ShareButton from '@/components/ShareButton';
import { TrackProductView } from '@/components/AnalyticsTracker';
import { whatsappLink, telHref } from '@/lib/utils';

// Aynı istek içinde metadata ve sayfa için ürünü bir kez çek
const getProduct = cache(getProductById);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newpirlanta.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Ürün Bulunamadı' };
  return {
    title: product.name, // Marka adı layout'taki title şablonuyla eklenir
    description: product.description || `${product.name} - New Pırlanta mücevher koleksiyonu.`,
    alternates: { canonical: `/urun/${product.id}` },
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex items-center justify-between py-5 cursor-pointer list-none eyebrow text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-muted transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm text-ink-soft leading-relaxed">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, settings, categories] = await Promise.all([getProduct(id), getSettings(), getCategories()]);
  if (!product) notFound();

  const related = (await getCatalogProducts({ category: product.category, limit: 5 })).filter(p => p.id !== product.id).slice(0, 4);

  const categoryName = categories.find(c => c.slug === product.category)?.name || product.category.replace(/-/g, ' ');
  const whatsappUrl = whatsappLink(settings.whatsappNumber, `Merhaba, "${product.name}"${product.sku ? ` (${product.sku})` : ''} hakkında bilgi almak istiyorum.`);
  const hasPrice = product.price > 0;
  const hasDiscount = hasPrice && !!product.oldPrice && product.oldPrice > product.price;

  const details = (product.details || {}) as Record<string, unknown>;
  const tasBilgisi = details.tas_bilgisi as Record<string, string> | undefined;
  const specs = [
    { label: "Stok Kodu", value: product.sku },
    { label: "Ürün Tipi", value: product.subCategory },
    { label: "Materyal", value: details.materyal as string },
    { label: "Renk", value: details.renk as string },
    { label: "Ağırlık", value: details.agirlik as string },
    { label: "Sertifika", value: details.sertifika as string },
    ...(tasBilgisi ? [
      { label: "Karat", value: tasBilgisi.karat },
      { label: "Berraklık", value: tasBilgisi.berraklik }
    ] : []),
  ].filter(spec => spec.value);

  // Google için yapılandırılmış ürün verisi (arama sonuçlarında fiyat/görsel gösterimi)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: product.images.length ? product.images : undefined,
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: 'New Pırlanta' },
    category: categoryName,
    ...(hasPrice ? {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TRY',
        url: `${siteUrl}/urun/${product.id}`,
        seller: { '@type': 'Organization', name: 'Baran Kuyumculuk' },
      },
    } : {}),
  };

  return (
    <div data-product-id={product.id} className="pb-24 lg:pb-0">
      <TrackProductView productId={product.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="container-lux pt-4 lg:pt-8">
        <nav className="eyebrow !text-[10px] text-muted mb-4 lg:mb-8" aria-label="Sayfa yolu">
          <Link href="/" className="hover:text-ink">Anasayfa</Link>
          <span className="mx-3">/</span>
          <Link href={`/koleksiyon/${product.category}`} className="hover:text-ink">{categoryName}</Link>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Galeri */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Ürün bilgileri */}
          <div className="lg:col-span-5 lg:sticky lg:top-[150px]">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow text-gold-deep">{categoryName}</p>
              <ShareButton title={product.name} />
            </div>
            <h1 className="mt-3 font-display text-[38px] md:text-5xl leading-[1.1] text-ink">{product.name}</h1>
            {product.sku && <p className="mt-3 text-xs text-muted tracking-wide">Stok Kodu: {product.sku}</p>}

            <div className="mt-8 pb-8 border-b border-line">
              {hasPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl text-ink tabular-nums">{formatPrice(product.price)}</span>
                  {hasDiscount && <span className="text-muted line-through tabular-nums">{formatPrice(product.oldPrice!)}</span>}
                </div>
              ) : (
                <p className="text-lg text-ink">Fiyat bilgisi için bizimle iletişime geçin</p>
              )}
              <p className="mt-2 text-xs text-muted">Güncel fiyat ve stok durumu için danışmanlarımıza ulaşabilirsiniz.</p>
            </div>

            {product.description && (
              <p className="mt-8 text-ink-soft leading-relaxed whitespace-pre-line">{product.description}</p>
            )}

            <div className="mt-8 space-y-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full !min-h-[52px]">
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp ile Bilgi Al
              </a>
              <div className="flex gap-3">
                <a href={telHref(settings.phoneNumber)} className="btn-outline flex-1">
                  <Phone className="h-4 w-4" strokeWidth={1.4} /> Hemen Ara
                </a>
                <FavoriteButton product={product} />
              </div>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-4 text-xs text-ink-soft">
              <li className="flex items-center gap-3"><Store className="h-5 w-5 text-gold shrink-0" strokeWidth={1.2} /> Mağazada yakından inceleme</li>
              <li className="flex items-center gap-3"><Gem className="h-5 w-5 text-gold shrink-0" strokeWidth={1.2} /> Ölçü ve tasarım danışmanlığı</li>
            </ul>

            <div className="mt-8 border-t border-line">
              {specs.length > 0 && (
                <Disclosure title="Ürün Özellikleri" defaultOpen>
                  <dl className="divide-y divide-line">
                    {specs.map(spec => (
                      <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-muted">{spec.label}</dt>
                        <dd className="text-ink text-right">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Disclosure>
              )}
              <Disclosure title="Mağazada İnceleyin">
                <p>Bu ürünü mağazalarımızda yakından görebilir, deneyebilir ve uzmanlarımızdan bilgi alabilirsiniz. Ziyaretinizden önce ürünün hazır olduğundan emin olmak için bize WhatsApp&apos;tan yazmanızı öneririz.</p>
                <Link href="/subelerimiz" className="link-underline mt-4 text-ink"><MapPin className="h-3.5 w-3.5" /> Mağazalarımız</Link>
              </Disclosure>
              <Disclosure title="Bakım Önerileri">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Parfüm, krem ve kimyasallarla temasından kaçının; takıyı en son takıp ilk çıkarın.</li>
                  <li>Her parçayı çizilmemesi için ayrı bir kutu veya kese içinde saklayın.</li>
                  <li>Ilık su ve yumuşak bir fırçayla nazikçe temizleyip yumuşak bir bezle kurulayın.</li>
                  <li>Taşlı ürünlerde tırnak kontrolü için yılda bir mağazamıza uğrayabilirsiniz.</li>
                </ul>
              </Disclosure>
            </div>
          </div>
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28 py-16 md:py-24 bg-ivory">
          <div className="container-lux">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl md:text-4xl text-ink">Bunları da beğenebilirsiniz</h2>
              <Link href={`/koleksiyon/${product.category}`} className="link-underline text-ink shrink-0">Tümünü Gör</Link>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobil: sabit iletişim çubuğu */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-line px-5 py-3 flex items-center gap-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted truncate">{product.name}</p>
          <p className="text-sm text-ink tabular-nums">{hasPrice ? formatPrice(product.price) : 'Fiyat için yazın'}</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !min-h-11 !px-5 shrink-0">
          <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
