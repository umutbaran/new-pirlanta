'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, Star, TrendingUp, TrendingDown, Minus, Save, Loader2, Info } from 'lucide-react';
import { BulletinItem } from '@/lib/db';

export default function AdminBulletinPage() {
  const [bulletins, setBulletins] = useState<BulletinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    try {
      const res = await fetch('/api/bulletin');
      const data = await res.json();
      setBulletins(data);
    } catch (err) {
      console.error('Bülten yüklenemedi', err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = () => {
    const newItem: BulletinItem = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      country: 'ABD',
      event: 'Yeni Ekonomik Gelişme',
      importance: 2,
      impact: 'neutral',
      description: ''
    };
    setBulletins([newItem, ...bulletins]);
  };

  const updateItem = (id: string, field: keyof BulletinItem, value: string | number) => {
    setBulletins(bulletins.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    setBulletins(bulletins.filter(item => item.id !== id));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await fetch('/api/bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulletins),
      });
      alert('Bülten başarıyla güncellendi.');
    } catch {
      alert('Kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ekonomi Bülteni Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">Piyasayı etkileyecek önemli gelişmeleri buradan duyur.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={addEvent}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
                <Plus className="h-4 w-4" /> Yeni Olay Ekle
            </button>
            <button 
                onClick={saveChanges}
                disabled={saving}
                className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#B4941F] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Tümünü Kaydet
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {bulletins.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
            <button 
                onClick={() => deleteItem(item.id)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
                <Trash2 className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tarih & Saat */}
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" /> Tarih
                        </label>
                        <input 
                            type="date" 
                            value={item.date} 
                            onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                            className="w-full border-gray-200 border rounded p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" /> Saat
                        </label>
                        <input 
                            type="time" 
                            value={item.time} 
                            onChange={(e) => updateItem(item.id, 'time', e.target.value)}
                            className="w-full border-gray-200 border rounded p-2 text-sm"
                        />
                    </div>
                </div>

                {/* Ülke & Olay */}
                <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Bayrak/Ülke</label>
                            <input 
                                type="text" 
                                value={item.country} 
                                placeholder="Örn: ABD, TR"
                                onChange={(e) => updateItem(item.id, 'country', e.target.value)}
                                className="w-full border-gray-200 border rounded p-2 text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Olay / Haber</label>
                            <input 
                                type="text" 
                                value={item.event} 
                                placeholder="Örn: FED Faiz Kararı"
                                onChange={(e) => updateItem(item.id, 'event', e.target.value)}
                                className="w-full border-gray-200 border rounded p-2 text-sm font-bold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                            <Info className="h-3 w-3" /> Kısa Analiz / Not
                        </label>
                        <textarea 
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full border-gray-200 border rounded p-2 text-sm"
                            rows={2}
                            placeholder="Altın üzerindeki olası etkisini yazın..."
                        />
                    </div>
                </div>

                {/* Önem & Etki */}
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Önem Derecesi</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(val => (
                                <button
                                    key={val}
                                    onClick={() => updateItem(item.id, 'importance', val)}
                                    className={`flex-1 py-1 rounded border flex justify-center transition-colors ${item.importance >= val ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-gray-50 border-gray-100 text-gray-300'}`}
                                >
                                    <Star className={`h-4 w-4 ${item.importance >= val ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Altın Beklentisi</label>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => updateItem(item.id, 'impact', 'up')}
                                className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 transition-colors ${item.impact === 'up' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                                <TrendingUp className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => updateItem(item.id, 'impact', 'neutral')}
                                className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 transition-colors ${item.impact === 'neutral' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => updateItem(item.id, 'impact', 'down')}
                                className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 transition-colors ${item.impact === 'down' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                                <TrendingDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {bulletins.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Info className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Henüz bir bülten girişi yapılmamış.</p>
            </div>
        )}
      </div>
    </div>
  );
}
