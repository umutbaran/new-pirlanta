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

export const metadata: Metadata = {
  title: "New Pırlanta | Mücevher & Tasarım",
  description: "Lüks pırlanta ve altın mücevher koleksiyonları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className={`${montserrat.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <MainLayout
             navbar={<Navbar />}
             footer={<Footer />}
             whatsapp={<FloatingWhatsapp />}
          >
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
