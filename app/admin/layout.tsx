'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  LayoutTemplate,
  Images,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  Newspaper,
  BarChart3,
  FolderTree,
  X,
} from 'lucide-react';

const MENU = [
  { name: 'Genel Bakış', icon: LayoutDashboard, href: '/admin' },
  { name: 'İstatistikler', icon: BarChart3, href: '/admin/istatistikler' },
  { name: 'Ürünler', icon: Package, href: '/admin/products' },
  { name: 'Kategoriler', icon: FolderTree, href: '/admin/categories' },
  { name: 'Vitrin Tasarımı', icon: LayoutTemplate, href: '/admin/design' },
  { name: 'Medya', icon: Images, href: '/admin/media' },
  { name: 'Piyasa Notları', icon: Newspaper, href: '/admin/bulletin' },
  { name: 'Ayarlar', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Alt sayfalar (ör. ürün düzenleme) üst menü öğesini aktif gösterir
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  const current = MENU.find(m => isActive(m.href));

  return (
    // Panelde başlıklar da okunaklı sans yazı tipiyle gösterilir (sitedeki serif başlık stili burada kullanılmaz)
    <div className="min-h-screen bg-[#F7F6F3] flex font-sans [&_:is(h1,h2,h3,h4,h5,h6)]:font-sans [&_:is(h1,h2,h3,h4,h5,h6)]:tracking-normal">
      {/* Mobil karartma */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-ink/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* KENAR MENÜ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <Image src="/assets/logo-mark.png" alt="" width={36} height={28} className="h-7 w-auto brightness-0 invert" />
          <div className="leading-tight">
            <p className="text-sm font-medium tracking-[0.12em]">NEW PIRLANTA</p>
            <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Yönetim</p>
          </div>
          <button className="lg:hidden ml-auto p-1 text-white/60" onClick={() => setSidebarOpen(false)} aria-label="Menüyü kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {MENU.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 mx-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gold" />}
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/55 hover:text-white hover:bg-white/[0.04] transition-colors">
            <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.6} /> Siteyi Görüntüle
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#E3A3A3] hover:bg-white/[0.04] transition-colors">
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.6} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-line h-16 flex items-center gap-4 px-5 md:px-10 sticky top-0 z-30">
          <button className="lg:hidden p-2 -ml-2 text-ink" onClick={() => setSidebarOpen(true)} aria-label="Menüyü aç">
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-medium text-ink">{current?.name || 'Yönetim Paneli'}</p>
          <Link href="/" target="_blank" className="ml-auto hidden sm:flex items-center gap-2 text-xs text-muted hover:text-ink transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Siteyi görüntüle
          </Link>
        </header>

        <div className="flex-1 p-5 md:p-10 max-w-[1500px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
