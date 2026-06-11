"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLastOrderId } from "@/lib/order-redirect";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || getLastOrderId();

  return (
    <main className="bg-brand-beige min-h-[60vh] py-16 md:py-24">
      <div className="max-w-lg mx-auto px-6 text-center">
        <span className="text-6xl block mb-6">✅</span>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-brand-gray leading-relaxed mb-6">
          شكراً لثقتك بنا. سنتواصل معك قريباً عبر الهاتف لتأكيد التوصيل.
        </p>

        {orderId && (
          <div className="inline-block bg-brand-white border border-brand-beige-dark rounded-xl px-6 py-4 mb-8">
            <p className="text-sm text-brand-gray mb-1">رقم الطلب</p>
            <p className="text-xl font-bold text-brand-gold" dir="ltr">
              {orderId}
            </p>
          </div>
        )}

        <div className="space-y-3 text-sm text-brand-gray mb-10">
          <p>✓ الدفع عند الاستلام</p>
          <p>✓ توصيل مجاني</p>
          <p>✓ فريقنا سيتصل بك خلال 24 ساعة</p>
        </div>

        <Link
          href="/shop"
          className="inline-block bg-brand-black text-brand-white font-bold px-8 py-4 rounded-xl hover:bg-brand-gold transition-colors"
        >
          متابعة التسوق
        </Link>
      </div>
    </main>
  );
}

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
