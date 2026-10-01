import { Metadata } from 'next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getBulletins, type BulletinItem } from '@/lib/db';
import { getRates, formatRate, type RatesResult } from '@/lib/gold-rates';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Piyasa Analiz',
  description: 'Güncel altın ve döviz fiyatları, ekonomik takvim ve piyasa notları.',
};

// Kurlar sunucuda en geç 5 dakikada bir yenilenir
export const revalidate = 300;

const IMPACT = {
  up: { label: 'Pozitif', icon: TrendingUp, className: 'text-[#2F7A4B]' },
  down: { label: 'Negatif', icon: TrendingDown, className: 'text-[#A23B3B]' },
  neutral: { label: 'Nötr', icon: Minus, className: 'text-muted' },
} as const;

function ChangeCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted">–</span>;
  const cls = value > 0 ? 'text-[#2F7A4B]' : value < 0 ? 'text-[#A23B3B]' : 'text-muted';
  return (
    <span className={`tabular-nums ${cls}`}>
      {value > 0 ? '▲' : value < 0 ? '▼' : '•'} %{Math.abs(value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export default async function BulletinPage() {
  const [bulletins, rates] = await Promise.all([
    getBulletins(),
    getRates().catch((): RatesResult | null => null),
  ]);
  const sortedBulletins: BulletinItem[] = [...bulletins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <PageHeader title="Piyasa Analiz" description="Güncel altın ve döviz fiyatları, ekonomik takvim ve piyasa notları." />

      <div className="container-lux py-16 md:py-24 space-y-20 md:space-y-28">
        {/* Altın & Döviz */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-ink">Altın ve Döviz</h2>
            {rates?.updatedAt && <p className="text-xs text-muted">Son güncelleme: {rates.updatedAt}</p>}
          </div>
          {rates ? (
            <div className="overflow-x-auto border-t border-ink">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-4 pr-4 eyebrow !text-[10px] text-muted font-medium">Birim</th>
                    <th className="py-4 px-4 eyebrow !text-[10px] text-muted font-medium text-right">Alış</th>
                    <th className="py-4 px-4 eyebrow !text-[10px] text-muted font-medium text-right">Satış</th>
                    <th className="py-4 pl-4 eyebrow !text-[10px] text-muted font-medium text-right">Günlük</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.rates.map(r => (
                    <tr key={r.key} className="border-b border-line">
                      <td className="py-4 pr-4 font-display text-lg text-ink">{r.name}</td>
                      <td className="py-4 px-4 text-right tabular-nums text-ink-soft">{formatRate(r.buy)} ₺</td>
                      <td className="py-4 px-4 text-right tabular-nums text-ink font-medium">{formatRate(r.sell)} ₺</td>
                      <td className="py-4 pl-4 text-right"><ChangeCell value={r.changePercent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-10 text-center text-ink-soft border-y border-line">Piyasa verileri şu anda alınamıyor. Lütfen birkaç dakika sonra tekrar deneyin.</p>
          )}
          <p className="mt-4 text-xs text-muted">Fiyatlar piyasa verileridir; mağaza alış-satış fiyatları için bizimle iletişime geçin.</p>
        </section>

        {/* Piyasa Notları */}
        <section>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-8">Piyasa Notları</h2>
          {sortedBulletins.length > 0 ? (
            <div className="grid gap-px bg-line border border-line md:grid-cols-2 xl:grid-cols-3">
              {sortedBulletins.map(item => {
                const impact = IMPACT[item.impact] || IMPACT.neutral;
                const Icon = impact.icon;
                return (
                  <article key={item.id} className="bg-white p-7 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="tabular-nums">
                        {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}{item.time && ` · ${item.time}`}
                      </span>
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
            <p className="py-10 text-center text-ink-soft border-y border-line">Henüz piyasa notu eklenmedi.</p>
          )}
        </section>

        {/* Ekonomik Takvim */}
        <section>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-8">Ekonomik Takvim</h2>
          <div className="border border-line overflow-x-auto">
            <iframe
              title="Ekonomik takvim"
              src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_economicActivity,_inflation,_centralBanks,_balance&importance=2,3&features=datepicker,timezone,timeselector,filters&countries=5,17,4,37,72,22,39,10,35,56,63&calType=day&timeZone=63&lang=10"
              loading="lazy"
              className="block w-full min-w-[640px] h-[600px] border-0"
            />
          </div>
          <p className="mt-4 text-xs text-muted">Takvim verileri Investing.com tarafından sağlanmaktadır. Buradaki bilgiler yatırım tavsiyesi değildir.</p>
        </section>
      </div>
    </div>
  );
}
