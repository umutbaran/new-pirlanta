'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Heart, X, ChevronDown, Calendar, ChevronRight } from 'lucide-react';
import GoldRates from './GoldRates';
import { CategoryData as Category } from '@/lib/db';
import { useFavorites } from '@/context/FavoritesContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { favorites } = useFavorites(); // Context'ten favorileri çek
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.filter((c: Category) => c.isActive));
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/koleksiyon/yeni?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full shadow-md bg-white">

      {/* 1. TOP BAR */}
      <div className="bg-[#121212] text-gray-400 text-[10px] md:text-xs h-10 border-b border-gray-800 relative z-[101]">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
           <span className="hidden md:inline-block tracking-widest uppercase text-[#D4AF37] font-bold opacity-80">Baran Kuyumculuk</span>
           <div className="flex-1 md:flex-none md:w-2/3 lg:w-1/2 h-full flex items-center justify-end overflow-hidden">
              <GoldRates />
           </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="bg-white border-b border-gray-100 relative z-[100]">
        <div className="container mx-auto px-4 lg:px-8 h-20 md:h-24 flex items-center justify-between">   

          {/* A. LOGO */}
          <div className="relative flex-shrink-0 mr-4 md:mr-8 w-48 md:w-64 h-full">
            <Link href="/" className="group block h-full w-full relative flex flex-col justify-center items-center">
              <Image
                src="/assets/logo.png"
                alt="New Pırlanta Logo"
                width={280}
                height={80}
                className="h-auto w-full max-w-[200px] md:max-w-[280px] object-contain mix-blend-multiply transition-transform hover:scale-[1.02]"
                priority
              />
            </Link>
          </div>

          {/* B. MEGA MENU (DYNAMIC) */}
          <div className="hidden lg:flex items-center gap-8 h-full flex-1">
             {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center group"
                >
                   <Link
                     href={`/koleksiyon/${cat.slug}`}
                     className={`text-xs font-bold tracking-widest uppercase py-8 flex items-center gap-1 transition-colors ${cat.isSpecial ? 'text-[#D4AF37] hover:text-black' : 'text-gray-900 hover:text-[#D4AF37]'}`}
                   >
                      {cat.name}
                      {cat.subCategories.length > 0 && <ChevronDown className="h-3 w-3" />}
                   </Link>

                   {/* Dropdown */}
                   {cat.subCategories.length > 0 && (
                      <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-b-sm">
                         <div className="grid grid-cols-2 gap-8">
                            <div>
                               <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Koleksiyon</h4>
                               <ul className="space-y-3 text-sm text-gray-500">
                                  {cat.subCategories.slice(0, Math.ceil(cat.subCategories.length / 2)).map((sub, idx) => (
                                     <li key={idx}><Link href={`/koleksiyon/${cat.slug}?sub=${sub.slug}`} className="hover:text-[#D4AF37] block">{sub.name}</Link></li>
                                  ))}
                               </ul>
                            </div>
                            <div>
                               <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Öne Çıkanlar</h4>
                               <ul className="space-y-3 text-sm text-gray-500">
                                  {cat.subCategories.slice(Math.ceil(cat.subCategories.length / 2)).map((sub, idx) => (
                                     <li key={idx}><Link href={`/koleksiyon/${cat.slug}?sub=${sub.slug}`} className="hover:text-[#D4AF37] block">{sub.name}</Link></li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             ))}
          </div>

          {/* C. ICONS */}
          <div className="flex-shrink-0 flex justify-end items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:block text-gray-600 hover:text-[#D4AF37] transition-colors"
            >     
               <Search className="h-5 w-5" />
            </button>
            <Link href="/admin" className="hidden md:block text-gray-900 hover:text-[#D4AF37] transition-colors">
               <User className="h-5 w-5" />
            </Link>

            {/* FAVORİLER BUTONU VE SAYACI - Mobilde Görünür */}
            <Link href="/favoriler" className="text-gray-900 hover:text-[#D4AF37] transition-colors relative group">
               <Heart className="h-5 w-5 md:h-6 md:w-6 group-hover:fill-current transition-all" />        
               {favorites.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[8px] md:text-[9px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                   {favorites.length}
                 </span>
               )}
            </Link>

            {/* PİYASA ANALİZ - Mobilde İkon Olarak Görünür */}
            <Link href="/bulten" className="text-[#D4AF37] hover:text-black transition-colors lg:flex items-center gap-2 lg:text-xs lg:font-bold lg:tracking-widest lg:uppercase lg:py-8 lg:border-l lg:border-gray-100 lg:pl-6 lg:ml-2">
               <Calendar className="h-5 w-5 md:h-6 md:w-6" />
               <span className="hidden lg:inline">Piyasa Analiz</span>
            </Link>

            <button onClick={() => setIsOpen(true)} className="lg:hidden text-gray-900 p-1">
               <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white p-10 md:p-20 shadow-2xl animate-in slide-in-from-top duration-500 rounded-b-[3rem]">
              <div className="container mx-auto">
                 <div className="flex justify-between items-center mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Ürün Ara</span>
                    <button onClick={() => setIsSearchOpen(false)} className="p-4 bg-slate-50 rounded-full hover:rotate-90 transition-all shadow-sm"><X className="h-8 w-8" /></button>
                 </div>
                 <form onSubmit={handleSearch} className="relative max-w-6xl mx-auto">
                    <input 
                      type="text" 
                      autoFocus 
                      placeholder="Ne aramıştınız?..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full bg-transparent border-b-4 border-slate-100 py-8 text-4xl md:text-7xl font-serif outline-none focus:border-[#D4AF37] transition-all pr-24" 
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-[#D4AF37] hover:scale-110 transition-transform"><Search className="h-12 w-12 md:h-20 md:w-20" /></button>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-right duration-300">      
          <div className="flex flex-col h-full">
             <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <div className="w-32 relative h-10">
                  <Image src="/assets/logo.png" alt="Logo" fill className="object-contain object-left mix-blend-multiply" />
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 text-gray-900">
                 <X className="h-8 w-8" />
               </button>
             </div>

             <nav className="flex-1 overflow-y-auto p-8 space-y-8">
               {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-50 pb-4">
                    <Link
                      href={`/koleksiyon/${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`block text-xl font-serif font-bold ${cat.isSpecial ? 'text-[#D4AF37]' : 'text-gray-900'}`}
                    >
                      {cat.name}
                    </Link>
                    {cat.subCategories.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {cat.subCategories.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={`/koleksiyon/${cat.slug}?sub=${sub.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-sm text-gray-500 hover:text-[#D4AF37]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
               ))}

               <div className="pt-8 space-y-6 border-t border-gray-100">
                  <Link href="/favoriler" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-gray-900">
                     <Heart className="h-6 w-6 text-[#D4AF37]" />
                     Favorilerim ({favorites.length})
                  </Link>
                  <Link href="/bulten" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-gray-900">
                     <Calendar className="h-6 w-6 text-[#D4AF37]" />
                     Piyasa Analiz
                  </Link>
               </div>

               <div className="pt-12 grid grid-cols-2 gap-4">
                  <Link href="/subelerimiz" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-400">Şubelerimiz</Link>
                  <Link href="/iletisim" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-400">İletişim</Link>
               </div>
             </nav>

             <div className="p-8 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-4">Müşteri Hattı</p>
                <a href="tel:05527873513" className="text-xl font-bold text-gray-900">0552 787 35 13</a>  
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
