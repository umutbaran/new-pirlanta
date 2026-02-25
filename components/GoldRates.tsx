'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DisplayRate {
  key: string;
  name: string;
  buy: string;
  sell: string;
  status: 'up' | 'down' | 'steady';
}

export default function GoldRates() {
  const [rates, setRates] = useState<DisplayRate[]>([]);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(`/api/gold-rates?t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        const sourceData = json.data || [];
        if (sourceData.length === 0) return;

        const newRates: DisplayRate[] = (sourceData as Record<string, string | number>[]).map((item) => ({
            key: String(item.key),
            name: String(item.name),
            buy: String(item.buy || "0"),
            sell: String(item.sell || "0"),
            status: (item.trend as 'up' | 'down' | 'steady') || 'steady'
        }));

        setRates(newRates);
      } catch (err) {
        console.error("Gold fetch error:", err);
      }
    }

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (rates.length === 0) return <div className="h-full w-full bg-[#121212]"></div>;

  return (
    <div className="flex items-center h-full overflow-hidden text-[10px] md:text-xs font-medium tracking-wide">
      <div className="flex animate-scroll whitespace-nowrap hover:pause py-2">
        {[...rates, ...rates, ...rates, ...rates].map((rate, idx) => (
          <div key={idx} className="flex items-center gap-4 mx-6 border-r border-white/10 pr-6 last:border-0 group cursor-default">
            <div className="flex items-center gap-2">
               <span className="text-[#D4AF37] uppercase font-bold tracking-tighter">{rate.name}</span>
               {rate.status === 'up' && <TrendingUp className="h-3 w-3 text-green-400 fill-green-400/20" />}
               {rate.status === 'down' && <TrendingDown className="h-3 w-3 text-red-400 fill-red-400/20" />}
               {rate.status === 'steady' && <Minus className="h-3 w-3 text-white/20" />}
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end leading-none">
                 <span className="text-[7px] text-white/40 uppercase mb-1">Alış</span>
                 <span className="text-gray-300 font-mono text-[10px]">{rate.buy}</span>
               </div>
               <div className="flex flex-col items-end leading-none">
                 <span className="text-[7px] text-white/40 uppercase mb-1">Satış</span>
                 <span className={`font-mono font-bold text-[10px] ${
                    rate.status === 'up' ? 'text-green-400' : 
                    rate.status === 'down' ? 'text-red-400' : 'text-white'
                 }`}>
                    {rate.sell}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
