'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Rate {
  key: string;
  name: string;
  buy: string;
  sell: string;
  status: 'up' | 'down' | 'steady';
}

export default function MarketSidebar() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/gold-rates');
      const json = await res.json();
      const sourceData = json.data || [];
      
      const allowedKeys: Record<string, string> = {
        'HAS ALTIN': 'Has Altın',
        'GRAM ALTIN': 'Gram Altın',
        '22 AYAR': '22 Ayar',
        'USD/TRY': 'Dolar',
        'EUR/TRY': 'Euro'
      };

      const newRates: Rate[] = [];
      if (Array.isArray(sourceData)) {
        sourceData.forEach((item: any) => {
          const apiName = item.key.toUpperCase();
          if (allowedKeys[apiName]) {
            let status: 'up' | 'down' | 'steady' = 'steady';
            const degisim = parseFloat(item.degisim?.replace(',', '.') || '0');
            if (degisim > 0) status = 'up';
            else if (degisim < 0) status = 'down';

            newRates.push({
              key: apiName,
              name: allowedKeys[apiName],
              buy: item.buy,
              sell: item.sell,
              status
            });
          }
        });
      }
      setRates(newRates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />)}</div>;

  return (
    <div className="divide-y divide-gray-100">
      {rates.map((rate) => (
        <div key={rate.key} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center group">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{rate.name}</div>
            <div className="font-mono text-lg font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">{rate.sell}</div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${
              rate.status === 'up' ? 'bg-green-50 text-green-600' :
              rate.status === 'down' ? 'bg-red-50 text-red-600' :
              'bg-gray-50 text-gray-400'
            }`}>
              {rate.status === 'up' && <TrendingUp className="h-3 w-3" />}
              {rate.status === 'down' && <TrendingDown className="h-3 w-3" />}
              {rate.status === 'steady' && <Minus className="h-3 w-3" />}
              {rate.status.toUpperCase()}
            </div>
            <div className="text-[9px] text-gray-400 mt-1 uppercase">Makas: {rate.buy}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
