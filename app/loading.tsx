'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col h-[70vh] w-full items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37]" />
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">
        New Pırlanta Yükleniyor...
      </p>
    </div>
  );
}
