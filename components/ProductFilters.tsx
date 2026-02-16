'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options: { label: string; value: string }[];
}

const filters: FilterOption[] = [
  {
    id: 'subCategory',
    label: 'Ürün Tipi',
    options: [
      { label: 'Yüzük', value: 'yuzuk' },
      { label: 'Kolye', value: 'kolye' },
      { label: 'Küpe', value: 'kupe' },
      { label: 'Bileklik', value: 'bileklik' },
      { label: 'Alyans', value: 'alyans' },
    ],
  },
  {
    id: 'renk',
    label: 'Renk',
    options: [
      { label: 'Beyaz Altın', value: 'Beyaz' },
      { label: 'Sarı Altın', value: 'Sarı' },
      { label: 'Rose Altın', value: 'Rose' },
    ],
  }
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || ''
  });

  // URL değiştikçe priceRange'i güncellemek gerekebilir (örneğin temizle butonu gelirse)
  // Ancak şimdilik sadece inputları kontrol ediyor.
  // Eğer dışarıdan URL değişirse inputların senkron kalması isteniyorsa:
  useEffect(() => {
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriceRange(prev => (prev.min !== min || prev.max !== max) ? { min, max } : prev);
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      // Eğer zaten seçiliyse kaldır (Toggle mantığı)
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    } else {
      params.delete(key);
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange.min) params.set('min', priceRange.min); else params.delete('min');
    if (priceRange.max) params.set('max', priceRange.max); else params.delete('max');
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false); // Mobilde kapat
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 text-sm font-bold text-gray-900 border border-gray-200 px-4 py-2 rounded-lg"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filtrele
      </button>

      {/* Filter Sidebar / Modal */}
      <div className={`
        fixed inset-0 z-50 bg-black/50 transition-opacity md:static md:bg-transparent md:inset-auto md:block
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}
      `}>
         <div className={`
            fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl transition-transform duration-300 md:static md:h-auto md:w-64 md:shadow-none md:p-0 md:transform-none md:border-r md:border-gray-100 md:pr-8
            ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
         `}>
            
            <div className="flex justify-between items-center mb-6 md:hidden">
               <span className="font-bold text-lg">Filtreler</span>
               <button onClick={() => setIsOpen(false)}><X className="h-6 w-6" /></button>
            </div>

            <div className="space-y-8">
               
               {/* Fiyat Filtresi */}
               <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Fiyat Aralığı</h3>
                  <div className="flex items-center gap-2 mb-3">
                     <input 
                       type="number" 
                       placeholder="Min" 
                       value={priceRange.min}
                       onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                     />
                     <span className="text-gray-400">-</span>
                     <input 
                       type="number" 
                       placeholder="Max" 
                       value={priceRange.max}
                       onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                     />
                  </div>
                  <button 
                    onClick={applyPriceFilter}
                    className="w-full bg-black text-white text-xs font-bold py-2 rounded uppercase tracking-wider hover:bg-[#D4AF37] transition-colors"
                  >
                    Uygula
                  </button>
               </div>

               {/* Kategori Filtreleri */}
               {filters.map((group) => (
                  <div key={group.id}>
                     <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">{group.label}</h3>
                     <div className="space-y-3">
                        {group.options.map((option) => {
                           const isSelected = searchParams.get(group.id) === option.value;
                           return (
                             <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                   {isSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <input 
                                  type="checkbox" 
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() => updateFilter(group.id, option.value)}
                                />
                                <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{option.label}</span>
                             </label>
                           );
                        })}
                     </div>
                  </div>
               ))}

            </div>
         </div>
         
         {/* Backdrop Close (Mobile) */}
         <div className="md:hidden absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
      </div>
    </>
  );
}
