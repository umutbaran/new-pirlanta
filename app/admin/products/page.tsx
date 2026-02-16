'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
           <p className="text-gray-500 text-sm mt-1">{products.length} ürün listeleniyor</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c4a030] transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Yeni Ürün Ekle
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ürün adı veya kodu ile ara..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-white cursor-pointer min-w-[200px]"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="pirlanta">Pırlanta</option>
            <option value="altin-22">22 Ayar Altın</option>
            <option value="altin-14">14 Ayar Altın</option>
            <option value="sarrafiye">Sarrafiye</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#D4AF37]" />
             Ürünler yükleniyor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 font-medium bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Görsel</th>
                  <th className="px-6 py-3">Ürün Detayı</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Fiyat</th>
                  <th className="px-6 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                        {product.images && product.images.length > 0 ? (
                            <Image 
                                src={product.images[0]} 
                                alt={product.name} 
                                fill
                                className="object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Search className="h-4 w-4" />
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      <div className="line-clamp-1">{product.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{product.sku}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600 capitalize">
                            {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">{Number(product.price).toLocaleString('tr-TR')} ₺</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Aramanızla eşleşen ürün bulunamadı.
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
