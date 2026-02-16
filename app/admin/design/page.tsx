'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Plus, Trash2, Image as ImageIcon, Upload, Loader2, LayoutTemplate, Grid, Info, Type, MapPin, Anchor, Instagram, Facebook, Twitter } from 'lucide-react';
import { UiConfig, HeroSlide, MosaicItem, InfoCard, StoreItem, FooterLink } from '@/lib/db';
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
      
      if (!configData.showcase.productIds) {
        configData.showcase.productIds = [];
      }

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
      await fetch('/api/ui-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      alert('Tüm değişiklikler kaydedildi.');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (section: string, index: number | null, fieldPath: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    const uploadKey = `${section}-${index}-${fieldPath}`;
    setUploadingId(uploadKey);
    const url = await uploadProductImage(file);
    
    if (url) {
      const newConfig = { ...config };
      if (section === 'slider' && index !== null) newConfig.heroSlides[index].image = url;
      else if (section === 'mosaic' && index !== null) newConfig.collectionMosaic.items[index].image = url;
      else if (section === 'info' && index !== null) newConfig.infoCenter.cards[index].image = url;
      else if (section === 'store' && index !== null) newConfig.storeSection.stores[index].image = url;
      setConfig(newConfig);
    } else {
      alert('Resim yüklenemedi.');
    }
    setUploadingId(null);
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => { if (!config) return; const newSlides = [...config.heroSlides]; newSlides[index] = { ...newSlides[index], [field]: value }; setConfig({ ...config, heroSlides: newSlides }); };
  const addSlide = () => { if (!config) return; const newSlide: HeroSlide = { id: Math.random().toString(36).substr(2, 9), image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', title: 'Yeni Başlık', subtitle: 'Alt başlık', buttonText: 'İncele', buttonLink: '/' }; setConfig({ ...config, heroSlides: [...config.heroSlides, newSlide] }); };
  const removeSlide = (index: number) => { if (!config || !confirm('Silmek istediğine emin misin?')) return; const newSlides = config.heroSlides.filter((_, i) => i !== index); setConfig({ ...config, heroSlides: newSlides }); };
  const updateMosaicItem = (index: number, field: keyof MosaicItem, value: string) => { if (!config) return; const newItems = [...config.collectionMosaic.items]; newItems[index] = { ...newItems[index], [field]: value }; setConfig({ ...config, collectionMosaic: { ...config.collectionMosaic, items: newItems as [MosaicItem, MosaicItem] } }); };
  const updateInfoCard = (index: number, field: keyof InfoCard, value: string) => { if (!config) return; const newCards = [...config.infoCenter.cards]; newCards[index] = { ...newCards[index], [field]: value }; setConfig({ ...config, infoCenter: { ...config.infoCenter, cards: newCards as [InfoCard, InfoCard, InfoCard] } }); };
  const addStore = () => { if (!config) return; const newStore: StoreItem = { id: Math.random().toString(36).substr(2, 9), title: 'Yeni Mağaza', badge: 'Şube', address: '', phone: '' }; setConfig({ ...config, storeSection: { ...config.storeSection, stores: [...config.storeSection.stores, newStore] } }); };
  const removeStore = (index: number) => { if (!config || !confirm('Silmek istediğine emin misin?')) return; const newStores = config.storeSection.stores.filter((_, i) => i !== index); setConfig({ ...config, storeSection: { ...config.storeSection, stores: newStores } }); };
  const updateStore = (index: number, field: keyof StoreItem, value: string) => { if (!config) return; const newStores = [...config.storeSection.stores]; newStores[index] = { ...newStores[index], [field]: value }; setConfig({ ...config, storeSection: { ...config.storeSection, stores: newStores } }); };
  const addFooterLink = (type: 'corporate' | 'customer') => { if (!config) return; const newLink: FooterLink = { label: 'Yeni Link', url: '#' }; const newFooter = { ...config.footer }; if (type === 'corporate') newFooter.corporateLinks = [...newFooter.corporateLinks, newLink]; else newFooter.customerServiceLinks = [...newFooter.customerServiceLinks, newLink]; setConfig({ ...config, footer: newFooter }); };
  const removeFooterLink = (type: 'corporate' | 'customer', index: number) => { if (!config) return; const newFooter = { ...config.footer }; if (type === 'corporate') newFooter.corporateLinks = newFooter.corporateLinks.filter((_, i) => i !== index); else newFooter.customerServiceLinks = newFooter.customerServiceLinks.filter((_, i) => i !== index); setConfig({ ...config, footer: newFooter }); };
  const updateFooterLink = (type: 'corporate' | 'customer', index: number, field: keyof FooterLink, value: string) => { if (!config) return; const newFooter = { ...config.footer }; const links = type === 'corporate' ? [...newFooter.corporateLinks] : [...newFooter.customerServiceLinks]; links[index] = { ...links[index], [field]: value }; if (type === 'corporate') newFooter.corporateLinks = links; else newFooter.customerServiceLinks = links; setConfig({ ...config, footer: newFooter }); };

  const toggleShowcaseProduct = (productId: string) => {
    if (!config) return;
    const currentIds = config.showcase.productIds || [];
    let newIds;
    if (currentIds.includes(productId)) {
        newIds = currentIds.filter(id => id !== productId);
    } else {
        newIds = [...currentIds, productId];
    }
    setConfig({ ...config, showcase: { ...config.showcase, productIds: newIds } });
  };

  if (loading || !config) return <div className="p-8 text-center">Yükleniyor...</div>;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const tabs = [
    { id: 'slider', label: 'Slider', icon: LayoutTemplate },
    { id: 'mosaic', label: 'Koleksiyonlar', icon: Grid },
    { id: 'info', label: 'Bilgi Mrk.', icon: Info },
    { id: 'showcase', label: 'Vitrin (Ürün Seç)', icon: Type },
    { id: 'store', label: 'Mağazalar', icon: MapPin },
    { id: 'footer', label: 'Footer', icon: Anchor },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#f3f4f6] py-4 z-20 border-b border-gray-200">
        <div><h1 className="text-2xl font-bold text-gray-900">Vitrin & İçerik Düzenle</h1><p className="text-gray-500 text-sm mt-1">Anasayfanın tüm bölümlerini buradan yönet.</p></div>
        <button onClick={saveChanges} disabled={saving} className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#B4941F] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"><Save className="h-4 w-4" /> {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}</button>
      </div>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
         {tabs.map(tab => (
             <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as 'slider' | 'mosaic' | 'info' | 'showcase' | 'store' | 'footer')} 
                className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-[#D4AF37] text-[#D4AF37] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
             >
                <tab.icon className="h-4 w-4" /> {tab.label}
             </button>
         ))}
      </div>

      <div className="space-y-8">
         {activeTab === 'slider' && (
            <div className="space-y-6">{config.heroSlides.map((slide, index) => (<div key={slide.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative"><button onClick={() => removeSlide(index)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-50 rounded"><Trash2 className="h-5 w-5" /></button><div className="grid md:grid-cols-3 gap-6"><div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"><Image src={slide.image} alt={slide.title} fill className="object-cover" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">{uploadingId === `slider-${index}-image` ? <Loader2 className="animate-spin" /> : <Upload className="h-8 w-8 mb-2" />}<span className="text-xs font-bold">Resmi Değiştir</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('slider', index, 'image', e)} /></label></div><div className="md:col-span-2 space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-500">Başlık</label><input type="text" value={slide.title} onChange={(e) => updateSlide(index, 'title', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Link</label><input type="text" value={slide.buttonLink} onChange={(e) => updateSlide(index, 'buttonLink', e.target.value)} className="w-full border p-2 rounded font-mono text-sm" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-500">Alt Başlık</label><input type="text" value={slide.subtitle} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Buton Metni</label><input type="text" value={slide.buttonText} onChange={(e) => updateSlide(index, 'buttonText', e.target.value)} className="w-full border p-2 rounded" /></div></div></div></div></div>))}<button onClick={addSlide} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#D4AF37] hover:text-[#D4AF37] flex justify-center gap-2 items-center"><Plus className="h-5 w-5" /> Yeni Slider Ekle</button></div>
         )}
         {activeTab === 'mosaic' && (
            <div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-gray-200"><h3 className="font-bold mb-4">Genel Ayarlar</h3><div className="grid gap-4"><div><label className="text-xs font-bold text-gray-500">Bölüm Başlığı</label><input type="text" value={config.collectionMosaic.mainTitle} onChange={(e) => setConfig({...config, collectionMosaic: {...config.collectionMosaic, mainTitle: e.target.value}})} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Açıklama</label><input type="text" value={config.collectionMosaic.description} onChange={(e) => setConfig({...config, collectionMosaic: {...config.collectionMosaic, description: e.target.value}})} className="w-full border p-2 rounded" /></div></div></div><div className="grid md:grid-cols-2 gap-6">{config.collectionMosaic.items.map((item, index) => (<div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4"><Image src={item.image} alt={item.title} fill className="object-cover" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">{uploadingId === `mosaic-${index}-image` ? <Loader2 className="animate-spin" /> : <Upload className="h-8 w-8 mb-2" />}<span className="text-xs font-bold">Resmi Değiştir</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('mosaic', index, 'image', e)} /></label></div><div className="space-y-3"><div><label className="text-xs font-bold text-gray-500">Başlık</label><input type="text" value={item.title} onChange={(e) => updateMosaicItem(index, 'title', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Alt Başlık</label><input type="text" value={item.subtitle} onChange={(e) => updateMosaicItem(index, 'subtitle', e.target.value)} className="w-full border p-2 rounded" /></div><div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-bold text-gray-500">Buton</label><input type="text" value={item.buttonText} onChange={(e) => updateMosaicItem(index, 'buttonText', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Link</label><input type="text" value={item.link} onChange={(e) => updateMosaicItem(index, 'link', e.target.value)} className="w-full border p-2 rounded font-mono text-sm" /></div></div></div></div>))}</div></div>
         )}
         {activeTab === 'info' && (
            <div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-gray-200"><h3 className="font-bold mb-4">Genel Ayarlar</h3><div className="grid gap-4"><div><label className="text-xs font-bold text-gray-500">Bölüm Başlığı</label><input type="text" value={config.infoCenter.title} onChange={(e) => setConfig({...config, infoCenter: {...config.infoCenter, title: e.target.value}})} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Üst Başlık</label><input type="text" value={config.infoCenter.subtitle} onChange={(e) => setConfig({...config, infoCenter: {...config.infoCenter, subtitle: e.target.value}})} className="w-full border p-2 rounded" /></div></div></div><div className="grid md:grid-cols-3 gap-6">{config.infoCenter.cards.map((card, index) => (<div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><div className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4"><Image src={card.image} alt={card.title} fill className="object-cover" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">{uploadingId === `info-${index}-image` ? <Loader2 className="animate-spin" /> : <Upload className="h-8 w-8 mb-2" />}<span className="text-xs font-bold">Resmi Değiştir</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('info', index, 'image', e)} /></label></div><div className="space-y-3"><div><label className="text-xs font-bold text-gray-500">Başlık</label><input type="text" value={card.title} onChange={(e) => updateInfoCard(index, 'title', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Açıklama</label><textarea rows={3} value={card.description} onChange={(e) => updateInfoCard(index, 'description', e.target.value)} className="w-full border p-2 rounded text-sm" /></div><div><label className="text-xs font-bold text-gray-500">Buton</label><input type="text" value={card.buttonText} onChange={(e) => updateInfoCard(index, 'buttonText', e.target.value)} className="w-full border p-2 rounded" /></div></div></div>))}</div></div>
         )}

         {/* TAB: SHOWCASE (UPDATED) */}
         {activeTab === 'showcase' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl">
                  <h3 className="font-bold mb-4 text-lg">Vitrin Başlığı</h3>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Ürün Vitrini Başlığı</label><input type="text" value={config.showcase.title} onChange={(e) => setConfig({...config, showcase: {...config.showcase, title: e.target.value}})} className="w-full border p-2 rounded" /></div>
                  <div className="mt-4"><label className="block text-xs font-bold text-gray-500 mb-1">Alt Açıklama</label><input type="text" value={config.showcase.description} onChange={(e) => setConfig({...config, showcase: {...config.showcase, description: e.target.value}})} className="w-full border p-2 rounded" /></div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold mb-4 text-lg">Ürün Seçimi</h3>
                  <p className="text-sm text-gray-500 mb-4">Vitrinde görünmesini istediğiniz ürünleri seçin.</p>
                  
                  <div className="mb-4">
                     <input 
                       type="text" 
                       placeholder="Ürün adı veya kodu ile ara..." 
                       value={productSearch}
                       onChange={(e) => setProductSearch(e.target.value)}
                       className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                     {filteredProducts.map(product => {
                        const isSelected = config.showcase.productIds?.includes(product.id);
                        return (
                           <div 
                             key={product.id} 
                             onClick={() => toggleShowcaseProduct(product.id)}
                             className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                           >
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                 <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="font-medium text-sm truncate">{product.name}</div>
                                 <div className="text-xs text-gray-500">{product.sku}</div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-white' : 'border-gray-300'}`}>
                                 {isSelected && <span className="text-[10px]">✓</span>}
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-right">
                     {config.showcase.productIds?.length || 0} ürün seçildi
                  </div>
               </div>
            </div>
         )}

         {/* TAB: STORE & FOOTER (Same as before) */}
         {activeTab === 'store' && (
            <div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl"><h3 className="font-bold mb-4 text-lg">Genel Başlıklar</h3><div className="space-y-4"><div><label className="block text-xs font-bold text-gray-500 mb-1">Bölüm Başlığı</label><input type="text" value={config.storeSection.title} onChange={(e) => setConfig({...config, storeSection: {...config.storeSection, title: e.target.value}})} className="w-full border p-2 rounded" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1">Alt Başlık</label><input type="text" value={config.storeSection.subtitle} onChange={(e) => setConfig({...config, storeSection: {...config.storeSection, subtitle: e.target.value}})} className="w-full border p-2 rounded" /></div></div></div><div className="space-y-4">{config.storeSection.stores.map((store, index) => (<div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative"><button onClick={() => removeStore(index)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-50 rounded"><Trash2 className="h-5 w-5" /></button><div className="grid md:grid-cols-2 gap-6"><div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">{store.image ? <Image src={store.image} alt={store.title} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="h-8 w-8" /></div>}<label className="absolute inset-0 bg-black\/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">{uploadingId === `store-${index}-image` ? <Loader2 className="animate-spin" /> : <Upload className="h-8 w-8 mb-2" />}<span className="text-xs font-bold">Resmi Değiştir</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('store', index, 'image', e)} /></label></div><div className="space-y-3"><div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-bold text-gray-500">Şube Adı</label><input type="text" value={store.title} onChange={(e) => updateStore(index, 'title', e.target.value)} className="w-full border p-2 rounded" /></div><div><label className="text-xs font-bold text-gray-500">Etiket</label><input type="text" value={store.badge} onChange={(e) => updateStore(index, 'badge', e.target.value)} className="w-full border p-2 rounded" /></div></div><div><label className="text-xs font-bold text-gray-500">Adres</label><textarea rows={3} value={store.address} onChange={(e) => updateStore(index, 'address', e.target.value)} className="w-full border p-2 rounded text-sm" /></div><div><label className="text-xs font-bold text-gray-500">Telefon</label><input type="text" value={store.phone} onChange={(e) => updateStore(index, 'phone', e.target.value)} className="w-full border p-2 rounded" /></div></div></div></div>))}<button onClick={addStore} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#D4AF37] hover:text-[#D4AF37] flex justify-center gap-2 items-center"><Plus className="h-5 w-5" /> Yeni Mağaza Ekle</button></div></div>
         )}
         {activeTab === 'footer' && (
            <div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h3 className="font-bold mb-4 border-b pb-2">Genel & Sosyal Medya</h3><div className="space-y-4"><div><label className="block text-xs font-bold text-gray-500 mb-1">Hakkımızda Yazısı</label><textarea rows={3} value={config.footer.description} onChange={(e) => setConfig({...config, footer: {...config.footer, description: e.target.value}})} className="w-full border p-2 rounded text-sm" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1">Copyright Metni</label><input type="text" value={config.footer.copyrightText} onChange={(e) => setConfig({...config, footer: {...config.footer, copyrightText: e.target.value}})} className="w-full border p-2 rounded" /></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-xs font-bold text-gray-500 mb-1"><Instagram className="h-3 w-3 inline mr-1"/>Instagram</label><input type="text" value={config.footer.socialMedia.instagram} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, instagram: e.target.value}}})} className="w-full border p-2 rounded text-sm" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1"><Facebook className="h-3 w-3 inline mr-1"/>Facebook</label><input type="text" value={config.footer.socialMedia.facebook} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, facebook: e.target.value}}})} className="w-full border p-2 rounded text-sm" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1"><Twitter className="h-3 w-3 inline mr-1"/>Twitter</label><input type="text" value={config.footer.socialMedia.twitter} onChange={(e) => setConfig({...config, footer: {...config.footer, socialMedia: {...config.footer.socialMedia, twitter: e.target.value}}})} className="w-full border p-2 rounded text-sm" /></div></div></div></div><div className="grid md:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><div className="flex justify-between items-center mb-4"><h3 className="font-bold">Kurumsal Linkler</h3><button onClick={() => addFooterLink('corporate')} className="text-[#D4AF37] text-xs font-bold hover:underline">+ Ekle</button></div><div className="space-y-2">{config.footer.corporateLinks.map((link, idx) => (<div key={idx} className="flex gap-2 items-center"><input type="text" value={link.label} onChange={(e) => updateFooterLink('corporate', idx, 'label', e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="Başlık" /><input type="text" value={link.url} onChange={(e) => updateFooterLink('corporate', idx, 'url', e.target.value)} className="flex-1 border p-2 rounded text-sm font-mono" placeholder="URL" /><button onClick={() => removeFooterLink('corporate', idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>))}</div></div><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><div className="flex justify-between items-center mb-4"><h3 className="font-bold">Müşteri Hizmetleri</h3><button onClick={() => addFooterLink('customer')} className="text-[#D4AF37] text-xs font-bold hover:underline">+ Ekle</button></div><div className="space-y-2">{config.footer.customerServiceLinks.map((link, idx) => (<div key={idx} className="flex gap-2 items-center"><input type="text" value={link.label} onChange={(e) => updateFooterLink('customer', idx, 'label', e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="Başlık" /><input type="text" value={link.url} onChange={(e) => updateFooterLink('customer', idx, 'url', e.target.value)} className="flex-1 border p-2 rounded text-sm font-mono" placeholder="URL" /><button onClick={() => removeFooterLink('customer', idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>))}</div></div></div></div>
         )}
      </div>
    </div>
  );
}