import Link from "next/link";
import { Sparkles } from "lucide-react";

const links = {
  store: [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "المجموعة" },
  ],
  policies: [
    { href: "/privacy", label: "الخصوصية" },
    { href: "/returns", label: "الإرجاع" },
    { href: "/terms", label: "الشروط" },
  ],
  contact: [
    { href: "/contact", label: "تواصل معنا", isLink: true },
    { href: "mailto:contact@naqabeauty.shop", label: "contact@naqabeauty.shop", isLink: false },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-text-primary">نقاء</span>
              <Sparkles className="w-3.5 h-3.5 text-gold/50" />
            </div>
            <span className="text-[9px] tracking-[0.35em] text-gold/50 font-medium uppercase block mb-5">
              NAQA BEAUTY
            </span>
            <p className="text-[13px] text-text-muted leading-[1.8] max-w-[240px]">
              تركيبات علمية بمكونات فعّالة — مصممة لمناخ الخليج وبشرته.
            </p>
          </div>

          {/* Store links */}
          <div>
            <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.15em] mb-5">
              المتجر
            </h4>
            <ul className="space-y-3">
              {links.store.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-text-faint hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.15em] mb-5">
              السياسات
            </h4>
            <ul className="space-y-3">
              {links.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-text-faint hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.15em] mb-5">
              تواصل
            </h4>
            <ul className="space-y-3">
              {links.contact.map((item) =>
                item.isLink ? (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[13px] text-text-faint hover:text-gold transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <a href={item.href} className="text-[13px] text-text-faint hover:text-gold transition-colors duration-300">
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-glass-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-[11px] text-text-faint">
              {["الدفع عند الاستلام", "توصيل لجميع دول الخليج"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gold/30" />
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-text-faint">
              © 2026 نقاء للتجميل الفاخر
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
