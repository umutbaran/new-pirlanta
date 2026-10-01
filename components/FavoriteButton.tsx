'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import type { Product } from '@/lib/db';

interface FavoriteButtonProps {
  product: Product;
  /** icon: ürün kartının köşesindeki sade ikon; full: ürün sayfasındaki çerçeveli buton */
  variant?: 'icon' | 'full';
}

export default function FavoriteButton({ product, variant = 'full' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(product.id);
  const label = active ? 'Favorilerden çıkar' : 'Favorilere ekle';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={label}
        aria-pressed={active}
        className="m-1.5 h-9 w-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-ink/80 hover:text-ink transition-colors"
      >
        <Heart className={`h-[18px] w-[18px] transition-transform duration-300 active:scale-90 ${active ? 'fill-ink text-ink' : ''}`} strokeWidth={1.4} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(product)}
      aria-label={label}
      aria-pressed={active}
      className={`h-12 w-12 shrink-0 border flex items-center justify-center transition-colors ${active ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-ink'}`}
    >
      <Heart className={`h-[18px] w-[18px] ${active ? 'fill-current' : ''}`} strokeWidth={1.4} />
    </button>
  );
}
