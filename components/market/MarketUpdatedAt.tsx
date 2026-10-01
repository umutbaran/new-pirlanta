'use client';

import { useMarketData } from './MarketDataProvider';

/** Kaynağın son güncelleme zamanı */
export default function MarketUpdatedAt() {
  const { updatedAt } = useMarketData();
  if (!updatedAt) return null;
  const time = updatedAt.split(' ')[1]?.slice(0, 5);
  return (
    <p className="text-xs text-white/50 shrink-0">
      Son güncelleme: <span className="text-white/80 tabular-nums">{time || updatedAt}</span>
      <span className="block mt-1">Veriler otomatik yenilenir</span>
    </p>
  );
}
