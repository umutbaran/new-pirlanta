'use client';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { SiteConfigProvider, type SiteConfig } from '@/context/SiteConfigContext';

export function Providers({ siteConfig, children }: { siteConfig: SiteConfig; children: React.ReactNode }) {
  return (
    <SiteConfigProvider value={siteConfig}>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </SiteConfigProvider>
  );
}
