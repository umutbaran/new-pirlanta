import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { getSettings, getUiConfig, FooterLink } from '@/lib/db';

export default async function Footer() {
  const settings = await getSettings();
  const uiConfig = await getUiConfig();

  return (
    <footer className="bg-[#111] text-gray-400 text-sm border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. Marka & İletişim */}
          <div>
            <h3 className="text-2xl font-serif text-white mb-6 tracking-wide">{settings.siteTitle || "NEW PIRLANTA"}</h3>
            <p className="mb-6 text-gray-500 leading-relaxed">
              {uiConfig.footer?.description || "Kapalıçarşı'nın kalbinden, en özel anlarınıza eşlik edecek eşsiz tasarımlar."}
            </p>
            <div className="space-y-4">
               {settings.address && (
                 <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{settings.address}</span>
                 </div>
               )}
               {settings.phoneNumber && (
                 <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                    <span>{settings.phoneNumber}</span>
                 </div>
               )}
               {settings.contactEmail && (
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                    <span>{settings.contactEmail}</span>
                 </div>
               )}
            </div>
          </div>

          {/* 2. Kurumsal */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">Kurumsal</h4>
            <ul className="space-y-3">
              {uiConfig.footer?.corporateLinks?.map((link: FooterLink, idx: number) => (
                 <li key={idx}><Link href={link.url} className="hover:text-[#D4AF37] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* 3. Müşteri Hizmetleri */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">Müşteri Hizmetleri</h4>
            <ul className="space-y-3">
              {uiConfig.footer?.customerServiceLinks?.map((link: FooterLink, idx: number) => (
                 <li key={idx}><Link href={link.url} className="hover:text-[#D4AF37] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* 4. Bülten & Sosyal */}
          <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">E-Bülten</h4>
             <p className="mb-4 text-xs">Yeni koleksiyonlardan ve özel indirimlerden ilk siz haberdar olun.</p>
             <div className="flex gap-2 mb-8">
                <input type="email" placeholder="E-posta adresiniz" className="bg-gray-800 border-none rounded px-4 py-2 w-full focus:ring-1 focus:ring-[#D4AF37] outline-none text-white placeholder-gray-500" />
                <button className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold hover:bg-white transition-colors">Kayıt</button>
             </div>
             
             <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Bizi Takip Edin</h4>
             <div className="flex gap-4">
                <a href={uiConfig.footer?.socialMedia?.instagram || "#"} target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all group">
                   <Instagram className="h-5 w-5" />
                </a>
                <a href={uiConfig.footer?.socialMedia?.facebook || "#"} target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all group">
                   <Facebook className="h-5 w-5" />
                </a>
                <a href={uiConfig.footer?.socialMedia?.twitter || "#"} target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all group">
                   <Twitter className="h-5 w-5" />
                </a>
             </div>
          </div>

        </div>

        {/* Alt Bar: Copyright & Bankalar */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-xs text-gray-600">
              &copy; 2024 {settings.siteTitle || "New Pırlanta"}. {uiConfig.footer?.copyrightText || "Tüm hakları saklıdır."}
           </div>
           
           <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2 text-xs">
                 <ShieldCheck className="h-4 w-4" />
                 <span>256-Bit SSL Güvenli Ödeme</span>
              </div>
              <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                 <CreditCard className="h-6 w-6" />
                 {/* Buraya Visa/Mastercard logoları (SVG) gelebilir */}
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}