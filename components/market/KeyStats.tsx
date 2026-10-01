'use client';

import { useMarketData, fmtPrice, ChangeBadge } from './MarketDataProvider';

/** Öne çıkan göstergeler (koyu zemin üzerinde) */
export default function KeyStats({ keys = ['GRAM', 'CEYREK', 'USD', 'ONS'], tone = 'dark' }: { keys?: string[]; tone?: 'dark' | 'light' }) {
  const { rates, changedKeys } = useMarketData();
  const items = keys.map(k => rates.find(r => r.key === k)).filter((r): r is NonNullable<typeof r> => !!r);
  const dark = tone === 'dark';

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px ${dark ? 'bg-white/10 border border-white/10' : 'bg-line border border-line'}`}>
      {items.map(r => (
        <div key={r.key} className={`p-5 md:p-7 transition-colors duration-700 ${dark ? (changedKeys.has(r.key) ? 'bg-[#2a251e]' : 'bg-ink') : (changedKeys.has(r.key) ? 'bg-[#F4EBDD]' : 'bg-white')}`}>
          <p className={`eyebrow !text-[10px] ${dark ? 'text-white/50' : 'text-muted'}`}>{r.name}</p>
          <p className={`mt-3 text-[26px] md:text-[32px] font-light leading-none tabular-nums tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
            {fmtPrice(r.sell)}<span className={`ml-1 text-base ${dark ? 'text-white/50' : 'text-muted'}`}>{r.currency === 'USD' ? '$' : '₺'}</span>
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 text-xs">
            <ChangeBadge value={r.changePercent} tone={dark ? 'dark' : 'light'} />
            <span className={`tabular-nums ${dark ? 'text-white/40' : 'text-muted'}`}>Alış {fmtPrice(r.buy)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
