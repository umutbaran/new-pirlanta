'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DisplayRate {
  key: string; // Karşılaştırma için benzersiz anahtar
  name: string;
  buy: string;
  sell: string;
  status: 'up' | 'down' | 'steady';
}

export default function GoldRates() {
  const [rates, setRates] = useState<DisplayRate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Önceki fiyatları hafızada tutmak için Ref kullanıyoruz
  const prevRatesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // 1. Başlangıçta LocalStorage'dan eski fiyatları yükle
    try {
      const savedRates = localStorage.getItem('prevGoldRates');
      if (savedRates) {
        prevRatesRef.current = JSON.parse(savedRates);
      }
    } catch (e) {
      console.error('Cache okuma hatası', e);
    }

    async function fetchRates() {
      try {
        const res = await fetch('/api/gold-rates');
        const json = await res.json();
        
        // DEBUG: API'den ne geliyor görelim
        console.log("API Response:", json);

        const sourceData = json.data || []; 
        const newRates: DisplayRate[] = [];

        const allowedKeys: Record<string, string> = {
            'HAS ALTIN': 'Has Altın',
            'GRAM ALTIN': 'Gram Altın',
            '22 AYAR': '22 Ayar',
            '14 AYAR': '14 Ayar',
            'ONS': 'Ons Altın',
            'GUMUS': 'Gümüş / TL',
            'GÜMÜŞ': 'Gümüş / TL',
            'USD/TRY': 'Dolar',
            'EUR/TRY': 'Euro'
        };

        const currentRatesMap: Record<string, number> = {};

        if (Array.isArray(sourceData)) {
            sourceData.forEach((item: { key: string; buy: string; sell: string; degisim?: string }) => {
                const apiName = item.key.toUpperCase();
                
                if (allowedKeys[apiName]) {
                    // Fiyatı parse et
                    const rawSell = String(item.sell).replace(/\./g, '').replace(',', '.');
                    const currentPrice = parseFloat(rawSell);
                    
                    // Hafızadaki eski fiyatı al
                    const prevPrice = prevRatesRef.current[apiName];

                    let status: 'up' | 'down' | 'steady' = 'steady';

                    // 1. API'den gelen 'degisim' verisini daha agresif parse et
                    // Örn: "%0,45", "-0.23", "%-1,20", "0,15"
                    const rawChangeStr = String(item.degisim || '').replace('%', '').trim();
                    // Virgülü noktaya çevir
                    const normalizedChangeStr = rawChangeStr.replace(',', '.');
                    const changeValue = parseFloat(normalizedChangeStr);

                    // Eğer string içinde eksi işareti varsa direkt düşüş olarak işaretle (parse hatası olsa bile)
                    if (normalizedChangeStr.includes('-')) {
                        status = 'down';
                    } else if (changeValue > 0) {
                        status = 'up';
                    } else if (changeValue < 0) {
                        status = 'down';
                    } else {
                        // 2. API "0" veya boş döndüyse, kendi hafızamızla kıyasla
                        if (prevPrice !== undefined && !isNaN(prevPrice)) {
                            if (currentPrice > prevPrice) status = 'up';
                            else if (currentPrice < prevPrice) status = 'down';
                        }
                    }

                    // Yeni fiyatı kaydet
                    currentRatesMap[apiName] = currentPrice;

                    newRates.push({
                        key: apiName,
                        name: allowedKeys[apiName],
                        buy: item.buy,
                        sell: item.sell,
                        status: status
                    });
                }
            });
        }

        // 2. Yeni fiyatları LocalStorage'a kaydet (Bir sonraki açılış için)
        if (Object.keys(currentRatesMap).length > 0) {
            localStorage.setItem('prevGoldRates', JSON.stringify(currentRatesMap));
            prevRatesRef.current = currentRatesMap;
        }

        // Sıralama
        const order = ['Has Altın', 'Gram Altın', '22 Ayar', '14 Ayar', 'Ons Altın', 'Gümüş / TL', 'Dolar', 'Euro'];
        newRates.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

        setRates(newRates);
        setLoading(false);

      } catch (err) {
        console.error('Failed to load rates:', err);
        setLoading(false);
      }
    }

    fetchRates();
    const interval = setInterval(fetchRates, 30000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-500 text-[10px] animate-pulse">Piyasa Güncelleniyor...</div>;
  if (rates.length === 0) return <div className="text-gray-500 text-[10px]">Piyasa Kapalı</div>;

  return (
    <div className="flex items-center h-full overflow-hidden text-[10px] md:text-xs font-medium tracking-wide text-gray-400">
      <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap hover:pause">
        {[...rates, ...rates].map((rate, idx) => (
          <div key={idx} className="flex items-center gap-4 mx-6 border-r border-white/10 pr-6 last:border-0 group cursor-default">
            
            {/* İsim ve Durum İkonu */}
            <div className="flex items-center gap-2">
               <span className="text-[#D4AF37] uppercase font-bold tracking-tighter">{rate.name}</span>
               {rate.status === 'up' && <TrendingUp className="h-3 w-3 text-green-500 animate-pulse" />}
               {rate.status === 'down' && <TrendingDown className="h-3 w-3 text-red-500 animate-pulse" />}
               {rate.status === 'steady' && <Minus className="h-3 w-3 text-gray-600" />}
            </div>

            {/* Fiyatlar */}
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end leading-none">
                 <span className="text-[7px] text-gray-600 uppercase mb-0.5">Alış</span>
                 <span className="text-gray-400 font-mono text-[10px]">{rate.buy}</span>
               </div>
               <div className="flex flex-col items-end leading-none">
                 <span className="text-[7px] text-gray-600 uppercase mb-0.5">Satış</span>
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