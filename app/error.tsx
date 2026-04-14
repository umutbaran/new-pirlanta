'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col h-[70vh] w-full items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <RefreshCw className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">Bir şeyler yanlış gitti</h2>
      <p className="text-gray-500 max-w-md mb-8 text-sm md:text-base">
        İstediğiniz sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="bg-black text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Tekrar Dene
        </button>
        <Link
          href="/"
          className="border border-gray-200 text-gray-900 px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="h-4 w-4" /> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
