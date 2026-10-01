'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, Heart, X, ChevronDown, Phone, MessageCircle, LineChart, CandlestickChart, Calculator, CalendarDays, Newspaper, ArrowRight } from 'lucide-react';
import type { CategoryData as Category } from '@/lib/db';
import { useFavorites } from '@/context/FavoritesContext';
import { telHref, whatsappLink } from '@/lib/utils';
import { track } from '@/lib/track';
import MarketBar from './MarketBar';
import SmartImage from './SmartImage';

interface NavbarProps {
  phoneNumber: string;
  whatsappNumber: string;
  categories: Category[]; // Sunucuda çekilir; sadece aktif kategoriler gönderilir
  featured?: { image: string; title: string; link: string } | null;
}

const MARKET_LINKS = [
  { href: '/piyasa#fiyatlar', label: 'Canlı Fiyatlar', desc: 'Altın, döviz ve değerli madenler', icon: LineChart },
  { href: '/piyasa#grafik', label: 'Grafikler', desc: 'Gram altın, ons ve kur hareketleri', icon: CandlestickChart },
  { href: '/piyasa#hesaplayici', label: 'Altın Hesaplama', desc: 'Birikiminizin güncel değeri', icon: Calculator },
  { href: '/piyasa#takvim', label: 'Ekonomik Takvim', desc: 'Piyasayı etkileyecek veriler', icon: CalendarDays },
  { href: '/piyasa#notlar', label: 'Piyasa Notları', desc: 'Uzman değerlendirmeleri', icon: Newspaper },
];

type MenuId = 'koleksiyonlar' | 'piyasa' | null;

const tabClass = (active: boolean) =>
  `relative h-full flex items-center gap-1 eyebrow !text-[11px] transition-colors ${active ? 'text-ink' : 'text-ink-soft hover:text-ink'}`;

function ActiveLine({ active }: { active: boolean }) {
  return <span className={`absolute left-0 right-0 -bottom-px h-px bg-gold transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />;
}

export default function Navbar({ phoneNumber, whatsappNumber, categories, featured }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MenuId>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sayfa değişince açık panelleri kapat
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setOpenMega(null);
  }, [pathname]);

  // Mobil menü açıkken sayfa kaydırılmasın; Escape ile paneller kapansın
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setIsSearchOpen(false); setOpenMega(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // Mega menü: fare sekmeden panele geçerken kapanmasın diye kısa gecikmeyle kapanır
  const openMenu = (id: MenuId) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenMega(id); if (id) setIsSearchOpen(false); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpenMega(null), 150); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    track('search', { value: q });
    router.push(`/koleksiyon/tum-urunler?search=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const inCollections = (pathname.startsWith('/koleksiyon') && pathname !== '/koleksiyon/yeni') || pathname.startsWith('/urun');
  const regularCategories = categories.filter(c => !c.isSpecial);

  return (
    <>
      <MarketBar />

      <header className="sticky top-0 z-50 bg-white border-b border-line" onMouseLeave={scheduleClose}>
        {/* 1. SATIR: iletişim · logo · ikonlar */}
        <div className="container-lux h-16 lg:h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-ink" aria-label="Menüyü aç">
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.4} />
            </button>
            <a href={telHref(phoneNumber)} className="hidden lg:flex items-center gap-2 text-xs text-ink-soft hover:text-ink transition-colors tabular-nums">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.4} /> {phoneNumber}
            </a>
            <a href={whatsappLink(whatsappNumber, 'Merhaba, bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="hidden xl:flex items-center gap-2 text-xs text-ink-soft hover:text-ink transition-colors">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.4} /> WhatsApp
            </a>
          </div>

          <Link href="/" className="justify-self-center" aria-label="New Pırlanta ana sayfa">
            <Image src="/assets/logo-wordmark.png" alt="New Pırlanta" width={1200} height={311} priority className="h-8 lg:h-10 w-auto" />
          </Link>

          <div className="flex items-center justify-end gap-5 lg:gap-7">
            <button onClick={() => { setIsSearchOpen(v => !v); setOpenMega(null); }} className="p-2 -m-2 text-ink hover:text-gold-deep transition-colors" aria-label="Ürün ara" aria-expanded={isSearchOpen}>
              <Search className="h-[19px] w-[19px]" strokeWidth={1.4} />
            </button>
            <Link href="/favoriler" className="relative p-2 -m-2 text-ink hover:text-gold-deep transition-colors" aria-label={`Favorilerim (${favorites.length})`}>
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.4} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-ink text-white text-[9px] leading-4 text-center tabular-nums">{favorites.length}</span>
              )}
            </Link>
          </div>
        </div>

        {/* 2. SATIR (masaüstü): ana sekmeler */}
        <nav className="hidden lg:flex justify-center items-center gap-10 h-11 border-t border-line/70 whitespace-nowrap" aria-label="Ana menü">
          <Link href="/" className={tabClass(pathname === '/')} onMouseEnter={() => openMenu(null)}>
            Anasayfa<ActiveLine active={pathname === '/'} />
          </Link>
          <button type="button" className={tabClass(inCollections || openMega === 'koleksiyonlar')} aria-expanded={openMega === 'koleksiyonlar'}
            onMouseEnter={() => openMenu('koleksiyonlar')} onClick={() => setOpenMega(openMega === 'koleksiyonlar' ? null : 'koleksiyonlar')}>
            Koleksiyonlar <ChevronDown className={`h-3 w-3 opacity-60 transition-transform ${openMega === 'koleksiyonlar' ? 'rotate-180' : ''}`} />
            <ActiveLine active={inCollections || openMega === 'koleksiyonlar'} />
          </button>
          <Link href="/koleksiyon/yeni" className={tabClass(pathname === '/koleksiyon/yeni')} onMouseEnter={() => openMenu(null)}>
            Yeni Gelenler<ActiveLine active={pathname === '/koleksiyon/yeni'} />
          </Link>
          <button type="button" className={tabClass(pathname.startsWith('/piyasa') || openMega === 'piyasa')} aria-expanded={openMega === 'piyasa'}
            onMouseEnter={() => openMenu('piyasa')} onClick={() => setOpenMega(openMega === 'piyasa' ? null : 'piyasa')}>
            <span className="relative flex h-1.5 w-1.5 mr-1" aria-hidden><span className="absolute inline-flex h-full w-full rounded-full bg-[#2F7A4B] opacity-50 animate-ping" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2F7A4B]" /></span>
            Piyasa <ChevronDown className={`h-3 w-3 opacity-60 transition-transform ${openMega === 'piyasa' ? 'rotate-180' : ''}`} />
            <ActiveLine active={pathname.startsWith('/piyasa') || openMega === 'piyasa'} />
          </button>
          <Link href="/subelerimiz" className={tabClass(pathname === '/subelerimiz')} onMouseEnter={() => openMenu(null)}>
            Mağazalar<ActiveLine active={pathname === '/subelerimiz'} />
          </Link>
          <Link href="/iletisim" className={tabClass(pathname === '/iletisim')} onMouseEnter={() => openMenu(null)}>
            İletişim<ActiveLine active={pathname === '/iletisim'} />
          </Link>
        </nav>

        {/* MEGA MENÜ: Koleksiyonlar */}
        <div
          className={`hidden lg:block absolute inset-x-0 top-full bg-white border-b border-line shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] transition-all duration-300 ${openMega === 'koleksiyonlar' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
          onMouseEnter={() => openMenu('koleksiyonlar')}
        >
          <div className="container-lux py-10 grid grid-cols-12 gap-10">
            <div className="col-span-8 grid grid-cols-4 gap-8">
              {regularCategories.map(cat => (
                <div key={cat.id}>
                  <Link href={`/koleksiyon/${cat.slug}`} className="font-display text-2xl text-ink hover:text-gold-deep transition-colors">{cat.name}</Link>
                  <ul className="mt-4 space-y-2.5">
                    {cat.subCategories.map(sub => (
                      <li key={sub.slug}>
                        <Link href={`/koleksiyon/${cat.slug}?subCategory=${sub.slug}`} className="text-sm text-ink-soft hover:text-ink transition-colors">{sub.name}</Link>
                      </li>
                    ))}
                    <li><Link href={`/koleksiyon/${cat.slug}`} className="text-sm text-gold-deep hover:text-ink transition-colors">Tümünü gör →</Link></li>
                  </ul>
                </div>
              ))}
              <div>
                <p className="font-display text-2xl text-ink">Keşfet</p>
                <ul className="mt-4 space-y-2.5">
                  {categories.filter(c => c.isSpecial).map(c => (
                    <li key={c.id}><Link href={`/koleksiyon/${c.slug}`} className="text-sm text-ink-soft hover:text-ink">{c.name}</Link></li>
                  ))}
                  <li><Link href="/koleksiyon/tum-urunler" className="text-sm text-ink-soft hover:text-ink">Tüm Ürünler</Link></li>
                  <li><Link href="/favoriler" className="text-sm text-ink-soft hover:text-ink">Favorilerim</Link></li>
                </ul>
              </div>
            </div>
            {featured && (
              <Link href={featured.link} className="col-span-4 group relative block aspect-[4/3] overflow-hidden bg-ivory">
                <SmartImage src={featured.image} alt={featured.title} fill sizes="420px" loading="eager" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <p className="font-display text-2xl">{featured.title}</p>
                  <span className="link-underline mt-2 text-white">Keşfet <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* MEGA MENÜ: Piyasa */}
        <div
          className={`hidden lg:block absolute inset-x-0 top-full bg-white border-b border-line shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] transition-all duration-300 ${openMega === 'piyasa' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
          onMouseEnter={() => openMenu('piyasa')}
        >
          <div className="container-lux py-8 grid grid-cols-5 gap-4">
            {MARKET_LINKS.map(({ href, label, desc, icon: Icon }) => (
              <Link key={href} href={href} className="group p-5 border border-line hover:border-ink transition-colors">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.2} />
                <p className="mt-4 font-display text-xl text-ink">{label}</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

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
              className="flex-1 min-w-0 bg-transparent font-display text-2xl lg:text-3xl text-ink placeholder:text-muted/60 outline-none"
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

          <nav className="flex-1 overflow-y-auto px-5 py-2">
            <ul>
              <li className="border-b border-line">
                <Link href="/" className="block py-4 font-display text-[22px] text-ink">Anasayfa</Link>
              </li>

              <li className="border-b border-line">
                <button onClick={() => setOpenMobile(openMobile === 'koleksiyonlar' ? null : 'koleksiyonlar')} className="w-full flex items-center justify-between py-4 font-display text-[22px] text-ink" aria-expanded={openMobile === 'koleksiyonlar'}>
                  Koleksiyonlar <ChevronDown className={`h-4 w-4 text-muted transition-transform duration-300 ${openMobile === 'koleksiyonlar' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openMobile === 'koleksiyonlar' ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden space-y-3 pl-1">
                    {categories.map(cat => (
                      <li key={cat.id}><Link href={`/koleksiyon/${cat.slug}`} className="text-[15px] text-ink-soft">{cat.name}</Link></li>
                    ))}
                    <li><Link href="/koleksiyon/tum-urunler" className="text-[15px] text-ink-soft">Tüm Ürünler</Link></li>
                  </ul>
                </div>
              </li>

              <li className="border-b border-line">
                <Link href="/koleksiyon/yeni" className="block py-4 font-display text-[22px] text-ink">Yeni Gelenler</Link>
              </li>

              <li className="border-b border-line">
                <button onClick={() => setOpenMobile(openMobile === 'piyasa' ? null : 'piyasa')} className="w-full flex items-center justify-between py-4 font-display text-[22px] text-ink" aria-expanded={openMobile === 'piyasa'}>
                  <span className="flex items-center gap-2">Piyasa <span className="h-1.5 w-1.5 rounded-full bg-[#2F7A4B]" aria-hidden /></span>
                  <ChevronDown className={`h-4 w-4 text-muted transition-transform duration-300 ${openMobile === 'piyasa' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openMobile === 'piyasa' ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden space-y-3 pl-1">
                    {MARKET_LINKS.map(l => (
                      <li key={l.href}><Link href={l.href} onClick={() => setIsMenuOpen(false)} className="text-[15px] text-ink-soft">{l.label}</Link></li>
                    ))}
                  </ul>
                </div>
              </li>

              <li className="border-b border-line"><Link href="/subelerimiz" className="block py-4 font-display text-[22px] text-ink">Mağazalar</Link></li>
              <li className="border-b border-line"><Link href="/iletisim" className="block py-4 font-display text-[22px] text-ink">İletişim</Link></li>
            </ul>

            <ul className="mt-6 space-y-3 text-[15px] text-ink-soft">
              <li><Link href="/hakkimizda">Hakkımızda</Link></li>
              <li><Link href="/favoriler">Favorilerim ({favorites.length})</Link></li>
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
