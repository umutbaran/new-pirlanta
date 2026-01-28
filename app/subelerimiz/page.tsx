import { MapPin, Phone, Clock, Mail, ArrowRight } from 'lucide-react';

export default function BranchesPage() {
  return (
    <div className="bg-white min-h-screen">
       
       {/* HEADER */}
       <div className="py-24 text-center bg-gray-50">
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6">Mağazalarımız</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
             Dijital dünyada varız ama köklerimiz hala sıcak bir kahvenin hatırında. 
             Ürünlerimizi yakından incelemek, denemek ve uzman ekibimizle tanışmak için sizi bekliyoruz.
          </p>
       </div>

       {/* TATVAN ŞUBE (Left Aligned Photo) */}
       <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="md:w-1/2 h-[500px] relative">
                <div className="absolute inset-0 bg-gray-200 transform -rotate-2 scale-95" /> {/* Dekoratif Arka Katman */}
                <img 
                   src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80" 
                   alt="Tatvan Şubesi" 
                   className="relative z-10 w-full h-full object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
             <div className="md:w-1/2 space-y-8">
                <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase block">Merkez</span>
                <h2 className="text-4xl font-serif text-gray-900">Tatvan Şubesi</h2>
                <div className="h-[1px] w-24 bg-gray-200" />
                
                <div className="space-y-6 text-gray-600 font-light">
                   <div className="flex gap-4">
                      <MapPin className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                      <p>Sahil Mah. Cumhuriyet Cad. No:335<br/>Tatvan / Bitlis</p>
                   </div>
                   <div className="flex gap-4">
                      <Phone className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                      <p>0 (434) 827 26 11</p>
                   </div>
                   <div className="flex gap-4">
                      <Clock className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                      <div>
                         <p>Pazartesi - Cumartesi: 09:00 - 19:00</p>
                         <p>Pazar: Kapalı</p>
                      </div>
                   </div>
                </div>

                <a href="https://maps.google.com/?q=Baran+Kuyumculuk+Tatvan" target="_blank" className="inline-flex items-center gap-2 text-black border-b border-black pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors uppercase text-xs font-bold tracking-widest mt-4">
                   Yol Tarifi Al <ArrowRight className="h-4 w-4" />
                </a>
             </div>
          </div>
       </section>

       {/* İSTANBUL ŞUBE (Right Aligned Photo) */}
       <section className="py-24 bg-[#121212] text-white">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                <div className="md:w-1/2 h-[500px] relative">
                   <div className="absolute inset-0 border border-white/20 transform rotate-2 scale-95" />
                   <img 
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80" 
                      alt="İstanbul Şubesi" 
                      className="relative z-10 w-full h-full object-cover shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
                   />
                </div>
                <div className="md:w-1/2 space-y-8 text-right md:text-left">
                   <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase block">Showroom</span>
                   <h2 className="text-4xl font-serif text-white">İstanbul Şubesi</h2>
                   <div className="h-[1px] w-24 bg-white/20 md:mr-auto ml-auto md:ml-0" />
                   
                   <div className="space-y-6 text-gray-400 font-light flex flex-col items-end md:items-start">
                      <div className="flex gap-4 flex-row-reverse md:flex-row text-right md:text-left">
                         <MapPin className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                         <p>Güvercintepe, Fatih Cd. No:225<br/>34494 Başakşehir / İstanbul</p>
                      </div>
                      <div className="flex gap-4 flex-row-reverse md:flex-row text-right md:text-left">
                         <Phone className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                         <p>+90 552 787 35 13</p>
                      </div>
                      <div className="flex gap-4 flex-row-reverse md:flex-row text-right md:text-left">
                         <Clock className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                         <div>
                            <p>Pazartesi - Cumartesi: 10:00 - 20:00</p>
                            <p>Pazar: 12:00 - 18:00</p>
                         </div>
                      </div>
                   </div>

                   <a href="https://maps.google.com/?q=Baran+Kuyumculuk+Başakşehir" target="_blank" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors uppercase text-xs font-bold tracking-widest mt-4">
                      Yol Tarifi Al <ArrowRight className="h-4 w-4" />
                   </a>
                </div>
             </div>
          </div>
       </section>

    </div>
  );
}
