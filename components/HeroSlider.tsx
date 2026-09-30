'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { HeroSlide } from '@/lib/db';

// Admin panelinde hiç slayt yoksa gösterilecek varsayılan slayt
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80",
    title: "Sonsuza Dek Birlikte",
    subtitle: "ALYANS KOLEKSİYONU",
    buttonText: "Alyansları İncele",
    buttonLink: "/koleksiyon/altin-14?subCategory=alyans"
  }
];

// Slaytlar sunucuda çekilip prop olarak gelir; böylece sayfa açılırken boş yükleme ekranı görünmez
export default function HeroSlider({ slides: initialSlides }: { slides: HeroSlide[] }) {
  const slides = initialSlides?.length ? initialSlides : FALLBACK_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    if (slides.length > 1) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentSlide((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1)),
        6000
      );

      return () => {
        resetTimeout();
      };
    }
  }, [currentSlide, slides]);


  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Arka Plan */}
            <div className="absolute inset-0">
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20 md:block hidden" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 md:hidden" />
               <Image 
                 src={slide.image} 
                 alt={slide.title} 
                 fill
                 priority={index === 0}
                 className={`object-cover transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
               />
            </div>

            {/* İçerik */}
            <div className="relative z-30 container mx-auto h-full flex flex-col justify-end md:justify-center px-6 md:px-12 pb-20 md:pb-0">
               <div className={`max-w-2xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                     <div className="h-[1px] w-8 md:w-12 bg-[#D4AF37]" />
                     <span className="text-[#D4AF37] tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase">
                        {slide.subtitle}
                     </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-7xl font-serif text-white leading-[1.2] md:leading-[1.1] mb-6">
                     {slide.title}
                  </h1>
                  
                  <Link 
                     href={slide.buttonLink} 
                     className="inline-block bg-white text-black border border-white px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-white transition-all duration-300"
                  >
                     {slide.buttonText}
                  </Link>

               </div>
            </div>
          </div>
        ))}

        {/* Progress Bar */}
        {slides.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-40 flex">
            {slides.map((_, idx) => (
                <div key={idx} className="flex-1 h-full relative">
                    <div 
                        className={`absolute inset-0 bg-[#D4AF37] transition-all duration-[6000ms] ease-linear ${currentSlide === idx ? 'w-full' : 'w-0'}`}
                        style={{ width: currentSlide === idx ? '100%' : '0%', opacity: currentSlide === idx ? 1 : 0 }}
                    />
                </div>
            ))}
            </div>
        )}

        {/* Controls */}
        {slides.length > 1 && (
            <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-40 flex gap-3 md:gap-4">
            <button 
                onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="p-2 md:p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full"
            >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button 
                onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
                className="p-2 md:p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full"
            >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            </div>
        )}
    </section>
  );
}