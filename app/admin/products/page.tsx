'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Loader2, Package, Filter, ExternalLink } from 'lucide-react';
import { Product } from '@/data/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ürün Yönetimi</h1>
           <p className="text-slate-500 text-sm mt-1">Koleksiyonunuzdaki toplam {products.length} ürünü buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#D4AF37] text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#B4941F] transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95">
          <Plus className="h-5 w-5" /> Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ürün adı veya SKU ile ara..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all outline-none appearance-none cursor-pointer"
                >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="pirlanta">Pırlanta</option>
                    <option value="altin-22">22 Ayar Altın</option>
                    <option value="altin-14">14 Ayar Altın</option>
                    <option value="sarrafiye">Sarrafiye</option>
                </select>
            </div>
          </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500">
             <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#D4AF37]" />
             <p className="font-medium">Koleksiyon yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 font-semibold bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4">Ürün</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Fiyat</th>
                  <th className="px-6 py-4 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group-hover:border-[#D4AF37]/30 transition-colors">
                            {product.images && product.images.length > 0 ? (
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    fill
                                    className="object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Package className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-[400px]">{product.name}</h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-tight">{product.sku || 'SKU Belirtilmedi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                            {Number(product.price).toLocaleString('tr-TR')} <span className="text-[10px] text-slate-400 font-normal ml-0.5">₺</span>
                        </div>
                        {product.oldPrice && (
                            <div className="text-[10px] text-slate-400 line-through">
                                {Number(product.oldPrice).toLocaleString('tr-TR')} ₺
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link 
                            href={`/urun/${product.id}`} 
                            target="_blank"
                            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            title="Mağazada Gör"
                        >
                          <ExternalLink className="h-4.5 w-4.5" />
                        </Link>
                        <Link 
                            href={`/admin/products/${product.id}`} 
                            className="p-2.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Düzenle"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Sil"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 border border-slate-100">
                                <Search className="h-8 w-8 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-medium italic">Aramanızla eşleşen ürün bulunamadı.</p>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
