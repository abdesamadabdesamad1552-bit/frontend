"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/lib/cart-context";
import { countries, type CountryCode } from "@/lib/pricing";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const countryList = Object.values(countries);

function AnnouncementBar() {
  return (
    <div className="bg-brand-gold-dark text-brand-white text-center text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 font-medium tracking-wide">
      <span className="hidden sm:inline">توصيل مجاني لجميع دول الخليج 🚚 | الدفع عند الاستلام</span>
      <span className="sm:hidden">توصيل مجاني 🚚 | الدفع عند الاستلام</span>
    </div>
  );
}

export default function Header() {
  const { state, openDrawer, setCountry, totalItems } = useCart();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const currentCountry = countries[state.country];

  useEffect(() => {
    if (!showCountryPicker) return;

    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowCountryPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCountryPicker]);

  return (
    <header className="sticky top-0 z-50 bg-brand-white/95 backdrop-blur-md border-b border-brand-beige-dark shadow-sm">
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Country selector */}
        <div ref={pickerRef} className="relative justify-self-start z-[60]">
          <button
            type="button"
            onClick={() => setShowCountryPicker((open) => !open)}
            aria-expanded={showCountryPicker}
            aria-haspopup="listbox"
            aria-label={`الدولة: ${currentCountry.nameAr}`}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border bg-brand-white px-2.5 sm:px-3.5 py-2 text-brand-black shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-md active:scale-[0.98] ${
              showCountryPicker
                ? "border-brand-gold ring-2 ring-brand-gold/20"
                : "border-brand-gold/40"
            }`}
          >
            <span className="text-base sm:text-lg leading-none" aria-hidden>
              {currentCountry.flag}
            </span>
            <span className="text-xs sm:text-sm font-bold text-brand-black truncate max-w-[5.5rem] sm:max-w-none">
              {currentCountry.nameAr}
            </span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-brand-gold transition-transform duration-300 ease-out ${
                showCountryPicker ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
              aria-hidden
            />
          </button>

          <div
            role="listbox"
            aria-label="اختر الدولة"
            className={`absolute top-[calc(100%+0.5rem)] right-0 z-[60] w-[min(100vw-2rem,240px)] sm:w-[220px] origin-top rounded-xl border border-brand-beige-dark bg-brand-white py-1.5 shadow-xl transition-all duration-300 ease-out ${
              showCountryPicker
                ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
                : "pointer-events-none scale-95 opacity-0 -translate-y-1"
            }`}
          >
            {countryList.map((c) => {
              const isActive = state.country === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setCountry(c.code as CountryCode);
                    setShowCountryPicker(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-right text-sm transition-colors ${
                    isActive
                      ? "bg-brand-beige font-bold text-brand-gold"
                      : "font-medium text-brand-black hover:bg-brand-beige/60"
                  }`}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1">{c.nameAr}</span>
                  {isActive && (
                    <span className="text-brand-gold text-xs" aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logo — centered in grid */}
        <Link
          href="/"
          className="justify-self-center flex items-center gap-2 sm:gap-2.5 min-w-0"
        >
          <LogoMark className="h-8 w-11 sm:h-9 sm:w-12 shrink-0 text-brand-gold" />
          <div className="w-px h-7 sm:h-8 bg-brand-black/25" aria-hidden />

          <div className="flex flex-col items-start justify-center leading-none min-w-0">
            <span className="font-logo-ar text-2xl sm:text-3xl font-bold text-brand-black">
              نقاء
            </span>
            <span className="font-logo-latin mt-0.5 text-[9px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.3em] text-brand-black font-semibold uppercase">
              NAQA BEAUTY
            </span>
          </div>
        </Link>

        {/* Nav + cart */}
        <div className="justify-self-end flex items-center gap-3 sm:gap-5">
          <Link
            href="/shop"
            className="text-sm font-bold text-brand-black hover:text-brand-gold-dark transition-colors"
          >
            تسوق
          </Link>
          <button
            type="button"
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
