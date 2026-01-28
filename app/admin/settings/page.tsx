'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

interface Settings {
  siteTitle: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  currency: string;
  goldPriceMargin: number;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteTitle: '',
    contactEmail: '',
    phoneNumber: '',
    address: '',
    currency: 'TRY',
    goldPriceMargin: 0
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'goldPriceMargin' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Ayarlar kaydedildi.');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Ayarları</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Genel Bilgiler</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Site Başlığı</label>
                 <input 
                   type="text" 
                   name="siteTitle" 
                   value={settings.siteTitle} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Para Birimi</label>
                 <input 
                   type="text" 
                   name="currency" 
                   value={settings.currency} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 />
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">İletişim Bilgileri</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">E-posta</label>
                 <input 
                   type="email" 
                   name="contactEmail" 
                   value={settings.contactEmail} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Telefon</label>
                 <input 
                   type="text" 
                   name="phoneNumber" 
                   value={settings.phoneNumber} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 mb-1">Adres</label>
                 <textarea 
                   name="address" 
                   rows={3}
                   value={settings.address} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 ></textarea>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Fiyatlandırma Ayarları</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Altın Kar Marjı (Oran)</label>
                 <input 
                   type="number" 
                   step="0.01"
                   name="goldPriceMargin" 
                   value={settings.goldPriceMargin} 
                   onChange={handleChange} 
                   className="w-full border p-2 rounded text-sm" 
                 />
                 <p className="text-xs text-gray-400 mt-1">Örn: 0.05 (%5 kar)</p>
              </div>
           </div>
        </div>

        <div className="flex justify-end">
           <button 
             type="submit" 
             disabled={saving}
             className="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-[#D4AF37] transition-colors flex items-center gap-2 disabled:opacity-50"
           >
             <Save className="h-5 w-5" />
             {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
           </button>
        </div>

      </form>
    </div>
  );
}
