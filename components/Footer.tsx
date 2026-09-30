import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { getSettings, getUiConfig } from '@/lib/db';
import { whatsappLink, telHref } from '@/lib/utils';

// TikTok SVG Icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V15.5c0 1.93-.79 3.81-2.23 5.1-1.46 1.34-3.52 1.99-5.46 1.77-2.01-.23-3.83-1.55-4.73-3.37-1-2.02-.82-4.63.54-6.48 1.35-1.85 3.63-2.84 5.86-2.52v4.1c-1.14-.23-2.43.12-3.15 1.05-.72.93-.83 2.3-.26 3.29.56 1 1.83 1.59 2.94 1.43 1.1-.16 2.01-1.12 2.01-2.23V.02z"/>
  </svg>
);

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/** Admin panelinden girilen sosyal medya adresini geçerli bir URL'ye çevirir; boş veya "#" ise null döner */
function normalizeSocialUrl(value?: string): string | null {
  const v = (value || '').trim().replace(/^#+/, '');
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** Sadece gerçek bir adrese giden linkleri göster */
function validLinks(links: { label: string; url: string }[] = []) {
  return links.filter(l => l.label && l.url && l.url.trim() !== '#');
}

const linkClass = "hover:text-[#D4AF37] transition-all hover:translate-x-1 inline-block uppercase text-[11px] font-bold";
const socialClass = "w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all border border-white/10 group";

export default async function Footer() {
  const [settings, uiConfig] = await Promise.all([getSettings(), getUiConfig()]);
  const social = uiConfig.footer?.socialMedia;
  const socialLinks = [
    { url: normalizeSocialUrl(social?.instagram), label: 'Instagram', icon: <Instagram className="h-6 w-6 group-hover:scale-110 transition-transform" /> },
    { url: normalizeSocialUrl(social?.tiktok), label: 'TikTok', icon: <TikTokIcon /> },
    { url: normalizeSocialUrl(social?.facebook), label: 'Facebook', icon: <Facebook className="h-6 w-6 group-hover:scale-110 transition-transform" /> },
    { url: normalizeSocialUrl(social?.twitter), label: 'X (Twitter)', icon: <Twitter className="h-6 w-6 group-hover:scale-110 transition-transform" /> },
  ].filter(s => s.url);

  const corporateLinks = validLinks(uiConfig.footer?.corporateLinks);
  const infoLinks = [
    ...validLinks(uiConfig.footer?.customerServiceLinks),
    { label: 'Gizlilik ve KVKK', url: '/gizlilik-ve-kvkk' },
  ];

  return (
    <footer className="bg-[#111] text-gray-400 text-sm border-t border-gray-800">
      <div className="container mx-auto px-6 py-16 md:py-20 lg:max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* 1. Marka & İletişim */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif text-white tracking-widest">{settings.siteTitle}</h3>
            {uiConfig.footer?.description && (
              <p className="text-gray-500 leading-relaxed text-xs md:text-sm">{uiConfig.footer.description}</p>
            )}
            <div className="space-y-4 pt-4">
               {settings.phoneNumber && (
                 <a href={telHref(settings.phoneNumber)} className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Phone className="h-5 w-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <span className="font-bold">{settings.phoneNumber}</span>
                 </a>
               )}
               {settings.contactEmail && (
                 <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 hover:text-white transition-colors">
                    <Mail className="h-5 w-5 text-[#D4AF37]" />
                    <span>{settings.contactEmail}</span>
                 </a>
               )}
               {settings.address && (
                 <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37] mt-1" />
                    <span className="text-xs leading-5 whitespace-pre-line">{settings.address}</span>
                 </div>
               )}
            </div>
          </div>

          {/* 2. Kurumsal */}
          <div className="lg:pl-8">
            <h4 className="text-white font-black uppercase tracking-[0.2em] mb-8 text-[10px]">Kurumsal</h4>
            <ul className="space-y-4">
              {corporateLinks.map(link => (
                <li key={link.url + link.label}><Link href={link.url} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* 3. Bilgi */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] mb-8 text-[10px]">Bilgi</h4>
            <ul className="space-y-4">
              {infoLinks.map(link => (
                <li key={link.url + link.label}><Link href={link.url} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* 4. Sosyal Medya & WhatsApp */}
          <div>
             <h4 className="text-white font-black uppercase tracking-[0.2em] mb-6 text-[10px]">Bizi Takip Edin</h4>
             <div className="flex flex-wrap gap-4">
                {socialLinks.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={socialClass}>
                     {s.icon}
                  </a>
                ))}
                <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20 group">
                   <WhatsAppIcon />
                </a>
             </div>
          </div>

        </div>

        {/* Alt Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
              &copy; {new Date().getFullYear()} {settings.siteTitle}. {uiConfig.footer?.copyrightText || "Tüm hakları saklıdır."}
           </div>
           
           <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                Tasarım & Yazılım: <span className="text-white tracking-widest uppercase">Baran Kuyumculuk</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
