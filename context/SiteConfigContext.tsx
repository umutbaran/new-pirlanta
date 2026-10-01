'use client';

import { createContext, useContext } from 'react';

/** İstemci bileşenlerinin ihtiyaç duyduğu site ayarları (sunucuda okunup layout'tan aktarılır) */
export interface SiteConfig {
  showPrices: boolean;
}

const SiteConfigContext = createContext<SiteConfig>({ showPrices: false });

export function SiteConfigProvider({ value, children }: { value: SiteConfig; children: React.ReactNode }) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
