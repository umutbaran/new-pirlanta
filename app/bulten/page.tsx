import { getBulletins, BulletinItem } from '@/lib/db';
import { Calendar, Star, TrendingUp, TrendingDown, Minus, Globe, Activity, ShieldCheck, Zap, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Piyasa Analiz & Canlı Takip | New Pırlanta',
  description: 'Küresel ekonomik takvim, anlık altın verileri ve profesyonel piyasa analizleri tek bir ekranda.',
};

export default async function BulletinPage() {
  const bulletins = await getBulletins();

  const sortedBulletins: BulletinItem[] = [...bulletins].sort((a: BulletinItem, b: BulletinItem) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-[#f8f8f6] min-h-screen text-gray-900 overflow-x-hidden">
      
      {/* 1. ULTRA-WIDE HEADER */}
      <div className="bg-[#0a0a0a] text-white pt-8 pb-16 md:pt-12 md:pb-24 border-b border-[#D4AF37]/20 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-10 max-w-[1800px] relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 md:space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="flex h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#D4AF37]">Terminal</span>
                 </div>
                 <h1 className="text-3xl md:text-6xl font-serif tracking-tighter leading-none">Piyasa <span className="text-[#D4AF37] italic">Analiz</span></h1>
                 <p className="text-gray-500 font-light text-[10px] md:text-base uppercase tracking-widest">Canlı Ekonomik Veri Hattı</p>
              </div>
              
              <div className="flex gap-4 md:gap-12 items-center border-t border-white/5 pt-4 md:pt-0">
                 <div className="text-right border-r border-white/10 pr-4 md:pr-12">
                    <p className="text-[8px] md:text-[9px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Durum</p>
                    <p className="text-[10px] md:text-xs font-mono text-green-400 flex items-center gap-2">
                        <Zap className="h-3 w-3 fill-current" /> CANLI
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] md:text-[9px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Saat</p>
                    <p className="text-[10px] md:text-xs font-mono text-white">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 max-w-[1800px] -mt-8 md:-mt-12 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* SOL SÜTUN */}
          <div className="lg:col-span-9 space-y-8 md:space-y-12 order-2 lg:order-1">
            
            {/* A. EKONOMİK TAKVİM TERMİNALİ */}
            <section className="space-y-4">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-100/80 backdrop-blur-md p-3 md:p-4 px-4 md:px-8 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                            </div>
                            <div className="h-4 w-[1px] bg-gray-300 mx-1 md:mx-2"></div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-gray-600" />
                                <span className="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest">Ekonomik Takvim</span>
                            </div>
                        </div>
                    </div>

                    {/* Iframe Container */}
                    <div className="w-full bg-white overflow-x-auto">
                        <div className="min-w-[600px] md:min-w-full">
                            <iframe 
                                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_economicActivity,_inflation,_centralBanks,_balance&importance=2,3&features=datepicker,timezone,timeselector,filters&countries=5,17,4,37,72,22,39,10,35,56,63&calType=day&timeZone=63&lang=10" 
                                width="100%" 
                                height="600" 
                                style={{ border: 0, display: 'block', margin: 0, padding: 0 }}
                                className="w-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* B. ANALİZLER */}
            <section className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <Star className="h-5 w-5 text-[#D4AF37] fill-current" />
                    <h2 className="text-lg md:text-xl font-serif font-bold text-gray-900 tracking-tight">Piyasa Notları</h2>
                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {sortedBulletins.length > 0 ? sortedBulletins.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all duration-500 group">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/5 px-3 py-1 rounded-full">
                                {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${item.importance === 3 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-orange-400'}`}></div>
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 leading-tight uppercase">{item.event}</h3>
                        <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed mb-6 line-clamp-4">
                            {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Beklenti</span>
                            {item.impact === 'up' && <div className="text-green-600 font-bold text-[10px] flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> POZİTİF</div>}
                            {item.impact === 'down' && <div className="text-red-600 font-bold text-[10px] flex items-center gap-1.5"><TrendingDown className="h-3 w-3" /> NEGATİF</div>}
                            {item.impact === 'neutral' && <div className="text-blue-500 font-bold text-[10px] flex items-center gap-1.5"><Minus className="h-3 w-3" /> NÖTR</div>}
                        </div>
                    </div>
                    )) : (
                    <div className="col-span-full py-12 md:py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 text-xs md:text-sm">Henüz analiz girişi yapılmadı.</p>
                    </div>
                    )}
                </div>
            </section>
          </div>

          {/* SAĞ SÜTUN */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
                <div className="bg-[#0a0a0a] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
                    <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                                <Globe className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Canlı Akış</span>
                            </div>
                            <h4 className="text-white font-serif text-xl md:text-2xl tracking-tighter">Döviz Kurları</h4>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                    </div>
                    
                    <div className="p-0 overflow-hidden bg-[#111]">
                        <iframe 
                            src="https://tr.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&pairs=1,2,6,9390,9483,126,66,50655,97,959202,10117,18" 
                            width="100%" 
                            height="400" 
                            style={{ border: 0, display: 'block' }}
                            className="w-full"
                        ></iframe>
                    </div>
                </div>

                {/* Yasal Uyarı */}
                <div className="mt-6 md:mt-8 bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <Info className="h-4 w-4 text-orange-500" />
                        <h5 className="font-bold text-[9px] md:text-[10px] uppercase tracking-widest text-gray-900">Yasal Bilgilendirme</h5>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed font-light italic">
                        Buradaki veriler yatırım tavsiyesi değildir. New Pırlanta sorumluluk kabul etmez.
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>

        </div>
      </div>
    </div>
  );
}
