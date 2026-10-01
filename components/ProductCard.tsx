'use client';

import Link from 'next/link';
import type { Product } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { useSiteConfig } from '@/context/SiteConfigContext';
import FavoriteButton from './FavoriteButton';
import SmartImage from './SmartImage';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const details = (product.details || {}) as Record<string, unknown>;
  const tasBilgisi = details.tas_bilgisi as Record<string, unknown> | undefined;
  const detail = (tasBilgisi?.karat as string) || (details.materyal as string) || product.subCategory || '';
  const [mainImage, hoverImage] = product.images;
  const { showPrices } = useSiteConfig();
  // Fiyatlar gizliyken indirim etiketi de gösterilmez (fiyat bilgisi verir)
  const hasDiscount = showPrices && !!product.oldPrice && product.oldPrice > product.price && product.price > 0;

  return (
    <article className="group relative">
      <Link href={`/urun/${product.id}`} className="block">
        {/* Görsel: ikinci fotoğraf varsa üzerine gelince yumuşak geçişle gösterilir */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          <SmartImage
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hoverImage && (
            <SmartImage
              src={hoverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-[900ms] group-hover:opacity-100"
            />
          )}
          {(product.isNew || hasDiscount) && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 eyebrow !text-[9px] !tracking-[0.18em] text-ink">
              {product.isNew ? 'Yeni' : 'İndirim'}
            </span>
          )}
        </div>

        <div className="pt-4 pb-2 text-center">
          <h3 className="font-display text-[17px] md:text-lg leading-snug text-ink line-clamp-2">
            {product.name}
          </h3>
          {detail && <p className="mt-1 text-xs text-muted line-clamp-1">{detail}</p>}
          {showPrices && (
          <div className="mt-2.5 text-[13px] tracking-wide">
            {product.price > 0 ? (
              <span className="flex items-baseline justify-center gap-2">
                <span className="text-ink font-medium tabular-nums">{formatPrice(product.price)}</span>
                {hasDiscount && <span className="text-muted line-through text-xs tabular-nums">{formatPrice(product.oldPrice!)}</span>}
              </span>
            ) : (
              <span className="text-gold-deep">Fiyat için iletişime geçin</span>
            )}
          </div>
          )}
        </div>
      </Link>

      <div className="absolute top-1 right-1">
        <FavoriteButton product={product} variant="icon" />
      </div>
    </article>
  );
}
