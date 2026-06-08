import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import FlashUpsell from "@/components/FlashUpsell";
import AnalyticsPixels from "@/components/AnalyticsPixels";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نقاء للتجميل الفاخر | Naqa Beauty",
  description:
    "تركيبات علمية بمكونات فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج. توصيل مجاني. الدفع عند الاستلام.",
  keywords: [
    "نقاء",
    "Naqa Beauty",
    "عناية بالبشرة",
    "سيروم فيتامين سي",
    "مستحضرات تجميل",
    "الخليج",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${inter.variable} ${ibmPlexSansArabic.variable} font-arabic antialiased bg-obsidian text-text-primary`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
          <FlashUpsell />
        </CartProvider>
        <AnalyticsPixels />
      </body>
    </html>
  );
}
