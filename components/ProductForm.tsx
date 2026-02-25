'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, X, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { uploadProductImage } from '@/lib/upload';

interface ProductFormProps {
  initialData?: Product;
  isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Product>(initialData || {
    id: crypto.randomUUID(),
    sku: '',
    name: '',
    category: 'pirlanta',
    subCategory: 'tektas',
    price: 0,
    oldPrice: 0,
    description: '',
    images: [],
    details: {
      materyal: '',
      renk: '',
      agirlik: '',
      garanti: '2 Yıl',
      sertifika: 'Firma Sertifikalı'
    }
  } as Product);

  const [newImageUrl, setNewImageUrl] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      } else {
        // Hata detayını lib/upload.ts içindeki console'dan veya daha spesifik bir uyarıyla alabiliriz
        alert('Resim yüklenemedi! \n\nİpucu: Fotoğrafın 4MB\'dan küçük olduğundan ve Admin girişi yaptığınızdan emin olun.');
      }
    } catch (err: unknown) {
      console.error(err);
      alert('Hata: ' + (err instanceof Error ? err.message : 'Yükleme sırasında teknik bir hata oluştu.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentObj = (prev as unknown as Record<string, unknown>)[parent] as Record<string, unknown> || {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    if (newImageUrl) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanData = {
        ...formData,
        price: Math.max(0, Number(formData.price)), // Fiyatın 0'dan küçük olmasını engelle
        oldPrice: formData.oldPrice ? Math.max(0, Number(formData.oldPrice)) : undefined
    };

    try {
      const url = isEditMode ? `/api/products/${formData.id}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await res.json() as { error?: string };
        alert(`Hata: ${errorData.error || 'Ürün kaydedilemedi. Lütfen tüm alanları kontrol edin.'}`);
      }
    } catch (error: unknown) {
      console.error(error);
      alert('Sunucuyla iletişim kurulurken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <form onSubmit={handleSubmit}>
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-slate-900 -mx-6 md:-mx-10 -mt-10 p-6 md:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
                <Link href="/admin/products" className="p-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {isEditMode ? `Düzenle: ${formData.name}` : 'Yeni Ürün Oluştur'}
                    </h1>
                    <p className="text-slate-400 text-xs mt-0.5">Ürün bilgilerini ve görsellerini buradan yönetin.</p>
                </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto relative z-10">
                <button 
                  type="button" 
                  onClick={() => {
                      if(confirm('Tüm değişiklikler sıfırlanacak. Emin misiniz?')) {
                          if(isEditMode && initialData) setFormData(initialData);
                          else router.push('/admin/products');
                      }
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all"
                >
                    {isEditMode ? 'SIFIRLA' : 'İPTAL'}
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 sm:flex-none px-8 py-3 bg-[#D4AF37] text-slate-900 rounded-xl text-sm font-black hover:bg-[#B4941F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#D4AF37]/20"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isEditMode ? 'GÜNCELLE' : 'ÜRÜNÜ KAYDET'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN (MAIN CONTENT) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Title & Description */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name || ''} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-shadow outline-none" 
                                placeholder="Örn: 0.50 Karat Pırlanta Yüzük"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea 
                                name="description" 
                                value={formData.description || ''} 
                                onChange={handleChange} 
                                rows={6} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-shadow outline-none"
                                placeholder="Ürün özelliklerini detaylıca anlatın..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Medya</h3>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            className="hidden" 
                            accept="image/*" 
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Cihazdan Yükle
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {/* URL Input */}
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                placeholder="Veya görsel URL'si yapıştırın..." 
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                             />
                             <button 
                                type="button" 
                                onClick={addImage}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                             >
                                Ekle
                             </button>
                        </div>

                        {/* Image Grid */}
                        {formData.images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`${formData.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <Upload className="h-6 w-6 mb-2" />
                                    <span className="text-xs font-medium">Yükle</span>
                                </button>
                            </div>
                        ) : (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                {uploading ? <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-3 animate-spin" /> : <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />}
                                <p className="text-sm text-gray-500">{uploading ? 'Yükleniyor...' : 'Tıkla veya resim sürükle'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Ürün Özellikleri</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Materyal</label>
                            <input type="text" name="details.materyal" value={((formData.details || {}) as Record<string, string>).materyal || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="Örn: 14 Ayar Altın" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                            <input type="text" name="details.renk" value={((formData.details || {}) as Record<string, string>).renk || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="Örn: Beyaz, Sarı" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ağırlık / Karat</label>
                            <input type="text" name="details.agirlik" value={((formData.details || {}) as Record<string, string>).agirlik || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="Örn: 2.50 gr" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Sertifika</label>
                             <input type="text" name="details.sertifika" value={((formData.details || {}) as Record<string, string>).sertifika || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" />
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="space-y-6">
                
                {/* Organization */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Organizasyon</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-sm">
                                <option value="pirlanta">Pırlanta</option>
                                <option value="altin-22">22 Ayar Altın</option>
                                <option value="altin-14">14 Ayar Altın</option>
                                <option value="sarrafiye">Sarrafiye</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Alt Kategori (Tip)</label>
                             <input type="text" name="subCategory" value={formData.subCategory || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm" placeholder="Örn: Yüzük, Kolye" />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Fiyatlandırma</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İndirimsiz Fiyat</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                                <input type="number" name="oldPrice" value={formData.oldPrice || ''} onChange={handleChange} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm" placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Envanter</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok Kodu (SKU)</label>
                        <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm" />
                    </div>
                </div>

            </div>
        </div>
      </form>
    </div>
  );
}