'use client';

import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: React.ReactNode;
}

export default function MainLayout({ children, navbar, footer, whatsapp }: MainLayoutProps) {
  const pathname = usePathname();
  // Ensure we don't crash if pathname is null (e.g. during initial SSG)
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  return (
    <>
      {!isAdmin && navbar}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && whatsapp}
      {!isAdmin && footer}
    </>
  );
}