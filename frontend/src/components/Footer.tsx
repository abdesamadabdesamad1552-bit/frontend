import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold block mb-1">نقاء</span>
            <span className="text-[10px] tracking-[0.3em] text-brand-gold font-medium uppercase block mb-4">
              NAQA BEAUTY
            </span>
            <p className="text-sm text-brand-white/60 leading-relaxed max-w-xs">
              تركيبات علمية بمكونات فعّالة — مصممة لمناخ الخليج وبشرته.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">المتجر</h4>
            <ul className="space-y-2">
              {links.store.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/60 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">السياسات</h4>
            <ul className="space-y-2">
              {links.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/60 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">تواصل</h4>
            <ul className="space-y-2">
              {links.contact.map((item) =>
                item.isLink ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-white/60 hover:text-brand-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-brand-white/60 hover:text-brand-gold transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-white/40">
          <div className="flex items-center gap-6">
            <span>الدفع عند الاستلام</span>
            <span>توصيل لجميع دول الخليج</span>
          </div>
          <p>© 2026 نقاء للتجميل الفاخر</p>
        </div>
      </div>
    </footer>
  );
}
