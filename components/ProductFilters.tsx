'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: '', label: 'Önerilen' },
  { value: 'yeni', label: 'En Yeniler' },
  { value: 'fiyat-artan', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'fiyat-azalan', label: 'Fiyat: Yüksekten Düşüğe' },
];

const COLOR_OPTIONS = [
  { label: 'Sarı Altın', value: 'Sarı' },
  { label: 'Beyaz Altın', value: 'Beyaz' },
  { label: 'Rose Altın', value: 'Rose' },
];

interface FilterProps {
  availableSubCategories?: { name: string; slug: string }[];
}

/** URL arama parametrelerini güncelleyen ortak yardımcı */
function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    searchParams,
    update(changes: Record<string, string | null>) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sub'); // Eski parametre adı
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value); else params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
  };
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 eyebrow text-ink" aria-expanded={open}>
        {title}
        <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function OptionList({ options, selected, onSelect }: { options: { label: string; value: string }[]; selected: string | null; onSelect: (value: string | null) => void }) {
  return (
    <ul className="space-y-1">
      {options.map(option => {
        const isSelected = selected === option.value;
        return (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => onSelect(isSelected ? null : option.value)}
              aria-pressed={isSelected}
              className="w-full flex items-center gap-3 py-1.5 text-left text-sm group"
            >
              <span className={`h-4 w-4 border flex items-center justify-center transition-colors ${isSelected ? 'border-ink bg-ink' : 'border-line group-hover:border-ink'}`}>
                {isSelected && <span className="h-1.5 w-1.5 bg-white" />}
              </span>
              <span className={isSelected ? 'text-ink' : 'text-ink-soft group-hover:text-ink'}>{option.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterPanel({ availableSubCategories = [], onApplied }: FilterProps & { onApplied?: () => void }) {
  const { searchParams, update } = useQueryUpdater();
  const [price, setPrice] = useState({ min: searchParams.get('min') || '', max: searchParams.get('max') || '' });

  // URL dışarıdan değişirse (ör. filtre temizleme) fiyat kutularını eşitle
  useEffect(() => {
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrice(prev => (prev.min !== min || prev.max !== max) ? { min, max } : prev);
  }, [searchParams]);

  const select = (key: string) => (value: string | null) => { update({ [key]: value }); onApplied?.(); };
  const inputClass = "w-full border border-line bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-ink tabular-nums";

  return (
    <div>
      {availableSubCategories.length > 0 && (
        <FilterSection title="Ürün Tipi">
          <OptionList
            options={availableSubCategories.map(s => ({ label: s.name, value: s.slug }))}
            selected={searchParams.get('subCategory') || searchParams.get('sub')}
            onSelect={select('subCategory')}
          />
        </FilterSection>
      )}
      <FilterSection title="Renk">
        <OptionList options={COLOR_OPTIONS} selected={searchParams.get('renk')} onSelect={select('renk')} />
      </FilterSection>
      <FilterSection title="Fiyat Aralığı (₺)">
        <form
          onSubmit={(e) => { e.preventDefault(); update({ min: price.min || null, max: price.max || null }); onApplied?.(); }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <input type="number" inputMode="numeric" min={0} placeholder="En az" aria-label="En az fiyat" value={price.min} onChange={e => setPrice({ ...price, min: e.target.value })} className={inputClass} />
            <span className="text-muted">–</span>
            <input type="number" inputMode="numeric" min={0} placeholder="En çok" aria-label="En çok fiyat" value={price.max} onChange={e => setPrice({ ...price, max: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" className="btn-outline w-full !min-h-10">Uygula</button>
        </form>
      </FilterSection>
    </div>
  );
}

/** Masaüstü: kenar çubuğu filtreleri */
export default function ProductFilters(props: FilterProps) {
  return (
    <div className="hidden lg:block">
      <FilterPanel {...props} />
    </div>
  );
}

/** Mobil: "Filtrele" butonu ve alttan açılan panel */
export function MobileFilters({ activeCount, resultCount, ...props }: FilterProps & { activeCount: number; resultCount: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 eyebrow text-ink py-2">
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} />
        Filtrele{activeCount > 0 && ` (${activeCount})`}
      </button>

      <div className={`fixed inset-0 z-[60] ${open ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <div className={`absolute inset-x-0 bottom-0 max-h-[85svh] bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-y-0' : 'translate-y-full'}`} role="dialog" aria-label="Filtreler">
          <div className="flex items-center justify-between px-5 h-14 border-b border-line">
            <span className="eyebrow text-ink">Filtreler</span>
            <button type="button" onClick={() => setOpen(false)} className="p-2 -mr-2" aria-label="Filtreleri kapat"><X className="h-5 w-5" strokeWidth={1.4} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterPanel {...props} />
          </div>
          <div className="p-4 border-t border-line">
            <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">{resultCount} Ürünü Göster</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sıralama seçimi */
export function SortSelect() {
  const { searchParams, update } = useQueryUpdater();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only lg:not-sr-only text-muted">Sırala:</span>
      <select
        value={searchParams.get('sirala') || ''}
        onChange={(e) => update({ sirala: e.target.value || null })}
        className="bg-transparent text-ink pr-1 py-2 focus:outline-none cursor-pointer"
      >
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
