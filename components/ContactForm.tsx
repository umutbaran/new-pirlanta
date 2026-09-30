'use client';

import { useState } from 'react';
import Link from 'next/link';
import { whatsappLink } from '@/lib/utils';

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
    window.open(whatsappLink(whatsappNumber, text), '_blank', 'noopener,noreferrer');
  };

  const inputClass = "w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

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
        <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} className={`${inputClass} text-gray-600`}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>Mesajınız *</label>
        <textarea id="contact-message" name="message" rows={4} required value={form.message} onChange={handleChange} className={inputClass}></textarea>
      </div>
      <button type="submit" className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-colors">
        WhatsApp ile Gönder
      </button>
      <p className="text-[11px] text-gray-400 leading-relaxed">
        Gönder&apos;e bastığınızda mesajınız WhatsApp&apos;ta açılır; göndermeden önce düzenleyebilirsiniz. Kişisel verileriniz{' '}
        <Link href="/gizlilik-ve-kvkk" className="underline hover:text-black">KVKK Aydınlatma Metni</Link> kapsamında işlenir.
      </p>
    </form>
  );
}
