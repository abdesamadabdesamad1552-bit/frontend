"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { countries, type CountryCode } from "@/lib/pricing";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ChevronDown, Sparkles } from "lucide-react";

const countryList = Object.values(countries);

export default function Header() {
  const { state, openDrawer, setCountry, totalItems } = useCart();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(5,5,5,0)", "rgba(5,5,5,0.85)"]
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const currentCountry = countries[state.country];

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: headerBg }}>
      {/* Announcement */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-glass-border"
          >
            <div className="flex items-center justify-center gap-2 py-2 px-4 text-[13px] text-text-muted">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>توصيل مجاني لجميع دول الخليج | الدفع عند الاستلام</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Nav */}
      <div
        className={`border-b transition-colors duration-500 ${
          scrolled
            ? "border-glass-border backdrop-blur-2xl"
            : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
          {/* Country */}
          <div className="relative">
            <button
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="text-sm text-text-muted cursor-pointer hover:text-text-secondary transition-colors flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-white/[0.03]"
            >
              {currentCountry.flag}
              <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {showCountryPicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCountryPicker(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-3 right-0 glass-strong rounded-xl shadow-2xl py-1.5 z-20 min-w-[180px]"
                  >
                    {countryList.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountry(c.code as CountryCode);
                          setShowCountryPicker(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors flex items-center gap-3 ${
                          state.country === c.code
                            ? "text-gold font-semibold"
                            : "text-text-secondary"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.nameAr}</span>
                        <span className="text-xs text-text-faint mr-auto">
                          {c.currencySymbol}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Logo */}
          <Link href="/" className="text-center group absolute left-1/2 -translate-x-1/2">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <span className="text-[22px] font-bold text-text-primary tracking-tight block leading-none">
                نقاء
              </span>
              <span className="text-[9px] tracking-[0.35em] text-gold/80 font-medium uppercase mt-0.5 block">
                NAQA BEAUTY
              </span>
            </motion.div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/shop"
              className="text-[13px] font-medium text-text-muted hover:text-gold transition-colors hidden sm:block"
            >
              المجموعة
            </Link>
            <motion.button
              onClick={openDrawer}
              className="relative text-text-muted hover:text-gold transition-colors p-1"
              aria-label="السلة"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="absolute -top-1 -left-1.5 w-[18px] h-[18px] bg-gold text-obsidian text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
