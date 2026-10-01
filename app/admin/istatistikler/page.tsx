import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageCircle, Phone, Search, Package, ExternalLink } from 'lucide-react';
import { getAnalyticsSummary } from '@/lib/db';

// İstatistikler her açılışta güncel olmalı
export const dynamic = 'force-dynamic';

const PERIODS = [7, 30, 90];

const PAGE_LABELS: Record<string, string> = {
  '/': 'Ana sayfa',
  '/iletisim': 'İletişim',
  '/iletisim (form)': 'İletişim formu',
  '/subelerimiz': 'Mağazalarımız',
  '/favoriler': 'Favoriler',
  '/hakkimizda': 'Hakkımızda',
};

function pageLabel(path: string) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith('/urun/')) return 'Ürün sayfası';
  if (path.startsWith('/koleksiyon/')) return `Koleksiyon: ${path.replace('/koleksiyon/', '')}`;
  return path;
}

function formatPercent(part: number, whole: number) {
  if (!whole) return '-';
  return `%${((part / whole) * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;
}

export default async function StatisticsPage({ searchParams }: { searchParams: Promise<{ gun?: string }> }) {
  const { gun } = await searchParams;
  const days = PERIODS.includes(Number(gun)) ? Number(gun) : 30;
  const stats = await getAnalyticsSummary(days);
  const { totals } = stats;

  const tiles = [
    { label: 'Ürün Görüntüleme', value: totals.product_view, icon: Eye },
    { label: 'WhatsApp Tıklaması', value: totals.whatsapp_click, icon: MessageCircle },
    { label: 'Telefon Tıklaması', value: totals.phone_click, icon: Phone },
    { label: 'Arama', value: totals.search, icon: Search },
  ];
  const isEmpty = Object.values(totals).every(v => v === 0);

  return (
    <div className="space-y-8">
      {/* Başlık ve dönem seçimi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İstatistikler</h1>
          <p className="text-gray-500 mt-1 text-sm">Ziyaretçilerin hangi ürünlere ilgi gösterdiği ve sizinle ne kadar iletişime geçtiği.</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm" role="group" aria-label="Dönem">
          {PERIODS.map(p => (
            <Link
              key={p}
              href={`/admin/istatistikler?gun=${p}`}
              aria-current={p === days ? 'page' : undefined}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${p === days ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Son {p} gün
            </Link>
          ))}
        </div>
      </div>

      {isEmpty && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
          Bu dönemde henüz kayıt yok. İstatistikler, site yayına alındıktan sonra ziyaretçi hareketleriyle dolmaya başlar.
          Kendi gezintileriniz (admin girişi açıkken) sayılmaz.
        </div>
      )}

      {/* Özet kutucukları */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {tiles.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2">
              <Icon className="h-4 w-4" /> {label}
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{value.toLocaleString('tr-TR')}</p>
          </div>
        ))}
        <div className="bg-slate-900 p-5 rounded-xl shadow-sm col-span-2 lg:col-span-1">
          <p className="text-slate-400 text-xs font-medium mb-2">İletişime Dönüşme Oranı</p>
          <p className="text-2xl font-bold text-white tabular-nums">{formatPercent(totals.whatsapp_click + totals.phone_click, totals.product_view)}</p>
          <p className="text-slate-500 text-[11px] mt-1">(WhatsApp + telefon) / ürün görüntüleme</p>
        </div>
      </div>

      {/* Günlük grafikler: iki ölçü farklı ölçekte olduğu için ayrı grafiklerde */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DailyChart title="Günlük ürün görüntüleme" color="#A8861A" data={stats.daily.map(d => ({ date: d.date, value: d.views }))} />
        <DailyChart title="Günlük WhatsApp tıklaması" color="#15803D" data={stats.daily.map(d => ({ date: d.date, value: d.whatsappClicks }))} />
      </div>

      {/* En çok ilgi gören ürünler */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">En Çok İlgi Gören Ürünler</h2>
          <p className="text-xs text-gray-500 mt-0.5">WhatsApp tıklamasına göre sıralı. Talep ölçümünün en önemli göstergesi.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Ürün</th>
                <th className="px-6 py-3 font-medium text-right">Görüntüleme</th>
                <th className="px-6 py-3 font-medium text-right">WhatsApp</th>
                <th className="px-6 py-3 font-medium text-right">Dönüşüm</th>
                <th className="px-6 py-3"><span className="sr-only">Mağazada gör</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.topProducts.map(({ product, views, whatsappClicks }) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.images[0]
                          ? <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />
                          : <Package className="h-4 w-4 text-gray-400 m-3" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${product.id}`} className="font-medium text-gray-900 hover:text-[#A8861A] line-clamp-1">{product.name}</Link>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums">{views.toLocaleString('tr-TR')}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold">{whatsappClicks.toLocaleString('tr-TR')}</td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-500">{formatPercent(whatsappClicks, views)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/urun/${product.id}`} target="_blank" className="text-gray-400 hover:text-gray-900" title="Mağazada gör">
                      <ExternalLink className="h-4 w-4 inline" />
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.topProducts.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Bu dönemde ürün etkileşimi yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RankList
          title="En Çok Aranan Kelimeler"
          subtitle="Ziyaretçilerin aradığı ama katalogda olmayan ürünler için fikir verir."
          rows={stats.topSearches.map(s => ({ label: s.query, count: s.count, href: `/koleksiyon/tum-urunler?search=${encodeURIComponent(s.query)}` }))}
          empty="Henüz arama yapılmadı."
        />
        <RankList
          title="WhatsApp Tıklamalarının Kaynağı"
          subtitle="Ziyaretçilerin hangi sayfadan WhatsApp'a geçtiği."
          rows={stats.whatsappSources.map(s => ({ label: pageLabel(s.page), count: s.count }))}
          empty="Henüz WhatsApp tıklaması yok."
        />
      </div>

      <p className="text-xs text-gray-400">
        Ziyaretçi sayısı, trafik kaynakları (Google, Instagram vb.), şehir ve cihaz bilgisi için Vercel panelindeki <strong>Analytics</strong> sekmesini kullanın.
        Buradaki kayıtlar anonimdir; IP veya kişisel bilgi tutulmaz. Botlar ve admin gezintileri sayılmaz.
      </p>
    </div>
  );
}

function DailyChart({ title, color, data }: { title: string; color: string; data: { date: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const fmt = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
        <span className="text-xs text-gray-500 tabular-nums">Toplam {total.toLocaleString('tr-TR')} · En yüksek {max === 1 && total === 0 ? 0 : max}</span>
      </div>
      {/* Her çubuk, üzerine gelince tarih ve değeri gösteren geniş bir tıklama alanı içinde */}
      <div className="h-40 flex items-end gap-[2px] border-b border-gray-200" role="img" aria-label={`${title}: toplam ${total}`}>
        {data.map(d => (
          <div key={d.date} className="group relative flex-1 h-full flex items-end" title={`${fmt(d.date)}: ${d.value}`}>
            <div
              className="w-full rounded-t-[4px] transition-opacity group-hover:opacity-80"
              style={{ height: d.value ? `${Math.max((d.value / max) * 100, 2)}%` : '0', backgroundColor: color }}
            />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] text-white z-10">
              {fmt(d.date)}: <strong>{d.value}</strong>
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 mt-2">
        <span>{fmt(data[0]?.date)}</span>
        <span>{fmt(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

function RankList({ title, subtitle, rows, empty }: {
  title: string; subtitle: string; empty: string;
  rows: { label: string; count: number; href?: string }[];
}) {
  const max = Math.max(...rows.map(r => r.count), 1);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-500 mt-0.5 mb-4">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(r => (
            <li key={r.label}>
              <div className="flex justify-between text-sm mb-1">
                {r.href
                  ? <Link href={r.href} target="_blank" className="text-gray-700 hover:text-[#A8861A] truncate">{r.label}</Link>
                  : <span className="text-gray-700 truncate">{r.label}</span>}
                <span className="text-gray-900 font-medium tabular-nums ml-3">{r.count.toLocaleString('tr-TR')}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-slate-400" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
