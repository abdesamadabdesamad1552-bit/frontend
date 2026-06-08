import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "سياسة الإرجاع والاستبدال | نقاء للتجميل الفاخر" };

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <article className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary mb-10">سياسة الإرجاع والاستبدال</h1>
          <div className="space-y-8 text-[14px] text-text-secondary leading-[1.8]">
            <div className="p-5 rounded-xl bg-gold/[0.03] border border-gold/10">
              <p className="text-[13px] font-medium text-text-primary">رضاك هو أولويتنا. إذا لم يعجبك المنتج، تواصلي معنا وسنجد الحل المناسب.</p>
            </div>
            <section>
              <h2 className="text-[15px] font-bold text-text-primary mb-3">شروط الإرجاع</h2>
              <ul className="list-disc list-inside space-y-2 mr-4 text-text-muted">
                <li>يمكن طلب الإرجاع خلال 7 أيام من تاريخ الاستلام</li>
                <li>يجب أن يكون المنتج في عبوته الأصلية وغير مستخدم</li>
                <li>المنتجات المفتوحة أو المستخدمة لا يمكن إرجاعها لأسباب صحية</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-text-primary mb-3">كيفية طلب الإرجاع</h2>
              <ol className="list-decimal list-inside space-y-2 mr-4 text-text-muted">
                <li>تواصلي معنا عبر: <a href="mailto:contact@naqabeauty.shop" className="text-gold/70 hover:text-gold transition-colors">contact@naqabeauty.shop</a></li>
                <li>اذكري رقم الطلب وسبب الإرجاع</li>
                <li>سنرد عليك خلال 24 ساعة بتعليمات الإرجاع</li>
              </ol>
            </section>
            <section>
              <h2 className="text-[15px] font-bold text-text-primary mb-3">الاستبدال</h2>
              <p>في حالة استلام منتج تالف أو خاطئ، نقوم باستبداله مجاناً. تواصلي معنا فوراً مع صورة للمنتج المستلم.</p>
            </section>
            <p className="text-[12px] text-text-faint pt-6 border-t border-glass-border">آخر تحديث: يونيو 2026</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
