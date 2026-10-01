'use client';

import { useMemo, useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useMarketData, fmtPrice } from './MarketDataProvider';

type Mode = 'deger' | 'alim';

const UNIT_LABEL = { gram: 'gram', adet: 'adet', ons: 'ons', birim: 'birim' } as const;

/**
 * Altın / döviz hesaplayıcı:
 *  - "deger": Elimdeki X gram/adet şu an kaç TL eder? (satarken kuyumcunun alış fiyatı)
 *  - "alim":  Y TL ile kaç gram/adet alabilirim? (alırken kuyumcunun satış fiyatı)
 */
export default function GoldCalculator() {
  const { rates } = useMarketData();
  const options = useMemo(() => rates.filter(r => r.currency === 'TRY'), [rates]);
  const [key, setKey] = useState('GRAM');
  const [mode, setMode] = useState<Mode>('deger');
  const [amount, setAmount] = useState('10');

  const rate = options.find(r => r.key === key) || options[0];
  const value = Number(amount.replace(',', '.')) || 0;
  const unit = rate ? UNIT_LABEL[rate.unit] : '';

  const result = !rate ? 0 : mode === 'deger' ? value * rate.buy : value / rate.sell;

  const inputClass = "w-full bg-white border border-line px-4 py-3.5 text-ink focus:outline-none focus:border-ink transition-colors";

  return (
    <div className="bg-ivory border border-line p-6 sm:p-8">
      <div className="flex gap-1 p-1 bg-white border border-line" role="tablist" aria-label="Hesaplama türü">
        {([['deger', 'Altınım ne eder?'], ['alim', 'Ne kadar alırım?']] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            className={`flex-1 px-3 py-2.5 text-xs tracking-[0.08em] uppercase transition-colors ${mode === id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="calc-type" className="block eyebrow !text-[10px] text-ink-soft mb-2">Tür</label>
          <select id="calc-type" value={rate?.key || ''} onChange={e => setKey(e.target.value)} className={inputClass}>
            {options.map(r => <option key={r.key} value={r.key}>{r.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="calc-amount" className="block eyebrow !text-[10px] text-ink-soft mb-2">
            {mode === 'deger' ? `Miktar (${unit})` : 'Tutar (₺)'}
          </label>
          <input id="calc-amount" type="text" inputMode="decimal" value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
            className={`${inputClass} tabular-nums text-lg`} />
        </div>

        <div className="flex items-center gap-3 text-muted" aria-hidden>
          <span className="flex-1 h-px bg-line" /><ArrowDownUp className="h-4 w-4" strokeWidth={1.2} /><span className="flex-1 h-px bg-line" />
        </div>

        <div aria-live="polite">
          <p className="eyebrow !text-[10px] text-ink-soft">{mode === 'deger' ? 'Yaklaşık değeri' : `Alabileceğiniz miktar`}</p>
          <p className="mt-2 text-[32px] font-light text-ink tabular-nums tracking-tight">
            {mode === 'deger'
              ? `${fmtPrice(result)} ₺`
              : `${result.toLocaleString('tr-TR', { maximumFractionDigits: rate?.unit === 'adet' ? 2 : 3 })} ${unit}`}
          </p>
          {rate && (
            <p className="mt-2 text-xs text-muted">
              {mode === 'deger' ? `Alış fiyatı: ${fmtPrice(rate.buy)} ₺ / ${unit}` : `Satış fiyatı: ${fmtPrice(rate.sell)} ₺ / ${unit}`}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 pt-5 border-t border-line text-[11px] text-muted leading-relaxed">
        Hesaplama piyasa fiyatlarına göre yapılır; işçilik ve mağaza alış-satış farkı dahil değildir. Kesin fiyat için bize ulaşın.
      </p>
    </div>
  );
}
