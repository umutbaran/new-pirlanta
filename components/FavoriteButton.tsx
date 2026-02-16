'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/data/products';

interface FavoriteButtonProps {
  product: Product;
}

export default function FavoriteButton({ product }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(product.id);

  return (
    <button 
      onClick={() => toggleFavorite(product)}
      className={`w-16 border flex items-center justify-center transition-all duration-300 rounded-sm group relative overflow-hidden ${
        active 
        ? 'border-red-200 bg-red-50 text-red-500' 
        : 'border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400'
      }`}
      aria-label={active ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    >
      <Heart className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'fill-current' : ''}`} />
    </button>
  );
}