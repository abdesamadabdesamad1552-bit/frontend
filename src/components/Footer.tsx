import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-brand-white mb-1">نقاء</h3>
            <span className="text-[10px] tracking-[0.3em] text-brand-gold font-medium uppercase">
              NAQA BEAUTY
            </span>
            <p className="text-sm text-brand-white/50 mt-4 leading-relaxed">
              نقاء للتجميل الفاخر — تركيبات علمية بمكونات فعّالة بتركيزات حقيقية
              — مصممة لمناخ الخليج وبشرته.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-brand-white mb-4">المتجر</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  تسوقي
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-brand-white mb-4">
              السياسات
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  الإرجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-brand-white mb-4">
              تواصل معنا
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@naqabeauty.shop"
                  className="text-sm text-brand-white/50 hover:text-brand-gold transition-colors"
                >
                  contact@naqabeauty.shop
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-brand-white/30">
              <span className="flex items-center gap-1.5">
                <span className="text-brand-gold">✓</span> الدفع عند الاستلام
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-brand-gold">✓</span> توصيل لجميع دول
                الخليج
              </span>
            </div>
            <p className="text-sm text-brand-white/30">
              © 2026 نقاء للتجميل الفاخر — جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
