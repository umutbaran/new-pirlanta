'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/db';

// Admin panelinde hiç slayt yoksa gösterilecek varsayılan slayt
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "1",
    image: "https://hvhbvhowpxbihtfzxcoh.supabase.co/storage/v1/object/public/products/site/rehber-yuzuk.webp",
    title: "Sonsuza Dek Birlikte",
    subtitle: "Alyans Koleksiyonu",
    buttonText: "Koleksiyonu Keşfet",
    buttonLink: "/koleksiyon/tum-urunler"
  }
];

const INTERVAL_MS = 7000;

// Slaytlar sunucuda çekilip prop olarak gelir; böylece sayfa açılırken boş yükleme ekranı görünmez
export default function HeroSlider({ slides: initialSlides }: { slides: HeroSlide[] }) {
  const slides = initialSlides?.length ? initialSlides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((delta: number) => {
    setCurrent(prev => (prev + delta + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setTimeout(() => go(1), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [current, paused, slides.length, go]);

  return (
    <section
      className="relative h-[78svh] min-h-[480px] lg:h-[calc(100svh-153px)] lg:min-h-[560px] lg:max-h-[860px] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Öne çıkan koleksiyonlar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      {slides.map((slide, index) => {
        const active = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${active ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={!active}
          >
            {failed[slide.id] ? (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,#3a332b_0%,#141414_65%)]" />
            ) : (
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                onError={() => setFailed(f => ({ ...f, [slide.id]: true }))}
                className={`object-cover transition-transform duration-[8000ms] ease-out ${active ? 'scale-[1.04]' : 'scale-100'}`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

            <div className="relative z-10 h-full container-lux flex flex-col justify-end pb-20 md:pb-24">
              <div className={`max-w-2xl text-white transition-all duration-1000 delay-200 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {slide.subtitle && <p className="eyebrow text-white/80 mb-5">{slide.subtitle}</p>}
                {index === 0
                  ? <h1 className="font-display text-[44px] leading-[1.05] md:text-7xl lg:text-[84px] font-medium">{slide.title}</h1>
                  : <h2 className="font-display text-[44px] leading-[1.05] md:text-7xl lg:text-[84px] font-medium">{slide.title}</h2>}
                {slide.buttonText && slide.buttonLink && (
                  <Link href={slide.buttonLink} className="link-underline mt-8 text-white" tabIndex={active ? 0 : -1}>
                    {slide.buttonText} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Slayt göstergesi */}
      {slides.length > 1 && (
        <div className="absolute z-20 bottom-8 md:bottom-10 inset-x-0">
          <div className="container-lux flex items-center justify-end gap-4 text-white">
            <span className="text-xs tabular-nums tracking-[0.2em] text-white/70">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  aria-label={`${i + 1}. slayta git`}
                  aria-current={i === current}
                  className="py-3"
                >
                  <span className={`block h-px transition-all duration-500 ${i === current ? 'w-10 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
