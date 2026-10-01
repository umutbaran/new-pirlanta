'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ProductCard';
import PageHeader from '@/components/PageHeader';

export default function FavoritesPage() {
  const { favorites, isLoaded, syncWithCatalog } = useFavorites();
  const hasFavorites = favorites.length > 0;

  // Favoriler yüklendikten sonra bir kez güncel ürün bilgileriyle eşitle
  useEffect(() => {
    if (!isLoaded || !hasFavorites) return;
    fetch('/api/products')
      .then(res => (res.ok ? res.json() : null))
      .then(catalog => { if (Array.isArray(catalog)) syncWithCatalog(catalog); })
      .catch(() => { /* Ağ hatasında saklanan liste gösterilmeye devam eder */ });
  }, [isLoaded, hasFavorites, syncWithCatalog]);

  return (
    <div>
      <PageHeader title="Favorilerim" description="Beğendiğiniz parçaların kişisel koleksiyonu. Bu cihazda saklanır." />

      <div className="container-lux py-12 md:py-20">
        {!isLoaded ? (
          <div className="h-64" aria-busy="true" />
        ) : hasFavorites ? (
          <>
            <p className="text-sm text-muted pb-4 border-b border-line">{favorites.length} ürün</p>
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto">
            <Heart className="h-8 w-8 text-gold mx-auto" strokeWidth={1} />
            <h2 className="mt-6 font-display text-3xl text-ink">Listeniz henüz boş</h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Beğendiğiniz ürünlerdeki kalp simgesine dokunarak onları burada saklayabilir, daha sonra kolayca bulabilirsiniz.
            </p>
            <Link href="/koleksiyon/tum-urunler" className="btn-primary mt-8">Koleksiyonu Keşfet</Link>
          </div>
        )}
      </div>
    </div>
  );
}
