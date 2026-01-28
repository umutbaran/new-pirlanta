'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80', // Alyans
    title: 'Sonsuza Dek Birlikte',
    subtitle: 'ALYANS KOLEKSİYONU',
    desc: 'En özel anlarınız için tasarlanmış alyans koleksiyonu.',
    btnText: 'Alyansları İncele',
    link: '/koleksiyon/altin-14?sub=alyans'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80', // Set
    title: 'Işıltınızı Yansıtın',
    subtitle: 'PIRLANTA SETLER',
    desc: 'Göz alıcı pırlanta setler ve gerdanlıklar.',
    btnText: 'Koleksiyonu Keşfet',
    link: '/koleksiyon/pirlanta'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b72231d?auto=format&fit=crop&q=80', // Tektaş
    title: 'Tektaş Tutkusu',
    subtitle: 'SERTİFİKALI TEKTAŞLAR',
    desc: 'Aşkın en saf hali, sertifikalı tektaş yüzükler.',
    btnText: 'Modelleri Gör',
    link: '/koleksiyon/pirlanta?sub=tektas'
  }
];

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1)),
      6000
    );

    return () => {
      resetTimeout();
    };
  }, [currentSlide]);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Arka Plan */}
            <div className="absolute inset-0">
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
               <img 
                 src={slide.image} 
                 alt={slide.title} 
                 className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
               />
            </div>

            {/* İçerik */}
            <div className="relative z-30 container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
               <div className={`max-w-2xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  
                  <div className="flex items-center gap-4 mb-6">
                     <div className="h-[1px] w-12 bg-[#D4AF37]" />
                     <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase">
                        {slide.subtitle}
                     </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6">
                     {slide.title}
                  </h1>
                  
                  <p className="text-gray-300 text-lg font-light mb-10 max-w-lg leading-relaxed">
                     {slide.desc}
                  </p>
                  
                  <Link 
                     href={slide.link} 
                     className="inline-block bg-white text-black border border-white px-10 py-4 font-bold tracking-widest uppercase hover:bg-transparent hover:text-white transition-all duration-300"
                  >
                     {slide.btnText}
                  </Link>

               </div>
            </div>
          </div>
        ))}

        {/* Progress Bar */}
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

        {/* Controls */}
        <div className="absolute bottom-12 right-12 z-40 flex gap-4">
           <button 
              onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full"
           >
              <ChevronLeft className="h-5 w-5" />
           </button>
           <button 
              onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
              className="p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full"
           >
              <ChevronRight className="h-5 w-5" />
           </button>
        </div>
    </section>
  );
}
