import Link from 'next/link';
import Image from 'next/image';
import { Package, Eye, MessageCircle, TrendingUp, Plus, ExternalLink, AlertTriangle, CheckCircle2, ArrowRight, EyeOff } from 'lucide-react';
import { getProducts, getCategories, getSettings, getAnalyticsSummary } from '@/lib/db';

// Panel her açılışta güncel veriyi göstermeli (build anında dondurulmamalı)
export const dynamic = 'force-dynamic';

function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: React.ElementType }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-line">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Icon className="h-4 w-4" strokeWidth={1.6} /> {label}
      </div>
      <p className="mt-3 text-3xl font-light text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function Dashboard() {
  const [products, categories, settings, stats] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
    getAnalyticsSummary(7).catch(() => null),
  ]);

  const withoutImage = products.filter(p => !p.images?.length);
  const withoutPrice = products.filter(p => !(p.price > 0));
  const hiddenCategorySlugs = new Set(categories.filter(c => !c.isActive).map(c => c.slug));
  const inHiddenCategory = products.filter(p => hiddenCategorySlugs.has(p.category));
  const categoryName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug;
  const latest = products.slice(0, 6); // getProducts en yeniden eskiye sıralı

  const views = stats?.totals.product_view ?? 0;
  const whatsapp = stats?.totals.whatsapp_click ?? 0;
  const contacts = whatsapp + (stats?.totals.phone_click ?? 0);
  const conversion = views ? `%${((contacts / views) * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}` : '–';

  // Dikkat gerektiren işler: her biri ilgili sayfaya yönlendirir
  const tasks = [
    withoutImage.length > 0 && { text: `${withoutImage.length} ürünün görseli yok`, href: '/admin/products', tone: 'warn' as const },
    inHiddenCategory.length > 0 && { text: `${inHiddenCategory.length} ürün gizli bir kategoride (sitede kategori menüsünde görünmüyor)`, href: '/admin/categories', tone: 'warn' as const },
    withoutPrice.length > 0 && { text: `${withoutPrice.length} ürünün fiyatı girilmemiş`, href: '/admin/products', tone: 'info' as const },
    { text: settings.showPrices ? 'Fiyatlar sitede görünüyor' : 'Fiyatlar sitede gizli (ziyaretçiler iletişime yönlendiriliyor)', href: '/admin/settings', tone: 'info' as const },
  ].filter(Boolean) as { text: string; href: string; tone: 'warn' | 'info' }[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Genel Bakış</h1>
          <p className="text-sm text-muted mt-1">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="px-4 py-2.5 border border-line bg-white rounded-lg text-sm text-ink hover:border-ink transition-colors flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> Siteyi Görüntüle
          </Link>
          <Link href="/admin/products/new" className="px-4 py-2.5 bg-ink text-white rounded-lg text-sm hover:bg-black transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" /> Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Toplam Ürün" value={products.length} hint={`${categories.filter(c => c.isActive).length} aktif kategori`} icon={Package} />
        <StatCard label="Ürün Görüntüleme" value={views.toLocaleString('tr-TR')} hint="Son 7 gün" icon={Eye} />
        <StatCard label="WhatsApp Tıklaması" value={whatsapp.toLocaleString('tr-TR')} hint="Son 7 gün" icon={MessageCircle} />
        <StatCard label="İletişime Dönüşme" value={conversion} hint="(WhatsApp + telefon) / görüntüleme" icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Dikkat gerektirenler */}
        <div className="bg-white rounded-xl border border-line p-6">
          <h2 className="font-semibold text-ink mb-4">Yapılacaklar</h2>
          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.text}>
                <Link href={t.href} className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-[#F7F6F3] transition-colors group">
                  {t.tone === 'warn'
                    ? <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    : t.text.includes('gizli') ? <EyeOff className="h-4 w-4 text-muted shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 text-muted shrink-0 mt-0.5" />}
                  <span className="text-sm text-ink-soft group-hover:text-ink flex-1">{t.text}</span>
                  <ArrowRight className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* En çok ilgi görenler */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-line p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">En Çok İlgi Gören Ürünler <span className="text-xs font-normal text-muted ml-1">son 7 gün</span></h2>
            <Link href="/admin/istatistikler" className="text-sm text-gold-deep hover:text-ink">Tüm istatistikler →</Link>
          </div>
          {stats && stats.topProducts.length > 0 ? (
            <ul className="divide-y divide-line">
              {stats.topProducts.slice(0, 5).map(({ product, views, whatsappClicks }) => (
                <li key={product.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-10 w-10 rounded bg-[#F7F6F3] overflow-hidden shrink-0">
                    {product.images[0] && <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                  </div>
                  <Link href={`/admin/products/${product.id}`} className="flex-1 min-w-0 text-sm text-ink hover:underline truncate">{product.name}</Link>
                  <span className="text-xs text-muted tabular-nums w-24 text-right">{views} görüntüleme</span>
                  <span className="text-xs text-ink tabular-nums w-24 text-right">{whatsappClicks} WhatsApp</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted py-8 text-center">Site yayına alındıktan sonra ziyaretçi verileri burada görünecek.</p>
          )}
        </div>
      </div>

      {/* Son eklenenler */}
      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex justify-between items-center">
          <h2 className="font-semibold text-ink">Son Eklenen Ürünler</h2>
          <Link href="/admin/products" className="text-sm text-gold-deep hover:text-ink">Tümünü gör →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium">Ürün</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium text-right">Fiyat</th>
                <th className="px-6 py-3 font-medium text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {latest.map(product => (
                <tr key={product.id} className="hover:bg-[#F7F6F3]/60 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded bg-[#F7F6F3] overflow-hidden shrink-0">
                        {product.images?.[0] ? <Image src={product.images[0]} alt="" fill sizes="36px" className="object-cover" /> : <Package className="h-4 w-4 text-muted m-2.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-ink truncate">{product.name}</p>
                        <p className="text-xs text-muted">{product.sku || '—'}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-ink-soft">{categoryName(product.category)}</td>
                  <td className="px-6 py-3 text-right tabular-nums">
                    {product.price > 0 ? `${product.price.toLocaleString('tr-TR')} ₺` : <span className="text-xs text-muted">Fiyat yok</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {!product.images?.length ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700">Görsel yok</span>
                    ) : hiddenCategorySlugs.has(product.category) ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">Gizli kategori</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700">Yayında</span>
                    )}
                  </td>
                </tr>
              ))}
              {latest.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-muted">Henüz ürün eklenmemiş.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
