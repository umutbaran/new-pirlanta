'use client';

import { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { Product } from '@/data/products';

export default function MediaPage() {
  const [images, setImages] = useState<{url: string, productName: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();
      
      // Tüm ürünlerin görsellerini tek bir listede topla
      const allImages = products.flatMap(p => 
        p.images.map(img => ({
          url: img,
          productName: p.name
        }))
      );
      
      setImages(allImages);
    } catch (error) {
      console.error('Görseller yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Medya Kütüphanesi</h1>
      <p className="text-gray-500 mb-8">Ürünlerinizde kullanılan tüm görseller burada listelenir.</p>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
           <p className="text-gray-500">Henüz hiç görsel bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {images.map((item, idx) => (
             <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={item.url} 
                  alt={item.productName} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                   <p className="text-white text-xs text-center font-medium line-clamp-2 mb-2 absolute bottom-2 left-2 right-2">
                     {item.productName}
                   </p>
                   <a 
                     href={item.url} 
                     target="_blank" 
                     rel="noreferrer"
                     className="p-2 bg-white rounded-full text-black hover:bg-gray-100"
                     title="Orijinali Gör"
                   >
                     <ExternalLink className="h-4 w-4" />
                   </a>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
