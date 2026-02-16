'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, ExternalLink, Search } from 'lucide-react';
import { Product } from '@/data/products';

export default function MediaPage() {
  const [images, setImages] = useState<{url: string, productName: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();
      
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

  const filteredImages = images.filter(img => 
    img.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h1>
           <p className="text-gray-500 mt-1">Toplam {images.length} görsel listeleniyor.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Ürün adına göre ara..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
           />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
           <p className="text-gray-500">Görsel bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {filteredImages.map((item, idx) => (
             <div key={idx} className="group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image 
                      src={item.url} 
                      alt={item.productName} 
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <a 
                         href={item.url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="p-2 bg-white/90 rounded-full text-black hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-all"
                         title="Orijinali Gör"
                       >
                         <ExternalLink className="h-5 w-5" />
                       </a>
                    </div>
                </div>
                <div className="p-3">
                   <p className="text-xs font-medium text-gray-900 line-clamp-2" title={item.productName}>
                     {item.productName}
                   </p>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}