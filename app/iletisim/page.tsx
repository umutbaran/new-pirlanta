import { Metadata } from 'next';
import { getSettings } from '@/lib/db';
import ContactForm from '@/components/ContactForm';
import { telHref } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Özel tasarım talepleriniz, randevu ve fiyat bilgisi için bize ulaşın.',
};

export default async function ContactPage() {
  const settings = await getSettings();

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
                  <p className="text-gray-600 leading-relaxed font-light mb-4 whitespace-pre-line">
                     {settings.address || "Adres bilgisi girilmemiş."}
                  </p>
                  {settings.phoneNumber && (
                     <a href={telHref(settings.phoneNumber)} className="text-black font-medium hover:text-[#D4AF37] transition-colors">
                        {settings.phoneNumber}
                     </a>
                  )}
               </div>

               <div>
                  <h3 className="font-serif text-2xl mb-6">E-Posta</h3>
                  {settings.contactEmail && (
                     <a href={`mailto:${settings.contactEmail}`} className="text-black font-medium hover:text-[#D4AF37] transition-colors text-lg">
                        {settings.contactEmail}
                     </a>
                  )}
               </div>
            </div>

            {/* SAĞ: FORM */}
            <div className="bg-gray-50 p-10 md:p-12">
               <h3 className="font-serif text-2xl mb-8">Bize Yazın</h3>
               <ContactForm whatsappNumber={settings.whatsappNumber} />
            </div>
         </div>

      </div>
    </div>
  );
}
