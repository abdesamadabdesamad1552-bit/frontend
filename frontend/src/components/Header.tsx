"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Country selector */}
        <div className="relative z-[60] min-w-[44px]">
          <button
            type="button"
            onClick={() => setShowCountryPicker(!showCountryPicker)}
            aria-expanded={showCountryPicker}
            aria-haspopup="listbox"
            aria-label={`الدولة: ${currentCountry.nameAr}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-brand-beige-dark bg-brand-beige px-2.5 sm:px-3.5 py-2 text-brand-black shadow-sm transition-all hover:border-brand-gold hover:bg-brand-white hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-lg sm:text-xl leading-none" aria-hidden>
              {currentCountry.flag}
            </span>
            <span className="hidden min-[380px]:inline text-xs sm:text-sm font-bold text-brand-black max-w-[4.5rem] sm:max-w-none truncate">
              {currentCountry.nameAr}
            </span>
            <svg
              className={`w-4 h-4 shrink-0 text-brand-gold transition-transform duration-200 ${
                showCountryPicker ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showCountryPicker && (
            <>
              <div
                className="fixed inset-0 z-[55] bg-brand-black/20 sm:bg-transparent"
                onClick={() => setShowCountryPicker(false)}
                aria-hidden
              />
              <div
                role="listbox"
                aria-label="اختر الدولة"
                className="animate-dropdown absolute top-full mt-2 right-0 z-[60] w-[min(100vw-2rem,240px)] sm:w-[220px] rounded-xl border border-brand-beige-dark bg-brand-white py-1.5 shadow-xl"
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
            </>
          )}
        </div>

        {/* Logo — centered */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative h-11 w-11 sm:h-14 sm:w-14 shrink-0">
              <Image
                src="/header-icon.png"
                alt="Naqa Beauty"
                fill
                sizes="(max-width: 640px) 44px, 56px"
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-2xl sm:text-[1.75rem] font-bold text-brand-black tracking-tight">
                نقاء
              </span>
              <span className="mt-1 text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-brand-gold font-semibold uppercase">
                NAQA BEAUTY
              </span>
            </div>
          </div>
        </Link>

        {/* Nav + cart */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/shop"
            className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors"
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
