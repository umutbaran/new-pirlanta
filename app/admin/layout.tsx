'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  Globe, 
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col shadow-2xl`}>
        <div className="h-20 flex items-center px-8 border-b border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center font-bold text-slate-900">N</div>
              <span className="font-bold text-lg tracking-wider text-white">NEW PIRLANTA</span>
           </div>
           <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-slate-400" />
           </button>
        </div>
        
        <nav className="p-6 space-y-1.5 flex-1 overflow-y-auto">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 ml-2">Menü</p>
           {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 onClick={() => setSidebarOpen(false)}
                 className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                   isActive 
                     ? 'bg-[#D4AF37] text-slate-900 shadow-lg shadow-[#D4AF37]/20' 
                     : 'text-slate-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                 <span className="flex-1">{item.name}</span>
                 {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
               </Link>
             );
           })}
        </nav>

        <div className="p-6 space-y-3 bg-white/5 border-t border-white/5">
           <Link 
             href="/"
             target="_blank"
             className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-colors border border-white/10 hover:border-white/20"
           >
             <Globe className="h-5 w-5" />
             Mağazayı Görüntüle
           </Link>
           <button 
             onClick={() => signOut({ callbackUrl: '/admin/login' })}
             className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
           >
             <LogOut className="h-5 w-5" />
             Güvenli Çıkış
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
           <button 
             className="lg:hidden p-2 rounded-lg bg-slate-50 border border-slate-200"
             onClick={() => setSidebarOpen(true)}
           >
              <Menu className="h-6 w-6 text-slate-600" />
           </button>
           
           <div className="hidden md:block">
              <h2 className="text-sm font-medium text-slate-500">Hoş geldin, <span className="text-slate-900 font-bold">Admin</span></h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                AD
              </div>
           </div>
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
           {children}
        </div>
      </main>
    </div>
  );
}
