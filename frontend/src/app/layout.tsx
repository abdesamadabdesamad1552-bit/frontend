import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import FlashUpsell from "@/components/FlashUpsell";
import AnalyticsPixels from "@/components/AnalyticsPixels";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "نقاء للتجميل الفاخر | Naqa Beauty",
  description:
    "تركيبات علمية بمكونات فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج. توصيل مجاني. الدفع عند الاستلام.",
  metadataBase: new URL("https://naqabeauty.store"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
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
        className={`${ibmPlexSansArabic.variable} font-arabic antialiased bg-brand-white text-brand-black`}
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
