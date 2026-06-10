import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "سياسة الخصوصية | نقاء للتجميل الفاخر" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-white py-16 md:py-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-10">سياسة الخصوصية</h1>
          <div className="space-y-8 text-sm text-brand-black/80 leading-relaxed">
            {[
              { title: "جمع المعلومات", body: "نجمع المعلومات التي تقدمها لنا مباشرة عند إتمام عملية الشراء، بما في ذلك الاسم الكامل ورقم الهاتف. لا نطلب عنوان البريد الإلكتروني أو العنوان البريدي إلا عند الحاجة للتوصيل." },
              { title: "استخدام المعلومات", body: "نستخدم معلوماتك الشخصية فقط لمعالجة وتأكيد طلبك، التواصل معك بخصوص حالة التوصيل، وتحسين خدماتنا ومنتجاتنا." },
              { title: "حماية المعلومات", body: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. لا نشارك بياناتك مع أطراف ثالثة إلا بالقدر الضروري لإتمام عملية التوصيل." },
              { title: "ملفات تعريف الارتباط", body: "نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتحليل حركة الزوار. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح." },
            ].map((s) => (
              <section key={s.title}>
                <h2 className="text-[15px] font-bold text-brand-black mb-3">{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">التواصل</h2>
              <p>إذا كان لديك أي أسئلة، يمكنك التواصل معنا عبر: <a href="mailto:contact@naqabeauty.store" className="text-brand-gold hover:underline transition-colors">contact@naqabeauty.store</a></p>
            </section>
            <p className="text-xs text-brand-gray pt-6 border-t border-brand-beige-dark">آخر تحديث: يونيو 2026</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
