// app/layout.tsx
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Mücevher & Tasarım`,
    template: `%s | ${siteName}`,
  },
  description: "Lüks pırlanta ve altın mücevher koleksiyonları. Ürün tanıtımları ve rehber içerikler.",
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "tr_TR",
    title: `${siteName} | Mücevher & Tasarım`,
    description: "Lüks pırlanta ve altın mücevher koleksiyonları. Ürün tanıtımları ve rehber içerikler.",
    // images: [{ url: "/og.png", width: 1200, height: 630, alt: siteName }], // og.png ekleyince aç
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Mücevher & Tasarım`,
    description: "Lüks pırlanta ve altın mücevher koleksiyonları. Ürün tanıtımları ve rehber içerikler.",
    // images: ["/og.png"], // og.png ekleyince aç
  },
  icons: {
    icon: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
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
    // logo: `${siteUrl}/logo.png`, // public/logo.png ekleyince aç
    // sameAs: ["https://instagram.com/..."] // varsa ekle
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "tr-TR",
  };

  return (
    <html lang="tr" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>

      <body className={`${montserrat.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <MainLayout navbar={<Navbar />} footer={<Footer />} whatsapp={<FloatingWhatsapp />}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
