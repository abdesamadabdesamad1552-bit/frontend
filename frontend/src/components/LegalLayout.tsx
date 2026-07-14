import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  intro?: string;
  lastUpdated?: string;
  children: ReactNode;
}

/** Elegant sub-section with a gold accent heading. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-base font-bold text-brand-black mb-4">
        <span className="w-4 h-px bg-brand-gold" aria-hidden />
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/**
 * Shared luxury layout for legal / informational pages (privacy, returns,
 * terms). Gives them a consistent premium header band and reading column.
 */
export default function LegalLayout({
  eyebrow,
  title,
  intro,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Header band */}
        <section className="bg-brand-beige border-b border-brand-beige-dark pt-16 pb-12 md:pt-20 md:pb-14">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              {eyebrow}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-black">
              {title}
            </h1>
            {intro && (
              <p className="text-brand-gray text-base max-w-xl mx-auto mt-5 leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="bg-brand-white py-14 md:py-20">
          <article className="max-w-3xl mx-auto px-6">
            <div className="space-y-10 text-[15px] text-brand-black/80 leading-[1.9]">
              {children}
              {lastUpdated && (
                <p className="text-xs text-brand-gray pt-8 border-t border-brand-beige-dark">
                  {lastUpdated}
                </p>
              )}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
