import Link from 'next/link';

/** İçerik sayfalarının ortak başlık alanı: sayfa yolu, başlık ve kısa açıklama */
export default function PageHeader({ title, description, eyebrow }: { title: React.ReactNode; description?: React.ReactNode; eyebrow?: string }) {
  return (
    <header className="bg-ivory border-b border-line">
      <div className="container-lux py-12 md:py-20 text-center">
        <nav className="eyebrow !text-[10px] text-muted mb-6" aria-label="Sayfa yolu">
          <Link href="/" className="hover:text-ink">Anasayfa</Link>
          <span className="mx-3">/</span>
          <span className="text-ink-soft">{eyebrow || title}</span>
        </nav>
        <h1 className="font-display text-[44px] md:text-6xl leading-tight text-ink">{title}</h1>
        {description && <p className="mt-4 text-ink-soft max-w-xl mx-auto leading-relaxed">{description}</p>}
      </div>
    </header>
  );
}
