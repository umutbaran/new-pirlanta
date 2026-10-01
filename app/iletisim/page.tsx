import { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getSettings, getUiConfig } from '@/lib/db';
import ContactForm from '@/components/ContactForm';
import PageHeader from '@/components/PageHeader';
import { telHref, whatsappLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Özel tasarım talepleriniz, randevu ve fiyat bilgisi için bize ulaşın.',
};

export default async function ContactPage() {
  const [settings, uiConfig] = await Promise.all([getSettings(), getUiConfig()]);
  const stores = uiConfig.storeSection?.stores || [];

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Hemen yazın', href: whatsappLink(settings.whatsappNumber, 'Merhaba, bilgi almak istiyorum.'), external: true },
    settings.phoneNumber && { icon: Phone, label: 'Telefon', value: settings.phoneNumber, href: telHref(settings.phoneNumber) },
    settings.contactEmail && { icon: Mail, label: 'E-posta', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string; external?: boolean }[];

  return (
    <div>
      <PageHeader
        title="İletişim"
        description="Özel tasarım talepleriniz, randevu istekleriniz veya ürünlerimiz hakkındaki sorularınız için buradayız."
      />

      <div className="container-lux py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Bilgiler */}
          <div className="lg:col-span-5 space-y-12">
            <ul className="border-t border-line">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="border-b border-line">
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-5 py-6 group">
                    <Icon className="h-5 w-5 text-gold shrink-0" strokeWidth={1.2} />
                    <span className="flex-1">
                      <span className="block eyebrow !text-[10px] text-muted">{label}</span>
                      <span className="block mt-1 text-ink group-hover:text-gold-deep transition-colors">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {stores.length > 0 ? (
              <div className="space-y-8">
                {stores.map(store => (
                  <div key={store.id} className="flex gap-5">
                    <MapPin className="h-5 w-5 text-gold shrink-0 mt-1" strokeWidth={1.2} />
                    <div>
                      <p className="font-display text-2xl text-ink">{store.title}</p>
                      <p className="mt-1 text-sm text-ink-soft whitespace-pre-line leading-relaxed">{store.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : settings.address && (
              <p className="text-ink-soft whitespace-pre-line">{settings.address}</p>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-ivory p-6 sm:p-10 md:p-12">
            <h2 className="font-display text-3xl md:text-4xl text-ink">Bize Yazın</h2>
            <p className="mt-2 mb-8 text-sm text-ink-soft">Mesajınız WhatsApp üzerinden doğrudan danışmanlarımıza ulaşır.</p>
            <ContactForm whatsappNumber={settings.whatsappNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}
