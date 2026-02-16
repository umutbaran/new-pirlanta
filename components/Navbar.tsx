'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Heart, X, ChevronDown, Calendar } from 'lucide-react';
import GoldRates from './GoldRates';
import { CategoryData as Category } from '@/lib/db';
import { useFavorites } from '@/context/FavoritesContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { favorites } = useFavorites(); // Context'ten favorileri çek

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.filter((c: Category) => c.isActive));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="sticky top-0 z-[100] w-full shadow-md">
      
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
          <div className="relative flex-shrink-0 mr-8 w-48 md:w-64 h-full">
            <Link href="/" className="group block h-full w-full relative flex flex-col justify-center items-center">
              <Image 
                src="/assets/logo.png" 
                alt="New Pırlanta Logo" 
                width={1000} 
                height={300} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 md:h-60 w-auto max-w-none object-contain z-10 mix-blend-multiply"
                priority
                unoptimized
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
          <div className="flex-shrink-0 flex justify-end items-center gap-4 md:gap-6">
            <button className="hidden lg:block text-gray-600 hover:text-[#D4AF37] transition-colors">
               <Search className="h-5 w-5" />
            </button>
            <Link href="/hesabim" className="hidden md:block text-gray-900 hover:text-[#D4AF37] transition-colors">
               <User className="h-5 w-5" />
            </Link>
            
            {/* FAVORİLER BUTONU VE SAYACI */}
            <Link href="/favoriler" className="hidden md:block text-gray-900 hover:text-[#D4AF37] transition-colors relative group">
               <Heart className="h-5 w-5 group-hover:fill-current transition-all" />
               {favorites.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                   {favorites.length}
                 </span>
               )}
            </Link>

            <Link href="/bulten" className="hidden lg:flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-8 text-[#D4AF37] hover:text-black transition-colors border-l border-gray-100 pl-6 ml-2">
               <Calendar className="h-4 w-4" />
               Piyasa Analiz
            </Link>

            <button onClick={() => setIsOpen(true)} className="lg:hidden text-gray-900">
               <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-[85%] h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
             <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <span className="font-serif font-bold text-xl tracking-widest">MENÜ</span>
               <button onClick={() => setIsOpen(false)}><X className="h-6 w-6" /></button>
             </div>
             <nav className="p-6 space-y-6">
               {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/koleksiyon/${cat.slug}`} 
                    className={`block text-lg font-medium ${cat.isSpecial ? 'text-[#D4AF37]' : 'text-gray-900'}`}
                  >
                    {cat.name.toUpperCase()}
                  </Link>
               ))}
               <div className="border-t border-gray-100 pt-6">
                  <Link href="/favoriler" className="flex items-center gap-3 text-sm font-medium text-gray-900">
                     <Heart className="h-5 w-5 text-[#D4AF37]" />
                     Favorilerim ({favorites.length})
                  </Link>
                  <Link href="/bulten" className="flex items-center gap-3 text-sm font-medium text-gray-900 mt-4">
                     <Calendar className="h-5 w-5 text-[#D4AF37]" />
                     Piyasa Analiz
                  </Link>
                  <Link href="/subelerimiz" className="block text-sm text-gray-500 mt-4">Şubelerimiz</Link>
                  <Link href="/iletisim" className="block text-sm text-gray-500 mt-4">İletişim</Link>
               </div>
             </nav>
          </div>
        </div>
      )}
    </div>
  );
}
