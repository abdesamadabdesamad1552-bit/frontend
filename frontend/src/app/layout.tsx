import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Reem_Kufi, Aref_Ruqaa, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import AnalyticsPixels from "@/components/AnalyticsPixels";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-reem",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-ruqaa",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
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
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "نقاء للتجميل الفاخر",
    title: "نقاء للتجميل الفاخر | Naqa Beauty",
    description:
      "تركيبات علمية بمكونات فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج. توصيل مجاني. الدفع عند الاستلام.",
    url: "https://naqabeauty.store",
  },
  twitter: {
    card: "summary_large_image",
    title: "نقاء للتجميل الفاخر | Naqa Beauty",
    description:
      "تركيبات علمية بمكونات فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج. توصيل مجاني. الدفع عند الاستلام.",
  },
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "نقاء للتجميل الفاخر",
  alternateName: "Naqa Beauty",
  url: "https://naqabeauty.store",
  logo: "https://naqabeauty.store/icon-512.png",
  email: "contact@naqabeauty.store",
  areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "نقاء للتجميل الفاخر",
  url: "https://naqabeauty.store",
  inLanguage: "ar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${ibmPlexSansArabic.variable} ${reemKufi.variable} ${arefRuqaa.variable} ${cormorantGaramond.variable} font-arabic antialiased bg-brand-white text-brand-black`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:bg-brand-black focus:text-brand-white focus:px-4 focus:py-3 focus:rounded-xl focus:text-sm focus:font-semibold"
        >
          تخطي إلى المحتوى الرئيسي
        </a>
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
        <AnalyticsPixels />
      </body>
    </html>
  );
}
