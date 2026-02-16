'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

interface GoldRate {
  key: string;
  name: string;
  sell: string;
  degisim: string;
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
      // Adjust structure based on your API response
      // Assuming data.data is the array based on your route.ts
      if (data.data) {
        setRates(data.data.slice(0, 4)); // Show top 4 items (Gram, Has, 22, 14 usually)
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
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#D4AF37] opacity-20 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
                <h3 className="font-bold text-lg">Piyasa Özeti</h3>
                <p className="text-gray-400 text-xs">Son güncelleme: {lastUpdate}</p>
            </div>
            <button 
                onClick={fetchRates} 
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${loading ? 'animate-spin' : ''}`}
            >
                <RefreshCcw className="h-4 w-4 text-[#D4AF37]" />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
            {loading ? (
                // Skeletons
                [1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                        <div className="h-6 bg-white/10 rounded w-full"></div>
                    </div>
                ))
            ) : (
                rates.map((rate) => {
                    const isUp = parseFloat(rate.degisim.replace(',', '.')) >= 0;
                    return (
                        <div key={rate.key} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs text-gray-400">{rate.name}</span>
                                <span className={`text-[10px] flex items-center gap-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    %{rate.degisim}
                                </span>
                            </div>
                            <div className="font-mono text-lg font-semibold tracking-tight">
                                {rate.sell} <span className="text-xs text-[#D4AF37]">₺</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
}
