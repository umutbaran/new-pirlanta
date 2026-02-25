// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import MainLayout from "@/components/MainLayout";
import { Providers } from "@/components/Providers";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png" }
    ],
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "tr_TR",
    title: `${siteName} | Mücevher & Tasarım`,
    description: "Lüks pırlanta ve altın mücevher koleksiyonları.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/assets/logo.png`,
  };

  return (
    <html lang="tr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className={`${montserrat.className} antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <Providers>
          <MainLayout navbar={<Navbar />} footer={<Footer />} whatsapp={<FloatingWhatsapp />}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
