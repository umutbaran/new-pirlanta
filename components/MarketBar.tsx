'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Rate } from '@/lib/gold-rates';

// Üst barda gösterilecek kalemler ve sırası
const SHOWN: Rate['key'][] = ['GRAM', 'AYAR22', 'CEYREK', 'USD', 'EUR'];

const fmt = (v: number) => v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Change({ value }: { value: number | null }) {
  if (value === null) return null;
  const up = value > 0;
  const down = value < 0;
  return (
    <span className={`tabular-nums ${up ? 'text-[#9CC9A8]' : down ? 'text-[#E3A3A3]' : 'text-white/40'}`}>
      <span aria-hidden>{up ? '▲' : down ? '▼' : '•'}</span>
      <span className="sr-only">{up ? 'yükseliş' : down ? 'düşüş' : 'değişim yok'}</span>
      {' '}%{Math.abs(value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export default function MarketBar() {
  const [rates, setRates] = useState<Rate[] | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetch('/api/gold-rates')
        .then(res => res.json())
        .then(json => { if (active && json.success) setRates(json.rates); })
        .catch(() => { /* Ağ hatasında mevcut veri kalır */ });
    load();
    const timer = setInterval(load, 60_000); // Kaynak 5 dakikada bir güncellenir
    return () => { active = false; clearInterval(timer); };
  }, []);

  const items = (rates || []).filter(r => SHOWN.includes(r.key)).sort((a, b) => SHOWN.indexOf(a.key) - SHOWN.indexOf(b.key));

  return (
    <div className="bg-ink text-white/85 text-[11px] h-9 border-b border-white/5" aria-label="Canlı piyasa fiyatları">
      <div className="container-lux h-full flex items-center gap-6">
        <span className="hidden lg:inline eyebrow text-gold shrink-0 !text-[10px]">Canlı Piyasa</span>
        <ul className="flex-1 min-w-0 flex items-center gap-6 lg:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap lg:justify-center">
          {items.map(r => (
            <li key={r.key} className="relative flex items-center gap-2 shrink-0">
              <span className="text-white/55">{r.name}</span>
              <span className="tabular-nums font-medium text-white">{fmt(r.sell)} ₺</span>
              <Change value={r.changePercent} />
            </li>
          ))}
          {rates === null && <li className="text-white/40">Piyasa verileri yükleniyor…</li>}
        </ul>
        <Link href="/bulten" className="hidden md:inline shrink-0 text-white/60 hover:text-white transition-colors eyebrow !text-[10px]">
          Tüm Piyasa →
        </Link>
      </div>
    </div>
  );
}
