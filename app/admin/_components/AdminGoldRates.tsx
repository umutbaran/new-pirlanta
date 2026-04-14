'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

interface GoldRate {
  key: string;
  name: string;
  buy: string;
  sell: string;
  trend: 'up' | 'down' | 'steady';
}

export default function AdminGoldRates() {
  const [rates, setRates] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gold-rates');
      const data = await res.json();
      if (data.success && data.data) {
        setRates(data.data.slice(0, 6)); // Gram, Has, 22, 14, USD, EUR
        setLastUpdate(new Date().toLocaleTimeString('tr-TR'));
      }
    } catch (error) {
      console.error('Rates fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg relative overflow-hidden h-full">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#D4AF37] opacity-20 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
                <h3 className="font-bold text-lg">Piyasa Analizi</h3>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">Son Güncelleme: {lastUpdate}</p>
            </div>
            <button 
                onClick={fetchRates} 
                className={`p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${loading ? 'animate-spin' : 'active:scale-95'}`}
            >
                <RefreshCcw className="h-4 w-4 text-[#D4AF37]" />
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 relative z-10">
            {loading ? (
                // Skeletons
                [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl animate-pulse border border-white/5">
                        <div className="h-3 bg-white/10 rounded w-1/2 mb-3"></div>
                        <div className="h-5 bg-white/10 rounded w-full"></div>
                    </div>
                ))
            ) : (
                rates.map((rate) => {
                    const isUp = rate.trend === 'up';
                    const isDown = rate.trend === 'down';
                    return (
                        <div key={rate.key} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 transition-all group">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{rate.name}</span>
                                <div className={`p-1 rounded-md ${isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-400'}`}>
                                    {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <RefreshCcw className="h-3 w-3" />}
                                </div>
                            </div>
                            <div className="font-mono text-base font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                                {rate.sell} <span className="text-[10px] text-gray-500 font-normal">₺</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
}
