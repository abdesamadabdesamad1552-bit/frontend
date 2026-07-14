import Link from "next/link";
import type { Metadata } from "next";
import { CheckoutHeader, CheckoutFooter } from "@/components/checkout/CheckoutChrome";

export const metadata: Metadata = { title: "تم إلغاء الدفع | نقاء للتجميل الفاخر" };

export default function CheckoutCancelPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="bg-brand-beige min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-sm">
          <span className="text-5xl block mb-4" aria-hidden>↩︎</span>
          <h1 className="text-xl font-bold text-brand-black mb-2">تم إلغاء عملية الدفع</h1>
          <p className="text-brand-gray text-sm mb-8 leading-relaxed">
            لم يتم خصم أي مبلغ. سلتك ما زالت محفوظة، يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-9 py-3.5 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
            >
              المحاولة مرة أخرى
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center text-sm font-semibold tracking-wide text-brand-black border border-brand-black/15 px-9 py-3.5 rounded-full transition-all duration-300 hover:border-brand-gold hover:text-brand-gold-dark active:scale-[0.98]"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </main>
      <CheckoutFooter />
    </>
  );
}
