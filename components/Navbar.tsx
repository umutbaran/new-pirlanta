'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, Heart, X, ChevronDown, Phone, MessageCircle } from 'lucide-react';
import type { CategoryData as Category } from '@/lib/db';
import { useFavorites } from '@/context/FavoritesContext';
import { telHref, whatsappLink } from '@/lib/utils';
import { track } from '@/lib/track';
import MarketBar from './MarketBar';

interface NavbarProps {
  phoneNumber: string;
  whatsappNumber: string;
  categories: Category[]; // Sunucuda çekilir; sadece aktif kategoriler gönderilir
}

const SECONDARY_LINKS = [
  { href: '/subelerimiz', label: 'Mağazalar' },
  { href: '/bulten', label: 'Piyasa' },
  { href: '/iletisim', label: 'İletişim' },
];

const MOBILE_LINKS = [
  { href: '/koleksiyon/tum-urunler', label: 'Tüm Ürünler' },
  { href: '/bulten', label: 'Piyasa Analiz' },
  { href: '/subelerimiz', label: 'Mağazalarımız' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

function FavoritesLink({ count }: { count: number }) {
  return (
    <Link href="/favoriler" className="relative p-2 -m-2 text-ink hover:text-gold-deep transition-colors" aria-label={`Favorilerim (${count})`}>
      <Heart className="h-[19px] w-[19px]" strokeWidth={1.4} />
      {count > 0 && (
        <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-ink text-white text-[9px] leading-4 text-center tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar({ phoneNumber, whatsappNumber, categories }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSub, setOpenSub] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sayfa değişince açık panelleri kapat
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Mobil menü açıkken sayfa kaydırılmasın; Escape ile paneller kapansın
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setIsSearchOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    track('search', { value: q });
    router.push(`/koleksiyon/tum-urunler?search=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const isActive = (slug: string) => pathname === `/koleksiyon/${slug}`;

  return (
    <>
      <MarketBar />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-line">
        {/* 1. SATIR: menü butonu / yardımcı linkler · logo · ikonlar */}
        <div className="container-lux h-16 lg:h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-ink" aria-label="Menüyü aç">
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.4} />
            </button>
            <nav className="hidden lg:flex items-center gap-7" aria-label="Site">
              {SECONDARY_LINKS.map(l => (
                <Link key={l.href} href={l.href} className={`eyebrow !text-[10px] transition-colors ${pathname === l.href ? 'text-gold-deep' : 'text-ink-soft hover:text-ink'}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="justify-self-center" aria-label="New Pırlanta ana sayfa">
            <Image
              src="/assets/logo-wordmark.png"
              alt="New Pırlanta"
              width={1200}
              height={311}
              priority
              className="h-8 lg:h-10 w-auto"
            />
          </Link>

          <div className="flex items-center justify-end gap-5 lg:gap-7">
            <button onClick={() => setIsSearchOpen(v => !v)} className="p-2 -m-2 text-ink hover:text-gold-deep transition-colors" aria-label="Ürün ara" aria-expanded={isSearchOpen}>
              <Search className="h-[19px] w-[19px]" strokeWidth={1.4} />
            </button>
            <FavoritesLink count={favorites.length} />
          </div>
        </div>

        {/* 2. SATIR (masaüstü): ortalanmış koleksiyon menüsü */}
        <nav className="hidden lg:flex justify-center items-center gap-10 h-11 border-t border-line/70 whitespace-nowrap" aria-label="Koleksiyonlar">
          {categories.map(cat => (
            <div key={cat.id} className="relative group h-full flex items-center">
              <Link
                href={`/koleksiyon/${cat.slug}`}
                className={`eyebrow !text-[11px] flex items-center gap-1 transition-colors ${isActive(cat.slug) ? 'text-gold-deep' : 'text-ink hover:text-gold-deep'}`}
              >
                {cat.name}
                {cat.subCategories.length > 0 && <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />}
              </Link>
              {/* Altın çizgi: aktif sayfa veya üzerine gelince */}
              <span className={`absolute -bottom-px left-0 h-px bg-gold transition-all duration-500 ${isActive(cat.slug) ? 'w-full' : 'w-0 group-hover:w-full'}`} />

              {cat.subCategories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-px opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300">
                  <div className="bg-white border border-line shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] min-w-[220px] py-4">
                    <Link href={`/koleksiyon/${cat.slug}`} className="block px-6 py-2 text-[13px] text-ink font-medium hover:bg-ivory">
                      Tümünü Gör
                    </Link>
                    <div className="h-px bg-line mx-6 my-2" />
                    {cat.subCategories.map(sub => (
                      <Link key={sub.slug} href={`/koleksiyon/${cat.slug}?subCategory=${sub.slug}`} className="block px-6 py-2 text-[13px] text-ink-soft hover:text-ink hover:bg-ivory transition-colors">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link href="/koleksiyon/tum-urunler" className={`eyebrow !text-[11px] transition-colors ${pathname === '/koleksiyon/tum-urunler' ? 'text-gold-deep' : 'text-ink hover:text-gold-deep'}`}>
            Tüm Ürünler
          </Link>
        </nav>

        {/* ARAMA PANELİ */}
        <div className={`absolute inset-x-0 top-full bg-white border-b border-line transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible -translate-y-2'}`}>
          <form onSubmit={handleSearch} className="container-lux py-6 lg:py-8 flex items-center gap-4" role="search">
            <Search className="h-5 w-5 text-muted shrink-0" strokeWidth={1.4} />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün, koleksiyon veya stok kodu arayın"
              aria-label="Arama"
              className="flex-1 bg-transparent font-display text-2xl lg:text-3xl text-ink placeholder:text-muted/60 outline-none"
            />
            <button type="submit" className="hidden sm:inline-flex btn-primary !min-h-10">Ara</button>
            <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-muted hover:text-ink" aria-label="Aramayı kapat">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </form>
        </div>
      </header>

      {/* MOBİL MENÜ */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${isMenuOpen ? 'visible' : 'invisible'}`} aria-hidden={!isMenuOpen}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <aside
          className={`absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Mobil menü"
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-line">
            <Image src="/assets/logo-wordmark.png" alt="New Pırlanta" width={1200} height={311} className="h-7 w-auto" />
            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-ink" aria-label="Menüyü kapat">
              <X className="h-[22px] w-[22px]" strokeWidth={1.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <p className="eyebrow text-muted pt-2 pb-3">Koleksiyonlar</p>
            <ul className="border-t border-line">
              {categories.map(cat => (
                <li key={cat.id} className="border-b border-line">
                  <div className="flex items-center">
                    <Link href={`/koleksiyon/${cat.slug}`} className="flex-1 py-4 font-display text-[22px] text-ink">
                      {cat.name}
                    </Link>
                    {cat.subCategories.length > 0 && (
                      <button
                        onClick={() => setOpenSub(openSub === cat.id ? null : cat.id)}
                        className="p-3 -mr-3 text-muted"
                        aria-label={`${cat.name} alt kategorileri`}
                        aria-expanded={openSub === cat.id}
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSub === cat.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  <div className={`grid transition-all duration-300 ${openSub === cat.id ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pl-1">
                        {cat.subCategories.map(sub => (
                          <Link key={sub.slug} href={`/koleksiyon/${cat.slug}?subCategory=${sub.slug}`} className="text-sm text-ink-soft">
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="mt-8 space-y-4">
              {MOBILE_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-ink-soft">{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/favoriler" className="text-[15px] text-ink-soft">Favorilerim ({favorites.length})</Link>
              </li>
            </ul>
          </nav>

          <div className="p-5 border-t border-line bg-ivory grid grid-cols-2 gap-3">
            <a href={telHref(phoneNumber)} className="btn-outline !px-3 !text-[11px]">
              <Phone className="h-4 w-4" strokeWidth={1.4} /> Ara
            </a>
            <a href={whatsappLink(whatsappNumber, 'Merhaba, ürünleriniz hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="btn-primary !px-3 !text-[11px]">
              <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
