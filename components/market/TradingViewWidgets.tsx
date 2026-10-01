'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * TradingView'in resmî, ücretsiz gömülebilir widget'ları.
 * Widget betiği, yapılandırmayı kendi <script> içeriğinden okur; bu yüzden her değişiklikte
 * kapsayıcı temizlenip betik yeniden eklenir. Betik kapsayıcının yüksekliğini "100%" yaptığı için
 * sabit yükseklik her zaman bir dış kutuda verilir. Kullanım koşulları gereği kaynak linki korunur.
 */
function useTradingViewWidget(scriptName: string, config: Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);
  const configJson = JSON.stringify(config);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    widget.style.height = '100%';
    widget.style.width = '100%';
    container.appendChild(widget);
    const script = document.createElement('script');
    script.src = `https://s3.tradingview.com/external-embedding/${scriptName}`;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = configJson;
    container.appendChild(script);
    return () => { container.innerHTML = ''; };
  }, [scriptName, configJson]);

  return ref;
}

function Attribution() {
  return (
    <p className="mt-3 text-[11px] text-muted">
      Grafik ve takvim verileri{' '}
      <a href="https://tr.tradingview.com/" target="_blank" rel="noopener nofollow" className="underline underline-offset-2 hover:text-ink">TradingView</a>
      {' '}tarafından sağlanmaktadır.
    </p>
  );
}

export const CHART_SYMBOLS = [
  { symbol: 'FX_IDC:XAUTRYG', label: 'Gram Altın' },
  { symbol: 'OANDA:XAUUSD', label: 'Ons Altın' },
  { symbol: 'FX:USDTRY', label: 'Dolar / TL' },
  { symbol: 'FX_IDC:EURTRY', label: 'Euro / TL' },
  { symbol: 'OANDA:XAGUSD', label: 'Gümüş' },
];

/** Sekmeli, etkileşimli fiyat grafiği */
export function MarketChart({ height = 520 }: { height?: number }) {
  const [symbol, setSymbol] = useState(CHART_SYMBOLS[0].symbol);
  const ref = useTradingViewWidget('embed-widget-advanced-chart.js', {
    autosize: true,
    symbol,
    interval: 'D',
    range: '12M',
    timezone: 'Europe/Istanbul',
    theme: 'light',
    style: '3', // Alan grafiği: sade ve okunaklı
    locale: 'tr',
    backgroundColor: '#ffffff',
    gridColor: 'rgba(230, 224, 214, 0.6)',
    allow_symbol_change: false,
    hide_side_toolbar: true,
    hide_volume: true,
    save_image: false,
    calendar: false,
    support_host: 'https://www.tradingview.com',
  });

  return (
    <div>
      <div role="tablist" aria-label="Grafik sembolü" className="flex gap-1 overflow-x-auto no-scrollbar border-b border-line">
        {CHART_SYMBOLS.map(s => (
          <button
            key={s.symbol}
            role="tab"
            aria-selected={symbol === s.symbol}
            onClick={() => setSymbol(s.symbol)}
            className={`relative whitespace-nowrap px-4 py-3 text-xs tracking-[0.12em] uppercase transition-colors ${symbol === s.symbol ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {s.label}
            <span className={`absolute left-0 right-0 -bottom-px h-px transition-colors ${symbol === s.symbol ? 'bg-ink' : 'bg-transparent'}`} />
          </button>
        ))}
      </div>
      <div className="mt-4 bg-white" style={{ height }}><div ref={ref} className="tradingview-widget-container" /></div>
      <Attribution />
    </div>
  );
}

/** Ekonomik takvim */
export function EconomicCalendar({ height = 640 }: { height?: number }) {
  const ref = useTradingViewWidget('embed-widget-events.js', {
    colorTheme: 'light',
    isTransparent: true,
    width: '100%',
    height: '100%',
    locale: 'tr',
    importanceFilter: '0,1', // Orta ve yüksek önem
    countryFilter: 'tr,us,eu,gb,de,cn,jp',
  });

  return (
    <div>
      <div className="border border-line bg-white" style={{ height }}><div ref={ref} className="tradingview-widget-container" /></div>
      <Attribution />
    </div>
  );
}

/** Küçük, tek sembollü fiyat grafiği (ana sayfa özeti için) */
export function MiniChart({ symbol = 'FX_IDC:XAUTRYG', dateRange = '1M', height = 220 }: { symbol?: string; dateRange?: string; height?: number }) {
  const ref = useTradingViewWidget('embed-widget-mini-symbol-overview.js', {
    symbol,
    width: '100%',
    height: '100%',
    locale: 'tr',
    dateRange,
    colorTheme: 'light',
    isTransparent: true,
    autosize: true,
    largeChartUrl: '',
    chartOnly: false,
    noTimeScale: false,
  });
  return <div style={{ height }}><div ref={ref} className="tradingview-widget-container" /></div>;
}
