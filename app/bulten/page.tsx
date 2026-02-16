import { getBulletins, saveBulletins } from '@/lib/db';
import { fetchEconomicCalendar } from '@/lib/investing';
import { Calendar, Star, TrendingUp, TrendingDown, Minus, Globe, Activity, ShieldCheck, Zap, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Piyasa Analiz & Canlı Takip | New Pırlanta',
  description: 'Küresel ekonomik takvim, anlık altın verileri ve profesyonel piyasa analizleri tek bir ekranda.',
};

export default async function BulletinPage() {
  let bulletins = await getBulletins();

  // --- OTOMATİK GÜNCELLEME ---
  const today = new Date().toISOString().split('T')[0];
  const lastEventDate = bulletins.length > 0 ? bulletins[0].date : null;

  if (!lastEventDate || lastEventDate < today) {
    try {
      const newItems = await fetchEconomicCalendar();
      if (newItems.length > 0) {
        const existingIds = new Set(bulletins.map(b => b.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        if (uniqueNewItems.length > 0) {
          bulletins = [...uniqueNewItems, ...bulletins]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50);
          await saveBulletins(bulletins);
        }
      }
    } catch (e) {
      console.error('Auto-sync failed:', e);
    }
  }

  const sortedBulletins = [...bulletins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-[#f8f8f6] min-h-screen text-gray-900 overflow-x-hidden">
      
      {/* 1. ULTRA-WIDE HEADER (TAMAMEN TÜRKÇE) */}
      <div className="bg-[#0a0a0a] text-white pt-12 pb-24 border-b border-[#D4AF37]/20 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-10 max-w-[1800px] relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="flex h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">Piyasa Veri Terminali</span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-serif tracking-tighter leading-none">Piyasa <span className="text-[#D4AF37] italic">Analiz</span></h1>
                 <p className="text-gray-500 font-light text-sm md:text-base max-w-xl uppercase tracking-widest">Küresel Ekonomik Veriler ve Anlık Takip Hattı</p>
              </div>
              
              <div className="flex gap-6 md:gap-12 items-center">
                 <div className="text-right border-r border-white/10 pr-6 md:pr-12">
                    <p className="text-[9px] uppercase font-bold text-gray-500 mb-1 tracking-widest text-center">Durum</p>
                    <p className="text-xs font-mono text-green-400 flex items-center gap-2 justify-center">
                        <Zap className="h-3 w-3 fill-current" /> ÇEVRİMİÇİ
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] uppercase font-bold text-gray-500 mb-1 tracking-widest text-center">Sistem Saati</p>
                    <p className="text-xs font-mono text-white">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 max-w-[1800px] -mt-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* SOL SÜTUN */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* A. EKONOMİK TAKVİM TERMİNALİ */}
            <section className="space-y-4">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-100/80 backdrop-blur-md p-4 px-8 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Küresel Ekonomik Takvim</span>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-[9px] font-bold text-[#D4AF37] bg-black px-3 py-1 rounded-full">
                            <ShieldCheck className="h-3 w-3" /> INVESTING TARAFINDAN DOĞRULANMIŞ VERİ
                        </div>
                    </div>

                    {/* Iframe */}
                    <div className="w-full bg-white">
                        <iframe 
                            src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_economicActivity,_inflation,_centralBanks,_balance&importance=2,3&features=datepicker,timezone,timeselector,filters&countries=5,17,4,37,72,22,39,10,35,56,63&calType=day&timeZone=63&lang=10" 
                            width="100%" 
                            height="800" 
                            style={{ border: 0, display: 'block', margin: 0, padding: 0 }}
                            className="w-full"
                        ></iframe>
                    </div>
                    
                    <div className="bg-black text-white p-4 px-8 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-[#D4AF37]" />
                            <span className="text-[10px] font-bold tracking-[0.3em] opacity-80 uppercase">Anlık Veri Akışı Aktif</span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono italic">SİSTEM ÇEKİRDEĞİ V3.0</span>
                    </div>
                </div>
            </section>

            {/* B. ANALİZLER */}
            <section className="space-y-8 pt-4">
                <div className="flex items-center gap-4 px-2">
                    <Star className="h-5 w-5 text-[#D4AF37] fill-current" />
                    <h2 className="text-xl font-serif font-bold text-gray-900 tracking-tight">Stratejik Piyasa Notları</h2>
                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedBulletins.length > 0 ? sortedBulletins.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] bg-[#D4AF37]/5 px-3 py-1 rounded-full">
                                {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} • {item.time}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${item.importance === 3 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'bg-orange-400'}`}></div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#D4AF37] transition-colors uppercase">{item.event}</h3>
                        <p className="text-gray-500 text-sm font-light leading-relaxed mb-8 line-clamp-4">
                            {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Piyasa Algısı</span>
                            {item.impact === 'up' && <div className="text-green-600 font-bold text-xs flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> YÜKSELİŞ (BOĞA)</div>}
                            {item.impact === 'down' && <div className="text-red-600 font-bold text-xs flex items-center gap-1.5"><TrendingDown className="h-4 w-4" /> DÜŞÜŞ (AYI)</div>}
                            {item.impact === 'neutral' && <div className="text-blue-500 font-bold text-xs flex items-center gap-1.5"><Minus className="h-4 w-4" /> NÖTR</div>}
                        </div>
                    </div>
                    )) : (
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 text-sm">Analiz girişi bekleniyor...</p>
                    </div>
                    )}
                </div>
            </section>
          </div>

          {/* SAĞ SÜTUN */}
          <div className="lg:col-span-3 space-y-8">
            <div className="sticky top-24">
                <div className="bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                                <Globe className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Canlı Veri Akışı</span>
                            </div>
                            <h4 className="text-white font-serif text-2xl tracking-tighter">Döviz Kurları</h4>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-[#D4AF37]"></div>
                    </div>
                    
                    <div className="p-0 overflow-hidden bg-[#111]">
                        <iframe 
                            src="https://tr.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&pairs=1,2,6,9390,9483,126,66,50655,97,959202,10117,18" 
                            width="100%" 
                            height="650" 
                            style={{ border: 0, display: 'block' }}
                            className="w-full"
                        ></iframe>
                    </div>

                    <div className="p-6 bg-white/5 text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Gerçek Zamanlı Piyasa Hattı</p>
                    </div>
                </div>

                {/* Yasal Uyarı */}
                <div className="mt-8 bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl shadow-black/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                            <Info className="h-5 w-5" />
                        </div>
                        <h5 className="font-bold text-[10px] uppercase tracking-widest text-gray-900">Yasal Uyarı</h5>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">
                        Bu sayfadaki veriler sadece bilgilendirme amaçlıdır. New Pırlanta yatırım tavsiyesi vermez.
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
