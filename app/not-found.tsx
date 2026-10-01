import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-lux min-h-[65vh] flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-[120px] md:text-[160px] leading-none text-line select-none" aria-hidden>404</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl text-ink">Aradığınız ışıltıyı bulamadık</h1>
      <p className="mt-4 text-ink-soft max-w-md leading-relaxed">
        Aradığınız sayfa kaldırılmış veya adı değiştirilmiş olabilir. Koleksiyonlarımıza göz atmaya ne dersiniz?
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link href="/koleksiyon/tum-urunler" className="btn-primary">Koleksiyonu Keşfet</Link>
        <Link href="/" className="btn-outline">Ana Sayfa</Link>
      </div>
    </div>
  );
}
