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
      <main id="main-content" className="bg-brand-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              تواصل معنا
            </h1>
            <p className="text-brand-gray leading-relaxed">
              نسعد بتواصلك معنا. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="p-6 rounded-xl bg-brand-beige border border-brand-beige-dark text-center">
              <h2 className="text-sm font-bold text-brand-black mb-2">البريد الإلكتروني</h2>
              <a
                href="mailto:contact@naqabeauty.store"
                className="text-sm text-brand-black font-bold underline underline-offset-2"
              >
                contact@naqabeauty.store
              </a>
            </div>
            <div className="p-6 rounded-xl bg-brand-beige border border-brand-beige-dark text-center">
              <h2 className="text-sm font-bold text-brand-black mb-2">وقت الرد</h2>
              <p className="text-sm text-brand-gray">خلال 24 ساعة في أيام العمل</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
