import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "سياسة الخصوصية | نقاء للتجميل الفاخر" };

const sections = [
  {
    title: "جمع المعلومات",
    body: "نجمع المعلومات التي تقدمها لنا مباشرة عند إتمام عملية الشراء، بما في ذلك الاسم الكامل ورقم الهاتف. لا نطلب عنوان البريد الإلكتروني أو العنوان البريدي إلا عند الحاجة للتوصيل.",
  },
  {
    title: "استخدام المعلومات",
    body: "نستخدم معلوماتك الشخصية فقط لمعالجة وتأكيد طلبك، التواصل معك بخصوص حالة التوصيل، وتحسين خدماتنا ومنتجاتنا.",
  },
  {
    title: "حماية المعلومات",
    body: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. لا نشارك بياناتك مع أطراف ثالثة إلا بالقدر الضروري لإتمام عملية التوصيل.",
  },
  {
    title: "ملفات تعريف الارتباط",
    body: "نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتحليل حركة الزوار. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="خصوصيتك"
      title="سياسة الخصوصية"
      intro="نحرص على حماية بياناتك ونستخدمها فقط لما يلزم لإتمام طلبك."
      lastUpdated="آخر تحديث: يونيو 2026"
    >
      {sections.map((s) => (
        <LegalSection key={s.title} title={s.title}>
          <p>{s.body}</p>
        </LegalSection>
      ))}
      <LegalSection title="التواصل">
        <p>
          إذا كان لديك أي أسئلة، يمكنك التواصل معنا عبر:{" "}
          <a
            href="mailto:contact@naqabeauty.store"
            className="text-brand-black font-bold underline underline-offset-4 decoration-brand-beige-dark hover:decoration-brand-gold transition-colors"
          >
            contact@naqabeauty.store
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
