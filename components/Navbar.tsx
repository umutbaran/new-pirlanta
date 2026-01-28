'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingBag, User, Heart, X, ChevronDown } from 'lucide-react';
import GoldRates from './GoldRates';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    // TÜM NAVBAR'I KAPSAYAN YAPIŞKAN (STICKY) DIV
    <div className="sticky top-0 z-[100] w-full shadow-md">
      
      {/* 1. TOP BAR: Gold Rates */}
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
          
          {/* A. SOL TARA: LOGO */}
          <div className="flex-shrink-0 mr-12">
            <Link href="/" className="group block">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-wide">
                NEW PIRLANTA
              </h1>
              <span className="text-[8px] md:text-[9px] tracking-[0.4em] text-[#D4AF37] uppercase block mt-1 font-medium group-hover:tracking-[0.5em] transition-all duration-500">
                Jewelry & Design
              </span>
            </Link>
          </div>

          {/* B. ORTA: MEGA MENU (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-8 h-full flex-1">
             
             {/* 1. PIRLANTA */}
             <div className="relative h-full flex items-center group" onMouseEnter={() => setActiveMenu('pirlanta')} onMouseLeave={() => setActiveMenu(null)}>
                <Link href="/koleksiyon/pirlanta" className="text-xs font-bold tracking-widest text-gray-900 hover:text-[#D4AF37] transition-colors uppercase py-8 flex items-center gap-1">
                   Pırlanta <ChevronDown className="h-3 w-3" />
                </Link>
                <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-b-sm">
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Yüzükler</h4>
                         <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/koleksiyon/pirlanta?sub=tektas" className="hover:text-[#D4AF37] block">Tektaş Yüzükler</Link></li>
                            <li><Link href="/koleksiyon/pirlanta?sub=baget" className="hover:text-[#D4AF37] block">Baget Yüzükler</Link></li>
                            <li><Link href="/koleksiyon/pirlanta?sub=tria" className="hover:text-[#D4AF37] block">Tria & Beştaş</Link></li>
                            <li><Link href="/koleksiyon/pirlanta?sub=tamtur" className="hover:text-[#D4AF37] block">Tamtur Alyans</Link></li>
                         </ul>
                      </div>
                      <div>
                         <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Diğer Mücevherler</h4>
                         <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/koleksiyon/pirlanta?sub=kolye" className="hover:text-[#D4AF37] block">Pırlanta Kolyeler</Link></li>
                            <li><Link href="/koleksiyon/pirlanta?sub=kupe" className="hover:text-[#D4AF37] block">Pırlanta Küpeler</Link></li>
                            <li><Link href="/koleksiyon/pirlanta?sub=bileklik" className="hover:text-[#D4AF37] block">Suyolu Bileklikler</Link></li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>

             {/* 2. 14 AYAR */}
             <div className="relative h-full flex items-center group" onMouseEnter={() => setActiveMenu('14ayar')} onMouseLeave={() => setActiveMenu(null)}>
                <Link href="/koleksiyon/altin-14" className="text-xs font-bold tracking-widest text-gray-900 hover:text-[#D4AF37] transition-colors uppercase py-8 flex items-center gap-1">
                   14 Ayar <ChevronDown className="h-3 w-3" />
                </Link>
                <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-b-sm">
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Trend Altın</h4>
                         <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/koleksiyon/altin-14?sub=kolye" className="hover:text-[#D4AF37] block">Minimal Kolyeler</Link></li>
                            <li><Link href="/koleksiyon/altin-14?sub=harf" className="hover:text-[#D4AF37] block">Harf Kolyeler</Link></li>
                            <li><Link href="/koleksiyon/altin-14?sub=kupe" className="hover:text-[#D4AF37] block">Halka Küpeler</Link></li>
                         </ul>
                      </div>
                      <div>
                         <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Düğün & Nişan</h4>
                         <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/koleksiyon/altin-14?sub=alyans" className="hover:text-[#D4AF37] block">Alyans Modelleri</Link></li>
                            <li><Link href="/koleksiyon/altin-14?sub=set" className="hover:text-[#D4AF37] block">Mini Setler</Link></li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>

             {/* 3. 22 AYAR */}
             <div className="relative h-full flex items-center group" onMouseEnter={() => setActiveMenu('22ayar')} onMouseLeave={() => setActiveMenu(null)}>
                <Link href="/koleksiyon/altin-22" className="text-xs font-bold tracking-widest text-gray-900 hover:text-[#D4AF37] transition-colors uppercase py-8 flex items-center gap-1">
                   22 Ayar <ChevronDown className="h-3 w-3" />
                </Link>
                <div className="absolute top-full left-0 w-[400px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-b-sm">
                   <div>
                       <h4 className="font-serif font-bold text-base mb-4 text-gray-900 border-b border-gray-100 pb-2">Geleneksel & Yatırım</h4>
                       <ul className="space-y-3 text-sm text-gray-500">
                          <li><Link href="/koleksiyon/altin-22?sub=bilezik" className="hover:text-[#D4AF37] block">Ajda Bilezikler</Link></li>
                          <li><Link href="/koleksiyon/altin-22?sub=burma" className="hover:text-[#D4AF37] block">Burma Bilezikler</Link></li>
                          <li><Link href="/koleksiyon/altin-22?sub=trabzon" className="hover:text-[#D4AF37] block">Trabzon Hasır Setler</Link></li>
                          <li><Link href="/koleksiyon/altin-22?sub=kolye" className="hover:text-[#D4AF37] block">Çeyrekli Kolyeler</Link></li>
                       </ul>
                   </div>
                </div>
             </div>

             {/* 4. SARRAFİYE */}
             <div className="relative h-full flex items-center group" onMouseEnter={() => setActiveMenu('sarrafiye')} onMouseLeave={() => setActiveMenu(null)}>
                <Link href="/koleksiyon/sarrafiye" className="text-xs font-bold tracking-widest text-gray-900 hover:text-[#D4AF37] transition-colors uppercase py-8 flex items-center gap-1">
                   Sarrafiye <ChevronDown className="h-3 w-3" />
                </Link>
                <div className="absolute top-full left-0 w-[400px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-b-sm">
                   <div className="grid grid-cols-1 gap-4">
                      <Link href="/koleksiyon/sarrafiye?sub=ceyrek" className="flex items-center gap-4 group/item hover:bg-gray-50 p-2 rounded transition-colors">
                         <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-[#D4AF37] font-bold text-xs border border-yellow-200">Ç</div>
                         <span className="block font-bold text-gray-900 group-hover/item:text-[#D4AF37]">Çeyrek Altın</span>
                      </Link>
                      <Link href="/koleksiyon/sarrafiye?sub=yarim" className="flex items-center gap-4 group/item hover:bg-gray-50 p-2 rounded transition-colors">
                         <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-[#D4AF37] font-bold text-xs border border-yellow-200">Y</div>
                         <span className="block font-bold text-gray-900 group-hover/item:text-[#D4AF37]">Yarım Altın</span>
                      </Link>
                      <Link href="/koleksiyon/sarrafiye?sub=tam" className="flex items-center gap-4 group/item hover:bg-gray-50 p-2 rounded transition-colors">
                         <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-[#D4AF37] font-bold text-xs border border-yellow-200">T</div>
                         <span className="block font-bold text-gray-900 group-hover/item:text-[#D4AF37]">Tam Altın</span>
                      </Link>
                   </div>
                </div>
             </div>

             {/* 5. YENİ KOLEKSİYON */}
             <div className="relative h-full flex items-center group" onMouseEnter={() => setActiveMenu('yeni')} onMouseLeave={() => setActiveMenu(null)}>
                <Link href="/koleksiyon/yeni" className="text-xs font-bold tracking-widest text-[#D4AF37] hover:text-black transition-colors uppercase py-8 flex items-center gap-1">
                   Yeni Koleksiyon
                </Link>
             </div>
          </div>

          {/* C. SAĞ TARA: İKONLAR */}
          <div className="flex-shrink-0 flex justify-end items-center gap-4 md:gap-6">
            <button className="hidden lg:block text-gray-600 hover:text-[#D4AF37] transition-colors">
               <Search className="h-5 w-5" />
            </button>
            <Link href="/hesabim" className="hidden md:block text-gray-900 hover:text-[#D4AF37] transition-colors">
               <User className="h-5 w-5" />
            </Link>
            <Link href="/favoriler" className="hidden md:block text-gray-900 hover:text-[#D4AF37] transition-colors">
               <Heart className="h-5 w-5" />
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
               <Link href="/koleksiyon/pirlanta" className="block text-lg font-medium text-gray-900">PIRLANTA</Link>
               <Link href="/koleksiyon/altin-14" className="block text-lg font-medium text-gray-900">14 AYAR ALTIN</Link>
               <Link href="/koleksiyon/altin-22" className="block text-lg font-medium text-gray-900">22 AYAR ALTIN</Link>
               <Link href="/koleksiyon/sarrafiye" className="block text-lg font-medium text-gray-900">SARRAFİYE</Link>
               <Link href="/koleksiyon/yeni" className="block text-lg font-medium text-[#D4AF37]">YENİ KOLEKSİYON</Link>
               <div className="border-t border-gray-100 pt-6">
                  <Link href="/subelerimiz" className="block text-sm text-gray-500">Şubelerimiz</Link>
                  <Link href="/iletisim" className="block text-sm text-gray-500 mt-4">İletişim</Link>
               </div>
             </nav>
          </div>
        </div>
      )}
    </div>
  );
}