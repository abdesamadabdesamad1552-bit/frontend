"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { countries, type CountryCode } from "@/lib/pricing";
import { useState } from "react";

const countryList = Object.values(countries);

function AnnouncementBar() {
  return (
    <div className="bg-brand-black text-brand-white text-center text-xs sm:text-sm py-2 px-3 sm:px-4">
      <span className="hidden sm:inline">توصيل مجاني لجميع دول الخليج 🚚 | الدفع عند الاستلام</span>
      <span className="sm:hidden">توصيل مجاني 🚚 | COD</span>
    </div>
  );
}

export default function Header() {
  const { state, openDrawer, setCountry, totalItems } = useCart();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const currentCountry = countries[state.country];

  return (
    <header className="sticky top-0 z-50 bg-brand-white/95 backdrop-blur-md border-b border-brand-beige-dark">
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowCountryPicker(!showCountryPicker)}
            className="text-sm text-brand-gray hover:text-brand-black transition-colors flex items-center gap-1"
          >
            {currentCountry.flag}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showCountryPicker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowCountryPicker(false)} />
              <div className="absolute top-full mt-2 right-0 bg-brand-white rounded-xl shadow-lg border border-brand-beige-dark py-2 z-20 min-w-[160px]">
                {countryList.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code as CountryCode);
                      setShowCountryPicker(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-sm hover:bg-brand-beige transition-colors flex items-center gap-3 ${
                      state.country === c.code
                        ? "text-brand-gold font-semibold"
                        : "text-brand-black"
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

        <Link href="/" className="text-center flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img src="/header-icon.png" alt="Naqa" className="w-6 h-6 object-contain" />
            <span className="text-2xl font-bold text-brand-black tracking-tight">
              نقاء
            </span>
          </div>
          <span className="text-[10px] tracking-[0.3em] text-brand-gold font-medium uppercase mt-0.5">
            NAQA BEAUTY
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/shop"
            className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors"
          >
            تسوق
          </Link>
          <button
            onClick={openDrawer}
            className="relative text-brand-black hover:text-brand-gold transition-colors"
            aria-label="السلة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-brand-gold text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
