'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Package, Image as ImageIcon, Settings, LogOut, Menu, Globe, Calendar } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Genel Bakış', icon: LayoutDashboard, href: '/admin' },
    { name: 'Ürün Yönetimi', icon: Package, href: '/admin/products' },
    { name: 'Kategoriler', icon: Menu, href: '/admin/categories' },
    { name: 'Vitrini Düzenle', icon: ImageIcon, href: '/admin/design' },
    { name: 'Medya / Fotoğraflar', icon: ImageIcon, href: '/admin/media' },
    { name: 'Ekonomi Bülteni', icon: Calendar, href: '/admin/bulletin' },
    { name: 'Ayarlar', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
           <span className="font-serif font-bold text-xl tracking-wide text-gray-900">NEW PIRLANTA</span>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
           {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                   isActive 
                     ? 'bg-[#D4AF37] text-white shadow-md shadow-orange-100' 
                     : 'text-gray-600 hover:bg-gray-50 hover:text-[#D4AF37]'
                 }`}
               >
                 <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                 {item.name}
               </Link>
             );
           })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
           <Link 
             href="/"
             target="_blank"
             className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
           >
             <Globe className="h-5 w-5" />
             Mağazaya Git
           </Link>
           <button 
             onClick={() => signOut({ callbackUrl: '/admin/login' })}
             className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
           >
             <LogOut className="h-5 w-5" />
             Çıkış Yap
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Toggle) */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:hidden">
           <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-6 w-6 text-gray-600" />
           </button>
           <span className="font-bold text-gray-900">Yönetim Paneli</span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
