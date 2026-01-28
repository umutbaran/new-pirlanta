import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-serif font-bold text-gray-100 absolute -z-10">404</h1>
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Aradığınız Işıltıyı Bulamadık</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir. 
        Koleksiyonlarımıza göz atmaya ne dersiniz?
      </p>
      <Link 
        href="/" 
        className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-[var(--color-brand-gold)] transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
