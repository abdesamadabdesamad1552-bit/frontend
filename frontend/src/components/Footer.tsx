import Link from "next/link";
import LogoMark from "@/components/LogoMark";

const links = {
  store: [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "تسوق" },
  ],
  policies: [
    { href: "/privacy", label: "الخصوصية" },
    { href: "/returns", label: "الإرجاع" },
    { href: "/terms", label: "الشروط" },
  ],
  contact: [
    { href: "/contact", label: "تواصل معنا", isLink: true },
    {
      href: "mailto:contact@naqabeauty.store",
      label: "contact@naqabeauty.store",
      isLink: false,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <LogoMark className="h-7 w-10 shrink-0 text-brand-gold" />
              <div className="w-px h-7 bg-brand-white/25" aria-hidden />
              <div className="flex flex-col leading-none">
                <span className="font-logo-ar text-2xl font-bold text-brand-white">نقاء</span>
                <span className="font-logo-latin mt-1 text-[10px] tracking-[0.3em] text-brand-gold font-semibold uppercase">
                  NAQA BEAUTY
                </span>
              </div>
            </div>
            <p className="text-sm text-brand-white/55 leading-[1.9] max-w-xs">
              تركيبات علمية بمكونات فعّالة — مصممة لمناخ الخليج وبشرته.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-gold mb-5">المتجر</h4>
            <ul className="space-y-3">
              {links.store.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/55 hover:text-brand-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-gold mb-5">السياسات</h4>
            <ul className="space-y-3">
              {links.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/55 hover:text-brand-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-gold mb-5">تواصل</h4>
            <ul className="space-y-3">
              {links.contact.map((item) =>
                item.isLink ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-white/55 hover:text-brand-white transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-brand-white/55 hover:text-brand-white transition-colors duration-300 break-all"
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-white/10 pt-8 flex flex-col md:flex-row-reverse items-center justify-between gap-4 text-xs text-brand-white/40">
          <div className="flex items-center gap-6">
            <span>الدفع عند الاستلام</span>
            <span className="text-brand-white/15" aria-hidden>•</span>
            <span>توصيل لجميع دول الخليج</span>
          </div>
          <p>© 2026 نقاء للتجميل الفاخر</p>
          {process.env.NEXT_PUBLIC_BUILD_SHA && (
            <p className="text-[10px] text-brand-white/20 font-mono">
              v{process.env.NEXT_PUBLIC_BUILD_SHA.slice(0, 7)}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
