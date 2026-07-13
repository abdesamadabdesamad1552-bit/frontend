import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "الشروط والأحكام | نقاء للتجميل الفاخر" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-brand-white py-16 md:py-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-10">الشروط والأحكام</h1>
          <div className="space-y-8 text-sm text-brand-black/80 leading-relaxed">
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">عام</h2>
              <p>باستخدامك لموقع naqabeauty.store، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.</p>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">الطلبات والدفع</h2>
              <ul className="list-disc list-inside space-y-2 mr-4 text-brand-gray">
                <li>جميع الأسعار معروضة بالريال السعودي ما لم يُذكر خلاف ذلك</li>
                <li>الأسعار شاملة رسوم التوصيل</li>
                <li>الدفع يتم عند الاستلام (COD) نقداً</li>
                <li>نحتفظ بحق رفض أو إلغاء أي طلب لأسباب تتعلق بالتوفر أو أخطاء في التسعير</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">التوصيل</h2>
              <ul className="list-disc list-inside space-y-2 mr-4 text-brand-gray">
                <li>التوصيل متاح لجميع دول الخليج: السعودية، الإمارات، الكويت، قطر، البحرين، عمان</li>
                <li>مدة التوصيل: 2-5 أيام عمل حسب المدينة</li>
                <li>سيتم التواصل معك هاتفياً لتأكيد الطلب وعنوان التوصيل</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">المنتجات</h2>
              <p>منتجاتنا هي مستحضرات تجميل وعناية بالبشرة والشعر. ليست أدوية أو علاجات طبية. النتائج قد تختلف من شخص لآخر.</p>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-brand-black mb-3">الملكية الفكرية</h2>
              <p>جميع المحتويات على هذا الموقع هي ملكية حصرية لنقاء للتجميل الفاخر. لا يجوز نسخها أو إعادة إنتاجها بدون إذن مسبق.</p>
            </section>
            <p className="text-xs text-brand-gray pt-6 border-t border-brand-beige-dark">آخر تحديث: يونيو 2026</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
