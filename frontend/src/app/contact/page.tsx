import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "اتصل بنا | نقاء للتجميل الفاخر",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-white py-16 md:py-24">
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
                className="text-sm text-brand-gold hover:underline"
              >
                contact@naqabeauty.store
              </a>
            </div>
            <div className="p-6 rounded-xl bg-brand-beige border border-brand-beige-dark text-center">
              <h2 className="text-sm font-bold text-brand-black mb-2">وقت الرد</h2>
              <p className="text-sm text-brand-gray">خلال 24 ساعة في أيام العمل</p>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-black mb-1.5">
                الاسم الكامل
              </label>
              <input
                id="name"
                type="text"
                placeholder="مثال: سارة أحمد"
                className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-black mb-1.5">
                الرسالة
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="اكتب رسالتك هنا..."
                className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-black text-brand-white text-base font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
