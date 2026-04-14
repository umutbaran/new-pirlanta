import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/db';
import FavoriteButton from './FavoriteButton';

export default function ProductCard({ product }: { product: Product }) {
  // Gösterilecek ana özellik
  const details = (product.details || {}) as Record<string, unknown>;
  const tasBilgisi = details.tas_bilgisi as Record<string, unknown> | undefined;
  const mainFeature = tasBilgisi 
    ? (tasBilgisi.karat as string) 
    : (details.materyal as string) || "";

  return (
    <div className="group block bg-white hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden border border-gray-100 hover:border-[#D4AF37]/20 h-full flex flex-col relative">
      
      {/* Favori Butonu (Üst Sağ) */}
      <div className="absolute top-2 right-2 z-30">
         <FavoriteButton product={product} />
      </div>

      <Link href={`/urun/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            {/* Etiketler */}
            {product.isNew && (
            <div className="absolute top-3 left-3 bg-[#D4AF37] text-white text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-1 z-20 tracking-widest uppercase shadow-sm">
                Yeni
            </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 duration-500" />
            <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 w-full px-6 text-center hidden md:block">
                <span className="inline-block w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] py-4 shadow-2xl hover:bg-[#D4AF37] transition-colors border border-transparent">
                  Detaylı İncele
                </span>
            </div>
        </div>
        
        <div className="p-4 md:p-6 text-center flex flex-col justify-between flex-1">
            <div className="space-y-1 md:space-y-2">
                <p className="text-[9px] md:text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em]">{product.category.replace('-', ' ')}</p>
                <h3 className="text-[11px] md:text-sm font-serif text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2 min-h-[2.2rem] md:min-h-[2.5rem] px-2">
                    {product.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium italic">{mainFeature}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50">
                {product.price > 0 ? (
                    <div className="flex flex-col items-center">
                        <span className="text-xs md:text-sm font-bold text-gray-900">{product.price.toLocaleString('tr-TR')} ₺</span>
                        {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">{product.oldPrice.toLocaleString('tr-TR')} ₺</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Fiyat Alın</span>
                )}
                
                {/* Mobil için küçük bir ok veya yazı */}
                <div className="md:hidden mt-2 text-[8px] font-black text-gray-300 uppercase tracking-tighter flex items-center justify-center gap-1 group-hover:text-[#D4AF37] transition-colors">
                    İncelemek İçin Dokun <div className="w-4 h-[1px] bg-gray-200 group-hover:bg-[#D4AF37]" />
                </div>
            </div>
        </div>
      </Link>
    </div>
  );
}
