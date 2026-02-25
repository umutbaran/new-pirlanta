'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Save, Plus, Trash2, Image as ImageIcon, Upload, Loader2, 
  LayoutTemplate, Grid, Info, Type, MapPin, Anchor, 
  Instagram, Facebook, Twitter, Search, XCircle, PlusCircle
} from 'lucide-react';
import { UiConfig, HeroSlide, MosaicItem, InfoCard, StoreItem } from '@/lib/db';
import { Product } from '@/data/products';
import { uploadProductImage } from '@/lib/upload';

export default function DesignPage() {
  const [config, setConfig] = useState<UiConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'slider' | 'mosaic' | 'info' | 'showcase' | 'store' | 'footer'>('slider');

  useEffect(() => {
    fetchConfigAndProducts();
  }, []);

  const fetchConfigAndProducts = async () => {
    try {
      const [configRes, productsRes] = await Promise.all([
        fetch('/api/ui-config'),
        fetch('/api/products')
      ]);
      const configData: UiConfig = await configRes.json();
      const productsData: Product[] = await productsRes.json();
      
      if (!configData.showcase) configData.showcase = { title: '', description: '', productIds: [] };
      if (!configData.showcase.productIds) configData.showcase.productIds = [];

      setConfig(configData);
      setProducts(productsData);
    } catch (err) {
      console.error('Veriler yüklenemedi', err);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/ui-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) alert('Tüm değişiklikler başarıyla kaydedildi.');
      else alert('Kaydetme sırasında bir hata oluştu.');
    } catch (err) {
      console.error(err);
      alert('Sistem hatası.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (section: string, index: number | null, fieldPath: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;
    const uploadKey = `${section}-${index}-${fieldPath}`;
    setUploadingId(uploadKey);
    try {
        const url = await uploadProductImage(file);
        if (url) {
            const newConfig = { ...config };
            if (section === 'slider' && index !== null) newConfig.heroSlides[index].image = url;
            else if (section === 'mosaic' && index !== null) newConfig.collectionMosaic.items[index].image = url;
            else if (section === 'info' && index !== null) newConfig.infoCenter.cards[index].image = url;
            else if (section === 'store' && index !== null) newConfig.storeSection.stores[index].image = url;
            setConfig(newConfig);
        }
    } finally {
        setUploadingId(null);
    }
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => { if (!config) return; const newSlides = [...config.heroSlides]; newSlides[index] = { ...newSlides[index], [field]: value } as HeroSlide; setConfig({ ...config, heroSlides: newSlides }); };
  const addSlide = () => { if (!config) return; const newSlide: HeroSlide = { id: Math.random().toString(36).substr(2, 9), image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', title: 'Yeni Başlık', subtitle: 'Alt başlık', buttonText: 'İncele', buttonLink: '/' }; setConfig({ ...config, heroSlides: [...config.heroSlides, newSlide] }); };
  const removeSlide = (index: number) => { if (!config || !confirm('Silmek istiyor musunuz?')) return; const newSlides = config.heroSlides.filter((_, i) => i !== index); setConfig({ ...config, heroSlides: newSlides }); };
  
  const updateMosaicItem = (index: number, field: keyof MosaicItem, value: string) => { if (!config) return; const newItems = [...config.collectionMosaic.items]; newItems[index] = { ...newItems[index], [field]: value }; setConfig({ ...config, collectionMosaic: { ...config.collectionMosaic, items: newItems as [MosaicItem, MosaicItem] } }); };
  const updateInfoCard = (index: number, field: keyof InfoCard, value: string) => { if (!config) return; const newCards = [...config.infoCenter.cards]; newCards[index] = { ...newCards[index], [field]: value }; setConfig({ ...config, infoCenter: { ...config.infoCenter, cards: newCards as [InfoCard, InfoCard, InfoCard] } }); };
  
  const addStore = () => { if (!config) return; const newStore: StoreItem = { id: Math.random().toString(36).substr(2, 9), title: 'Yeni Mağaza', badge: 'Şube', address: '', phone: '' }; setConfig({ ...config, storeSection: { ...config.storeSection, stores: [...config.storeSection.stores, newStore] } }); };
  const removeStore = (index: number) => { if (!config || !confirm('Silmek istiyor musunuz?')) return; const newStores = config.storeSection.stores.filter((_, i) => i !== index); setConfig({ ...config, storeSection: { ...config.storeSection, stores: newStores } }); };
  const updateStore = (index: number, field: keyof StoreItem, value: string) => { if (!config) return; const newStores = [...config.storeSection.stores]; newStores[index] = { ...newStores[index], [field]: value }; setConfig({ ...config, storeSection: { ...config.storeSection, stores: newStores } }); };
  
  const toggleShowcaseProduct = (productId: string) => {
    if (!config) return;
    const currentIds = config.showcase.productIds || [];
    let newIds;
    if (currentIds.includes(productId)) newIds = currentIds.filter(id => id !== productId);
    else newIds = [...currentIds, productId];
    setConfig({ ...config, showcase: { ...config.showcase, productIds: newIds } });
  };

  if (loading || !config) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="text-center"><Loader2 className="animate-spin text-[#D4AF37] h-12 w-12 mx-auto mb-4" /><p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Yükleniyor...</p></div></div>;

  const selectedProducts = products.filter(p => config.showcase.productIds?.includes(p.id));
  const availableProducts = products.filter(p => 
    !config.showcase.productIds?.includes(p.id) && 
    (p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())))
  );

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 -mx-6 md:-mx-10 -mt-10 p-6 md:p-10 mb-2 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
           <h1 className="text-3xl font-bold text-white tracking-tight">Vitrini Düzenle</h1>
           <p className="text-slate-400 text-sm mt-1">Mağazanızın tüm bölümlerini buradan yönetin.</p>
        </div>
        <div className="flex gap-3 relative z-10">
            <button 
                onClick={() => { if(confirm('Tüm kaydedilmemiş değişiklikler silinecek. Emin misiniz?')) fetchConfigAndProducts(); }}
                className="bg-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
            >
                SIFIRLA
            </button>
            <button onClick={saveChanges} disabled={saving} className="bg-[#D4AF37] text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-[#B4941F] transition-all flex items-center gap-2 shadow-xl shadow-[#D4AF37]/20 active:scale-95 disabled:opacity-50">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} {saving ? 'KAYDEDİLİYOR...' : 'YAYINA AL'}
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 bg-slate-100 rounded-[2rem] overflow-x-auto no-scrollbar border border-slate-200 shadow-inner">
         {[
           {id:'slider', label:'Slider', icon:LayoutTemplate}, 
           {id:'mosaic', label:'Koleksiyonlar', icon:Grid}, 
           {id:'info', label:'Bilgi Mrk.', icon:Info}, 
           {id:'showcase', label:'Ürün Vitrini', icon:Type}, 
           {id:'store', label:'Mağazalar', icon:MapPin}, 
           {id:'footer', label:'Footer', icon:Anchor}
         ].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as 'slider' | 'mosaic' | 'info' | 'showcase' | 'store' | 'footer')} className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                <tab.icon className={`h-4.5 w-4.5 ${activeTab === tab.id ? 'text-[#D4AF37]' : ''}`} /> {tab.label}
             </button>
         ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         
         {/* TAB: SLIDER */}
         {activeTab === 'slider' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Ana Sayfa Slider</h3>
                    <button onClick={addSlide} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#D4AF37] hover:underline"><PlusCircle className="h-5 w-5"/> Yeni Slide</button>
                </div>
                <div className="grid gap-8">
                    {config.heroSlides.map((slide, index) => (
                        <div key={slide.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group">
                            <button onClick={() => removeSlide(index)} className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 border border-red-100 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10"><Trash2 className="h-5 w-5" /></button>
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="relative aspect-[16/10] bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100 group/img">
                                    <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                                    <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                                        {uploadingId === `slider-${index}-image` ? <Loader2 className="animate-spin text-[#D4AF37]" /> : <Upload className="h-8 w-8 mb-2" />}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('slider', index, 'image', e)} />
                                    </label>
                                </div>
                                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Başlık</label><input type="text" value={slide.title} onChange={(e) => updateSlide(index, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link</label><input type="text" value={slide.buttonLink} onChange={(e) => updateSlide(index, 'buttonLink', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alt Başlık</label><input type="text" value={slide.subtitle} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buton Yazısı</label><input type="text" value={slide.buttonText} onChange={(e) => updateSlide(index, 'buttonText', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm" /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         )}

         {/* TAB: MOSAIC */}
         {activeTab === 'mosaic' && (
            <div className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Koleksiyon Bölümü</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bölüm Başlığı</label><input type="text" value={config.collectionMosaic.mainTitle} onChange={(e) => setConfig({...config, collectionMosaic: {...config.collectionMosaic, mainTitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm" /></div>
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Açıklama</label><input type="text" value={config.collectionMosaic.description} onChange={(e) => setConfig({...config, collectionMosaic: {...config.collectionMosaic, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm" /></div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    {config.collectionMosaic.items.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
                            <div className="relative aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden mb-6 group border border-slate-100">
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                                    <Upload className="h-8 w-8 mb-2" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('mosaic', index, 'image', e)} />
                                </label>
                            </div>
                            <div className="space-y-4">
                                <input type="text" value={item.title} onChange={(e) => updateMosaicItem(index, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-sm" />
                                <input type="text" value={item.subtitle} onChange={(e) => updateMosaicItem(index, 'subtitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         )}

         {/* TAB: INFO */}
         {activeTab === 'info' && (
            <div className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Bilgi Merkezi Başlıkları</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bölüm Başlığı</label><input type="text" value={config.infoCenter.title} onChange={(e) => setConfig({...config, infoCenter: {...config.infoCenter, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" /></div>
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Üst Başlık</label><input type="text" value={config.infoCenter.subtitle} onChange={(e) => setConfig({...config, infoCenter: {...config.infoCenter, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" /></div>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {config.infoCenter.cards.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
                            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-6 border border-slate-100 group/img shadow-sm">
                                <Image src={card.image} alt={card.title} fill className="object-cover" />
                                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                                    <Upload className="h-6 w-6 mb-2" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('info', index, 'image', e)} />
                                </label>
                            </div>
                            <div className="space-y-3">
                                <input type="text" value={card.title} onChange={(e) => updateInfoCard(index, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-sm" />
                                <textarea rows={3} value={card.description} onChange={(e) => updateInfoCard(index, 'description', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs leading-relaxed" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         )}

         {/* TAB: SHOWCASE */}
         {activeTab === 'showcase' && (
            <div className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Type className="text-[#D4AF37] h-7 w-7"/> Vitrin Alanı Metinleri</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Bölüm Ana Başlığı</label><input type="text" value={config.showcase.title} onChange={(e) => setConfig({...config, showcase: {...config.showcase, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm focus:border-[#D4AF37] outline-none font-bold text-slate-900 shadow-inner" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Bölüm Alt Açıklaması</label><input type="text" value={config.showcase.description} onChange={(e) => setConfig({...config, showcase: {...config.showcase, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm focus:border-[#D4AF37] outline-none text-slate-600 shadow-inner" /></div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 relative">
                            <div><h3 className="text-xl font-bold text-white">Vitrindekiler</h3><p className="text-slate-400 text-xs mt-1">Sitede yayında olanlar</p></div>
                            <div className="bg-[#D4AF37] text-slate-900 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">{selectedProducts.length} ÜRÜN</div>
                        </div>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar min-h-[400px]">
                            {selectedProducts.length > 0 ? selectedProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                                    <div className="w-16 h-16 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10"><Image src={product.images[0]} alt={product.name} fill className="object-cover" /></div>
                                    <div className="flex-1 min-w-0"><div className="font-bold text-white truncate text-sm">{product.name}</div><div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter italic">{product.sku}</div></div>
                                    <button onClick={() => toggleShowcaseProduct(product.id)} className="p-2 text-slate-500 hover:text-red-400 transition-all"><XCircle className="h-7 w-7" /></button>
                                </div>
                            )) : <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-[2rem]"><p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-loose">Vitrin Şu An Boş</p></div>}
                        </div>
                    </div>
                    <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div><h3 className="text-xl font-bold text-slate-900">Ürün Havuzu</h3><p className="text-slate-500 text-xs mt-1">Vitrine ekleyebileceğiniz tüm koleksiyon.</p></div>
                            <div className="relative w-full md:w-64"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input type="text" placeholder="Ürün ara..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                            {availableProducts.map(product => (
                                <div key={product.id} className="flex flex-col p-5 bg-slate-50 border border-slate-200 rounded-3xl group hover:border-[#D4AF37] transition-all relative">
                                    <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 relative border border-slate-100 shadow-sm"><Image src={product.images[0]} alt={product.name} fill className="object-cover" /></div>
                                    <div className="font-bold text-slate-900 truncate text-xs mb-1">{product.name}</div>
                                    <div className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter mb-4 italic">{product.sku || 'No SKU'}</div>
                                    <button onClick={() => toggleShowcaseProduct(product.id)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-slate-900 transition-all flex items-center justify-center gap-2"><PlusCircle className="h-4 w-4" /> EKLE</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
         )}

         {/* TAB: STORE */}
         {activeTab === 'store' && (
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm max-w-2xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Mağazalar Ayarları</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ana Başlık</label><input type="text" value={config.storeSection.title} onChange={(e) => setConfig({...config, storeSection: {...config.storeSection, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm" /></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alt Başlık</label><input type="text" value={config.storeSection.subtitle} onChange={(e) => setConfig({...config, storeSection: {...config.storeSection, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm" /></div>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Şube Listesi</h3>
                    <button onClick={addStore} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#D4AF37] hover:underline"><PlusCircle className="h-5 w-5"/> Yeni Şube</button>
               </div>
               <div className="grid gap-8">
                  {config.storeSection.stores.map((store, index) => (
                     <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group">
                        <button onClick={() => removeStore(index)} className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-red-100 z-10"><Trash2 className="h-4 w-4" /></button>
                        <div className="grid md:grid-cols-3 gap-10">
                           <div className="relative aspect-video bg-slate-50 rounded-2xl overflow-hidden group/img border border-slate-100">
                              {store.image ? <Image src={store.image} alt={store.title} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="h-10 w-10" /></div>}
                              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                                 {uploadingId === `store-${index}-image` ? <Loader2 className="animate-spin text-[#D4AF37]" /> : <Upload className="h-8 w-8 mb-2" />}
                                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('store', index, 'image', e)} />
                              </label>
                           </div>
                           <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Şube Adı</label><input type="text" value={store.title} onChange={(e) => updateStore(index, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" /></div>
                                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Etiket</label><input type="text" value={store.badge} onChange={(e) => updateStore(index, 'badge', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" /></div>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</label><input type="text" value={store.phone} onChange={(e) => updateStore(index, 'phone', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-mono" /></div>
                                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adres</label><textarea rows={2} value={store.address} onChange={(e) => updateStore(index, 'address', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs" /></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* TAB: FOOTER */}
         {activeTab === 'footer' && (
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Anchor className="text-[#D4AF37] h-6 w-6"/> Genel & Sosyal Medya</h3>
                  <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-5">
                          <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kısa Hakkımızda Metni</label><textarea rows={4} value={config.footer.description} onChange={(e) => setConfig({...config, footer: {...config.footer, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm leading-relaxed" /></div>
                          <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Copyright Yazısı</label><input type="text" value={config.footer.copyrightText} onChange={(e) => setConfig({...config, footer: {...config.footer, copyrightText: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium" /></div>
                      </div>
                      <div className="space-y-5">
                          <div className="space-y-1.5"><label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider"><Instagram className="h-3 w-3"/> Instagram URL</label><input type="text" value={config.footer.socialMedia.instagram} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, instagram: e.target.value}}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-mono" /></div>
                          <div className="space-y-1.5"><label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider"><Facebook className="h-3 w-3"/> Facebook URL</label><input type="text" value={config.footer.socialMedia.facebook} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, facebook: e.target.value}}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-mono" /></div>
                          <div className="space-y-1.5"><label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider"><Twitter className="h-3 w-3"/> Twitter URL</label><input type="text" value={config.footer.socialMedia.twitter} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, twitter: e.target.value}}})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-mono" /></div>
                      </div>
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900">Kurumsal Linkler</h3><button onClick={() => setConfig({...config, footer: {...config.footer, corporateLinks: [...config.footer.corporateLinks, {label: 'Yeni Link', url: '#'}]}})} className="text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1"><Plus className="h-4 w-4"/> Ekle</button></div>
                       <div className="space-y-4">
                           {config.footer.corporateLinks.map((link, idx) => (
                               <div key={idx} className="flex gap-3 items-center group bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all hover:border-[#D4AF37]/30">
                                   <div className="flex-1 space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Etiket</label><input type="text" value={link.label} onChange={(e) => { const newLinks = [...config.footer.corporateLinks]; newLinks[idx].label = e.target.value; setConfig({...config, footer: {...config.footer, corporateLinks: newLinks}}); }} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold" /></div>
                                   <div className="flex-1 space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">URL</label><input type="text" value={link.url} onChange={(e) => { const newLinks = [...config.footer.corporateLinks]; newLinks[idx].url = e.target.value; setConfig({...config, footer: {...config.footer, corporateLinks: newLinks}}); }} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-mono" /></div>
                                   <button onClick={() => setConfig({...config, footer: {...config.footer, corporateLinks: config.footer.corporateLinks.filter((_, i) => i !== idx)}})} className="p-2 text-slate-300 hover:text-red-500 transition-all mt-4"><Trash2 className="h-4 w-4"/></button>
                               </div>
                           ))}
                       </div>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                       <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900">Müşteri Hizmetleri</h3><button onClick={() => setConfig({...config, footer: {...config.footer, customerServiceLinks: [...config.footer.customerServiceLinks, {label: 'Yeni Link', url: '#'}]}})} className="text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1"><Plus className="h-4 w-4"/> Ekle</button></div>
                       <div className="space-y-4">
                           {config.footer.customerServiceLinks.map((link, idx) => (
                               <div key={idx} className="flex gap-3 items-center group bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all hover:border-[#D4AF37]/30">
                                   <div className="flex-1 space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Etiket</label><input type="text" value={link.label} onChange={(e) => { const newLinks = [...config.footer.customerServiceLinks]; newLinks[idx].label = e.target.value; setConfig({...config, footer: {...config.footer, customerServiceLinks: newLinks}}); }} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold" /></div>
                                   <div className="flex-1 space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">URL</label><input type="text" value={link.url} onChange={(e) => { const newLinks = [...config.footer.customerServiceLinks]; newLinks[idx].url = e.target.value; setConfig({...config, footer: {...config.footer, customerServiceLinks: newLinks}}); }} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-mono" /></div>
                                   <button onClick={() => setConfig({...config, footer: {...config.footer, customerServiceLinks: config.footer.customerServiceLinks.filter((_, i) => i !== idx)}})} className="p-2 text-slate-300 hover:text-red-500 transition-all mt-4"><Trash2 className="h-4 w-4"/></button>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
}
