import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      
      <div className="container mx-auto px-4 py-24 max-w-5xl">
         
         <div className="text-center mb-20">
            <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase mb-4 block">Bize Ulaşın</span>
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-8">İletişim</h1>
            <p className="text-gray-500 max-w-lg mx-auto font-light text-lg">
               Özel tasarım talepleriniz, randevu istekleriniz veya ürünlerimiz hakkındaki sorularınız için buradayız.
            </p>
         </div>

         <div className="grid md:grid-cols-2 gap-20">
            {/* SOL: BİLGİLER */}
            <div className="space-y-12">
               <div>
                  <h3 className="font-serif text-2xl mb-6">Merkez Ofis</h3>
                  <p className="text-gray-600 leading-relaxed font-light mb-4">
                     Sahil Mah. Cumhuriyet Cad. No:335<br/>
                     Tatvan / Bitlis
                  </p>
                  <a href="tel:04348272611" className="text-black font-medium hover:text-[#D4AF37] transition-colors">0 (434) 827 26 11</a>
               </div>

               <div>
                  <h3 className="font-serif text-2xl mb-6">İstanbul Şube</h3>
                  <p className="text-gray-600 leading-relaxed font-light mb-4">
                     Güvercintepe, Fatih Cd. No:225<br/>
                     34494 Başakşehir / İstanbul
                  </p>
                  <a href="tel:05527873513" className="text-black font-medium hover:text-[#D4AF37] transition-colors">+90 552 787 35 13</a>
               </div>

               <div>
                  <h3 className="font-serif text-2xl mb-6">E-Posta</h3>
                  <a href="mailto:info@newpirlanta.com" className="text-black font-medium hover:text-[#D4AF37] transition-colors text-lg">info@newpirlanta.com</a>
               </div>
            </div>

            {/* SAĞ: FORM */}
            <div className="bg-gray-50 p-10 md:p-12">
               <h3 className="font-serif text-2xl mb-8">Bize Yazın</h3>
               <form className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Adınız Soyadınız</label>
                     <input type="text" className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">E-Posta</label>
                     <input type="email" className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Konu</label>
                     <select className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors text-gray-600">
                        <option>Genel Bilgi</option>
                        <option>Fiyat Teklifi</option>
                        <option>Randevu Talebi</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mesajınız</label>
                     <textarea rows={4} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"></textarea>
                  </div>
                  <button type="button" className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-colors">
                     Gönder
                  </button>
               </form>
            </div>
         </div>

      </div>
    </div>
  );
}