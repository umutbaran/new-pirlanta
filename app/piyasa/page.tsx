import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getBulletins, type BulletinItem } from '@/lib/db';
import { getRates, type RatesResult } from '@/lib/gold-rates';
import { MarketDataProvider } from '@/components/market/MarketDataProvider';
import KeyStats from '@/components/market/KeyStats';
import LiveRates from '@/components/market/LiveRates';
import GoldCalculator from '@/components/market/GoldCalculator';
import { MarketChart, EconomicCalendar } from '@/components/market/TradingViewWidgets';
import MarketUpdatedAt from '@/components/market/MarketUpdatedAt';

export const metadata: Metadata = {
  title: 'Canlı Altın ve Döviz Piyasası',
  description: 'Gram, çeyrek, cumhuriyet altını ve döviz kurları; canlı grafikler, altın hesaplama aracı ve ekonomik takvim.',
};

// Sunucuda hazırlanan fiyatlar en geç 5 dakikada bir yenilenir; sayfa açıkken istemci de dakikada bir günceller
export const revalidate = 300;

const SECTIONS = [
  { id: 'fiyatlar', label: 'Fiyatlar' },
  { id: 'grafik', label: 'Grafik' },
  { id: 'hesaplayici', label: 'Hesaplayıcı' },
  { id: 'takvim', label: 'Ekonomik Takvim' },
  { id: 'notlar', label: 'Piyasa Notları' },
];

const IMPACT = {
  up: { label: 'Pozitif', icon: TrendingUp, className: 'text-[#2F7A4B]' },
  down: { label: 'Negatif', icon: TrendingDown, className: 'text-[#A23B3B]' },
  neutral: { label: 'Nötr', icon: Minus, className: 'text-muted' },
} as const;

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8 md:mb-10 max-w-2xl">
      <p className="eyebrow text-gold-deep mb-3">{eyebrow}</p>
      <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">{title}</h2>
      {description && <p className="mt-3 text-ink-soft leading-relaxed">{description}</p>}
    </div>
  );
}

export default async function MarketPage() {
  const [rates, bulletins] = await Promise.all([
    getRates().catch((): RatesResult | null => null),
    getBulletins(),
  ]);
  const notes: BulletinItem[] = [...bulletins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <MarketDataProvider initial={rates}>
      {/* Başlık: öne çıkan göstergeler */}
      <header className="bg-ink text-white">
        <div className="container-lux pt-12 pb-10 md:pt-20 md:pb-14">
          <nav className="eyebrow !text-[10px] text-white/50 mb-6" aria-label="Sayfa yolu">
            <Link href="/" className="hover:text-white">Anasayfa</Link><span className="mx-3">/</span><span className="text-white/80">Piyasa</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <p className="eyebrow text-gold mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-[#9CC9A8] opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#9CC9A8]" /></span>
                Canlı Piyasa
              </p>
              <h1 className="font-display text-[44px] md:text-7xl leading-[1.05]">Altın & Döviz</h1>
              <p className="mt-4 text-white/60 max-w-xl leading-relaxed">
                Güncel altın ve döviz fiyatlarını takip edin, grafiklerle trendi görün, birikiminizin değerini hesaplayın.
              </p>
            </div>
            <MarketUpdatedAt />
          </div>
          <KeyStats />
        </div>
      </header>

      {/* Sayfa içi gezinme */}
      <nav className="sticky top-16 lg:top-[117px] z-30 bg-white/95 backdrop-blur border-b border-line" aria-label="Piyasa bölümleri">
        <div className="container-lux flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} className="py-4 eyebrow !text-[10px] text-ink-soft hover:text-ink whitespace-nowrap">{s.label}</a>
          ))}
        </div>
      </nav>

      <div className="container-lux">
        {/* Fiyatlar + Hesaplayıcı */}
        <section id="fiyatlar" className="scroll-mt-40 pt-16 md:pt-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <SectionTitle eyebrow="Fiyatlar" title="Güncel Piyasa" description="Alış ve satış fiyatları ile günlük değişim. Sayfa açıkken fiyatlar otomatik güncellenir." />
            <LiveRates />
          </div>
          <aside id="hesaplayici" className="lg:col-span-4 lg:sticky lg:top-[190px] scroll-mt-40">
            <p className="eyebrow text-gold-deep mb-3">Hesaplayıcı</p>
            <h2 className="font-display text-3xl text-ink mb-6">Altın Hesaplama</h2>
            <GoldCalculator />
          </aside>
        </section>

        {/* Grafik */}
        <section id="grafik" className="scroll-mt-40 pt-20 md:pt-28">
          <SectionTitle eyebrow="Grafik" title="Fiyat Hareketleri" description="Gram altın, ons, dolar ve euronun zaman içindeki seyrini inceleyin; üstteki araçlarla zaman aralığını değiştirebilirsiniz." />
          <MarketChart />
        </section>

        {/* Ekonomik takvim */}
        <section id="takvim" className="scroll-mt-40 pt-20 md:pt-28">
          <SectionTitle eyebrow="Takvim" title="Ekonomik Takvim" description="Faiz kararları, enflasyon ve istihdam verileri gibi altın ve kur fiyatlarını etkileyebilecek önemli gelişmeler." />
          <EconomicCalendar />
        </section>

        {/* Piyasa notları */}
        <section id="notlar" className="scroll-mt-40 pt-20 md:pt-28">
          <SectionTitle eyebrow="Notlar" title="Piyasa Notları" description="Uzmanlarımızın öne çıkan gelişmelere dair kısa değerlendirmeleri." />
          {notes.length > 0 ? (
            <div className="grid gap-px bg-line border border-line md:grid-cols-2 xl:grid-cols-3">
              {notes.map(item => {
                const impact = IMPACT[item.impact] || IMPACT.neutral;
                const Icon = impact.icon;
                return (
                  <article key={item.id} className="bg-white p-7 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="tabular-nums">{new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}{item.time && ` · ${item.time}`}</span>
                      <span>{item.country}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl leading-snug text-ink">{item.event}</h3>
                    {item.description && <p className="mt-3 text-sm text-ink-soft leading-relaxed line-clamp-5">{item.description}</p>}
                    <div className="mt-auto pt-6 flex items-center justify-between text-xs">
                      <span className="text-muted">Önem: <span className="text-gold tracking-widest">{'●'.repeat(item.importance)}<span className="text-line">{'●'.repeat(3 - item.importance)}</span></span></span>
                      <span className={`flex items-center gap-1.5 ${impact.className}`}><Icon className="h-3.5 w-3.5" /> {impact.label}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="py-10 text-center text-ink-soft border-y border-line">Yakında piyasa notları burada yayınlanacak.</p>
          )}
        </section>

        <p className="py-16 md:py-24 text-xs text-muted leading-relaxed max-w-3xl">
          <strong className="text-ink-soft font-medium">Yasal uyarı:</strong> Bu sayfadaki fiyatlar, grafikler ve notlar yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
          Fiyatlar piyasa kaynaklarından alınır, gecikmeli olabilir ve mağaza alış-satış fiyatlarından farklılık gösterebilir. Yatırım kararlarınızı kendi araştırmanıza ve gerekirse yetkili kurumların danışmanlığına dayandırın.
        </p>
      </div>
    </MarketDataProvider>
  );
}
