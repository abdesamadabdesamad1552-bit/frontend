import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "الشروط والأحكام | نقاء للتجميل الفاخر" };

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="اتفاقية الاستخدام"
      title="الشروط والأحكام"
      intro="باستخدامك لمتجر نقاء فإنك توافق على الشروط التالية."
      lastUpdated="آخر تحديث: يونيو 2026"
    >
      <LegalSection title="عام">
        <p>
          باستخدامك لموقع naqabeauty.store، فإنك توافق على الالتزام بهذه الشروط
          والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.
        </p>
      </LegalSection>

      <LegalSection title="الطلبات والدفع">
        <ul className="space-y-2.5">
          {[
            "جميع الأسعار معروضة بالريال السعودي ما لم يُذكر خلاف ذلك",
            "الأسعار شاملة رسوم التوصيل",
            "الدفع يتم عند الاستلام (COD) نقداً",
            "نحتفظ بحق رفض أو إلغاء أي طلب لأسباب تتعلق بالتوفر أو أخطاء في التسعير",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-brand-gray">
              <span className="text-brand-gold mt-0.5 shrink-0" aria-hidden>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="التوصيل">
        <ul className="space-y-2.5">
          {[
            "التوصيل متاح لجميع دول الخليج: السعودية، الإمارات، الكويت، قطر، البحرين، عمان",
            "مدة التوصيل: 2-5 أيام عمل حسب المدينة",
            "سيتم التواصل معك هاتفياً لتأكيد الطلب وعنوان التوصيل",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-brand-gray">
              <span className="text-brand-gold mt-0.5 shrink-0" aria-hidden>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="المنتجات">
        <p>
          منتجاتنا هي مستحضرات تجميل وعناية بالبشرة والشعر. ليست أدوية أو علاجات
          طبية. النتائج قد تختلف من شخص لآخر.
        </p>
      </LegalSection>

      <LegalSection title="الملكية الفكرية">
        <p>
          جميع المحتويات على هذا الموقع هي ملكية حصرية لنقاء للتجميل الفاخر. لا
          يجوز نسخها أو إعادة إنتاجها بدون إذن مسبق.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
