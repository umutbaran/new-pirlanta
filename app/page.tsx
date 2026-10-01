import Link from "next/link";
import { ArrowRight, Phone, MapPin, MessageCircle, Calculator } from "lucide-react";
import { getProducts, getUiConfig, getProductsByIds, getSettings, getCategories, type Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import SmartImage from "@/components/SmartImage";
import { telHref, whatsappLink } from "@/lib/utils";
import { getRates, type RatesResult } from "@/lib/gold-rates";
import { MarketDataProvider } from "@/components/market/MarketDataProvider";
import KeyStats from "@/components/market/KeyStats";
import { MiniChart } from "@/components/market/TradingViewWidgets";

// Ana sayfadaki piyasa özeti için fiyatlar en geç 5 dakikada bir yenilenir
export const revalidate = 300;

function SectionHeading({ eyebrow, title, description, align = 'center' }: { eyebrow?: string; title: string; description?: string; align?: 'center' | 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'}>
      {eyebrow && <p className="eyebrow text-gold-deep mb-4">{eyebrow}</p>}
      <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">{title}</h2>
      {description && <p className="mt-4 text-ink-soft leading-relaxed">{description}</p>}
    </div>
  );
}

const isRealLink = (link?: string) => !!link && link.trim() !== '#';

export default async function Home() {
  const [uiConfig, settings, categories, rates] = await Promise.all([
    getUiConfig(), getSettings(), getCategories(),
    getRates().catch((): RatesResult | null => null),
  ]);

  // Vitrin: admin panelinde seçilen ürünler; seçim yoksa en yeni 8 ürün
  let showcaseProducts: Product[] = [];
  if (uiConfig.showcase.productIds?.length) {
    const selected = await getProductsByIds(uiConfig.showcase.productIds);
    // Admin panelindeki sıralamayı koru
    showcaseProducts = uiConfig.showcase.productIds.map(id => selected.find(p => p.id === id)).filter((p): p is Product => !!p);
  }
  if (showcaseProducts.length === 0) showcaseProducts = await getProducts(8);

  const { collectionMosaic, infoCenter, showcase, storeSection } = uiConfig;
  const collections = categories.filter(c => c.isActive && !c.isSpecial);
  const stores = storeSection?.stores || [];

  return (
    <>
      <HeroSlider slides={uiConfig.heroSlides} />

      {/* CANLI PİYASA ÖZETİ */}
      <MarketDataProvider initial={rates}>
        <section className="py-16 md:py-24 bg-ivory border-b border-line">
          <div className="container-lux grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-4">
              <p className="eyebrow text-gold-deep mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2" aria-hidden><span className="absolute inline-flex h-full w-full rounded-full bg-[#2F7A4B] opacity-50 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#2F7A4B]" /></span>
                Canlı Piyasa
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-ink">Altını ve kurları anlık takip edin</h2>
              <p className="mt-5 text-ink-soft leading-relaxed">
                Gram, çeyrek, cumhuriyet altını ve döviz fiyatları; grafikler, ekonomik takvim ve altın hesaplama aracı tek bir yerde.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/piyasa" className="btn-primary">Piyasayı İncele <ArrowRight className="h-4 w-4" strokeWidth={1.4} /></Link>
                <Link href="/piyasa#hesaplayici" className="btn-outline"><Calculator className="h-4 w-4" strokeWidth={1.4} /> Altın Hesapla</Link>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-px">
              <KeyStats tone="light" keys={['GRAM', 'CEYREK', 'USD', 'EUR']} />
              <div className="bg-white border border-line p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="eyebrow !text-[10px] text-muted">Gram Altın · Son 1 Ay</p>
                  <Link href="/piyasa#grafik" className="text-xs text-ink-soft hover:text-ink">Detaylı grafik →</Link>
                </div>
                <MiniChart />
              </div>
            </div>
          </div>
        </section>
      </MarketDataProvider>

      {/* KOLEKSİYONLAR */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <SectionHeading eyebrow="Koleksiyonlar" title={collectionMosaic.mainTitle} description={collectionMosaic.description} />

          {collectionMosaic.items.length > 0 && (
            <div className="mt-12 md:mt-16 grid gap-4 md:gap-6 md:grid-cols-2">
              {collectionMosaic.items.slice(0, 2).map((item, idx) => (
                <Link key={idx} href={item.link || '/koleksiyon/tum-urunler'} className="group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-ivory">
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 text-white">
                    {item.subtitle && <p className="eyebrow text-white/75 mb-3">{item.subtitle}</p>}
                    <h3 className="font-display text-3xl md:text-[42px] leading-tight">{item.title}</h3>
                    <span className="link-underline mt-5 text-white">
                      {item.buttonText || 'Keşfet'} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {collections.length > 0 && (
            <nav className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3" aria-label="Tüm koleksiyonlar">
              {collections.map(c => (
                <Link key={c.id} href={`/koleksiyon/${c.slug}`} className="text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors">
                  {c.name}
                </Link>
              ))}
              <Link href="/koleksiyon/tum-urunler" className="text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors">Tüm Ürünler</Link>
            </nav>
          )}
        </div>
      </section>

      {/* SEÇKİN PARÇALAR */}
      {showcaseProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-ivory">
          <div className="container-lux">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <SectionHeading eyebrow="Vitrin" title={showcase.title || 'Seçkin Parçalar'} description={showcase.description} align="left" />
              <Link href="/koleksiyon/tum-urunler" className="link-underline text-ink self-start md:self-auto">
                Tüm Ürünler <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {showcaseProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KİŞİSEL DANIŞMANLIK */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto text-center">
            <span className="mx-auto block h-12 w-px bg-gold mb-8" aria-hidden />
            <p className="eyebrow text-gold-deep mb-5">Kişisel Danışmanlık</p>
            <h2 className="font-display text-4xl md:text-[52px] leading-tight text-ink">
              Size özel parçayı birlikte seçelim
            </h2>
            <p className="mt-6 text-ink-soft leading-relaxed max-w-xl mx-auto">
              Fiyat bilgisi, ölçü, özel tasarım veya mağaza randevusu için uzman ekibimize WhatsApp ya da telefonla hemen ulaşabilirsiniz.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={whatsappLink(settings.whatsappNumber, 'Merhaba, ürünleriniz hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp ile Yazın
              </a>
              {settings.phoneNumber && (
                <a href={telHref(settings.phoneNumber)} className="btn-outline">
                  <Phone className="h-4 w-4" strokeWidth={1.4} /> {settings.phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* REHBERLER */}
      {infoCenter.cards.length > 0 && (
        <section className="py-20 md:py-28 border-t border-line">
          <div className="container-lux">
            <SectionHeading eyebrow={infoCenter.subtitle} title={infoCenter.title} />
            <div className="mt-12 md:mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
              {infoCenter.cards.map((card, idx) => {
                const content = (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
                      <SmartImage src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-ink">{card.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">{card.description}</p>
                    {isRealLink(card.link) && card.buttonText && (
                      <span className="link-underline mt-4 text-ink">{card.buttonText} <ArrowRight className="h-3.5 w-3.5" /></span>
                    )}
                  </>
                );
                return isRealLink(card.link)
                  ? <Link key={idx} href={card.link} className="group block">{content}</Link>
                  : <div key={idx} className="group">{content}</div>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* MAĞAZALAR */}
      {stores.length > 0 && (
        <section className="py-20 md:py-28 bg-ivory">
          <div className="container-lux">
            <SectionHeading eyebrow={storeSection.subtitle} title={storeSection.title} />
            <div className="mt-12 md:mt-16 grid gap-px bg-line md:grid-cols-2 border border-line">
              {stores.map(store => (
                <div key={store.id} className="bg-white p-8 md:p-12">
                  {store.badge && <p className="eyebrow text-gold-deep mb-3">{store.badge}</p>}
                  <h3 className="font-display text-3xl text-ink">{store.title}</h3>
                  <div className="mt-6 space-y-3 text-sm text-ink-soft">
                    {store.address && (
                      <p className="flex gap-3"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" strokeWidth={1.4} /><span className="whitespace-pre-line">{store.address}</span></p>
                    )}
                    {store.phone && (
                      <a href={telHref(store.phone)} className="flex gap-3 hover:text-ink transition-colors"><Phone className="h-4 w-4 text-gold shrink-0" strokeWidth={1.4} />{store.phone}</a>
                    )}
                  </div>
                  <div className="mt-8 flex gap-6">
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(`${store.title} ${store.address}`)}`} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
                      Yol Tarifi
                    </a>
                    <Link href="/subelerimiz" className="link-underline text-ink-soft">Çalışma Saatleri</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
