"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThankYouContent from "@/components/ThankYouContent";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="bg-brand-beige min-h-[60vh] py-16 flex items-center justify-center">
            <p className="text-brand-gray">جاري التحميل...</p>
          </main>
        }
      >
        <ThankYouContent />
      </Suspense>
      <Footer />
    </>
  );
}
