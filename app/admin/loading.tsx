'use client';

import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex flex-col h-[60vh] w-full items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[#D4AF37]/10 border-t-[#D4AF37] animate-spin"></div>
        <Loader2 className="h-6 w-6 text-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Admin Paneli Hazırlanıyor...
      </p>
    </div>
  );
}
