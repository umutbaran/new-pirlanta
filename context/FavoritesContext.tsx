'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/lib/db';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  isLoaded: boolean;
  syncWithCatalog: (catalog: Product[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sayfa yüklendiğinde LocalStorage'dan verileri çek
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Favoriler değiştiğinde LocalStorage'ı güncelle
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id); // Varsa çıkar
      } else {
        return [...prev, product]; // Yoksa ekle
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  // Tarayıcıda saklanan ürün kopyalarını güncel katalogla eşitle: fiyat/görsel güncellenir, silinen ürünler çıkarılır
  const syncWithCatalog = useCallback((catalog: Product[]) => {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    setFavorites((prev) => prev.filter((p) => byId.has(p.id)).map((p) => byId.get(p.id)!));
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoaded, syncWithCatalog }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
