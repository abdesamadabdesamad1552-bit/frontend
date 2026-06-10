"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { countries, type CountryCode } from "@/lib/pricing";
import { useState, useEffect } from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";

const countryList = Object.values(countries);

export default function Header() {
  const { state, openDrawer, setCountry, totalItems } = useCart();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const currentCountry = countries[state.country];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      {!scrolled && (
        <div className="border-b border-white/[0.06] py-2 text-center text-[12px] text-white/45">
          توصيل مجاني لجميع دول الخليج · الدفع عند الاستلام
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="relative">
          <button
            onClick={() => setShowCountryPicker(!showCountryPicker)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            {currentCountry.flag}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {showCountryPicker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowCountryPicker(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 min-w-[180px] rounded-xl border border-white/[0.08] bg-[#111111] py-1 shadow-2xl">
                {countryList.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code as CountryCode);
                      setShowCountryPicker(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-right text-sm transition-colors hover:bg-white/[0.04] ${
                      state.country === c.code ? "font-semibold text-gold" : "text-white/70"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.nameAr}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="block text-[22px] font-bold leading-none text-white">نقاء</span>
          <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.35em] text-gold/70">
            Naqa Beauty
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/shop"
            className="hidden text-[13px] font-medium text-white/50 transition-colors hover:text-gold sm:block"
          >
            المجموعة
          </Link>
          <button
            onClick={openDrawer}
            className="relative p-1 text-white/50 transition-colors hover:text-gold"
            aria-label="السلة"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -left-1.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-[#0a0a0a]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
