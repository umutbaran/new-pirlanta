'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Klavye desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  const displayImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80'];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Ana Görsel */}
      <div 
          className="relative w-full aspect-square flex items-center justify-center cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={displayImages[selectedImage]}
          alt={productName}
          fill
          priority
          className="object-contain transition-transform duration-700 group-hover:scale-105"
        />
        
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              aria-label="Önceki resim"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-8 w-8 stroke-1" />
            </button>
            <button 
              onClick={nextImage} 
              aria-label="Sonraki resim"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-8 w-8 stroke-1" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      {/* Thumbnails - Minimalist Çizgi */}
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`w-12 h-12 border-b-2 transition-all duration-300 relative ${
                selectedImage === idx ? 'border-black' : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${productName} - ${idx + 1}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[1000] bg-white flex items-center justify-center p-4 animate-in fade-in duration-300">
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-8 right-8 text-black p-2 z-[1001]">
                <X className="h-8 w-8 stroke-1" />
            </button>
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
                <Image src={displayImages[selectedImage]} alt={productName} fill className="object-contain" />
            </div>
        </div>
      )}
    </div>
  );
}