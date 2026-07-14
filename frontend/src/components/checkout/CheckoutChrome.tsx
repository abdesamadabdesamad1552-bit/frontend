import Link from "next/link";
import { Lock } from "lucide-react";
import LogoMark from "@/components/LogoMark";

export function CheckoutHeader() {
  return (
    <header className="border-b border-brand-beige-dark bg-brand-white">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="نقاء">
          <LogoMark className="h-6 w-9 text-brand-gold" />
          <div className="w-px h-6 bg-brand-black/20" aria-hidden />
          <span className="font-logo-ar text-xl font-bold text-brand-black">نقاء</span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-brand-gray">
          <Lock className="w-3.5 h-3.5 text-brand-gold-dark" strokeWidth={2.25} />
          دفع آمن ومشفّر
        </span>
      </div>
    </header>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="border-t border-brand-beige-dark bg-brand-white py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-gray">
        <p>© 2026 نقاء للتجميل الفاخر</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-brand-black transition-colors">الخصوصية</Link>
          <Link href="/returns" className="hover:text-brand-black transition-colors">الإرجاع</Link>
          <Link href="/terms" className="hover:text-brand-black transition-colors">الشروط</Link>
        </div>
      </div>
    </footer>
  );
}
