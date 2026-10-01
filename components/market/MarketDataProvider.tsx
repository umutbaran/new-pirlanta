'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Rate, RatesResult } from '@/lib/gold-rates';

interface MarketData {
  rates: Rate[];
  updatedAt: string | null;
  /** Son yenilemede fiyatı değişen kalemler (kısa süreli vurgulama için) */
  changedKeys: Set<string>;
  error: boolean;
}

const MarketDataContext = createContext<MarketData | null>(null);

const REFRESH_MS = 60_000; // Kaynak 5 dakikada bir güncellenir; dakikada bir kontrol yeterli

/**
 * Sunucuda hazırlanan fiyatlarla başlar, sayfa açıkken düzenli olarak yeniler.
 * Sekme arka plandayken istek atmaz, tekrar öne gelince hemen yeniler.
 */
export function MarketDataProvider({ initial, children }: { initial: RatesResult | null; children: React.ReactNode }) {
  const [data, setData] = useState<MarketData>({
    rates: initial?.rates || [],
    updatedAt: initial?.updatedAt || null,
    changedKeys: new Set(),
    error: !initial,
  });
  const previous = useRef<Map<string, number>>(new Map((initial?.rates || []).map(r => [r.key, r.sell])));

  useEffect(() => {
    let active = true;
    let clearTimer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/gold-rates');
        const json = await res.json();
        if (!active || !json.success) return;
        const changed = new Set<string>();
        for (const r of json.rates as Rate[]) {
          const old = previous.current.get(r.key);
          if (old !== undefined && old !== r.sell) changed.add(r.key);
          previous.current.set(r.key, r.sell);
        }
        setData({ rates: json.rates, updatedAt: json.updatedAt, changedKeys: changed, error: false });
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => active && setData(d => ({ ...d, changedKeys: new Set() })), 2500);
      } catch {
        if (active) setData(d => ({ ...d, error: d.rates.length === 0 }));
      }
    };

    if (!initial) load();
    const timer = setInterval(load, REFRESH_MS);
    document.addEventListener('visibilitychange', load);
    return () => {
      active = false;
      clearInterval(timer);
      clearTimeout(clearTimer);
      document.removeEventListener('visibilitychange', load);
    };
  }, [initial]);

  return <MarketDataContext.Provider value={data}>{children}</MarketDataContext.Provider>;
}

export function useMarketData(): MarketData {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error('useMarketData, MarketDataProvider içinde kullanılmalı');
  return ctx;
}

/** Ortak biçimlendiriciler */
export function fmtPrice(value: number) {
  const digits = Math.abs(value) < 10 ? 4 : 2;
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

export function ChangeBadge({ value, className = '', tone = 'light' }: { value: number | null; className?: string; tone?: 'light' | 'dark' }) {
  if (value === null) return <span className={`text-muted ${className}`}>–</span>;
  const up = value > 0, down = value < 0;
  // Koyu zeminde daha açık tonlar (okunabilirlik)
  const colors = tone === 'dark' ? ['text-[#9CC9A8]', 'text-[#E3A3A3]', 'text-white/50'] : ['text-[#2F7A4B]', 'text-[#A23B3B]', 'text-muted'];
  return (
    <span className={`relative inline-flex items-center gap-1 tabular-nums ${up ? colors[0] : down ? colors[1] : colors[2]} ${className}`}>
      <span aria-hidden className="text-[9px]">{up ? '▲' : down ? '▼' : '•'}</span>
      <span className="sr-only">{up ? 'Yükseliş' : down ? 'Düşüş' : 'Değişim yok'}</span>
      %{Math.abs(value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}
