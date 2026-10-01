'use client';

import { useState } from 'react';
import Link from 'next/link';
import { whatsappLink } from '@/lib/utils';
import { track } from '@/lib/track';

const SUBJECTS = ['Genel Bilgi', 'Fiyat Teklifi', 'Randevu Talebi', 'Özel Tasarım'];

/**
 * İletişim formu: gönderilen mesajı hazır metin olarak WhatsApp'ta açar.
 * Sunucuya veri gönderilmez / kaydedilmez.
 */
export default function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [form, setForm] = useState({ name: '', phone: '', subject: SUBJECTS[0], message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Merhaba, web sitenizden yazıyorum.`,
      ``,
      `Ad Soyad: ${form.name.trim()}`,
      ...(form.phone.trim() ? [`Telefon: ${form.phone.trim()}`] : []),
      `Konu: ${form.subject}`,
      ``,
      form.message.trim(),
    ].join('\n');
    track('whatsapp_click', { value: '/iletisim (form)' });
    window.open(whatsappLink(whatsappNumber, text), '_blank', 'noopener,noreferrer');
  };

  const inputClass = "w-full bg-white border border-line px-4 py-3.5 text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors";
  const labelClass = "block eyebrow !text-[10px] text-ink-soft mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className={labelClass}>Adınız Soyadınız *</label>
        <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClass}>Telefon (İsteğe Bağlı)</label>
        <input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-subject" className={labelClass}>Konu</label>
        <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} className={inputClass}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>Mesajınız *</label>
        <textarea id="contact-message" name="message" rows={4} required value={form.message} onChange={handleChange} className={inputClass}></textarea>
      </div>
      <button type="submit" className="btn-primary w-full">
        WhatsApp ile Gönder
      </button>
      <p className="text-xs text-muted leading-relaxed">
        Gönder&apos;e bastığınızda mesajınız WhatsApp&apos;ta açılır; göndermeden önce düzenleyebilirsiniz. Kişisel verileriniz{' '}
        <Link href="/gizlilik-ve-kvkk" className="underline underline-offset-2 hover:text-ink">KVKK Aydınlatma Metni</Link> kapsamında işlenir.
      </p>
    </form>
  );
}
