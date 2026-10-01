'use client';

import { useEffect } from 'react';
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
    <div className="container-lux min-h-[65vh] flex flex-col items-center justify-center py-24 text-center">
      <span className="block h-12 w-px bg-gold mb-8" aria-hidden />
      <h1 className="font-display text-4xl md:text-5xl text-ink">Bir şeyler ters gitti</h1>
      <p className="mt-4 text-ink-soft max-w-md leading-relaxed">
        Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <button onClick={() => reset()} className="btn-primary">Tekrar Dene</button>
        <Link href="/" className="btn-outline">Ana Sayfa</Link>
      </div>
    </div>
  );
}
