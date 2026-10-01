'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import SmartImage from './SmartImage';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages = images?.length ? images : [''];
  const count = displayImages.length;
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const mobileTrack = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((delta: number) => setSelected(i => (i + delta + count) % count), [count]);

  // Tam ekran görünümde klavye ile gezinme ve sayfa kaydırmasını kilitleme
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [lightbox, go]);

  // Mobil kaydırmalı galeride görünen görseli takip et
  const onMobileScroll = () => {
    const el = mobileTrack.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== selected) setSelected(index);
  };

  const hasImages = !!images?.length;

  return (
    <div>
      {/* MOBİL: kaydırmalı galeri */}
      <div className="lg:hidden -mx-5 md:-mx-10">
        <div
          ref={mobileTrack}
          onScroll={onMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { if (hasImages) { setSelected(idx); setLightbox(true); } }}
              className="relative shrink-0 w-full aspect-[4/5] snap-center bg-ivory"
              aria-label={`${productName} görselini büyüt (${idx + 1}/${count})`}
            >
              <SmartImage src={img} alt={`${productName} - ${idx + 1}`} fill priority={idx === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {count > 1 && (
          <div className="flex justify-center gap-1.5 pt-4" aria-hidden>
            {displayImages.map((_, idx) => (
              <span key={idx} className={`h-px transition-all duration-300 ${idx === selected ? 'w-6 bg-ink' : 'w-3 bg-ink/25'}`} />
            ))}
          </div>
        )}
      </div>

      {/* MASAÜSTÜ: küçük resimler + büyük görsel */}
      <div className={`hidden lg:grid gap-4 ${count > 1 ? 'grid-cols-[72px_1fr]' : 'grid-cols-1'}`}>
        {count > 1 && (
          <div className="flex flex-col gap-3">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelected(idx)}
                aria-label={`${idx + 1}. görsel`}
                aria-current={selected === idx}
                className={`relative aspect-[4/5] bg-ivory overflow-hidden transition-opacity ${selected === idx ? 'opacity-100 outline outline-1 outline-ink outline-offset-2' : 'opacity-50 hover:opacity-100'}`}
              >
                <SmartImage src={img} alt="" fill sizes="72px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div
          className={`relative aspect-[4/5] bg-ivory overflow-hidden group ${hasImages ? 'cursor-zoom-in' : ''}`}
          onClick={() => hasImages && setLightbox(true)}
          onMouseMove={(e) => {
            if (!hasImages) return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <SmartImage
            key={selected}
            src={displayImages[selected]}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1280px) 55vw, 700px"
            className="object-cover transition-transform duration-300 ease-out"
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
          {hasImages && (
            <span className="absolute bottom-4 right-4 h-9 w-9 bg-white/90 flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
              <Expand className="h-4 w-4" strokeWidth={1.4} />
            </span>
          )}
        </div>
      </div>

      {/* TAM EKRAN */}
      {lightbox && hasImages && (
        <div
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-fade-in"
          role="dialog"
          aria-label={`${productName} görselleri`}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <div className="absolute top-0 inset-x-0 h-16 px-5 flex items-center justify-between z-10">
            <span className="text-xs tracking-[0.2em] tabular-nums text-muted">{selected + 1} / {count}</span>
            <button type="button" onClick={() => setLightbox(false)} className="p-2 -mr-2 text-ink" aria-label="Kapat">
              <X className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
          <div className="relative w-full h-full max-w-5xl max-h-[85svh] mx-4">
            <Image src={displayImages[selected]} alt={productName} fill sizes="100vw" className="object-contain" />
          </div>
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 text-ink hover:text-gold-deep" aria-label="Önceki görsel">
                <ChevronLeft className="h-7 w-7" strokeWidth={1} />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 text-ink hover:text-gold-deep" aria-label="Sonraki görsel">
                <ChevronRight className="h-7 w-7" strokeWidth={1} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
