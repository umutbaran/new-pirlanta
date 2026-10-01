import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { getSettings, getUiConfig, getCategories } from '@/lib/db';
import { whatsappLink, telHref } from '@/lib/utils';

// TikTok ikonu (lucide'de yok)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current" aria-hidden>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V15.5c0 1.93-.79 3.81-2.23 5.1-1.46 1.34-3.52 1.99-5.46 1.77-2.01-.23-3.83-1.55-4.73-3.37-1-2.02-.82-4.63.54-6.48 1.35-1.85 3.63-2.84 5.86-2.52v4.1c-1.14-.23-2.43.12-3.15 1.05-.72.93-.83 2.3-.26 3.29.56 1 1.83 1.59 2.94 1.43 1.1-.16 2.01-1.12 2.01-2.23V.02z"/>
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

const headingClass = "eyebrow text-ink mb-6";
const linkClass = "text-sm text-ink-soft hover:text-ink transition-colors";

export default async function Footer() {
  const [settings, uiConfig, categories] = await Promise.all([getSettings(), getUiConfig(), getCategories()]);
  const social = uiConfig.footer?.socialMedia;
  const socialLinks = [
    { url: normalizeSocialUrl(social?.instagram), label: 'Instagram', icon: <Instagram className="h-[17px] w-[17px]" strokeWidth={1.4} /> },
    { url: normalizeSocialUrl(social?.tiktok), label: 'TikTok', icon: <TikTokIcon /> },
    { url: normalizeSocialUrl(social?.facebook), label: 'Facebook', icon: <Facebook className="h-[17px] w-[17px]" strokeWidth={1.4} /> },
    { url: normalizeSocialUrl(social?.twitter), label: 'X (Twitter)', icon: <Twitter className="h-[17px] w-[17px]" strokeWidth={1.4} /> },
  ].filter(s => s.url);

  const collections = categories.filter(c => c.isActive);
  const corporateLinks = validLinks(uiConfig.footer?.corporateLinks);
  const infoLinks = validLinks(uiConfig.footer?.customerServiceLinks);

  return (
    <footer className="bg-ivory border-t border-line mt-auto">
      <div className="container-lux pt-16 pb-10 md:pt-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">

          {/* Marka */}
          <div className="col-span-2 lg:col-span-4 lg:pr-12">
            <Image src="/assets/logo-wordmark.png" alt={settings.siteTitle} width={1200} height={311} className="h-10 w-auto" />
            {uiConfig.footer?.description && (
              <p className="mt-6 text-sm leading-relaxed text-ink-soft max-w-sm">{uiConfig.footer.description}</p>
            )}
            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                   className="h-10 w-10 border border-line flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink transition-colors">
                  {s.icon}
                </a>
              ))}
              <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                 className="h-10 w-10 border border-line flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink transition-colors">
                <MessageCircle className="h-[17px] w-[17px]" strokeWidth={1.4} />
              </a>
            </div>
          </div>

          {/* Koleksiyonlar */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>Koleksiyonlar</h4>
            <ul className="space-y-3">
              {collections.map(c => (
                <li key={c.id}><Link href={`/koleksiyon/${c.slug}`} className={linkClass}>{c.name}</Link></li>
              ))}
              <li><Link href="/koleksiyon/tum-urunler" className={linkClass}>Tüm Ürünler</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>Kurumsal</h4>
            <ul className="space-y-3">
              {corporateLinks.map(l => (
                <li key={l.url + l.label}><Link href={l.url} className={linkClass}>{l.label}</Link></li>
              ))}
              {infoLinks.map(l => (
                <li key={l.url + l.label}><Link href={l.url} className={linkClass}>{l.label}</Link></li>
              ))}
              <li><Link href="/favoriler" className={linkClass}>Favorilerim</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="col-span-2 lg:col-span-4">
            <h4 className={headingClass}>İletişim</h4>
            <ul className="space-y-4 text-sm text-ink-soft">
              {settings.phoneNumber && (
                <li>
                  <a href={telHref(settings.phoneNumber)} className="flex items-center gap-3 hover:text-ink transition-colors">
                    <Phone className="h-4 w-4 text-gold shrink-0" strokeWidth={1.4} /> {settings.phoneNumber}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 hover:text-ink transition-colors">
                    <Mail className="h-4 w-4 text-gold shrink-0" strokeWidth={1.4} /> {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" strokeWidth={1.4} />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
            </ul>
            <Link href="/subelerimiz" className="link-underline mt-6 text-ink">Mağazalarımız</Link>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-line flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} {settings.siteTitle}. {uiConfig.footer?.copyrightText || 'Tüm hakları saklıdır.'}</p>
          <div className="flex gap-6">
            <Link href="/gizlilik-ve-kvkk" className="hover:text-ink transition-colors">Gizlilik ve KVKK</Link>
            <span>Baran Kuyumculuk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
