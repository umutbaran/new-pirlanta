import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import FavoriteButton from './FavoriteButton';

export default function ProductCard({ product }: { product: Product }) {
  // Gösterilecek ana özellik
  const mainFeature = product.details.tas_bilgisi 
    ? product.details.tas_bilgisi.karat 
    : product.details.materyal;

  return (
    <div className="group block bg-white hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden border border-transparent hover:border-gray-100 h-full flex flex-col relative">
      
      {/* Favori Butonu (Üst Sağ) */}
      <div className="absolute top-2 right-2 z-30">
         <FavoriteButton product={product} />
      </div>

      <Link href={`/urun/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
            {/* Etiketler */}
            {product.isNew && (
            <div className="absolute top-0 left-0 bg-[#1a1a1a] text-white text-[10px] font-bold px-3 py-1 z-20 tracking-widest uppercase">
                Yeni
            </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 duration-500" />
            <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Buton */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-20 w-full px-4 text-center">
                <span className="inline-block w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 shadow-lg hover:bg-[#D4AF37] hover:text-white transition-colors">
                İncele
                </span>
            </div>
        </div>
        
        <div className="p-4 text-center flex flex-col justify-between flex-1">
            <div>
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2 font-serif min-h-[2.5rem]">
                {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">{mainFeature}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-3 mt-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Ürün Kodu</span>
            <span className="font-mono text-xs text-gray-600">{product.sku}</span>
            </div>
        </div>
      </Link>
    </div>
  );
}
