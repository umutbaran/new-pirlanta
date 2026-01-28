'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#D4AF37] transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Yeni Ürün Ekle
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ürün adı veya kodu ile ara..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
             Yükleniyor...
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 font-medium bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Görsel</th>
                <th className="px-6 py-3">Ürün Adı</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Fiyat</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {product.name}
                    <div className="text-xs text-gray-400">{product.sku}</div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 capitalize">{product.category}</td>
                  <td className="px-6 py-3 font-medium">{product.price.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
