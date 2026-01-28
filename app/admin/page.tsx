'use client';

import { Package, TrendingUp, Users, DollarSign, ArrowRight, MoreHorizontal, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
              <p className="text-gray-500 mt-1">Bugün işler nasıl gidiyor?</p>
          </div>
          <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm">
                  Raporları İndir
              </button>
              <Link href="/admin/products/new" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 shadow-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Ürün Ekle
              </Link>
          </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Toplam Satış" 
            value="₺124,500" 
            change="+12.5%" 
            trend="up"
            icon={DollarSign}
        />
        <StatCard 
            title="Aktif Siparişler" 
            value="8" 
            change="-2.4%" 
            trend="down"
            icon={ShoppingBag}
        />
        <StatCard 
            title="Online Ziyaretçi" 
            value="342" 
            change="+8.2%" 
            trend="up"
            icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Recent Orders / Activity */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-semibold text-gray-900">Son Hareketler</h3>
               <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Tümünü Gör</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-gray-500 bg-gray-50/50 border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-3 font-medium">Sipariş / İşlem</th>
                        <th className="px-6 py-3 font-medium">Tarih</th>
                        <th className="px-6 py-3 font-medium">Müşteri</th>
                        <th className="px-6 py-3 font-medium text-right">Tutar</th>
                        <th className="px-6 py-3 font-medium text-right">Durum</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {[1, 2, 3, 4, 5].map((i) => (
                         <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">#SIP-2024-00{i}</td>
                            <td className="px-6 py-4 text-gray-500">2 Saat önce</td>
                            <td className="px-6 py-4 text-gray-900">Ahmet Yılmaz</td>
                            <td className="px-6 py-4 text-right font-medium">₺3,450.00</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Tamamlandı
                                </span>
                            </td>
                         </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Quick Actions & Tips */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
                <div className="space-y-2">
                    <Link href="/admin/products" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Package className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ürün Yönetimi</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                    <Link href="/admin/settings" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Müşteriler</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Mobil Uygulama</h3>
                    <p className="text-gray-300 text-sm mb-4">Yönetim panelinizi cebinizde taşıyın. Yakında App Store'da.</p>
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        Detaylı Bilgi
                    </button>
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>

         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: any) {
    const isUp = trend === 'up';
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change}
                </span>
                <span className="text-xs text-gray-400">geçen haftaya göre</span>
            </div>
        </div>
    );
}