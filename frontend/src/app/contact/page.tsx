import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "اتصل بنا | نقاء للتجميل الفاخر",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Header band */}
        <section className="bg-brand-beige border-b border-brand-beige-dark pt-16 pb-12 md:pt-20 md:pb-14">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              نحن هنا لمساعدتك
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
              تواصل معنا
            </h1>
            <p className="text-brand-gray text-base max-w-xl mx-auto leading-relaxed">
              نسعد بتواصلك معنا. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-brand-white py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="p-7 rounded-2xl bg-brand-beige border border-brand-beige-dark text-center transition-all duration-300 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe)]">
                <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-gold mb-3">
                  البريد الإلكتروني
                </h2>
                <a
                  href="mailto:contact@naqabeauty.store"
                  className="text-sm text-brand-black font-bold underline underline-offset-4 decoration-brand-beige-dark hover:decoration-brand-gold transition-colors"
                >
                  contact@naqabeauty.store
                </a>
              </div>
              <div className="p-7 rounded-2xl bg-brand-beige border border-brand-beige-dark text-center transition-all duration-300 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe)]">
                <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-gold mb-3">
                  وقت الرد
                </h2>
                <p className="text-sm text-brand-gray">خلال 24 ساعة في أيام العمل</p>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
