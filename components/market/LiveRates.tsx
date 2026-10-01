'use client';

import { useState } from 'react';
import type { RateGroup } from '@/lib/gold-rates';
import { useMarketData, fmtPrice, ChangeBadge } from './MarketDataProvider';

const TABS: { id: RateGroup; label: string }[] = [
  { id: 'altin', label: 'Altın' },
  { id: 'doviz', label: 'Döviz' },
  { id: 'maden', label: 'Değerli Madenler' },
];

const UNIT_LABEL = { gram: 'gram', adet: 'adet', ons: 'ons', birim: '' } as const;

export default function LiveRates() {
  const { rates, changedKeys, error } = useMarketData();
  const [tab, setTab] = useState<RateGroup>('altin');
  const items = rates.filter(r => r.group === tab);

  return (
    <div>
      {/* Sekmeler */}
      <div role="tablist" aria-label="Piyasa grupları" className="flex gap-1 p-1 bg-ivory border border-line w-full sm:w-auto sm:inline-flex overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 sm:flex-none whitespace-nowrap px-5 py-2.5 text-xs tracking-[0.12em] uppercase transition-colors ${tab === t.id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && rates.length === 0 ? (
        <p className="mt-6 py-10 text-center text-ink-soft border-y border-line">Piyasa verileri şu anda alınamıyor. Lütfen birkaç dakika sonra tekrar deneyin.</p>
      ) : (
        <div role="tabpanel" className="mt-6">
          {/* Masaüstü: tablo */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-3 pr-4 eyebrow !text-[10px] text-muted font-medium">Birim</th>
                <th className="py-3 px-4 eyebrow !text-[10px] text-muted font-medium text-right">Alış</th>
                <th className="py-3 px-4 eyebrow !text-[10px] text-muted font-medium text-right">Satış</th>
                <th className="py-3 px-4 eyebrow !text-[10px] text-muted font-medium text-right">Fark</th>
                <th className="py-3 pl-4 eyebrow !text-[10px] text-muted font-medium text-right">Günlük</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => {
                const sym = r.currency === 'USD' ? '$' : '₺';
                return (
                  <tr key={r.key} className={`border-b border-line transition-colors duration-700 ${changedKeys.has(r.key) ? 'bg-[#F4EBDD]' : ''}`}>
                    <td className="py-4 pr-4">
                      <span className="font-display text-xl text-ink">{r.name}</span>
                      {UNIT_LABEL[r.unit] && <span className="ml-2 text-xs text-muted">/ {UNIT_LABEL[r.unit]}</span>}
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums text-ink-soft">{fmtPrice(r.buy)} {sym}</td>
                    <td className="py-4 px-4 text-right tabular-nums text-ink font-medium">{fmtPrice(r.sell)} {sym}</td>
                    <td className="py-4 px-4 text-right tabular-nums text-muted text-xs">{fmtPrice(Math.max(r.sell - r.buy, 0))}</td>
                    <td className="py-4 pl-4 text-right"><ChangeBadge value={r.changePercent} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobil: liste */}
          <ul className="md:hidden border-t border-ink">
            {items.map(r => {
              const sym = r.currency === 'USD' ? '$' : '₺';
              return (
                <li key={r.key} className={`flex items-center justify-between gap-4 py-4 border-b border-line transition-colors duration-700 ${changedKeys.has(r.key) ? 'bg-[#F4EBDD]' : ''}`}>
                  <div className="min-w-0">
                    <p className="font-display text-lg text-ink leading-tight">{r.name}</p>
                    <p className="text-xs text-muted tabular-nums mt-0.5">Alış {fmtPrice(r.buy)} {sym}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-ink font-medium tabular-nums">{fmtPrice(r.sell)} {sym}</p>
                    <ChangeBadge value={r.changePercent} className="text-xs" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
