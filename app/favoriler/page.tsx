'use client';

import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Başlık */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Favorilerim</h1>
          <p className="text-gray-500 font-light text-sm md:text-base">
             Beğendiğiniz ürünlerin kişisel koleksiyonu.
          </p>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-6"></div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-sm border border-gray-100 border-dashed">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Heart className="h-8 w-8 text-gray-300" />
             </div>
             <h2 className="text-xl font-serif text-gray-900 mb-2">Listeniz Henüz Boş</h2>
             <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
                Henüz favorilerinize bir ürün eklemediniz. Koleksiyonlarımızı inceleyerek beğendiğiniz parçaları buraya ekleyebilirsiniz.
             </p>
             <Link 
               href="/koleksiyon/tum-urunler" 
               className="bg-[#111] text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] transition-all flex items-center gap-2"
             >
                Koleksiyonu Keşfet
                <ArrowRight className="h-4 w-4" />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
