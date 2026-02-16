import { Package, Tag, Image as ImageIcon, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/db';

export default async function Dashboard() {
  const products = await getProducts();
  
  // Calculate Stats
  const totalProducts = products.length;
  const categories = products.reduce((acc: Record<string, number>, curr) => {
    const cat = curr.category || 'Diğer';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categories).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];
  const uniqueCategories = Object.keys(categories).length;
  const latestProducts = [...products].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
              <p className="text-gray-500 mt-1">Ürün ve envanter yönetim paneli.</p>
          </div>
          <div className="flex gap-3">
              <Link href="/admin/products/new" className="px-4 py-2 bg-[#D4AF37] text-white text-sm font-medium rounded-lg hover:bg-[#B4941F] shadow-sm flex items-center gap-2 transition-transform active:scale-95">
                  <Package className="h-4 w-4" />
                  Yeni Ürün Ekle
              </Link>
          </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Toplam Ürün" 
            value={totalProducts} 
            subValue="Adet listelenen ürün"
            icon={Package}
            color="blue"
        />
        <StatCard 
            title="Kategori Sayısı" 
            value={uniqueCategories} 
            subValue="Farklı ürün grubu"
            icon={Tag}
            color="purple"
        />
        <StatCard 
            title="En Çok Ürün" 
            value={topCategory ? topCategory[0].toUpperCase() : '-'} 
            subValue={`${topCategory ? topCategory[1] : 0} Adet`}
            icon={Tag}
            color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Recent Products */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-semibold text-gray-900">Son Eklenen Ürünler</h3>
               <Link href="/admin/products" className="text-sm text-blue-600 font-medium hover:text-blue-700">Tümünü Gör</Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-gray-500 bg-gray-50/50 border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-3 font-medium">Ürün</th>
                        <th className="px-6 py-3 font-medium">Kategori</th>
                        <th className="px-6 py-3 font-medium text-right">Fiyat</th>
                        <th className="px-6 py-3 font-medium text-right">Durum</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {latestProducts.map((product) => (
                         <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                {product.images && product.images.length > 0 ? (
                                    <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100">
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <Package className="h-4 w-4 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <div className="line-clamp-1">{product.name}</div>
                                    <div className="text-xs text-gray-400 font-normal">{product.sku}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 capitalize">{product.category}</td>
                            <td className="px-6 py-4 text-right font-medium">₺{Number(product.price).toLocaleString('tr-TR')}</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Yayında
                                </span>
                            </td>
                         </tr>
                     ))}
                     {latestProducts.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                Henüz ürün eklenmemiş.
                            </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Quick Actions */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                <div className="space-y-2">
                    <Link href="/admin/products/new" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Package className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Yeni Ürün Ekle</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                    <Link href="/admin/media" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Medya Kütüphanesi</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                    <Link href="/admin/settings" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Site Ayarları</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

interface StatCardProps {
    title: string;
    value: string | number;
    subValue: string;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, subValue, icon: Icon, color }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${colors[color] || colors.blue}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className="mt-2">
                <span className="text-xs text-gray-400">{subValue}</span>
            </div>
        </div>
    );
}
