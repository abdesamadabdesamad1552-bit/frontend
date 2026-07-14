"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckoutHeader, CheckoutFooter } from "@/components/checkout/CheckoutChrome";
import { getThankYouPath, storeLastOrderId } from "@/lib/order-redirect";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15; // ~30s — webhooks are usually near-instant

function SuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [attempt, setAttempt] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/payments/status?orderId=${encodeURIComponent(orderId!)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === "paid") {
            storeLastOrderId(orderId!);
            router.replace(getThankYouPath(orderId!));
            return;
          }
        }
      } catch {
        // network hiccup — the next poll tick will retry
      }

      if (!cancelled) {
        setAttempt((a) => a + 1);
      }
    }

    if (attempt >= MAX_POLLS) {
      setTimedOut(true);
      return;
    }

    const t = setTimeout(poll, attempt === 0 ? 500 : POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [attempt, orderId, router]);

  if (!orderId) {
    return (
      <main className="bg-brand-beige min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-brand-black mb-2">رقم الطلب غير موجود</h1>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold px-9 py-3.5 rounded-full transition-all duration-300 hover:bg-brand-gold mt-6"
          >
            تسوقي المجموعة
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-beige min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full border-2 border-brand-gold/30 border-t-brand-gold animate-spin mx-auto mb-6" aria-hidden />
        <h1 className="text-xl font-bold text-brand-black mb-2">جاري تأكيد الدفع...</h1>
        <p className="text-brand-gray text-sm leading-relaxed">
          نتحقق من عملية الدفع، هذا يستغرق ثوانٍ قليلة فقط.
        </p>
        {timedOut && (
          <div className="mt-8 p-4 rounded-xl bg-brand-white border border-brand-beige-dark">
            <p className="text-sm text-brand-black/80 mb-3">
              التأكيد يستغرق وقتاً أطول من المعتاد. رقم طلبك <span dir="ltr" className="font-bold">{orderId}</span> —
              سنؤكده هاتفياً قريباً، أو تواصلي معنا مباشرة.
            </p>
            <Link href="/contact" className="text-sm font-bold text-brand-black underline underline-offset-4">
              تواصل معنا
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <CheckoutHeader />
      <Suspense fallback={<main className="bg-brand-beige min-h-[60vh]" />}>
        <SuccessInner />
      </Suspense>
      <CheckoutFooter />
    </>
  );
}
