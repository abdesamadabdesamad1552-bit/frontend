import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | نقاء للتجميل الفاخر",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-white py-16 md:py-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-8">
            سياسة الخصوصية
          </h1>

          <div className="prose-sm space-y-6 text-brand-black/80 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                جمع المعلومات
              </h2>
              <p>
                نجمع المعلومات التي تقدمها لنا مباشرة عند إتمام عملية الشراء،
                بما في ذلك الاسم الكامل ورقم الهاتف. لا نطلب عنوان البريد
                الإلكتروني أو العنوان البريدي إلا عند الحاجة للتوصيل.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                استخدام المعلومات
              </h2>
              <p>نستخدم معلوماتك الشخصية فقط للأغراض التالية:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 mr-4">
                <li>معالجة وتأكيد طلبك</li>
                <li>التواصل معك بخصوص حالة التوصيل</li>
                <li>تحسين خدماتنا ومنتجاتنا</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                حماية المعلومات
              </h2>
              <p>
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير
                المصرح به أو التعديل أو الإفصاح أو الإتلاف. لا نشارك بياناتك مع
                أطراف ثالثة إلا بالقدر الضروري لإتمام عملية التوصيل.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                ملفات تعريف الارتباط
              </h2>
              <p>
                نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح
                وتحليل حركة الزوار عبر أدوات تحليلية مثل Facebook Pixel. يمكنك
                تعطيل ملفات تعريف الارتباط من إعدادات المتصفح.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brand-black mb-3">
                التواصل
              </h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا
                عبر البريد الإلكتروني:{" "}
                <a
                  href="mailto:contact@naqabeauty.shop"
                  className="text-brand-gold hover:underline"
                >
                  contact@naqabeauty.shop
                </a>
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
