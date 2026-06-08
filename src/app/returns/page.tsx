import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "سياسة الإرجاع والاستبدال | نقاء للتجميل الفاخر",
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-white py-16 md:py-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-8">
            سياسة الإرجاع والاستبدال
          </h1>

          <div className="prose-sm space-y-6 text-brand-black/80 leading-relaxed">
            <div className="p-5 rounded-xl bg-brand-beige/50 border border-brand-beige-dark">
              <p className="text-sm font-medium text-brand-black">
                رضاك هو أولويتنا. إذا لم يعجبك المنتج، تواصلي معنا وسنجد الحل
                المناسب.
              </p>
            </div>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                شروط الإرجاع
              </h2>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>
                  يمكن طلب الإرجاع خلال 7 أيام من تاريخ الاستلام
                </li>
                <li>يجب أن يكون المنتج في عبوته الأصلية وغير مستخدم</li>
                <li>
                  المنتجات المفتوحة أو المستخدمة لا يمكن إرجاعها لأسباب صحية
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                كيفية طلب الإرجاع
              </h2>
              <ol className="list-decimal list-inside space-y-2 mr-4">
                <li>
                  تواصلي معنا عبر البريد الإلكتروني:{" "}
                  <a
                    href="mailto:contact@naqabeauty.shop"
                    className="text-brand-gold hover:underline"
                  >
                    contact@naqabeauty.shop
                  </a>
                </li>
                <li>اذكري رقم الطلب وسبب الإرجاع</li>
                <li>سنرد عليك خلال 24 ساعة بتعليمات الإرجاع</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                الاستبدال
              </h2>
              <p>
                في حالة استلام منتج تالف أو خاطئ، نقوم باستبداله مجاناً. تواصلي
                معنا فوراً مع صورة للمنتج المستلم.
              </p>
            </section>

            <p className="text-sm text-brand-gray pt-4 border-t border-brand-beige">
              آخر تحديث: يونيو 2026
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
