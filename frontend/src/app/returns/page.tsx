import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "سياسة الإرجاع والاستبدال | نقاء للتجميل الفاخر" };

export default function ReturnsPage() {
  return (
    <LegalLayout
      eyebrow="راحتك أولاً"
      title="سياسة الإرجاع والاستبدال"
      intro="رضاك هو أولويتنا — إذا لم يعجبك المنتج، تواصلي معنا وسنجد الحل المناسب."
      lastUpdated="آخر تحديث: يونيو 2026"
    >
      <div className="p-6 rounded-2xl bg-brand-beige border border-brand-beige-dark">
        <p className="text-[15px] font-medium text-brand-black leading-relaxed">
          رضاك هو أولويتنا. إذا لم يعجبك المنتج، تواصلي معنا وسنجد الحل المناسب.
        </p>
      </div>

      <LegalSection title="شروط الإرجاع">
        <ul className="space-y-2.5">
          {[
            "يمكن طلب الإرجاع خلال 7 أيام من تاريخ الاستلام",
            "يجب أن يكون المنتج في عبوته الأصلية وغير مستخدم",
            "المنتجات المفتوحة أو المستخدمة لا يمكن إرجاعها لأسباب صحية",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-brand-gray">
              <span className="text-brand-gold mt-0.5 shrink-0" aria-hidden>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="كيفية طلب الإرجاع">
        <ol className="space-y-3">
          {[
            <>
              تواصلي معنا عبر:{" "}
              <a
                href="mailto:contact@naqabeauty.store"
                className="text-brand-black font-bold underline underline-offset-4 decoration-brand-beige-dark hover:decoration-brand-gold transition-colors"
              >
                contact@naqabeauty.store
              </a>
            </>,
            "اذكري رقم الطلب وسبب الإرجاع",
            "سنرد عليك خلال 24 ساعة بتعليمات الإرجاع",
          ].map((item, i) => (
            <li key={i} className="flex gap-3.5 text-brand-gray">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold-dark text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection title="الاستبدال">
        <p>
          في حالة استلام منتج تالف أو خاطئ، نقوم باستبداله مجاناً. تواصلي معنا
          فوراً مع صورة للمنتج المستلم.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
