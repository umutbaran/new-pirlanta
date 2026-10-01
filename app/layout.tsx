// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import MainLayout from "@/components/MainLayout";
import { Providers } from "@/components/Providers";
import { getSettings, getCategories, getUiConfig } from "@/lib/db";
import AnalyticsTracker from "@/components/AnalyticsTracker";

// Başlıklar: ince ve zarif bir serif; metinler: sade, geometrik bir sans
const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newpirlanta.com";
const siteName = "New Pırlanta";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Mücevher & Tasarım`,
    template: `%s | ${siteName}`,
  },
  description: "Lüks pırlanta ve altın mücevher koleksiyonları. Baran Kuyumculuk güvencesiyle en özel tasarımlar.",
  applicationName: siteName,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "tr_TR",
    title: `${siteName} | Mücevher & Tasarım`,
    description: "Lüks pırlanta ve altın mücevher koleksiyonları.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories, uiConfig] = await Promise.all([getSettings(), getCategories(), getUiConfig()]);
  // Koleksiyonlar mega menüsündeki öne çıkan görsel: admin panelindeki ilk koleksiyon kartı
  const featuredItem = uiConfig.collectionMosaic?.items?.[0];
  const featured = featuredItem ? { image: featuredItem.image, title: featuredItem.title, link: featuredItem.link || "/koleksiyon/tum-urunler" } : null;

  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Providers siteConfig={{ showPrices: settings.showPrices }}>
          <MainLayout
            navbar={<Navbar phoneNumber={settings.phoneNumber} whatsappNumber={settings.whatsappNumber} categories={categories.filter(c => c.isActive)} featured={featured} />}
            footer={<Footer />}
            whatsapp={<FloatingWhatsapp whatsappNumber={settings.whatsappNumber} />}
          >
            {children}
          </MainLayout>
        </Providers>
        <AnalyticsTracker />
      </body>
    </html>
  );
}
